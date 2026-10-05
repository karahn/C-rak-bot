"""Kayıtlı çerezle Çırak API'sinden veri çeker (site adresi: AYARLAR.json → "site")."""
import json, sys, time

import oturum as _o


def oturum():
    """Geriye dönük uyumluluk: (opener, çerezlik) döndürür."""
    return _o.op_yukle()


def cek(op, yol, veri=None, kaydet=None):
    govde = _o.istek(op, yol, veri)
    if kaydet:
        json.dump(govde, open(kaydet, 'w'), ensure_ascii=False, indent=1)
    return govde

if __name__ == '__main__':
    op, cj = oturum()
    for yol in sys.argv[1:]:
        kaydet = None
        if ':' in yol and yol.split(':', 1)[1].endswith('.json'):
            yol, kaydet = yol.split(':',1)
        print('===', yol, '===')
        r = cek(op, yol, kaydet=kaydet)
        s = json.dumps(r, ensure_ascii=False)
        print(s[:2000] + ('...' if len(s) > 2000 else ''))
        time.sleep(1.2)
