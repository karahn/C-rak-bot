# 🤖 GitHub Actions kurulumu — PATRON İÇİN 4 ADIM (≈3 dakika)

Benim (Arena AI) sandbox'ım oyuna bağlanamıyor, bu yüzden botları **GitHub'ın kendi sunucularında** çalıştıracağız. Bunun için **1 dosyayı senin oluşturman** gerekiyor (benim token'ımın "workflow" izni yok).

---

## 1) İş akışı dosyasını oluştur (tek sefer)

1. Şu bağlantıyı aç: **https://github.com/karahn/C-rak-bot/blob/arena/71f59bcb-c-rak-bot/cirak/actions/cirak-bot.yml**
2. Sağ üstteki **"Copy raw contents"** (kopyala) düğmesine bas.
3. Şu adrese git: **https://github.com/karahn/C-rak-bot/new/arena/71f59bcb-c-rak-bot/.github/workflows/cirak-bot.yml
   - Sol üstte **branch: `arena/71f59bcb-c-rak-bot`** yazdığından emin ol (değiştirme!).
4. Dosya adına `cirak-bot.yml` yaz, içeriği yapıştır, en altta **"Commit changes"** → Commit.

## 2) Actions'ı aç

**https://github.com/karahn/C-rak-bot/actions** → eğer "Workflows aren't being run" yazıyorsa yeşil **"I understand my workflows, go ahead and enable them"** düğmesine bas.

## 3) Ayarları kontrol et (toplu 2 tık)

**Settings → Actions → General** → en altta **Workflow permissions**:
**"Read and write permissions"** seçili olmalı → **Save**.
*(Bu olmazsa bot sonuçları repoya yazamaz ve ben göremem.)*

## 4) Çerezi ver

Hesabı açtıktan sonra: oyunda **F12 → Application → Cookies → https://oyunsitem.com → `tezgah_oturum`** satırının **Value**'sunu kopyala → bana sohbette yaz.
Ben onu private repodaki `cirak/oturum_cerez.txt` dosyasına koyarım (ya da istersen **Settings → Secrets and variables → Actions → New repository secret** ile `TEZGAH_CEREZ` adıyla ekleyebilirsin — daha güvenli yol).

---

## Nasıl çalışacak?

- Bot çalışmasını **ben** başlatacağım: `cirak/komut.json` dosyasına yazar, push ederim → Actions koşar.
- Koşu bitince sonuçlar **repoya** yazılır (`cirak/rapor/son.md`) → ben oradan okurum, sana özet veririm.
- Senin cihazının **açık kalması gerekmez**. Ama ücretsiz sınır var: private repo'da **ayda 2.000 dakika** → günde ~60 dakika bot çalışabilir. (Repo public yapılırsa sınırsız olur — çerez gizli kalır ama kodu herkes görür; sen bilirsin.)
- Her koşu en fazla **65 dakika** sürer (Actions limiti).

## Sorun çıkarsa

- Actions sekmesinde koşu **kırmızı X** ise bana ekran görüntüsünü at ya da "log"u yapıştır — hemen düzeltirim.
- Koşu **yeşil** ama sonuç yoksa: muhtemelen "push" adımı engellendi (3. adım) → ayarı düzeltip bana söyle, tekrar tetiklerim.
