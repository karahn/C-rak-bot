"""Ortak oturum yardımcısı — çerez dosyası, site adresi ve bağlantı doğrulama.

Bu dosya diğer tüm botlar tarafından paylaşılır. Değiştirmen gereken tek ayar:
  AYARLAR.json → "site"  (varsayılan: https://oyunsitem.com/cirak/)

Çerez dosyası (oturum_cerez.txt) nasıl oluşur?
  - Google/Facebook ile üye olduysan: python3 cerez_aktar.py   (şifre gerekmez)
  - Oyunda şifren varsa:              python3 giris.py         (captcha otomatik çözülür)

Durum kodları (baglanti() döner):
  ok        → çerez geçerli, (oyuncu sözlüğü döner)
  cerez_yok → oturum_cerez.txt yok
  gecersiz  → çerez var ama sunucu kabul etmedi (süresi dolmuş → yenisini taşı)
  ag        → siteye ulaşılamadı (internet/DNS sorunu; çerez suçlu değil)
"""
import json, os, http.cookiejar, urllib.parse, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
AYAR_DOSYASI = os.path.join(HERE, 'AYARLAR.json')
CEREZ_DOSYASI = os.path.join(HERE, 'oturum_cerez.txt')
VARSAYILAN_SITE = 'https://oyunsitem.com/cirak/'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'


def ayarlar():
    """AYARLAR.json'u güvenle okur (yoksa/bozuksa boş sözlük).

    Dosya yoksa ama AYARLAR.json.example varsa, onu kopyalayıp şablonu oluşturur.
    Böylece şifre içerebilen AYARLAR.json sürüm kontrolüne girmek zorunda kalmaz."""
    ornek = AYAR_DOSYASI + '.example'
    if not os.path.exists(AYAR_DOSYASI) and os.path.exists(ornek):
        try:
            import shutil
            shutil.copyfile(ornek, AYAR_DOSYASI)
        except Exception:
            pass
    try:
        with open(AYAR_DOSYASI, encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def ayar(ad, varsayilan=''):
    """Önce ortam değişkeni (CIKRA_SITE gibi), sonra AYARLAR.json, sonra varsayılan."""
    v = os.environ.get('CIKRA_' + ad.upper())
    if v in (None, ''):
        v = ayarlar().get(ad)
    return varsayilan if v in (None, '') else v


def site():
    """API kökü — her zaman '/' ile biter."""
    return str(ayar('site', VARSAYILAN_SITE)).strip().rstrip('/') + '/'


def sunucu():
    """Çerezin yazılacağı alan adı (port olmadan): oyunsitem.com"""
    return urllib.parse.urlsplit(site()).hostname or ''


def guvenli_mi():
    """Site https mi? çerez dosyasındaki 'secure' bayrağı buna göre yazılır."""
    return urllib.parse.urlsplit(site()).scheme == 'https'


def api(yol=''):
    """API adresi: api('durum') → https://oyunsitem.com/cirak/api/durum"""
    return site() + 'api/' + yol


def cerez_var():
    return os.path.exists(CEREZ_DOSYASI) and os.path.getsize(CEREZ_DOSYASI) > 40


def op_yukle(yol=None):
    """Çerez dosyasını yükleyip hazır bir urllib opener döndürür."""
    cj = http.cookiejar.MozillaCookieJar(yol or CEREZ_DOSYASI)
    cj.load(ignore_discard=True, ignore_expires=True)
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [('User-Agent', UA), ('Referer', site()), ('Accept', 'application/json')]
    return op, cj


def istek(op, yol, veri=None, deneme=3, bekle=4, timeout=25):
    """JSON istek — 429'da bekler, ağ hatalarında tekrar dener."""
    import time
    data = json.dumps(veri).encode() if veri is not None else None
    req = urllib.request.Request(api(yol), data=data,
                                 headers={'Content-Type': 'application/json'} if data else {})
    son = {'hata': 'istek başarısız'}
    for _ in range(max(1, deneme)):
        try:
            with op.open(req, timeout=timeout) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(40)
                continue
            try:
                return json.loads(e.read().decode())
            except Exception:
                return {'hata': 'HTTP %d' % e.code}
        except Exception as e:
            son = {'hata': str(e)[:160]}
            time.sleep(bekle)
    return son


def baglanti(op=None):
    """Oturumu doğrular → (durum, oyuncu_sözlüğü veya mesaj)."""
    if not cerez_var():
        return 'cerez_yok', 'oturum_cerez.txt bulunamadı'
    if op is None:
        try:
            op, _ = op_yukle()
        except Exception as e:
            return 'gecersiz', 'çerez dosyası okunamadı: %s' % str(e)[:100]
    try:
        with op.open(api('durum'), timeout=20) as r:
            d = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            return 'gecersiz', 'sunucu oturumu kabul etmedi (HTTP %d)' % e.code
        return 'ag', 'HTTP %d' % e.code
    except Exception as e:
        return 'ag', str(e)[:140]
    o = d.get('oyuncu') if isinstance(d, dict) else None
    if isinstance(o, dict) and o.get('kullaniciAdi'):
        return 'ok', o
    if isinstance(d, dict) and d.get('hata'):
        return 'gecersiz', str(d['hata'])[:140]
    return 'gecersiz', 'yanıt geldi ama oyuncu bilgisi yok'
