"""ŞAMPİYON v2 — haftalık mini oyun sıralaması koşusu (KALDIĞI YERDEN DEVAM EDER).

Durum dosyası: sampiyon_durum.json {faz1:[oynanan kodlar], faz2:n, bitti:bool}
Süpervizör altında çalışır: sandbox uykudan dönünce otomatik sürer.

Faz 1: 26 oyun (misir dışı; o zaten 100 aldı) — hedef puanlarla, gerçek süre beklenir
Faz 2: 22 para tekrarı → toplam 50 oyun başarımı (+10.000₺)
Mekanik: sunucu oyun SÜRESİNİ doğrular; Para Yağmuru ayrıca 'tik' (balon ispatı) ister.
Log: sampiyon_log.jsonl
"""
import importlib.util, json, os, time, math, random

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
_spec = importlib.util.spec_from_file_location('vc', os.path.join(HERE, 'veri_cek.py'))
vc = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(vc)

STATE = 'sampiyon_durum.json'


def yukle():
    try:
        s = json.load(open(STATE))
        s.setdefault('faz1', []); s.setdefault('faz2', 0); s.setdefault('bitti', False)
        return s
    except Exception:
        return {'faz1': [], 'faz2': 0, 'bitti': False}


def kaydet(s):
    tmp = STATE + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(s, f, ensure_ascii=False)
    os.replace(tmp, STATE)


def logla(k):
    with open('sampiyon_log.jsonl', 'a') as f:
        f.write(json.dumps({'t': int(time.time()), **k}, ensure_ascii=False) + '\n')


# ---------- sunucuyla birebir: tohumlu üretici + Para Yağmuru balonları ----------
def imul(x, y): return ((x & 0xFFFFFFFF) * (y & 0xFFFFFFFF)) & 0xFFFFFFFF


def mulberry(tohum):
    a = [tohum & 0xFFFFFFFF]
    def r():
        a[0] = (a[0] + 0x6d2b79f5) & 0xFFFFFFFF
        t = (a[0] ^ (a[0] >> 15)) & 0xFFFFFFFF
        t = imul(t, (1 | a[0]) & 0xFFFFFFFF)
        t = (((t + imul((t ^ (t >> 7)) & 0xFFFFFFFF, (61 | t) & 0xFFFFFFFF)) & 0xFFFFFFFF) ^ t) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return r


def jround(x): return math.floor(x + 0.5)


def para_balonlari(r):
    l = []
    for i in range(42):
        x = r()
        deger = -20 if x < 0.12 else 5 if x < 0.5 else 10 if x < 0.88 else 50
        l.append({'t': jround(r() * 8800), 'x': jround(8 + r() * 84), 'deger': deger, 'hiz': 0.75 + r() * 0.6})
    l.sort(key=lambda b: b['t'])
    return [dict(b, i0=i) for i, b in enumerate(l)]


def para_plan(tohum, yuzde=100):
    """İstenen yüzdeye göre tik (yakalanan balon dizinleri) + puan."""
    bal = para_balonlari(mulberry(tohum))
    poz = [b for b in bal if b['deger'] > 0]
    enCok = sum(b['deger'] for b in poz)
    hedef = enCok * yuzde / 100.0
    sec = poz[:]
    random.shuffle(sec)
    while sum(b['deger'] for b in sec) > hedef and len(sec) > 1:
        sec.pop()
    tik = sorted(b['i0'] for b in sec)
    puan = round(100 * sum(b['deger'] for b in sec) / enCok)
    return tik, min(100, puan)


# oyun süreleri (kaynaktan; +2-3 sn pay) — gunluk_bot da kullanır
SURELER = {'para': 11, 'misir': 17, 'trafik': 20, 'guvercin': 17, 'doner': 17, 'marti': 30, 'zabita': 17,
           'simit': 47, 'cay': 32, 'ayran': 47, 'pide': 32, 'tost': 18, 'terazi': 47, 'pazarlik': 32,
           'dondurma': 37, 'hamal': 22, 'lunapark': 22, 'ucle': 62, 'lokum': 62, 'hafiza': 62,
           'kebap': 77, 'okey': 62, 'boru': 77, 'dolmus': 47, 'kayan': 92, 'golge': 47, 'kasa': 52}

# (kod, hedef puan) — 10'u 100 (mukemmel sayısı) + değişken elit skorlar
OYUNLAR = [('para', 100), ('trafik', 70), ('guvercin', 100), ('doner', 88), ('marti', 100), ('zabita', 100),
           ('simit', 66), ('cay', 100), ('ayran', 80), ('pide', 85), ('tost', 100), ('terazi', 78),
           ('pazarlik', 82), ('dondurma', 100), ('hamal', 70), ('lunapark', 88), ('ucle', 100),
           ('lokum', 72), ('hafiza', 100), ('kebap', 84), ('okey', 100), ('boru', 74), ('dolmus', 85),
           ('kayan', 64), ('golge', 90), ('kasa', 80)]

