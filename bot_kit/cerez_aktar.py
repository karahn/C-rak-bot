"""Çerez Aktar — Google / Facebook ile üye olanlar için ŞİFRESİZ kurulum.

Tarayıcıda çerezini kopyala, bu scripti çalıştır, bota yapıştır. Hepsi bu.

KULLANIM (en kolay):
    python3 cerez_aktar.py
    → "Çerezi yapıştır:" der, sen kopyaladığın değeri yapıştırıp Enter'a basarsın.

KULLANIM (tek satır):
    python3 cerez_aktar.py "YAPISTIRILAN_DEGER"
    (Windows:  python cerez_aktar.py "YAPISTIRILAN_DEGER")

Tarayıcıdan ne kopyalanacak? (üçü de olur, script hepsini anlar)
  A) F12 → Application (Uygulama) → Cookies → <site>
     Oturum çerezine (örn. tezgah_oturum) sağ tık → "Değeri kopyala".
  B) Network sekmesi → herhangi bir istek → Request Headers → "cookie"
     satırının tamamını kopyala (tezgah_oturum=...; digeri=...).
  C) Konsol (Console):  document.cookie
     çıktısını kopyala.

Not: Çerez ~30 gün geçerlidir; süresi dolunca aynı adımı tekrarla.
En kalıcı yol ise oyun içinden şifre belirlemektir:
         Hesabım → 🔑 Şifre belirle → sonra giris.py bu şifreyle çalışır.
"""
import sys
import time

from oturum import CEREZ_DOSYASI, ayar, baglanti, sunucu, guvenli_mi

VARSAYILAN_AD = 'tezgah_oturum'   # tarayıcıdaki oturum çerez adı
MIN_UZUNLUK = 20


def cerezleri_coz(ham):
    """Yapıştırılan metinden (ad, değer) çiftlerini çıkarır."""
    ham = (ham or '').strip().strip('"').strip("'")
    if not ham:
        return []
    # "cookie: ..." gibi bir başlık kopyalanmışsa cookie kısmını al
    d = ham.lower()
    if d.startswith('cookie:'):
        ham = ham.split(':', 1)[1].strip()
    # En baştaki "ad=" tekrarını at (sağ tık → değeri kopyala zaten sadece değer verir)
    if '=' not in ham:
        return [(VARSAYILAN_AD, ham.strip())]
    ciftler = []
    for parca in ham.split(';'):
        parca = parca.strip()
        if not parca or '=' not in parca:
            continue
        ad, deger = parca.split('=', 1)
        ad, deger = ad.strip(), deger.strip().strip('"')
        if ad and deger:
            ciftler.append((ad, deger))
    return ciftler


def yaz(ciftler):
    alan = sunucu()
    if not alan:
        print('! AYARLAR.json içindeki "site" adresi okunamadı.')
        return False
    guvenli = 'TRUE' if guvenli_mi() else 'FALSE'
    satirlar = ['# Netscape HTTP Cookie File',
                '# http://curl.haxx.se/rfc/cookie_spec.html',
                '# cerez_aktar.py oluşturdu — kopyalama/yapıştırma oturumu',
                '']
    bitis = int(time.time()) + 30 * 24 * 3600
    for ad, deger in ciftler:
        satirlar.append('%s\tFALSE\t/\t%s\t%d\t%s\t%s' % (alan, guvenli, bitis, ad, deger))
    satirlar.append('')
    with open(CEREZ_DOSYASI, 'w', encoding='utf-8') as f:
        f.write('\n'.join(satirlar))
    return True


def dogrula():
    durum, veri = baglanti()
    if durum == 'ok':
        ek = ''
        try:
            ek = ' (seviye %s)' % veri.get('seviye')
        except Exception:
            pass
        print('✅ BAĞLANTI BAŞARILI: %s%s' % (veri.get('kullaniciAdi'), ek))
        print('Şimdi botları başlat:  bash basla.sh   (Windows: basla.bat)')
        return True
    if durum == 'gecersiz':
        print('! Çerez kaydedildi ama sunucu kabul etmedi: %s' % veri)
        print('  Tarayıcıdan YENİ bir çerez kopyala (eski olabilir) ve tekrar dene.')
        print('  İpucu: oturum çerezini (adını değil, DEĞERİNİ) kopyaladığından emin ol.')
        return False
    print('! Çerez kaydedildi ama bağlantı doğrulanamadı: %s' % veri)
    print('  İnternet/DNS sorunu olabilir — bot yine de çalışmayı deneyecektir.')
    return None


def main():
    ham = ' '.join(sys.argv[1:]).strip()
    if not ham:
        print('Çerez yapıştırma sihirbazı — site: %s' % ayar('site'))
        print('(Boş bırakıp Enter\'a basarsan iptal olur.)')
        print('')
        try:
            ham = input('Çerezi yapıştır: ').strip()
        except (EOFError, KeyboardInterrupt):
            ham = ''
        print('')
    if not ham:
        print('İptal edildi. Kullanım:  python3 cerez_aktar.py "<çerez değeri>"')
        print(__doc__)
        return 1

    ciftler = cerezleri_coz(ham)
    if not ciftler:
        print('! Geçerli bir çerez bulunamadı. Değeri eksiksiz kopyaladığından emin ol.')
        return 1
    kisa = [ad for ad, deger in ciftler if len(deger) < MIN_UZUNLUK]
    if kisa and len(ciftler) == 1:
        print('! Değer çok kısa görünüyor (%d karakter). Doğru kopyaladığından emin ol.' % len(ciftler[0][1]))
        return 1

    if not yaz(ciftler):
        return 1
    print('oturum_cerez.txt yazıldı ✓ (%s) — bağlantı deneniyor...' % ', '.join(ad for ad, _ in ciftler))
    sonuc = dogrula()
    return 0 if sonuc else 1


if __name__ == '__main__':
    sys.exit(main())
