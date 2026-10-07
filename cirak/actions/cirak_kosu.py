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


GOREVLER = {"test": gorev_test, "durum": gorev_durum, "ham": gorev_ham}


# ---------------------------------------------------------------- özet yaz

def insan_ozeti(rapor, ad: str) -> str:
    s = ["# Çırak raporu — %s" % ad, "", "**Zaman:** %s UTC" % rapor.get("ts", simdi()), ""]
    o = rapor.get("oyuncu")
    if o:
        s += ["## Oyuncu", "", "| Alan | Değer |", "|---|---|",
              "| Ad | %s |" % o.get("kullaniciAdi"), "| Seviye | %s |" % o.get("seviye"),
              "| TP | %s |" % o.get("tecrube"), ""]
    uclar = rapor.get("uclar") or {}
    if uclar:
        s += ["## Uçlar", ""]
        for k, v in uclar.items():
            ozet = json.dumps(v, ensure_ascii=False)
            s.append("- `%s` → %s" % (k, ozet[:300] + ("…" if len(ozet) > 300 else "")))
        s.append("")
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
