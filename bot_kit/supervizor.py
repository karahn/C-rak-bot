"""Süpervizör — tüm botları TEK süreç altında çalıştırır; düşen botu 3 sn içinde yeniden başlatır.

Botlar:
  1) grind4   → 6 tezgâhı döner servisle işler, hasat toplar, hedefte durur
  2) sokak    → mahalle olaylarını (cüzdan/ihbar vs.) yakalar, günlük görev ödülünü alır
  3) logger   → Şarküteri müşteri/ciro/doluluk ölçümü kaydeder
  4) keyif    → Karahan talimatı: keyif >80'de tut — 3 saatte bir 3x doğa yürüyüşü; davetleri kabul eder
  5) rapor    → 4 saatte bir Karahan'a durum DM'i; oyun içi mesajlarını izler + otomatik onay yollar
  6) gunluk   → günlük bonus, sezon ödülü, şans oyunları (çark/kese/zar), oyun davetleri, oda eğitimi TP
  7) sampiyon → haftalık mini oyun sıralaması koşusu (kaldığı yerden devam eder)

Kullanım:  python3 -u supervizor.py     (tek komutla hepsi)
Durum:     supervizor_log.txt  +  kalp dosyaları (grind4_kalp.txt vb.)
"""
import os, subprocess, sys, time, datetime
from zoneinfo import ZoneInfo

TRT = ZoneInfo('Europe/Istanbul')

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
LOG = 'supervizor_log.txt'
PY = sys.executable or 'python3'

def yaz(msg):
    satir = f"{datetime.datetime.now(TRT).strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    with open(LOG, 'a') as f:
        f.write(satir + '\n')
    print(satir, flush=True)

BOTS = [
    ('grind',  [PY, '-u', 'grind4.py'],   {**os.environ, 'HEDEF_BAL': '400000', 'MAKS_DK': '600'}),
    ('sokak',  [PY, '-u', 'sokak_bot.py'],{**os.environ, 'SURE_DK': '25'}),
    ('logger', [PY, '-u', 'musteri_logger.py', '150', '50'], dict(os.environ)),
    ('keyif',  [PY, '-u', 'keyif_bot.py'], dict(os.environ)),
    ('rapor',  [PY, '-u', 'rapor_bot.py'], dict(os.environ)),
    ('gunluk', [PY, '-u', 'gunluk_bot.py'], dict(os.environ)),
    ('sampiyon', [PY, '-u', 'sampiyon.py'], dict(os.environ)),
]

def main():
    # Çift başlatma koruması: pid dosyasındaki süreç gerçekten yaşayan bir süpervizörse çık
    try:
        with open('supervizor.pid') as _f:
            eski = int(_f.read().strip())
        if eski != os.getpid() and os.path.exists(f'/proc/{eski}'):
            with open(f'/proc/{eski}/cmdline', 'rb') as _f:
                if b'supervizor.py' in _f.read():
                    yaz('başka süpervizör zaten çalışıyor — çıkıyorum')
                    return
    except Exception:
        pass
    with open('supervizor.pid', 'w') as _f:
        _f.write(str(os.getpid()))
    yaz('=== SÜPERVİZÖR BAŞLADI ===')
    cocuklar = {}
    sayac = {ad: 0 for ad, _, _ in BOTS}
    for ad, cmd, env in BOTS:
        cocuklar[ad] = subprocess.Popen(cmd, env=env)
        sayac[ad] += 1
        yaz(f'[+] {ad} başladı (pid {cocuklar[ad].pid})')
    while True:
        time.sleep(8)
        for ad, cmd, env in BOTS:
            p = cocuklar.get(ad)
            if p is None or p.poll() is not None:
                kod = p.returncode if p else '?'
                time.sleep(2)
                cocuklar[ad] = subprocess.Popen(cmd, env=env)
                sayac[ad] += 1
                yaz(f'[!] {ad} durmuştu (kod {kod}) → yeniden başlatıldı (pid {cocuklar[ad].pid}, toplam {sayac[ad]} kez)')
        # özet kalp atışı (10 döngüde bir)
        if int(time.time()) % 80 < 8:
            durum = ', '.join(f"{ad}:{'✓' if cocuklar[ad].poll() is None else '✗'}" for ad, _, _ in BOTS)
            yaz(f'[i] durum {durum}')

if __name__ == '__main__':
    main()
