# C-rak-bot 🤖

**Çırak** (oyunsitem.com/cirak) için otomatik oyun botu.
Karahan (oyuncu) + Arena AI ortak projesi — hesap: **Kalfa19** (Ankara/Pursaklar).

## Nasıl çalışır?

| Parça | Açıklama |
|---|---|
| `cirak/actions/cirak_kosu.py` | Koşucu — GitHub Actions üzerinde çalışır (Python 3.11) |
| `cirak/komut.json` | Görev listesi + süre (push edilince koşu tetiklenir) |
| `cirak/actions/bot_cekirdek.py` | Oyun çekirdeği: tezgâh grind, sokak olayları, günlük ödüller, oda, dükkân kiralama |
| `cirak/rapor/` | Her koşunun raporu (`son.json`, `son.md`) |
| `cirak/loglar/kosu.jsonl` | Koşu günlüğü |
| `cirak/kaynak/` | Oyun kaynak dosyaları (bootstrap, API uçları) |

🔐 **Kimlik bilgileri repoda YOKTUR** — oturum çerezi GitHub Actions gizli anahtarında
(`TEZGAH_CEREZ`) tutulur.

## Ne yapar?

- 🛒 Seyyar tezgâhları (pazar, simit, pamuk, şemsiye…) çalıştırıp **müşterilere servis** yapar (bahşiş toplar)
- 🚶 Sokak olaylarını değerlendirir (cüzdan, kedi, sokak sanatçısı…)
- 🎁 Günlük bonus, görev ödülü, sezon ödülü, oda eğitimi (TP) toplar
- 📬 Karahan ile oyun içi mesajlaşır; seviye atlayınca yeni dükkânları bildirir
- 🏪 Para yettiğinde dükkân kiralar (kargo, oto yıkama, oto servis, emlakçı — otopark hariç)
- 🔁 Koşu bitince kendini yeniden tetikler (`repository_dispatch`) — kesintisiz döngü

## Belgeler

| Dosya | İçerik |
|---|---|
| `cirak/dukkan-seviye-rehberi.md` | 79 işletme türü — seviye, fiyat, stoklu/stoksuz, tavsiye |
| `cirak/KALFA19-PLAN.md` | Yol haritası ve Karahan'ın talimatları |
| `cirak/SEVIYE-DUKKAN-BILDIRIMI.md` | Hangi seviyede ne açılıyor (bildirim listesi) |
| `cirak/7-24-KURULUM.md` | Kesintisiz çalışma kurulumu |
| `cirak/ACTIONS-KURULUM.md` | İş akışı kurulum notları |