FAZ2_HEDEF = 22


def oyna(op, kod, hedef, ek_bekle=0):
    try:
        b = vc.cek(op, 'mini-oyun/basla', {'kod': kod, 'antrenman': True})
    except Exception as ex:
        b = {'hata': repr(ex)[:100]}
    if not b or b.get('hata'):
        time.sleep(15)
        try:
            b = vc.cek(op, 'mini-oyun/basla', {'kod': kod, 'antrenman': True})
        except Exception as ex:
            return {'kod': kod, 'hata': repr(ex)[:100]}
    if not b or b.get('hata') or not b.get('id'):
        return {'kod': kod, 'hata': str(b)[:100]}
    veri = {'id': b['id'], 'jeton': b.get('jeton'), 'puan': hedef}
    if kod == 'para':
        tik, puan = para_plan(b['tohum'], 100 if hedef >= 100 else random.randint(84, 96))
        veri['tik'] = tik; veri['puan'] = puan
    time.sleep(SURELER.get(kod, 30) + ek_bekle)
    try:
        r = vc.cek(op, 'mini-oyun/bitir', veri) or {}
    except Exception as ex:
        time.sleep(5)
        try:
            r = vc.cek(op, 'mini-oyun/bitir', veri) or {}
        except Exception as ex2:
            r = {'hata': repr(ex2)[:100]}
    return {'kod': kod, 'hedef': veri['puan'], 'donen': r.get('puan'),
            'odul': r.get('odul'), 'rekor': (r.get('rekor') or {}),
            'basarim': [x.get('ad') for x in (r.get('basarimlar') or [])], 'bakiye': r.get('bakiye')}


def ozet(op):
    try:
        mo = vc.cek(op, 'mini-oyun') or {}
        return {'ist': (mo.get('basarim') or {}).get('ist'), 'benim': (mo.get('hafta') or {}).get('benim')}
    except Exception as ex:
        return {'hata': repr(ex)[:80]}


def main():
    op = vc.oturum()[0]
    s = yukle()
    logla({'olay': 'basladi', 'faz1': len(s['faz1']), 'faz2': s['faz2'], 'bitti': s['bitti']})
    print('ŞAMPİYON: faz1 %d/%d · faz2 %d/%d · bitti=%s' % (len(s['faz1']), len(OYUNLAR), s['faz2'], FAZ2_HEDEF, s['bitti']), flush=True)
    if not s['bitti']:
        # ---- FAZ 1 ----
        basarisiz = []
        for kod, hedef in OYUNLAR:
            if kod in s['faz1']:
                continue
            r = oyna(op, kod, hedef)
            if not (r.get('donen') or 0):
                time.sleep(5)
                r = oyna(op, kod, hedef, ek_bekle=8)
            if (r.get('donen') or 0) > 0:
                s['faz1'].append(kod); kaydet(s)
                logla({'faz': 1, **r})
            else:
                basarisiz.append((kod, hedef))
                logla({'faz': 1, 'basarisiz': True, **r})
            print('%s -> %s' % (kod, r.get('donen')), flush=True)
            time.sleep(2)
        for kod, hedef in basarisiz:   # ikinci tur
            r = oyna(op, kod, hedef, ek_bekle=10)
            if (r.get('donen') or 0) > 0:
                s['faz1'].append(kod); kaydet(s)
            logla({'faz': 1, 'tekrar': True, **r})
            print('%s (tekrar) -> %s' % (kod, r.get('donen')), flush=True)
        o = ozet(op)
        logla({'olay': 'faz1_bitti', **o})
        print('FAZ1:', json.dumps(o, ensure_ascii=False), flush=True)
        # ---- FAZ 2 ----
        while s['faz2'] < FAZ2_HEDEF and len(s['faz1']) >= len(OYUNLAR):
            r = oyna(op, 'para', 100)
            if (r.get('donen') or 0) > 0:
                s['faz2'] += 1; kaydet(s)
            logla({'faz': 2, 'i': s['faz2'], **r})
            print('para #%d -> %s' % (s['faz2'], r.get('donen')), flush=True)
            time.sleep(1)
        if len(s['faz1']) >= len(OYUNLAR) and s['faz2'] >= FAZ2_HEDEF:
            s['bitti'] = True; kaydet(s)
    o = ozet(op)
    logla({'olay': 'bitti' if s['bitti'] else 'yarim', **o})
    print('SON:', json.dumps(o, ensure_ascii=False), flush=True)
    if not s['bitti']:
        time.sleep(180)   # yarım kaldıysa: süpervizör 8 sn sonra yeniden başlatır, kaldığı yerden sürer
        return
    while True:           # bitti: süpervizör yeniden başlatmasın diye uyku
        time.sleep(3600)


if __name__ == '__main__':
    main()
