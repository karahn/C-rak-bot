"""Çırak oyunu captcha çözücü + oturum yardımcısı.

Captcha, her biri farklı transform'lu 4 kalem (polyline) glifinden oluşuyor.
Glifleri normalize edip 10 rakam prototipiyle karşılaştırıyoruz.
"""
import json, re, math, base64, urllib.request, http.cookiejar, numpy as np

try:
    import oturum as _o
    TABAN = _o.site()
except Exception:  # oturum.py yoksa eski davranış
    _o = None
    TABAN = 'https://oyunsitem.com/cirak/'

# --- rakam prototipleri (cluster temsilcileri; 0-9 sırası: 0,1,2,3,4,5,6,7,8,9) ---
PROTOTIP_SIRA = ['2', '3', '4', '0', '9', '8', '6', '5', '7', '1']
PROTOTIP_D = [
    "M1.33 3.84 L3.08 1.30 L6.66 0.76 L8.99 4.29 L7.88 6.71 L0.95 15.29 L8.68 14.99",
    "M0.78 1.85 L7.81 1.02 L8.85 3.85 L5.04 8.18 L9.17 10.84 L8.23 15.07 L1.34 13.72",
    "M7.16 14.87 L6.97 0.87 L0.99 11.18 L9.32 11.15",
    "M2.32 0.84 L7.70 0.96 L9.19 2.85 L8.94 12.79 L7.99 14.65 L1.73 14.99 L1.11 13.21 L1.18 2.75 L2.12 1.28",
    "M8.67 6.13 L6.92 7.77 L3.27 8.28 L0.79 5.09 L3.15 1.15 L6.71 0.89 L9.24 3.71 L8.71 10.14 L7.34 14.24 L2.23 14.93",
    "M4.88 7.95 L2.27 6.13 L1.96 2.92 L5.14 0.66 L7.70 3.18 L8.10 6.27 L4.80 8.01 L0.80 11.06 L1.87 13.81 L5.09 15.18 L8.29 14.16 L9.25 11.16 L5.22 8.19",
    "M7.99 0.90 L3.11 2.33 L0.65 7.70 L1.08 13.13 L2.95 15.02 L7.15 14.69 L8.92 12.26 L7.82 9.15 L3.13 8.24 L1.19 9.89",
    "M9.15 0.84 L1.87 1.00 L1.06 6.80 L7.08 6.23 L8.92 8.95 L7.81 14.34 L1.21 14.92",
    "M0.94 1.14 L9.15 1.09 L4.11 14.93 M2.90 8.07 L8.31 8.08",
    "M3.30 4.12 L6.27 1.06 L6.24 14.95 M3.25 14.77 L8.88 14.91",
]

def _pts(d):
    subs = []
    for s in [q for q in d.split('M') if q.strip()]:
        p = []
        for tok in s.replace('M', '').split('L'):
            n = re.findall(r'-?\d+\.?\d*', tok)
            if len(n) >= 2:
                p.append((float(n[0]), float(n[1])))
        subs.append(p)
    return subs

def _resample(p, n=30):
    p = np.asarray(p, float)
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(p, axis=0), axis=1))]
    if seg[-1] == 0:
        return np.repeat(p[:1], n, axis=0)
    t = np.linspace(0, seg[-1], n)
    return np.c_[np.interp(t, seg, p[:, 0]), np.interp(t, seg, p[:, 1])]

def _vec(d):
    subs = _pts(d)
    v = np.concatenate([_resample(s) for s in subs])
    v = v - v.mean(0)
    v /= (np.sqrt((v ** 2).sum(1).mean()) + 1e-9)
    return v, len(subs)

def _apply_tf(tf, pts):
    tx = ty = 0.0; rot = (0, 0, 0); sx = sy = 1.0
    for name, args in re.findall(r'(\w+)\(([^)]*)\)', tf):
        a = [float(x) for x in re.split(r'[ ,]+', args.strip()) if x]
        if name == 'translate': tx += a[0]; ty += a[1] if len(a) > 1 else 0
        elif name == 'rotate': rot = (a[0], a[1] if len(a) > 1 else 0, a[2] if len(a) > 2 else 0)
        elif name == 'scale': sx = a[0]; sy = a[1] if len(a) > 1 else a[0]
    out = []
    for x, y in pts:
        x *= sx; y *= sy
        ang, cx, cy = rot
        if ang:
            r = math.radians(ang); dx, dy = x - cx, y - cy
            x = cx + dx * math.cos(r) - dy * math.sin(r)
            y = cy + dx * math.sin(r) + dy * math.cos(r)
        out.append((x + tx, y + ty))
    return out

_PROTO = [(_vec(d), PROTOTIP_SIRA[i]) for i, d in enumerate(PROTOTIP_D)]

def rakam_tani(d):
    v, ns = _vec(d)
    best, skor = None, 1e9
    for (pv, pns), ad in _PROTO:
        if pns != ns:  # alt yol sayısı farklıysa yine de karşılaştır, ceza ekle
            pvv = pv
            ceza = 0.08
        else:
            pvv = pv
            ceza = 0.0
        n = min(len(v), len(pvv))
        dist = np.abs(v[:n] - pvv[:n]).max() + ceza
        if dist < skor:
            skor, best = dist, ad
    return best, skor

def coz(svg_metni):
    gl = re.findall(r'<path transform="([^"]+)" d="([^"]+)"', svg_metni)
    cevap, skorlar = '', []
    for t, d in gl:
        ad, s = rakam_tani(d)
        cevap += ad
        skorlar.append(round(s, 3))
    return cevap, skorlar

class Oturum:
    def __init__(self):
        self.cj = http.cookiejar.MozillaCookieJar()
        self.op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.cj))
        self.op.addheaders = [('User-Agent', 'Mozilla/5.0'), ('Accept', 'application/json')]

    def json(self, yol, veri=None):
        url = (_o.api(yol) if _o is not None else TABAN + 'api/' + yol)
        data = json.dumps(veri).encode() if veri is not None else None
        if data is not None:
            req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        else:
            req = urllib.request.Request(url)
        try:
            with self.op.open(req) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            try:
                return json.loads(e.read().decode())
            except Exception:
                return {'hata': f'HTTP {e.code}'}

    def captcha(self):
        r = self.json('dogrulama')
        m = re.match(r'data:image/([\w+]+);base64,(.*)', r['resim'], re.S)
        svg = base64.b64decode(m.group(2)).decode()
        return r['anahtar'], svg

    def coz_ve_bilgi(self):
        anahtar, svg = self.captcha()
        cevap, skor = coz(svg)
        return anahtar, cevap, skor

    def kayit(self, kullanici, sifre, il_id, ilce_id, mahalle_id, deneme=6):
        for i in range(deneme):
            anahtar, cevap, skor = self.coz_ve_bilgi()
            if max(skor) > 0.35:
                continue
            r = self.json('kayit', {
                'kullaniciAdi': kullanici, 'sifre': sifre, 'ulkeKodu': 'TR',
                'ilId': il_id, 'ilceId': ilce_id, 'mahalleId': mahalle_id,
                'dogrulamaKod': cevap, 'dogrulamaAnahtar': anahtar, 'dil': 'tr',
            })
            if 'hata' not in r:
                return r
            if 'Doğrulama' in r['hata']:
                continue
            return r
        return {'hata': 'captcha çözülemedi'}
