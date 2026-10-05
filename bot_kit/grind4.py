"""Seyyar kazanç botu v4 — dükkân ölçüm sermayesi (araştırma hesabı).

- "ben" işi: Pazar tezgâhı (en yüksek gerçekleşen ₺/dk) + vardiya boyunca bizzat servis (balon + bahşiş).
- "çırak" işi: Simitçi (pasif ek gelir).
- Her adımı loglar, kalp atışı dosyası yazar, hatada bekleyip yeniden dener.
- Bakiye HEDEF'e ulaşınca durur ve 'hazir.json' yazar.
"""
import json, os, time, traceback

import oturum

HEDEF = float(os.environ.get('HEDEF_BAL', 126100))
MAKS_DK = float(os.environ.get('MAKS_DK', 170))
LOG = os.environ.get('GRIND_LOG', 'grind4_log.jsonl')
DUR = os.environ.get('GRIND_DUR', 'grind4_durum.json')
HB = 'grind4_kalp.txt'


def oturum_ac():
    return oturum.op_yukle()[0]


def cek(op, yol, veri=None):
    return oturum.istek(op, yol, veri)

def logla(k):
    k['ts'] = int(time.time()*1000)
    with open(LOG, 'a') as f:
        f.write(json.dumps(k, ensure_ascii=False) + '\n')

def kalp(ek=''):
    open(HB, 'w').write(f"{int(time.time()*1000)} {ek}\n")

def durum_yaz(o):
    json.dump(o, open(DUR, 'w'), ensure_ascii=False, indent=1)

