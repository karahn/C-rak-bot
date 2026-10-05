"""Hızlı durum — TEK komut, 2 API çağrısı: kasa, vergi, TP, botlar. (yavaşlık çözümü)
Kullanım: python3 hizli.py  →  1 satır özet (2-4 sn)
"""
import importlib.util, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
spec = importlib.util.spec_from_file_location('vc', os.path.join(HERE, 'veri_cek.py'))
vc = importlib.util.module_from_spec(spec); spec.loader.exec_module(vc)


def main():
    op = vc.oturum()[0]
    d = vc.cek(op, 'durum') or {}
    o = d.get('oyuncu', {})
    kasa = (o.get('bakiye') or 0) / 100
    tp = o.get('tecrube')
    v = vc.cek(op, 'vergi') or {}
    kalan = sum((b.get('kalan') or 0) for b in v.get('beyanlar', []) if b.get('durum') in ('bekliyor', 'gecikti')) / 100
    eksik = kalan - kasa
    try:
        botlar = subprocess.run(['ps', '-eo', 'args'], capture_output=True, text=True).stdout
        adlar = [a for a in ('grind4', 'sokak_bot', 'musteri_logger', 'keyif_bot', 'rapor_bot', 'gunluk_bot', 'sampiyon') if a + '.py' in botlar]
    except Exception:
        adlar = []
    print("KASA %.0f₺ | VERGİ %.0f₺ | EKSİK %.0f₺ | TP %s/400 | botlar %d/7: %s" %
          (kasa, kalan, eksik, tp, len(adlar), ','.join(a.replace('_bot','').replace('4','') for a in adlar)))


if __name__ == '__main__':
    main()
