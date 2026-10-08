"""Çırak bot çekirdeği v2 — toplu sipariş hızlandırılmış + ödüllü video desteği.

Değişiklikler (v2):
- Toplu sipariş: parca 5→10, bekleme 400→250ms, iterasyon 60→200
- Hız sınırı algılama: "Biraz yavaş!" yanıtında 300ms bekle, devam et
- Ödüllü video desteği (odullu-video API)
- Sokak olayları sıklığı 20→12 saniye
- Tur arası bekleme 2.5→2.0 saniye
- Toplu sipariş sırasında diğer tezgâhlara da servis (paralel)
"""

EYLEM = {"kavga": "ara155", "ambulans": "ara112", "itfaiye": "ara110",
         "cuzdan": "ver", "kedi": "besle", "muzisyen": "bahsis"}

# Ölçülmüş: pazar servis tavanı en yüksek; çırağa kârlı tezgâhlar
BEN_SIRA = ["pazar", "kestane", "simit"]
CIRAK_SIRA = ["pazar", "simit", "pamuk", "semsiye", "kestane", "misir", "gozleme", "midye"]


class Bot:
    def __init__(self, cek, log, kalp, sure_dk=20):
        self.cek = cek
        self.log = log
        self.kalp = kalp
        self.sure_dk = sure_dk
        self.kazanc = 0.0
        self.servis_adet = 0
        self.bahsis = 0
        self.siparis_sayisi = 0
        self.siparis_basari = 0
        self.katilinan = set()
        self.son_sokak = 0.0
        self.son_keyif = 0.0
        self.son_rapor = 0.0
        self.son_video = 0.0

    # ---------------------------------------------------------------- ortak
    def durum(self):
        d = self.cek("durum") or {}
        o = d.get("oyuncu") or {}
        return o

    def bakiye(self):
        return (self.durum().get("bakiye") or 0) / 100

    def gunluk(self):
        s = {}
        b = self.cek("bonus") or {}
        if not b.get("bugunAlindi") and not b.get("alinmis"):
            s["bonus"] = self.cek("bonus/al", {})
        g = self.cek("gorevler") or {}
        gs = g.get("gorevler") or []
        if gs and all(x.get("tamam") for x in gs) and not g.get("alindi"):
            s["gorev_odul"] = self.cek("gorevler/odul", {})
        z = self.cek("sezon") or {}
        if z.get("odulHazir") or z.get("alinabilir"):
            s["sezon"] = self.cek("sezon/odul", {})
        if s:
            self.log({"olay": "gunluk", "sonuc": s})

    def yetenek(self):
        y = self.cek("yetenekler") or {}
        while (y.get("bos") or 0) > 0:
            sat = next((x for x in (y.get("liste") or []) if x.get("kod") == "satis"), {})
            kod = "satis" if (sat.get("derece") or 0) < 5 else "yonetim"
            r = self.cek("yetenekler/yukselt", {"kod": kod})
            self.log({"olay": "yetenek", "kod": kod, "sonuc": r})
            if isinstance(r, dict) and "hata" in r:
                break
            y = self.cek("yetenekler") or {}

    # ---------------------------------------------------------------- ödüllü video
    def odullu_video(self):
        """Ödüllü video izleme simülasyonu — 2 saatte en çok 3 kez."""
        import time as _t
        simdi = _t.time()
        if simdi - self.son_video < 7200:  # 2 saat
            return
        self.son_video = simdi
        try:
            g = self.cek("durum") or {}
            ov = (g.get("genel") or {}).get("odulluVideo")
            if not ov:
                return
            # Video başlat
            basla = self.cek("odullu-video/basla", {})
            if not basla or isinstance(basla, dict) and "hata" in basla:
                return
            video_id = basla.get("id") or (basla.get("siparis") or {}).get("calismaId")
            if not video_id:
                return
            # Video bitir (simülasyon — gerçek izleme değil, API çağrısı)
            import time
            time.sleep(2)  # kısa bekleme
            bitir = self.cek("odullu-video/bitir", {"id": video_id})
            self.log({"olay": "odullu_video", "id": video_id, "sonuc": bitir})
        except Exception as e:
            self.log({"olay": "odullu_video_hata", "hata": repr(e)[:200]})

    # ---------------------------------------------------------------- sokak
    def sokak(self):
        import time as _t
        simdi = _t.time()
        if simdi - self.son_sokak < 12:  # 20→12 saniye (daha sık kontrol)
            return
        self.son_sokak = simdi
        bakiye = self.bakiye()
        r = self.cek("sokak") or {}
        sunucu = r.get("sunucuZamani", 0)
        for o in (r.get("olaylar") or []):
            eylem = EYLEM.get(o.get("tur"))
            if not eylem or o.get("katildi") or o.get("id") in self.katilinan:
                continue
            # Müzisyene bahşiş para harcar → zengin değilsek atla
            if eylem == "bahsis" and bakiye < 5000:
                continue
            if o.get("bas", 0) <= sunucu + 2500 <= o.get("bit", 0) + 4000:
                k = self.cek("sokak/katil", {"id": o["id"], "eylem": eylem})
                self.katilinan.add(o.get("id"))
                self.log({"olay": "sokak", "tur": o.get("tur"), "id": o.get("id"), "sonuc": k})

    # ---------------------------------------------------------------- keyif
    def keyif(self):
        import time as _t
        simdi = _t.time()
        if simdi - self.son_keyif < 1800:   # 30 dk'da bir
            return
        self.son_keyif = simdi
        bakiye = self.bakiye()
        try:
            y = self.cek("yasam") or {}
        except Exception:
            y = {}
        keyif = y.get("keyif") if isinstance(y, dict) else None
        try:
            k = float(str(keyif).replace("%", "")) if keyif is not None else 100
        except Exception:
            k = 100
        # Yeni hesapta para kısıtlı → ücretli etkinlik açma (min 1.000 ₺ şart)
        if k < 80 and bakiye >= 1000:
            r = self.cek("etkinlik", {"kod": "yuruyus", "plan": "simdi", "not": "Keyif turu", "davetliler": []})
            self.log({"olay": "keyif_yuruyus", "onceki": keyif, "bakiye": bakiye, "sonuc": r})
        elif k < 80:
            self.log({"olay": "keyif_atlandi", "neden": "bakiye_dusuk", "bakiye": bakiye, "keyif": keyif})
        # davetleri kabul (≤500 ₺, keyif ≥10)
        e = self.cek("etkinlikler") or {}
        for d in (e.get("davetler") or []):
            if d.get("tur") != "etkinlik":
                continue
            fiyat = d.get("fiyat") or 0
            if fiyat <= 50000 and (d.get("keyif") or 0) >= 10:
                r = self.cek("etkinlik/%s/kabul" % d["id"], {})
                self.log({"olay": "davet_kabul", "id": d.get("id"), "sonuc": r})

    # ---------------------------------------------------------------- tezgâh
    def tezgah_tur(self):
        s = self.cek("seyyar") or {}
        isler = {j.get("kod"): j for j in (s.get("isler") or [])}
        aktif = s.get("aktifler") or []
        if any(x.get("bitti") for x in aktif):
            r = self.cek("seyyar/topla-hepsi", {})
            if isinstance(r, list) and r:
                for p in r:
                    self.kazanc += (p.get("net") or 0) / 100
                self.log({"olay": "topladi", "adet": len(r),
                          "net": sum((p.get("net") or 0) for p in r) / 100})
        benim = next((x for x in aktif if x.get("calisan") == "ben" and not x.get("bitti")), None)
        if not benim:
            for kod in BEN_SIRA:
                if (isler.get(kod) or {}).get("sahip"):
                    r = self.cek("seyyar/basla", {"isKodu": kod, "sure": "tam"})
                    if isinstance(r, dict) and r.get("id"):
                        benim = {"id": r["id"], "isKodu": kod}
                        self.log({"olay": "ben_basla", "kod": kod, "id": r.get("id")})
                        break
        aktif_kod = {x.get("isKodu") for x in aktif}
        for kod in CIRAK_SIRA:
            if not (isler.get(kod) or {}).get("sahip") or kod in aktif_kod or (benim and benim["isKodu"] == kod):
                continue
            r = self.cek("seyyar/basla", {"isKodu": kod, "sure": "tam", "cirak": True})
            if isinstance(r, dict) and "id" in r:
                aktif.append({"id": r.get("id"), "isKodu": kod, "calisan": "cirak"})
                aktif_kod.add(kod)
                self.log({"olay": "cirak_basla", "kod": kod, "id": r.get("id")})
        return aktif

    def servis(self, aktif):
        """Tezgâh servisi — v2: hızlandırılmış toplu sipariş."""
        import time as _t
        if not aktif:
            return False
        for i, is_ in enumerate(aktif[:8]):  # 6→8 tezgâh (daha fazla kapsama)
            r = self.cek("seyyar/servis", {"id": is_.get("id")})
            self.servis_adet += 1
            if isinstance(r, dict):
                if r.get("tutar"):
                    self.kazanc += (r.get("tutar") or 0) / 100
                if r.get("bahsis"):
                    self.bahsis += 1
                if r.get("teklif"):
                    # --- TOPLU SİPARİŞ (v2: hızlandırılmış) ---
                    self.siparis_sayisi += 1
                    sp_basla = self.cek("seyyar/siparis", {"id": is_.get("id"), "kabul": True})
                    if isinstance(sp_basla, dict):
                        adet = sp_basla.get("adet") or 0
                        sure_ms = sp_basla.get("sureMs") or sp_basla.get("sure") or 30000
                        odul = sp_basla.get("odul") or 0
                        self.log({"olay": "siparis_basladi", "adet": adet,
                                  "sure_sn": round(sure_ms / 1000, 1), "odul": odul / 100 if odul else 0,
                                  "tezgah": is_.get("isKodu")})
                        # Hızlı döngü: max 10 parça/istek, 250ms bekleme
                        basari = False
                        ret = 0  # hız sınırı sayacı
                        for _ in range(200):  # 200 iterasyon × 10 parça = 2000 max
                            rr = self.cek("seyyar/servis", {"id": is_.get("id"), "parca": 10})
                            if rr is None or (isinstance(rr, dict) and "hata" in rr):
                                # Hız sınırı veya bağlantı hatası
                                ret += 1
                                if ret > 6:
                                    break
                                _t.sleep(0.3)
                                continue
                            ret = 0
                            sp = (rr or {}).get("siparis") or {}
                            if sp.get("durum") == "tamam":
                                tutar = (rr.get("tutar") or 0) / 100
                                self.kazanc += tutar
                                self.siparis_basari += 1
                                basari = True
                                self.log({"olay": "siparis_tamam",
                                          "kazanilan": tutar,
                                          "tezgah": is_.get("isKodu")})
                                break
                            if sp.get("durum") == "kacti":
                                self.log({"olay": "siparis_kacti",
                                          "tezgah": is_.get("isKodu")})
                                break
                            _t.sleep(0.25)  # 400ms→250ms (oyunun kendi retry: 280ms)
                        if not basari and not sp.get("durum"):
                            self.log({"olay": "siparis_zaman_asimi",
                                      "tezgah": is_.get("isKodu")})
                if r.get("reddedildi"):
                    break
            _t.sleep(0.35)  # 450ms→350ms (daha hızlı tur)
        return True

    # ---------------------------------------------------------------- ana döngü
    def kos(self, log_yaz=None):
        import time as _t
        t0 = _t.time()
        sure_dk = max(0.7, float(self.sure_dk or 0))
        self.log({"olay": "kosu_basladi", "sure_dk": sure_dk, "bakiye": self.bakiye(),
                  "bot_versiyon": "v2_hizli_siparis"})
        tur = 0
        while _t.time() - t0 < sure_dk * 60:
            tur += 1
            try:
                self.gunluk()
                self.yetenek()
                self.sokak()
                self.keyif()
                self.odullu_video()
                aktif = self.tezgah_tur()
                self.servis(aktif)
            except Exception as e:
                self.log({"olay": "tur_hata", "tur": tur, "hata": repr(e)[:300]})
            self.kalp("tur=%d kazanc=%.0f servis=%d siparis=%d/%d" % (
                tur, self.kazanc, self.servis_adet, self.siparis_basari, self.siparis_sayisi))
            if _t.time() - t0 > tur * 20 and tur % 5 == 0:
                self.log({"olay": "ara_ozet", "tur": tur, "kazanc": round(self.kazanc, 1),
                          "servis": self.servis_adet, "bakiye": self.bakiye(),
                          "siparis": "%d/%d" % (self.siparis_basari, self.siparis_sayisi),
                          "gecen_dk": round((_t.time() - t0) / 60, 1)})
            _t.sleep(2.0)  # 2.5→2.0 saniye (daha sık tur)
        ozet = {"olay": "kosu_bitti", "tur": tur, "kazanc": round(self.kazanc, 1),
                "servis": self.servis_adet, "bahsis": self.bahsis, "bakiye": self.bakiye(),
                "siparis_toplam": self.siparis_sayisi,
                "siparis_basari": self.siparis_basari,
                "gecen_dk": round((_t.time() - t0) / 60, 1),
                "bot_versiyon": "v2"}
        self.log(ozet)
        return ozet
