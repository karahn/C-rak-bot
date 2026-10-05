# 🤖 Çırak Botları — Kurulum Kılavuzu

Benim hesabımda çalışan **aynı bot ailesi** — senin hesabına (Karahan) kurmak için hazır paket.
Süpervizör + 7 bot: tezgâh işleri, sokak olayları, keyif, rapor+mesaj, günlük ödüller ve mini oyun şampiyonu.

---

## 0) Pakette ne var?

| Dosya | İş |
|---|---|
| `oturum.py` | Ortak oturum yardımcısı: çerez dosyası, site adresi, bağlantı doğrulama |
| `cerez_aktar.py` | **Google/Facebook ile üye olanlar için:** tarayıcı çerezini bota taşır (şifre gerekmez) |
| `giris.py` | Oturumu hazırlar: geçerli çerez varsa hiçbir şey sormaz; yoksa kullanıcı adı/şifre ile captcha'yı **otomatik çözer** |
| `supervizor.py` | Tüm botları tek süreçte çalıştırır; düşeni 3 sn'de yeniden başlatır |
| `grind4.py` | Tezgâhlarını işler, hasadı toplar |
| `sokak_bot.py` | Mahalle olaylarını yakalar + günlük görev ödülünü alır |
| `musteri_logger.py` | Bir dükkânın müşteri/ciro verisini kaydeder (dükkân no: `ISLETME`) |
| `keyif_bot.py` | Keyfi >80'de tutar (3 saatte bir 3x yürüyüş), uygun davetleri kabul eder |
| `rapor_bot.py` | 4 saatte bir DM raporu + mesaj izleme (alıcı: `RAPOR_ALICI`) |
| `gunluk_bot.py` | Günlük bonus, sezon, şans oyunları, oyun davetleri, oda eğitimi |
| `sampiyon.py` | Haftalık mini oyun sıralaması koşusu |
| `hizli.py` | Tek satır durum: kasa, vergi, TP, botlar |

---

## 1) Ne gerekiyor?

