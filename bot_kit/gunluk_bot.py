"""Günlük ödül botu — her 10 dk kontrol eder, hazır olan ödülleri toplar:

1) bonus/al          → günlük giriş bonusu (7 günlük döngü; 7. gün 10.000₺)
2) sezon/odul        → haftalık sezon kademe ödülleri (ücretsiz olanlar)
3) mini-oyun → cark/kese/zar → günde 1 KEZ, GARANTİ ödüllü: basla → bitir(puan=100)
   • cark: bitir(100)          • kese: bitir(100, secim=0)   • zar: bitir(100)
4) mini-oyun teklif  → sokakta gelen oyun daveti varsa oyna (basla {id} → bitir(100))
5) oda/egitim        → esnaf (+5 TP) ve ticaret (+10 TP) aylık eğitim TP'leri

Log: gunluk_bot_log.jsonl · Kalp: gunluk_kalp.txt
"""
import importlib.util, json, os, time, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
_spec = importlib.util.spec_from_file_location('vc', os.path.join(HERE, 'veri_cek.py'))
vc = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(vc)
import sampiyon as sp  # SURELER + para_plan (ispatlı oyun)

ARALIK = int(os.environ.get('ARALIK_SN', '600'))   # 10 dk
LOG = 'gunluk_bot_log.jsonl'
KALP = 'gunluk_kalp.txt'
SANS = ('cark', 'kese', 'zar')


def logla(k):
    with open(LOG, 'a') as f:
        f.write(json.dumps({'t': int(time.time()), **k}, ensure_ascii=False) + '\n')


def kalp(s):
    with open(KALP, 'w') as f:
        f.write(s)


def guvenli(op, yol, veri=None):
    try:
        return vc.cek(op, yol, veri)
    except Exception as ex:
        logla({'olay': 'hata', 'yol': yol, 'hata': repr(ex)[:160]})
        return None


def oyna_sans(op, kod):
    """Şans oyununu oyna: basla → bitir(puan=100). Kese için secim=0."""
    b = guvenli(op, 'mini-oyun/basla', {'kod': kod})
    if not b or b.get('hata'):
        return None
    oid, jeton = b.get('id'), b.get('jeton')
    if not oid:
        return None
    time.sleep(2)
    veri = {'id': oid, 'jeton': jeton, 'puan': 100}
    if kod == 'kese':
        veri['secim'] = 0
    r = guvenli(op, 'mini-oyun/bitir', veri)
    if r and not r.get('hata'):
        logla({'olay': 'sans_oyun', 'kod': kod, 'odul': r.get('odul'), 'bakiye': r.get('bakiye')})
    return r


def main():
    op = vc.oturum()[0]
    logla({'olay': 'basladi'})
    son_teklif = None
    while True:
        try:
            yapilan = []

            # 1) günlük bonus
            b = guvenli(op, 'bonus')
            if b and not b.get('bugunAlindi') and b.get('siradaki') is not None:
                r = guvenli(op, 'bonus/al', {})
                if r and not r.get('hata'):
                    yapilan.append(f"bonus +{r.get('tutar', 0)/100:,.0f}₺")
                    logla({'olay': 'bonus', 'tutar': r.get('tutar')})

            # 2) sezon ödülleri
            s = guvenli(op, 'sezon')
            if s and not s.get('hata'):
                alinabilir = 0
                for k in (s.get('kademeler') or []):
                    u = k.get('ucretsiz') or {}
                    if k.get('ulasildi') and u and not u.get('alindi'):
                        alinabilir += 1
                if alinabilir:
                    r = guvenli(op, 'sezon/odul', {})
                    if r and not r.get('hata') and r.get('para'):
                        yapilan.append(f"sezon +{r['para']/100:,.0f}₺")
                        logla({'olay': 'sezon', 'para': r.get('para')})

            # 3) şans oyunları (günde 1)
            mo = guvenli(op, 'mini-oyun')
            if mo and not mo.get('hata'):
                for kod in SANS:
                    if (mo.get('sans') or {}).get(kod):
                        r = oyna_sans(op, kod)
                        if r and r.get('odul'):
                            yapilan.append(f"{kod} +{r['odul']/100:,.0f}₺")
                        time.sleep(2)

                # 4) oyun daveti (teklif) — gerçek süre + para için ispat
                t = mo.get('teklif')
                if t and t.get('id') and son_teklif != t.get('id'):
                    b2 = guvenli(op, 'mini-oyun/basla', {'id': t['id']})
                    if b2 and b2.get('id'):
                        kod = t.get('kod') or b2.get('kod') or ''
                        veri = {'id': b2['id'], 'jeton': b2.get('jeton'), 'puan': 100}
                        if kod == 'para' and b2.get('tohum'):
                            try:
                                tik, puan = sp.para_plan(b2['tohum'], 100)
                                veri['tik'] = tik; veri['puan'] = puan
                            except Exception as ex:
                                logla({'olay': 'para_plan_hata', 'hata': repr(ex)[:100]})
                        time.sleep(sp.SURELER.get(kod, 30))
                        r2 = guvenli(op, 'mini-oyun/bitir', veri)
                        if r2 and not r2.get('hata') and (r2.get('odul') or (r2.get('puan') or 0) > 0):
                            son_teklif = t.get('id')
                            yapilan.append(f"davet({kod}) +{(r2.get('odul') or 0)/100:,.0f}₺")
                            logla({'olay': 'davet_oyun', 'kod': kod, 'odul': r2.get('odul'), 'puan': r2.get('puan')})

            # 5) oda eğitimleri (aylık)
            od = guvenli(op, 'odalar')
            if od and not od.get('hata'):
                for o in (od.get('odalar') or []):
                    if o.get('uye') and o.get('aktif') and not o.get('egitimAlindi'):
                        r = guvenli(op, 'oda/egitim', {'oda': o['kod']})
                        if r and not r.get('hata') and r.get('tp'):
                            yapilan.append(f"oda/{o['kod']} +{r['tp']}TP")
                            logla({'olay': 'oda_egitim', 'oda': o['kod'], 'tp': r.get('tp')})
                        time.sleep(2)

            d = guvenli(op, 'durum') or {}
            o2 = d.get('oyuncu') or {}
            kalp(f"{datetime.datetime.now():%H:%M:%S} {'·'.join(yapilan) if yapilan else 'yeni ödül yok'}")
            if yapilan:
                logla({'olay': 'tur', 'yapilan': yapilan, 'tp': o2.get('tecrube'), 'bakiye': o2.get('bakiye')})
        except Exception as ex:
            logla({'olay': 'döngü_hatası', 'hata': repr(ex)[:160]})
        time.sleep(ARALIK)


if __name__ == '__main__':
    main()
