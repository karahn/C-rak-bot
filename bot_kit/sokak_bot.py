"""Sokak olayları botu — 'Mahallede birine yardım et' görevi + günlük ödül için.
GET sokak → uygun olay → POST sokak/katil {id, eylem}. Olaylar gelince katılır, görev ödülünü alır.
Çalıştır: python3 -u sokak_bot.py   (arka planda ~25 dk)
"""
import json, os, time

import oturum

EYLEM = {'kavga': 'ara155', 'ambulans': 'ara112', 'itfaiye': 'ara110',
         'cuzdan': 'ver', 'kedi': 'besle', 'muzisyen': 'bahsis'}
LOG = 'sokak_log.jsonl'
SURE_DK = float(os.environ.get('SURE_DK', 25))

def cek(op, yol, veri=None):
    return oturum.istek(op, yol, veri, bekle=3)

def logla(k):
    k['ts'] = int(time.time() * 1000)
    open(LOG, 'a').write(json.dumps(k, ensure_ascii=False) + '\n')

op = oturum.op_yukle()[0]
t0 = time.time()
katilinan = set()
print('sokak botu başladı', flush=True)
while time.time() - t0 < SURE_DK * 60:
    r = cek(op, 'sokak') or {}
    simdi = r.get('sunucuZamani', 0)
    olaylar = r.get('olaylar') or []
    foray = [o for o in olaylar if EYLEM.get(o['tur']) and not o.get('katildi') and o['id'] not in katilinan]
    for o in foray:
        if o['bas'] <= simdi + 2500 <= o['bit'] + 4000:
            k = cek(op, 'sokak/katil', {'id': o['id'], 'eylem': EYLEM[o['tur']]})
            katilinan.add(o['id'])
            logla({'olay': o['tur'], 'id': o['id'], 'eylem': EYLEM[o['tur']], 'sonuc': k})
            print(f"[{time.strftime('%H:%M:%S')}] KATILDI {o['tur']} → {json.dumps(k, ensure_ascii=False)}", flush=True)
            time.sleep(2)
    # en yakın olayı bildir
    yak = sorted(foray, key=lambda x: x['bas'])
    if yak and int((time.time() - t0)) % 60 < 20:
        kalan = round((yak[0]['bas'] - simdi) / 1000)
        print(f"  sıradaki: {yak[0]['tur']} ~{kalan} sn sonra", flush=True)
    # günlük görev ödülü
    g = cek(op, 'gorevler') or {}
    gs = g.get('gorevler') or []
    if gs and all(x.get('tamam') for x in gs) and not g.get('alindi'):
        r2 = cek(op, 'gorevler/odul', {})
        logla({'olay': 'gorev_odul', 'sonuc': r2})
        print(f"[{time.strftime('%H:%M:%S')}] GÖREV ÖDÜLÜ ALINDI → {json.dumps(r2, ensure_ascii=False)}", flush=True)
    time.sleep(18)
print('sokak botu bitti', flush=True)