- **Python 3.10+** çalışan bir cihaz (Windows / Mac / Linux; Android'de Termux ile olur)
- Botların **çalışmaya devam etmesi** için cihazın açık kalması (uyuyan laptop = duran bot)
- Bir oturum kaynağı: **Google/Facebook ile üye olduysan → tarayıcı çerezi** (bkz. aşağıdaki bölüm);
  **oyun şifren varsa → kullanıcı adı + şifre**
- `numpy` (yalnızca şifreli giriş/captcha için gerekir — çerez yoluyla hiç lazım olmaz)

---

## 2) Windows (PC) — 6 adım

1. https://python.org/downloads → Python 3.12 indir; kurarken **"Add python.exe to PATH"** kutusunu İŞARETLE.
2. `bot_kit` klasörünü örn. `C:\bot_kit` içine çıkart (zip'i sağ tık → Tümünü ayıkla).
3. Başlat → `cmd` yaz, aç. Şu komutu yaz:
   ```
   cd C:\bot_kit
   pip install -r requirements.txt
   ```
4. `AYARLAR.json` dosyasını Not Defteri ile aç.
   - **Google/Facebook ile üye olduysan:** `kullanici` ve `sifre` alanlarını **boş bırak**;
     bu adımı atla ve aşağıdaki "Google ile üye olduysan" bölümünü uygula (çerez taşıma).
   - **Oyun şifren varsa:** doldur ve kaydet:
     ```json
     { "site": "https://oyunsitem.com/cirak/", "kullanici": "Karahan", "sifre": "SIFREN" }
     ```
   *(Bu dosya şifreni içerir — kimseyle paylaşma!)*
5. `basla.bat` dosyasına çift tıkla. "OK Giriş başarılı" yazısını görürsen giriş tamam.
6. Botlar çalışmaya başlar; **pencereyi kapatma** (küçültebilirsin). Durumu görmek için başka bir cmd'de:
   ```
   cd C:\bot_kit
   python hizli.py
   ```

## 3) Mac / Linux — 4 adım

1. Klasörü çıkart, terminal aç, içine gir: `cd ~/bot_kit`
2. `python3 -m pip install -r requirements.txt`
3. `AYARLAR.json`'u düzenle (TextEdit/nano)
4. `bash basla.sh` → botlar arka planda başlar. Durum: `tail -f supervizor_log.txt`

## 4) Android telefon (Termux) — çalışır ama sabır ister

1. **F-Droid**'den Termux kur (Play Store'daki sürüm eski).
2. Termux'ta:
   ```
   pkg update && pkg install python -y
   pip install numpy
   ```
3. `bot_kit` dosyalarını telefona kopyala (zip'i indir, Termux'ta: `termux-setup-storage`, sonra `cd storage/downloads && unzip bot_kit.zip`).
4. `cd bot_kit && nano AYARLAR.json` → (Google ile girenler boş bırakır; oyun şifresi
   olanlar kullanıcı adı/şifreyi yazar). Google ile girdiysen: `python3 cerez_aktar.py`
   ile çerezi taşı (Ctrl+O kaydet, Ctrl+X çık).
5. `termux-wake-lock` (ekran kapansa da uyumasın) → `bash basla.sh`
6. **Önemli:** Telefon şarjda kalsın; Ayarlar → Pil → Termux için "kısıtlama yok".

⚠️ **iPhone'da olmaz** — iOS arka planda Python çalıştırmaz. Alternatif: PC'de çalıştır, iPhone'dan sadece sonuçlara bak.

## 5) 7/24 kesintisiz istersen

| Seçenek | Not |
|---|---|
| Evdeki eski laptop / mini PC | Priz + uyku modunu kapat → en kolay |
| Raspberry Pi | Çok uygun (~elektrik masrafı yok gibi) |
| Ucuz VPS (≈4-5 $/ay) | İnternetteki sanal makine; benim sistemim de böyle bir bulutta çalışıyor |


---

## 📱➡️🖥️ Google (veya Facebook) ile üye olduysan — ŞİFRE GEREKMEZ

Google/Facebook ile giren hesaplarda oyunun bir **şifresi olmaz**; bu yüzden bot sana
kullanıcı adı/şifre soramaz. Yeni sürüm otomatik olarak çerez yolunu kullanır:

1. Bilgisayarda oyunu aç, **Google ile giriş yap**.
2. Çerezini kopyala — en pratiği: `F12` → **Application** (Uygulama) → **Cookies** →
   site adresi → oturum çerezine (örn. `tezgah_oturum`) sağ tık → **"Değeri kopyala"**.
   *(Alternatif: Network sekmesindeki bir isteğin `cookie` başlığını ya da konsolda
   `document.cookie` çıktısını kopyalayabilirsin — üçünü de script anlar.)*
3. Klasörde şunu çalıştır — sana "Çerezi yapıştır:" diye sorar, yapıştırıp Enter'a bas:
   ```
   python3 cerez_aktar.py
   ```
   Tek satırda da verebilirsin: `python3 cerez_aktar.py "YAPISTIRILAN_DEGER"`
   Script `oturum_cerez.txt` dosyasını oluşturur ve bağlantıyı **doğrular**:
   `✅ BAĞLANTI BAŞARILI: Karahan`.
4. Sonra normal şekilde `basla.sh` / `basla.bat` ile botları başlat.
   Başlatıcı artık `giris.py`'yi çağırır; çerez geçerliyse **kullanıcı adı/şifre hiç sorulmaz**
   ve doğrudan botlar başlar.

> ⏳ Çerez ~30 gün geçerlidir. Süresi dolunca bot "çerez artık geçerli değil" der —
> sadece 2-3. adımları tekrarla (yeni çerez taşı).

### Alternatif — Oyunda şifre belirle (en kalıcı yol)
Oyun bunu destekliyor: **Hesabım → 🔑 Şifre belirle** (eski şifre sorulmaz).
Sonra `AYARLAR.json` içine yaz, bot çerez bittiğinde otomatik bu şifreyle girer:
```json
{ "kullanici": "Karahan", "sifre": "yeni_belirledigin_sifre" }
```
Google bağlantın aynen kalır, hiçbir şey bozulmaz.

## 6) Ayarlar (isteğe bağlı)

Botlar ortam değişkeniyle ayarlanır (Windows: `set AD=deger` · Mac/Linux: `export AD=deger`):

| Değişken | Ne işe yarar | Varsayılan |
|---|---|---|
| `RAPOR_ALICI` | DM raporlarının gideceği kişi | `Karahan` |
| `BEN` | keyif_bot davet filtresi | `arastirmaci42` → **kendine göre değiştir** |
| `ISLETME` | musteri_logger'ın takip ettiği dükkân no | `5522` |

## 7) Sorun giderme

- **"captcha belirsiz"** satırları → normal, birkaç denemede çözer (skor eşiği geçilince girer).
- **"başka süpervizör zaten çalışıyor"** → zaten çalışıyor demektir, dokunma.
- **Botlar durdu mu?** Windows: Görev Yöneticisi → python. Mac/Linux: `ps aux | grep supervizor`.
- **"kullanıcı adı/şifre yok" / "Bu hesapta oyun şifresi yok"** → Google/Facebook ile üye
  olmuşsun; şifre yerine çerez taşı: `python3 cerez_aktar.py` (bkz. ilgili bölüm).
- **"çerez artık geçerli değil"** → çerezin süresi dolmuş; tarayıcıdan yenisini kopyalayıp
  `python3 cerez_aktar.py` ile tekrar taşı. (Oyunda şifre belirlediysen `python3 giris.py`
  zaten otomatik girer.)

## 8) Güvenlik & sorumluluk (kısa)

- `AYARLAR.json` (şifre yazdıysan) ve `oturum_cerez.txt` (çerez) hesabına giriş hakkı verir:
  kimseyle paylaşma, buluta koyma. Google ile girenler için `AYARLAR.json`'da sır yoktur.
- Otomasyon, oyun hesabın için risk taşır (oyunlar botları sevmez 😄) — kararı ve riski sana ait. Benim hesapta aylardır çalışıyor, senin hesapta da benzer şekilde çalışacaktır ama garanti veremem.
- Şifre sadece giriş anında kullanılır; botlar sonrasında çerezlerle çalışır.

---

**Kurarken takılırsan söyle, o adımı birlikte çözeriz.** Hangi cihazda çalıştıracağını söylemen yeterli. 🔧
