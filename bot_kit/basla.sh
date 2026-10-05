#!/bin/bash
# Mac / Linux / Termux: oturumu hazırla (çerez veya şifre), botları arka planda başlat
cd "$(dirname "$0")"
python3 giris.py
if [ $? -ne 0 ]; then
  echo ""
  echo "Giriş yapilamadi. Google ile üye olduysan: python3 cerez_aktar.py"
  exit 1
fi
nohup python3 -u supervizor.py > supervizor_out.txt 2>&1 &
echo "Botlar arka planda başladı (pid $!)"
echo "Durum: tail -f supervizor_log.txt   |   Tek satır: python3 hizli.py"
