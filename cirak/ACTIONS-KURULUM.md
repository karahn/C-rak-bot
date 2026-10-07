# 🤖 GitHub Actions kurulumu — PATRON İÇİN (≈2 dakika, 3 adım)

İlk denemede iş akışı dosyası **yanlış konuma** oluştu:
`.github/workflows/cirak-bot.yml/cirak-bot.yml` (klasör adı `cirak-bot.yml` olmuş).
GitHub Actions yalnızca **`.github/workflows/` klasörünün İÇİNDEKİ .yml** dosyalarını çalıştırır → bu hâliyle çalışmaz.

---

## ADIM 1 — Yanlış dosyayı sil

Şu bağlantıyı aç:
**https://github.com/karahn/C-rak-bot/blob/arena/71f59bcb-c-rak-bot/.github/workflows/cirak-bot.yml/cirak-bot.yml**

Sağ üstteki **🗑️ (çöp kutusu)** düğmesine bas → en altta **"Commit changes"**.
*(Bu işlem hem yanlış dosyayı hem boş klasörü siler.)*

## ADIM 2 — Doğru konuma oluştur

1. Şu bağlantıyı aç: **https://raw.githubusercontent.com/karahn/C-rak-bot/arena/71f59bcb-c-rak-bot/cirak/actions/cirak-bot.yml**
   → tüm metni seç (Ctrl+A) → kopyala (Ctrl+C)
2. Şu bağlantıyı aç: **https://github.com/karahn/C-rak-bot/new/arena/71f59bcb-c-rak-bot/.github/workflows/cirak-bot.yml**
   → dosya adı kutusunda **`.github/workflows/cirak-bot.yml`** yazdığını kontrol et
   → içeriği yapıştır (Ctrl+V)
   → **"Commit changes"**

## ADIM 3 — Ayarlar (bir kez)

- **Actions aç:** https://github.com/karahn/C-rak-bot/actions → yeşil **"I understand my workflows, go ahead and enable them"** varsa bas.
- **Yazma izni:** https://github.com/karahn/C-rak-bot/settings/actions → **Workflow permissions** → **"Read and write permissions"** → **Save**.
  *(Bu olmazsa bot sonuçları repoya yazamaz ve ben okuyamam.)*

---

## Sonra ne olacak?

- Bana **"tamam"** yaz → ben bir tetik gönderirim **veya** sen elle çalıştır:
  **Actions → sol tarafta "Cirak Bot" → "Run workflow" → branch: `arena/71f59bcb-c-rak-bot` → Run workflow**
- Koşu ~2 dakika sürer. Sonuçlar repoya yazılır: `cirak/rapor/son.md`
- Ben o dosyayı okuyup sana özet vereceğim (hesap Kalfa19 mu, sürüm 0.57.x, çerez çalışıyor mu, kasa/seviye ne).

## Nasıl çalışacak (kısaca)

- Bot çalışmasını **ben** başlatırım (`cirak/komut.json`'a yazar, push ederim) → Actions koşar.
- Senin cihazın açık kalmak zorunda değil. Private repo'da ayda **2.000 dakika** ücretsiz → günde ~60 dk bot.
- Her koşu en fazla 65 dakika (Actions limiti).
