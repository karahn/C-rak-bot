# ♾️ 7/24 Kesintisiz Bot Kurulumu (GitHub public + zincir)

**Amaç:** Botun 7/24 çalışması. Şu an her koşuyu elle başlatıyoruz (GitHub, uygulama-itmeleriyle iş akışı başlatmıyor). Çözüm: **zincir** — her koşu sonunda bot kendini yeniden tetikler.

## Neden public?
- Private repo'da ücretsiz kota: **ayda 2.000 dakika** (≈33 saat) → 7/24 için yetmez.
- Public repo'da Actions **sınırsız**, ücretsiz. ✅

## Güvenlik (public yapmadan ÖNCE mutlaka)
1. **Çerezi gizli anahtara taşı:** GitHub → Settings → Secrets and variables → Actions → **New repository secret**
   - Name: `TEZGAH_CEREZ`
   - Secret: sohbette gönderdiğin `tezgah_oturum` değeri
2. Bana "anahtar eklendi" de → ben `cirak/oturum_cerez.txt` dosyasını ve şifreyi repodan **silerim** (bot çerezi anahtardan okur — kod bunu destekliyor).
3. **Sonra** public yap: Settings → General → en altta **Change repository visibility → Make public**.

## Zincir için iş akışı güncellemesi (bir kez)
`.github/workflows/cirak-bot.yml` (arena dalında) içeriğini şununla değiştir — tek fark: `actions: write` + `timeout-minutes: 350`:

```yaml
name: Cirak Bot (arena)
on:
  push:
    paths:
      - 'cirak/komut.json'
  workflow_dispatch:
permissions:
  contents: write
  actions: write
concurrency:
  group: cirak-bot
  cancel-in-progress: false
jobs:
  kosu:
    runs-on: ubuntu-latest
    timeout-minutes: 350
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Kosucuyu calistir
        env:
          TEZGAH_CEREZ: ${{ secrets.TEZGAH_CEREZ }}
        run: python3 cirak/actions/cirak_kosu.py
      - name: Sonuclari repoya yaz
        if: always()
        run: |
          git config user.name "cirak-bot"
          git config user.email "bot@users.noreply.github.com"
          git add -A cirak/
          git commit -m "kosu $(date -u '+%Y-%m-%d %H:%M') UTC" || echo "degisiklik yok"
          for i in 1 2 3; do
            git pull --rebase --autostash && git push origin HEAD:arena/71f59bcb-c-rak-bot && break
            sleep 5
          done
```

## Son adım
Bana "kurulum tamam" de → ben `cirak/komut.json` içine `"zincir": true` yazarım.
O andan sonra: **her koşu ~5 saat çalışır, bitince kendini yeniden başlatır** → 7/24 bot. 🎉

## Not
- Bot insan gibi davranır: servis araları 0,45 sn, turlar arası 2,5 sn, keyif/olay kontrolleri seyrek.
- İstediğin an "dur" dersen: Actions → Cirak Bot → koşuyu iptal et + `zincir: false` yapmamı söyle.
