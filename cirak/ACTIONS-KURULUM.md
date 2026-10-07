# 🤖 GitHub Actions kurulumu — PATRON İÇİN (tek seferlik, ~2 dakika)

**Neden 404 aldın?** Repo **private** olduğu için `raw.githubusercontent.com` gibi dışarıdan erişilen linkler giriş yapmadan **404** verir. Ayrıca dal (branch) adı çok uzun olduğu için derin linkler karışabiliyor. Bu yüzden **en basit yolu** hazırladım: hiç link/klasör derdi olmayan **Actions sekmesi** yolu.

Bu dosya **main** dalında durur; her koşuda `arena/71f59bcb-c-rak-bot` dalını çekip botu orada çalıştırır ve sonuçları oraya yazar. Yani sen bir kez kurarsın, bir daha GitHub'a dokunmana gerek kalmaz.

---

## 1) İş akışını oluştur (3 tık)

1. Şu sayfayı aç: **https://github.com/karahn/C-rak-bot/actions**
2. Sayfada **"set up a workflow yourself"** yazan küçük bağlantıya bas.
   *(Görünmüyorsa: **Actions** sayfasındaki **"New workflow"** düğmesine bas → açılan listede en yukarıda "set up a workflow yourself" var.)*
3. Açılan düzenleyicideki örnek metni **tamamen sil**, yerine sohbette verdiğim YAML'ı yapıştır.
   *(İçeriği repodan da alabilirsin: `cirak/actions/cirak-bot.yml` → sağ üstteki **Copy raw contents**)*
4. Sağ üstte **"Commit changes..."** → tekrar **"Commit changes"**.
   - Dal olarak **main** seçili kalsın (bu dosya main'de durmalı, sorun değil).

## 2) Yazma iznini ver (bir kez)

**https://github.com/karahn/C-rak-bot/settings/actions** → **Workflow permissions** → **"Read and write permissions"** → **Save**.
*(Bu olmazsa bot sonuçları repoya yazamaz ve ben okuyamam.)*

## 3) Bana "oldu" yaz

Ben kontrol ederim: koşu başlamış mı, çerez çalışıyor mu, hesap **Kalfa19** mu, kasa/seviye ne.
Koşuyu ben de başlatabilirim; olmazsa Actions → **Cirak Bot** → **Run workflow** düğmesine basman yeterli (2 tık).

---

## Koşu nasıl işliyor?

- **Zamanlanmış:** her saat **:07 ve :37** (UTC) → TRT **:10 ve :40**. (GitHub bazen birkaç dakika geciktirir, normal.)
- Her koşu kısa sürer (durum + ödül toplama). Uzun grind koşularını ben ayarlarım (`cirak/komut.json`).
- Senin bilgisayarın/telefonun **açık kalmak zorunda değil**.
- Private repo'da aylık **2.000 dakika** ücretsiz: kısa koşularla bu bize fazlasıyla yeter, uzun koşuları ihtiyaç olunca planlarız.

## Alternatif (GitHub'a hiç girmeden): tarayıcı konsolu

`cirak/tarayici-konsol.js` — oyun sekmesi açıkken F12 → Console → yapıştır → Enter.
Tarayıcı senin oturumunla çalışır; sekme açık kaldığı sürece tezgâh grind'i yapar, günlük ödülleri toplar.
Bilgisayarda sekme açık tutabiliyorsan bu yol **bedava ve sınırsız**; ikisini birlikte kullanabiliriz.

## Sorun giderme

- **Actions sayfasında koşu yok** → 1. adımdaki dosya oluşmamış ya da "I understand my workflows, go ahead and enable them" onayı bekliyor olabilir.
- **Koşu kırmızı** → log'un ekran görüntüsünü at, hemen düzeltirim.
- **Koşu yeşil ama sonuç yok** → 2. adım (yazma izni) eksik olabilir.
