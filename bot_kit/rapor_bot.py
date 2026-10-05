"""Rapor + Mesaj İzleme botu (süpervizörün 5. çocuğu).

Görev 1 — Periyodik durum raporu: 4 saatte bir (09:00–23:00 arası) Karahan'a kısa DM:
  kasa · keyif · sv/TP · Şarküteri dün neti · kargo bugün · bot durumu.

Görev 2 — Oyun içi mesaj izleme: Karahan'ın YENİ mesajını görünce gelen_mesajlar.jsonl'e
  yazar ve kısa OTOMATİK ONAY yollar. Böylece sessizlik = "botlar düşmüş" sinyali olur.

Kalp: rapor_kalp.txt · Log: rapor_bot_log.jsonl
"""
import importlib.util, json, os, time, datetime
from zoneinfo import ZoneInfo

TRT = ZoneInfo('Europe/Istanbul')  # oyun/gerçek saat = Türkiye saati (UTC+3)


def simdi_trt():
    return datetime.datetime.now(TRT)


HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
_spec = importlib.util.spec_from_file_location('vc', os.path.join(HERE, 'veri_cek.py'))
vc = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(vc)

ALICI = os.environ.get('RAPOR_ALICI', 'Karahan')
ISLETME = os.environ.get('ISLETME', '5522')
RAPOR_SAAT = float(os.environ.get('RAPOR_SAAT', '4'))
BLOK_BAS, BLOK_BIT = 9, 23      # rapor saatleri (Türkiye saati)
DONGU = 90                       # mesaj kontrol döngüsü (sn)

LOG = 'rapor_bot_log.jsonl'
KALP = 'rapor_kalp.txt'
GELEN = 'gelen_mesajlar.jsonl'
SON_RAPOR = 'son_rapor.txt'
SON_MESAJ = 'son_mesaj_id.txt'


def oku(yol, varsayilan=''):
    try:
        with open(yol) as f:
            return f.read().strip()
    except Exception:
        return varsayilan


def yaz(yol, icerik):
    with open(yol, 'w') as f:
        f.write(str(icerik))


def logla(kayit):
    with open(LOG, 'a') as f:
        f.write(json.dumps({'t': int(time.time()), **kayit}, ensure_ascii=False) + '\n')


def kalp(s):
    with open(KALP, 'w') as f:
        f.write(s)


def tl(kurus):
    return f"{kurus / 100:,.0f}".replace(',', '.')


def ack_gerekli(metin):
    """Kısa onaylara ('tamam', 'ok'…) robot cevap atma; soru/durum isteklerine at."""
    m = (metin or '').lower().strip()
    if len(m) <= 14 and any(k in m for k in ('tamam', 'ok', 'eyvallah', 'sağol', 'sagol', 'teşekkür', 'tesekkur', 'tsk')):
        return False
    anahtar = ('?', 'durum', 'naber', 'ne haber', 'nasıl', 'nasil', 'nerede', 'ne zaman', 'ne oldu', 'kaç')
    return any(k in m for k in anahtar) or len(m) > 60


def mesaj_gonder(op, metin):
    metin = metin[:300]
    r = vc.cek(op, 'mesaj', {'alici': ALICI, 'metin': metin})
    time.sleep(2)
    return r


def rapor_metni(op):
    try:
        d = vc.cek(op, 'durum') or {}
        o = d.get('oyuncu') or {}
        y = vc.cek(op, 'yasam') or {}
        s = vc.cek(op, 'isletme/' + ISLETME) or {}
        dun = s.get('dun') or {}
        net = (dun.get('ciro', 0) - dun.get('gider', 0))
        k = vc.cek(op, 'isletme/7820') or {}
        kb = k.get('bugun') or {}
        saat = simdi_trt().strftime('%H:%M')
        m = (f"📊 {saat} durum: kasa {tl(o.get('bakiye', 0))}₺"
             f" · keyif {y.get('keyif')}{y.get('simge', '')} ×{y.get('carpan')}"
             f" · sv{o.get('seviye')} TP {o.get('tecrube')}/{o.get('seviyeUst')}"
             f" · Şarküteri dün net {tl(net)}₺"
             f" · kargo bugün {tl(kb.get('ciro', 0))}₺ ({kb.get('musteri', 0)} müş)"
             f" · botlar ✓")
        return m[:300]
    except Exception as ex:
        logla({'olay': 'rapor_hata', 'hata': repr(ex)[:200]})
        return None


def main():
    op = vc.oturum()[0]
    logla({'olay': 'basladi'})
    # İlk kurulum: mevcut en büyük mesaj id'sini "görülmüş" say (eski mesajlara onay yağmasın)
    if not os.path.exists(SON_MESAJ):
        try:
            r = vc.cek(op, 'mesajlar/' + ALICI) or {}
            ms = r.get('mesajlar') or []
            yaz(SON_MESAJ, ms[-1]['id'] if ms else 0)
        except Exception:
            yaz(SON_MESAJ, 0)
    if not os.path.exists(SON_RAPOR):
        # ilk açılışta hemen bir rapor gönder
        yaz(SON_RAPOR, str(time.time() - RAPOR_SAAT * 3600 - 60))

    tur = 0
    while True:
        tur += 1
        try:
            simdi = simdi_trt()
            # ---- 1) Oyun içi mesaj kontrolü ----
            r = vc.cek(op, 'mesajlar/' + ALICI) or {}
            ms = r.get('mesajlar') or []
            try:
                son_id = int(oku(SON_MESAJ, '0') or 0)
            except Exception:
                son_id = 0
            yeni = [m for m in ms if (not m.get('benden')) and int(m.get('id', 0)) > son_id]
            if yeni:
                with open(GELEN, 'a') as f:
                    for m in yeni:
                        f.write(json.dumps({'t': int(time.time()), 'id': m['id'],
                                            'metin': m['metin']}, ensure_ascii=False) + '\n')
                yaz(SON_MESAJ, max(int(m['id']) for m in yeni))
                cevaplar = [m for m in yeni if ack_gerekli(m['metin'])]
                if cevaplar:
                    ack = (f"🤖 Aldım patron! Botlar ayakta ({simdi:%H:%M}). "
                           f"Oyun içi mesaj beni uyandırmaz; iş/istek olursa sohbetten yaz, anında bakarım.")
                    mesaj_gonder(op, ack)
                logla({'olay': 'yeni_mesaj', 'adet': len(yeni), 'idler': [m['id'] for m in yeni],
                       'onay_gitti': bool(cevaplar)})

            # ---- 2) Periyodik rapor ----
            try:
                son_rapor = float(oku(SON_RAPOR, '0') or 0)
            except Exception:
                son_rapor = 0
            if BLOK_BAS <= simdi.hour < BLOK_BIT and (time.time() - son_rapor) >= RAPOR_SAAT * 3600:
                metin = rapor_metni(op)
                if metin:
                    mesaj_gonder(op, metin)
                    yaz(SON_RAPOR, str(time.time()))
                    logla({'olay': 'rapor', 'metin': metin})

            kalp(f"{simdi:%H:%M} tur={tur} son_mesaj_id={son_id} yeni={len(yeni)}")
        except Exception as ex:
            logla({'olay': 'hata', 'hata': repr(ex)[:200]})
        time.sleep(DONGU)


if __name__ == '__main__':
    main()
