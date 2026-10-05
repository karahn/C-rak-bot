"""Keyif Botu — Karahan'ın talimatı: "keyfini %80'in üstünde tut, doğa yürüyüşü 3 saatte bir 3 tane üst üste".

Mekanik (doğrulandı):
  • Keyif 80–100 "Dinç" → kendi çalıştığın işlerde +%8 kazanç.
  • Doğa yürüyüşü: 64,80 ₺ · +13 keyif · 180 dk · en ucuz keyif kaynağı (5 ₺/puan).
  • Aynı anda en çok 3 etkinlik (kendi düzenlediğin).
  • Kendi işini yapmak keyfi düşürür; keyif boşta saatte +1 (60'a doğru).

Bot döngüsü (her ~4 dk):
  1) keyif + aktif etkinliklerimi çek.
  2) Karahan'dan gelen uygun davetleri (etkinlik, ≤500 ₺, keyif≥10) OTOMATİK KABUL et.
  3) Aktif yürüyüş < 3 ve keyif < 92 → boş slotları yürüyüşle doldur.
  4) Log + kalp.
"""
import importlib.util, json, math, os, sys, time, datetime
from zoneinfo import ZoneInfo

TRT = ZoneInfo('Europe/Istanbul')  # oyun/gerçek saat = Türkiye saati (UTC+3)


def simdi_trt():
    return datetime.datetime.now(TRT)


HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
_SPEC = importlib.util.spec_from_file_location('vc', os.path.join(HERE, 'veri_cek.py'))
vc = importlib.util.module_from_spec(_SPEC); _SPEC.loader.exec_module(vc)

ARALIK = int(os.environ.get('ARALIK_SN', '240'))     # kontrol aralığı
KEYIF_ESIK = int(os.environ.get('KEYIF_ESIK', '95')) # bu değerin altındaysa yürüyüş başlat (hedef: hep 95-100)
MIN_BAKIYE = 50000                                    # 500 ₺ altındaysa harcama yapma
DAVET_MAX = 50000                                     # 500 ₺'ye kadar otomatik kabul
YURUYUS_KEYIF = 13                                    # doğa yürüyüşü başına keyif

LOG = 'keyif_bot_log.jsonl'
KALP = 'keyif_kalp.txt'
BEN = __import__('os').environ.get('BEN', 'arastirmaci42')


def logla(kayit):
    with open(LOG, 'a') as f:
        f.write(json.dumps({'t': int(time.time()), **kayit}, ensure_ascii=False) + '\n')


def kalp(yaz):
    with open(KALP, 'w') as f:
        f.write(str(yaz))


def davetleri_kabul(op):
    """Karahan'dan (veya başkasından) gelen uygun etkinlik davetlerini kabul et."""
    try:
        e = vc.cek(op, 'etkinlikler') or {}
    except Exception as ex:
        return []
    kabul = []
    for d in (e.get('davetler') or []):
        if d.get('tur') != 'etkinlik':
            continue
        fiyat = d.get('fiyat', 0) or 0
        keyif = d.get('keyif', 0) or 0
        if keyif >= 10 and fiyat <= DAVET_MAX:
            r = vc.cek(op, f'etkinlik/{d["id"]}/kabul', {})
            if r and r.get('kabul'):
                kabul.append({'id': d['id'], 'ad': d.get('ad'), 'fiyat': fiyat, 'keyif': keyif})
                logla({'olay': 'davet_kabul', **kabul[-1]})
    return kabul


def main():
    op = vc.oturum()[0]
    logla({'olay': 'basladi'})
    tur = 0
    while True:
        tur += 1
        try:
            y = vc.cek(op, 'yasam') or {}
            d = vc.cek(op, 'durum') or {}
            bakiye = (d.get('oyuncu') or {}).get('bakiye', 0) or 0
            keyif = y.get('keyif', 0)
            carpan = y.get('carpan')

            kabul = davetleri_kabul(op)
            if kabul:
                time.sleep(2)
                y = vc.cek(op, 'yasam') or {}
                keyif = y.get('keyif', 0); carpan = y.get('carpan')

            # kendi aktif etkinliklerim
            e = vc.cek(op, 'etkinlikler') or {}
            aktif = [o for o in (e.get('odalar') or [])
                     if o.get('sahip') == BEN and o.get('tur') == 'etkinlik' and not o.get('bitti')]

            baslatilan = []
            if keyif < KEYIF_ESIK and bakiye >= MIN_BAKIYE:
                # hedefe (100) ulaşmak için gereken yürüyüş sayısı — israf yok, en fazla boş slot kadar
                gerekli = max(1, math.ceil((100 - keyif) / YURUYUS_KEYIF))
                bos = max(0, 3 - len(aktif))
                for i in range(min(gerekli, bos)):
                    r = vc.cek(op, 'etkinlik', {'kod': 'yuruyus', 'plan': 'simdi',
                                                'not': 'Keyif turu', 'davetliler': []})
                    if r and r.get('id'):
                        baslatilan.append(r['id'])
                        keyif = r.get('keyif', keyif)
                        carpan = None
                    else:
                        break
                    time.sleep(2)

            if baslatilan:
                time.sleep(2)
                y2 = vc.cek(op, 'yasam') or {}
                keyif = y2.get('keyif', keyif); carpan = y2.get('carpan')

            logla({'olay': 'kontrol', 'tur': tur, 'keyif': keyif, 'carpan': carpan,
                   'seviye': y.get('seviye'), 'aktif': len(aktif) + len(baslatilan),
                   'baslatilan': baslatilan, 'kabul': kabul, 'bakiye': bakiye})
            kalp(f"{simdi_trt():%H:%M:%S} keyif={keyif} aktif={len(aktif)+len(baslatilan)} +{len(baslatilan)}")
        except Exception as ex:
            logla({'olay': 'hata', 'hata': repr(ex)[:200]})
        time.sleep(ARALIK)


if __name__ == '__main__':
    main()