class Bot:
    def __init__(self):
        self.op = oturum_ac()
        self.t0 = time.time()
        self.tur = 0
        self.servis_kazanc = 0.0
        self.servis_adet = 0
        self.bahsis = 0
        self.bitis_zaman = None

    def durum(self):
        d = cek(self.op, 'durum') or {}
        o = d.get('oyuncu') or {}
        return (o.get('bakiye') or 0)/100, (o.get('seviye') or 1), o

    def topla(self):
        r = cek(self.op, 'seyyar/topla-hepsi', {})
        if isinstance(r, list) and r:
            for p in r:
                logla({'olay': 'topladi', 'kod': p.get('isKodu'), 'ciro': (p.get('ciro') or 0)/100,
                       'malzeme': (p.get('malzeme') or 0)/100, 'cirakUcreti': (p.get('cirakUcreti') or 0)/100,
                       'net': (p.get('net') or 0)/100, 'calisan': p.get('calisan'), 'olaylar': p.get('olaylar')})
            return r
        return None

    def gorev(self):
        g = cek(self.op, 'gorevler') or {}
        gs = g.get('gorevler') or []
        if gs and all(x.get('tamam') for x in gs) and not g.get('alindi'):
            r = cek(self.op, 'gorevler/odul', {})
            logla({'olay': 'gorev_odul', 'sonuc': r})

    def yetenek(self):
        y = cek(self.op, 'yetenekler') or {}
        while (y.get('bos') or 0) > 0:
            sat = next((x for x in y['liste'] if x['kod'] == 'satis'), {})
            kod = 'satis' if (sat.get('derece') or 0) < 5 else 'yonetim'
            r = cek(self.op, 'yetenekler/yukselt', {'kod': kod})
            logla({'olay': 'yetenek', 'kod': kod, 'sonuc': r})
            if 'hata' in r: break
            y = cek(self.op, 'yetenekler') or {}

    def bonus(self):
        try:
            b = cek(self.op, 'bonus') or {}
            if b.get('sonraki') and not b.get('bugunAlindi'):
                r = cek(self.op, 'bonus/al', {})
                logla({'olay': 'bonus', 'sonuc': r})
        except Exception:
            pass

    def havale_kontrol(self):
        """Gelen havaleleri izle, yeni olanları logla (oyuncu desteği takibi)."""
        try:
            hv = cek(self.op, 'banka/havale') or {}
            gecmis = hv.get('gecmis') or []
            try:
                gorulen = set(json.load(open('havale_gorulen.json')))
            except Exception:
                gorulen = set()
            yeni = [g for g in gecmis if g.get('id') not in gorulen and not g.get('giden')]
            for g in yeni:
                logla({'olay': 'havale_geldi', 'hv_id': g.get('id'), 'kim': g.get('kim'),
                       'tutar': (g.get('tutar') or 0)/100, 'aciklama': g.get('aciklama')})
                gorulen.add(g.get('id'))
            if yeni:
                json.dump(sorted(x for x in gorulen if x is not None), open('havale_gorulen.json', 'w'))
            return yeni
        except Exception:
            return []

    def basla(self, kod):
        r = cek(self.op, 'seyyar/basla', {'isKodu': kod, 'sure': 'tam'})
        logla({'olay': 'basla', 'kod': kod, 'sonuc': r})
        return r

    def servis(self, is_id):
        r = cek(self.op, 'seyyar/servis', {'id': is_id})
        if r.get('reddedildi') or r.get('hata'):
            return False
        t = r.get('tutar') or 0
        if t > 0:
            self.servis_kazanc += t/100; self.servis_adet += 1
            if r.get('bahsis'): self.bahsis += 1
        if r.get('teklif'):
            k = cek(self.op, 'seyyar/siparis', {'id': is_id, 'kabul': True})
            logla({'olay': 'siparis_kabul', 'sonuc': k})
            for _ in range(80):
                rr = cek(self.op, 'seyyar/servis', {'id': is_id, 'parca': 5})
                sp = rr.get('siparis') or {}
                if sp.get('durum') == 'tamam':
                    self.servis_kazanc += (rr.get('tutar') or 0)/100
                    logla({'olay': 'siparis_tamam', 'tutar': (rr.get('tutar') or 0)/100}); break
                if sp.get('durum') == 'kacti':
                    logla({'olay': 'siparis_kacti'}); break
                time.sleep(0.35)
        return True

    def dongu(self):
        self.tur += 1
        s = cek(self.op, 'seyyar') or {}
        aktif = s.get('aktifler') or []
        if any(x.get('bitti') for x in aktif):
            self.topla()
        self.gorev(); self.yetenek()
        bakiye, seviye, oy = self.durum()
        if bakiye >= HEDEF:
            logla({'olay': 'hedef_tam', 'bakiye': bakiye})
            json.dump({'durum': 'hazir', 'bakiye': bakiye, 'seviye': seviye, 'tur': self.tur}, open('grind4_hazir.json','w'), ensure_ascii=False, indent=1)
            return False
        s = cek(self.op, 'seyyar') or {}
        isler = {j['kod']: j for j in (s.get('isler') or [])}
        aktif = s.get('aktifler') or []
        bitmemis = [x for x in aktif if not x.get('bitti')]
        # ÇOKLU ÇIRAK: kendim en iyi tezgâhta, çırak diğer kârlı tezgâhlarda (ölçüldü: birim başına pozitif net)
        BEN_SIRA = ['pazar', 'kestane']                       # kendim çalışacağım (pazar servis tavanı en yüksek)
        CIRAK_SIRA = ['pazar', 'simit', 'pamuk', 'semsiye', 'kestane', 'misir', 'gozleme', 'midye']  # çırağa verilecekler (ayakkabı/su hariç: zarar)
        benim = next((x for x in bitmemis if x.get('calisan') == 'ben'), None)
        if not benim:
            for kod in BEN_SIRA:
                j = isler.get(kod) or {}
                if j.get('sahip'):
                    r = self.basla(kod)
                    if 'id' in r:
                        benim = {'id': r['id'], 'isKodu': kod, 'bitis': None}
                        break
            if not benim:
                bakiye, seviye, _ = self.durum()
                logla({'olay': 'bekle_tezgah', 'bakiye': bakiye})
                return True
        # tüm sahip olunan kârlı tezgâhları çırağa ver
        aktif_kod = {x['isKodu'] for x in bitmemis}
        for kod in CIRAK_SIRA:
            j = isler.get(kod) or {}
            if not j.get('sahip') or kod in aktif_kod or (benim and benim['isKodu'] == kod):
                continue
            r = self.basla(kod)
            logla({'olay': 'cirak_basla', 'kod': kod, 'sonuc': r})
        # DÖNER SERVİS: kendi + çırak tezgâhlarının TÜMÜNÜ servis et (canlı test: servis tavanları dolar, ciro 2-9x)
        kimlikler = [(x['id'], x['isKodu']) for x in bitmemis]
        i = 0; son_kontrol = time.time()
        while True:
            if kimlikler:
                is_id, kod = kimlikler[i % len(kimlikler)]; i += 1
                ok = self.servis(is_id)
                if i % 6 == 0:
                    kalp(f"servis {kod} id={is_id} ok={ok} kazanc={round(self.servis_kazanc,1)}")
                time.sleep(0.45 if ok else 1.0)
            else:
                time.sleep(1.5)
            if time.time() - son_kontrol > 25:
                son_kontrol = time.time()
                s2 = cek(self.op, 'seyyar') or {}
                bit = [x for x in (s2.get('aktifler') or []) if not x.get('bitti')]
                kimlikler = [(x['id'], x['isKodu']) for x in bit]
                self.havale_kontrol()
                bakiye, seviye, _ = self.durum()
                durum_yaz({'tur': self.tur, 'bakiye': bakiye, 'seviye': seviye,
                           'servis_kazanc': round(self.servis_kazanc,2), 'servis_adet': self.servis_adet,
                           'bahsis': self.bahsis, 'sure_dk': round((time.time()-self.t0)/60,1)})
                if not bit:
                    break
            if (time.time() - self.t0) > MAKS_DK*60:
                break
        r = self.topla()
        bakiye, seviye, _ = self.durum()
        durum_yaz({'tur': self.tur, 'bakiye': bakiye, 'seviye': seviye,
                   'servis_kazanc': round(self.servis_kazanc,2), 'servis_adet': self.servis_adet,
                   'bahsis': self.bahsis, 'sure_dk': round((time.time()-self.t0)/60,1)})
        return (time.time() - self.t0) < MAKS_DK*60

    def calistir(self):
        logla({'olay': 'baslangic'})
        s = cek(self.op, 'seyyar') or {}
        if not (s.get('izin') or {}).get('var'):
            cek(self.op, 'seyyar/izin', {})
        self.topla(); self.gorev(); self.bonus(); self.yetenek()
        calis = True
        while calis:
            try:
                calis = self.dongu()
            except Exception:
                logla({'olay': 'hata', 'iz': traceback.format_exc()[-800:]})
                time.sleep(20)
        bakiye, seviye, _ = self.durum()
        logla({'olay': 'bitis', 'bakiye': bakiye, 'seviye': seviye,
               'sure_dk': round((time.time()-self.t0)/60,1), 'servis_kazanc': round(self.servis_kazanc,2)})

if __name__ == '__main__':
    Bot().calistir()
