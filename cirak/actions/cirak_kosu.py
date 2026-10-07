#!/usr/bin/env python3
"""Çırak — GitHub Actions koşucusu.

Bu script GitHub Actions makinesinde (internet erişimi tam) çalışır ve
oyun hesabımızla konuşur. Talimatlar `cirak/komut.json` içinden okunur.

Görevler:
  test   → oyuna erişim var mı, oyun sürümü ne? (çerez gerekmez)
  durum  → hesapla giriş yapıp geniş bir durum fotoğrafı çeker
  ham    → komut.json'daki "uclar" listesindeki uçları çağırır
  (bot görevleri sonraki aşamada eklenecek)
"""
from __future__ import annotations

import datetime
import http.cookiejar
import json
import os
import socket
import sys
import time
import traceback
import urllib.error
import urllib.request

TABAN = "https://oyunsitem.com/cirak/api/"
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../cirak
RAK = os.path.join(KOK, "rapor")
CEREZ_DOSYA = os.path.join(KOK, "oturum_cerez.txt")
KOMUT_DOSYA = os.path.join(KOK, "komut.json")


def yol(*p: str) -> str:
    return os.path.join(*p)


def yaz(dosya: str, icerik: str) -> None:
    os.makedirs(os.path.dirname(dosya), exist_ok=True)
    with open(dosya, "w", encoding="utf-8") as f:
        f.write(icerik)


def simdi() -> str:
    return datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")


def oturum():
    """Çerez kavanozu: önce dosya, sonra TEZGAH_CEREZ ortam değişkeni."""
    cj = http.cookiejar.MozillaCookieJar(CEREZ_DOSYA)
    if os.path.exists(CEREZ_DOSYA):
        try:
            cj.load(ignore_discard=True, ignore_expires=True)
        except Exception as e:  # bozuk dosya botu durdurmasın
            print("! cerez dosyasi okunamadi:", e)
    env = (os.environ.get("TEZGAH_CEREZ") or "").strip()
    if env:
        cj.set_cookie(
            http.cookiejar.Cookie(
                0, "tezgah_oturum", env, None, False, "oyunsitem.com", False,
                False, "/", True, False, None, True, None, None, {},
            )
        )
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [
        ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"),
        ("Referer", "https://oyunsitem.com/cirak/"),
        ("Accept", "application/json"),
    ]
    return op


