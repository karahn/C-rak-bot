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
    """Çerez kavanozu: önce TEZGAH_CEREZ gizli anahtarı, sonra dosya."""
    cj = http.cookiejar.MozillaCookieJar(CEREZ_DOSYA)
    if os.path.exists(CEREZ_DOSYA):
        try:
            cj.load(ignore_discard=True, ignore_expires=True)
        except Exception as e:  # bozuk dosya botu durdurmasın
            print("! cerez dosyasi okunamadi:", e)
    env = (os.environ.get("TEZGAH_CEREZ") or "").strip()
    if env:
        try:
            cj.clear("oyunsitem.com", "/", "tezgah_oturum")
        except KeyError:
            pass
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


VARSAYILAN_KOMUT = {"gorevler": ["cerez-kontrol", "banka", "havale", "mesaj-oku", "oda", "seviye-bildir", "dukkan-ac", "bot"],
                    "sure_dk": 50, "zincir": True, "zincir_butce_dk": 0,
                    "not": "VARSAYILAN (zincir) mod: mesaj oku/cevap + oda + dükkân denemesi + 50 dk grind; bitince kendini yeniden tetikler.",
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

    # Ağır koşudan sonra komutu hafif moda döndür → zamanlanmış koşular ucuz kalsın.
    # ZİNCİR MODUNDA komut.json'a DOKUNULMAZ (yönetici komutuyla çakışmasın).
    if sure >= 2 and not komut.get("zincir"):
        yeni = dict(VARSAYILAN_KOMUT)
        yeni["kosu"] = int(komut.get("kosu") or 0) + 1
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


def mesaj_gonder(op, alici: str, metin: str):
    """DM gönderir (300 karakter sınırı)."""
    metin = (metin or "").strip()[:295]
    return cek(op, "mesaj", {"alici": alici, "metin": metin})


def gorev_arkadas_istek(op, komut):
    """Karahan'a arkadaşlık isteği gönderir / gelen isteği kabul eder + mesaj yollar."""
    hedef_id = int(komut.get("arkadas_id") or 14)
    hedef_ad = komut.get("arkadas_ad") or "Karahan"
    a = cek(op, "arkadaslar") or {}
    arkadaslar = {x.get("id"): x for x in (a.get("arkadaslar") or [])}
    giden = {x.get("id") for x in (a.get("giden") or [])}
    gelen = {x.get("id") for x in (a.get("gelen") or [])}
    sonuc = {"arkadas_mi": hedef_id in arkadaslar, "giden_istek_var": hedef_id in giden,
             "gelen_istek_var": hedef_id in gelen}

    if hedef_id in gelen:
        sonuc["kabul"] = cek(op, "arkadas/kabul", {"id": hedef_id})
    elif hedef_id not in arkadaslar and hedef_id not in giden:
        sonuc["istek"] = cek(op, "arkadas/istek", {"id": hedef_id})
    time.sleep(2)

    # NOT: mesaj gonderimi 'mesaj' gorevine tasindi (cift gonderim olmasin)

    # son durum
    time.sleep(1)
    a2 = cek(op, "arkadaslar") or {}
    sonuc["son_durum"] = {"arkadas": [x.get("ad") for x in (a2.get("arkadaslar") or [])],
                          "giden": [x.get("ad") for x in (a2.get("giden") or [])],
                          "gelen": [x.get("ad") for x in (a2.get("gelen") or [])]}
    return sonuc


def gorev_mesaj(op, komut):
    """komut.mesajlar listesindeki DM'leri gönderir (aynı mesajı iki kez göndermez)."""
    sonuc = []
    for m in (komut.get("mesajlar") or []):
        alici = m.get("alici") or "Karahan"
        metin = (m.get("metin") or "").strip()
        if not metin:
            continue
        # Oyun geçmişine bak: bu mesaj zaten gitmişse tekrar gönderme
        try:
            g = cek(op, "mesajlar/%s" % alici) or {}
            imza = metin[:40].lower()
            gitmis = any(imza in (x.get("metin") or "").lower() for x in (g.get("mesajlar") or []))
        except Exception:
            gitmis = False
        if gitmis:
            sonuc.append({"alici": alici, "atlandi": "zaten_gonderilmis"})
            continue
        r = mesaj_gonder(op, alici, metin)
        sonuc.append({"alici": alici, "sonuc": r})
        time.sleep(11)
    return {"mesajlar": sonuc}


def gorev_oda(op, komut):
    """Meslek odalarını okur; üye olduğumuz odanın aylık eğitimini (TP) alır."""
    od = cek(op, "odalar") or {}
    sonuc = {"odalar": [], "egitim": []}
    for o in (od.get("odalar") or []):
        sonuc["odalar"].append({k: o.get(k) for k in
                                ("kod", "ad", "uye", "aktif", "egitimAlindi", "aidat", "borc",
                                 "baskan", "kasa", "uyeler", "tp")})
        if o.get("uye") and o.get("aktif") and not o.get("egitimAlindi"):
            r = cek(op, "oda/egitim", {"oda": o.get("kod")})
            sonuc["egitim"].append({"oda": o.get("kod"), "sonuc": r})
            time.sleep(2)
    sonuc["uyelikler"] = [o.get("ad") for o in (od.get("odalar") or []) if o.get("uye")]
    return sonuc


def zincir(bekle_sn: int = 0, butce_dk: float = 0):
    """Kendini yeniden tetikler (7/24 zincir) — repository_dispatch + contents:write yeterli."""
    import base64 as b64
    import re as _re
    if bekle_sn:
        time.sleep(bekle_sn)
    # Günlük bütçe kontrolü (dakika) — 24 saatte harcanan süre
    if butce_dk:
        try:
            simdi_ms = time.time() * 1000
            kullanilan = 0.0
            yol = os.path.join(KOK, "loglar", "kosu.jsonl")
            for satir in open(yol, encoding="utf-8"):
                try:
                    d = json.loads(satir)
                except Exception:
                    continue
                if d.get("olay") == "kosu_bitti" and (simdi_ms - (d.get("ts") or 0)) <= 86_400_000:
                    kullanilan += float(d.get("gecen_dk") or 0)
            if kullanilan >= butce_dk:
                return {"durdu": "butce_doldu", "kullanilan_dk_24s": round(kullanilan, 1)}
        except Exception as e:
            pass
    try:
        cfg = open(os.path.join(".git", "config"), encoding="utf-8").read()
        m = _re.search(r"extraheader\s*=\s*Authorization:\s*basic\s+(\S+)", cfg)
        if not m:
            return {"hata": "token_okunamadi"}
        tok = b64.b64decode(m.group(1)).decode(errors="replace").split(":", 1)[1]
    except Exception as e:
        return {"hata": repr(e)[:200]}
    istek = urllib.request.Request(
        "https://api.github.com/repos/karahn/C-rak-bot/dispatches",
        data=json.dumps({"event_type": "zincir", "client_payload": {"kaynak": "bot"}}).encode(), method="POST",
        headers={"Authorization": "Bearer " + tok, "Accept": "application/vnd.github+json",
                 "Content-Type": "application/json", "User-Agent": "cirak-bot"})
    try:
        with urllib.request.urlopen(istek, timeout=30) as r:
            return {"durum": r.status}
    except urllib.error.HTTPError as e:
        return {"http": e.code, "govde": e.read().decode()[:200]}
    except Exception as e:
        return {"hata": repr(e)[:200]}


SEVIYE_DUKKANLARI = {
    2: ["Temizlik ürünleri", "Balıkçı", "Şarküteri", "Börekçi", "Çantacı", "Perdeci", "Kargo şubesi", "Kasap",
        "Nalbur", "Züccaciye", "Kitapçı", "Pet shop", "Fırın", "Kuaför", "Oyuncakçı", "Bebek mağazası"],
    3: ["Market", "Oto yıkama", "İnternet kafe", "Boya satıcısı", "Pastane", "Dönerci", "Ayakkabıcı",
        "Hırdavatçı", "Giyim mağazası", "Kafe", "Kuru temizleme"],
    4: ["Lastikçi", "Tatlıcı", "Bilgisayarcı", "Bisikletçi", "Pideci", "Oto yedek parça", "Lokanta", "Otopark"],
    5: ["Ziraat bayisi", "Halıcı", "Telefoncu", "Oto servis"],
    6: ["Emlakçı", "Seyahat acentesi", "Matbaa", "Kebapçı"],
    7: ["Sigorta acentesi", "Özel kurs", "Yapı marketi", "Güzellik salonu"],
    8: ["Mobilya", "Optik", "Spor salonu", "Bar", "Kreş"],
    9: ["Mali müşavir", "Beyaz eşya", "Elektronik mağazası", "Sürücü kursu", "Veteriner kliniği", "Araç kiralama"],
    10: ["Reklam ajansı", "Kuyumcu", "Oto galeri"],
    11: ["Hukuk bürosu", "Disko", "Diş kliniği"],
    12: ["Gümrük müşaviri", "Eczane", "Düğün salonu"],
}


def gorev_seviye_bildir(op, komut):
    """Seviye atladıysak yeni açılan dükkânları Karahan'a DM ile bildirir."""
    d = cek(op, "durum") or {}
    o = d.get("oyuncu") or {}
    sv = int(o.get("seviye") or 0)
    tp = o.get("tecrube")
    durum_dosya = os.path.join(KOK, "seviye-durum.json")
    onceki = 0
    try:
        onceki = int(json.load(open(durum_dosya, encoding="utf-8")).get("seviye") or 0)
    except Exception:
        pass
    sonuc = {"seviye": sv, "tp": tp, "onceki": onceki, "yeni_mi": sv > onceki}
    if sv > onceki:
        yeni = SEVIYE_DUKKANLARI.get(sv) or []
        metin = "Patron, SV%d oldum! Yeni açılan dükkânlar: %s" % (sv, ", ".join(yeni[:12]) if yeni else "-")
        if komut.get("otopark_yasak", True) and "Otopark" in metin:
            metin += " (Otopark hariç, senin dediğin gibi)"
        sonuc["mesaj"] = mesaj_gonder(op, komut.get("arkadas_ad") or "Karahan", metin[:295])
        sonuc["yeni_dukkanlar"] = yeni
        try:
            json.dump({"seviye": sv, "ts": simdi()}, open(durum_dosya, "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
        except Exception as e:
            sonuc["durum_yazma_hatasi"] = repr(e)
    return sonuc


def gorev_dukkan_ac(op, komut):
    """Boş parsel bulur, tür/fiyat listesini çeker ve uygun ilk dükkânı kiralar."""
    ilce = int(komut.get("ilce") or 2034)
    hedefler = komut.get("hedefler") or ["kargo", "oto_yikama"]
    adet = int(komut.get("adet") or 1)
    rezerv = float(komut.get("rezerv") or 10000)
    sonuc = {"ilce": ilce, "acilanlar": [], "secenekler": [], "denemeler": []}

    d = cek(op, "durum") or {}
    bakiye = ((d.get("oyuncu") or {}).get("bakiye") or 0) / 100
    sonuc["bakiye"] = bakiye
    cadde = cek(op, "cadde?ilce=%d" % ilce) or {}
    bos = [y for y in (cadde.get("yerler") or []) if not y.get("isletme")]
    sonuc["bos_parsel"] = len(bos)

    for y in bos:
        if len(sonuc["acilanlar"]) >= adet:
            break
        kb = cek(op, "kiralama/%s?ilce=%d" % (y.get("no"), ilce)) or {}
        if kb.get("hata"):
            sonuc["denemeler"].append({"no": y.get("no"), "hata": kb.get("hata")})
            continue
        turler = {t.get("kod"): t for t in (kb.get("turler") or [])}
        ruhsat = kb.get("ruhsat") or 0
        for kod in hedefler:
            t = turler.get(kod)
            if not t:
                continue
            kira = t.get("kira") or kb.get("kira") or 0
            toplam = (kira * 2 + (t.get("kurulum") or 0) + ruhsat) / 100
            kayit = {"no": y.get("no"), "tur": kod, "ad": t.get("ad"), "seviye": t.get("seviye"),
                     "kilitli": t.get("kilitli"), "toplam": toplam, "kurulum": (t.get("kurulum") or 0) / 100,
                     "kira": kira / 100}
            sonuc["secenekler"].append(kayit)
            if t.get("kilitli"):
                continue
            if bakiye - toplam < rezerv:
                kayit["neden_alinmadi"] = "para_yetmiyor"
                continue
            ad = (komut.get("ad_kalibi") or "Kalfa {tur}").replace("{tur}", t.get("ad") or kod)
            r = cek(op, "kirala", {"yerNo": y.get("no"), "tur": kod, "ad": ad, "ilceId": ilce})
            sonuc["acilanlar"].append({"tur": kod, "no": y.get("no"), "toplam": toplam, "sonuc": r})
            bakiye -= toplam
            break
    sonuc["kalan_bakiye"] = bakiye
    return sonuc


IBAN_YEDEK = "TR11 0077 7049 1600 7396 8972 10"


def iban_bul(op):
    try:
        hv = cek(op, "banka/havale") or {}
        ham = hv.get("ham") if isinstance(hv.get("ham"), dict) else {}
        h = hv.get("hesapNo") or ham.get("hesapNo")
        if h:
            return h
    except Exception:
        pass
    return IBAN_YEDEK


def gorev_mesaj_oku(op, komut):
    """Karahan'dan gelen YENI mesajlari okur; gerekirse akillica cevap yazar (tekrar yazmaz)."""
    kisi = komut.get("kisi") or komut.get("arkadas_ad") or "Karahan"
    r = cek(op, "mesajlar/%s" % kisi) or {}
    ms = r.get("mesajlar") or []
    alanlar = ("id", "benden", "giden", "metin", "zaman", "ts")
    kayit = [{k: m.get(k) for k in alanlar if k in m} for m in ms]
    gelenler = [m for m in ms if not (m.get("benden") or m.get("giden"))]
    son_gelen = gelenler[-1] if gelenler else None

    durum_dosya = os.path.join(KOK, "mesaj-durum.json")
    cevaplanan = 0
    try:
        cevaplanan = int(json.load(open(durum_dosya, encoding="utf-8")).get("son_id") or 0)
    except Exception:
        pass

    sonuc = {"kisi": kisi, "toplam": len(ms), "gelen_adet": len(gelenler),
             "son_gelen": son_gelen, "cevaplanan_id": cevaplanan, "son_mesajlar": kayit[-10:]}
    yeni = bool(son_gelen) and (son_gelen.get("id") or 0) > cevaplanan
    if yeni and komut.get("oto_cevap"):
        metin = (son_gelen.get("metin") or "").lower()
        if "iban" in metin or "hesap" in metin:
            cevap = ("Patron IBAN: %s - hesap adi Kalfa19. Gonderince hemen kargo (81.000 TL) + oto yikama "
                     "aciyorum. Tezgahlar tam gaz!" % iban_bul(op))
        elif any(x in metin for x in ("para", "milyon", "gonder", "yollad", "havale")):
            cevap = ("Mesajini aldim patron! IBAN: %s - parayi gonder, dukkanlari diziyorum: "
                     "kargo + oto yikama ilk sirada." % iban_bul(op))
        else:
            cevap = ("Mesajini aldim patron! Kasa 97.655 TL, tezgahlar calisiyor, oda uyeligim var. "
                     "Plan hazir: kargo + oto yikama, sonra oto servis (SV5) + emlakci (SV6).")
        sonuc["cevap"] = mesaj_gonder(op, kisi, cevap)
        sonuc["cevap_metni"] = cevap
    if son_gelen:
        try:
            json.dump({"son_id": son_gelen.get("id"), "ts": simdi()}, open(durum_dosya, "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
        except Exception as e:
            sonuc["durum_yazma_hatasi"] = repr(e)
    return sonuc


def gorev_havale(op, komut):
    """Gelen havaleleri listeler (Karahan'in para gonderip gonderemedigini gormek icin)."""
    hv = cek(op, "banka/havale") or {}
    gecmis = hv.get("gecmis") or []
    kayit = [{"id": g.get("id"), "kim": g.get("kim"), "tutar": (g.get("tutar") or 0) / 100,
              "aciklama": g.get("aciklama"), "giden": g.get("giden"),
              "ts": g.get("ts") or g.get("zaman")} for g in gecmis]
    return {"toplam": len(kayit), "gelenler": [g for g in kayit if not g.get("giden")][-10:],
            "son_hareketler": kayit[-10:], "hesap_no": hv.get("hesapNo"),
            "engel": hv.get("engel"), "ham": {k: v for k, v in hv.items() if k != "gecmis"}}


def gorev_banka(op, komut):
    """Banka durumu + hesap no (Karahan para gonderecekse lazim)."""
    b = cek(op, "banka") or {}
    return {"nakit": (b.get("nakit") or 0) / 100, "vadesiz": (b.get("vadesiz") or 0) / 100,
            "hesap_no": b.get("hesapNo"), "vadeliler": b.get("vadeliler"), "krediler": b.get("krediler"),
            "kredi_notu": b.get("krediNotu"), "ham_anahtarlar": list(b.keys())}


def gorev_isletmeler(op, komut):
    """Kalfa19'un mevcut dükkânlarını listeler — tür, ilçe, kasa bilgisi."""
    isl = cek(op, "isletmelerim") or []
    liste = isl if isinstance(isl, list) else (isl.get("isletmeler") or isl.get("liste") or [])
    sonuc = {"toplam": len(liste), "dukkanlar": [], "turler": set()}
    for d in liste:
        if isinstance(d, dict):
            tur = d.get("tur") or d.get("turKod") or "?"
            sonuc["turler"].add(tur)
            ilce = d.get("ilce", {})
            ilce_ad = ilce.get("ad") if isinstance(ilce, dict) else str(ilce)
            kasa = (d.get("kasa") or 0) / 100
            seviye = d.get("seviye") or d.get("sv")
            sonuc["dukkanlar"].append({
                "ad": d.get("ad", "?"), "tur": tur, "ilce": ilce_ad,
                "kasa": kasa, "seviye": seviye, "no": d.get("no") or d.get("id")
            })
    sonuc["turler"] = sorted(sonuc["turler"])
    sonuc["tur_sayisi"] = len(sonuc["turler"])
    return sonuc


def gorev_secim(op, komut):
    """Secimleri okur; Karahan aday ise raporlar (oy ucu netlesince oy verilecek)."""
    s = cek(op, "secim") or {}
    k14 = cek(op, "oyuncu-karti/14") or {}
    sonuc = {"secim": s}
    metin = json.dumps(s, ensure_ascii=False).lower()
    sonuc["karahan_geciyor"] = "karahan" in metin
    if isinstance(s, dict):
        for anahtar in ("adaylar", "adaylik", "secimler", "makamlar", "oylamalar"):
            if s.get(anahtar):
                sonuc[anahtar] = s.get(anahtar)
    sonuc["iliski"] = k14.get("iliski")
    return sonuc


def gorev_kaynak_indir(op, komut):
    """Listedeki JS dosyalarini indirir ve 'ara' kelimelerini baglamiyla cikarir."""
    import re
    KAY = os.path.join(KOK, "kaynak")
    os.makedirs(KAY, exist_ok=True)
    dosyalar = komut.get("dosyalar") or ["js/devlet.js", "js/banka.js"]
    ara = komut.get("ara") or ["oy", "aday", "baskan"]
    sonuc = {"inenler": [], "bulgular": {}}
    for d in dosyalar:
        url = d if d.startswith("http") else "https://oyunsitem.com/cirak/" + d.lstrip("/")
        kod, govde = cek_metin_kod(op, url)
        ad = d.split("/")[-1].split("?")[0]
        sonuc["inenler"].append({"dosya": d, "kod": kod, "boyut": len(govde)})
        if kod == 200 and len(govde) > 500:
            yaz(os.path.join(KAY, ad), govde)
            bulgular = []
            for kelime in ara:
                for m in list(re.finditer(re.escape(kelime), govde, re.I))[:4]:
                    parca = re.sub(r"\s+", " ", govde[max(0, m.start() - 150): m.start() + 170])
                    bulgular.append("[%s] %s" % (kelime, parca))
            if bulgular:
                yaz(os.path.join(KAY, "ara-" + ad + ".txt"), "\n\n".join(bulgular[:60]))
                sonuc["bulgular"][ad] = bulgular[:10]
        time.sleep(0.5)
    return sonuc


# ---------------------------------------------------------------- dükkân yönet
def gorev_dukkan_yonet(op, komut):
    """Tüm dükkânların kasasını toplar, biten rafları doldurur."""
    isl = cek(op, "isletmelerim") or []
    liste = isl if isinstance(isl, list) else (isl.get("isletmeler") or [])
    sonuc = {"toplam": len(liste), "kasa_toplanan": 0, "kasa_tl": 0.0,
             "raf_doldurulan": 0, "raf_tl": 0.0, "detay": [], "hatalar": []}
    for d in liste:
        if not isinstance(d, dict):
            continue
        id_ = d.get("id")
        ad = d.get("ad", "?")
        kasa = (d.get("kasa") or 0) / 100
        biten = d.get("bitenUrun") or 0
        hizmet = d.get("hizmet") or False
        durum = d.get("durum", "")
        if durum != "acik":
            continue
        det = {"ad": ad, "id": id_}
        # Kasa topla
        if kasa > 100:
            r = cek(op, "isletme/%s/kasa" % id_, {})
            if isinstance(r, dict) and "hata" not in r:
                tut = r.get("toplam") or r.get("tutar") or r.get("miktar") or 0
                if isinstance(tut, (int, float)):
                    sonuc["kasa_tl"] += tut / 100
                sonuc["kasa_toplanan"] += 1
                det["kasa"] = kasa
            time.sleep(0.5)
        # Raf doldur
        if not hizmet and biten > 0:
            stok = cek(op, "isletme/%s/stok" % id_)
            if isinstance(stok, dict) and "hata" not in stok:
                urunler = stok.get("urunler") or stok.get("raflar") or stok.get("liste") or []
                dold = 0
                for u in urunler:
                    if not isinstance(u, dict):
                        continue
                    mev = u.get("stok") or u.get("miktar") or 0
                    kap = u.get("kapasite") or u.get("raf") or u.get("max") or 0
                    kod = u.get("kod") or u.get("urun") or ""
                    if kap > 0 and mev < kap and kod:
                        eksik = kap - mev
                        r2 = cek(op, "isletme/%s/stok" % id_, {"urun": kod, "miktar": eksik})
                        if isinstance(r2, dict) and "hata" not in r2:
                            maliyet = (r2.get("tutar") or r2.get("maliyet") or 0)
                            if isinstance(maliyet, (int, float)):
                                sonuc["raf_tl"] += maliyet / 100
                            dold += 1
                        time.sleep(0.3)
                if dold > 0:
                    sonuc["raf_doldurulan"] += 1
                    det["raf"] = dold
            time.sleep(0.5)
        if det.get("kasa") or det.get("raf"):
            sonuc["detay"].append(det)
    return sonuc


# ---------------------------------------------------------------- günlük görev
def gorev_gunluk_gorev(op, komut):
    """Günlük görevleri kontrol eder, tamamlananların ödülünü alır."""
    g = cek(op, "gorevler") or {}
    sonuc = {"gun": g.get("gun"), "alindi": g.get("alindi", False),
             "gorevler": [], "odul_alindi": False}
    gorevler = g.get("gorevler") or []
    for gv in gorevler:
        if isinstance(gv, dict):
            sonuc["gorevler"].append({
                "ad": gv.get("ad", gv.get("kod", "?")),
                "tamam": gv.get("tamam", False),
                "ilerleme": gv.get("ilerleme"),
                "hedef": gv.get("hedef"),
            })
    hepsi = gorevler and all(x.get("tamam") for x in gorevler)
    if hepsi and not g.get("alindi"):
        r = cek(op, "gorevler/odul", {})
        if isinstance(r, dict) and "hata" not in r:
            sonuc["odul_alindi"] = True
            sonuc["odul_detay"] = r
    # Sezon ödülü
    z = cek(op, "sezon") or {}
    if z.get("odulHazir") or z.get("alinabilir"):
        r = cek(op, "sezon/odul", {})
        if isinstance(r, dict) and "hata" not in r:
            sonuc["sezon_odul"] = r
    return sonuc


# ---------------------------------------------------------------- mini oyun
def gorev_mini_oyun(op, komut):
    """Mini oyun oynar — antrenman (ücretsiz) + ödüllü teklif."""
    import random as _r
    sonuc = {"oynanan": 0, "puan": 0, "odul_tl": 0, "oyunlar": [], "hatalar": []}
    mo = cek(op, "mini-oyun") or {}
    teklif = mo.get("teklif")
    HIZLI = ["lokum", "sektir", "sayi", "hafiza", "eslestir"]
    # Ödüllü teklif
    if isinstance(teklif, dict) and teklif.get("id"):
        kod = teklif.get("kod", "?")
        try:
            r = cek(op, "mini-oyun/basla", {"id": teklif["id"]})
            if isinstance(r, dict) and "hata" not in r:
                puan = _r.randint(50, 75)
                time.sleep(3)
                r2 = cek(op, "mini-oyun/bitir", {"id": r.get("id") or r.get("oturumId"),
                                                  "jeton": r.get("jeton", ""), "puan": puan})
                if isinstance(r2, dict) and "hata" not in r2:
                    odul = (r2.get("odul") or 0) / 100
                    sonuc["oynanan"] += 1
                    sonuc["puan"] += puan
                    sonuc["odul_tl"] += odul
                    sonuc["oyunlar"].append({"kod": kod, "puan": puan, "odul": odul, "tur": "odullu"})
            time.sleep(2)
        except Exception as e:
            sonuc["hatalar"].append({"kod": kod, "hata": repr(e)[:200]})
    # Antrenman
    adet = int(komut.get("mini_oyun_adet") or 2)
    for kod in HIZLI[:adet]:
        try:
            r = cek(op, "mini-oyun/basla", {"kod": kod, "antrenman": True})
            if isinstance(r, dict) and "hata" not in r:
                puan = _r.randint(40, 70)
                time.sleep(3)
                r2 = cek(op, "mini-oyun/bitir", {"id": r.get("id") or r.get("oturumId"),
                                                  "jeton": r.get("jeton", ""), "puan": puan})
                if isinstance(r2, dict) and "hata" not in r2:
                    sonuc["oynanan"] += 1
                    sonuc["puan"] += puan
                    odul = (r2.get("odul") or 0) / 100
                    sonuc["odul_tl"] += odul
                    sonuc["oyunlar"].append({"kod": kod, "puan": puan, "odul": odul, "tur": "antrenman"})
            elif isinstance(r, dict):
                sonuc["hatalar"].append({"kod": kod, "hata": r.get("hata", "?")})
            time.sleep(1)
        except Exception as e:
            sonuc["hatalar"].append({"kod": kod, "hata": repr(e)[:200]})
    return sonuc


# ---------------------------------------------------------------- esnaf topla-baslat
def gorev_esnaf_topla(op, komut):
    """Esnaf kartı ile tüm tezgâhları topla ve yeniden başlat."""
    r = cek(op, "esnaf/topla-baslat", {})
    sonuc = {"sonuc": r}
    if isinstance(r, dict) and "hata" not in r:
        sonuc["basarili"] = True
        sonuc["toplanan"] = r.get("toplanan") or r.get("adet") or 0
        sonuc["baslatilan"] = r.get("baslatilan") or r.get("yeni") or 0
        sonuc["kazanc"] = (r.get("kazanc") or r.get("net") or 0) / 100
    elif isinstance(r, dict):
        sonuc["basarili"] = False
        sonuc["hata"] = r.get("hata", "?")
    return sonuc


GOREVLER = {"test": gorev_test, "durum": gorev_durum, "ham": gorev_ham, "yenilikler": gorev_yenilikler,
            "cerez-kontrol": gorev_cerez_kontrol, "kaynak": gorev_kaynak,
            "captcha-ornek": gorev_captcha_ornek, "bot": gorev_bot, "kesif": gorev_kesif,
            "ana-js": gorev_ana_js, "cadde-tara": gorev_cadde_tara,
            "arkadas-istek": gorev_arkadas_istek, "mesaj": gorev_mesaj, "oda": gorev_oda,
            "seviye-bildir": gorev_seviye_bildir, "dukkan-ac": gorev_dukkan_ac,
            "mesaj-oku": gorev_mesaj_oku, "havale": gorev_havale, "banka": gorev_banka,
            "secim": gorev_secim, "kaynak-indir": gorev_kaynak_indir,
            "isletmeler": gorev_isletmeler,
            "dukkan-yonet": gorev_dukkan_yonet, "gunluk-gorev": gorev_gunluk_gorev,
            "mini-oyun": gorev_mini_oyun, "esnaf-topla": gorev_esnaf_topla}


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

    # 7/24 zincir: kendini yeniden tetikle (repository_dispatch + contents:write yeterli)
    if komut.get("zincir"):
        z = zincir(bekle_sn=int(komut.get("zincir_bekle_sn") or 10),
                   butce_dk=float(komut.get("zincir_butce_dk") or 0))
        print("zincir:", json.dumps(z, ensure_ascii=False))
        yaz(os.path.join(RAK, "zincir.json"), json.dumps({"ts": simdi(), "sonuc": z}, ensure_ascii=False, indent=1))

    # Actions arayüzünde görünen özet
    adim = os.environ.get("GITHUB_STEP_SUMMARY")
    if adim:
        with open(adim, "a", encoding="utf-8") as f:
            f.write(md[:60000])
    return 0


if __name__ == "__main__":
    sys.exit(main())
