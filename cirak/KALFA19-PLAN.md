# 🧑🌾 Kalfa19 — Hesap Planı ve Ortaklık Stratejisi

**Tarih:** 7 Ekim 2026 · **Hesap:** Kalfa19 (SV2, TP 8) · **Konum:** Ankara / **Pursaklar** / Fatih Mah.
**Karahan'ın konumu:** Ankara / Keçiören

---

## 🎯 Temel strateji: AYNI İŞİ AÇMA, MÜŞTERİYİ BÖLME

Karahan bilinçli olarak hesabı **kendi mahallesinde açmadı** → iki hesap farklı ilçelerde oynar, aynı müşteri havuzunu paylaşmaz.
Bu strateji korunacak:

1. **Kalfa19, Karahan'ın sahip olduğu dükkân türlerini açmaz** (aynı tür = rekabet/müşteri bölünmesi).
2. Kalfa19, Karahan'ın **aynı ilçede şube/açılım yapmaz** (Keçiören'e taşınmaz).
3. İki hesap arasında **ürün alışverişi / tedarik / davet-kamp** gibi kazançlı ortaklık yolları aranır.
4. Karahan'ın portföyü **oyun içinden** okunur: `oyuncu-karti/14` ucu (botun "keşif" görevi çekiyor).

### Karahan'ın bilinen işleri (notlardan, 4-5 Ekim)
Şarküteri · Kargo şubesi · Çilingir · Otopark · Fotoğrafçı · Elektrikçi · Oto yıkama · Oto servis
(+ Manav/Bakkal/Ziraat bayisi ilk dönemden) → toplam 12 işletme (5 Ekim).
**Güncel liste `cirak/rapor/son.json` → `kesif.veri.karahan` içinde olacak.**

---

## 💰 Kalfa19'un durumu ve yol haritası

| | |
|---|---|
| Nakit | **67.381,98 ₺** (7 Ekim 21:30) — 632 ₺'den 106 kat! |
| Seviye | **SV3** · TP 44 (her 400 TP'de seviye) |
| İlçe nüfusu | Pursaklar (168.881) → kiralar Keçiören'e göre ucuz olmalı |

### 📈 Kanıtlanmış kazanç (bot koşuları)
| Koşu | Süre | Sonuç |
|---|---|---|
| 1. koşu | ~1 dk | 632 → 5.496 ₺ (hasat + cüzdan olayı) |
| 2. koşu | ~2 dk | 5.496 → 10.193 ₺ (61 servis, 13 bahşiş) |
| **3. koşu (uzun)** | **25 dk** | 35.239 → **56.881 ₺** (941 servis, 188 bahşiş, 239 tur) |
| 4-6. koşular | ~1 dk ×3 | 56.881 → **67.381 ₺** |

**Kanıt:** tezgâh servisi (müşteri balonlarına dokunma) en kârlı yol — 25 dakikada ~32.400 ₺.

### Aşama 1 — Tezgâhla sermaye (0 → 20.000 ₺)
- 🎁 **Günlük ödül** her gün büyür; **7. gün bedava seyyar izni** (izin normalde 1.500 ₺/hafta)
- 👞 **Ayakkabı boyacısı** 1.500 ₺ ekipman (en ucuz) → kâr ~256 ₺/tam gün
- 🥨 **Simitçi** 3.000 ₺ → ~652 ₺/tam gün
- 🥨🥜 **Pazar tezgâhı** 8.000 ₺ → ~2.147 ₺/tam gün (kendim servis edersem ölçülen ~6.000 ₺/5 dk!)
- ⚠️ Bot bütçe koruması: 1.000 ₺ altında ücretli etkinlik/bahşiş yok

### Aşama 2 — İlk dükkân (SV3+)
- Kalfa19 için **Karahan'da olmayan** türler öncelikli (keşif sonrası netleşecek)
- Aday: Oto yedek parça, Bisikletçi, Lastikçi, Kırtasiye, Kuruyemişçi, Aktar, Temizlik ürünleri, Nalbur, Züccaciye, Pet shop
- Kural: **stoksuz/hizmet** işler nakit akışında daha basit (Karahan'ın tercihi de bu yönde)

### Aşama 3 — Ortaklık faydaları
- 🎉 **Davet ödülü:** "Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺" (oyun ipucu) → uygun olursa kod paylaşımı
- 🤝 Ortaklık / üretim-tedarik zinciri: Kalfa19'un ürettiği malı Karahan'ın dükkânı satar (ya da tersi)
- 🏕️ Kamp davetleri, arkadaşlık, hediye/havale mekanikleri

---

## 🤖 Bot altyapısı (kurulu)

| Bileşen | Yer |
|---|---|
| GitHub Actions iş akışı | `main` dalı → `.github/workflows/blank.yml` (adı önemsiz) |
| Koşucu | `cirak/actions/cirak_kosu.py` (görevler: test, durum, ham, yenilikler, cerez-kontrol, kaynak, captcha-ornek, bot, kesif) |
| Bot çekirdeği | `cirak/actions/bot_cekirdek.py` (grind + sokak + günlük ödül + keyif) |
| Komut/ayar | `cirak/komut.json` (görev listesi + `sure_dk`) |
| Raporlar | `cirak/rapor/son.json`, `cirak/rapor/son.md` |

**Komut verme:** `cirak/komut.json` değişir → koşu otomatik başlar (veya Actions → Run workflow).
**Hafif mod** (`sure_dk ≈ 0.8`): ~1 dakika → ücretsiz dakika bütçesi korunur.
**Uzun grind** (`sure_dk = 20`): ~20 dakika (ayda ~2.000 dk sınırına dikkat).


---

## 👤 KARAHAN'IN DESENİ (7 Ekim taraması)
- **Ankara'nın her ilçesinde 1 Emlakçı** (no 13, küçük parsel) → imza işi emlakçı.
- Kart: SV10 · TP 2.578 · servet 49,8 M ₺ · **Türkiye #1** · 60 işletme · 12 tezgâh.
- Bizimle **arkadaşlık yoktu**; istek gönderiliyor (bot).
- Bize **1.000.000 ₺** gönderecek → stoksuz dükkânlar açılacak.

## 🎯 KARAHAN'IN TALİMATLARI (7 Ekim gece) — UYGULAMA LİSTESİ
| # | Talimat | Durum |
|---|---|---|
| 1 | Arkadaşlık isteği gönder | ✅ bota eklendi (sıradaki koşuda) |
| 2 | "Ekledim" mesajı gönder | ✅ mesaj kuyruğa alındı |
| 3 | 1M ₺ gelince stoksuz dükkân aç | ✅ dukkan-ac görevi hazır (kargo+oto yıkama ilk) |
| 4 | Kargo / Emlakçı / Oto servis / Oto yıkama | ✅ hedef listesinde |
| 5 | Otopark ASLA | ✅ otopark_yasak: true |
| 6 | Seviye atlayınca dükkânları bildir | ✅ seviye-bildir görevi DM atıyor |
| 7 | Botlar sürekli çalışsın, tezgâh TP getirsin | ✅ bot görevi; 7/24 için 7-24-KURULUM.md |
| 8 | Güncellemeleri takip et + not ekle | 🔄 her koşuda yenilikler çekiliyor |
| 9 | Esnaf odasına kayıt + eğitim (TP) | ✅ oda görevi |
| 10 | Başkanlık seçiminde Karahan'a oy | ⏳ oylama 8-14'ü; oda üyeliği gerekli |
| 11 | Gerekirse repo public | ⏳ 7-24-KURULUM.md (önce çerez → secret) |
