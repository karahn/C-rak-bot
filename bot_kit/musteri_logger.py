"""Müşteri akışı kaydedici: Şarküteri'nin müşteri/ciro/doluluk verisini düzenli örnekler.
Çıktı: musteri_log.jsonl  (her satır: ts, saat, dakika, musteri, ciro, gider, kaybedilen, doluluk, kasa)
Kullanım: python3 -u musteri_logger.py [dakika] [saniye_aralik]
"""
import json, os, sys, time

import oturum

DAKIKA = float(sys.argv[1]) if len(sys.argv) > 1 else 45
ARALIK = float(sys.argv[2]) if len(sys.argv) > 2 else 45
ISLETME = int(os.environ.get('ISLETME', '5522'))

def cek(op, yol, veri=None):
    return oturum.istek(op, yol, veri, bekle=3)

op = oturum.op_yukle()[0]
t0 = time.time()
n = 0
while time.time() - t0 < DAKIKA * 60:
    d = cek(op, f'isletme/{ISLETME}') or {}
    t = cek(op, 'seyyar') or {}
    tk = (t.get('takvim') or {})
    b = d.get('bugun') or {}
    satir = {
        'ts': int(time.time() * 1000), 'gercek_dk': round((time.time() - t0) / 60, 2),
        'saat': tk.get('saat'), 'dakika': tk.get('dakika'),
        'musteri': b.get('musteri', 0), 'ciro': b.get('ciro', 0) / 100,
        'gider': b.get('gider', 0) / 100, 'kaybedilen': b.get('kaybedilen', 0),
        'doluluk': d.get('doluluk'), 'kasa': (d.get('kasa') or 0) / 100,
        'durum': d.get('durum'),
    }
    with open('musteri_log.jsonl', 'a') as f:
        f.write(json.dumps(satir, ensure_ascii=False) + '\n')
    n += 1
    if n % 5 == 0:
        print(f"[{satir['gercek_dk']}dk] saat {satir['saat']}:{satir['dakika']:02d} | müşteri {satir['musteri']} | ciro {satir['ciro']:,.0f}₺ | kaçan {satir['kaybedilen']} | doluluk {satir['doluluk']}", flush=True)
    time.sleep(ARALIK)
print('logger bitti', flush=True)
