"""Giriş — oturumu açar ve çerezleri oturum_cerez.txt dosyasına kaydeder.

İKİ YOL VAR, otomatik seçilir:

  1) Çerez yolu (Google / Facebook ile üye olduysan bu):
     oturum_cerez.txt geçerliyse hiçbir şey sorulmaz, doğrudan devam edilir.
     Dosya yoksa ya da süresi dolduysa:
         python3 cerez_aktar.py        (tarayıcıdan çerezi kopyala-yapıştır)

  2) Şifre yolu (oyunda şifren varsa):
         AYARLAR.json → {"kullanici": "...", "sifre": "..."}
     ya da:  python3 giris.py kullanici sifre
     Captcha (4 rakam) otomatik çözülür.

Kullanım:  python3 giris.py
Sonra:     python3 -u supervizor.py        (botları başlatır)
"""
import importlib.util, os, sys

import oturum

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)


def yukle_cozucu():
    spec = importlib.util.spec_from_file_location('cozucu', os.path.join(HERE, 'cozucu.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def google_yardim():
    print('')
    print('=' * 62)
    print('Bu hesapta oyun şifresi yok — Google/Facebook ile üye olmuşsun.')
    print('Çözüm (şifre GEREKMEZ):')
    print('')
    print('  1) Bilgisayarda oyunu aç ve Google ile giriş yap.')
    print('  2) F12 → Application (Uygulama) → Cookies → %s' % oturum.site().rstrip('/'))
    print('     Oturum çerezine (örn. tezgah_oturum) sağ tık → kopyala.')
    print('     Kısayol: Network sekmesinde isteğin "cookie" başlığını da kopyalayabilirsin.')
    print('  3) Şu komutu çalıştır:')
    print('')
    print('         python3 cerez_aktar.py')
    print('')
    print('     (Windows:  python cerez_aktar.py)')
    print('')
    print('  Script çerezi kaydeder ve bağlantıyı doğrular ("BAĞLANTI BAŞARILI: ...").')
    print('  Sonra normal şekilde:  bash basla.sh   (Windows: basla.bat)')
    print('')
    print('Alternatif (daha kalıcı): Oyunda Hesabım → 🔑 Şifre belirle → yeni şifreyi')
    print('AYARLAR.json içine yaz. Google bağlantın bozulmaz.')
    print('=' * 62)


def bilgiler():
    kullanici = sifre = ''
    if len(sys.argv) >= 3:
        kullanici, sifre = sys.argv[1].strip(), sys.argv[2].strip()
    else:
        a = oturum.ayarlar()
        kullanici = str(a.get('kullanici') or '').strip()
        sifre = str(a.get('sifre') or '').strip()
    if kullanici in ('KULLANICI_ADIN', 'KULLANICI_ADI'):
        kullanici = ''
    if sifre in ('SIFREN', 'SIFRE'):
        sifre = ''
    return kullanici, sifre


def main():
    # --- 1) Önce kayıtlı çerez: Google ile girenler için normal yol ---
    durum, veri = oturum.baglanti()
    if durum == 'ok':
        print('OK Oturum zaten geçerli: %s — çerez ile giriliyor, kullanıcı adı/şifre sorulmadı.'
              % veri.get('kullaniciAdi'))
        return 0
    if durum == 'gecersiz':
        print('i Kayıtlı çerez artık geçerli değil (%s).' % veri)
    elif durum == 'ag':
        print('i Dikkat: siteye ulaşılamadı (%s). Çerez doğrulanamadı, yine de deneniyor.' % veri)

    # --- 2) Şifre varsa captcha ile giriş ---
    kullanici, sifre = bilgiler()
    if not kullanici or not sifre:
        google_yardim()
        return 1

    cozucu = yukle_cozucu()
    o = cozucu.Oturum()
    for deneme in range(1, 9):
        anahtar, cevap, skor = o.coz_ve_bilgi()
        if skor and max(skor) > 0.35:
            print('captcha belirsiz (skor %s), yenisi deneniyor...' % max(skor))
            continue
        r = o.json('giris', {'kullaniciAdi': kullanici, 'sifre': sifre,
                             'dogrulamaKod': cevap, 'dogrulamaAnahtar': anahtar})
        if 'hata' not in r:
            o.cj.save(oturum.CEREZ_DOSYASI, ignore_discard=True, ignore_expires=True)
            ad = kullanici
            try:
                ad = (r.get('oyuncu') or {}).get('kullaniciAdi') or kullanici
            except Exception:
                pass
            print('OK Giriş başarılı: %s — çerezler oturum_cerez.txt dosyasına kaydedildi.' % ad)
            return 0
        print('deneme %d: %s' % (deneme, str(r.get('hata'))[:120]))
    print('X Giriş yapılamadı. Bilgileri ve interneti kontrol et.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