def cek(op, rota: str, veri=None, deneme: int = 3, bekle: float = 1.0):
    """API çağrısı — 429'da bekler, hatayı sözlük olarak döner."""
    data = json.dumps(veri).encode() if veri is not None else None
    basliklar = {"Content-Type": "application/json"} if data else {}
    son = "bilinmeyen hata"
    for i in range(deneme):
        req = urllib.request.Request(TABAN + rota, data=data, headers=basliklar)
        try:
            with op.open(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(30)
                continue
            try:
                return json.loads(e.read().decode())
            except Exception:
                return {"hata": "HTTP %s" % e.code}
        except Exception as e:
            son = "%s: %s" % (type(e).__name__, e)
            time.sleep(3)
    return {"hata": son}


# ---------------------------------------------------------------- görevler

def gorev_test(op, komut):
    rapor = {"ts": simdi(), "adimlar": []}
    try:
        rapor["dns"] = socket.gethostbyname("oyunsitem.com")
    except Exception as e:
        rapor["dns_hata"] = str(e)

    yen = cek(op, "yenilikler")
    if isinstance(yen, dict) and yen.get("surumler"):
        surumler = yen["surumler"]
        rapor["guncel_surum"] = surumler[0].get("surum")
        rapor["son_surumler"] = [
            {"surum": s.get("surum"), "tarih": s.get("tarih"),
             "baslik": (s.get("baslik") or {}).get("tr")}
            for s in surumler[:12]
        ]
        rapor["toplam_surum"] = len(surumler)
    else:
        rapor["yenilikler_hata"] = yen

    dg = cek(op, "dogrulama")
    if isinstance(dg, dict) and dg.get("resim"):
        rapor["captcha"] = {"anahtar": dg.get("anahtar"), "uzunluk": len(dg.get("resim") or "")}
    else:
        rapor["captcha_hata"] = dg

    d = cek(op, "durum")
    rapor["cerezli_durum"] = d if not isinstance(d, dict) or "oyuncu" in d else d
    o = (d or {}).get("oyuncu") if isinstance(d, dict) else None
    rapor["giris_var"] = bool(o)
    if o:
        rapor["oyuncu"] = {"ad": o.get("kullaniciAdi"), "seviye": o.get("seviye"), "tp": o.get("tecrube")}
    return rapor


DURUM_UCLARI = [
    "durum", "banka", "vergi", "vaka", "isletmelerim", "seyyar", "gorevler",
    "hareketler", "finans", "siralama", "ligler", "mahalle", "yetenekler",
    "tedarik", "pazar", "sigorta", "kiralama", "etkinlikler",
    "mini-oyun/sira?kod=genel",
]


def gorev_durum(op, komut):
    uclar = komut.get("uclar") or DURUM_UCLARI
    rapor = {"ts": simdi(), "uclar": {}}
    for u in uclar:
        r = cek(op, u)
        rapor["uclar"][u] = {"hata": r.get("hata")} if isinstance(r, dict) and "hata" in r and len(r) == 1 else r
        time.sleep(1.2)
    return rapor


def gorev_ham(op, komut):
    rapor = {"ts": simdi(), "uclar": {}}
    for u in komut.get("uclar") or []:
        r = cek(op, u)
        rapor["uclar"][u] = r
        time.sleep(1.2)
    return rapor


def cek_metin(op, url: str, limit: int = 4_000_000):
    """JSON olmayan ham metin (HTML/JS) indirir."""
    req = urllib.request.Request(url, headers={"Accept": "*/*"})
    try:
        with op.open(req, timeout=40) as r:
            return r.read(limit).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return ""
    except Exception:
        return ""


def gorev_cerez_kontrol(op, komut):
    """Çerez hâlâ geçerli mi? Oyuncuyu ve kısa durumu döner."""
    d = cek(op, "durum")
    o = (d or {}).get("oyuncu") if isinstance(d, dict) else None
    if o:
        b = cek(op, "banka") or {}
        return {
            "tamam": True,
            "oyuncu": o.get("kullaniciAdi"), "seviye": o.get("seviye"), "tp": o.get("tecrube"),
            "nakit_kurus": o.get("bakiye"), "il": o.get("il"), "ilce": o.get("ilce"), "mahalle": o.get("mahalle"),
            "banka": b, "takvim": (d or {}).get("takvim"),
        }
    return {"tamam": False, "hata": (d or {}).get("hata") if isinstance(d, dict) else d}


def gorev_kaynak(op, komut):
    """Oyunun güncel kaynak kodunu indirir; çerez adını ve API uçlarını çıkarır."""
    import re
    KAY = os.path.join(KOK, "kaynak")
    os.makedirs(KAY, exist_ok=True)
    html = cek_metin(op, "https://oyunsitem.com/cirak/")
    srcs = re.findall(r'<script[^>]+src="([^"]+)"', html) + re.findall(r'<link[^>]+href="([^"]+\.js[^"]*)"', html)
    srcs = [s for s in dict.fromkeys(srcs)][:10]
    kayitlar, api_uclari, cerez_izleri = [], set(), []
    for s in srcs:
        url = s if s.startswith("http") else "https://oyunsitem.com/cirak/" + s.lstrip("/")
        txt = cek_metin(op, url)
        if not txt:
            kayitlar.append({"src": s, "boyut": 0, "not": "indirilemedi"})
            continue
        ad = os.path.basename(s.split("?")[0]) or ("kaynak-%d.js" % len(kayitlar))
        yaz(os.path.join(KAY, ad), txt)
        for m in re.finditer(r'cookie', txt, re.I):
            ctx = re.sub(r"\s+", " ", txt[max(0, m.start() - 100): m.start() + 140])
            if ctx not in cerez_izleri:
                cerez_izleri.append(ctx)
        for m in re.finditer(r'["\'`]([a-z0-9][a-z0-9\-]{1,24}(?:/[a-z0-9\-{}.]{1,24}){1,3})["\'`]', txt):
            aday = m.group(1)
            if any(k in aday for k in (".js", ".jsx", ".json", "http", "www.", ".png", ".css", "assets")):
                continue
            api_uclari.add(aday)
        kayitlar.append({"src": s, "boyut": len(txt), "ad": ad})
        time.sleep(0.6)
    yaz(os.path.join(KAY, "api-uclari.txt"),
        "\n".join(sorted(api_uclari)))
    yaz(os.path.join(KAY, "cerez-izleri.txt"),
        "\n\n".join(cerez_izleri[:80]))
    return {"html_uzunluk": len(html), "scriptler": kayitlar,
            "cerez_izi_sayisi": len(cerez_izleri), "api_ucu_sayisi": len(api_uclari),
            "tezgah_geciyor": any("tezgah" in t for t in cerez_izleri),
            "ornek_uclar": sorted(api_uclari)[:40]}


def gorev_captcha_ornek(op, komut):
    """Captcha örnekleri indirir (çözücü geliştirmek için)."""
    import base64 as b64
    import re
    KAY = os.path.join(KOK, "kaynak", "captcha")
    os.makedirs(KAY, exist_ok=True)
    adet = int(komut.get("adet") or 5)
    ornekler = []
    for i in range(adet):
        d = cek(op, "dogrulama")
        resim = (d or {}).get("resim") or ""
        m = re.match(r"data:image/svg\+xml;base64,(.*)", resim, re.S)
        svg = b64.b64decode(m.group(1)).decode("utf-8", "replace") if m else ""
        ad = "captcha-%02d.svg" % (i + 1)
        yaz(os.path.join(KAY, ad), svg)
        kalinliklar = re.findall(r'stroke-width="([\d.]+)"', svg)
        ornekler.append({"ad": ad, "anahtar": (d or {}).get("anahtar"), "boyut": len(svg),
                         "path_sayisi": len(re.findall(r"<path", svg)),
                         "kalinliklar": kalinliklar[:24],
                         "daire_sayisi": len(re.findall(r"<circle", svg))})
        time.sleep(2)
    return {"ornekler": ornekler}


def gorev_yenilikler(op, komut):
    """Sürüm notlarını COMPAK özetler (tüm dilleri atmak için)."""
    ham = cek(op, "yenilikler")
    if not isinstance(ham, dict) or not ham.get("surumler"):
        return {"hata": ham}
    adet = int(komut.get("adet") or 60)
    ozet = []
    for s in ham["surumler"][:adet]:
        maddeler = []
        for m in (s.get("maddeler") or []):
            t = (m.get("tr") or "").strip()
            if t:
                maddeler.append(t if len(t) <= 300 else t[:300] + "…")
        ozet.append({
            "surum": s.get("surum"),
            "tarih": s.get("tarih"),
            "baslik": (s.get("baslik") or {}).get("tr"),
            "maddeler": maddeler[:8],
        })
    dosya = os.path.join(RAK, "yenilikler-ozet.json")
    yaz(dosya, json.dumps({"toplam": len(ham["surumler"]), "ozet": ozet}, ensure_ascii=False, indent=1))
    satir = ["# Sürüm notları özeti (son %d) — %s" % (len(ozet), simdi()), ""]
    for s in ozet:
        satir.append("## %s — %s · %s" % (s["surum"], s["tarih"], s["baslik"] or ""))
        for m in s["maddeler"]:
            satir.append("- " + m.replace("\n", " "))
        satir.append("")
    yaz(os.path.join(RAK, "yenilikler-ozet.md"), "\n".join(satir))
    return {"toplam_surum": len(ham["surumler"]), "ozetlenen": len(ozet),
            "ilk": ozet[0] if ozet else None, "son": ozet[-1] if ozet else None}


VARSAYILAN_KOMUT = {"gorevler": ["cerez-kontrol", "durum", "bot"], "sure_dk": 0.8,
                    "not": "Varsayılan (hafif) mod: oturum kontrolü + durum + tek tur ödül/olay. "
                           "Uzun grind için sure_dk değerini artır (ben ayarlarım).",
                    "kosu": 1}


KESIF_ADAYLARI = [
    "kiralama", "kiralik", "dukkan/kiralik", "cadde", "caddeler", "sokak", "sokaklar", "harita",
    "mahalle", "mahalleler", "isletmeler", "dukkanlar", "komsular", "oyuncular",
    "oyuncu-karti/14", "mezat", "proje", "kariyer", "tesisler", "uretim", "envanter",
    "market", "magaza", "gorev", "gunluk", "sans", "cark", "sezon/kart", "pazar",
]


def gorev_kesif(op, komut):
    """Bilinmeyen/yenilenmiş uçları keşfeder + Karahan'ın kartını ve tezgâh listesini çeker."""
    rapor = {"ts": simdi(), "kesif": {}, "veri": {}}

    # 1) aday uçlar: hangisi 404 değil?
    adaylar = komut.get("adaylar") or KESIF_ADAYLARI
    for u in adaylar:
        r = cek(op, u, deneme=1)
        if isinstance(r, dict) and r.get("hata") == "Bulunamadı.":
            rapor["kesif"][u] = "yok"
        elif isinstance(r, dict) and r.get("hata"):
            rapor["kesif"][u] = "hata: %s" % str(r.get("hata"))[:80]
        else:
            anahtarlar = list(r.keys())[:12] if isinstance(r, dict) else "(liste %d)" % len(r or [])
            rapor["kesif"][u] = {"anahtarlar": anahtarlar}
        time.sleep(0.7)

    # 2) Karahan'ın oyuncu kartı (id 14) — portföyünü öğren
    rapor["veri"]["karahan"] = cek(op, "oyuncu-karti/14")
    time.sleep(1.0)

    # 3) Tezgâh (seyyar) tam listesi — bugünün işleri, izin, fiyatlar
    rapor["veri"]["seyyar"] = cek(op, "seyyar")
    time.sleep(1.0)

    # 4) Görevler + bonus/sezon durumu
    rapor["veri"]["gorevler"] = cek(op, "gorevler")
    rapor["veri"]["bonus"] = cek(op, "bonus")
    rapor["veri"]["sezon"] = cek(op, "sezon")
    return rapor


def gorev_bot(op, komut):
    """Uzun koşu: tezgâh grind + sokak olayları + günlük ödüller + keyif."""
    import importlib.util
    yol_mod = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bot_cekirdek.py")
    spec = importlib.util.spec_from_file_location("bot_cekirdek", yol_mod)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    LOG_DOSYA = os.path.join(KOK, "loglar", "kosu.jsonl")

    def logla(k):
        os.makedirs(os.path.dirname(LOG_DOSYA), exist_ok=True)
        k["ts"] = int(time.time() * 1000)
        with open(LOG_DOSYA, "a", encoding="utf-8") as f:
            f.write(json.dumps(k, ensure_ascii=False) + "\n")

    def kalp(notu=""):
        yaz(os.path.join(KOK, "kalp.txt"), "%d %s\n" % (int(time.time() * 1000), notu))

    sure = float(komut.get("sure_dk") or 0)
    bot = mod.Bot(lambda rota, veri=None: cek(op, rota, veri), logla, kalp, sure_dk=sure)
    ozet = bot.kos()

    # Ağır koşudan sonra komutu hafif moda döndür → zamanlanmış koşular ucuz kalsın
    yeni = dict(VARSAYILAN_KOMUT)
    yeni["kosu"] = int(komut.get("kosu") or 0) + 1
    if sure >= 2:  # sadece gerçek grind koşusundan sonra sıfırla
        yaz(KOMUT_DOSYA, json.dumps(yeni, ensure_ascii=False, indent=1))
        ozet["komut_sifirlandi"] = True
    return ozet


def cek_metin_kod(op, url: str, limit: int = 8_000_000):
    """Ham metin indirir; (http_kodu, metin) döner."""
    req = urllib.request.Request(url, headers={"Accept": "*/*", "Referer": "https://oyunsitem.com/cirak/"})
    try:
        with op.open(req, timeout=45) as r:
            return r.status, r.read(limit).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, "%s: %s" % (type(e).__name__, e)


def gorev_cadde_tara(op, komut):
    """Verilen ilçeleri tarar; belirtilen sahibin dükkânlarını ve boş parselleri listeler."""
    import collections
    ilceler = komut.get("ilceler") or []
    sahip = komut.get("sahip") or "Karahan"
    rapor = {"ts": simdi(), "sahip": sahip, "ilceler": {}, "bulunan": [], "ozet_tur": {}, "bos_parseller": {}}
    tur_say = collections.Counter()
    for il in ilceler:
        if isinstance(il, dict):
            iid, ad = il.get("id"), il.get("ad")
        else:
            iid, ad = il, str(il)
        r = cek(op, "cadde?ilce=%s" % iid, deneme=2)
        yerler = (r or {}).get("yerler") or []
        sahibi, benim, bos = [], [], []
        for y in yerler:
            i = y.get("isletme") or {}
            if i.get("sahip") == sahip:
                sahibi.append(y)
                tur_say[i.get("turAdi") or i.get("tur")] += 1
                rapor["bulunan"].append({
                    "ilce": ad, "no": y.get("no"), "boyut": y.get("boyutAdi"),
                    "tur": i.get("tur"), "turAdi": i.get("turAdi"), "ad": i.get("ad"),
                    "durum": i.get("durum"), "saat": i.get("saat"),
                })
            elif i.get("benim") or i.get("sahip") == komut.get("kendi"):
                benim.append(y)
            if not i:
                bos.append({"no": y.get("no"), "boyut": y.get("boyutAdi"), "m2": y.get("m2"),
                            "kira": (y.get("kira") or 0) / 100})
        rapor["ilceler"][ad] = {"parsel": len(yerler), "bos": len(bos),
                                "sahibinde": len(sahibi), "benim": len(benim)}
        if bos:
            rapor["bos_parseller"][ad] = bos
        time.sleep(0.7)
    rapor["ozet_tur"] = dict(tur_say.most_common())
    rapor["toplam_bulunan"] = len(rapor["bulunan"])
    return rapor


def gorev_ana_js(op, komut):
    """Ana oyun kodunu indirir, API uçlarını ve dükkân mekaniklerini çıkarır."""
    import re
    KAY = os.path.join(KOK, "kaynak")
    os.makedirs(KAY, exist_ok=True)
    adaylar = komut.get("adaylar") or ["ana.js", "js/ana.js", "/ana.js", "cirak/ana.js", "ana-v057.js"]
    denemeler, txt, kullanilan = [], "", None
    for aday in adaylar:
        url = aday if aday.startswith("http") else "https://oyunsitem.com/cirak/" + aday.lstrip("/")
        kod, govde = cek_metin_kod(op, url)
        denemeler.append({"aday": aday, "kod": kod, "boyut": len(govde)})
        if kod == 200 and len(govde) > 20000:
            txt, kullanilan = govde, aday
            break
        time.sleep(0.6)
    if not txt:
        return {"hata": "indirilemedi", "denemeler": denemeler}
    yaz(os.path.join(KAY, "ana.js"), txt)

    uclar = set()
    for kal in [r"""api\(\s*['"`]([^'"`]{2,60})['"`]""",
                r"""['"`](/?(?:cirak/)?api/[^'"`]{2,60})['"`]""",
                r"""['"`]([a-z][a-z0-9-]{1,20}/[a-z0-9{}_.-]{1,30})['"`]"""]:
        for m in re.finditer(kal, txt):
            aday = m.group(1).strip("/")
            if any(x in aday for x in (".js", ".png", ".jpg", "http", "assets", ".json", ".css")):
                continue
            uclar.add(aday)
    yaz(os.path.join(KAY, "api-uclari-ana.txt"), "\n".join(sorted(uclar)))

    ilgi = []
    for anahtar in ("kirala", "kiralik", "kurulum", "depozito", "ruhsat", "isletme/ac", "dukkan"):
        for m in list(re.finditer(anahtar, txt, re.I))[:6]:
            parca = re.sub(r"\s+", " ", txt[max(0, m.start() - 170): m.start() + 210])
            ilgi.append("[%s] %s" % (anahtar, parca))
    yaz(os.path.join(KAY, "kiralama-izleri.txt"), "\n\n".join(ilgi[:80]))

    return {"boyut": len(txt), "kullanilan": kullanilan, "denemeler": denemeler,
            "api_ucu_sayisi": len(uclar), "kirala_gecen": len(re.findall("kirala", txt, re.I)),
            "ornek_uclar": sorted(uclar)[:80], "ilgi_ornekleri": ilgi[:8]}


GOREVLER = {"test": gorev_test, "durum": gorev_durum, "ham": gorev_ham, "yenilikler": gorev_yenilikler,
            "cerez-kontrol": gorev_cerez_kontrol, "kaynak": gorev_kaynak,
            "captcha-ornek": gorev_captcha_ornek, "bot": gorev_bot, "kesif": gorev_kesif,
            "ana-js": gorev_ana_js, "cadde-tara": gorev_cadde_tara}


# ---------------------------------------------------------------- özet yaz

def insan_ozeti(rapor, ad: str) -> str:
    s = ["# Çırak raporu — %s" % ad, "", "**Zaman:** %s UTC" % rapor.get("ts", simdi()), ""]
    o = rapor.get("oyuncu")
    if isinstance(o, dict):
        s += ["## Oyuncu", "", "| Alan | Değer |", "|---|---|",
              "| Ad | %s |" % o.get("kullaniciAdi"), "| Seviye | %s |" % o.get("seviye"),
              "| TP | %s |" % o.get("tecrube"), ""]
    elif isinstance(o, str):
        s += ["## Oyuncu", "", "- Ad: **%s**" % o,
              "- Seviye: %s · TP: %s" % (rapor.get("seviye"), rapor.get("tp")),
              "- Nakit: %s ₺" % ((rapor.get("nakit_kurus") or 0) / 100),
              "- Konum: %s / %s / %s" % ((rapor.get("il") or {}).get("ad"),
                                         (rapor.get("ilce") or {}).get("ad"),
                                         (rapor.get("mahalle") or {}).get("ad")), ""]
    uclar = rapor.get("uclar") or {}
    if uclar:
        s += ["## Uçlar", ""]
        for k, v in uclar.items():
            ozet = json.dumps(v, ensure_ascii=False)
            s.append("- `%s` → %s" % (k, ozet[:300] + ("…" if len(ozet) > 300 else "")))
        s.append("")
    # bot koşusu özeti
    if rapor.get("olay") == "kosu_bitti":
        s += ["## Bot koşusu", "",
              "| Alan | Değer |", "|---|---|",
              "| Süre | %s dk |" % rapor.get("gecen_dk"),
              "| Tur | %s |" % rapor.get("tur"),
              "| Kazanç | %s ₺ |" % rapor.get("kazanc"),
              "| Servis | %s |" % rapor.get("servis"),
              "| Bahşiş | %s |" % rapor.get("bahsis"),
              "| Bakiye | %s ₺ |" % rapor.get("bakiye"), ""]
    return "\n".join(s)


def main() -> int:
    try:
        komut = json.load(open(KOMUT_DOSYA, encoding="utf-8"))
    except Exception as e:
        print("! komut.json okunamadi:", e)
        komut = {"gorevler": ["test"]}
    print("komut:", json.dumps(komut, ensure_ascii=False)[:500])

    op = oturum()
    ozetler = {}
    for ad in komut.get("gorevler", ["test"]):
        f = GOREVLER.get(ad)
        if not f:
            print("! bilinmeyen gorev:", ad)
            continue
        print("== gorev:", ad)
        try:
            ozetler[ad] = f(op, komut)
        except Exception:
            ozetler[ad] = {"beklenmeyen_hata": traceback.format_exc()[-1500:]}
        print(json.dumps(ozetler[ad], ensure_ascii=False)[:3000])

    damga = datetime.datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    yaz(os.path.join(RAK, "son.json"), json.dumps(ozetler, ensure_ascii=False, indent=1))
    yaz(os.path.join(RAK, "son-%s.json" % damga), json.dumps(ozetler, ensure_ascii=False, indent=1))
    md = "\n\n---\n\n".join(insan_ozeti(v, k) for k, v in ozetler.items())
    yaz(os.path.join(RAK, "son.md"), md)

    # Actions arayüzünde görünen özet
    adim = os.environ.get("GITHUB_STEP_SUMMARY")
    if adim:
        with open(adim, "a", encoding="utf-8") as f:
            f.write(md[:60000])
    return 0


if __name__ == "__main__":
    sys.exit(main())
