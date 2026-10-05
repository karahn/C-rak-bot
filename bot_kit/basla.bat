@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === GIRIS (cerez veya sifre) ===
python giris.py
if errorlevel 1 (
  echo.
  echo Giris yapilamadi.
  echo Google/Facebook ile uye olduysan sifre yoktur; bu komutu kullan:
  echo     python cerez_aktar.py
  echo Sonra tekrar basla.bat calistir.
  pause
  exit /b 1
)
echo.
echo === BOTLAR BASLIYOR (bu pencereyi KAPATMA, kucultebilirsin) ===
python -u supervizor.py
pause
