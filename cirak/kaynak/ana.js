import { sistemMetni as _autoMetin, sistemHtml as _autoHtml, sistemSablonu as _autoSablon } from './dil.js?v=0.57.17';
import { dukkanTuru as _dukkanTuru, dukkanKategorisi as _dukkanKategorisi, seyyarAdi as _seyyarAdi, ekipmanAdi as _ekipmanAdi, seyyarAciklama as _seyyarAciklama, calismaSuresi as _calismaSuresi, urunAdi as _urunAdi, birimAdi as _birimAdi, t as _oyunMetni, htmlDil as _oyunHtml } from './dil.js?v=0.57.17';
import { secimKutusuKur } from './secim-kutusu.js?v=0.57.17';
import { aktifDil, t, dilHazirla, dilDegistir, dilSeciciHtml, yerellestir, bildirimMetni, tutarEndeksle } from './dil.js?v=0.57.17';
// Çırak – ana akış: giriş, üst bilgi çubuğu, alt menü, paneller ve 3D sahneler
import * as sahne from './sahne.js?v=0.57.17';
import { jenerikDuzenle } from './jenerik-duzen.js?v=0.57.17';
import { yagmurBaslat } from './yagmur.js?v=0.57.17';
import { mahalleOlustur } from './mahalle.js?v=0.57.17';
import { haritaOlustur, BOLGE_RENGI } from './harita.js?v=0.57.17';
import * as ses from './ses.js?v=0.57.17';
import { reklamHazirla, odulluReklam } from './odulluVideo.js?v=0.57.17';
import { miniOyunKur, davetGuncelle, oyunKosesi, oyunAcikMi } from './minioyun.js?v=0.57.17';
import { kumarhaneKur, kumarhanePaneli, hapisSeridi } from './kumarhane.js?v=0.57.17';
import { urunGrubu } from './toptanci.js?v=0.57.17';
import { varliklariHazirla } from './varliklar.js?v=0.57.17';
import { KALITELER, kaliteTercihi, kaliteKaydet } from './kalite.js?v=0.57.17';
import { introOynat } from './intro.js?v=0.57.17';
import { cagrilariBaslat, cagriKarti, cagriKartiBagla } from './cagrilar.js?v=0.57.17';
import { calarKur } from './calar.js?v=0.57.17';
import { girisSahnesiKur, girisSahnesiKaldir } from './girisSahnesi.js?v=0.57.17';
import { canliBaslat, canliKapat, canliAcik } from './canli.js?v=0.57.17';
import * as bildirimler from './bildirimler.js?v=0.57.17';
import { fotoSec, avatarHtml, isimHtml, paylasimPenceresi, resimPaylas } from './sosyal.js?v=0.57.17';
import { uretimKur, uretimPaneli, tesiseGit } from './uretim.js?v=0.57.17';
import { vakaKur, vakaDurum, vakaPaneli } from './vakalar.js?v=0.57.17';
import { menuAramasiKur, aramaKutusuKur } from './arama.js?v=0.57.17';
import { bankaKur, bankaPaneli } from './banka.js?v=0.57.17';
import { yasamKur, yasamPaneli, mekanHaberi, etkinlikHaberi } from './yasam.js?v=0.57.17';
import { devletKur, secimPaneli, ihalePaneli, borsaPaneli, isDunyasiPaneli, devletMenusu, varlikPaneli, vergiPaneli, plakaHtml, magazaPaneli, bilboardAc, odalarPaneli, ekonomiPaneli, plazaPaneli, gazetePaneli, bagisPaneli } from './devlet.js?v=0.57.17';
import {
  api, OturumYok, tl, tamTl, sade, isaretliTl, esc, sureMetni, gercekSureAdi, nufusMetni,
  simdi, farkAyarla, bildir, halkaSvg, kart, onayla, sor,
  sayiDili, paraBirimiAyarla,
  acilAyarla, acilNo, endeksAyarla, guncelFiyat,
} from './yardimci.js?v=0.57.17';

const arayuz = document.getElementById('arayuz');
const katman = document.getElementById('panel-katman');
// Görünen alan (telefonda klavye açılınca küçülür): tam ekran pencereler (mesajlaşma) buna göre boyutlanır
if (window.visualViewport) {
  const vv = window.visualViewport;
  let bekleyen = 0;
  const uygula = () => { bekleyen = 0; const r = document.documentElement.style; r.setProperty('--vvh', Math.round(vv.height) + 'px'); r.setProperty('--vvt', Math.round(vv.offsetTop) + 'px'); };
  const iste = () => { if (!bekleyen) bekleyen = requestAnimationFrame(uygula); };
  vv.addEventListener('resize', iste);
  vv.addEventListener('scroll', iste);
  uygula();
}
// Sektörler modülü ana akıştaki yardımcıları kullanır
setTimeout(() => bankaKur({
  panelAc: (...a) => panelAc(...a), eylem: (...a) => eylem(...a), ses, aktifRota: () => aktifRota(), oyuncu: () => d.genel.oyuncu,
  durumYenile: async () => { await durumYenile(); hudGuncelle(); },
}), 0);
setTimeout(() => yasamKur({
  panelAc: (...a) => panelAc(...a), eylem: (...a) => eylem(...a), ses, aktifRota: () => aktifRota(), oyuncu: () => d.genel.oyuncu,
  durumYenile: async () => { await durumYenile(); hudGuncelle(); },
  zamanlayici: (fn, ms) => { clearInterval(d.panelZamanlayici); d.panelZamanlayici = setInterval(fn, ms); },
  avatar: (...a) => avatarHtml(...a), sohbetEkle: (...a) => sohbetEkle(...a), sohbetKutusu: (...a) => sohbetKutusu(...a),
  oyuncuSecici: (...a) => oyuncuSecici(...a), mesajYaz: (ad) => mesajlasma({ ad }), hud: () => hudGuncelle(), genel: () => d.genel,
  videoDugme: (...a) => videoDugmesiHtml(...a), videoEylem: (...a) => videoEylem(...a), videoEylemi: (tur) => videoEylemi(tur), reklamHazirla: () => reklamHazirla(d.genel && d.genel.odulluVideo), // 0.48
}), 0);
setTimeout(() => devletKur({
  panelAc: (...a) => panelAc(...a), eylem: (...a) => eylem(...a), ses, aktifRota: () => aktifRota(),
  durumYenile: async () => { await durumYenile(); hudGuncelle(); },
  caddeYenile: () => caddeYenile().catch(() => {}),
  oyuncu: () => d.genel.oyuncu,
  iller: () => harita.iller(),
  sertifikaGoster: (s) => sertifikaGoster(s),
  profilAc: (id) => oyuncuKarti(id),
  altinSertifika: (v) => { d.altinSertifika = !!v; },
  seyyarYenile: () => seyyarYenile().catch(() => {}),
  dukkanaGit: (no, sokak = null) => { location.hash = '#/mahalle'; setTimeout(() => dukkanaOdaklaSokak(no, sokak), 80); },
  kamuyaGit: (kod) => { ziyaretBitir(); location.hash = '#/mahalle'; setTimeout(() => mahalle.kamuyaOdakla && mahalle.kamuyaOdakla(kod), 80); },
  zamanlayici: (fn, ms) => { clearInterval(d.panelZamanlayici); d.panelZamanlayici = setInterval(fn, ms); },
}), 0);
setTimeout(() => kumarhaneKur({
  panelAc: (...a) => panelAc(...a), ses, durumYenile: async () => { await durumYenile(); hudGuncelle(); },
  zamanlayici: (fn, ms) => { clearInterval(d.panelZamanlayici); d.panelZamanlayici = setInterval(fn, ms); },
}), 0);
setTimeout(() => miniOyunKur({
  panelAc: (...a) => panelAc(...a), videoEylem: (...a) => videoEylem(...a), videoEylemi: (tur) => videoEylemi(tur), onayla: (...a) => onayla(...a),
  // 0.57.9: bakiye hareket sırasına göre uygulanır (eski bakiye yenisini ezmez)
  bakiyeUygula: (b, hid) => bakiyeUygula(Number(b), Number(hid) || 0), durumYenile: async () => { await durumYenile(); hudGuncelle(); }, genel: () => d.genel,
  zamanlayici: (fn, ms) => { clearInterval(d.panelZamanlayici); d.panelZamanlayici = setInterval(fn, ms); },
}), 0);
setTimeout(() => vakaKur({ // 0.55: olaylar (yangın, hırsız, sipariş…), mezat, mahalle projesi, itibar
  panelAc: (...a) => panelAc(...a), eylem: (...a) => eylem(...a), ses, aktifRota: () => aktifRota(), onayla: (...a) => onayla(...a), mahalle: () => mahalle, genel: () => d.genel,
  durumYenile: async () => { await durumYenile(); hudGuncelle(); }, bakiye: (b) => { if (d.genel && d.genel.oyuncu) { d.genel.oyuncu.bakiye = b; bakiyeSay(b); } },
  zamanlayici: (fn, ms) => { clearInterval(d.panelZamanlayici); d.panelZamanlayici = setInterval(fn, ms); },
}), 0);
setTimeout(() => uretimKur({
  panelAc: (...a) => panelAc(...a), eylem: (...a) => eylem(...a), ses, aktifRota: () => aktifRota(),
  videoDugme: (...a) => videoDugmesiHtml(...a), videoEylem: (...a) => videoEylem(...a), videoEylemi: (tur) => videoEylemi(tur), // 0.49.0
  tesisVideoHtml: (u) => { const e = videoEylemi('tesis'); if (!e || u.hizlandi || u.bitis - simdi() < 60000) return ''; const ms = Math.min(e.tavanDk * 60000, Math.round((u.bitis - simdi()) * e.oran / 100)); return videoDugmesiHtml('tesis', u.id, _autoSablon`📺 Video izle: ${hizSureAdi(ms)} erken bitsin`, _autoSablon`⭐ Hızlandır: ${hizSureAdi(ms)} erken bitsin`, _autoHtml('Ürün ve gelir aynı kalır.')); },
  reklamHazirla: () => reklamHazirla(d.genel && d.genel.odulluVideo), sureAdi: (ms) => hizSureAdi(ms),
  durumYenile: async () => { await durumYenile(); hudGuncelle(); },
  zamanlayici: (fn, ms) => { clearInterval(d.panelZamanlayici); d.panelZamanlayici = setInterval(fn, ms); },
}), 0);

ses.muzikBaglami('yukleniyor');
// 0.46: ziyaretçi kaynağı (reklam bağlantısı ?ref=, utm_*, davet, sertifika, arama/sosyal yönlendirme) oturum başına bir kez
// bildirilir; reklam izleme parametreleri adres çubuğundan temizlenir (davet ve sertifika kodu oyunda kullanıldığı için kalır).
(function kaynakBildir() {
  try {
    if (sessionStorage.getItem('cirak_kaynak')) return;
    sessionStorage.setItem('cirak_kaynak', '1');
  } catch (e) { /* gizli sekme: yine de bildirilir */ }
  const p = new URLSearchParams(location.search);
  const veri = { yonlendiren: document.referrer || '' };
  for (const k of ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'davet']) { const v = p.get(k); if (v) veri[k] = v.slice(0, 120); }
  if (p.get('s')) veri.sertifika = '1';
  fetch('api/kaynak', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(veri), keepalive: true }).catch(() => {});
  const izler = ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid'];
  if (izler.some((k) => p.has(k))) {
    for (const k of izler) p.delete(k);
    const q = p.toString();
    try { history.replaceState(history.state, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* yok say */ }
  }
})();

const d = {
  genel: null,      // /api/durum
  seyyar: null,     // /api/seyyar
  haritaVeri: null, // /api/harita
  iller: null,
  girisSekmesi: 'kayit',
  gosterilenBakiye: null,
  panelRota: null,
};

// Ay ve gün adları oyuncunun dilinde (Intl); Türkçede eski adlarla aynıdır
const tarihBicimleri = new Map();
function tarihAdi(secenek, tarih) {
  const k = aktifDil() + JSON.stringify(secenek);
  if (!tarihBicimleri.has(k)) { try { tarihBicimleri.set(k, new Intl.DateTimeFormat(aktifDil(), { ...secenek, timeZone: 'UTC' })); } catch (e) { tarihBicimleri.set(k, new Intl.DateTimeFormat('tr', { ...secenek, timeZone: 'UTC' })); } }
  return tarihBicimleri.get(k).format(tarih);
}
const ayAdi = (ay, kisa) => tarihAdi({ month: kisa ? 'short' : 'long' }, new Date(Date.UTC(2026, ay, 15))).replace(/\.$/, '');
const haftaGunuAdi = (gun, kisa) => tarihAdi({ weekday: kisa ? 'short' : 'long' }, new Date(Date.UTC(2026, 1, 1 + gun))); // 1 Şubat 2026 pazar
const MEVSIM_IKON = { kis: '❄️', ilkbahar: '🌸', yaz: '☀️', sonbahar: '🍂' };

// Oyun saati: sunucudan gelen takvim + geçen gerçek süre × 24
function oyunMs() {
  if (!d.genel) return Date.UTC(2026, 0, 1, 12);
  return d.genel.takvim.ms + (simdi() - d.genel.sunucuZamani);
}
function oyunSaati() {
  if (window.tezgahDeneme && window.tezgahDeneme.saat != null) return window.tezgahDeneme.saat;
  const t = new Date(oyunMs());
  return t.getUTCHours() + t.getUTCMinutes() / 60;
}
function mevsimi(ay) {
  if (ay === 11 || ay <= 1) return 'kis';
  if (ay <= 4) return 'ilkbahar';
  if (ay <= 7) return 'yaz';
  return 'sonbahar';
}

// ---------- 3D sahneler ----------
sahne.baslat(document.getElementById('sahne'));
window.TEZGAH_YUKLEME?.(72, 'Modeller hazırlanıyor');
await varliklariHazirla();
window.TEZGAH_YUKLEME?.(82, 'Sahneler kuruluyor');
const mahalle = mahalleOlustur({
  // 0.50: seçim mitingine katılım (meydandaki sahneye dokununca)
  mitingTik: async (m) => {
    ses.tik();
    if (m.benim) return bildir(_autoMetin('Kendi mitingindesin: kürsüdesin!'));
    if (Date.now() < m.bas) return bildir(_autoSablon`Miting ${sureMetni(m.bas - Date.now())} sonra başlayacak.`);
    if (m.katildim) return bildir(_autoMetin('Bu mitinge zaten katıldın.'));
    try { const r = await api(`ysk/miting/${m.kampanyaId}/katil`, {}); m.katildim = true; bildir(r.zaten ? _autoMetin('Bu mitinge zaten katıldın.') : _autoSablon`Mitinge katıldın! ${m.ad} adayının kampanya gücü arttı.`); }
    catch (e) { bildir(e.message, true); }
  },
  tiklandi: (kod) => { ses.tik(); tezgahPaneli(kod); },
  keseTik: (kod, rect) => toplaTek(kod, rect),
  dukkanTiklandi: (no) => { ses.tik(); dukkanPaneli(no); },
  reklamTik: () => { ses.tik(); location.hash = '#/reklam'; },
  fisekBasladi: (f, goster) => {
    if (!d.genel || !d.genel.oyuncu) return;
    const neden = { kutlama: 'Kutlama', acilis: 'Dükkân açılışı', luks: 'Yeni lüks alım', dogum: 'Doğum günü', bayram: 'Bayram' }[f.neden] || 'Kutlama';
    oyunBildirimi('fisek_' + f.id, '🎆', _autoMetin('Havai fişek gösterisi!'), _autoSablon`${f.oyuncu}: ${_autoMetin(neden)}`, _autoMetin('Göster'), () => {
      panelKapat(true);
      if (aktifRota() !== 'mahalle') location.hash = '#/mahalle';
      setTimeout(goster, 150);
    }, 0);
  },
  bilboardTik: (no, r) => { ses.tik(); if (r) api(`bilboard/${r.id}/tik`, {}).catch(() => {}); bilboardAc(no, r); },
  komsuTiklandi: (x) => { ses.tik(); oyuncuKarti(x.oyuncuId, x); },
  servisTik: (kod, rect) => servisYap(kod, rect),
  oyunSaati,
  olayKatil: (olay, eylem, rect) => sokakOlayinaKatil(olay, eylem, rect),
  muzisyenIstek: (olay, rect) => muzisyenIstegi(olay, rect),
  zabitaSonucu: (kod, sonuc, z) => zabitaSonucuGoster(kod, sonuc, z),
  // ekranda görünmeyen sokak olayı: kısa haber ve "Göster"
  olayHaberi: (olay, [ikon, baslik, metin], goster) => {
    if (!d.genel || !d.genel.oyuncu) return;
    oyunBildirimi('olay_' + olay.id, ikon, baslik, metin, _autoMetin('Göster'), () => {
      panelKapat(true);
      if (aktifRota() !== 'mahalle') location.hash = '#/mahalle';
      setTimeout(goster, 150);
    }, 0);
  },
  izinVar: () => !!(d.seyyar && d.seyyar.izin && d.seyyar.izin.var),
  // en uzaktan daha da uzaklaşınca haritaya (kendi ilçene) çıkılır
  uzaklasti: () => {
    if (aktifRota() !== 'mahalle' || document.querySelector('#panel-katman:not([hidden])')) return;
    d.haritaYakin = true;
    location.hash = '#/harita';
  },
});
// Hata ayıklama ve otomatik denemeler için (oyunu etkilemez)
window.__cirak = { mahalle, d, get harita() { return harita; }, tezgahPaneli: (k) => tezgahPaneli(k), isletmePaneli: (i) => isletmePaneli(i), dukkanPaneli: (n) => dukkanPaneli(n), ilcePaneli: (...a) => ilcePaneli(...a), ilceyiGez: (...a) => ilceyiGez(...a), get cizim() { const r = sahne.getRenderer && sahne.getRenderer(); return r ? { cagri: r.info.render.calls, ucgen: r.info.render.triangles, geo: r.info.memory.geometries, doku: r.info.memory.textures } : null; } };
if (new URLSearchParams(location.search).has('deneme')) window.tezgahDeneme = { mahalle, sahne };
const harita = haritaOlustur({
  ilSecildi: (id) => { if (id && d.genel && d.genel.oyuncu) ilPaneli(id); },
  ilceSecildi: (ilceId, ilId) => { if (d.genel && d.genel.oyuncu) ilcePaneli(ilceId, ilId); },
  // haritada kendi mahallene inerken kamera kuş bakışından sokağa süzülür
  mahalleyeGit: () => {
    panelKapat(true);
    d.mahalleUstten = true;
    location.hash = '#/mahalle';
  },
});
if (window.tezgahDeneme) window.tezgahDeneme.harita = harita;

// ---------- Veri ----------
async function durumYenile() {
  const istekZamani = Date.now();
  const g = await api('durum');
  farkAyarla(g.sunucuZamani - Date.now());
  // istek yoldayken bahşiş gibi bir kazanç eklendiyse, eski bakiye yenisinin üzerine yazılmaz
  if (g.oyuncu && d.genel && d.genel.oyuncu && d.yerelBakiyeZamani > istekZamani) g.oyuncu.bakiye = d.genel.oyuncu.bakiye;
  d.genel = g;
  if (g.oyuncu) { acilAyarla(g.oyuncu.acil); endeksAyarla(g.oyuncu.endeks); }
  d.hapisBitis = g.hapis ? simdi() + Number(g.hapis) : 0; // 0.49
  // deneme sayfasında hava elle seçilebilir (window.tezgahDeneme.hava = { tur: 'kar' })
  const denemeHava = window.tezgahDeneme && window.tezgahDeneme.hava;
  if (g.oyuncu) mahalle.havaAyarla(denemeHava || g.hava, (denemeHava && denemeHava.mevsim) || (g.takvim && g.takvim.mevsim));
  if (g.oyuncu && d.bolgeY && d.bolgeY.havaGuncelle) d.bolgeY.havaGuncelle(denemeHava || g.hava);
  // bayram süslemesi (deneme sayfasında window.tezgahDeneme.ozelGun ile seçilebilir)
  const denemeGun = window.tezgahDeneme && window.tezgahDeneme.ozelGun;
  if (denemeGun) g.ozelGun = denemeGun;
  if (g.oyuncu && mahalle.ozelGunAyarla) mahalle.ozelGunAyarla(g.ozelGun);
  if (g.oyuncu && mahalle.camiIsikAyarla) mahalle.camiIsikAyarla(g.camiIsik);
  return g;
}
async function seyyarYenile() {
  d.seyyar = await api('seyyar');
  mahalle.durumGuncelle(d.seyyar);
  // sayfa yenilenirse süren toplu sipariş sunucudan geri yüklenir
  const sa = d.seyyar.aktifler.find((x) => x.siparis && x.siparis.durum === 'suruyor');
  if (sa && sa.siparis.bitis > simdi() && (!d.siparis || d.siparis.calismaId !== sa.id)) d.siparis = { ...sa.siparis, calismaId: sa.id, isKodu: sa.isKodu };
  siparisCiz();
  return d.seyyar;
}
// ---------- Komşu tezgâhlar, başka ilçeyi gezme, oyuncu kartı ----------
async function komsuYenile() {
  if (!d.genel || !d.genel.oyuncu || d.ziyaret) return;
  try {
    const r = await api('komsular');
    if (!d.ziyaret) mahalle.komsulariAyarla(r.tezgahlar, 'sehir');
  } catch (e) { /* sessiz */ }
}
// 0.51: başka bir ilin ilçesine gitmek için önce yolculuk seçilir (uçak, otobüs, YHT, tren, araba); kendi ilin ücretsiz
async function ilceyiGez(ilceId, { ilId = null, bilet = false } = {}) {
  if (!bilet && ilId && d.genel && d.genel.oyuncu && Number(ilId) !== Number(d.genel.oyuncu.il.id) && !d.genel.oyuncu.test) {
    return seyahatModulu().then((m) => m.seyahatPaneli(ilceId)).catch((e) => bildir(e.message, true));
  }
  let r;
  try { r = await api('ziyaret/' + ilceId); } catch (e) {
    if (e.message === _autoMetin('Bu şehre gitmek için önce yolculuğunu seç.')) return seyahatModulu().then((m) => m.seyahatPaneli(ilceId)).catch(() => bildir(e.message, true));
    return bildir(e.message, true);
  }
  if (r.ilce.benim) { ziyaretBitir(); return; }
  panelKapat(true);
  d.ziyaret = r;
  if (aktifRota() !== 'mahalle') history.replaceState(null, '', '#/mahalle');
  rotaUygula();
  if (!mahalle.ziyaretBasla(r)) { d.ziyaret = null; return bildir(_autoMetin('Sokak henüz hazır değil, birazdan tekrar dene.'), true); }
  mahalle.devletAyarla(r.devlet || []); // 0.51: gezilen yerin valilik, belediye ve plaza adları
  if (r.kamu) mahalle.kamuAyarla(r.kamu);
  mahalle.secimAyarla(r.secim || null);
  if (mahalle.belediyeCalismasi) mahalle.belediyeCalismasi(null, r.ilce.ad);
  ziyaretSeridi();
  ses.tik();
}
// 0.51: gezintide bir kurum binasına dokununca: binanın adı ve kendi işlerinin nerede yapıldığı
window.addEventListener('cirak-ziyaret-kurum', (e) => {
  const k = e.detail || {};
  kart({ ikon: k.tur === 'plaza' ? '🏢' : '🏛️', baslik: k.ad || '', metin: _autoMetin('Gezdiğin yerin binası. Vergi, belediye, ihale ve ofis işlerini kendi ilinden ve ilçenden yürütürsün.'), sure: 5000 });
});
// 0.52: devlet hastanesi, emniyet ve itfaiye: dokununca adı ve kısa bilgi
window.addEventListener('cirak-kurum-bilgi', (e) => {
  const k = e.detail || {};
  const B = {
    hastane: ['🏥', _autoSablon`Devlet hastanesi. Acil servisi 7/24 açık; ambulanslar acil çağrıyla (${acilNo('ambulans')}) buradan çıkar.`],
    emniyet: ['🚔', _autoMetin('Emniyet müdürlüğü. Polis ekipleri mahallenin huzuru ve güvenliği için 7/24 görevde.')],
    egm: ['🚔', _autoMetin('Emniyet Genel Müdürlüğü. Türkiye genelindeki polis teşkilatı buradan yönetilir.')],
    itfaiye: ['🚒', _autoSablon`İtfaiye istasyonu. Yangın ve kurtarma ekipleri acil çağrıyla (${acilNo('itfaiye')}) dakikalar içinde yola çıkar.`],
    // 0.57.9: şehrin yeni simge yapıları
    universite: ['🎓', _autoMetin('Üniversite. Fakülteleri, kütüphanesi ve yeşil kampüsüyle şehrin bilim ve gençlik merkezi.')],
    teknik: ['🎓', _autoMetin('Teknik üniversite. Mühendislik, teknoloji ve araştırma laboratuvarlarıyla şehrin yenilik merkezi.')],
    nar: ['⛽', _autoMetin('Akaryakıt istasyonu. Benzin, motorin ve otogaz; markette atıştırmalık, yanında oto yıkama.')],
    must: ['⛽', _autoMetin('Akaryakıt istasyonu. Benzin, motorin ve otogaz; markette atıştırmalık, yanında oto yıkama.')],
    gar: ['🚆', _autoMetin('Tren garı. Şehirlerarası ve bölgesel trenler buradan kalkar. Yolculuk için haritadan bir şehir seç.')],
    yht: ['🚄', _autoMetin('Yüksek hızlı tren garı. YHT seferleri buradan kalkar. Yolculuk için haritadan bir şehir seç.')],
    otogar: ['🚌', _autoMetin('Şehirlerarası otobüs terminali. Otobüs seferleri buradan kalkar. Yolculuk için haritadan bir şehir seç.')],
    havalimani: ['✈️', _autoMetin('Havalimanı. İç ve dış hat uçuşları buradan kalkar. Yolculuk için haritadan bir şehir seç.')],
    park: ['🌳', _autoMetin('Kent parkı. Yürüyüş yolları, gölet, çocuk parkı ve gölgeli banklarıyla şehrin nefes aldığı yer.')],
  }[k.tur] || ['🏛️', ''];
  kart({ ikon: B[0], baslik: k.ad || '', metin: B[1], sure: 5000 }); // 0.57.9: binanın adı 5 sn görünür
});
// 0.57.9: başka işlevi olmayan binalar (apartman, cami, şadırvan, çocuk parkı, durak): adı 5 sn
window.addEventListener('cirak-bina-adi', (e) => {
  const k = e.detail || {};
  if (!k.ad) return;
  kart({ ikon: k.ikon || '🏢', baslik: k.ad, metin: k.metin || '', sure: 5000 });
});
function ziyaretBitir() {
  const vardi = !!d.ziyaret;
  d.ziyaret = null;
  mahalle.ziyaretBitir();
  if (vardi && d.cadde) mahalle.devletAyarla(d.cadde.devlet || []);
  if (vardi && d.cadde && d.cadde.kamu) mahalle.kamuAyarla(d.cadde.kamu);
  if (vardi && d.cadde && mahalle.belediyeCalismasi && d.genel && d.genel.oyuncu) mahalle.belediyeCalismasi(d.cadde.calisma || null, d.genel.oyuncu.ilce.ad);
  if (vardi && d.cadde) mahalle.secimAyarla(d.cadde.secim || null);
  const e = document.getElementById('ziyaret-serit');
  if (e) e.remove();
  if (vardi) { komsuYenile(); document.body.classList.remove('ziyarette'); }
}
function ziyaretSeridi() {
  let e = document.getElementById('ziyaret-serit');
  if (!e) { e = document.createElement('div'); e.id = 'ziyaret-serit'; document.body.appendChild(e); }
  const z = d.ziyaret;
  document.body.classList.add('ziyarette');
  e.innerHTML = `<div class="zs-bilgi"><span class="zs-ikon">👀</span><div><b>${esc(z.ilce.ad)}, ${esc(z.ilce.il)}</b><small>${_autoSablon`${esc(z.isimler ? z.isimler.anaCadde || '' : '')} · ${z.oyuncu} oyuncu · ${z.tezgahlar.length} açık tezgâh`}</small></div></div>
    <button class="dugme yesil kucuk" data-don>🏠 ${_autoHtml("Sokağıma dön")}</button>`;
  e.querySelector('[data-don]').addEventListener('click', () => { ses.tik(); ziyaretBitir(); });
}
// 0.41: "X gündür / saattir / dakikadır oyunda" (Türkçe ek uyumu doğru)
function uyelikMetni(ms) {
  const dk = Math.max(1, Math.floor(ms / 60000)), sa = Math.floor(dk / 60), gun = Math.floor(sa / 24);
  if (gun >= 1) return _autoSablon`${gun} gündür oyunda`;
  if (sa >= 1) return _autoSablon`${sa} saattir oyunda`;
  return _autoSablon`${dk} dakikadır oyunda`;
}
// 0.41: profil sayfası (Facebook benzeri): kapak, fotoğraf, arkadaşlık düğmeleri, rakamlar, işletmeler ve arkadaşlar
// 0.49.4: sayfalama çubuğu (önceki / sayfa numaraları / sonraki)
function sayfalamaHtml(sayfa, sayfaSayisi, attr = 'data-sayfa') {
  if (!(sayfaSayisi > 1)) return '';
  const l = new Set([1, sayfaSayisi, sayfa - 1, sayfa, sayfa + 1].filter((n) => n >= 1 && n <= sayfaSayisi));
  const sirali = [...l].sort((a, b) => a - b);
  let onceki = 0;
  const parca = [];
  for (const n of sirali) {
    if (n - onceki > 1) parca.push('<span class="sf-bosluk">…</span>');
    parca.push(`<button class="sf-no${n === sayfa ? ' aktif' : ''}" ${attr}="${n}" ${n === sayfa ? 'aria-current="page"' : ''}>${n}</button>`);
    onceki = n;
  }
  return `<nav class="sayfalama2" aria-label="${esc(_autoMetin('Sayfalar'))}"><button class="sf-ok" ${attr}="${sayfa - 1}" ${sayfa <= 1 ? 'disabled' : ''} aria-label="${esc(_autoMetin('Önceki sayfa'))}">‹</button>${parca.join('')}<button class="sf-ok" ${attr}="${sayfa + 1}" ${sayfa >= sayfaSayisi ? 'disabled' : ''} aria-label="${esc(_autoMetin('Sonraki sayfa'))}">›</button></nav>`;
}
const SIRKET_TUR = { limited: 'Limited şirket', anonim: 'Anonim şirket', holding: 'Holding' };

// 0.49.4: Profil sayfası: kimlik başlığı, seviye ilerlemesi, rakamlar, şirket, sekmeli ve sayfalı işler/arkadaşlar/garaj
async function oyuncuKarti(oyuncuId, tezgah = null) {
  let k;
  try { k = await api('oyuncu-karti/' + oyuncuId); } catch (e) { return bildir(e.message, true); }
  const iliskiDugmesi = () => {
    if (k.ben) return `<a class="dugme gri kucuk" href="#/hesap/profil">${_autoHtml("✏️ Profilimi düzenle")}</a><a class="dugme mavi kucuk" href="#/arkadaslar">${_autoHtml("👥 Arkadaşlarım")}</a>`;
    const m = `<button class="dugme mavi kucuk" data-mesaj>${_autoHtml("✉️ Mesaj")}</button>`;
    if (k.iliski === 'arkadas') return `<button class="dugme yesil kucuk" data-arkadas="sil" title="${_autoHtml("Arkadaşlıktan çıkar")}">${_autoHtml("✓ Arkadaşsınız")}</button>${m}`;
    if (k.iliski === 'gonderildi') return `<button class="dugme gri kucuk" data-arkadas="sil">${_autoHtml("⏳ İstek gönderildi · geri çek")}</button>${m}`;
    if (k.iliski === 'gelen') return `<button class="dugme yesil kucuk" data-arkadas="kabul">${_autoHtml("✓ İsteği kabul et")}</button><button class="dugme gri kucuk" data-arkadas="sil">${_autoHtml("Reddet")}</button>${m}`;
    return `<button class="dugme yesil kucuk" data-arkadas="istek">${_autoHtml("➕ Arkadaş ekle")}</button>${m}`;
  };
  const yer = [k.mahalle, k.ilce, k.il].filter(Boolean).map(esc).join(', ');
  const cevrim = k.cevrimici ? `<span class="pr-cevrim acik">${_autoHtml("● Çevrimiçi")}</span>` : k.sonGiris ? `<span class="pr-cevrim">${_autoSablon`Son görülme ${tarihMetni(k.sonGiris)}`}</span>` : '';
  const ar = k.seviyeAraligi || { alt: 0, ust: 0 };
  const ilerleme = ar.ust > ar.alt ? Math.max(0, Math.min(100, Math.round((100 * (k.tecrube - ar.alt)) / (ar.ust - ar.alt)))) : 100;
  const sirketVar = k.sirket && k.sirket.kod && k.sirket.kod !== 'sahis';
  const sirketKart = sirketVar || k.merkez ? `<div class="kart p2-sirket"><span class="p2-sirket-simge" aria-hidden="true">🏢</span><div>
      <b>${esc((k.merkez && k.merkez.ad) || (k.sirket && k.sirket.unvan) || '')}${!(k.merkez && k.merkez.ad) && !(k.sirket && k.sirket.unvan) ? _autoHtml(SIRKET_TUR[k.sirket.kod] || '') : ''}</b>
      <small>${[sirketVar ? _autoMetin(SIRKET_TUR[k.sirket.kod] || '') : '', k.merkez ? _autoSablon`Merkez: ${k.merkez.plaza}, Kat ${k.merkez.kat} No ${k.merkez.no}` : ''].filter(Boolean).map(esc).join(' · ')}</small></div></div>` : '';
  const tezgahlar = k.tezgahlar.map((kod) => (d.seyyar && d.seyyar.isler || []).find((x) => x.kod === kod)).filter(Boolean);
  const sekmeler = [['isler', `🏪 ${_autoHtml('İşleri')}`, k.isletme + k.tesis + tezgahlar.length], ['arkadaslar', `👥 ${_autoHtml('Arkadaşları')}`, k.arkadasSayisi]];
  if (k.garaj && k.garaj.length) sekmeler.push(['garaj', `🏎️ ${_autoHtml('Garajı')}`, k.garaj.length]);
  const govde = `${tezgah ? `<div class="kart komsu-tezgah"><span class="kt-simge">${tezgah.simge}</span><div><b>${esc(tezgah.isAdi)}</b><small>${_autoSablon`${tezgah.calisan === 'cirak' ? _autoHtml('Çırağı çalışıyor') : _autoHtml('Kendisi başında')} · ${sureMetni(Math.max(0, tezgah.bitis - simdi()))} daha açık`}</small></div></div>` : ''}
    <div class="profil2">
      <header class="p2-bas">
        <span class="p2-foto${k.cevrimici ? ' cevrimici' : ''}">${avatarHtml(k.foto, k.ad, 96, '', k.gr)}</span>
        <div class="p2-kim"><h3>${isimHtml(k.ad, k.gr)}</h3>
          <div class="p2-yer">📍 ${yer}</div>
          <div class="p2-cipler"><span class="p2-cip altin">⭐ ${_autoSablon`${k.seviye}. seviye`}</span>${k.sezonRozet ? `<span class="p2-cip">${_autoSablon`🏅 ${k.sezonRozet} sezon şampiyonluğu`}</span>` : ''}${sirketVar ? `<span class="p2-cip">🏢 ${_autoHtml(SIRKET_TUR[k.sirket.kod] || '')}</span>` : ''}</div>
          <small class="p2-uyelik">${esc(uyelikMetni(simdi() - k.uyelik))}${cevrim ? ' · ' + cevrim : ''}</small></div>
      </header>
      <div class="pr-eylemler" data-eylemler>${iliskiDugmesi()}</div>
      <div class="p2-seviye" title="${esc(_autoSablon`${sayiTr(k.tecrube)} / ${sayiTr(ar.ust)} TP`)}"><div class="p2-seviye-ust"><span>${_autoSablon`${k.seviye}. seviye`}</span><span>${ar.ust > ar.alt ? _autoSablon`${sayiTr(k.tecrube)} / ${sayiTr(ar.ust)} TP` : _autoHtml('En yüksek seviye')}</span></div><div class="p2-cubuk"><i style="width:${ilerleme}%"></i></div></div>
      <div class="p2-rakamlar">
        <div><b class="sayi">${tl(k.servet)}</b><small>${_autoHtml("Servet")}</small></div>
        <div><b class="sayi">#${sayiTr(k.siralama)}</b><small>${_autoHtml("Sıralama")}</small></div>
        <div><b class="sayi">${sayiTr(k.arkadasSayisi)}</b><small>${_autoHtml("Arkadaş")}</small></div>
        <div><b class="sayi">${sayiTr(k.isletme)}</b><small>${_autoHtml("Dükkân")}</small></div>
        <div><b class="sayi">${sayiTr(k.tesis)}</b><small>${_autoHtml("Tesis")}</small></div>
        <div><b class="sayi">${k.tezgah}</b><small>${_autoHtml("Açık tezgâh")}</small></div>
      </div>
      ${sirketKart}
      <div class="sekmeler p2-sekmeler" role="tablist">${sekmeler.map(([kod, ad, n], i) => `<button role="tab" data-p2-sekme="${kod}" aria-selected="${i === 0}">${ad} <span class="p2-sayi">${sayiTr(n)}</span></button>`).join('')}</div>
      <div class="p2-icerik" data-p2-icerik></div>
    </div>`;
  let sekme = 'isler', isTur = k.isletme ? 'dukkan' : k.tesis ? 'tesis' : 'tezgah', isSayfa = 1, arkSayfa = 1, arkQ = '', zam = null;
  const listeHtml = (l) => `<ul class="p2-isler">${l.map((i) => `<li><span class="p2-is-simge">${i.simge}</span><div><b>${esc(i.ad)}</b><small>${esc(i.tur ? _dukkanTuru(i.tur) : _autoSablon`${i.kademe}. kademe`)}${i.alt ? ' · ' + esc(i.alt) : ''}</small></div>${i.acik === false ? `<span class="rozetcik">${_autoHtml('Kapalı')}</span>` : ''}</li>`).join('')}</ul>`;
  const icerikCiz = async (g) => {
    const kutu = g.querySelector('[data-p2-icerik]');
    if (sekme === 'garaj') {
      kutu.innerHTML = `<ul class="pr-garaj">${k.garaj.map((v) => `<li>
        <span class="pr-garaj-simge${v.bitis ? ' ' + v.bitis : ''}"${v.renk ? ` style="--renk:${v.renk}"` : ''}>${{ araba: '🚘', yat: '🛥️', ev: '🏡', arsa: '🌳' }[v.tur] || '💎'}</span>
        <div><b>${esc(v.ad)}</b>${v.isim ? ` <small>“${esc(v.isim)}”</small>` : ''}${v.plaka ? `<br>${plakaHtml(v.plaka)}` : ''}<br><small class="soluk">${[v.renkAd ? esc(_autoMetin(v.renkAd)) : '', v.il ? esc(v.il) : ''].filter(Boolean).join(' · ')}</small></div></li>`).join('')}</ul>`;
      return;
    }
    if (sekme === 'isler') {
      const cip = [['dukkan', _autoHtml('Dükkânlar'), k.isletme], ['tesis', _autoHtml('Tesisler'), k.tesis], ['tezgah', _autoHtml('Tezgâhlar'), tezgahlar.length]];
      const ust = `<div class="p2-cipler secim">${cip.map(([kod, ad, n]) => `<button class="p2-cip${isTur === kod ? ' secili' : ''}" data-is-tur="${kod}" ${!n ? 'disabled' : ''}>${ad} · ${sayiTr(n)}</button>`).join('')}</div>`;
      if (!k.isletme && !k.tesis && !tezgahlar.length) { kutu.innerHTML = `<p class="kucuk soluk">${k.ben ? _autoHtml('Henüz bir işin yok.') : _autoHtml('Henüz bir işi yok.')}</p>`; return; }
      if (isTur === 'tezgah') {
        kutu.innerHTML = ust + (tezgahlar.length ? listeHtml(tezgahlar.map((is) => ({ simge: is.simge, ad: _seyyarAdi(is.ad), alt: _autoMetin('Seyyar tezgâh · açık') }))) : `<p class="kucuk soluk">${_autoHtml('Açık tezgâhı yok.')}</p>`);
        return;
      }
      kutu.innerHTML = ust + `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>`;
      let r;
      try { r = await api(`oyuncu-karti/${k.id}/isler?tur=${isTur}&sayfa=${isSayfa}`); } catch (e) { kutu.innerHTML = ust + `<p class="hata">${esc(e.message)}</p>`; return; }
      if (sekme !== 'isler') return;
      kutu.innerHTML = ust + (r.liste.length ? listeHtml(r.liste) : `<p class="kucuk soluk">${_autoHtml('Kayıt yok.')}</p>`) + sayfalamaHtml(r.sayfa, r.sayfaSayisi, 'data-is-sayfa');
      return;
    }
    // arkadaşlar
    const aramaVar = !!kutu.querySelector('[data-p2-ara]');
    if (!aramaVar) kutu.innerHTML = `${k.arkadasSayisi > 12 ? `<input class="p2-ara" data-p2-ara type="search" maxlength="20" placeholder="${esc(_autoMetin('Arkadaşlarında ara'))}" value="${esc(arkQ)}" aria-label="${esc(_autoMetin('Arkadaşlarında ara'))}">` : ''}<div data-p2-ark></div>`;
    const yer2 = kutu.querySelector('[data-p2-ark]');
    yer2.innerHTML = `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>`;
    let r;
    try { r = await api(`oyuncu-karti/${k.id}/arkadaslar?sayfa=${arkSayfa}&q=${encodeURIComponent(arkQ)}`); } catch (e) { yer2.innerHTML = `<p class="hata">${esc(e.message)}</p>`; return; }
    if (sekme !== 'arkadaslar') return;
    yer2.innerHTML = r.liste.length ? `<div class="pr-arkadaslar">${r.liste.map((a) => `<button data-profil-ac="${a.id}"><span>${avatarHtml(a.foto, a.ad, 64, '', a.gr)}</span><b>${isimHtml(a.ad, a.gr)}</b><small>${_autoSablon`${a.seviye}. sv`}</small></button>`).join('')}</div>${sayfalamaHtml(r.sayfa, r.sayfaSayisi, 'data-ark-sayfa')}`
      : `<p class="kucuk soluk">${arkQ ? _autoHtml('Aramana uyan arkadaş yok.') : k.ben ? _autoHtml("Henüz arkadaşın yok. Mesajlar'dan ya da oyuncuların profilinden arkadaş ekleyebilirsin.") : _autoHtml("Henüz arkadaşı yok.")}</p>`;
  };
  panelAc({
    ikon: '', baslik: k.ad, alt: _autoHtml('Profil'), govde,
    hazir(g) {
      icerikCiz(g);
      g.addEventListener('input', (e) => {
        if (!e.target.matches('[data-p2-ara]')) return;
        clearTimeout(zam);
        zam = setTimeout(() => { arkQ = e.target.value.trim(); arkSayfa = 1; icerikCiz(g); }, 300);
      });
      g.addEventListener('click', async (e) => {
        const sk = e.target.closest('[data-p2-sekme]');
        if (sk) { ses.tik(); sekme = sk.dataset.p2Sekme; g.querySelectorAll('[data-p2-sekme]').forEach((x) => x.setAttribute('aria-selected', String(x === sk))); g.querySelector('[data-p2-icerik]').innerHTML = ''; icerikCiz(g); return; }
        const it = e.target.closest('[data-is-tur]');
        if (it) { ses.tik(); isTur = it.dataset.isTur; isSayfa = 1; icerikCiz(g); return; }
        const isf = e.target.closest('[data-is-sayfa]');
        if (isf && !isf.disabled) { isSayfa = Number(isf.dataset.isSayfa); icerikCiz(g); return; }
        const asf = e.target.closest('[data-ark-sayfa]');
        if (asf && !asf.disabled) { arkSayfa = Number(asf.dataset.arkSayfa); icerikCiz(g); return; }
        const m = e.target.closest('[data-mesaj]');
        if (m) { ses.tik(); konusmaPaneli(k.ad); return; }
        const pa = e.target.closest('[data-profil-ac]');
        if (pa) { ses.tik(); oyuncuKarti(Number(pa.dataset.profilAc)); return; }
        const b = e.target.closest('[data-arkadas]');
        if (!b) return;
        const ne = b.dataset.arkadas;
        if (ne === 'sil' && k.iliski === 'arkadas' && !(await onayla(_autoSablon`${k.ad} arkadaşlarından çıkarılsın mı?`, { tehlike: true, ikon: '👥' }))) return;
        ses.tik(); b.disabled = true;
        try {
          const r = await api('arkadas/' + ne, { id: k.id });
          const once = k.iliski;
          k.iliski = r.durum;
          if (r.durum === 'arkadas' && once !== 'arkadas') { k.arkadasSayisi++; bildir(_autoSablon`🤝 ${k.ad} ile artık arkadaşsınız.`); }
          else if (r.durum === 'gonderildi') bildir(_autoMetin('Arkadaşlık isteği gönderildi.'));
          else if (once === 'arkadas') k.arkadasSayisi = Math.max(0, k.arkadasSayisi - 1);
          if (once === 'gelen') { d.genel.arkadasIstek = Math.max(0, (d.genel.arkadasIstek || 1) - 1); toplaButonuGuncelle(); }
          g.querySelector('[data-eylemler]').innerHTML = iliskiDugmesi();
        } catch (er) { bildir(er.message, true); b.disabled = false; }
      });
    },
  });
}

// 0.49.4: Arkadaşlar penceresi: arkadaşlarım (arama, sıralama), istekler (gelen/gönderilen), oyuncu bul; hepsi sayfalı
const ARK_DURUM = { sayfa: 1, q: '', sira: 'son', yon: 'gelen', bulQ: '', bulSayfa: 1 };
async function arkadaslarPaneli(sekme = rotaEki() || 'liste') {
  if (!['liste', 'istekler', 'bul'].includes(sekme)) sekme = 'liste';
  const p = panelAc({
    ikon: '👥', baslik: _autoMetin('Arkadaşlar'), rota: 'arkadaslar',
    govde: `<div class="sekmeler" role="tablist">
        <button role="tab" data-sekme="liste" aria-selected="${sekme === 'liste'}">${_autoHtml("Arkadaşlarım")}</button>
        <button role="tab" data-sekme="istekler" aria-selected="${sekme === 'istekler'}">${_autoHtml("İstekler")}${sekmeSayaci(Number(d.genel.arkadasIstek) || 0)}</button>
        <button role="tab" data-sekme="bul" aria-selected="${sekme === 'bul'}">${_autoHtml("🔎 Oyuncu bul")}</button>
      </div><div class="ark-arac" data-ark-arac></div><div data-ark-govde><p class="soluk">${_autoHtml("Yükleniyor…")}</p></div>`,
    hazir(g) {
      g.querySelectorAll('[data-sekme]').forEach((b) => b.addEventListener('click', () => { ses.tik(); history.replaceState(null, '', '#/arkadaslar/' + b.dataset.sekme); arkadaslarPaneli(b.dataset.sekme); }));
    },
  });
  p.classList.add('panel-sabit'); // 0.44.1: sekme değişince pencere boyu oynamasın
  const arac = p.querySelector('[data-ark-arac]');
  const kutu = p.querySelector('[data-ark-govde]');
  const kisi = (x, eylem = '') => `<li class="ark-kisi"><button class="ark-ac" data-profil-ac="${x.id}"><span class="ark-foto${x.cevrimici ? ' cevrimici' : ''}">${avatarHtml(x.foto, x.ad, 48, '', x.gr)}</span>
      <span class="ark-bilgi"><b>${isimHtml(x.ad, x.gr)}</b><small><span class="ark-sv">${_autoSablon`${x.seviye}. sv`}</span> · 📍 ${esc(x.yer)}${x.cevrimici ? ` · <span class="ark-acik">${_autoHtml('çevrimiçi')}</span>` : x.sonGiris ? ' · ' + _autoSablon`son görülme ${tarihMetni(x.sonGiris)}` : ''}</small></span></button><span class="ark-eylem">${eylem}</span></li>`;
  const mesajDugme = (x) => `<button class="dugme mavi kucuk ark-mesaj" data-mesaj-ad="${esc(x.ad)}" aria-label="${_autoHtml("Mesaj")}" title="${_autoHtml("Mesaj")}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg></button>`;
  const iliskiDugme = (x) => x.iliski === 'arkadas' ? `<span class="rozetcik iyi">${_autoHtml('Arkadaşsınız')}</span>`
    : x.iliski === 'gonderildi' ? `<span class="rozetcik">${_autoHtml('İstek gönderildi')}</span>`
    : x.iliski === 'gelen' ? `<button class="dugme yesil kucuk" data-ark="kabul" data-yon="gelen" data-id="${x.id}">${_autoHtml("Kabul et")}</button>`
    : `<button class="dugme yesil kucuk" data-ark="istek" data-id="${x.id}">${_autoHtml("➕ Ekle")}</button>`;
  const ciz = async () => {
    if (!kutu.isConnected) return;
    if (sekme === 'bul') {
      kutu.innerHTML = `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>`;
      let r;
      try { r = await api(`arkadas-ara?q=${encodeURIComponent(ARK_DURUM.bulQ)}&sayfa=${ARK_DURUM.bulSayfa}`); } catch (e) { kutu.innerHTML = `<p class="hata">${esc(e.message)}</p>`; return; }
      if (!kutu.isConnected) return;
      kutu.innerHTML = `<h4 class="ark-baslik">${r.oneri ? _autoHtml('İlçendeki oyuncular') : _autoSablon`${sayiTr(r.toplam)} sonuç`}</h4>
        <ul class="ark-liste">${r.liste.map((x) => kisi(x, iliskiDugme(x))).join('') || `<li class="soluk kucuk">${r.oneri ? _autoHtml('İlçende önerilecek oyuncu kalmadı. Ad yazarak ara.') : _autoHtml("Bu adla oyuncu bulunamadı.")}</li>`}</ul>
        ${sayfalamaHtml(r.sayfa, r.sayfaSayisi)}`;
      return;
    }
    const api2 = sekme === 'istekler' ? `arkadaslar?sekme=${ARK_DURUM.yon}&sayfa=${ARK_DURUM.sayfa}` : `arkadaslar?sekme=liste&sayfa=${ARK_DURUM.sayfa}&q=${encodeURIComponent(ARK_DURUM.q)}&sira=${ARK_DURUM.sira}`;
    let r;
    try { r = await api(api2); } catch (e) { kutu.innerHTML = `<p class="hata">${esc(e.message)}</p>`; return; }
    if (!kutu.isConnected) return;
    d.genel.arkadasIstek = r.sayilar.gelen; toplaButonuGuncelle();
    if (sekme === 'istekler') {
      const seg = arac.querySelector('[data-ark-yon]');
      if (seg) seg.innerHTML = `<button data-yon-sec="gelen" aria-pressed="${ARK_DURUM.yon === 'gelen'}">${_autoSablon`Gelen (${sayiTr(r.sayilar.gelen)})`}</button><button data-yon-sec="giden" aria-pressed="${ARK_DURUM.yon === 'giden'}">${_autoSablon`Gönderdiğin (${sayiTr(r.sayilar.giden)})`}</button>`;
      const gelen = ARK_DURUM.yon === 'gelen';
      kutu.innerHTML = `<ul class="ark-liste">${r.liste.map((x) => kisi(x, gelen
        ? `<button class="dugme yesil kucuk" data-ark="kabul" data-yon="gelen" data-id="${x.id}">${_autoHtml("Kabul et")}</button><button class="dugme gri kucuk" data-ark="sil" data-yon="gelen" data-id="${x.id}">${_autoHtml("Reddet")}</button>`
        : `<button class="dugme gri kucuk" data-ark="sil" data-id="${x.id}">${_autoHtml("Geri çek")}</button>`)).join('')
        || `<li class="soluk kucuk">${gelen ? _autoHtml("Bekleyen istek yok.") : _autoHtml("Cevap bekleyen isteğin yok.")}</li>`}</ul>${sayfalamaHtml(r.sayfa, r.sayfaSayisi)}`;
      return;
    }
    const ozet = arac.querySelector('[data-ark-ozet]');
    if (ozet) ozet.textContent = _autoSablon`${sayiTr(r.sayilar.arkadas)} arkadaş`;
    kutu.innerHTML = r.sayilar.arkadas ? (r.liste.length ? `<ul class="ark-liste">${r.liste.map((x) => kisi(x, mesajDugme(x))).join('')}</ul>${sayfalamaHtml(r.sayfa, r.sayfaSayisi)}`
      : `<p class="kucuk soluk">${_autoHtml('Aramana uyan arkadaş yok.')}</p>`)
      : `<div class="bos-durum"><span>👥</span><b>${_autoHtml("Henüz arkadaşın yok")}</b><small>${_autoHtml("Oyuncu bul sekmesinden ya da bir oyuncunun profilinden arkadaş ekleyebilirsin.")}</small><button class="dugme yesil" data-git-bul>${_autoHtml("🔎 Oyuncu bul")}</button></div>`;
  };
  // araç çubuğu (sekmeye göre)
  if (sekme === 'liste') {
    arac.innerHTML = `<input type="search" data-ark-q maxlength="20" placeholder="${esc(_autoMetin('Arkadaşlarında ara'))}" value="${esc(ARK_DURUM.q)}" aria-label="${esc(_autoMetin('Arkadaşlarında ara'))}">
      <select data-ark-sira aria-label="${esc(_autoMetin('Sırala'))}">${[['son', _autoMetin('Son görülen')], ['ad', _autoMetin('Ada göre')], ['seviye', _autoMetin('Seviyeye göre')], ['yeni', _autoMetin('Yeni eklenen')]].map(([v, a]) => `<option value="${v}" ${ARK_DURUM.sira === v ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select>
      <small class="ark-ozet" data-ark-ozet></small>`;
  } else if (sekme === 'istekler') {
    arac.innerHTML = `<div class="ark-segment" data-ark-yon role="group"></div>`;
  } else {
    arac.innerHTML = `<form class="ark-ara" data-ara><input name="q" type="search" maxlength="20" placeholder="${_autoHtml("Oyuncu adı yaz")}" value="${esc(ARK_DURUM.bulQ)}" autocapitalize="off" autocomplete="off" enterkeyhint="search"></form>`;
  }
  let zam = null;
  arac.addEventListener('input', (e) => {
    const q = e.target.closest('[data-ark-q]'), bq = e.target.closest('[name=q]');
    if (!q && !bq) return;
    clearTimeout(zam);
    zam = setTimeout(() => { if (q) { ARK_DURUM.q = q.value.trim(); ARK_DURUM.sayfa = 1; } else { const v = bq.value.trim(); if (v.length === 1) return; ARK_DURUM.bulQ = v; ARK_DURUM.bulSayfa = 1; } ciz(); }, 300);
  });
  arac.addEventListener('change', (e) => { if (e.target.matches('[data-ark-sira]')) { ARK_DURUM.sira = e.target.value; ARK_DURUM.sayfa = 1; ciz(); } });
  arac.addEventListener('submit', (e) => { e.preventDefault(); const v = e.target.elements.q.value.trim(); ARK_DURUM.bulQ = v.length >= 2 ? v : ''; ARK_DURUM.bulSayfa = 1; ciz(); });
  arac.addEventListener('click', (e) => { const y = e.target.closest('[data-yon-sec]'); if (y) { ses.tik(); ARK_DURUM.yon = y.dataset.yonSec; ARK_DURUM.sayfa = 1; ciz(); } });
  kutu.addEventListener('click', async (e) => {
    const sf = e.target.closest('[data-sayfa]');
    if (sf && !sf.disabled) { ses.tik(); if (sekme === 'bul') ARK_DURUM.bulSayfa = Number(sf.dataset.sayfa); else ARK_DURUM.sayfa = Number(sf.dataset.sayfa); ciz(); kutu.scrollIntoView({ block: 'start' }); return; }
    const pa = e.target.closest('[data-profil-ac]');
    if (pa) { ses.tik(); oyuncuKarti(Number(pa.dataset.profilAc)); return; }
    const m = e.target.closest('[data-mesaj-ad]');
    if (m) { ses.tik(); konusmaPaneli(m.dataset.mesajAd); return; }
    const gb = e.target.closest('[data-git-bul]');
    if (gb) { ses.tik(); history.replaceState(null, '', '#/arkadaslar/bul'); arkadaslarPaneli('bul'); return; }
    const b = e.target.closest('[data-ark]');
    if (!b) return;
    ses.tik(); b.disabled = true;
    try {
      await api('arkadas/' + b.dataset.ark, { id: Number(b.dataset.id) });
      if (b.dataset.ark === 'istek') bildir(_autoMetin('Arkadaşlık isteği gönderildi.'));
      ciz();
    } catch (er) { bildir(er.message, true); b.disabled = false; }
  });
  if (ARK_DURUM.sekme !== sekme) { ARK_DURUM.sekme = sekme; ARK_DURUM.sayfa = 1; }
  if (sekme === 'bul') setTimeout(() => { const i = arac.querySelector('[name=q]'); if (i) i.focus(); }, 50);
  ciz();
}

// 0.57.13: oyuncunun seçtiği sokak cihazda hatırlanır (sayfa yenilenince başka sokağa atlamasın)
const sokakAnahtari = () => 'cirak_sokak_' + ((d.genel && d.genel.oyuncu && d.genel.oyuncu.ilce && d.genel.oyuncu.ilce.id) || 0);
function sokakSecimiKaydet(no) {
  d.sokakSecimi = no;
  try { localStorage.setItem(sokakAnahtari(), String(no)); } catch (e) { /* depolama yoksa yalnız bu oturumda */ }
}
// Dükkâna git: dükkân şu an gösterilen sokakta değilse önce onun sokağına geçilir
async function dukkanaOdaklaSokak(no, sokak = null) {
  if (!no) return;
  const sk = Number(sokak);
  if (sokak != null && sokak !== '' && Number.isFinite(sk) && d.cadde && d.cadde.sokak && sk !== d.cadde.sokak.secili && !d.ziyaret) {
    sokakSecimiKaydet(sk);
    try { await caddeYenile(); } catch (e) { bildir(e.message, true); return; }
  }
  mahalle.dukkanaOdakla(no);
}
async function caddeYenile() {
  if (d.sokakSecimi == null) { try { const k = localStorage.getItem(sokakAnahtari()); if (k != null && k !== '' && Number.isFinite(Number(k))) d.sokakSecimi = Number(k); } catch (e) { /* yok say */ } }
  d.cadde = await api('cadde' + (d.sokakSecimi != null ? '?sokak=' + d.sokakSecimi : ''));
  if (d.cadde.sokak) d.sokakSecimi = d.cadde.sokak.secili;
  sokakCipi();
  // oyuncunun kayıtta seçtiği mahalle, caddenin (OSM'den gelen) mahalle adının yerine geçer: tanıtımda, üst çubukta, haritada
  const om = d.genel && d.genel.oyuncu && d.genel.oyuncu.mahalle;
  if (om && d.cadde.isimler) d.cadde.isimler.mahalle = om.ad;
  if (!d.ziyaret) mahalle.devletAyarla(d.cadde.devlet || []); // 0.49: devlet binaları (kaymakamlık, belediye…); 0.51: gezintide gezilen yerinkiler kalır
  if (d.oyunYukleniyor) await mahalle.caddeHazirla(d.cadde.yerler, d.cadde.isimler);
  else mahalle.caddeGuncelle(d.cadde.yerler, d.cadde.isimler);
  // 0.43: onaylı kutlama ilanları mahalle panolarında dükkân reklamlarıyla birlikte döner
  mahalle.reklamlariAyarla([...(d.cadde.reklamlar || []), ...(d.cadde.kutlamalar || []).map((k) => ({ kutlama: true, id: 'k' + k.id, ad: k.metin, simge: k.simge, oyuncu: k.oyuncu, oyuncuId: k.oyuncuId }))]);
  mahalle.bilboardlariAyarla(d.cadde.bilboardlar || []);
  if (!d.ziyaret) mahalle.kamuAyarla(d.cadde.kamu || null); // 0.50: cami, okul, park adları
  if (!d.ziyaret) mahalle.secimAyarla(d.cadde.secim || null); // 0.50: seçim pankartları, araçları ve miting
  // 0.49: ilçede süren belediye çalışması kaldırımda görünür
  if (!d.ziyaret && mahalle.belediyeCalismasi && d.genel && d.genel.oyuncu) mahalle.belediyeCalismasi(d.cadde.calisma || null, d.genel.oyuncu.ilce.ad);
  const benimId = d.genel && d.genel.oyuncu && d.genel.oyuncu.id;
  mahalle.dolasanlarAyarla(d.cadde.dolasanlar || []);
  mahalle.havaiFisekAyarla(d.cadde.havaiFisekler || []);
  // kendi arabası mahallede dolaşıyorsa park yerinde ikinci kez durmaz
  mahalle.arabamAyarla((d.cadde.dolasanlar || []).some((x) => x.oyuncuId === benimId) ? null : (d.cadde.arabam || null));
  const yerYazi = document.querySelector('.oyuncu-yer');
  if (yerYazi && d.cadde.isimler) {
    const m = `${d.cadde.isimler.mahalle.replace(' Mahallesi', ' Mah.')}, ${d.genel.oyuncu.ilce.ad}`;
    // bölgedeyken kartta bölgenin adı durur; mahalle adı çıkışta geri gelsin diye saklanır
    if (document.body.classList.contains('bolgede')) yerYazi.dataset.mahalle = m; else yerYazi.textContent = m;
  }
  if (d.genel && d.genel.oyuncu) harita.benimIlceAyarla(d.genel.oyuncu.il.id, d.genel.oyuncu.ilce.id, d.cadde.isimler ? d.cadde.isimler.mahalle : '');
  return d.cadde;
}
// 0.41: kalabalık ilçede birden çok sokak: üstte "🛣️ 2. Sokak" seçicisi (her sokaktaki kiralık yer sayısıyla)
// 0.57.9: balon teması (açık / koyu)
function temaOku() { try { return localStorage.getItem('tezgah_tema') === 'koyu' ? 'koyu' : 'acik'; } catch (e) { return 'acik'; } }
function temaUygula(tema) { document.body.classList.toggle('koyu-tema', tema === 'koyu'); const b = document.getElementById('tema-dugme'); if (b) { b.dataset.secili = tema; b.setAttribute('aria-pressed', tema === 'koyu' ? 'true' : 'false'); } }
function temaDugmesiKur(b) {
  if (!b) return;
  temaUygula(temaOku());
  b.addEventListener('click', () => {
    const yeni = temaOku() === 'koyu' ? 'acik' : 'koyu';
    try { localStorage.setItem('tezgah_tema', yeni); } catch (e) { /* yok say */ }
    ses.tik();
    temaUygula(yeni);
    bildir(yeni === 'koyu' ? _autoMetin('🌙 Koyu tema') : _autoMetin('☀️ Açık tema'));
  });
}
function sokakAdi(no) { return no ? _autoSablon`${no + 1}. Sokak` : _autoMetin('Ana cadde'); }
// 0.57.13: dükkânımın adresi: "No 21 · 2. Sokak (arka sokak)" — hangi sokakta ve ön/arka sırada olduğu
function dukkanAdresi(x) {
  const ad = (d.cadde && d.cadde.isimler) || {};
  const arka = Number(x.sira) > 0, sk = Number(x.sokak) || 0;
  const cadde = sk ? sokakAdi(sk) : arka ? (ad.arkaSokak || _autoMetin('Arka sokak')) : (ad.anaCadde || _autoMetin('Ana cadde'));
  return _autoSablon`No ${x.yerNo} · ${cadde}${arka ? _autoMetin(' (arka sokak)') : ''}`;
}
function sokakCipi() {
  const sk = d.cadde && d.cadde.sokak;
  let cip = document.getElementById('sokak-cip');
  // 0.57.9: çip kısayol simgelerinin altında, sol grubun akışında durur (üstlerine binmez)
  const yer = document.querySelector('.alt-hud .sol-grup') || document.querySelector('.hud');
  if (!sk || (sk.toplamSokak || sk.liste.length) < 2 || !yer) { if (cip) cip.remove(); return; }
  if (!cip) {
    cip = document.createElement('button');
    cip.id = 'sokak-cip'; cip.className = 'sokak-cip';
    yer.appendChild(cip);
    cip.addEventListener('click', () => { ses.tik(); sokakPaneli(); });
  }
  // 0.57.16: sayı, görünen (seçili) sokaktaki kiralık dükkân sayısıdır; eskiden bütün ilçenin toplamı yazıyordu
  // ("5 kiralık" yazıp sokakta 5 kiralık görünmüyordu)
  const burada = sokakKiraliklari().length;
  const sayi = sk.toplamSokak || sk.liste.length;
  cip.innerHTML = `<span class="sc-ikon" aria-hidden="true">🛣️</span><span class="sc-metin"><b>${esc(sokakAdi(sk.secili))}</b><small>${esc(burada ? _autoSablon`Bu sokakta ${burada.toLocaleString(sayiDili())} kiralık · ${sayi.toLocaleString(sayiDili())} sokak` : _autoSablon`Bu sokakta kiralık yok · ${sayi.toLocaleString(sayiDili())} sokak`)}</small></span>`;
}
// Görünen sokaktaki kiralık yerler (ön sıra: ana cadde, arka sıralar: arka sokak), numara sırasıyla
function sokakKiraliklari() {
  const yerler = (d.cadde && d.cadde.yerler) || [];
  return yerler.filter((y) => !y.isletme).sort((a, b) => (a.sira || 0) - (b.sira || 0) || a.no - b.no);
}
function sokakPaneli() {
  const sk = d.cadde && d.cadde.sokak;
  if (!sk) return;
  // 0.57.14: "Görünüm seç": her sokak bir kart; toplam, dolu, kiralık ve oyuncunun kendi dükkân sayısı ayrı ayrı yazılır
  const sayi = (n) => Number(n || 0).toLocaleString(sayiDili());
  const toplamBenim = sk.liste.reduce((t, x) => t + (Number(x.benim) || 0), 0);
  const gsKart = (x) => {
    const secili = x.no === sk.secili;
    const dolu = Math.max(0, (Number(x.toplam) || 0) - (Number(x.bos) || 0));
    return `<button type="button" class="gs-kart${secili ? ' secili' : ''}" data-sokak="${x.no}" aria-pressed="${secili}">
      <span class="gs-simge" aria-hidden="true">${x.no ? '🛣️' : '🏙️'}</span>
      <span class="gs-govde">
        <span class="gs-ust"><b>${esc(sokakAdi(x.no))}</b>${secili ? `<span class="gs-burada">✓ ${_autoHtml("Şu an buradasın")}</span>` : ''}</span>
        <span class="gs-olcu">
          <span class="gs-hap"><i>🏪</i>${_autoSablon`${sayi(x.toplam)} dükkân`}</span>
          <span class="gs-hap"><i>🔒</i>${_autoSablon`${sayi(dolu)} dolu`}</span>
          <span class="gs-hap ${x.bos ? 'kiralik' : 'yok'}"><i>🔑</i>${x.bos ? _autoSablon`${sayi(x.bos)} kiralık` : _autoHtml("Kiralık yok")}</span>
          ${x.benim ? `<span class="gs-hap benim"><i>⭐</i>${_autoSablon`${sayi(x.benim)} dükkânın`}</span>` : ''}
        </span>
      </span>
      <span class="gs-ok" aria-hidden="true">›</span>
    </button>`;
  };
  panelAc({ ikon: '🛣️', baslik: _autoMetin('Görünüm seç'), alt: _autoMetin('Hangi sokağı görmek istediğini seç'),
    govde: `<div class="gs-ozet">
        <div><small>${_autoHtml("Sokak")}</small><b>${sayi(sk.toplamSokak || sk.liste.length)}</b></div>
        <div><small>${_autoHtml("Kiralık yer")}</small><b class="arti">${sayi(sk.toplamBos != null ? sk.toplamBos : sk.liste.reduce((t, x) => t + x.bos, 0))}</b></div>
        <div><small>${_autoHtml("Senin dükkânın")}</small><b>${sayi(toplamBenim)}</b></div>
      </div>
      ${(() => {
        // 0.57.16: görünen sokaktaki kiralık dükkânlar: nerede olduklarını bulmak zordu (arka sokaktakiler kamerada görünmüyor)
        const l = sokakKiraliklari();
        if (!l.length) return '';
        const ad = (d.cadde && d.cadde.isimler) || {};
        return `<h3 class="bolum-baslik">${_autoSablon`${esc(sokakAdi(sk.secili))}: kiralık dükkânlar (${l.length})`}</h3>
        <div class="gs-kiralik">${l.map((y) => {
          const arka = (y.sira || 0) > 0;
          return `<div class="gs-kr">
            <button type="button" class="gs-kr-git" data-kiralik-git="${y.no}"><span class="gs-kr-no">${y.no}</span>
              <span class="gs-kr-bilgi"><b>${esc(arka ? (ad.arkaSokak || _autoMetin('Arka sokak')) : (ad.anaCadde || _autoMetin('Ana cadde')))}</b><small>${_autoSablon`${esc(y.boyutAdi)} dükkân · ${y.m2} m²`} · ${tl(y.kira)}${_autoHtml("/ay")}</small></span>
              <span class="gs-kr-yer ${arka ? 'arka' : 'on'}">${arka ? _autoHtml("Arka sıra") : _autoHtml("Ön sıra")}</span></button>
            <button type="button" class="gs-kr-incele" data-kiralik-incele="${y.no}" aria-label="${_autoHtml("İncele")}">${_autoHtml("İncele")}</button>
          </div>`;
        }).join('')}</div>
        <p class="kucuk soluk gs-not">${_autoHtml("Numaraya dokun, kamera dükkâna gitsin. Arka sıradaki dükkânlar ana caddenin arkasındaki sokaktadır.")}</p>
        <h3 class="bolum-baslik">${_autoHtml("Sokaklar")}</h3>`;
      })()}
      <div class="gs-liste">${sk.liste.map(gsKart).join('')}</div>
      ${sk.toplamSokak > sk.liste.length ? `<p class="kucuk soluk gs-not">${_autoSablon`İlçede ${sk.toplamSokak.toLocaleString(sayiDili())} sokak var; kiralık yeri olanlar ve senin dükkânlarının bulunduğu sokaklar listelendi.`}</p>` : `<p class="kucuk soluk gs-not">${_autoHtml("İlçe kalabalıklaştıkça yeni sokaklar açılır.")}</p>`}`,
    hazir(g) {
      g.querySelectorAll('[data-kiralik-git]').forEach((b) => b.addEventListener('click', () => {
        ses.tik(); panelKapat(true); mahalle.dukkanaOdakla(Number(b.dataset.kiralikGit));
      }));
      g.querySelectorAll('[data-kiralik-incele]').forEach((b) => b.addEventListener('click', () => {
        const y = sokakKiraliklari().find((x) => x.no === Number(b.dataset.kiralikIncele));
        if (!y) return;
        ses.tik(); mahalle.dukkanaOdakla(y.no); kiralamaPaneli(y);
      }));
      g.querySelectorAll('[data-sokak]').forEach((li) => li.addEventListener('click', async () => {
        ses.tik();
        sokakSecimiKaydet(Number(li.dataset.sokak));
        panelKapat(true);
        try { await caddeYenile(); mahalle.tezgahlariGoster && mahalle.tezgahlariGoster(true); } catch (e) { bildir(e.message, true); }
      }));
    },
  });
}
async function haritaYenile() {
  d.haritaVeri = await api('harita');
  if (d.genel && d.genel.oyuncu) harita.benimIliAyarla(d.genel.oyuncu.il.id);
  harita.istatistik(d.haritaVeri);
}

// ---------- Giriş ekranı ----------
// ---------- Doğrulama kodu (4 haneli, resimli) ----------
function dogrulamaHtml() {
  return `<div class="dogrulama">
      <img class="dogrulama-resim" alt="${esc(t('auth.captcha'))}" width="150" height="52">
      <button type="button" class="dogrulama-yenile" aria-label="${esc(t('auth.refreshCaptcha'))}">↻</button>
      <label class="alan dogrulama-alan"><span>${esc(t('auth.captchaDigits'))}</span>
        <input name="dogrulamaKod" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" required></label>
      <input type="hidden" name="dogrulamaAnahtar">
    </div>`;
}
async function dogrulamaYenile(form) {
  const k = form.querySelector('.dogrulama');
  if (!k) return;
  try {
    const r = await api('dogrulama');
    k.querySelector('img').src = r.resim;
    form.elements.dogrulamaAnahtar.value = r.anahtar;
    form.elements.dogrulamaKod.value = '';
  } catch (e) { bildir(e.message, true); }
}
function dogrulamaKur(form) {
  const k = form.querySelector('.dogrulama');
  if (!k) return;
  k.querySelector('.dogrulama-yenile').addEventListener('click', () => { ses.tik(); dogrulamaYenile(form); });
  dogrulamaYenile(form);
}

const GOOGLE_SVG = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
const FACEBOOK_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#fff" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>';

// Google / Facebook düğmeleri (sunucuda anahtarı girilmiş olanlar görünür)
function sosyalGirisHtml(kayitMi) {
  const y = d.girisYontemleri || {};
  if (!y.google && !y.facebook) return '';
  const davet = new URLSearchParams(location.search).get('davet');
  const q = davet ? '?davet=' + encodeURIComponent(davet) : '';
  const eylem = provider => esc(t(kayitMi ? 'auth.socialSignup' : 'auth.socialLogin',{provider}));
  return `<div class="sosyal-girisler">
      ${y.google ? `<a class="sosyal-dugme google" href="api/oauth/google/basla${q}">${GOOGLE_SVG}<span>${eylem('Google')}</span></a>` : ''}
      ${y.facebook ? `<a class="sosyal-dugme facebook" href="api/oauth/facebook/basla${q}">${FACEBOOK_SVG}<span>${eylem('Facebook')}</span></a>` : ''}
    </div>
    <div class="ya-da"><span>${esc(t('auth.or'))}</span></div>`;
}

// Kayıtta isteğe bağlı profil fotoğrafı
function fotoSeciciHtml(varsayilan) {
  const foto = d.kayitFoto || varsayilan || null;
  return `<div class="foto-sec">
      <button type="button" class="foto-dugme" data-eylem="foto-sec" aria-label="${esc(t('auth.choosePhoto'))}">
        ${foto ? `<img src="${esc(foto)}" alt="">` : '<span aria-hidden="true">📷</span>'}<i aria-hidden="true">＋</i></button>
      <div><b>${esc(t('auth.photo'))}</b> <span class="kucuk soluk">${esc(t('auth.optional'))}</span><br>
        <span class="kucuk soluk">${esc(t('auth.photoHint'))}</span>
        ${foto ? `<br><a href="#" class="kucuk" data-eylem="foto-kaldir">${esc(t('auth.removePhoto'))}</a>` : ''}</div>
    </div>`;
}
function fotoSeciciKur(kok, yenile) {
  const b = kok.querySelector('[data-eylem=foto-sec]');
  if (!b) return;
  b.addEventListener('click', async () => {
    ses.tik();
    try {
      const f = await fotoSec();
      if (!f) return;
      d.kayitFoto = f;
      d.kayitFotoKaldirildi = false;
      yenile();
    } catch (e) { bildir(e.message, true); }
  });
  const k = kok.querySelector('[data-eylem=foto-kaldir]');
  if (k) k.addEventListener('click', (e) => { e.preventDefault(); d.kayitFoto = null; d.kayitFotoKaldirildi = true; yenile(); });
}

let girisCizimi = 0;
async function girisCiz() {
  if (d.oyunYukleniyor) return;
  const cizim = ++girisCizimi;
  await dilHazirla();
  if (cizim !== girisCizimi) return;
  ses.muzikBaglami('giris');
  const sekme = d.girisSekmesi;
  const kayitMi = sekme === 'kayit';
  const tamamlaMi = sekme === 'tamamla';
  const ilceli = kayitMi || tamamlaMi;
  if (!d.girisYontemleri) {
    try { d.girisYontemleri = await api('giris-yontemleri'); } catch (e) { d.girisYontemleri = {}; }
  }
  if (tamamlaMi && !d.bekleyen) {
    try { d.bekleyen = await api('oauth/bekleyen/' + d.oauthToken); } catch (e) {
      bildir(e.message, true);
      d.girisSekmesi = 'kayit';
      history.replaceState(null, '', location.pathname + location.search);
      return girisCiz();
    }
  }
  if (d.oyunYukleniyor || cizim !== girisCizimi) return;
  // form yeniden çizilirken yazılanlar kaybolmasın
  const eskiForm = document.getElementById('giris-formu');
  const yazilanlar = eskiForm && eskiForm.dataset.sekme === sekme ? Object.fromEntries(new FormData(eskiForm).entries()) : null;
  panelKapat(true);
  // arka planda 3D harita yerine sinematik gün batımı şehri (çizim yükü yok)
  sahne.sahneSec(null);
  girisSahnesiKur();
  let form = '';
  if (sekme === 'unuttum') {
    form = `<form id="giris-formu" novalidate>
        <p class="kucuk" data-i18n="auth.resetHint"></p>
        <label class="alan"><span data-i18n="auth.usernameEmail">${_autoHtml("Kullanıcı adı ya da e-posta")}</span><input name="kim" autocapitalize="off" required></label>
        ${dogrulamaHtml()}
        <button class="dugme" type="submit" data-i18n="auth.sendLink">${_autoHtml("Bağlantı gönder")}</button>
        <p class="kucuk soluk">${_autoMetin("Hesabında e-posta yoksa <a href=\"#\" data-sekme=\"iletisim\">bize yaz</a>, yardımcı olalım.")}</p>
      </form>`;
  } else if (sekme === 'sifre') {
    form = `<form id="giris-formu" novalidate>
        <p class="kucuk" data-i18n="auth.newPasswordHint"></p>
        <label class="alan"><span data-i18n="auth.newPassword">${_autoHtml("Yeni şifre")}</span><input name="sifre" type="password" autocomplete="new-password" required minlength="6"></label>
        <label class="alan"><span data-i18n="auth.repeatPassword">${_autoHtml("Yeni şifre (tekrar)")}</span><input name="sifre2" type="password" autocomplete="new-password" required minlength="6"></label>
        <button class="dugme" type="submit" data-i18n="auth.changePassword">${_autoHtml("Şifremi değiştir")}</button>
      </form>`;
  } else if (sekme === 'iletisim') {
    form = iletisimFormu(false);
  } else if (tamamlaMi) {
    const b = d.bekleyen;
    form = `<form id="giris-formu" novalidate>
          <p class="kucuk">${_autoSablon`${esc(b.saglayiciAdi)} hesabınla`}${b.ad ? ` ${_autoSablon`<b>${esc(b.ad)}</b> olarak`}` : ''} ${_autoHtml("bağlandın. Son olarak oyunda görünecek adını ve yaşadığın yeri seç.")}</p>
          ${b.mevcut ? `<p class="kucuk uyari-kutu">${_autoSablon`Bu e-postayla açılmış bir Çırak hesabın olabilir. Öyleyse <a href="#" data-sekme="giris">şifrenle giriş yap</a>, sonra Hesabım'dan ${esc(b.saglayiciAdi)} hesabını bağla.`}</p>` : ''}
          ${fotoSeciciHtml(d.kayitFotoKaldirildi ? null : b.foto)}
          <label class="alan"><span data-i18n="auth.username">${_autoHtml("Kullanıcı adı")}</span>
            <input name="kullaniciAdi" autocomplete="username" autocapitalize="off" required minlength="3" maxlength="20" value="${esc(b.oneri)}"></label>
          <label class="alan"><span data-i18n="auth.country"></span><select name="ulkeKodu" required><option value="TR">${_autoHtml("Türkiye")}</option></select></label>
          <p class="kucuk soluk" data-i18n="auth.countryNote"></p>
          <label class="alan"><span data-i18n="auth.province">${_autoHtml("Yaşadığın il")}</span>
            <select name="ilId" required><option value="">${esc(t('auth.loading'))}</option></select></label>
          <label class="alan"><span data-i18n="auth.district">${_autoHtml("İlçe")}</span>
            <select name="ilceId" required disabled><option value="">${esc(t('auth.firstProvince'))}</option></select></label>
          <label class="alan"><span data-i18n="auth.neighborhood">${_autoHtml("Mahalle")}</span>
            <select name="mahalleId" required disabled><option value="">${esc(t('auth.firstDistrict'))}</option></select></label>
          <p class="kucuk soluk" id="ilce-bilgi" data-i18n="auth.locationHint" data-tutar></p>
          <label class="alan"><span data-i18n="auth.invite">${_autoHtml("Davet kodu (varsa)")}</span>
            <input name="davetKodu" autocapitalize="characters" maxlength="6" value="${esc(b.davet || '')}"></label>
          <button class="dugme" type="submit" data-i18n="auth.complete">${_autoHtml("Kaydı tamamla ve oyna")}</button>
        </form>`;
  } else {
    form = `${sosyalGirisHtml(kayitMi)}<form id="giris-formu" novalidate>
          ${kayitMi ? fotoSeciciHtml() : ''}
          <label class="alan">${kayitMi ? `<span data-i18n="auth.username">${_autoHtml("Kullanıcı adı")}</span>` : `<span data-i18n="auth.usernameEmail">${_autoHtml("Kullanıcı adı ya da e-posta")}</span>`}
            <input name="kullaniciAdi" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" required minlength="3" maxlength="${kayitMi ? 20 : 120}"></label>
          <label class="alan"><span data-i18n="auth.password">${_autoHtml("Şifre")}</span>
            <input name="sifre" type="password" autocomplete="${kayitMi ? 'new-password' : 'current-password'}" required minlength="6"></label>
          ${kayitMi ? `
          <label class="alan"><span data-i18n="auth.country"></span><select name="ulkeKodu" required><option value="TR">${_autoHtml("Türkiye")}</option></select></label>
          <p class="kucuk soluk" data-i18n="auth.countryNote"></p>
          <label class="alan"><span data-i18n="auth.province">${_autoHtml("Yaşadığın il")}</span>
            <select name="ilId" required><option value="">${esc(t('auth.loading'))}</option></select></label>
          <label class="alan"><span data-i18n="auth.district">${_autoHtml("İlçe")}</span>
            <select name="ilceId" required disabled><option value="">${esc(t('auth.firstProvince'))}</option></select></label>
          <label class="alan"><span data-i18n="auth.neighborhood">${_autoHtml("Mahalle")}</span>
            <select name="mahalleId" required disabled><option value="">${esc(t('auth.firstDistrict'))}</option></select></label>
          <p class="kucuk soluk" id="ilce-bilgi" data-i18n="auth.locationHint" data-tutar></p>
          <label class="alan"><span data-i18n="auth.email">${_autoHtml("E-posta (şifreni unutursan yenilemek için)")}</span>
            <input name="eposta" type="email" autocomplete="email" autocapitalize="off" maxlength="120"></label>
          <label class="alan"><span data-i18n="auth.invite">${_autoHtml("Davet kodu (varsa)")}</span>
            <input name="davetKodu" autocapitalize="characters" maxlength="6"></label>` : ''}
          ${dogrulamaHtml()}
          <button class="dugme" type="submit">${kayitMi ? t('auth.play') : t('auth.login')}</button>
        </form>`;
  }
  const basliklar = { unuttum:t('auth.forgot'), sifre:t('auth.newPassword'), iletisim:t('auth.write'), tamamla:t('auth.complete') };
  arayuz.innerHTML = `
    <div class="giris">
      <div class="giris-sol">
        <div class="giris-logo">${_autoHtml("Çırak")}</div>
        <div class="giris-slogan" data-i18n="auth.tagline">${_autoHtml("Çıraklıktan Patronluğa")}</div>
        <div class="giris-tanitim"><span data-i18n="auth.intro"></span>
          <div class="giris-cipler"><span>🏙️ <b data-i18n="auth.cityCount">${_autoHtml("973 ilçe")}</b></span><span>🌦️ <b data-i18n="auth.weather">${_autoHtml("Gerçek hava")}</b></span><span>🚓 <b data-i18n="auth.streets">${_autoHtml("Canlı sokaklar")}</b></span><span>🤝 <b data-i18n="auth.trade">${_autoHtml("Oyuncularla ticaret")}</b></span></div></div>
      </div>
      <div class="giris-kart">
        ${dilSeciciHtml()}
        ${basliklar[sekme] ? `<div class="giris-geri"><button type="button" data-sekme="giris" aria-label="Geri" data-i18n-label="auth.back">‹</button><b>${basliklar[sekme]}</b></div>` : `
        <div class="sekmeler" role="tablist">
          <button role="tab" aria-selected="${kayitMi}" data-sekme="kayit" data-i18n="auth.signup">${_autoHtml("Üye ol")}</button>
          <button role="tab" aria-selected="${!kayitMi}" data-sekme="giris" data-i18n="auth.login">${_autoHtml("Giriş yap")}</button>
        </div>`}
        ${form}
        <nav class="giris-baglantilar">${sekme !== 'unuttum' ? `<a href="#" data-sekme="unuttum" data-i18n="auth.forgot">${_autoHtml("Şifremi unuttum")}</a><span aria-hidden="true">|</span>` : ''}${sekme !== 'iletisim' ? `<a href="#" data-sekme="iletisim" data-i18n="auth.contact">${_autoHtml("İletişim")}</a>` : `<a href="#" data-sekme="giris" data-i18n="auth.login">${_autoHtml("Giriş yap")}</a>`}</nav>
      </div>
    </div>`;

  yerellestir(arayuz);
  const dilKutusu=secimKutusuKur(arayuz.querySelector('[data-dil]'),{ara:t('common.searchLanguage'),bos:t('common.noResults')});
  arayuz.querySelector('[data-dil]').addEventListener('change',async ev=>{
    const secim=ev.target;const onceki=aktifDil();
    try { if(await dilDegistir(secim.value)) { try { localStorage.setItem('cirak_dil_elle','1'); } catch(_) {} await girisCiz(); } }
    catch(e) { secim.value=onceki;dilKutusu.yenile();bildir(e.message,true); }
  });

  arayuz.querySelectorAll('[data-sekme]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    d.girisSekmesi = b.dataset.sekme;
    if (d.girisSekmesi !== 'tamamla' && /^#\/kayit-tamamla\//.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    ses.tik();
    girisCiz();
  }));

  const f = document.getElementById('giris-formu');
  f.dataset.sekme = sekme;
  if (yazilanlar) {
    for (const [k, v] of Object.entries(yazilanlar)) {
      const el = f.elements[k];
      if (el && el.tagName === 'INPUT' && !['dogrulamaKod', 'dogrulamaAnahtar'].includes(k)) el.value = v;
    }
  }
  dogrulamaKur(f);
  fotoSeciciKur(arayuz, () => girisCiz());
  if (ilceli) {
    const ulkeSec=f.elements.ulkeKodu;
    const ulkeKutusu=secimKutusuKur(ulkeSec,{tur:"ulke",ara:t("common.searchCountry"),bos:t("common.noResults")});
    try {
      const katalog=await api('dunya/ulkeler?dil='+encodeURIComponent(aktifDil()));
      if (cizim!==girisCizimi || !f.isConnected) return;
      ulkeSec.innerHTML=katalog.ulkeler.sort((a,b)=>(a.kod==='TR'?-1:b.kod==='TR'?1:0)).map(u=>`<option value="${esc(u.kod)}" data-ad="${esc(_urunAdi(u.ad))}" data-arama="${esc(u.iso3||'')}" data-meta="${u.kod!=='TR'?esc(t('auth.preparing')):''}"${u.kod==='TR'?' selected':''}${u.kod!=='TR'?' disabled':''}>${esc(_urunAdi(u.ad))}${u.kod!=='TR'?' · '+esc(t('auth.preparing')):''}</option>`).join('');
      // 0.41: ülke seçilince o ülkenin dili otomatik gelir (dili elle seçmemişse); para birimi kayıtta ülkeden atanır
      ulkeSec.addEventListener('change',()=>{
        const u=katalog.ulkeler.find(x=>x.kod===ulkeSec.value);
        let elle=false; try { elle=!!localStorage.getItem('cirak_dil_elle'); } catch(_) {}
        if(u?.dil && !elle && u.dil!==aktifDil()) dilDegistir(u.dil).then(()=>girisCiz()).catch(()=>{});
      });
    } catch(e) { /* Türkiye seçimi ağ hatasında kullanılabilir kalır. */ }
    ulkeKutusu.yenile();
    const ilSec = f.elements.ilId;
    const ilceSec = f.elements.ilceId;
    const bilgi = document.getElementById('ilce-bilgi');
    const davet = new URLSearchParams(location.search).get('davet');
    if (davet && !f.elements.davetKodu.value) f.elements.davetKodu.value = davet.toUpperCase().slice(0, 6);
    try {
      if (!d.iller) d.iller = await api('iller');
      if (cizim!==girisCizimi || !f.isConnected) return;
      ilSec.innerHTML = `<option value="">${esc(t('auth.chooseProvince'))}</option>` + d.iller.map((i) => `<option value="${i.id}">${esc(i.ad)}</option>`).join('');
    } catch (e) { bildir(e.message, true); }
    let ilceler = [], ilIstegi=0, mahalleIstegi=0;
    const ilceGeriYukle = async () => {
      if (!yazilanlar || !yazilanlar.ilId) return;
      ilSec.value = yazilanlar.ilId;
      ilSec.dispatchEvent(new Event('change'));
      await new Promise((r) => setTimeout(r, 0));
    };
    ilSec.addEventListener('change', async () => {
      const istek=++ilIstegi;++mahalleIstegi;
      ilceSec.disabled = true;
      ilceSec.innerHTML = `<option value="">${esc(t('auth.loading'))}</option>`;
      if (!ilSec.value) { ilceSec.innerHTML = `<option value="">${esc(t('auth.firstProvince'))}</option>`; return; }
      let gelen;
      try { gelen=await api(`iller/${ilSec.value}/ilceler`); } catch(e) { if(istek===ilIstegi) {ilceSec.innerHTML=`<option value="">${esc(t('auth.chooseDistrict'))}</option>`;bildir(e.message,true);}return; }
      if(istek!==ilIstegi || !f.isConnected)return;
      ilceler=gelen;
      ilceSec.innerHTML = `<option value="">${esc(t('auth.chooseDistrict'))}</option>` + ilceler.map((i) => `<option value="${i.id}">${esc(i.ad)}</option>`).join('');
      ilceSec.disabled = false;
      ilSec.dispatchEvent(new Event('ilceler-hazir'));
    });
    const mahSec = f.elements.mahalleId;
    ilSec.addEventListener('change', () => { mahSec.disabled = true; mahSec.innerHTML = `<option value="">${esc(t('auth.firstDistrict'))}</option>`; });
    ilceSec.addEventListener('change', async () => {
      const istek=++mahalleIstegi;
      const s2 = ilceler.find((i) => String(i.id) === ilceSec.value);
      if (s2) bilgi.textContent = t('auth.populationHint',{population:new Intl.NumberFormat(aktifDil()).format(s2.nufus)});
      mahSec.disabled = true;
      if (!ilceSec.value) { mahSec.innerHTML = `<option value="">${esc(t('auth.firstDistrict'))}</option>`; return; }
      mahSec.innerHTML = `<option value="">${esc(t('auth.loading'))}</option>`;
      let mahalleler = [];
      try { mahalleler = await api(`ilceler/${ilceSec.value}/mahalleler`); } catch (e) { if(istek===mahalleIstegi) {mahSec.innerHTML=`<option value="">${esc(t('auth.chooseNeighborhood'))}</option>`;bildir(e.message,true);}return; }
      if(istek!==mahalleIstegi || !f.isConnected)return;
      if (!mahalleler.length) { mahSec.innerHTML = `<option value="">${esc(t('auth.noNeighborhood'))}</option>`; mahSec.required = false; return; }
      mahSec.required = true;
      mahSec.innerHTML = `<option value="">${esc(t('auth.chooseNeighborhood'))}</option>` + mahalleler.map((m) => `<option value="${m.id}">${esc(m.ad)}</option>`).join('');
      mahSec.disabled = false;
      if (yazilanlar && yazilanlar.mahalleId) mahSec.value = yazilanlar.mahalleId;
    });
    ilSec.addEventListener('ilceler-hazir', () => {
      if (yazilanlar && yazilanlar.ilceId) { ilceSec.value = yazilanlar.ilceId; ilceSec.dispatchEvent(new Event('change')); }
    }, { once: true });
    ilceGeriYukle();
  }

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dugme = f.querySelector('button[type=submit]');
    dugme.disabled = true;
    const veri = {...Object.fromEntries(new FormData(f).entries()),dil:aktifDil()};
    try {
      if (sekme === 'unuttum') {
        await api('sifremi-unuttum', veri);
        kart({ ikon: '📧', baslik: _oyunMetni("ui.7ab56e4da8fe"), metin: _autoMetin('Hesabında e-posta adresi varsa şifre yenileme bağlantısı birkaç dakika içinde gelecek. Spam klasörüne de bak.'), tur: 'basari', sure: 12000 });
        d.girisSekmesi = 'giris';
        return girisCiz();
      }
      if (sekme === 'sifre') {
        if (veri.sifre !== veri.sifre2) throw new Error(_autoMetin('İki şifre aynı değil.'));
        await api('sifre-yenile', { kod: d.sifreKodu, sifre: veri.sifre });
        history.replaceState(null, '', location.pathname + location.search + '#/mahalle');
        bildir(_autoMetin("Şifren değişti, hoş geldin!"));
        return oyunuAc();
      }
      if (sekme === 'iletisim') {
        await api('iletisim', veri);
        kart({ ikon: '✉️', baslik: _oyunMetni("ui.dfdd15aa8747"), metin: _autoMetin('Teşekkürler! En kısa sürede dönüş yapacağız.'), tur: 'basari' });
        d.girisSekmesi = 'giris';
        return girisCiz();
      }
      if (tamamlaMi) {
        let gs = null;
        try { gs = localStorage.getItem('cirak_gelen_sertifika'); } catch (e) { /* yok say */ }
        await api('oauth/tamamla', { ...veri, token: d.oauthToken, foto: d.kayitFoto || undefined, fotoKullan: !d.kayitFotoKaldirildi, sertifikaKodu: gs || undefined });
        history.replaceState(null, '', location.pathname + location.search);
      } else {
        let gs = null;
        try { gs = localStorage.getItem('cirak_gelen_sertifika'); } catch (e) { /* yok say */ }
        const r = await api(kayitMi ? 'kayit' : 'giris', kayitMi ? { ...veri, foto: d.kayitFoto || undefined, sertifikaKodu: gs || undefined } : veri);
        if (r && r.fotoHata) bildir(_autoMetin('Fotoğrafın yüklenemedi, Hesabım\'dan yeniden deneyebilirsin.'), true);
      }
      await api('dunya/tercihler',{dil:aktifDil()}).catch(()=>{});
      ses.satinAl();
      // 0.52: tanıtım filmi oyuna girişte oynatılmaz (ağır yük); Hesabım > Tanıtım'dan istenince izlenir
      d.introGoster = false;
      d.kayitFoto = null;
      d.bekleyen = null;
      await oyunuAc();
      if (kayitMi || tamamlaMi) bildir(tutarEndeksle(_autoMetin("Hoş geldin! 25.000 ₺ sermayen hazır.")));
    } catch (err) {
      ses.hata();
      bildir(err.message, true);
      dugme.disabled = false;
      if (!tamamlaMi) dogrulamaYenile(f);
    }
  });
}

// Adres çubuğundan gelen özel durumlar: Google/Facebook dönüşü, hata mesajı
function adresDurumlari() {
  const h = location.hash;
  const temiz = (yeni = '') => history.replaceState(null, '', location.pathname + location.search + yeni);
  let m = /^#\/kayit-tamamla\/([0-9a-f]{48})$/.exec(h);
  if (m) {
    if (d.genel && d.genel.oyuncu) { temiz(); return; }
    d.oauthToken = m[1];
    d.bekleyen = null;
    d.girisSekmesi = 'tamamla';
    return;
  }
  m = /^#\/giris\?hata=(.*)$/.exec(h);
  if (m) {
    let mesaj = _autoMetin('Giriş yapılamadı.');
    try { mesaj = decodeURIComponent(m[1]); } catch (e) { /* bozuk */ }
    setTimeout(() => bildir(mesaj, true), 300);
    if (d.genel && d.genel.oyuncu) temiz('#/hesap');
    else { temiz(); d.girisSekmesi = 'giris'; }
    return;
  }
  m = /^#\/hesap\?baglandi=(google|facebook)$/.exec(h);
  if (m) {
    temiz('#/hesap');
    setTimeout(() => bildir(_autoSablon`${m[1] === 'google' ? 'Google' : 'Facebook'} hesabın bağlandı. Artık tek dokunuşla girebilirsin.`), 300);
  }
}

// İletişim formu (giriş ekranında ve Hesabım'da)
function iletisimFormu(girisli) {
  const o = girisli && d.genel && d.genel.oyuncu;
  return `<form id="${girisli ? 'iletisim-formu' : 'giris-formu'}" novalidate>
      ${o ? `<p class="kucuk soluk">${_autoSablon`${esc(o.adSoyad || o.kullaniciAdi)} hesabından gönderiyorsun.${o.eposta ? _autoSablon` Yanıt adresin: ${esc(o.eposta)}` : _autoHtml(' Yanıt almak istersen aşağıya e-posta adresi ekleyebilirsin.')}`}</p>` : `<label class="alan"><span>${_autoHtml("Adın")}</span><input name="ad" maxlength="60" autocomplete="name"></label>`}
      ${!o || !o.eposta ? `<label class="alan"><span>${_autoHtml("E-posta (cevap için)")}</span><input name="eposta" type="email" maxlength="120" autocomplete="email"></label>` : ''}
      <label class="alan"><span>${_autoHtml("Konu")}</span>
        <select name="konu"><option>${_autoHtml("Soru")}</option><option>${_autoHtml("Hata bildirimi")}</option><option>${_autoHtml("Öneri")}</option><option>${_autoHtml("Hesabım")}</option><option>${_autoHtml("Şikâyet")}</option><option>${_autoHtml("Diğer")}</option></select></label>
      <label class="alan"><span>${_autoHtml("Mesajın")}</span><textarea name="metin" rows="4" maxlength="3000" required></textarea></label>
      ${o ? '' : dogrulamaHtml()}
      <button class="dugme" type="submit">${_autoHtml("Gönder")}</button>
    </form>`;
}

// ---------- Oyun arayüzü ----------
let oyunAcilisIstegi = null;
function oyunuAc() {
  if (oyunAcilisIstegi) return oyunAcilisIstegi;
  oyunAcilisIstegi = oyunuYukle().finally(() => { oyunAcilisIstegi = null; });
  return oyunAcilisIstegi;
}
async function oyunuYukle() {
  await dilHazirla();
  await durumYenile();
  if (d.genel.oyuncu?.paraBirimi) paraBirimiAyarla(d.genel.oyuncu.paraBirimi);
  if (d.genel.oyuncu?.dil && d.genel.oyuncu.dil!==aktifDil()) await dilDegistir(d.genel.oyuncu.dil).catch(()=>{});
  // e-postadaki şifre yenileme bağlantısı
  const sifreBag = /^#\/sifre\/([0-9a-f]{48})$/.exec(location.hash);
  if (sifreBag) {
    d.sifreKodu = sifreBag[1];
    d.girisSekmesi = 'sifre';
    return girisCiz();
  }
  adresDurumlari();
  if (!d.genel.oyuncu) return girisCiz();
  d.oyunYukleniyor = true;
  girisCizimi++; // Bekleyen eski giriş formu yanıtı oyun arayüzünü ezmesin.
  panelKapat(true);
  sahne.sahneSec(null);
  girisSahnesiKur();
  arayuz.innerHTML = `<div class="oyun-yukleniyor" role="status" aria-live="polite"><div class="giris-kart"><div class="yukleme-cemberi" aria-hidden="true"></div><h2>${_autoHtml("Mahallen hazırlanıyor")}</h2><p>${_autoHtml("Tezgâhlar ve sokaklar yükleniyor…")}</p></div></div>`;
  try {
    // Yükleme kartı boyansın; model kurma işi aynı kareyi bloke etmesin.
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    window.TEZGAH_YUKLEME?.(94, _autoMetin('Mahalle bilgileri alınıyor'));
    await Promise.all([seyyarYenile(), haritaYenile(), caddeYenile()]);
    window.TEZGAH_YUKLEME?.(97, _autoMetin('Görüntü hazırlanıyor'));
    await sahne.onHazirla(mahalle);
  } catch (e) {
    d.oyunYukleniyor = false;
    arayuz.innerHTML = `<div class="oyun-yukleniyor"><div class="giris-kart"><h2>${_autoHtml("Bağlantı kurulamadı")}</h2><p>${esc(e.message)}</p><button class="dugme" data-yukleme-tekrar>${_autoHtml("Tekrar dene")}</button></div></div>`;
    arayuz.querySelector('[data-yukleme-tekrar]').addEventListener('click', () => oyunuAc().catch(() => {}));
    throw e;
  }
  girisSahnesiKaldir();
  d.oyunYukleniyor = false;
  harita.otomatikDon(false);
  harita.gorusKaydir(0);
  arayuzCiz();
  mahalle.tezgahlariGoster(true);
  if (!d.introGoster) ses.muzikBaglami('oyun');
  if (d.introGoster) {
    d.introGoster = false;
    history.replaceState(null, '', location.pathname + location.search);
    await introOynat({
      harita, mahalle, oyuncu: d.genel.oyuncu, isimler: d.cadde && d.cadde.isimler, arayuz,
      isimleriGetir: async () => (await caddeYenile()).isimler,
    });
  }
  rotaUygula();
  // günlük ödül hazırsa takvimi göster
  if (d.genel.bonusVar && aktifRota() === 'mahalle') setTimeout(() => bonusPaneli(), 900);
  bildirimleriBaslat();
  canliBaslat(canliOlay);
  bildirimler.esitle();
  setTimeout(yenilikDuyur, 6000);
  // 0.57.9: efekt kayıtları boşta cihaza indirilir/belleğe çözülür (ilk çalışta takılmasın, sunucu yükü azalsın)
  setTimeout(() => { ses.onYukle().catch(() => {}); }, 20000);
  // aynı ilçedeki diğer oyuncuların açık tezgâhları caddenin uzantısında görünür (dakikada bir yenilenir)
  setTimeout(komsuYenile, 3000);
  clearInterval(d.komsuZamanlayici);
  d.komsuZamanlayici = setInterval(komsuYenile, 60000);
  clearInterval(d.ozelGunZamanlayici);
  d.ozelGunZamanlayici = setInterval(ozelGunKontrol, 1000);
}

// ---------- Canlı olaylar (sunucudan anında gelen haberler) ----------
let yenileZamani = null;
function canliOlay(tur, v) {
  if (tur === 'oturum-kapat') {
    canliKapat(); clearInterval(d.komsuZamanlayici); clearInterval(d.ozelGunZamanlayici);
    d.genel.oyuncu = null; panelKapat(true); girisCiz(); bildir(_autoMetin("Hesabın yönetim tarafından silindi."), true); return;
  }
  if (!d.genel || !d.genel.oyuncu) return;
  if (tur === 'bakiye') {
    const hid = Number(v.hareket) || 0;
    bakiyeUygula(Number(v.bakiye), hid);
    // yeni hesap hareketi: Bildirimler'deki "Hesap hareketleri" sekmesinin sayacı artar (o sekme açıkken artmaz)
    if (hid > (d.hareketSonId || 0)) {
      d.hareketSonId = hid;
      if (!(d.bildirimSekmesi === 'hareket' && aktifRota() === 'bildirimler')) { d.genel.yeniHareket = Math.min(99, (Number(d.genel.yeniHareket) || 0) + 1); sekmeSayilari(); }
    }
    return;
  }
  if (tur === 'mesaj') {
    // açık olan konuşma bu kişiyle ise panel kendisi yeniler
    if (d.panelCanli && d.panelCanli(tur, v)) return;
    d.genel.okunmamis = (d.genel.okunmamis || 0) + 1;
    toplaButonuGuncelle();
    oyunBildirimi('mesaj_' + v.id, '💬', v.ad, String(v.metin || '').slice(0, 90), _autoMetin('Oku'), () => konusmaPaneli(v.ad), 0);
    return;
  }
  if (tur === 'sohbet') {
    if (d.panelCanli) d.panelCanli(tur, v);
    return;
  }
  if (tur === 'grup') {
    if (d.panelCanli && d.panelCanli(tur, v)) return;
    if (v && v.metin) {
      d.genel.okunmamis = (d.genel.okunmamis || 0) + 1;
      toplaButonuGuncelle();
      oyunBildirimi('grup_' + v.id, '👥', `${v.grupAdi || 'Grup'} · ${v.ad}`, String(v.metin || '').slice(0, 90), _autoMetin('Oku'), () => mesajlasma({ grup: v.grupId }), 0);
    } else if (v && v.yeni) {
      oyunBildirimi('grupyeni_' + v.grupId, '👥', _autoMetin('Yeni grup'), _autoSablon`"${v.ad}" grubuna eklendin.`, _oyunMetni('tips.open'), () => mesajlasma({ grup: v.grupId }), 0);
    }
    return;
  }
  if (tur === 'muzisyen') { mahalle.muzisyenGuncelle && mahalle.muzisyenGuncelle(v); return; }
  if (tur === 'havaiFisek') { mahalle.havaiFisekAyarla(v.liste || []); return; }
  // 0.57.9: kutlama ilanı ödeme anında yayına girer; ilçedeki herkesin panosu tazelenir
  if (tur === 'kutlamaIlan') { if (d.cadde && !d.ziyaret) { d.cadde.kutlamalar = v.liste || []; mahalle.reklamlariAyarla([...(d.cadde.reklamlar || []), ...d.cadde.kutlamalar.map((k) => ({ kutlama: true, id: 'k' + k.id, ad: k.metin, simge: k.simge, oyuncu: k.oyuncu, oyuncuId: k.oyuncuId }))]); } return; }
  if (tur === 'arkadas') {
    if (v && v.tur === 'istek') { d.genel.arkadasIstek = (Number(d.genel.arkadasIstek) || 0) + 1; toplaButonuGuncelle(); }
    return;
  }
  if (tur === 'mekan') { mekanHaberi(v || {}); durumYenile().then(hudGuncelle).catch(() => {}); return; }
  if (tur === 'etkinlik') {
    v = v || {};
    if (v.tur === 'davet') {
      d.genel.davetSayisi = (d.genel.davetSayisi || 0) + 1;
      hudGuncelle();
      ses.mesaj && ses.mesaj();
      oyunBildirimi('etkinlik_davet_' + v.oda, v.simge || '🎉', _autoSablon`${v.ad} seni davet etti`, String(v.baslik || ''), _autoMetin('Davete bak'), () => { location.hash = '#/yasam/davetler'; }, 0);
    } else if (v.tur === 'kabul') bildir(_autoSablon`${v.simge || '🎉'} ${v.ad} davetini kabul etti: ${v.baslik}`);
    else if (v.tur === 'red') bildir(_autoSablon`${v.ad} bu sefer gelemiyor (${v.baslik}).`);
    etkinlikHaberi(v);
    return;
  }
  if (tur === 'kart') { bildir(_autoSablon`💳 Karttan çekildi: ${tl(Math.abs(v.tutar))}${v.aciklama ? ` · ${_autoMetin(v.aciklama)}` : ''}`); return; }
  if (tur === 'bildirim') {
    // bildirim merkezine yeni haber: rozet artar; mesaj ve tezgâh gibi zaten ekranda gösterilenler için ayrıca kart çıkmaz
    if (v.tur !== 'mesaj') d.genel.okunmamisBildirim = (d.genel.okunmamisBildirim || 0) + 1;
    toplaButonuGuncelle();
    sekmeSayilari();
    if (v.tur === 'duyuru') {
      // yönetimden gelen duyuru oyun açıkken de görünür; dokununca ilgili bölüm (Hesabım, Ayarlar…) açılır
      const adres = bildirimAdresi(v);
      ses.bildirim?.();
      kart({ ikon: '📣', baslik: bildirimMetni(v,'baslik').replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, ''), metin: bildirimMetni(v,'metin'), eylemAdi: adres && adres !== '#/bildirimler' ? _autoMetin('Aç') : _autoMetin('Gör'), eylem: () => { location.hash = adres || '#/bildirimler'; }, sure: 15000 });
      return;
    }
    if (v.tur === 'seviye' || (v.tur === 'davet' && v.adres === '#/davet')) {
      ses.seviye();
      kart({ ikon: BILDIRIM_IKON[v.tur] || '🔔', baslik: bildirimMetni(v,'baslik').replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, ''), metin: bildirimMetni(v,'metin'), eylemAdi: v.adres ? _autoMetin('Gör') : null, eylem: v.adres ? () => { location.hash = v.adres; } : null, tur: 'basari' });
    }
    return;
  }
  if (tur === 'gorev') {
    gorevOzetiYenile();
    kart({ ikon: v.hepsi ? '🎁' : '✅', baslik: v.hepsi ? _autoMetin('Bugünün görevleri bitti!') : _autoMetin('Görev tamamlandı'), metin: v.hepsi ? _autoMetin('Ödül sandığın hazır, hemen aç.') : (v.kalan > 0 ? _autoSablon`Sandığın açılması için ${v.kalan} görev daha kaldı.` : _autoMetin('Günlük görevlerinde bir adım daha.')), eylemAdi: v.hepsi ? _autoMetin('Sandığı aç') : _autoMetin('Görevler'), eylem: () => gorevPaneli(), tur: 'basari' });
    ses.seviye();
    return;
  }
  if (tur === 'yenile') {
    // aynı anda gelen birden çok haber tek yenilemeye dönüşür
    clearTimeout(yenileZamani);
    // 0.57.9: ilçenin herkesine giden yenilemeler (taşınma, sokak adları) kalabalık ilçede aynı anda binlerce isteğe
    // dönüşmesin: 0–10 sn arasına yayılır
    const genis = v && ['tasinma', 'oyuncu-sil', 'sokaklar'].includes(v.neden);
    yenileZamani = setTimeout(async () => {
      try {
        await yenileHepsi();
        if (d.panelCanli) d.panelCanli('yenile', v);
        bildirimKontrol();
      } catch (e) { /* sessiz */ }
    }, genis ? 400 + Math.random() * 10000 : 400);
  }
}

// Telefondaki bildirime dokununca açık oyun ilgili ekrana geçer
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && typeof e.data.git === 'string' && e.data.git.startsWith('#/')) location.hash = e.data.git;
  });
}

// Alt menü ikonları (çizgi ikon, etkin sekmede dolar)
const svgIkon = (ic) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ic}</svg>`;
const DOCK_IKON = {
  mahalle: svgIkon('<path class="dolgu" d="M3.5 10.2 5 4.5h14l1.5 5.7"/><path d="M3.5 10.2a2.8 2.8 0 0 0 5.6 0 2.8 2.8 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0"/><path d="M5 12.6V20h14v-7.4"/><path class="dolgu" d="M10 20v-4.5h4V20"/>'),
  harita: svgIkon('<path class="dolgu" d="m9 4-5.5 2v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>'),
  tezgahlar: svgIkon('<rect class="dolgu" x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18M11 12.5v2h2v-2"/>'),
  mesajlar: svgIkon('<path class="dolgu" d="M20.5 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20.5 11.5z"/><path d="M9 11.5h.01M13 11.5h.01M17 11.5h.01"/>'),
  bildirimler: svgIkon('<path class="dolgu" d="M18 9.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15.5 18 9.5z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>'),
  hesap: svgIkon('<circle class="dolgu" cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>'),
};

function arayuzCiz() {
  const o = d.genel.oyuncu;
  arayuz.innerHTML = `
    <div class="hud">
      <button class="oyuncu-cip" data-git="hesap" data-i18n-label="nav.hesap" aria-label="${esc(t('nav.hesap'))}">
        <div class="seviye-rozet" id="seviye-rozet"></div>
        <div class="oyuncu-yazi"><div class="oyuncu-ad">${esc(o.kullaniciAdi)}${o.test ? ` <span class="test-rozet" title="${esc(_autoMetin('Gizli test hesabı: listelerde ve başka oyunculara görünmezsin.'))}">🧪 TEST</span>` : ''}</div><div class="oyuncu-yer">${d.cadde && d.cadde.isimler ? esc(d.cadde.isimler.mahalle.replace(' Mahallesi', ' Mah.')) + ', ' + esc(o.ilce.ad) : esc(o.ilce.ad) + ', ' + esc(o.il.ad)}</div></div>
      </button>
      <button class="tema-dugme" id="tema-dugme" type="button" aria-label="${esc(_autoMetin('Balon teması'))}" title="${esc(_autoMetin('Balon teması'))}"><span data-tema="acik" aria-hidden="true">☀️</span><span data-tema="koyu" aria-hidden="true">🌙</span></button>
      <div class="para-cip" id="para-cip"><span class="sikke" id="sikke-hedef"></span><span id="bakiye" class="sayi"></span></div>
    </div>
    <div class="alt-hud">
      <div class="sol-grup">
        <button class="tarih-cip" id="tarih" data-i18n-label="hud.weather" aria-label="${esc(t('hud.weather'))}"></button>
        <div class="kisayollar">
          <button class="yuvarlak-dugme" id="uretim-dugme" data-i18n-label="hud.sectors" aria-label="${esc(t('hud.sectors'))}" data-i18n-title="hud.sectors" title="${esc(t('hud.sectors'))}">🏭<span class="rozet-sayi" id="uretim-rozet" hidden></span></button>
          <button class="yuvarlak-dugme" id="banka-dugme" data-i18n-label="hud.markets" aria-label="${esc(t('hud.markets'))}" data-i18n-title="hud.markets" title="${esc(t('hud.markets'))}">🏛️<span class="rozet-sayi" id="vaka-rozet" hidden></span></button>
          <button class="yuvarlak-dugme" id="gorev-dugme" data-i18n-label="hud.tasks" aria-label="${esc(t('hud.tasks'))}" data-i18n-title="hud.tasks" title="${esc(t('hud.tasks'))}">📋<span class="rozet-sayi" id="gorev-rozet" hidden></span></button>
          <button class="yuvarlak-dugme keyif-dugme" id="keyif-dugme" data-i18n-label="hud.leisure" aria-label="${esc(t('hud.leisure'))}" data-i18n-title="hud.leisure" title="${esc(t('hud.leisure'))}"><span id="keyif-simge">🙂</span><i id="keyif-cubuk" aria-hidden="true"></i></button>
        </div>
      </div>
      <button class="yuvarlak-dugme" id="bonus-dugme" data-i18n-label="hud.reward" aria-label="${esc(t('hud.reward'))}">🎁</button>
      <button class="yuvarlak-dugme pusula" id="kus-dugme" data-i18n-label="hud.birdsEye" aria-label="${esc(t('hud.birdsEye'))}">🧭</button>
      <button class="yuvarlak-dugme calar-dugme" id="calar-dugme" data-i18n-label="hud.musicPlayer" aria-label="${esc(t('hud.musicPlayer'))}" data-i18n-title="hud.musicPlayer" title="${esc(t('hud.musicPlayer'))}">🎵</button>
      <button class="yuvarlak-dugme" id="ses-dugme" data-i18n-label="settings.audio" aria-label="${esc(t('settings.audio'))}">${ses.sesAcikMi() ? '🔊' : '🔇'}</button>
    </div>
    <div id="topla-yeri"></div>
    <div id="ipucu-yeri"></div>
    <nav class="dock" data-i18n-label="nav.main" aria-label="${esc(t('nav.main'))}"><ul>
      ${['mahalle','harita','tezgahlar','mesajlar','bildirimler','hesap']
        .map(k => `<li><a href="#/${k}" data-rota="${k}" data-i18n-label="nav.${k}" aria-label="${esc(t('nav.'+k))}"><span class="ikon" aria-hidden="true">${DOCK_IKON[k]}</span><span class="etiket-ad" data-i18n="nav.${k}">${esc(t('nav.'+k))}</span></a></li>`).join('')}
    </ul></nav>`;
  arayuz.querySelector('[data-git=hesap]').addEventListener('click', () => { location.hash = '#/hesap'; });
  arayuz.querySelectorAll('.dock [data-rota]').forEach((a) => a.addEventListener('click', () => {
    if (location.hash === '#/' + a.dataset.rota && katman.hidden && !rotaIstegi) setTimeout(rotaUygula, 0);
  }));
  document.getElementById('bonus-dugme').addEventListener('click', () => { ses.tik(); bonusPaneli(); });
  document.getElementById('gorev-dugme').addEventListener('click', () => { ses.tik(); gorevPaneli(); });
  document.getElementById('uretim-dugme').addEventListener('click', () => { ses.tik(); location.hash = '#/uretim'; });
  document.getElementById('banka-dugme').addEventListener('click', () => { ses.tik(); devletMenusu(); });
  document.getElementById('keyif-dugme').addEventListener('click', () => { ses.tik(); location.hash = '#/yasam'; });
  gorevOzetiYenile();
  document.getElementById('tarih').addEventListener('click', () => { ses.tik(); havaPaneli(); });
  // 0.57.9: güneş / ay: sahne üstündeki balonlar açık (beyaz) ya da koyu (gece göz almasın); tercih bu cihazda saklanır
  temaDugmesiKur(document.getElementById('tema-dugme'));
  kameraPadiKur(document.getElementById('kus-dugme'));
  sesKarisiciKur(document.getElementById('ses-dugme'));
  calarKur(document.getElementById('calar-dugme'));
  cagrilariBaslat();
  d.gosterilenBakiye = null;
  hudGuncelle();
  if (d.bolgeY && d.bolgeY.kod && d.bolgeY.hudYenile) d.bolgeY.hudYenile(); // 0.53: bölgedeyken kısayollar yeniden kurulur
}

// 0.56: Kamera düğmeleri. 🧭 tek düğme kalır (alt-hud'daki simge sayısı artmaz); dokununca küçük bir kamera paneli açılır:
// sola/sağa 45° döndür, yukarıdan/yandan bak, kuş bakışı, sıfırla. Mahallede ve bölgelerde aynı düğmeler çalışır.
function kameraPadiKur(dugme) {
  const pad = document.createElement('div');
  pad.className = 'kamera-pad'; pad.hidden = true; pad.setAttribute('role', 'group');
  pad.setAttribute('aria-label', _autoMetin('Kamera'));
  const B = (k, simge, ad) => `<button type="button" data-kam="${k}" title="${esc(ad)}" aria-label="${esc(ad)}">${simge}</button>`;
  pad.innerHTML = `${B('kus', '🦅', t('hud.birdsEye'))}${B('yukari', '⤒', _autoMetin('Yukarıdan bak'))}<span></span>
    ${B('sol', '⟲', _autoMetin('Sola döndür'))}${B('sifir', '⌂', _autoMetin('Kamerayı sıfırla'))}${B('sag', '⟳', _autoMetin('Sağa döndür'))}
    <span></span>${B('asagi', '⤓', _autoMetin('Yandan bak'))}<span></span>`;
  dugme.after(pad);
  const bolgede = () => !!(d.bolgeY && d.bolgeY.kod);
  const kapat = () => { pad.hidden = true; dugme.setAttribute('aria-expanded', 'false'); };
  dugme.setAttribute('aria-expanded', 'false');
  dugme.addEventListener('click', (e) => {
    e.stopPropagation(); ses.tik();
    pad.hidden = !pad.hidden; dugme.setAttribute('aria-expanded', String(!pad.hidden));
    if (!pad.hidden) {
      const r = dugme.getBoundingClientRect();
      pad.style.top = Math.round(r.bottom + 8) + 'px';
      pad.style.right = Math.max(8, Math.round(innerWidth - r.right - 46)) + 'px';
      pad.querySelector('[data-kam=kus]').classList.toggle('pasif', bolgede());
    }
  });
  pad.addEventListener('click', (e) => {
    const b = e.target.closest('[data-kam]'); if (!b) return;
    e.stopPropagation(); ses.tik();
    const k = b.dataset.kam;
    const hedef = bolgede() ? d.bolgeY : (aktifRota() === 'mahalle' || !katman.hidden ? mahalle : null);
    if (k === 'kus') { kapat(); if (aktifRota() !== 'mahalle') location.hash = '#/mahalle'; mahalle.kusBakisi(); return; }
    if (!hedef) return;
    if (k === 'sol' && hedef.kameraDondur) hedef.kameraDondur(-1);
    else if (k === 'sag' && hedef.kameraDondur) hedef.kameraDondur(1);
    else if (k === 'yukari' && hedef.kameraEg) hedef.kameraEg(1);
    else if (k === 'asagi' && hedef.kameraEg) hedef.kameraEg(-1);
    else if (k === 'sifir' && hedef.kameraSifirla) hedef.kameraSifirla();
  });
  document.addEventListener('pointerdown', (e) => { if (!pad.hidden && !pad.contains(e.target) && e.target !== dugme && !dugme.contains(e.target)) kapat(); });
  addEventListener('hashchange', kapat);
}

// Ses ayarı: ses düğmesinin üstüne gelince (ya da dokununca) üç kanal açılır: Müzik, Ortam sesleri, Oyun sesleri.
// Her kanalın kaydırıcısı ve aç/kapat düğmesi vardır; ayarlar bu tarayıcıda saklanır.
const SES_KANALLARI = [['muzik', '🎵', 'Müzik'], ['ortam', '🏙️', 'Ortam sesleri'], ['efekt', '🔔', 'Oyun sesleri']];
function sesSimgesi() {
  const a = ses.sesAyarlari();
  const hepsiKapali = SES_KANALLARI.every(([k]) => a.kapali[k] || a[k] <= 0);
  return hepsiKapali ? '🔇' : '🔊';
}
function sesKarisiciKur(dugme) {
  if (!dugme) return;
  dugme.textContent = sesSimgesi();
  dugme.dataset.i18nLabel='settings.audio';dugme.setAttribute('aria-label', t('settings.audio'));
  dugme.setAttribute('aria-haspopup', 'dialog');
  let kutu = null, kapatZaman = null;
  const kapat = () => { if (kutu) { kutu.remove(); kutu = null; dugme.setAttribute('aria-expanded', 'false'); } };
  const ac = () => {
    clearTimeout(kapatZaman);
    if (kutu) return;
    const a = ses.sesAyarlari();
    kutu = document.createElement('div');
    kutu.className = 'ses-karisici';
    kutu.setAttribute('role', 'dialog');
    kutu.setAttribute('aria-label', t('settings.audio'));
    kutu.innerHTML = `<div class="sk-baslik">🔊 ${esc(t('settings.audio'))}</div>${SES_KANALLARI.map(([k, i, ad]) => `<div class="sk-satir" data-kanal="${k}">
      <button class="sk-kapat${a.kapali[k] ? ' kapali' : ''}" data-sk-kapat="${k}" aria-pressed="${a.kapali[k]}" aria-label="${esc(t('settings.'+k))}: ${esc(t(a.kapali[k]?'common.enable':'common.disable'))}">${a.kapali[k] ? '🔇' : i}</button>
      <label><span>${esc(t('settings.'+k))}</span><input type="range" min="0" max="100" step="5" value="${Math.round((a.kapali[k] ? 0 : a[k]) * 100)}" data-sk="${k}" aria-label="${esc(t('settings.'+k))}"></label>
      <b data-sk-yuzde="${k}">${a.kapali[k] ? esc(t('settings.off')) : '%' + Math.round(a[k] * 100)}</b></div>`).join('')}`;
    const r = dugme.getBoundingClientRect();
    kutu.style.left = Math.max(8, Math.min(window.innerWidth - 268, r.left + r.width / 2 - 130)) + 'px';
    kutu.style.top = (r.bottom + 8) + 'px';
    document.body.appendChild(kutu);
    dugme.setAttribute('aria-expanded', 'true');
    kutu.addEventListener('pointerenter', () => clearTimeout(kapatZaman));
    kutu.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') kapatZaman = setTimeout(kapat, 500); });
    kutu.querySelectorAll('[data-sk]').forEach((inp) => inp.addEventListener('input', () => {
      const k = inp.dataset.sk;
      ses.kanalAyarla(k, Number(inp.value) / 100);
      const b = kutu.querySelector(`[data-sk-kapat=${k}]`);
      b.classList.toggle('kapali', Number(inp.value) === 0);
      b.textContent = Number(inp.value) === 0 ? '🔇' : SES_KANALLARI.find((x) => x[0] === k)[1];
      kutu.querySelector(`[data-sk-yuzde=${k}]`).textContent = Number(inp.value) === 0 ? t('settings.off') : '%' + inp.value;
      dugme.textContent = sesSimgesi();
    }));
    kutu.querySelectorAll('[data-sk-kapat]').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.skKapat;
      const a2 = ses.sesAyarlari();
      const kapali = !(a2.kapali[k] || a2[k] <= 0);
      if (!kapali && a2[k] <= 0) ses.kanalAyarla(k, 0.6); else ses.kanalSessiz(k, kapali);
      const a3 = ses.sesAyarlari();
      const deger = a3.kapali[k] ? 0 : Math.round(a3[k] * 100);
      kutu.querySelector(`[data-sk=${k}]`).value = deger;
      b.classList.toggle('kapali', !deger);
      b.textContent = deger ? SES_KANALLARI.find((x) => x[0] === k)[1] : '🔇';
      kutu.querySelector(`[data-sk-yuzde=${k}]`).textContent = deger ? '%' + deger : t('settings.off');
      dugme.textContent = sesSimgesi();
    }));
  };
  dugme.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') ac(); });
  dugme.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') kapatZaman = setTimeout(kapat, 600); });
  dugme.addEventListener('click', (e) => { e.stopPropagation(); if (kutu && e.pointerType !== 'mouse') kapat(); else ac(); });
  document.addEventListener('pointerdown', (e) => { if (kutu && !kutu.contains(e.target) && e.target !== dugme) kapat(); });
  window.addEventListener('hashchange', kapat);
  document.addEventListener('cirak:dil-kaydedildi',kapat);
}

function hudGuncelle() {
  if (!d.genel || !d.genel.oyuncu || !document.getElementById('bakiye')) return;
  const o = d.genel.oyuncu;
  const oran = (o.tecrube - o.seviyeAlt) / (o.seviyeUst - o.seviyeAlt);
  const rozetEl = document.getElementById('seviye-rozet');
  rozetEl.classList.toggle('fotolu', !!o.foto);
  rozetEl.classList.toggle('puanli', !!o.yetenekBos);
  rozetEl.title = `${o.tecrube.toLocaleString(sayiDili())} TP`;
  rozetEl.innerHTML = `${halkaSvg(o.seviye >= 99 ? 1 : oran, 44, 5, '#1FA25A', 'rgba(255,255,255,0.2)')}${o.foto ? `<img src="${esc(o.foto)}" alt=""><b>${o.seviye}</b>` : `<span>${o.seviye}</span>`}`;
  if (d.gosterilenBakiye === null) {
    d.gosterilenBakiye = o.bakiye;
    document.getElementById('bakiye').textContent = sade(o.bakiye);
  }
  document.getElementById('para-cip').title = tamTl(o.bakiye);
  saatGuncelle();
  toplaButonuGuncelle();
  const bd = document.getElementById('bonus-dugme');
  if (bd) bd.classList.toggle('nokta', !!d.genel.bonusVar);
  vakaDurum(d.genel.vaka); // 0.55: gelen olay kartı ve 📞 rozeti
  const ur = document.getElementById('uretim-rozet');
  if (ur) { const n = Number(d.genel.bitenUretim) || 0; ur.hidden = !n; ur.textContent = n > 9 ? '9+' : String(n); }
  // keyif düğmesi: yüz ifadesi ve altında dolum çubuğu; tatildeyken 🏖️
  const y = d.genel.yasam;
  const kd = document.getElementById('keyif-dugme');
  if (kd && y) {
    document.getElementById('keyif-simge').textContent = y.tatil ? '🏖️' : y.mekan ? '🥂' : y.simge;
    const c = document.getElementById('keyif-cubuk');
    c.style.setProperty('--oran', `${y.keyif}%`);
    c.style.setProperty('--renk', y.renk);
    kd.title = y.tatil ? _autoSablon`${y.tatil.yerAd} tatilindesin` : _autoSablon`Keyif ${y.keyif}/100 · ${y.seviye}`;
    kd.classList.toggle('uyari', y.keyif < 35 && !y.tatil);
    // bekleyen etkinlik davetleri
    let r = document.getElementById('keyif-rozet');
    if (!r) { r = document.createElement('span'); r.className = 'rozet-sayi'; r.id = 'keyif-rozet'; kd.appendChild(r); }
    const n = Number(d.genel.davetSayisi) || 0;
    r.hidden = !n; r.textContent = n > 9 ? '9+' : String(n);
  }
  // 0.48: ödüllü mini oyun teklifi: mahallede zıplayan davet ve 🎮 rozeti
  const mo = d.genel.miniOyun && d.genel.miniOyun.durum === 'acik' && d.genel.miniOyun.bitis > simdi() ? d.genel.miniOyun : null;
  const orz = document.getElementById('oyun-rozet');
  if (orz) orz.hidden = !mo;
  if (!oyunAcikMi()) davetGuncelle(mo);
  hapisSeridi(d.hapisBitis ? d.hapisBitis - simdi() : 0); // 0.49
  etkinlikSeridi();
}
// Yönetimin açtığı etkinlik (ör. çifte kazanç saatleri) ekranın üstünde şerit olarak görünür
function etkinlikSeridi() {
  const e = d.genel && d.genel.etkinlik;
  const o = d.genel && d.genel.ozelGun;
  // özel gün şeridi gün içinde kapatılabilir (kapatılınca o gün bir daha çıkmaz)
  let kapali = false;
  try { kapali = !!o && localStorage.getItem('cirak_ozelgun') === o.kod + ':' + new Date(oyunMs()).toISOString().slice(0, 10); } catch (x) { /* depolama yok */ }
  let el = document.getElementById('etkinlik-serit');
  const etkinlikVar = e && e.aktif;
  if (!etkinlikVar && (!o || kapali)) { if (el) el.remove(); return; }
  if (!el) {
    el = document.createElement('div');
    el.id = 'etkinlik-serit';
    el.className = 'etkinlik-serit';
    document.body.appendChild(el);
    el.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-serit-kapat]')) {
        const og = d.genel && d.genel.ozelGun;
        try { if (og) localStorage.setItem('cirak_ozelgun', og.kod + ':' + new Date(oyunMs()).toISOString().slice(0, 10)); } catch (x) { /* depolama yok */ }
        el.remove();
        return;
      }
      havaPaneli();
    });
  }
  if (etkinlikVar) {
    el.className = 'etkinlik-serit';
    el.innerHTML = `<b>🎉 ${esc(e.baslik || _autoMetin('Etkinlik'))}</b><span>${_autoSablon`Tezgâh kazancı ×${Number(e.carpan).toLocaleString(sayiDili())}`}</span><em>${sureMetni(e.bitis - simdi())}</em>`;
  } else {
    el.className = `etkinlik-serit ozel-gun ${o.tur}`;
    el.innerHTML = `<b>${o.ikon} ${esc(o.ad)}</b>${o.carpan > 1 ? `<span>${_autoSablon`Tezgâh kazancı +%${Math.round((o.carpan - 1) * 100)}`}</span>` : `<span class="uzun">${esc(o.mesaj || '')}</span>`}<button type="button" data-serit-kapat aria-label="Kapat">✕</button>`;
  }
}

// 10 Kasım saat 09.05: bir dakikalık saygı duruşu. Mahalle durur, siren çalar, ekranda saygı duruşu yazısı çıkar.
let sayginDurusBitir = null;
function ozelGunKontrol() {
  const o = d.genel && d.genel.ozelGun;
  const sd = o && o.sayginDurus;
  const t = new Date(oyunMs());
  const dk = t.getUTCHours() * 60 + t.getUTCMinutes();
  const aktif = !!sd && dk >= sd.saat * 60 + sd.dakika && dk < sd.saat * 60 + sd.dakika + Math.ceil(sd.sure / 60);
  const el = document.getElementById('saygi-durusu');
  if (aktif && !el) {
    const k = document.createElement('div');
    k.id = 'saygi-durusu';
    k.innerHTML = `<div><span aria-hidden="true">🇹🇷</span><b>${_autoHtml("Saygı duruşu")}</b><small>${_autoHtml("Ulu Önder Mustafa Kemal Atatürk'ü saygı, sevgi ve özlemle anıyoruz.")}</small></div>`;
    document.body.appendChild(k);
    if (mahalle.sayginDurus) mahalle.sayginDurus(true);
    const kalan = Math.max(5, (sd.saat * 60 + sd.dakika) * 60 + sd.sure - (t.getUTCHours() * 3600 + t.getUTCMinutes() * 60 + t.getUTCSeconds()));
    sayginDurusBitir = ses.anmaSireni ? ses.anmaSireni(kalan) : null;
  } else if (!aktif && el) {
    el.remove();
    if (mahalle.sayginDurus) mahalle.sayginDurus(false);
    if (sayginDurusBitir) { sayginDurusBitir(); sayginDurusBitir = null; }
  }
}

// Bakiye sayacı hedefe doğru sayarak ilerler
// Bakiye sayacı: yeni bir değişiklik gelince önceki animasyon iptal edilir ve
// sayaç ekranda o an görünen değerden devam eder (böylece geri sayıyormuş gibi görünmez)
let sayacAnimasyonu = null;
function bakiyeSay(hedef) {
  const el = document.getElementById('bakiye');
  if (!el) return;
  if (sayacAnimasyonu) cancelAnimationFrame(sayacAnimasyonu);
  const bas = d.gosterilenBakiye ?? hedef;
  const t0 = performance.now();
  const sure = 700;
  const adim = (t) => {
    const k = Math.min(1, (t - t0) / sure);
    const v = bas + (hedef - bas) * (1 - Math.pow(1 - k, 3));
    d.gosterilenBakiye = v;
    el.textContent = sade(v);
    if (k < 1) sayacAnimasyonu = requestAnimationFrame(adim);
    else { d.gosterilenBakiye = hedef; sayacAnimasyonu = null; }
  };
  sayacAnimasyonu = requestAnimationFrame(adim);
  const cip = document.getElementById('para-cip');
  cip.classList.remove('zipla');
  void cip.offsetWidth;
  cip.classList.add('zipla');
}

// Sunucudan gelen kesin bakiye (canlı olay ya da işlem yanıtı). Hareket numarası sırayı korur:
// eski bir haber yenisinin üzerine yazılmaz, aynı kazanç iki kez eklenmez.
function bakiyeUygula(bakiye, hareket) {
  if (!d.genel || !d.genel.oyuncu || typeof bakiye !== 'number') return;
  if (hareket) {
    if (hareket <= (d.sonHareket || 0)) return;
    d.sonHareket = hareket;
  }
  d.yerelBakiyeZamani = Date.now();
  if (d.genel.oyuncu.bakiye === bakiye) return;
  d.genel.oyuncu.bakiye = bakiye;
  bakiyeSay(bakiye);
}

function saatGuncelle() {
  const el = document.getElementById('tarih');
  if (!el) return;
  const t = new Date(oyunMs());
  const ay = t.getUTCMonth();
  const h = d.genel && d.genel.hava;
  const onu = h ? `${h.ikon} ${h.sicaklik}° · ` : `${MEVSIM_IKON[mevsimi(ay)]} `;
  const gunAdi = haftaGunuAdi(t.getUTCDay(), !!h);
  const saat = `${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`;
  // dar ekranda kısa: "☀️ 14° · 27 Eyl 03:31" (düğmelere yer kalsın)
  const dar = window.innerWidth < 440;
  // 0.57.9: Türkçe dışındaki dillerde tarih o dilin kuralıyla yazılır (ör. Rusçada «6 октября, вторник»)
  if (aktifDil() !== 'tr') {
    try {
      const tarihYazi = new Intl.DateTimeFormat(aktifDil(), dar ? { day: 'numeric', month: 'short', timeZone: 'UTC' } : { day: 'numeric', month: 'long', weekday: h ? 'short' : 'long', timeZone: 'UTC' }).format(t);
      el.textContent = `${onu}${tarihYazi} ${saat}`;
      return;
    } catch (e) { /* aşağıdaki biçim */ }
  }
  el.textContent = dar ? `${onu}${t.getUTCDate()} ${ayAdi(ay, true)} ${saat}` : `${onu}${t.getUTCDate()} ${ayAdi(ay)} ${gunAdi} ${saat}`;
}

function bitenIsler() {
  if (!d.seyyar) return [];
  return d.seyyar.aktifler.filter((a) => a.bitis <= simdi());
}

function toplaButonuGuncelle() {
  const yer = document.getElementById('topla-yeri');
  if (!yer) return;
  const n = bitenIsler().length;
  const rota = aktifRota();
  // 0.44: Esnaf Kartı üyelerine "topla ve yeniden başlat" (tek iş bitmişse de)
  const esnaf = !!(d.genel && d.genel.esnaf);
  const goster = (n >= 2 || (esnaf && n >= 1)) && rota === 'mahalle' && katman.hidden;
  const mevcut = yer.querySelector('button');
  const anahtar = n + (esnaf ? 'e' : '');
  if (!goster) { if (mevcut) yer.innerHTML = ''; }
  else if (!mevcut || mevcut.dataset.n !== anahtar) {
    yer.innerHTML = `${n >= 2 ? `<button class="dugme yesil topla-hepsi" data-n="${anahtar}">${_autoSablon`💰 ${n} kazancı topla`}</button>` : ''}${esnaf ? `<button class="dugme mavi topla-hepsi topla-baslat" data-n="${anahtar}" title="${_autoHtml('Esnaf Kartı')}">${_autoSablon`🔁 Topla ve yeniden başlat (${n})`}</button>` : ''}`;
    const th = yer.querySelector('.topla-hepsi:not(.topla-baslat)');
    if (th) th.addEventListener('click', (e) => toplaHepsi(e.currentTarget.getBoundingClientRect()));
    const tb = yer.querySelector('.topla-baslat');
    if (tb) tb.addEventListener('click', (e) => toplaBaslat(e.currentTarget.getBoundingClientRect()));
  }
  // İlk adım ipucu
  const ip = document.getElementById('ipucu-yeri');
  if (ip) {
    const hicYok = d.seyyar && !d.seyyar.isler.some((i) => i.sahip);
    const bosta = d.seyyar && d.seyyar.isler.some((i) => i.sahip) && d.seyyar.aktifler.length === 0;
    const metin = rota !== 'mahalle' || !katman.hidden || goster ? '' : hicYok ? _autoMetin('Yanıp sönen + işaretli BOŞ YER’e dokun, ilk tezgâhını al') : bosta ? _autoMetin('Tezgâhına dokun ve çalışmaya başla') : '';
    if (ip.dataset.metin !== metin) {
      ip.dataset.metin = metin;
      ip.innerHTML = metin ? `<div class="ipucu">${metin}</div>` : '';
    }
  }
  // Alt menüde rozetler
  rozet('tezgahlar', n);
  rozet('mesajlar', ((d.genel && d.genel.okunmamis) || 0) + ((d.genel && d.genel.arkadasIstek) || 0));
  rozet('bildirimler', (d.genel && d.genel.okunmamisBildirim) || 0);
}
function rozet(rota, n) {
  const a = arayuz.querySelector(`[data-rota=${rota}]`);
  if (!a) return;
  let r = a.querySelector('.rozet');
  if (n > 0) {
    if (!r) { r = document.createElement('span'); r.className = 'rozet'; a.appendChild(r); }
    r.textContent = n > 9 ? '9+' : n;
  } else if (r) r.remove();
}

// ---------- Rotalar ----------
// Rota "#/secim/mv" gibi alt bölüm taşıyabilir: aktifRota ilk parçayı, rotaEki gerisini verir
function aktifRota() {
  const h = location.hash.replace(/^#\/?/, '').split('/')[0];
  return ['mahalle', 'harita', 'tezgahlar', 'siralama', 'hesap', 'mesajlar', 'belediye', 'davet', 'gelistirici', 'jenerik', 'bildirimler', 'gorevler', 'iletisim', 'sertifika', 'uretim', 'yetenekler', 'banka',
    'secim', 'ihale', 'borsa', 'isdunyasi', 'reklam', 'sigorta', 'ortaklik', 'varlik', 'yasam', 'tatil', 'eglence', 'kupon', 'vergi', 'odalar', 'ekonomi', 'plaza', 'gazete', 'bagis', 'yenilikler', 'arkadaslar', 'gelistiriciler', 'anket', 'magaza', 'oyunlar', 'kumarhane', 'bolge', 'tasinma', 'olaylar'].includes(h) ? h : 'mahalle';
}
function rotaEki() { return location.hash.replace(/^#\/?/, '').split('/').slice(1).join('/'); }

function rotaUygula() {
  if (d.oyunYukleniyor) return;
  if (!d.genel || !d.genel.oyuncu) return;
  const r = aktifRota();
  arayuz.querySelectorAll('[data-rota]').forEach((a) => {
    if (a.dataset.rota === r) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  haritaHud(r === 'harita');
  const oncekiRota = d.sonRota;
  d.sonRota = r;
  // 0.50: üretim bölgeleri ayrı sahnelerdir: bölgeden çıkılınca bölge sahnesi bellekten silinir
  const bolgeIci = r === 'bolge' && !!rotaEki();
  if (!bolgeIci && d.bolgeY && d.bolgeY.kod) d.bolgeY.kapat();
  if (bolgeIci) {
    panelKapat(true);
    harita.etkilesim(false);
    bolgeGir(rotaEki()).catch((e) => { bildir(e.message, true); const o = document.getElementById('bolge-gecis'); if (o) o.remove(); if (aktifRota() === 'bolge') location.hash = '#/mahalle'; });
    toplaButonuGuncelle();
    return;
  }
  if (r === 'harita') {
    panelKapat(true);
    sahne.sahneSec(harita);
    harita.etkilesim(true);
    harita.otomatikDon(false);
    harita.sec(null);
    harita.benimIliAyarla(d.genel.oyuncu.il.id);
    harita.benimIlceAyarla(d.genel.oyuncu.il.id, d.genel.oyuncu.ilce.id, d.cadde && d.cadde.isimler ? d.cadde.isimler.mahalle : '');
    if (d.haritaYakin) {
      // mahalleden uzaklaşarak gelindi: önce ilçe, sonra dilerse il ve ülke
      d.haritaYakin = false;
      harita.ilceGoster(d.genel.oyuncu.il.id).then(() => harita.ilceyeYaklas(30));
    } else {
      harita.odakla(d.genel.oyuncu.il.id, window.innerWidth < window.innerHeight ? 150 : 100, true);
      harita.ilceGoster(d.genel.oyuncu.il.id);
    }
    haritaYenile().catch(() => {});
  } else {
    if (sahne.aktifSahne() !== mahalle) sahne.sahneSec(mahalle);
    harita.etkilesim(false);
    // haritadan mahalleye dönüşte bütün kendi tezgâhları kadraja sığar
    if (d.mahalleUstten || oncekiRota === 'harita') { d.mahalleUstten = false; mahalle.tezgahlariGoster(true); }
    if (r === 'mahalle') panelKapat(true);
    else if (r === 'tezgahlar') tezgahlarPaneli();
    else if (r === 'siralama') siralamaPaneli();
    else if (r === 'hesap') hesapPaneli(['profil', 'ayarlar', 'guvenlik', 'sirket', 'destek'].includes(rotaEki()) ? rotaEki() : undefined);
    else if (r === 'mesajlar') mesajlarPaneli();
    else if (r === 'belediye') belediyePaneli();
    else if (r === 'davet') davetPaneli();
    else if (r === 'gelistirici') gelistiriciPaneli();
    else if (r === 'jenerik') jenerikPaneli();
    else if (r === 'bildirimler') bildirimlerPaneli();
    else if (r === 'gorevler') gorevPaneli();
    else if (r === 'iletisim') iletisimPaneli();
    else if (r === 'sertifika') sertifikaPaneli();
    else if (r === 'uretim') uretimPaneli(['tesis', 'yatirim', 'ambar', 'pazar', 'tedarik', 'sirket'].includes(rotaEki()) ? rotaEki() : undefined);
    else if (r === 'yetenekler') yeteneklerPaneli();
    else if (r === 'banka') bankaPaneli(rotaEki() || undefined);
    else if (r === 'secim') secimPaneli(rotaEki() || undefined);
    else if (r === 'ihale') ihalePaneli();
    else if (r === 'vergi') vergiPaneli();
    else if (r === 'odalar') odalarPaneli();
    else if (r === 'ekonomi') ekonomiPaneli();
    else if (r === 'plaza') plazaPaneli();
    else if (r === 'bagis') bagisPaneli(rotaEki());
    else if (r === 'gazete') gazetePaneli();
    else if (r === 'olaylar') vakaPaneli(rotaEki() || undefined);
    else if (r === 'yenilikler') yeniliklerPaneli();
    else if (r === 'anket') anketPaneli();
    else if (r === 'magaza') magazaPaneli(rotaEki() || undefined);
    else if (r === 'arkadaslar') arkadaslarPaneli(rotaEki() || 'liste');
    else if (r === 'gelistiriciler') gelistiricilerPaneli();
    else if (r === 'borsa') borsaPaneli();
    else if (r === 'isdunyasi') isDunyasiPaneli();
    else if (r === 'reklam' || r === 'sigorta' || r === 'ortaklik') isDunyasiPaneli(r);
    else if (r === 'varlik') varlikPaneli(rotaEki() || undefined);
    else if (r === 'yasam' || r === 'eglence') yasamPaneli(rotaEki() || (r === 'eglence' ? 'mekan' : undefined));
    else if (r === 'tatil') yasamPaneli('tatil');
    else if (r === 'oyunlar') oyunKosesi(); // 0.48
    else if (r === 'kumarhane') kumarhanePaneli(); // 0.49
    else if (r === 'kupon') kuponPaneli(rotaEki() || '');
    else if (r === 'bolge') bolgeModulu().then((m) => m.bolgeSeciciPaneli(bolgeYardimcilari())).catch((e) => bildir(e.message, true));
    else if (r === 'tasinma') seyahatModulu().then((m) => m.tasinmaPaneli(Number(rotaEki()) || null)).catch((e) => bildir(e.message, true)); // 0.51
  }
  toplaButonuGuncelle();
  izinSeridiGuncelle();
}
// 0.51: yolculuk ve taşınma modülü ilk kullanımda yüklenir
let seyahatVaadi = null;
function seyahatModulu() {
  if (!seyahatVaadi) seyahatVaadi = import('./seyahat.js?v=0.57.17').then((m) => {
    m.seyahatKur({ d, panelAc: (...a) => panelAc(...a), panelKapat: (...a) => panelKapat(...a), eylem: (...a) => eylem(...a), ses, harita, ilceyiGez: (...a) => ilceyiGez(...a), ziyaretBitir: () => ziyaretBitir() });
    return m;
  }).catch((e) => { seyahatVaadi = null; throw e; });
  return seyahatVaadi;
}
// 0.50: üretim bölgeleri (tarım ovası, çiftlik, liman, sahil, OSB, maden, orman, enerji) yalnızca girilince yüklenir
let bolgeModulVaadi = null;
function bolgeModulu() {
  if (!bolgeModulVaadi) bolgeModulVaadi = import('./bolgeler.js?v=0.57.17').catch((e) => { bolgeModulVaadi = null; throw e; });
  return bolgeModulVaadi;
}
function bolgeYardimcilari() {
  return {
    panelAc: (...a) => panelAc(...a), eylem: (...a) => eylem(...a), ses, arayuz,
    durumYenile: async () => { await durumYenile(); hudGuncelle(); },
    uretimPaneli: (sekme, secenek) => uretimPaneli(sekme, secenek),
    oyunSaati: () => oyunSaati(), // 0.53: bölgede de mahalledeki gün döngüsü ve gerçek hava
    hava: () => (window.tezgahDeneme && window.tezgahDeneme.hava) || (d.genel && d.genel.hava) || null,
  };
}
async function bolgeGir(kod) {
  // geçiş perdesi hemen iner (modül ilk kez yüklenirken de oyuncu beklediğini görür)
  if (!bolgeModulVaadi && !document.getElementById('bolge-gecis')) {
    const o = document.createElement('div');
    o.id = 'bolge-gecis'; o.className = 'bolge-gecis b-' + kod;
    o.innerHTML = `<div class="bg-kart"><div class="yukleme-cemberi" aria-hidden="true"></div><p class="bg-durum">${_autoHtml('Haritaya geçiliyor…')}</p></div>`;
    document.body.appendChild(o);
    void o.offsetWidth; o.classList.add('acik');
  }
  const m = await bolgeModulu();
  if (!d.bolgeY) d.bolgeY = m.bolgeYoneticisi(bolgeYardimcilari());
  if (aktifRota() !== 'bolge') return;
  if (d.bolgeY.kod === kod) return;
  await d.bolgeY.ac(kod);
}
// rota değişimi: aynı karede birden çok kez tetiklenirse (panel kapanışı + düğme) bir kez uygulanır
let rotaIstegi = 0;
window.addEventListener('hashchange', () => {
  ses.tik();
  cancelAnimationFrame(rotaIstegi);
  rotaIstegi = requestAnimationFrame(() => { rotaIstegi = 0; rotaUygula(); });
});

// Harita üstü araçlar: il arama, yakınlaştırma, Türkiye görünümü, kendi ilçene git ve bölge göstergesi
function haritaHud(acik) {
  let h = document.getElementById('harita-hud');
  if (!acik) { if (h) h.remove(); return; }
  if (h) return;
  h = document.createElement('div');
  h.id = 'harita-hud';
  const toplam = (d.haritaVeri || []).reduce((t, x) => t + (x.oyuncu || 0), 0);
  const dar = window.innerWidth < window.innerHeight;
  h.innerHTML = `
    <div class="hh-ust">
      <div class="hh-baslik"><b>${_autoHtml("🇹🇷 Türkiye")}</b><small>${_autoSablon`81 il · 973 ilçe${toplam ? ` · ${toplam.toLocaleString(sayiDili())} oyuncu` : ''}`}</small></div>
      <form class="hh-ara"><input list="hh-iller" placeholder="${_autoHtml("İl ara…")}" aria-label="${_autoHtml("İl ara")}"><datalist id="hh-iller">${harita.iller().map((x) => `<option value="${esc(x.ad)}">`).join('')}</datalist></form>
    </div>
    <div class="hh-dugmeler">
      <button data-hh="art" aria-label="${_autoHtml("Yakınlaştır")}">＋</button>
      <button data-hh="eks" aria-label="${_autoHtml("Uzaklaştır")}">－</button>
      <button data-hh="tr" aria-label="${_autoHtml("Tüm Türkiye")}">🗺️</button>
      <button data-hh="dunya" aria-label="${_autoHtml("Dünya")}">🌍</button>
      <button data-hh="ben" aria-label="${_autoHtml("İlçeme git")}">📍</button>
      <button data-hh="in" aria-label="${_autoHtml("Sokağıma in")}">🏘️</button>
    </div>
    <details class="hh-lejant" ${dar ? '' : 'open'}><summary>${_autoHtml("Bölgeler")}</summary>
      ${Object.entries(BOLGE_RENGI).map(([ad, r]) => `<span><i style="background:${r}"></i>${_autoHtml(ad)}</span>`).join('')}
      <span><i style="background:#FFC42E"></i>${_autoHtml("Senin ilin / ilçen")}</span>
      <small>${_autoHtml("İllerin yüksekliği oyuncu sayısını gösterir. Bir ile dokun: ilçeleri açılır. Bir ilçeye dokun: bilgisi ve şube seçeneği.")}</small>
    </details>`;
  arayuz.appendChild(h);
  h.querySelectorAll('[data-hh]').forEach((b) => b.addEventListener('click', () => {
    ses.tik();
    const k = b.dataset.hh;
    if (k === 'art') harita.yakinlas(0.6);
    else if (k === 'eks') harita.yakinlas(1.6);
    else if (k === 'tr') harita.turkiye(window.innerWidth < window.innerHeight);
    else if (k === 'dunya') harita.dunya(window.innerWidth < window.innerHeight);
    else if (k === 'ben') harita.ilceGoster(d.genel.oyuncu.il.id).then(() => harita.ilceyeYaklas(30));
    else if (k === 'in') { d.mahalleUstten = true; location.hash = '#/mahalle'; }
  }));
  h.querySelector('.hh-ara').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = e.target.querySelector('input').value.trim().toLocaleLowerCase('tr');
    const il = harita.iller().find((x) => x.ad.toLocaleLowerCase('tr') === v) || harita.iller().find((x) => x.ad.toLocaleLowerCase('tr').startsWith(v));
    if (!il) return bildir(_autoMetin("Bu adla bir il bulunamadı."), true);
    harita.sec(il.id);
    harita.odakla(il.id, 70);
    harita.ilceGoster(il.id);
    e.target.querySelector('input').blur();
  });
  h.querySelector('.hh-ara input').addEventListener('change', (e) => e.target.form.requestSubmit());
}

// ---------- Paneller ----------
// Kullanıcının kapattığı pencere, arka planda süren bir işin (stok alma, kasa toplama…) sonunda kendiliğinden
// yeniden açılmasın (0.37.22): kullanıcı bir pencereyi kapattıktan sonra yeni bir dokunuş yapmadıysa aynı başlıklı
// pencere açılmaz; görünmeyen bir kopya döner (çağıran kod bozulmasın diye).
let sonJest = 0, kapatma = { zaman: -1, baslik: '' };
['pointerdown', 'keydown'].forEach((o) => document.addEventListener(o, () => { sonJest = performance.now(); }, true));

// 0.49.7: yana kayan menüler (pazar sekmeleri, çipler…) bilgisayarda da kaydırılabilsin: fareyle tutup sürükleme ve
// fare tekerleği. Dokunmatikte tarayıcının kendi kaydırması kullanılır. Yalnızca alçak, taşan yatay şeritlerde çalışır.
(() => {
  const yatayKaydirici = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (!(e instanceof HTMLElement)) continue;
      if (e.scrollWidth - e.clientWidth < 4 || e.clientHeight > 140) continue;
      const ox = getComputedStyle(e).overflowX;
      if (ox === 'auto' || ox === 'scroll') return e;
    }
    return null;
  };
  let surukle = null, tiklamaYut = false;
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], canvas')) return;
    const k = yatayKaydirici(e.target);
    if (k) surukle = { k, x: e.clientX, bas: k.scrollLeft, oynadi: false };
  }, true);
  document.addEventListener('pointermove', (e) => {
    if (!surukle) return;
    const dx = e.clientX - surukle.x;
    if (!surukle.oynadi && Math.abs(dx) < 6) return;
    surukle.oynadi = true;
    surukle.k.classList.add('suruklenen');
    surukle.k.scrollLeft = surukle.bas - dx;
  }, true);
  const birak = () => {
    if (!surukle) return;
    if (surukle.oynadi) { tiklamaYut = true; setTimeout(() => { tiklamaYut = false; }, 0); }
    surukle.k.classList.remove('suruklenen');
    surukle = null;
  };
  document.addEventListener('pointerup', birak, true);
  document.addEventListener('pointercancel', birak, true);
  // sürükleme sonunda bırakılan düğmeye tıklanmış sayılmasın
  document.addEventListener('click', (e) => { if (tiklamaYut) { e.preventDefault(); e.stopPropagation(); tiklamaYut = false; } }, true);
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const k = yatayKaydirici(e.target);
    if (!k) return;
    const once = k.scrollLeft;
    k.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 32 : 1);
    if (k.scrollLeft !== once) e.preventDefault();
  }, { passive: false });
})();
// 0.57.14: yatay kayan çip satırlarına iki yanda ok düğmeleri ve kenar gölgeleri (bilgisayarda kaydırılabildiği belli olsun).
// Panel içerikleri yeniden çizildiğinde de çalışsın diye belge izlenir; her satır bir kez sarılır.
(() => {
  const SEC = '.panel .cipler:not(.sarili):not(.izgara):not([data-kd])';
  const durum = (sar, el) => {
    const fazla = el.scrollWidth - el.clientWidth > 4;
    sar.classList.toggle('tasar', fazla);
    // sağdan sola dillerde scrollLeft eksi değer alır
    const x = Math.abs(el.scrollLeft);
    sar.classList.toggle('bas', !fazla || x < 4);
    sar.classList.toggle('son', !fazla || x > el.scrollWidth - el.clientWidth - 4);
  };
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver((l) => l.forEach((g) => { const sar = g.target.parentElement; if (sar && sar.classList.contains('kaydirici')) durum(sar, g.target); })) : null;
  const sar = (el) => {
    el.dataset.kd = '1';
    const k = document.createElement('div');
    k.className = 'kaydirici bas';
    el.parentNode.insertBefore(k, el);
    k.appendChild(el);
    const ok = (yon) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'kd-ok ' + yon; b.tabIndex = -1;
      b.setAttribute('aria-label', yon === 'sol' ? _autoMetin('Sola kaydır') : _autoMetin('Sağa kaydır'));
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (yon === 'sol' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>';
      b.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        // scrollBy'da eksi değer sağdan sola dillerde de içeriği görsel olarak sola kaydırır
        const adim = Math.max(120, el.clientWidth * 0.7) * (yon === 'sol' ? -1 : 1);
        // kendi yumuşak kaydırmamız: tarayıcının "smooth" kaydırması bazı cihazlarda (sürüklenebilir şeritte) hiç çalışmıyor
        const bas = el.scrollLeft, hedef = bas + adim, t0 = performance.now(), sure = 280;
        const adimla = (t) => {
          const k = Math.min(1, (t - t0) / sure);
          el.scrollLeft = bas + (hedef - bas) * (1 - Math.pow(1 - k, 3));
          if (k < 1) requestAnimationFrame(adimla);
        };
        requestAnimationFrame(adimla);
        setTimeout(() => { if (Math.abs(el.scrollLeft - bas) < 1) el.scrollLeft = hedef; }, 400);
      });
      k.appendChild(b);
    };
    ok('sol'); ok('sag');
    el.addEventListener('scroll', () => durum(k, el), { passive: true });
    if (ro) ro.observe(el);
    requestAnimationFrame(() => durum(k, el));
  };
  let bekleyen = false;
  const tara = () => { bekleyen = false; document.querySelectorAll(SEC).forEach(sar); };
  const mo = new MutationObserver(() => { if (!bekleyen) { bekleyen = true; requestAnimationFrame(tara); } });
  // yalnızca panel katmanı izlenir (3B sahnenin her karede değişen balonları tetiklemesin)
  const kok = document.getElementById('panel-katman') || document.body;
  mo.observe(kok, { childList: true, subtree: true }); tara();
})();
function kullaniciKapattiMi(baslik) {
  return katman.hidden && kapatma.baslik === baslik && sonJest <= kapatma.zaman;
}
function panelAc({ ikon = '', baslik, alt = '', govde, hazir, rota = null, kaydirmayiKoru = true, icerikBoyu = false }) {
  baslik = _autoMetin(baslik);
  if (alt && !/[<&]/.test(alt)) alt = _autoHtml(alt);
  if (kullaniciKapattiMi(baslik)) {
    const bos = document.createElement('div');
    bos.innerHTML = `<section class="panel"><div class="panel-govde">${govde}</div></section>`;
    return bos.firstElementChild;
  }
  const oncekiRota=d.panelRota;
  // açık bir panelin yerine yenisi geliyorsa (sekme değişimi, stok alma, kasa toplama) pencere kapanıp
  // alttan yeniden açılmaz: içerik yerinde değişir; aynı pencereyse kaydırma yeri de korunur
  const onceki = !katman.hidden && katman.querySelector('.panel');
  const ayniPencere = onceki && (onceki.getAttribute('aria-label') === baslik || rota==='hesap'&&oncekiRota==='hesap');
  // 0.41: geri / ileri düğmeleri. Başka bir pencereye geçilirken öncekisi geçmişe yazılır: rotalı pencere kendi
  // adresiyle (geri dönünce taze yüklenir), rotasız pencere (oyuncu kartı, tezgâh…) olduğu gibi saklanıp geri konur.
  // 0.41.1: adres pencere açıldığı andaki adrestir (yeni adrese geçildikten sonra okunmaz: geri tuşu bu yüzden çalışmıyordu)
  if (d.panelGeriDonus) d.panelGeriDonus = false;
  else if (onceki && !ayniPencere) {
    d.panelGecmis = d.panelGecmis || [];
    d.panelGecmis.push(panelKaydi(onceki, oncekiRota));
    if (d.panelGecmis.length > 20) d.panelGecmis.shift();
    d.panelIleri = [];
  } else if (!onceki) { d.panelGecmis = []; d.panelIleri = []; }
  if (d.panelTemizle) { d.panelTemizle(); d.panelTemizle = null; }
  clearInterval(d.panelZamanlayici); d.panelZamanlayici = null;
  d.panelCanli = null;
  d.panelRota = rota;
  const kaydirma = kaydirmayiKoru && ayniPencere && rota !== 'bildirimler' ? onceki.querySelector('.panel-govde').scrollTop : 0;
  katman.classList.toggle('dock-acik', !!rota);
  katman.classList.remove('mesajlasma');
  const geriVar = !!(d.panelGecmis && d.panelGecmis.length), ileriVar = !!(d.panelIleri && d.panelIleri.length);
  d.panelAdres = rota ? location.hash : null;
  katman.innerHTML = `<section class="panel${onceki ? ' yerinde' : ''}${icerikBoyu ? ' icerik-boyu' : ''}" role="dialog" aria-modal="true" aria-label="${esc(baslik)}">
    <header class="panel-ust">${ikon ? `<span class="buyuk-ikon" aria-hidden="true">${ikon}</span>` : ''}
      <div style="flex:1;min-width:0"><h2>${esc(baslik)}</h2>${alt ? `<div class="alt-baslik">${alt}</div>` : ''}</div>
      <button class="geri-dugme" data-geri aria-label="${esc(t('auth.back'))}" title="${esc(t('auth.back'))}" ${geriVar ? '' : 'disabled'}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button class="geri-dugme ileri" data-ileri aria-label="${esc(_autoMetin('İleri'))}" title="${esc(_autoMetin('İleri'))}" ${ileriVar ? '' : 'disabled'}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
      <button class="kapat" data-kapat aria-label="${esc(t('common.close'))}">✕</button></header>
    <div class="panel-govde">${govde}</div></section>`;
  katman.hidden = false;
  const p = katman.querySelector('.panel');
  const govdeK = p.querySelector('.panel-govde');
  // 0.57.9: pencereler sabit boylu (sekme değişince büyüyüp küçülmez); eski yumuşatma gerekmez
  if (kaydirma) {
    govdeK.scrollTop = kaydirma;
    // içerik sonradan (sunucudan) gelirse kaydırma yeri o zaman geri konur
    const g = new MutationObserver(() => { govdeK.scrollTop = kaydirma; g.disconnect(); });
    g.observe(govdeK, { childList: true, subtree: true });
    setTimeout(() => g.disconnect(), 4000);
  }
  if (hazir) hazir(govdeK, p);
  toplaButonuGuncelle();
  return p;
}
// 0.57.9: tek satıra sığmayan sekme rayları eşit iki satıra bölünür (5+1 gibi yarım satır kalmaz).
// Dokunmatikte yana kaydırılan raylar (kaydir / kaydirmali) olduğu gibi kalır.
function sekmeRaylariniDuzenle() {
  const kok = document.querySelector('#panel-katman:not([hidden]) .panel-govde');
  if (!kok) return;
  const dokunmatik = matchMedia('(hover: none)').matches;
  for (const r of kok.querySelectorAll('.sekmeler')) {
    const d = [...r.children].filter((x) => x.tagName === 'BUTTON');
    if (d.length < 4 || (dokunmatik && r.matches('.kaydir, .kaydirmali'))) continue;
    r.classList.remove('cok-satir'); r.style.removeProperty('--sutun');
    const tasti = r.scrollWidth > r.clientWidth + 2 || d.some((x) => x.offsetTop > d[0].offsetTop + 4);
    if (tasti) { r.classList.add('cok-satir'); r.style.setProperty('--sutun', String(Math.ceil(d.length / 2))); }
  }
}
let sekmeDuzenZamani = null;
new MutationObserver(() => { clearTimeout(sekmeDuzenZamani); sekmeDuzenZamani = setTimeout(sekmeRaylariniDuzenle, 30); }).observe(katman, { childList: true, subtree: true });
addEventListener('resize', () => { clearTimeout(sekmeDuzenZamani); sekmeDuzenZamani = setTimeout(sekmeRaylariniDuzenle, 120); });
// 0.57.9: pencerenin ortasındaki sekmelere dokununca (Hesabım gibi) sekme rayı üste kayar; yeni içerik görünür olur
document.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('.panel-govde > .sekmeler button');
  if (!b) return;
  const sira = [...b.parentElement.children].indexOf(b);
  setTimeout(() => {
    const g = document.querySelector('#panel-katman:not([hidden]) .panel-govde');
    const r = g && g.querySelector(':scope > .sekmeler');
    if (!r || sira < 0) return;
    const ust = r.getBoundingClientRect().top - g.getBoundingClientRect().top + g.scrollTop - parseFloat(getComputedStyle(g).paddingTop || '0');
    if (ust > g.clientHeight * 0.3 && g.scrollTop < ust - 4 && g.scrollHeight - g.clientHeight > 40) g.scrollTo({ top: ust, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, 80);
}, true);
// 0.41: pencere içeriği değişirken (sekme geçişi, yükleniyor yazısı) panel önce küçülüp sonra büyümesin:
// eski yükseklik korunur, içerik oturunca yeni yüksekliğe yumuşakça geçilir.
function boyutuYumusat(p, govde, eskiBoy) {
  p.style.minHeight = Math.round(eskiBoy) + 'px';
  let bekle = null, bitti = false;
  const bitir = () => {
    if (bitti || !p.isConnected) return;
    bitti = true; gozcu.disconnect(); clearTimeout(son);
    const simdiki = p.style.minHeight;
    p.style.minHeight = '';
    const dogal = p.getBoundingClientRect().height;
    if (dogal >= eskiBoy - 1) return;
    p.style.minHeight = simdiki;
    void p.offsetHeight;
    p.style.transition = 'min-height .22s ease';
    p.style.minHeight = Math.round(dogal) + 'px';
    setTimeout(() => { if (p.isConnected) { p.style.transition = ''; p.style.minHeight = ''; } }, 260);
  };
  const gozcu = new MutationObserver(() => { clearTimeout(bekle); bekle = setTimeout(bitir, 220); });
  gozcu.observe(govde, { childList: true, subtree: true, characterData: true });
  bekle = setTimeout(bitir, 450);
  const son = setTimeout(bitir, 1800);
}
// 0.41: geri düğmesi: geçmişteki son pencere açılır
function panelKaydi(p, rota) {
  // mesajlaşma penceresi açık sohbetiyle birlikte saklanır
  const ms = p.classList.contains('ms-panel');
  // 0.41.1: pencere olduğu gibi saklanır (kaldığın sayfa ve kaydırma yeri korunur); yalnızca kendini düzenli yenileyen
  // (sayaçlı) rotalı pencere geri dönünce taze yüklenir
  return rota && !ms && d.panelZamanlayici ? { rota, adres: d.panelAdres || ('#/' + rota), baslik: p.getAttribute('aria-label') }
    : { dugum: p, canli: d.panelCanli, rota, adres: d.panelAdres, sinif: katman.className, baslik: p.getAttribute('aria-label') };
}
function dugmeleriGuncelle(p) {
  const g = p && p.querySelector('[data-geri]'), i = p && p.querySelector('[data-ileri]');
  if (g) g.disabled = !(d.panelGecmis && d.panelGecmis.length);
  if (i) i.disabled = !(d.panelIleri && d.panelIleri.length);
}
// 0.41.1: geri ve ileri: geçmişteki pencereye gider, bulunduğun pencere öbür yığına yazılır
function panelGeri() { panelGit(d.panelGecmis, d.panelIleri); }
function panelIleri() { panelGit(d.panelIleri, d.panelGecmis); }
function panelGit(kaynak, hedef) {
  const g = kaynak && kaynak.pop();
  if (!g) return;
  const onceki = !katman.hidden && katman.querySelector('.panel');
  if (onceki) hedef.push(panelKaydi(onceki, d.panelRota));
  if (g.rota && !g.dugum) {
    d.panelGeriDonus = true;
    if (location.hash !== g.adres) location.hash = g.adres;
    else rotaUygula();
    return;
  }
  const boy = onceki ? onceki.getBoundingClientRect().height : 0;
  if (d.panelTemizle) { d.panelTemizle(); d.panelTemizle = null; }
  clearInterval(d.panelZamanlayici); d.panelZamanlayici = null;
  d.panelRota = g.rota || null;
  d.panelAdres = g.adres || null;
  if (g.adres && location.hash !== g.adres) history.replaceState(null, '', g.adres);
  katman.className = g.sinif || '';
  katman.innerHTML = '';
  katman.appendChild(g.dugum);
  g.dugum.classList.add('yerinde');
  dugmeleriGuncelle(g.dugum);
  d.panelCanli = g.canli || null;
  katman.hidden = false;
  if (boy) boyutuYumusat(g.dugum, g.dugum.querySelector('.panel-govde'), boy);
  toplaButonuGuncelle();
}
// açık panelin başlığı (yoksa boş)
function aktifPanel() {
  const p = !katman.hidden && katman.querySelector('.panel');
  return p ? p.getAttribute('aria-label') : '';
}
function panelKapat(sessiz) {
  // kullanıcının dokunuşuyla kapandıysa (son yarım saniyede bir dokunuş/tuş varsa) hangi pencerenin kapandığı hatırlanır
  const acik = !katman.hidden && katman.querySelector('.panel');
  if (acik && performance.now() - sonJest < 600) kapatma = { zaman: performance.now(), baslik: acik.getAttribute('aria-label') || '' };
  if (d.panelTemizle) { d.panelTemizle(); d.panelTemizle = null; }
  clearInterval(d.panelZamanlayici);
  d.panelCanli = null;
  const rotaliydi = d.panelRota;
  katman.hidden = true;
  katman.innerHTML = '';
  katman.classList.remove('mesajlasma');
  d.panelRota = null;
  d.panelGecmis = []; d.panelIleri = []; d.panelGeriDonus = false; d.panelAdres = null;
  if (!sessiz && rotaliydi && aktifRota() === rotaliydi) location.hash = '#/mahalle';
  toplaButonuGuncelle();
}
// 0.57.13: pencere yalnızca boşluğa hem basılıp hem bırakılınca kapanır. Bir yazı kutusunda fareyle metin seçip
// imleci pencerenin dışında bırakınca tarayıcı "tıklamayı" ortak üst öğeye (boşluğa) gönderiyordu ve pencere kapanıyordu.
let katmanBasma = null;
katman.addEventListener('pointerdown', (e) => { katmanBasma = e.target; }, true);
katman.addEventListener('click', (e) => {
  const basilan = katmanBasma; katmanBasma = null;
  if (e.target.closest('[data-geri]')) { ses.tik(); panelGeri(); return; }
  if (e.target.closest('[data-ileri]')) { ses.tik(); panelIleri(); return; }
  if (e.target.closest('[data-kapat]')) { ses.tik(); panelKapat(); return; }
  if (e.target === katman && (basilan === null || basilan === katman)) { ses.tik(); panelKapat(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !katman.hidden) panelKapat(); });

async function eylem(dugme, is) {
  if (dugme) dugme.disabled = true;
  try {
    const r = await is();
    return r;
  } catch (e) {
    ses.hata();
    if (e instanceof OturumYok) { d.genel.oyuncu = null; girisCiz(); }
    bildir(e.message, true);
    if (dugme) dugme.disabled = false;
    return undefined;
  }
}

// Aynı anda birden çok yenileme istenirse (0.37.22) tek yenileme yapılır; o sürerken gelen istekler bittikten
// sonra bir kez daha yenilenir. Eskiden art arda gelen yenilemeler tabletlerde takılmaya yol açıyordu.
let yenilemeSozu = null, yenilemeTekrar = false;
function yenileHepsi() {
  if (yenilemeSozu) { yenilemeTekrar = true; return yenilemeSozu; }
  yenilemeSozu = (async () => {
    try {
      do { yenilemeTekrar = false; await yenileHepsiIc(); } while (yenilemeTekrar);
    } finally { yenilemeSozu = null; }
  })();
  return yenilemeSozu;
}
async function yenileHepsiIc() {
  const oncekiMesaj = d.genel ? d.genel.okunmamis || 0 : 0;
  await durumYenile();
  await Promise.all([seyyarYenile(), caddeYenile()]);
  if ((d.genel.okunmamis || 0) > oncekiMesaj) {
    ses.mesaj();
    // canlı bağlantı yoksa (ya da mesaj haberi kaçtıysa) yeni mesaj en geç bir sonraki yenilemede haber verilir
    if (!canliAcik()) kart({ ikon: '💬', baslik: _oyunMetni("ui.cf46e77e71ce"), metin: _autoSablon`${d.genel.okunmamis} okunmamış mesajın var.`, eylemAdi: _autoMetin('Oku'), eylem: () => { d.mesajSekmesi = 'ozel'; location.hash = '#/mesajlar'; } });
  }
  hudGuncelle();
}

// Tezgâh ayrıntısı: satın alma, çalışmaya başlama, süren işi yönetme
// Müşteriye bizzat servis: küçük ek kazanç ve bazen bahşiş
async function servisYap(kod, rect) {
  const a = d.seyyar && d.seyyar.aktifler.find((x) => x.isKodu === kod);
  if (!a) return;
  // süren toplu siparişte her dokunuş anında sayılır, istekler arka planda toplu gider
  if (d.siparis && d.siparis.durum === 'suruyor' && d.siparis.calismaId === a.id) { siparisDokun(rect); return; }
  // aynı anda birden çok dokunuş sunucuya sırayla gider (hızlı basışta istekler birbirini ezmesin)
  if (servisYap.mesgul) return;
  servisYap.mesgul = true;
  try { await servisIstegi(a, kod, rect); } finally { servisYap.mesgul = false; }
}
async function servisIstegi(a, kod, rect) {
  try {
    const r = await api('seyyar/servis', { id: a.id });
    if (r && r.reddedildi) return; // sıra gelmedi: sessizce geç
    d.rehberServis = true;
    if (typeof r.bakiye === 'number') bakiyeUygula(r.bakiye, r.hareket);
    if (r.siparis) {
      const sp0 = { ...(d.siparis || {}), calismaId: a.id, isKodu: kod };
      // toplu sipariş sürüyor: her dokunuş bir parça hazırlar
      d.siparis = r.siparis.durum === 'suruyor' ? { ...(d.siparis || {}), ...r.siparis, calismaId: a.id, isKodu: kod } : null;
      if (r.siparis.durum === 'tamam') {
        ses.odul();
        ses.kasa();
        a.bonus = (a.bonus || 0) + r.tutar;
        mahalle.servisEklendi(kod, r.tutar);
        ucanYazi(rect, _autoSablon`📦 Sipariş yetişti! +${tl(r.tutar)}`, true);
        kart({ ikon: '📦', baslik: _oyunMetni("ui.a246bfa0cc65"), metin: _autoSablon`Müşteri çok memnun kaldı: ${tl(r.tutar)} bahşiş bıraktı.`, tur: 'basari' });
      } else if (r.siparis.durum === 'kacti') {
        ses.hata();
        kactiKarti(sp0, _autoMetin('Müşteri beklemedi, başka tezgâha gitti. Bir dahaki sefere!'));
      } else {
        ses.tik();
        ucanYazi(rect, `📦 ${r.siparis.adet - r.siparis.kalan}/${r.siparis.adet}`, false);
      }
      siparisCiz();
      return;
    }
    ses.sikke();
    if (r.tutar > 0) {
      a.bonus = (a.bonus || 0) + r.tutar;
      mahalle.servisEklendi(kod, r.tutar);
      if (typeof r.bakiye !== 'number') { d.genel.oyuncu.bakiye += r.tutar; d.yerelBakiyeZamani = Date.now(); bakiyeSay(d.genel.oyuncu.bakiye); }
    }
    ucanYazi(rect, r.tutar > 0 ? `+${tl(r.tutar)}${r.bahsis ? _autoHtml(' bahşiş!') : ''}` : _autoMetin('Teşekkürler!'), r.bahsis);
    if (r.teklif) siparisTeklifi(a, r.teklif);
  } catch (e) { /* sıra gelmediyse sessizce geç */ }
}

// Toplu sipariş teklifi: kabul edilirse kısa sürede çok müşteriye servis gerekir
function siparisTeklifi(a, t) {
  ses.mesaj();
  const is = d.seyyar.isler.find((x) => x.kod === a.isKodu);
  kart({
    ikon: '📦',
    baslik: _oyunMetni("ui.3ff317b4d64d"),
    metin: _autoSablon`${t.adet} ${t.urun} isteniyor, ${Math.round(t.sureMs / 1000)} saniyede hazırlarsan ${tl(t.odul)} bahşiş. ${is ? is.simge : ''}`,
    eylemAdi: _autoMetin('Kabul et'),
    sure: Math.max(7000, t.gecerli - simdi()),
    tur: 'basari',
    eylem: async () => {
      const r = await eylem(null, () => api('seyyar/siparis', { id: a.id, kabul: true }));
      if (!r) return;
      // durum ayrı tutulur: tezgâh listesi arada yenilense de "Hazırla" düğmesi kaybolmaz
      d.siparis = { ...r, calismaId: a.id, isKodu: a.isKodu };
      mahalle.odakla(a.isKodu);
      siparisCiz();
    },
  });
}
// Toplu sipariş dokunuşları (0.37.22): dokunuş hemen sayılır ve ekranda görünür; sunucuya sırayla, bekleyenler
// birlikte gönderilir (eskiden istek yoldayken yapılan dokunuşlar kayboluyor, sayaç donmuş gibi görünüyordu).
let siparisBekleyen = 0, siparisGonderiliyor = false;
function siparisDokun(rect) {
  const sp = d.siparis;
  if (!sp || sp.durum !== 'suruyor' || sp.bitis <= simdi()) return;
  const yapilan = sp.adet - sp.kalan + siparisBekleyen;
  if (yapilan >= sp.adet) return;
  siparisBekleyen++;
  ses.tik();
  if (rect) ucanYazi(rect, `📦 ${Math.min(sp.adet, yapilan + 1)}/${sp.adet}`, false);
  siparisCiz();
  siparisGonder();
}
async function siparisGonder() {
  if (siparisGonderiliyor) return;
  siparisGonderiliyor = true;
  try {
    let ret = 0;
    while (siparisBekleyen > 0 && d.siparis && d.siparis.durum === 'suruyor') {
      const sp = d.siparis;
      const n = Math.min(10, siparisBekleyen);
      let r = null;
      try { r = await api('seyyar/servis', { id: sp.calismaId, parca: n }); } catch (e) { r = null; }
      if (!r || !r.siparis) {
        // hız sınırı ("Biraz yavaş!") ya da kısa bir bağlantı kesintisi: dokunuşlar kaybolmaz, biraz bekleyip yeniden denenir.
        // Art arda birkaç kez olmazsa (iş bitti, sipariş kapandı) bekleyenler bırakılır; sayaç sunucudaki değere döner.
        if (++ret > 6 || sp.bitis + 1500 <= simdi()) { siparisBekleyen = 0; siparisCiz(); break; }
        await new Promise((ok) => setTimeout(ok, 280));
        continue;
      }
      ret = 0;
      siparisBekleyen = Math.max(0, siparisBekleyen - (r.siparis.islenen || 1));
      if (typeof r.bakiye === 'number') bakiyeUygula(r.bakiye, r.hareket);
      const a = d.seyyar && d.seyyar.aktifler.find((x) => x.id === sp.calismaId);
      if (r.siparis.durum === 'suruyor') {
        d.siparis = { ...sp, ...r.siparis };
      } else {
        d.siparis = null;
        siparisBekleyen = 0;
        if (r.siparis.durum === 'tamam') {
          ses.odul();
          ses.kasa();
          if (a) { a.bonus = (a.bonus || 0) + r.tutar; mahalle.servisEklendi(a.isKodu, r.tutar); }
          const k = document.querySelector('#siparis-kutu .siparis-hazirla');
          if (k) ucanYazi(k.getBoundingClientRect(), _autoSablon`📦 Sipariş yetişti! +${tl(r.tutar)}`, true);
          kart({ ikon: '📦', baslik: _oyunMetni("ui.a246bfa0cc65"), metin: _autoSablon`Müşteri çok memnun kaldı: ${tl(r.tutar)} bahşiş bıraktı.`, tur: 'basari' });
        } else if (r.siparis.durum === 'kacti') {
          ses.hata();
          kactiKarti(sp, _autoMetin('Müşteri beklemedi, başka tezgâha gitti. Bir dahaki sefere!'));
        }
      }
      siparisCiz();
      // sunucunun hız sınırına uygun aralık (saniyede en çok 4 parça)
      // 0.57.9: süre bitmek üzereyken beklemeden gönderilir (son dokunuş geç kalıp boşa gitmesin)
      if (siparisBekleyen > 0) await new Promise((ok) => setTimeout(ok, d.siparis && d.siparis.bitis - simdi() < 2000 ? 250 : Math.min(900, 250 * Math.max(1, Math.min(4, siparisBekleyen)))));
    }
  } finally { siparisGonderiliyor = false; }
}

// Süren toplu siparişin ekrandaki sayacı ve "Hazırla" düğmesi
let siparisZamani = null;
// 0.48: kaçan toplu sipariş: video izleyip geri çağırma seçeneğiyle
function kactiKarti(sp, metin) {
  // 0.56: aynı kaçan sipariş için uyarı bir kez gösterilir (sayfa değişse, oyun yeniden açılsa da)
  const anahtar = 'tezgah_kacti_' + (sp && sp.calismaId) + '_' + (sp && sp.bitis);
  try { if (localStorage.getItem(anahtar)) return; localStorage.setItem(anahtar, '1'); } catch (e) { /* yok say */ }
  const e = videoEylemi('siparis');
  const id = sp && sp.calismaId;
  if (!e || e.kalan <= 0 || !id || sp.geriCagrildi) { kart({ ikon: '⌛', baslik: _oyunMetni("ui.7e0d3b53b8e3"), metin, tur: 'uyari' }); return; }
  const ov = d.genel.odulluVideo;
  kart({ ikon: '⌛', baslik: _oyunMetni("ui.7e0d3b53b8e3"), metin: _autoMetin('Müşteri beklemedi, başka tezgâha gitti. İstersen geri çağır!'), tur: 'uyari', sure: 15000,
    eylemAdi: ov && ov.kart ? _autoMetin('⭐ Geri çağır') : _autoMetin('📺 Geri çağır'),
    eylem: async () => {
      if (!ov || !ov.kart) reklamHazirla(ov);
      const r = await videoEylem('siparis', id, null);
      if (r && r.siparis) {
        d.siparis = { ...r.siparis, calismaId: id, isKodu: sp.isKodu, videoDenendi: true, geriCagrildi: true };
        kart({ ikon: '📦', baslik: _autoMetin('Müşteri geri geldi!'), metin: _autoMetin('Siparişi yetiştir, bahşiş seni bekliyor.'), tur: 'basari' });
        siparisCiz();
      }
    } });
}
function siparisCiz() {
  let kutu = document.getElementById('siparis-kutu');
  // 0.57.9: süre dolduğu anda yolda olan (zamanında yapılmış) dokunuşlar varsa sonuç beklenir; eskiden bekleyenler
  // silinip sipariş "kaçtı" sayılıyordu, son dokunuş boşa gidiyordu
  const yolda = siparisBekleyen > 0 || siparisGonderiliyor;
  const sp = d.siparis && d.siparis.durum === 'suruyor' && (d.siparis.bitis > simdi() || (yolda && d.siparis.bitis + 1500 > simdi())) ? d.siparis : null;
  if (!sp) {
    if (kutu) kutu.remove();
    clearInterval(siparisZamani);
    siparisZamani = null;
    siparisBekleyen = 0;
    if (d.siparis && d.siparis.durum === 'suruyor') {
      const eski = d.siparis;
      d.siparis = null;
      kactiKarti(eski, _autoMetin('Müşteri beklemedi, başka tezgâha gitti.'));
    }
    return;
  }
  if (!kutu) {
    kutu = document.createElement('div');
    kutu.id = 'siparis-kutu';
    kutu.innerHTML = `<div class="siparis-ust"><span class="siparis-ikon">📦</span><div class="siparis-yazi"><b></b><small></small></div><span class="siparis-sure sayi"></span></div>
      <div class="siparis-zaman" aria-hidden="true"><i></i></div>
      <div class="siparis-cubuk"><i></i></div><button class="dugme yesil siparis-hazirla">${_autoHtml("👆 Hazırla!")}</button>
      <button class="dugme siparis-video" hidden></button>`;
    document.body.appendChild(kutu);
    kutu.querySelector('.siparis-video').addEventListener('click', (e) => siparisEkSure(e.currentTarget));
    kutu.querySelector('.siparis-hazirla').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      siparisDokun(e.currentTarget.getBoundingClientRect());
    });
    // klavye (Enter/boşluk) ile basış: pointerdown gelmez, yalnızca click gelir
    kutu.querySelector('.siparis-hazirla').addEventListener('click', (e) => { if (e.detail === 0) siparisDokun(e.currentTarget.getBoundingClientRect()); });
  }
  // kalan süre çubuğu ekran kartında (compositor) akar: dokunuşlar ve ağ işleri sırasında da donmaz
  const zc = kutu.querySelector('.siparis-zaman i');
  if (zc && zc.dataset.bitis !== String(sp.bitis)) {
    zc.dataset.bitis = String(sp.bitis);
    const toplam = Math.max(1000, sp.sureMs || (sp.bitis - (sp.baslangic || (simdi() - 1000))));
    const kalanMs = Math.max(0, sp.bitis - simdi());
    zc.style.animation = 'none';
    zc.style.transform = `scaleX(${Math.min(1, kalanMs / toplam)})`;
    void zc.offsetWidth;
    zc.style.animation = `siparisZaman ${kalanMs}ms linear forwards`;
    zc.style.setProperty('--bas', String(Math.min(1, kalanMs / toplam)));
  }
  const yapilan = Math.min(sp.adet, sp.adet - sp.kalan + siparisBekleyen);
  kutu.querySelector('b').textContent = `${yapilan}/${sp.adet} ${sp.urun || _autoHtml('ürün')}`;
  kutu.querySelector('small').textContent = _autoSablon`Yetiştirirsen ${tl(sp.odul)} bahşiş`;
  kutu.querySelector('.siparis-cubuk i').style.width = `${(yapilan / sp.adet) * 100}%`;
  const ms = sp.bitis - simdi();
  kutu.querySelector('.siparis-sure').textContent = Math.max(0, ms / 1000).toFixed(1) + ' ' + _oyunMetni('timer.second');
  kutu.classList.toggle('acil', ms < 3000);
  // 0.46: ödüllü video ile +30 sn (Esnaf Kartı sahiplerine reklamsız)
  const ov = d.genel && d.genel.odulluVideo;
  const vb = kutu.querySelector('.siparis-video');
  const goster = !!(ov && ov.kalan > 0 && !sp.videoDenendi && ms > 1500);
  if (vb.hidden === goster) vb.hidden = !goster;
  if (goster && !vb.dataset.mesgul) {
    const yazi = ov.kart ? _autoSablon`⭐ +${ov.ekSn} sn (Esnaf Kartı)` : _autoSablon`📺 Video izle, +${ov.ekSn} sn`;
    if (vb.textContent !== yazi) vb.textContent = yazi;
    reklamHazirla(ov);
  }
  if (!siparisZamani) siparisZamani = setInterval(siparisCiz, 100);
}
// Ödüllü video: sipariş durur, reklam izlenince kalan süre + ek süreyle devam eder
async function siparisEkSure(b) {
  const ov = d.genel && d.genel.odulluVideo;
  const sp = d.siparis;
  if (!ov || !sp || sp.durum !== 'suruyor' || b.dataset.mesgul) return;
  b.dataset.mesgul = '1';
  b.disabled = true;
  const bitti = (r) => {
    ov.kalan = Math.max(0, ov.kalan - (r && r.eklendi ? 1 : 0));
    if (r && r.eklendi && !ov.kart && ov.hafta) ov.hafta.adet++; // 0.49.0
    if (r) d.siparis = { ...sp, ...r, durum: 'suruyor', calismaId: sp.calismaId, isKodu: sp.isKodu, videoDenendi: true };
    else if (d.siparis) { if (d.siparis.durum === 'reklam') d.siparis = null; else d.siparis.videoDenendi = true; }
    delete b.dataset.mesgul;
    b.disabled = false;
    siparisCiz();
    if (r && r.eklendi) { ses.odul(); kart({ ikon: '⏱️', baslik: _autoSablon`+${r.eklendi} sn`, metin: _autoMetin('Siparişe ek süre eklendi.'), tur: 'basari' }); }
  };
  if (ov.kart) {
    try { const r = await api('odullu-video/basla', { id: sp.calismaId }); bitti(r.siparis); } catch (e) { bildir(e.message, true); bitti(null); }
    return;
  }
  b.textContent = _autoMetin('Reklam hazırlanıyor…');
  let kod = null;
  const sonuc = await odulluReklam(async () => {
    try {
      const r = await api('odullu-video/basla', { id: sp.calismaId });
      kod = r.kod;
      if (d.siparis) d.siparis.durum = 'reklam'; // sayaç durur, "yetişmedi" uyarısı çıkmaz
      return !!kod;
    } catch (e) { bildir(e.message, true); return false; }
  }, (acik) => ses.reklamSesi && ses.reklamSesi(acik));
  if (!kod) {
    if (!sonuc.gosterildi) bildir(_autoMetin('Şu an gösterilecek reklam yok. Biraz sonra yine dene.'), true);
    bitti(null);
    return;
  }
  let r = null;
  for (let i = 0; i < 3 && !r; i++) {
    try { r = (await api('odullu-video/bitir', { id: sp.calismaId, kod, izlendi: sonuc.izlendi })).siparis; } catch (e) { if (i === 2) bildir(e.message, true); else await new Promise((ok) => setTimeout(ok, 800)); }
  }
  bitti(r);
}

// ---------- Sokak olayları ve zabıta ----------
async function sokakOlayinaKatil(olay, eylemAdi, rect) {
  try {
    const r = await api('sokak/katil', { id: olay.id, eylem: eylemAdi });
    if (typeof r.bakiye === 'number') bakiyeUygula(r.bakiye, r.hareket);
    ses.odul();
    if (rect) ucanYazi(rect, r.tutar > 0 ? `+${tl(r.tutar)}` : r.tutar < 0 ? `−${tl(-r.tutar)}` : '👍', r.tutar > 0);
    kart({ ikon: r.tutar > 0 ? '🏅' : '💛', baslik: r.tutar > 0 ? _autoSablon`Ödül: ${tl(r.tutar)}` : _autoMetin('Güzel bir iyilik'), metin: `${r.metin}${r.tecrube ? _autoSablon` +${r.tecrube} tecrübe.` : ''}`, tur: 'basari', onemli: r.tutar > 0 });
    return r;
  } catch (e) {
    if (e instanceof OturumYok) return null;
    bildir(e.message, true);
    return null;
  }
}
// 0.41: müzisyenden şarkı iste (50 ₺); istersen şarkıyı başka bir oyuncuya hediye et
// 0.43: istek penceresi — şarkıyı hediye etme ve "altın istek" (özel anons + kısa mesaj, sıranın başına geçmez)
function istekPenceresi(altinBedel) {
  return new Promise((coz) => {
    const perde = document.createElement('div');
    perde.className = 'onay-perde';
    perde.innerHTML = `<div class="onay-kutu istek-kutu" role="dialog" aria-modal="true">
        <div class="onay-ikon" aria-hidden="true">🎻</div><h3>${_autoHtml('Şarkı iste')}</h3>
        <p>${_autoHtml('Şarkıyı kime hediye edelim? Boş bırakırsan senin için çalınır.')}</p>
        <input class="onay-girdi" name="hedef" maxlength="20" placeholder="${_autoHtml('Oyuncu adı (isteğe bağlı)')}">
        <label class="altin-istek-sec"><input type="checkbox" name="altin"><span>⭐ <b>${_autoHtml('Altın istek')}</b> <small>+${tl(altinBedel)}</small><br><small>${_autoHtml('Müzisyenler isteğini özel anonsla, mesajınla birlikte çalar; altın ışıltı ve konfeti olur. Sıran değişmez.')}</small></span></label>
        <input class="onay-girdi" name="mesaj" maxlength="60" hidden placeholder="${_autoHtml('Kısa mesajın (ör. İyi ki doğdun!)')}">
        <div class="onay-dugmeler"><button class="dugme gri" data-c="hayir">${_oyunHtml('notify.cancel')}</button><button class="dugme yesil" data-c="evet"></button></div></div>`;
    document.body.appendChild(perde);
    requestAnimationFrame(() => perde.classList.add('acik'));
    const al = perde.querySelector('[name=altin]'), ms = perde.querySelector('[name=mesaj]'), ev = perde.querySelector('[data-c=evet]');
    const yaz = () => { ms.hidden = !al.checked; ev.textContent = al.checked ? _autoSablon`Altın iste (${tl(guncelFiyat(5000) + altinBedel)})` : tutarEndeksle(_autoMetin('İste (50 ₺)')); perde.querySelector('.istek-kutu').classList.toggle('altin', al.checked); };
    al.addEventListener('change', () => { yaz(); if (al.checked) ms.focus(); });
    yaz();
    const bitir = (v) => { perde.classList.remove('acik'); document.removeEventListener('keydown', tus); setTimeout(() => perde.remove(), 200); coz(v); };
    const tus = (e) => { if (e.key === 'Escape') bitir(null); };
    document.addEventListener('keydown', tus);
    perde.querySelector('[data-c=hayir]').addEventListener('click', () => bitir(null));
    ev.addEventListener('click', () => bitir({ hedef: perde.querySelector('[name=hedef]').value.trim(), altin: al.checked, mesaj: ms.value.trim() }));
    let perdeBasma = null; // 0.57.13: metin seçerken dışarıda bırakınca kapanmasın
    perde.addEventListener('pointerdown', (e) => { perdeBasma = e.target; }, true);
    perde.addEventListener('click', (e) => { const b = perdeBasma; perdeBasma = null; if (e.target === perde && (b === null || b === perde)) bitir(null); });
    setTimeout(() => perde.querySelector('[name=hedef]').focus(), 50);
  });
}
async function muzisyenIstegi(olay, rect) {
  const secim = await istekPenceresi((olay.program && olay.program.altinBedel) || guncelFiyat(2500000));
  if (!secim) return null;
  const hedef = secim.hedef;
  try {
    const r = await api('sokak/muzisyen-istek', { id: olay.id, hedef: String(hedef || '').trim(), altin: secim.altin, mesaj: secim.mesaj });
    if (typeof r.bakiye === 'number') bakiyeUygula(r.bakiye, r.hareket);
    ses.odul();
    if (rect) ucanYazi(rect, `−${tl(-r.tutar)}`, false);
    const ne = r.baslangic ? sureMetni(Math.max(0, r.baslangic - simdi())) : '';
    kart({ ikon: r.altin ? '⭐' : '🎻', baslik: r.altin ? _autoSablon`Altın isteğin ${r.sira}. sırada` : _autoSablon`İsteğin ${r.sira}. sırada`, metin: r.hedef ? _autoSablon`Şarkın ${r.hedef} için çalınacak${ne ? ` (~${ne} sonra)` : ''}. +1 tecrübe.` : _autoSablon`Şarkın senin için çalınacak${ne ? ` (~${ne} sonra)` : ''}. +1 tecrübe.`, tur: 'basari' });
    return r;
  } catch (e) {
    if (e instanceof OturumYok) return null;
    bildir(e.message, true);
    return null;
  }
}
// 0.56: bir kez gösterilmesi gereken uyarılar (sayfa değişince, oyun yeniden açılınca tekrar çıkmasın)
function birKezMi(anahtar) {
  try {
    const l = JSON.parse(localStorage.getItem('tezgah_bir_kez') || '[]');
    if (l.includes(anahtar)) return false;
    l.push(anahtar);
    localStorage.setItem('tezgah_bir_kez', JSON.stringify(l.slice(-200)));
  } catch (e) { /* yok say */ }
  return true;
}
function zabitaSonucuGoster(kod, sonuc, z) {
  if (!birKezMi('zabita_' + kod + '_' + ((z && z.ms) || 0))) return;
  const is = d.seyyar && d.seyyar.isler.find((x) => x.kod === kod);
  const ad = is ? _seyyarAdi(is.ad) : _autoMetin('Tezgâh');
  const izinAl = { eylemAdi: _autoSablon`İzin al (${tl(d.seyyar ? d.seyyar.izin.ucret : guncelFiyat(150000))})`, eylem: () => izinUzat() };
  if (sonuc === 'kontrol') {
    kart({ ikon: '😊', baslik: _oyunMetni("ui.e8de20716f0d"), metin: _autoSablon`${ad}: iznin tamamdı, zabıta "kolay gelsin" deyip gitti.`, tur: 'basari' });
  } else if (sonuc === 'uyari') {
    ses.hata();
    kart({ ikon: '⚠️', baslik: _oyunMetni("ui.ad8fd109a175"), metin: _autoSablon`${ad}: bu sefer ceza yok. Seyyar iznin olmazsa bir dahaki gelişte ceza kesebilir.`, tur: 'uyari', ...izinAl, sure: 10000 });
  } else {
    ses.hata();
    kart({ ikon: '🚨', baslik: _oyunMetni("ui.8930a5feca72"), metin: _autoSablon`${ad}: izinsiz satış cezası ${tl(z.ceza || 0)}. Tezgâh bir süre kaldırıldı, günün satışı yarıya indi. Ceza iş bitince kazançtan düşülür. Sonraki kontrollerde ceza yememek için izin al.`, tur: 'hata', ...izinAl, sure: 12000 });
  }
}

// ---------- Günlük görevler ----------
async function gorevOzetiYenile() {
  try {
    const g = await api('gorevler');
    d.gorev = g;
    const r = document.getElementById('gorev-rozet');
    const bd = document.getElementById('gorev-dugme');
    if (!r || !bd) return;
    const biten = g.gorevler.filter((x) => x.tamam).length;
    r.hidden = g.alindi;
    r.textContent = biten >= 3 ? '🎁' : `${biten}/3`;
    bd.classList.toggle('nokta', biten >= 3 && !g.alindi);
  } catch (e) { /* sessiz */ }
}
// Günlük görev adı oyuncunun dilinde (sunucu Türkçe ad gönderir; kod ve hedeften yeniden kurulur)
function gorevAdi(x) {
  const h = x.hedef;
  switch (x.kod) {
    case 'servis': return _autoSablon`${h} müşteriye bizzat servis yap`;
    case 'is_bitir': return _autoSablon`${h} iş bitir ve kazancını topla`;
    case 'yardim': return h > 1 ? _autoSablon`Mahallede ${h} kez yardım et` : _autoMetin('Mahallede birine yardım et');
    case 'siparis': return h > 1 ? _autoSablon`${h} toplu siparişi zamanında yetiştir` : _autoMetin('Bir toplu siparişi zamanında yetiştir');
    case 'kazanc': return _autoSablon`Tezgâhlardan ${tl(h)} ciro yap`;
    case 'ambulans': return _autoSablon`Rahatsızlanan biri için ambulans çağır (${acilNo('ambulans')})`;
    case 'polis': return _autoSablon`Mahalledeki bir kavga için polisi ara (${acilNo('polis')})`;
    case 'itfaiye': return _autoSablon`Çıkan bir yangın için itfaiyeyi ara (${acilNo('itfaiye')})`;
    default: return _autoMetin(x.ad || '');
  }
}
// ---------- Yenilikler (0.38): güncellemeler ve planlananlar, oyuncunun dilinde ----------
function yeniDil(x) {
  if (!x || typeof x === 'string') return x || '';
  return x[aktifDil()] || x.en || x.tr || '';
}
async function yeniliklerPaneli() {
  const p = panelAc({ ikon: '📰', baslik: _autoMetin('Yenilikler'), rota: 'yenilikler', alt: _autoMetin('Güncellemeler ve planlananlar'), govde: `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>` });
  const kutu = p.querySelector('.panel-govde');
  let y;
  try { y = await api('yenilikler'); } catch (e) { kutu.innerHTML = `<p class="soluk">${esc(e.message)}</p>`; return; }
  if (!kutu.isConnected) return;
  try { if (y.surumler && y.surumler[0]) localStorage.setItem('cirak_yenilik_goruldu', y.surumler[0].surum); } catch (e) { /* yok say */ }
  const tarihYaz = (s) => { try { return new Intl.DateTimeFormat(aktifDil(), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(s + 'T12:00:00Z')); } catch (e) { return s; } };
  kutu.innerHTML = `${(y.surumler || []).map((s, i) => `<details class="kart yenilik"${i < 2 ? ' open' : ''}><summary><b>${esc(yeniDil(s.baslik) || s.surum)}</b> <span class="rozetcik bilgi">${esc(s.surum)}</span>${s.tarih ? `<br><small class="soluk">${esc(tarihYaz(s.tarih))}</small>` : ''}</summary>
      <ul class="kural-listesi">${(s.maddeler || []).map((m) => `<li>${esc(yeniDil(m))}</li>`).join('')}</ul>
      ${(s.katkilar || []).length ? `<div class="yenilik-katki"><b>🛠️ ${_autoHtml('Topluluk katkıları')}</b><ul>${s.katkilar.map((k) => `<li>${esc(k.baslik)} <small>${_autoSablon`öneren: ${esc(k.ad)}`}</small></li>`).join('')}</ul></div>` : ''}</details>`).join('')}
    ${(y.planlanan || []).length ? `<div class="kart"><h3>🛠️ ${_autoHtml("Planlananlar")}</h3><ul class="kural-listesi">${y.planlanan.map((m) => `<li>${esc(yeniDil(m))}</li>`).join('')}</ul></div>` : ''}`;
}
// 0.41.1: Anketler. Oy verince (ya da anket bitince) sonuç yüzde olarak görünür; katılımcı sayısı gösterilmez.
async function anketPaneli() {
  const p = panelAc({ ikon: '📊', baslik: _autoMetin('Anketler'), rota: 'anket', alt: _autoMetin('Fikrini söyle, oyunu birlikte geliştirelim'), govde: `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>` });
  const kutu = p.querySelector('.panel-govde');
  let r;
  try { r = await api('anket'); } catch (e) { kutu.innerHTML = `<p class="soluk">${esc(e.message)}</p>`; return; }
  if (!kutu.isConnected) return;
  const tarihYaz = (ms) => { try { return new Intl.DateTimeFormat(aktifDil(), { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(ms)); } catch (e) { return new Date(ms).toLocaleString(); } };
  const kart = (a) => {
    const sonuc = a.yuzde && a.yuzde.length;
    const enCok = sonuc ? Math.max(...a.yuzde) : -1;
    const govde = sonuc
      ? a.secenekler.map((x, i) => `<div class="anket-satir${a.yuzde[i] === enCok && enCok > 0 ? ' onde' : ''}${a.benim === i ? ' benim' : ''}"><div class="anket-ust"><span>${a.benim === i ? '✔ ' : ''}${esc(x)}</span><b>%${a.yuzde[i]}</b></div><div class="anket-cubuk"><i style="width:${a.yuzde[i]}%"></i></div></div>`).join('')
      : `<div class="anket-secim">${a.secenekler.map((x, i) => `<button class="dugme anket-dugme" data-anket="${a.id}" data-secenek="${i}">${esc(x)}</button>`).join('')}</div>`;
    const alt = a.acik ? _autoSablon`Son gün: ${tarihYaz(a.bit)}` : _autoSablon`Sona erdi: ${tarihYaz(a.bit)}`;
    return `<div class="kart anket" data-kart="${a.id}"><div class="anket-baslik"><b>${esc(a.soru)}</b><span class="rozetcik ${a.acik ? 'iyi' : 'bilgi'}">${a.acik ? _autoHtml("Sürüyor") : _autoHtml("Sona erdi")}</span></div>
      <small class="soluk">${esc(alt)}</small>${govde}${sonuc && a.acik ? `<small class="soluk anket-not">${_autoHtml("Oy verdiğin için teşekkürler! Sonuç anket bitene kadar değişebilir.")}</small>` : ''}</div>`;
  };
  const ciz = () => {
    kutu.innerHTML = r.anketler.length ? r.anketler.map(kart).join('') : `<div class="bos-durum"><div style="font-size:42px">📊</div><p class="soluk">${_autoHtml("Şu an süren bir anket yok. Yeni anket açılınca bildirim gelecek.")}</p></div>`;
    kutu.querySelectorAll('[data-anket]').forEach((b) => b.addEventListener('click', async () => {
      kutu.querySelectorAll(`[data-anket="${b.dataset.anket}"]`).forEach((x) => { x.disabled = true; });
      const s = await eylem(null, () => api('anket/oy', { id: Number(b.dataset.anket), secenek: Number(b.dataset.secenek) }));
      if (s === undefined) { kutu.querySelectorAll(`[data-anket="${b.dataset.anket}"]`).forEach((x) => { x.disabled = false; }); return; }
      const a = r.anketler.find((x) => x.id === s.id);
      if (a) { a.benim = s.benim; a.yuzde = s.yuzde; }
      ses.satinAl();
      ciz();
    }));
  };
  ciz();
}
// yeni sürüm notu bir kez kart olarak gösterilir
async function yenilikDuyur() {
  try {
    const y = await api('yenilikler');
    const s = y.surumler && y.surumler[0];
    if (!s) return;
    let gorulen = null;
    try { gorulen = localStorage.getItem('cirak_yenilik_goruldu'); } catch (e) { /* yok say */ }
    if (gorulen === s.surum) return;
    try { localStorage.setItem('cirak_yenilik_goruldu', s.surum); } catch (e) { /* yok say */ }
    if (gorulen === null && Number(d.genel && d.genel.oyuncu && d.genel.oyuncu.seviye) <= 2) return; // yeni oyuncuya gösterilmez
    oyunBildirimi('yenilik_' + s.surum, '📰', _autoSablon`Yeni sürüm: ${s.surum}`, yeniDil(s.baslik) || '', _autoMetin('Neler yeni?'), () => { location.hash = '#/yenilikler'; }, 0, true);
  } catch (e) { /* sessiz */ }
}

async function gorevPaneli() {
  let g;
  try { g = await api('gorevler'); } catch (e) { return bildir(e.message, true); }
  d.gorev = g;
  const hepsi = g.gorevler.every((x) => x.tamam);
  const satir = (x) => {
    const n = x.para ? `${tl(x.n)} / ${tl(x.hedef)}` : `${x.n}/${x.hedef}`;
    return `<li class="gorev ${x.tamam ? 'tamam' : ''}"><span class="gorev-ikon">${x.tamam ? '✅' : x.simge}</span>
      <div class="gorev-yazi"><b>${esc(gorevAdi(x))}</b><div class="gorev-cubuk"><i style="width:${Math.min(100, (x.n / x.hedef) * 100)}%"></i></div></div>
      <span class="gorev-sayi sayi">${n}</span></li>`;
  };
  panelAc({
    ikon: '📋', baslik: _oyunMetni("ui.a8631b2995b0"), alt: _autoSablon`Yenilenmesine ${sureMetni(g.gunSonu - simdi())} var`,
    govde: `<ul class="gorev-liste">${g.gorevler.map(satir).join('')}</ul>
      <div class="gorev-sandik ${hepsi && !g.alindi ? 'hazir' : ''}">
        <span class="sandik-ikon">${g.alindi ? '📭' : '🎁'}</span>
        <div><b>${_autoHtml("Ödül sandığı")}</b><div class="kucuk soluk">${g.alindi ? _autoHtml('Bugünün ödülünü aldın. Yarın yeni görevler gelecek.') : _autoSablon`${tl(g.odul)} ve +${g.tecrube} tecrübe`}</div></div>
        ${!g.alindi ? `<button class="dugme ${hepsi ? 'yesil' : ''}" data-sandik ${hepsi ? '' : 'disabled'}>${hepsi ? _autoHtml('Aç!') : _autoHtml('Kilitli')}</button>` : ''}
      </div>
      ${geriSayimHtml(g.gunSonu, { baslik: t(g.alindi ? 'timer.newTasks' : hepsi ? 'timer.openChest' : 'timer.tasksReset'), ikon: g.alindi ? '🌅' : hepsi ? '🎁' : '📋', tur: 'sandik' })}
      <a class="sezon-bag" href="#/magaza/kartlar">🏅 <b>${_autoHtml("Haftalık sezon")}</b> <span>${d.genel.sezonOdul ? _autoSablon`${d.genel.sezonOdul} ödülün hazır` : _autoHtml("Her TP sezon puanı olur")}</span> ›</a>
      <p class="kucuk soluk">${_autoHtml("İpucu: Mahallede olan olaylara (kavga, rahatsızlanan biri, düşen cüzdan, sokak kedisi, müzisyen) dokunarak yardım edebilirsin. Toplu siparişler tezgâh başındaki müşterilere servis yaparken gelir.")}</p>`,
    hazir(govde) {
      geriSayimBaslat(govde, () => { if (aktifPanel() === _autoMetin('Günlük görevler')) { gorevOzetiYenile(); gorevPaneli(); } });
      const b = govde.querySelector('[data-sandik]');
      if (b) b.addEventListener('click', async () => {
        const rect = b.getBoundingClientRect();
        const r = await eylem(b, () => api('gorevler/odul', {}));
        if (!r) return;
        bakiyeUygula(r.bakiye, r.hareket);
        await sikkeUcur(rect, 12);
        ses.odul();
        kart({ ikon: '🎁', baslik: _oyunMetni("ui.cbec7cc1931c"), metin: _autoSablon`${tl(r.tutar)} ve +${r.tecrube} tecrübe kazandın. Yarın yeni görevler seni bekliyor.`, tur: 'basari' });
        gorevOzetiYenile();
        gorevPaneli();
      });
    },
  });
}

function ucanYazi(rect, metin, ozel) {
  const e = document.createElement('div');
  e.className = 'ucan-yazi' + (ozel ? ' ozel' : '');
  e.textContent = _autoMetin(metin);
  e.style.left = rect.left + rect.width / 2 + 'px';
  e.style.top = rect.top + 'px';
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 1300);
}

function tezgahPaneli(kod, seciliSure = 'saat1') {
  const is = d.seyyar && d.seyyar.isler.find((x) => x.kod === kod);
  if (!is) return;
  const a = is.aktif;
  let govde = '';
  let alt = esc(_seyyarAciklama(is.aciklama));

  if (a) {
    const bitti = a.bitis <= simdi();
    govde = `
      <div class="kart">
        <h3>${bitti ? _oyunMetni("stall.finished") : _oyunMetni("stall.working")}</h3>
        <p>${a.calisan === 'cirak' ? _oyunMetni("stall.apprenticeHere") : _oyunMetni("stall.youHere")} ${_oyunHtml("stall.workPeriod", {period:_calismaSuresi(a.sure)})}</p>
        ${bitti ? '' : `<p class="sayi"><b>${_oyunHtml("stall.remaining", {time:sureMetni(a.bitis - simdi())})}</b></p>`}
      </div>
      ${bitti ? '' : hizDugmesi(a)}
      ${!bitti && a.calisan === 'cirak' && a.cirakUcreti > 0 && !a.videoYevmiye ? videoDugmesiHtml('yevmiye', a.id, _autoSablon`📺 Video izle: çırak yevmiyesi (${tl(a.cirakUcreti)}) geri gelsin`, _autoSablon`⭐ Çırak yevmiyesi (${tl(a.cirakUcreti)}) geri gelsin`) : ''}
      ${bitti && a.ceza > 0 && !a.videoZabita && videoEylemi('zabita') ? videoDugmesiHtml('zabita', a.id, _autoSablon`📺 Video izle: zabıta cezasını (${tl(a.ceza)}) sil`, _autoSablon`⭐ Zabıta cezasını (${tl(a.ceza)}) sil`) : ''}
      ${bitti && a.ciro > 0 && !a.videoBonus && videoEylemi('bonus') ? videoDugmesiHtml('bonus', a.id, _autoSablon`📺 Video izle: +${tl(Math.min(videoEylemi('bonus').tavan, Math.round(a.ciro * videoEylemi('bonus').oran / 100)))} bonusla topla`, _autoSablon`⭐ +${tl(Math.min(videoEylemi('bonus').tavan, Math.round(a.ciro * videoEylemi('bonus').oran / 100)))} bonusla topla`, _autoSablon`Satışın %${videoEylemi('bonus').oran}'i kadar bonus.`) : ''}
      ${bitti ? `<button class="dugme yesil" data-eylem="topla">💰 ${_oyunHtml("stall.collect")}</button>`
        : `<button class="metin-dugme" data-eylem="iptal">${_oyunHtml("stall.quit")}</button>`}`;
  } else if (is.kilitli) {
    govde = `<div class="kart kilit-kart"><h3><span class="kilit-rozet buyuk">${_oyunHtml("stall.level", {level:is.seviye})}</span></h3><p>${_oyunHtml("stall.levelHint")}</p></div>
      <button class="dugme gri" data-kapat>${_oyunHtml("stall.ok")}</button>`;
  } else if (!is.sahip) {
    const tam = is.sureler.find((s) => s.kod === 'tam');
    govde = `<div class="kart"><table class="tablo">
        <tr><td>${esc(_ekipmanAdi(is.ekipmanAdi))}</td><td>${tl(is.ekipman)}</td></tr>
        <tr><td>${_oyunHtml("stall.dayEstimate")}</td><td class="${tam.tahminiNet >= 0 ? 'arti' : 'eksi'}">${isaretliTl(tam.tahminiNet)}</td></tr></table>
        ${tam.tahminiNet < 0 ? `<p class="kucuk eksi">${_oyunHtml("stall.seasonLoss")}</p>` : ''}
        <p class="kucuk soluk">${_oyunHtml("stall.equipmentHint")}</p></div>
      <button class="dugme yesil" data-eylem="al">${_oyunHtml("stall.buy", {amount:tl(is.ekipman)})}</button>`;
  } else {
    const s = is.sureler.find((x) => x.kod === seciliSure);
    govde = `
      <div class="kart" style="padding:10px 14px">
        <p class="kucuk" style="margin:0">${d.seyyar.cirakla
          ? `👷 ${_oyunHtml("stall.assignApprentice", {amount:tl(d.seyyar.yevmiye)})}`
          : `🙋 ${_oyunHtml("stall.assignYou")}`}</p>
      </div>
      <div class="sure-secimi" role="group" aria-label="${_oyunHtml("stall.duration")}">
        ${is.sureler.map((x) => `<button data-sure="${x.kod}" aria-pressed="${x.kod === seciliSure}"><b>${esc(_calismaSuresi(x.ad))}</b><small>${_oyunHtml("stall.realDuration", {time:gercekSureAdi(x.gercekMs)})}</small></button>`).join('')}
      </div>
      <div class="kart"><table class="tablo">
        <tr><td>${_oyunHtml("stall.materials")}</td><td class="eksi">${isaretliTl(-s.malzeme)}</td></tr>
        ${s.cirakUcreti ? `<tr><td>${_oyunHtml("stall.apprenticeWage")}</td><td class="eksi">${isaretliTl(-s.cirakUcreti)}</td></tr>` : ''}
        <tr class="toplam"><td>${_oyunHtml("stall.estimate")}</td><td class="${s.tahminiNet >= 0 ? 'arti' : 'eksi'}">${isaretliTl(s.tahminiNet)}</td></tr>
      </table>
      <p class="kucuk soluk" style="margin-bottom:0">${seciliSure === 'uc' || seciliSure === 'hafta' ? _oyunMetni("stall.longWork") : _oyunMetni("stall.customerTip")} ${_oyunHtml("stall.weatherHint")}</p></div>
      <button class="dugme yesil" data-eylem="basla">▶ ${_oyunHtml("stall.start")}</button>
      <button class="metin-dugme" data-eylem="sat">${_oyunHtml("stall.sellEquipment", {amount:tl(is.geriSatis)})}</button>`;
  }

  panelAc({ icerikBoyu: true,
    ikon: is.simge, baslik: _seyyarAdi(is.ad), alt, govde,
    hazir(g) {
      g.querySelectorAll('[data-sure]').forEach((b) => b.addEventListener('click', () => { ses.tik(); tezgahPaneli(kod, b.dataset.sure); }));
      const on = (ad, f) => { const b = g.querySelector(`[data-eylem=${ad}]`); if (b) b.addEventListener('click', () => f(b)); };
      on('al', async (b) => {
        const r = await eylem(b, () => api('seyyar/ekipman-al', { isKodu: kod }));
        if (r === undefined) return;
        ses.satinAl();
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        mahalle.odakla(kod);
        bildir(_oyunMetni("stall.equipmentBought", {equipment:_ekipmanAdi(is.ekipmanAdi)}));
        tezgahPaneli(kod);
      });
      on('basla', async (b) => {
        const r = await eylem(b, () => api('seyyar/basla', { isKodu: kod, sure: seciliSure }));
        if (r === undefined) return;
        ses.satinAl();
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        panelKapat();
        mahalle.odakla(kod);
        bildir(r.calisan === 'cirak' ? _oyunMetni("stall.apprenticeStarted") : _oyunMetni("stall.started"));
      });
      on('sat', async (b) => {
        if (!(await onayla(_oyunMetni("stall.sellConfirm", {equipment:_ekipmanAdi(is.ekipmanAdi),amount:tl(is.geriSatis)}), { baslik: _oyunMetni("ui.8fc3991fb1c4"), evet: _oyunMetni("ui.fdeb71b569e0"), ikon: '💸' }))) return;
        const r = await eylem(b, () => api('seyyar/ekipman-sat', { isKodu: kod }));
        if (r === undefined) return;
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        panelKapat();
        bildir(_oyunMetni("stall.sold"));
      });
      on('iptal', async (b) => {
        if (!(await onayla(_oyunMetni("stall.quitConfirm"), { baslik: _oyunMetni("ui.a25b25e0ea97"), evet: _oyunMetni("stall.leave"), tehlike: true, ikon: '⚠️' }))) return;
        const r = await eylem(b, () => api('seyyar/iptal', { id: a.id }));
        if (r === undefined) return;
        await yenileHepsi();
        panelKapat();
        bildir(_oyunMetni("stall.left"));
      });
      on('hizlandir', async (b) => {
        const r = await isHizlandir(a, b);
        if (r && r.kazanilan > 0) { await yenileHepsi().catch(() => {}); if (g.isConnected) tezgahPaneli(kod); }
      });
      if (g.querySelector('[data-eylem=hizlandir], [data-video]')) reklamHazirla(d.genel.odulluVideo);
      g.querySelectorAll('[data-video]').forEach((b) => b.addEventListener('click', async () => {
        const tur = b.dataset.video;
        const r = await videoEylem(tur, a.id, b);
        if (!r || !(r.tutar > 0)) return;
        if (tur === 'zabita') {
          kart({ ikon: '👮', baslik: _autoSablon`Zabıta cezası silindi: ${tl(r.tutar)}`, metin: _autoMetin('Kazancını cezasız toplayabilirsin.'), tur: 'basari' });
          await yenileHepsi().catch(() => {});
          if (g.isConnected) tezgahPaneli(kod);
          return;
        }
        if (tur === 'bonus') {
          bakiyeSay(d.genel.oyuncu.bakiye + r.tutar);
          kart({ ikon: '🎁', baslik: _autoSablon`+${tl(r.tutar)} video bonusu`, metin: _autoMetin('Bonus hesabına geçti, kazancın toplanıyor.'), tur: 'basari' });
          if (g.isConnected) panelKapat();
          const yer = mahalle.ekranYeri(kod);
          toplaTek(kod, yer ? { left: yer.x - 20, top: yer.y - 20, width: 40, height: 40 } : b.getBoundingClientRect());
        } else {
          kart({ ikon: '👷', baslik: _autoSablon`Çırak yevmiyesi geri geldi: +${tl(r.tutar)}`, metin: _autoMetin('Bu işin çırağı bugün senden ücret almadı.'), tur: 'basari' });
          await yenileHepsi().catch(() => {});
          if (g.isConnected) tezgahPaneli(kod);
        }
      }));
      on('topla', async (b) => {
        panelKapat();
        const yer = mahalle.ekranYeri(kod);
        toplaTek(kod, yer ? { left: yer.x - 20, top: yer.y - 20, width: 40, height: 40 } : b.getBoundingClientRect());
      });
    },
  });
}

// 0.47: Ödüllü video ile tezgâh işini hızlandır (kalan sürenin bir kısmı düşer; Esnaf Kartı sahiplerine reklamsız)
function hizTahmini(a) {
  const ov = d.genel && d.genel.odulluVideo;
  if (!ov || !ov.hiz) return 0;
  const kalan = a.bitis - simdi();
  return Math.max(0, Math.min(ov.hiz.tavanDk * 60000, Math.round(kalan * ov.hiz.oran / 100)));
}
const hizSureAdi = (ms) => ms >= 60000 ? gercekSureAdi(ms) : t('notify.seconds', { seconds: Math.max(1, Math.round(ms / 1000)) });
function hizDugmesi(a) {
  const ov = d.genel && d.genel.odulluVideo;
  if (!ov || !ov.hiz || a.hizlandi || a.bitis - simdi() < 60000) return '';
  if (ov.hiz.kalan <= 0) return `<p class="kucuk soluk" style="margin:0 0 8px">⏩ ${_autoHtml("Bugünkü hızlandırma hakların bitti. Yarın yine gel.")}</p>`;
  const sure = hizSureAdi(hizTahmini(a));
  return `<button class="dugme mavi" data-eylem="hizlandir">${ov.kart ? _autoSablon`⭐ Hızlandır: ${sure} erken bitsin` : _autoSablon`📺 Video izle: ${sure} erken bitsin`}</button>
    <p class="kucuk soluk" style="margin:8px 0 12px;text-align:center">${ov.kart ? _autoHtml('Esnaf Kartı: reklamsız.') + ' ' : ''}${_autoSablon`Kazancın aynı kalır. Bugün ${ov.hiz.kalan} hakkın var.`} ${haftaIpucu()}</p>`;
}
async function isHizlandir(a, b) {
  const ov = d.genel && d.genel.odulluVideo;
  if (!ov || !ov.hiz || !b || b.dataset.mesgul) return null;
  b.dataset.mesgul = '1';
  b.disabled = true;
  const eskiYazi = b.textContent;
  const bitti = (r) => {
    delete b.dataset.mesgul;
    b.disabled = false;
    b.textContent = eskiYazi;
    if (r && r.kazanilan > 0) {
      ov.hiz.kalan = Math.max(0, ov.hiz.kalan - 1);
      if (!ov.kart && ov.hafta) ov.hafta.adet++;
      a.bitis = r.bitis; a.hizlandi = true;
      ses.odul();
      kart({ ikon: '⏩', baslik: _autoSablon`İş ${hizSureAdi(r.kazanilan)} erken bitecek`, metin: _autoMetin('Kazancın aynı kaldı, tezgâhın daha erken boşalıyor.'), tur: 'basari' });
    }
    return r;
  };
  if (ov.kart) {
    try { return bitti(await api('odullu-video/hiz-basla', { id: a.id })); } catch (e) { bildir(e.message, true); return bitti(null); }
  }
  reklamHazirla(ov);
  b.textContent = _autoMetin('Reklam hazırlanıyor…');
  let kod = null;
  const sonuc = await odulluReklam(async () => {
    try { const r = await api('odullu-video/hiz-basla', { id: a.id }); kod = r.kod; return !!kod; } catch (e) { bildir(e.message, true); return false; }
  }, (acik) => ses.reklamSesi && ses.reklamSesi(acik));
  if (!kod) {
    if (!sonuc.gosterildi) bildir(_autoMetin('Şu an gösterilecek reklam yok. Biraz sonra yine dene.'), true);
    return bitti(null);
  }
  let r = null;
  for (let i = 0; i < 3 && !r; i++) {
    try { r = await api('odullu-video/hiz-bitir', { id: a.id, kod, izlendi: sonuc.izlendi }); } catch (e) { if (i === 2) bildir(e.message, true); else await new Promise((ok) => setTimeout(ok, 800)); }
  }
  if (r && !r.kazanilan) bildir(_autoMetin('Reklam yarıda kaldı; iş aynı sürede bitecek. İstersen yeniden deneyebilirsin.'));
  return bitti(r);
}

// 0.49.0: diğer ödüllü video eylemleri (bonus, yevmiye, tesis) ve haftalık Esnaf Kartı denemesi
function haftaIpucu() {
  const ov = d.genel && d.genel.odulluVideo;
  if (!ov || ov.kart || !ov.hafta || ov.hafta.verildi) return '';
  return `<span class="video-hafta">🎫 ${_autoSablon`Bu hafta ${Math.min(ov.hafta.adet, ov.hafta.hedef)}/${ov.hafta.hedef} video · ${ov.hafta.hedef}. videoda ${ov.hafta.saat} saat Esnaf Kartı denemesi`}</span>`;
}
function videoEylemi(tur) { const ov = d.genel && d.genel.odulluVideo; return ov && ov.eylem && ov.eylem[tur] ? ov.eylem[tur] : null; }
function videoDugmesiHtml(tur, id, yazi, kartYazi, aciklama = '') {
  const ov = d.genel && d.genel.odulluVideo, e = videoEylemi(tur);
  if (!e) return '';
  if (e.kalan <= 0) return `<p class="kucuk soluk video-not">📺 ${_autoHtml("Bugünkü video hakların bitti. Yarın yine gel.")}</p>`;
  return `<button class="dugme mavi" data-video="${tur}" data-video-id="${id}">${ov.kart ? kartYazi : yazi}</button>
    <p class="kucuk soluk video-not">${ov.kart ? _autoHtml('Esnaf Kartı: reklamsız.') + ' ' : ''}${aciklama}${aciklama ? ' ' : ''}${_autoSablon`Bugün ${e.kalan} hakkın var.`} ${haftaIpucu()}</p>`;
}
async function videoEylem(tur, id, b) {
  const ov = d.genel && d.genel.odulluVideo, e = videoEylemi(tur);
  if (!b) b = { dataset: {}, textContent: '', disabled: false }; // 0.48: düğmesiz (bildirimden) çağrı
  if (!e || b.dataset.mesgul) return null;
  b.dataset.mesgul = '1';
  b.disabled = true;
  const eskiYazi = b.textContent;
  const bitti = (r) => {
    delete b.dataset.mesgul;
    b.disabled = false;
    b.textContent = eskiYazi;
    if (r && (r.tutar > 0 || r.kazanilan > 0 || r.tamam)) {
      e.kalan = Math.max(0, e.kalan - 1);
      if (!r.kart && ov.hafta) ov.hafta.adet++;
      ses.odul();
    }
    return r;
  };
  if (ov.kart) {
    try { return bitti(await api('odullu-video/eylem-basla', { tur, id })); } catch (err) { bildir(err.message, true); return bitti(null); }
  }
  reklamHazirla(ov);
  b.textContent = _autoMetin('Reklam hazırlanıyor…');
  let kod = null;
  const sonuc = await odulluReklam(async () => {
    try { const r = await api('odullu-video/eylem-basla', { tur, id }); kod = r.kod; return !!kod; } catch (err) { bildir(err.message, true); return false; }
  }, (acik) => ses.reklamSesi && ses.reklamSesi(acik));
  if (!kod) {
    if (!sonuc.gosterildi) bildir(_autoMetin('Şu an gösterilecek reklam yok. Biraz sonra yine dene.'), true);
    return bitti(null);
  }
  let r = null;
  for (let i = 0; i < 3 && !r; i++) {
    try { r = await api('odullu-video/eylem-bitir', { tur, id, kod, izlendi: sonuc.izlendi }); } catch (err) { if (i === 2) bildir(err.message, true); else await new Promise((ok) => setTimeout(ok, 800)); }
  }
  if (r && !(r.tutar > 0 || r.kazanilan > 0 || r.tamam)) bildir(_autoMetin('Reklam yarıda kaldı, ödül verilmedi. İstersen yeniden deneyebilirsin.'));
  bitti(r);
  // haftalık hedefe ulaşıldıysa Esnaf Kartı denemesi başlamış olabilir
  if (r && ov.hafta && !ov.hafta.verildi && ov.hafta.adet >= ov.hafta.hedef) { durumYenile().then(hudGuncelle).catch(() => {}); }
  return r;
}

// Uçan sikkeler: kaynaktan para sayacına
function sikkeUcur(kaynak, adet = 8) {
  return new Promise((bitir) => {
    const hedef = document.getElementById('sikke-hedef');
    if (!hedef || !kaynak) return bitir();
    const h = hedef.getBoundingClientRect();
    const bx = kaynak.left + kaynak.width / 2;
    const by = kaynak.top + kaynak.height / 2;
    const hx = h.left + h.width / 2;
    const hy = h.top + h.height / 2;
    let kalan = adet;
    for (let i = 0; i < adet; i++) {
      const s = document.createElement('div');
      s.className = 'ucan-sikke sikke';
      document.body.appendChild(s);
      const sx = bx + (Math.random() - 0.5) * 60;
      const sy = by + (Math.random() - 0.5) * 40;
      const anim = s.animate([
        { transform: `translate(${bx - 14}px, ${by - 14}px) scale(0.4)`, opacity: 0 },
        { transform: `translate(${sx - 14}px, ${sy - 60}px) scale(1.1)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${hx - 14}px, ${hy - 14}px) scale(0.7)`, opacity: 1 },
      ], { duration: 750 + i * 60, easing: 'cubic-bezier(.5,0,.6,1)', delay: i * 45 });
      anim.onfinish = () => {
        s.remove();
        if (i % 2 === 0) ses.sikke();
        if (--kalan === 0) bitir();
      };
    }
  });
}

// Keselere art arda dokunulursa (0.37.22) toplama istekleri sırayla gider ve sonuç tek seferde gösterilir:
// eskiden her dokunuş ayrı ayrı bütün ekranı yeniliyor, aynı anda birkaç yenileme oyunu donduruyordu.
const toplaSirasi = { kodlar: [], rect: null, calisiyor: false };
async function toplaTek(kod, rect) {
  const a = d.seyyar && d.seyyar.aktifler.find((x) => x.isKodu === kod);
  if (!a || toplaSirasi.kodlar.includes(kod) || a.toplaniyor) return;
  a.toplaniyor = true;
  const b = document.querySelector(`[data-kese="${CSS.escape(kod)}"]`);
  if (b) { b.disabled = true; b.classList.add('toplaniyor'); }
  toplaSirasi.kodlar.push(kod);
  if (!toplaSirasi.rect) toplaSirasi.rect = rect;
  ses.tik();
  if (toplaSirasi.calisiyor) return;
  toplaSirasi.calisiyor = true;
  try {
    // ilk dokunuştan sonra kısa bir süre diğer dokunuşlar da beklenir; sonuç gösterilirken gelen
    // dokunuşlar da kaybolmaz, bir sonraki turda toplanır
    while (toplaSirasi.kodlar.length) {
      await new Promise((ok) => setTimeout(ok, 180));
      const sonuclar = [];
      while (toplaSirasi.kodlar.length) {
        const k = toplaSirasi.kodlar.shift();
        const x = d.seyyar && d.seyyar.aktifler.find((y) => y.isKodu === k);
        if (!x) continue;
        const r = await eylem(null, () => api('seyyar/topla', { id: x.id }));
        if (r === undefined) {
          x.toplaniyor = false;
          const bb = document.querySelector(`[data-kese="${CSS.escape(k)}"]`);
          if (bb) { bb.disabled = false; bb.classList.remove('toplaniyor'); }
          continue;
        }
        sonuclar.push(r);
      }
      const rr = toplaSirasi.rect;
      toplaSirasi.rect = null;
      if (sonuclar.length) await sonucGoster(sonuclar, rr);
    }
  } finally { toplaSirasi.calisiyor = false; toplaSirasi.kodlar = []; }
}

// 0.44: Esnaf Kartı — biten işleri topla, her tezgâhta aynı işi aynı süreyle yeniden başlat
async function toplaBaslat(rect) {
  const r = await eylem(null, () => api('esnaf/topla-baslat', {}));
  if (r === undefined) return;
  await sonucGoster(r.toplanan, rect);
  if (r.baslayan.length) bildir(_autoSablon`🔁 ${r.baslayan.length} tezgâhta iş yeniden başladı.`);
  if (r.olmayan.length) bildir(_autoSablon`${r.olmayan.length} tezgâh başlatılamadı: ${r.olmayan[0].neden}`, true);
  await yenileHepsi();
}
async function toplaHepsi(rect) {
  const r = await eylem(null, () => api('seyyar/topla-hepsi', {}));
  if (r === undefined) return;
  await sonucGoster(r, rect);
}

async function sonucGoster(sonuclar, rect) {
  try { const k0 = localStorage.getItem('tezgah_rehber_' + d.genel.oyuncu.id); if (k0 !== 'bitti' && (k0 || d.genel.oyuncu.seviye <= 3)) localStorage.setItem('tezgah_rehber_' + d.genel.oyuncu.id, '5'); } catch (e) { /* yok say */ }
  d.rehberServis = false;
  await yenileHepsi();
  await sikkeUcur(rect, Math.min(14, 6 + sonuclar.length * 2));
  ses.kasa();
  bakiyeSay(d.genel.oyuncu.bakiye);
  const net = sonuclar.reduce((t, r) => t + r.net, 0);
  const olay = sonuclar.flatMap((r) => r.olaylar)[0];
  const baslik = sonuclar.length === 1 ? `${sonuclar[0].simge} ${sonuclar[0].isAdi}` : _autoSablon`${sonuclar.length} tezgâh`;
  bildir(_autoSablon`${baslik}: ${isaretliTl(net)} kâr${olay ? '. ' + olay.metin : ''}`, net < 0);
  const atlayan = sonuclar.filter((r) => r.seviyeAtladi).pop();
  if (atlayan) {
    const seviye = atlayan.seviyeAtladi;
    ses.seviye();
    const acilan = d.seyyar.isler.filter((i) => i.seviye === seviye).map((i) => `${i.simge} ${esc(_seyyarAdi(i.ad))}`);
    const sert = atlayan.sertifika ? { kod: atlayan.sertifika, seviye, baslik: _autoSablon`${seviye}. seviye` } : null;
    const p = panelAc({ icerikBoyu: true,
      ikon: '⭐', baslik: _oyunMetni("ui.9ef27812f595"),
      govde: `<div class="kutlama">${_autoSablon`${seviye}. seviye`}</div>
        <p>${_autoSablon`Müşterilerin artık %${(seviye - 1) * 2} daha fazla. <b>+1 yetenek puanı</b> kazandın.`}</p>
        <button class="dugme mavi kucuk" data-yetenek-git>${_autoHtml("🎯 Yeteneğini seç")}</button>
        ${acilan.length ? `<div class="kart"><h3>${_autoHtml("Yeni tezgâh açıldı")}</h3><p>${acilan.join('<br>')}</p></div>` : ''}
        ${sert ? `<div class="kart sertifika-kart"><h3>${_autoHtml("🏆 Sertifikanı arkadaşlarınla paylaş")}</h3>
          <p class="kucuk soluk" style="margin:0 0 10px">${_autoHtml("Adına özel başarı sertifikan hazır. Paylaş, arkadaşların senin davetinle gelsin, sen de kazan.")}</p>
          ${sertifikaKartiHtml(sert)}</div>` : ''}
        <button class="dugme${sert ? ' gri' : ''}" data-kapat>${sert ? _autoHtml('Sonra paylaşırım') : _autoHtml('Harika!')}</button>`,
    });
    if (sert) sertifikaKartiKur(p, sert);
    p.querySelector('[data-yetenek-git]').addEventListener('click', () => { location.hash = '#/yetenekler'; });
  }
}

// İşlerim: üstte ne yapman gerektiği (yapılacaklar), altta sekmeler hâlinde tezgâhlar ve dükkânlar
async function tezgahlarPaneli(sekme = d.islerSekmesi || 'ozet') {
  const s = d.seyyar;
  if (!s) return;
  d.islerSekmesi = sekme;
  let dukkanlar = d.isletmelerimOnbellek || [];
  const p = panelAc({ ikon: '💼', baslik: _oyunMetni("ui.7c09669ac339"), rota: 'tezgahlar', govde: islerHtml(s, dukkanlar, sekme) });
  islerBagla(p.querySelector('.panel-govde'), s, dukkanlar);
  // dükkân ayrıntıları (ciro, şube, raflar) sunucudan gelince liste tazelenir
  try {
    dukkanlar = await api('isletmelerim');
    d.isletmelerimOnbellek = dukkanlar;
    if (aktifRota() !== 'tezgahlar' || d.islerSekmesi !== sekme || !p.isConnected) return;
    const g = p.querySelector('.panel-govde');
    const kaydirma = g.scrollTop;
    g.innerHTML = islerHtml(s, dukkanlar, sekme);
    g.scrollTop = kaydirma;
    islerBagla(g, s, dukkanlar);
  } catch (e) { /* liste önbellekten kalır */ }
}

function dukkanAcikMi(x) {
  if (x.durum !== 'acik') return false;
  const h = new Date(simdi() + 3 * 3600000).getUTCHours();
  const [a, b] = x.saat || [8, 21];
  return (h >= a && h < b) || (b > 24 && h < b - 24);
}

function islerHtml(s, dukkanlar, sekme) {
  const biten = s.isler.filter((is) => is.aktif && is.aktif.bitis <= simdi());
  const calisan = s.isler.filter((is) => is.aktif && is.aktif.bitis > simdi());
  const bosta = s.isler.filter((is) => is.sahip && !is.aktif);
  const alinabilir = s.isler.filter((is) => !is.sahip && !is.kilitli);
  const kilitli = s.isler.filter((is) => !is.sahip && is.kilitli);
  const kasa = dukkanlar.reduce((t, x) => t + Math.max(0, Number(x.kasa) || 0), 0);
  const borclu = dukkanlar.filter((x) => Number(x.kasa) < 0);
  const rafBos = dukkanlar.filter((x) => !x.hizmet && x.bitenUrun > 0 && x.durum === 'acik');
  const ciro = dukkanlar.reduce((t, x) => t + (Number(x.bugunCiro) || 0), 0);
  const izinGunu = s.izin.var ? (s.izin.bitis - simdi()) / 86400000 : 0;

  // ---- yapılacaklar
  const yap = [];
  if (biten.length) yap.push(`<button class="yapilacak yesil" data-yap="topla"><span>💰</span><div><b>${_autoSablon`${biten.length} tezgâhta kazanç hazır`}</b><small>${_autoHtml("Tek dokunuşla hepsini topla")}</small></div><i>›</i></button>`);
  if (kasa > 0) yap.push(`<button class="yapilacak yesil" data-yap="kasa"><span>🏪</span><div><b>${_autoSablon`Dükkân kasalarında ${tl(kasa)}`}</b><small>${_autoHtml("Kasayı toplamak için dükkânına gir")}</small></div><i>›</i></button>`);
  if (borclu.length === 1) yap.push(`<button class="yapilacak kirmizi" data-yap="dukkan" data-id="${borclu[0].id}"><span>🚨</span><div><b>${_autoSablon`${esc(borclu[0].ad)} borçta (${tl(-borclu[0].kasa)})`}</b><small>${borclu[0].borcGun ? _autoSablon`Borç ${esc(String(borclu[0].borcGun))} gündür sürüyor; 7 günde dükkân kapanır` : _autoHtml('Kasa eksiye düştü; dokun, borcu kapat')}</small></div><i>›</i></button>`);
  if (borclu.length > 1) yap.push(`<button class="yapilacak kirmizi" data-yap="borclar"><span>🚨</span><div><b>${_autoSablon`${borclu.length} dükkânın kasası ekside (${tl(borclu.reduce((t, x) => t - x.kasa, 0))})`}</b><small>${esc(borclu.map((x) => x.ad).join(', '))}${_autoHtml(": hepsini tek seferde kapat")}</small></div><i>›</i></button>`);
  if (d.genel && d.genel.vergiBekleyen > 0) yap.push(`<button class="yapilacak kirmizi" data-yap="vergi"><span>🧾</span><div><b>${_autoSablon`${d.genel.vergiBekleyen} vergi beyanı ödeme bekliyor`}</b><small>${_autoHtml("Vergi Dairesi'nden öde; geciken her ay ceza işler")}</small></div><i>›</i></button>`);
  if (rafBos.length) yap.push(`<button class="yapilacak sari" data-yap="dukkan" data-id="${rafBos[0].id}"><span>📦</span><div><b>${_autoSablon`${esc(rafBos[0].ad)}: ${rafBos[0].bitenUrun} ürün tükendi`}</b><small>${_autoHtml("Rafları doldur ya da otomatik tedariki aç")}</small></div><i>›</i></button>`);
  if (bosta.length) yap.push(`<button class="yapilacak mavi" data-yap="tezgah" data-kod="${bosta[0].kod}"><span>▶️</span><div><b>${_autoSablon`${bosta.length} tezgâhın boşta`}</b><small>${esc(bosta.map((x) => x.ad).join(', '))}${_autoHtml(": çalıştır, para kazansın")}</small></div><i>›</i></button>`);
  if (!s.izin.var && s.isler.some((i) => i.sahip)) yap.push(`<button class="yapilacak sari" data-yap="izin"><span>⚠️</span><div><b>${_autoHtml("Seyyar iznin yok")}</b><small>${_autoSablon`Zabıta ceza kesebilir. İzin al: ${tl(s.izin.ucret)}`}</small></div><i>›</i></button>`);
  else if (s.izin.var && izinGunu < 1.5) yap.push(`<button class="yapilacak sari" data-yap="izin"><span>⏰</span><div><b>${_autoSablon`Seyyar iznin ${sureMetni(s.izin.bitis - simdi())} sonra bitiyor`}</b><small>${_autoSablon`Uzat: ${tl(s.izin.ucret)}`}</small></div><i>›</i></button>`);
  if (!s.isler.some((i) => i.sahip) && alinabilir.length) yap.push(`<button class="yapilacak mavi" data-yap="tezgah" data-kod="${alinabilir[0].kod}"><span>🧺</span><div><b>${_autoHtml("İlk tezgâhını al")}</b><small>${esc(alinabilir[0].ad)}: ${tl(alinabilir[0].ekipman)}</small></div><i>›</i></button>`);

  // 0.49: hapis ve kumarhane
  if (d.hapisBitis > simdi()) yap.unshift(`<button class="yapilacak kirmizi" data-yap="kumarhane"><span>⛓️</span><div><b>${_autoHtml("Hapistesin")}</b><small>${_autoSablon`${sureMetni(d.hapisBitis - simdi())} sonra çıkacaksın`}</small></div><i>›</i></button>`);
  else if (d.genel && d.genel.oyuncu && d.genel.oyuncu.seviye >= 15) yap.push(`<button class="yapilacak mor" data-yap="kumarhane"><span>🎰</span><div><b>${_autoHtml("Kumarhane")}</b><small>${_autoHtml("Yasa dışı: kazancı yüksek, yakalanma riski var")}</small></div><i>›</i></button>`);

  const ozetUst = `<div class="is-ozeti">
      <div><small>${_autoHtml("Çalışan tezgâh")}</small><b>${calisan.length}<span>/${s.isler.filter((i) => i.sahip).length}</span></b></div>
      <div><small>${_autoHtml("Açık dükkân")}</small><b>${dukkanlar.filter(dukkanAcikMi).length}<span>/${dukkanlar.length}</span></b></div>
      <div><small>${_autoHtml("Bugünkü ciro")}</small><b>${tl(ciro)}</b></div></div>`;
  const sekmeler = `<div class="sekmeler" role="tablist">
      <button role="tab" data-isler-sekme="ozet" aria-selected="${sekme === 'ozet'}">📋 ${_autoHtml("Özet")}</button>
      <button role="tab" data-isler-sekme="tezgah" aria-selected="${sekme === 'tezgah'}">🧺 ${_autoHtml("Tezgâhlar")}</button>
      <button role="tab" data-isler-sekme="dukkan" aria-selected="${sekme === 'dukkan'}">${_autoSablon`🏪 Dükkânlar${dukkanlar.length ? ` (${dukkanlar.length})` : ''}`}</button></div>`;

  const tezgahSatir = (is) => {
    const a = is.aktif;
    let sag, alt;
    if (a && a.bitis <= simdi()) { sag = `<span class="arti">💰 ${_autoHtml("Hazır")}</span><small>${_autoHtml("topla")}</small>`; alt = _autoMetin('İş bitti'); }
    else if (a) { sag = `<span class="sayi">${sureMetni(a.bitis - simdi())}</span><small>${a.calisan === 'cirak' ? _autoMetin("çırak çalışıyor") : _autoMetin("sen çalışıyorsun")}</small>`; alt = _autoMetin('Çalışıyor'); }
    else if (is.kilitli) { sag = `<span class="kilit-rozet">${_autoSablon`${is.seviye}. seviye`}</span>`; alt = esc(_ekipmanAdi(is.ekipmanAdi)); }
    else if (is.sahip) {
      const tam = is.sureler.find((x) => x.kod === 'tam');
      sag = `<span class="${tam.tahminiNet >= 0 ? 'arti' : 'eksi'}">${isaretliTl(tam.tahminiNet)}</span><small>${_autoHtml("tam gün tahmini")}</small>`; alt = _autoMetin('Boşta, çalıştır');
    } else { sag = `${tl(is.ekipman)}<small>${_autoHtml("satın al")}</small>`; alt = esc(_ekipmanAdi(is.ekipmanAdi)); }
    const c = is.mevsimCarpani * is.kiyiCarpani;
    const rozet = c >= 1.2 ? `<span class="rozetcik iyi">${_autoHtml("Şu an çok satar")}</span>` : c <= 0.7 ? `<span class="rozetcik kotu">${_autoHtml("Şu an az satar")}</span>` : '';
    return `<li><button class="tezgah-satiri ${is.kilitli ? 'kilitli' : ''}" data-is="${is.kod}">
      <span class="resim" aria-hidden="true">${is.simge}</span>
      <span class="bilgi"><span class="ad">${esc(_seyyarAdi(is.ad))}</span><br><span class="alt">${alt}</span>${rozet ? '<br>' + rozet : ''}</span>
      <span class="sag">${sag}</span></button></li>`;
  };
  const grup = (baslik, liste) => (liste.length ? `<h3 class="bolum-baslik">${baslik}</h3><ul class="tezgah-listesi">${liste.map(tezgahSatir).join('')}</ul>` : '');

  const dukkanSatir = (x) => {
    const acik = dukkanAcikMi(x);
    const durum = x.durum === 'ruhsat' ? '⏳ '+_oyunHtml('shop.permit') : acik ? '🟢 '+_oyunHtml('shop.open') : '🌙 '+_oyunHtml('shop.closedHours',{time:String(x.saat[0]).padStart(2,'0')+':00'});
    const sag = Number(x.kasa) > 0 ? `<span class="arti">${tl(x.kasa)}</span><small>${_oyunHtml("shop.inRegister")}</small>` : Number(x.kasa) < 0 ? `<span class="eksi">${tl(x.kasa)}</span><small>${_oyunHtml("shop.debtLabel")}</small>` : `<small>${_oyunHtml("shop.emptyRegister")}</small>`;
    return `<li><button class="tezgah-satiri" data-isletme="${x.id}" data-no="${x.sube ? '' : x.yerNo}" data-sokak="${x.sube ? '' : (x.sokak || 0)}">
      <span class="resim" aria-hidden="true">${x.simge}</span>
      <span class="bilgi"><span class="ad">${esc(x.ad)}</span>${x.sube ? ` <span class="rozetcik bilgi">${_oyunHtml("shop.branch")}</span>` : ''}<br>
        <span class="alt">${esc(_dukkanTuru(x.turAdi))} · ${esc(x.ilce)}${x.sube ? `, ${esc(x.il)}` : ` · ${esc(dukkanAdresi(x))}`}</span><br>
        <span class="alt">${durum} · ${_oyunHtml("shop.dailySummary", {amount:tl(x.bugunCiro),count:x.bugunMusteri})}</span></span>
      <span class="sag">${sag}</span></button></li>`;
  };

  let govde;
  if (sekme === 'tezgah') {
    govde = `${grup(_autoMetin('Çalışanlar'), [...biten, ...calisan])}${grup(_autoMetin('Boşta'), bosta)}${grup(_autoMetin('Satın alınabilir'), alinabilir)}
      ${kilitli.length ? `<details class="kilitli-grup"><summary>${_autoSablon`🔒 Seviye atladıkça açılacak ${kilitli.length} tezgâh`}</summary><ul class="tezgah-listesi">${kilitli.map(tezgahSatir).join('')}</ul></details>` : ''}
      <div class="kart kucuk">${s.izin.var ? _autoSablon`✅ Seyyar iznin var, ${sureMetni(s.izin.bitis - simdi())} geçerli.` : _autoHtml('⚠️ Seyyar iznin yok; zabıta ceza kesebilir.')} <button class="dugme mavi kucuk" data-yap="izin" style="width:auto;margin-left:6px">${s.izin.var ? _autoMetin("Uzat") : _autoMetin("İzin al")}: ${tl(s.izin.ucret)}</button></div>`;
  } else if (sekme === 'dukkan') {
    govde = `${dukkanlar.length ? `<ul class="tezgah-listesi">${dukkanlar.map(dukkanSatir).join('')}</ul>` : `<div class="kart"><p style="margin:0">${_oyunHtml("shop.noShops")}</p></div>`}
      <div class="dugme-satiri" style="margin-top:16px"><button class="dugme mavi kucuk" data-yap="kiralik">🏪 ${_oyunHtml("shop.findRental")}</button><button class="dugme kucuk" data-yap="sube">🗺️ ${_oyunHtml("shop.otherDistrict")}</button></div>
      <p class="kucuk soluk">${_oyunHtml("shop.branchHint")}</p>`;
  } else {
    govde = `${yap.length ? `<h3 class="bolum-baslik">${_autoHtml("Şimdi yapılacaklar")}</h3><div class="yapilacaklar">${yap.join('')}</div>` : `<div class="kart basari">${_autoSablon`<b>👍 ${_autoHtml("Her şey yolunda.")}</b> Tezgâhların çalışıyor, dükkânlarında acil bir iş yok.`}</div>`}
      <h3 class="bolum-baslik">${_autoHtml("Hızlı geçiş")}</h3>
      <div class="hizli-gecis">
        <button data-git-rota="uretim"><span>🏭</span><b>${_oyunHtml("ui.0bc00e76c6a1")}</b><small>${d.genel.bitenUretim ? _autoSablon`${d.genel.bitenUretim} tesiste ürün hazır` : _autoMetin("Tarım, fabrika, maden")}</small></button>
        <button data-git-rota="banka"><span>🏦</span><b>${_autoHtml("Tefon Bank")}</b><small>${_autoHtml("Mevduat, kredi, altın")}</small></button>
        <button data-git-rota="siralama"><span>🏆</span><b>${_oyunHtml("ui.544ecff7c397")}</b><small>${_autoHtml("Servet ve ligler")}</small></button>
        <button data-git-rota="belediye"><span>🏛️</span><b>${_autoHtml("Belediye")}</b><small>${_autoHtml("Ruhsat ve seçim")}</small></button>
        <button data-git-rota="plaza"><span>🏢</span><b>${_autoHtml("Plaza")}</b><small>${_autoHtml("Şirket ofisi kirala")}</small></button>
      </div>`;
  }
  return '<div data-is-arama></div>' + ozetUst + sekmeler + govde;
}

function islerBagla(g, s, dukkanlar) {
  g.querySelectorAll('[data-isler-sekme]').forEach((b) => b.addEventListener('click', () => { ses.tik(); tezgahlarPaneli(b.dataset.islerSekme); }));
  g.querySelectorAll('[data-git-rota]').forEach((b) => b.addEventListener('click', () => { ses.tik(); location.hash = '#/' + b.dataset.gitRota; }));
  const tezgahaGit = (kod) => {
    ses.tik();
    history.replaceState(null, '', '#/mahalle');
    rotaUygula();
    mahalle.odakla(kod);
    tezgahPaneli(kod);
  };
  g.querySelectorAll('[data-is]').forEach((b) => b.addEventListener('click', () => tezgahaGit(b.dataset.is)));
  // 0.56: İşlerim araması: tezgâh, dükkân ve tesis adlarında (3 harften sonra öneri)
  aramaKutusuKur(g.querySelector('[data-is-arama]'), {
    yerTutucu: _autoMetin('İş, dükkân ya da tesis ara'),
    kaynak: async () => {
      const l = [];
      for (const is of s.isler.filter((x) => x.sahip)) l.push({ ad: _seyyarAdi(is.ad), alt: _autoMetin('Tezgâh'), simge: is.simge, ara: is.kod, sec: () => tezgahaGit(is.kod) });
      for (const x of dukkanlar) l.push({ ad: x.ad, alt: `${_dukkanTuru(x.turAdi || '')} · ${x.ilce || ''}`, simge: x.simge || '🏪', ara: x.turAdi || '', sec: () => {
        ses.tik();
        const no = Number(x.sube ? 0 : x.yerNo);
        if (no) { history.replaceState(null, '', '#/mahalle'); rotaUygula(); dukkanaOdaklaSokak(no, x.sokak); }
        isletmePaneli(Number(x.id));
      } });
      try {
        const { tesisler } = await api('uretim');
        for (const t of tesisler) l.push({ ad: t.ad, alt: `${_autoMetin('Tesis')} · ${t.il || ''}`, simge: t.simge, ara: t.tur || '', sec: () => { ses.tik(); tesiseGit(t.id); } });
      } catch (e) { /* tesisler gelmezse tezgâh ve dükkânlar aranır */ }
      return l;
    },
  });
  g.querySelectorAll('[data-isletme]').forEach((b) => b.addEventListener('click', () => {
    ses.tik();
    const no = Number(b.dataset.no);
    if (no) { history.replaceState(null, '', '#/mahalle'); rotaUygula(); dukkanaOdaklaSokak(no, b.dataset.sokak); }
    isletmePaneli(Number(b.dataset.isletme));
  }));
  g.querySelectorAll('[data-yap]').forEach((b) => b.addEventListener('click', async (e) => {
    const n = b.dataset.yap;
    if (n === 'topla') { panelKapat(true); history.replaceState(null, '', '#/mahalle'); rotaUygula(); return toplaHepsi(b.getBoundingClientRect()); }
    if (n === 'tezgah') return tezgahaGit(b.dataset.kod);
    if (n === 'dukkan') { ses.tik(); return isletmePaneli(Number(b.dataset.id)); }
    if (n === 'vergi') { ses.tik(); location.hash = '#/vergi'; return; }
    if (n === 'kasa') { ses.tik(); const x = dukkanlar.find((y) => Number(y.kasa) > 0); if (x) isletmePaneli(x.id); return; }
    if (n === 'kiralik') {
      const no = mahalle.ilkKiralik();
      history.replaceState(null, '', '#/mahalle');
      rotaUygula();
      if (no) { mahalle.dukkanaOdakla(no); setTimeout(() => dukkanPaneli(no), 500); } else bildir(_autoMetin("Bu caddede boş dükkân kalmadı."), true);
      return;
    }
    if (n === 'kumarhane') { ses.tik(); location.hash = '#/kumarhane'; return; }
    if (n === 'sube') { bildir(_autoMetin("Haritada bir ilçeye dokun, o ilçede şube açabilirsin.")); location.hash = '#/harita'; return; }
    if (n === 'izin') {
      const r = await eylem(e.currentTarget, () => api('seyyar/izin', {}));
      if (r === undefined) return;
      ses.satinAl();
      await yenileHepsi();
      bakiyeSay(d.genel.oyuncu.bakiye);
      bildir(_autoMetin("Belediye izni alındı."));
      tezgahlarPaneli();
    }
  }));
}

// Sayfalı liste: ilk 25 kayıt gelir, altta "Daha fazla yükle" düğmesi
// yukle(imlec) → { liste, devam, imlec }  (imlec: sonraki sayfa için son kimlik ya da kaçıncı kayıt)
function sayfaliListe(ul, { yukle, satir, bos = _autoMetin('Henüz bir şey yok.') }) {
  let imlec = null;
  let yukleniyor = false;
  const dugme = document.createElement('button');
  dugme.type = 'button';
  dugme.className = 'dugme gri kucuk daha-fazla';
  dugme.textContent = _oyunMetni('tips.loadMore');
  dugme.hidden = true;
  ul.after(dugme);
  async function getir() {
    if (yukleniyor) return;
    yukleniyor = true;
    dugme.disabled = true;
    dugme.textContent = _autoMetin("Yükleniyor…");
    try {
      const r = await yukle(imlec);
      if (imlec === null) ul.innerHTML = r.liste.length ? '' : `<li class="soluk">${esc(bos)}</li>`;
      ul.insertAdjacentHTML('beforeend', r.liste.map(satir).join(''));
      imlec = r.imlec;
      dugme.hidden = !r.devam;
    } catch (e) { bildir(e.message, true); }
    yukleniyor = false;
    dugme.disabled = false;
    dugme.textContent = _oyunMetni('tips.loadMore');
  }
  dugme.addEventListener('click', () => { ses.tik(); getir(); });
  getir();
  return { yenile() { imlec = null; return getir(); } };
}
window.addEventListener('camiye-git', () => {
  if (!d.genel?.oyuncu) return;
  if (location.hash !== '#/mahalle') location.hash = '#/mahalle';
  else rotaUygula();
  requestAnimationFrame(() => requestAnimationFrame(() => mahalle.camiyeOdakla()));
});
// Kimlik imleçleriyle sayfa değiştirir; önceki sayfaların başlangıçları saklanır.
function sayfaGezgini(ul, { yukle, satir, bos = _autoMetin('Henüz bir şey yok.') }) {
  const imlecler = [null];
  let sayfa = 0, yukleniyor = false;
  const gezi = document.createElement('nav');
  gezi.className = 'liste-sayfalama';
  gezi.setAttribute('aria-label', _autoMetin('Liste sayfaları'));
  gezi.innerHTML = `<button type="button" class="dugme gri kucuk" data-onceki>‹ ${_autoHtml("Önceki")}</button><span aria-live="polite"></span><button type="button" class="dugme gri kucuk" data-sonraki>${_autoHtml("Sonraki ›")}</button>`;
  ul.after(gezi);
  const onceki = gezi.querySelector('[data-onceki]'), sonraki = gezi.querySelector('[data-sonraki]');
  async function getir(hedef) {
    if (yukleniyor || !ul.isConnected) return;
    yukleniyor = true;
    onceki.disabled = sonraki.disabled = true;
    try {
      const r = await yukle(imlecler[hedef]);
      if (!ul.isConnected) return;
      ul.innerHTML = r.liste.length ? r.liste.map(satir).join('') : `<li class="soluk">${esc(bos)}</li>`;
      sayfa = hedef;
      if (r.devam) imlecler[hedef + 1] = r.imlec;
      else imlecler.length = hedef + 1;
      gezi.hidden = sayfa === 0 && !r.devam;
      gezi.querySelector('span').textContent = _autoSablon`${sayfa + 1}. sayfa · 25 kayıt`;
      onceki.disabled = sayfa === 0;
      sonraki.disabled = !r.devam;
    } catch (e) { bildir(e.message, true); onceki.disabled = sayfa === 0; sonraki.disabled = !imlecler[sayfa + 1]; }
    finally { yukleniyor = false; }
  }
  onceki.addEventListener('click', () => { ses.tik(); getir(sayfa - 1); });
  sonraki.addEventListener('click', () => { ses.tik(); getir(sayfa + 1); });
  getir(0);
}
const tarihMetni = (ms) => new Date(ms).toLocaleString(sayiDili(), { dateStyle: 'short', timeStyle: 'short' });

// 0.49.0: sıra kartındaki madalya (kurdele + tırtıklı kenarlı madalyon). 1–3 altın, gümüş, bronz; diğerleri çelik mavisi.
let madalyaNo = 0;
function siraMadalyasi(sira) {
  const id = 'md' + (++madalyaNo);
  const R = { 1: ['#FFF1B0', '#FFC42E', '#B27A00', '#7A4E00'], 2: ['#FFFFFF', '#C9D2DE', '#7F8B9C', '#3E4A5C'], 3: ['#FBD9B5', '#D98A4A', '#8E4B1C', '#5A2C0C'] }[sira]
    || (sira ? ['#D6E4FA', '#7FA3DA', '#3A5F9C', '#13274D'] : ['#E9ECF1', '#B5BDC9', '#7C8697', '#3E4656']);
  const [acik, orta, koyu, yazi] = R;
  const metin = sira ? sayiTr(sira) : '—';
  const boy = metin.length >= 4 ? 14 : metin.length === 3 ? 17 : 22;
  // tırtıklı kenar: 24 dişli yıldız
  const dis = [];
  for (let i = 0; i < 48; i++) { const a = (i * Math.PI) / 24, r = i % 2 ? 26 : 28.5; dis.push(`${(40 + r * Math.sin(a)).toFixed(1)},${(60 - r * Math.cos(a)).toFixed(1)}`); }
  return `<svg class="sk-madalya" viewBox="0 0 80 92" width="88" height="101" role="img" aria-label="${esc(_autoSablon`${metin}. sıra`)}">
    <defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${acik}"/><stop offset=".55" stop-color="${orta}"/><stop offset="1" stop-color="${koyu}"/></linearGradient>
      <linearGradient id="${id}i" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${acik}"/><stop offset=".6" stop-color="${orta}"/><stop offset="1" stop-color="${koyu}"/></linearGradient></defs>
    <path d="M18 0h15l12 34H30z" fill="#C8102E"/><path d="M23 0h5l12 34h-5z" fill="#fff" opacity=".85"/>
    <path d="M62 0H47L35 34h15z" fill="#A50D26"/><path d="M57 0h-5L40 34h5z" fill="#fff" opacity=".7"/>
    <rect x="27" y="30" width="26" height="8" rx="3" fill="${koyu}"/>
    <polygon points="${dis.join(' ')}" fill="url(#${id}g)" stroke="${koyu}" stroke-width="1"/>
    <circle cx="40" cy="60" r="20.5" fill="url(#${id}i)" stroke="${koyu}" stroke-opacity=".55" stroke-width="1.4"/>
    <path d="M24 55a17 17 0 0 1 22-12" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>
    <text x="40" y="${60 + boy * 0.36}" text-anchor="middle" font-size="${boy}" font-weight="800" fill="${yazi}" font-family="inherit">${metin}</text>
  </svg>`;
}
let siralamaTuru = 'servet';
let siralamaKapsam = 'turkiye';
let siralamaDonem = 'gun';
let siralamaIstek = 0; // 0.47: gün / hafta / ay / yıl / tüm zamanlar
async function siralamaPaneli() {
  const p = panelAc({ ikon: '🏆', baslik: _oyunMetni("ui.544ecff7c397"), rota: 'siralama', govde: `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>` });
  const sekmeHtml = `<div class="sekmeler" role="tablist">
      <button role="tab" data-tur="servet" aria-selected="${siralamaTuru === 'servet'}">💎 ${_autoHtml("Servet")}</button>
      <button role="tab" data-tur="nakit" aria-selected="${siralamaTuru === 'nakit'}">${_autoHtml("💵 Nakit")}</button>
      <button role="tab" data-tur="lig" aria-selected="${siralamaTuru === 'lig'}">🏅 ${_autoHtml("Ligler")}</button></div>`;
  const bagla = () => p.querySelectorAll('[data-tur]').forEach((b) => b.addEventListener('click', () => { siralamaTuru = b.dataset.tur; ses.tik(); siralamaPaneli(); }));
  try {
    if (siralamaTuru === 'lig') {
      const istekL = ++siralamaIstek;
      const l = await api('ligler');
      if (aktifRota() !== 'siralama' || istekL !== siralamaIstek) return;
      const bitis = Math.max(0, l.bitis - simdi());
      p.querySelector('.panel-govde').innerHTML = `${sekmeHtml}
        <div class="kart"><p style="margin:0">${_autoSablon`${_autoHtml("Hafta")} <b>${sureMetni(bitis)}</b> sonra bitiyor. Her ligin ilk üçü <b>${tl(l.oduller[0])}</b>, <b>${tl(l.oduller[1])}</b> ve <b>${tl(l.oduller[2])}</b> ödül alır; birinciye sertifika.`}</p></div>
        ${l.ligler.map((g) => `<div class="kart lig-karti"><h3>${g.simge} ${esc(g.ad)}</h3><p class="kucuk soluk" style="margin:-4px 0 8px">${esc(g.aciklama)}</p>
          ${g.liste.length ? `<ol class="satirlar">${g.liste.slice(0, 10).map((x, i) => `<li class="${x.id === d.genel.oyuncu.id ? 'ben' : ''}"><span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="madalya ${i < 3 ? 'm' + (i + 1) : ''}">${i + 1}</span>${avatarHtml(x.foto, x.kullaniciAdi, 30)}<span><b><span class="siralama-durum ${x.cevrimici ? 'cevrimici' : 'cevrimdisi'}" role="img" aria-label="${x.cevrimici ? _autoHtml('Çevrimiçi') : _autoHtml('Çevrimdışı')}" title="${x.cevrimici ? _autoHtml('Çevrimiçi') : _autoHtml('Çevrimdışı')}"></span>${esc(x.kullaniciAdi)}</b><br><span class="kucuk soluk">${esc(x.il)}</span></span></span><span class="sag">${tl(x.puan)}</span></li>`).join('')}</ol>`
            : `<p class="kucuk soluk" style="margin:0">${_autoHtml("Bu hafta henüz puan alan yok. İlk sen ol!")}</p>`}
          <p class="kucuk" style="margin:8px 0 0">${g.benimSiram ? `${_autoSablon`Sen <b>${g.benimSiram}.</b> sıradasın (${tl(g.benimPuan)}).`}` : _autoHtml('Bu ligde henüz puanın yok.')}</p></div>`).join('')}
        ${l.gecenHafta.length ? `<div class="kart"><h3>${_autoHtml("Geçen haftanın kazananları")}</h3><ul class="satirlar">${l.gecenHafta.map((x) => `<li><span>${x.sira}. ${esc(x.kullaniciAdi)} <span class="kucuk soluk">${esc(({ ciftci: _autoMetin('Çiftçi'), sanayici: 'Sanayici', tuccar: _autoMetin('Tüccar') })[x.lig] || x.lig)}</span></span><span class="sag arti">+${tl(x.odul)}</span></li>`).join('')}</ul></div>` : ''}`;
      bagla();
      return;
    }
    // 0.47: dönem sekmeleri (gün, hafta, ay, yıl: dönemdeki kazanç; tüm zamanlar: servet) yalnızca servet sıralamasında
    const donem = siralamaTuru === 'servet' && siralamaDonem !== 'tum' ? siralamaDonem : '';
    const q = `?tur=${siralamaTuru}&kapsam=${siralamaKapsam}${donem ? '&donem=' + donem : ''}`;
    const istek = ++siralamaIstek;
    const s = await api('siralama' + q);
    // 0.49.0: sekmeler hızlı değiştirilince geç gelen eski yanıt yeni sekmenin üstüne çizilmesin
    if (aktifRota() !== 'siralama' || istek !== siralamaIstek) return;
    const kapsamAdi = siralamaKapsam === 'il' ? s.yer.il : siralamaKapsam === 'ilce' ? s.yer.ilce : _autoMetin('Türkiye');
    const DONEMLER = [['gun', _autoMetin('Gün')], ['hafta', _autoMetin('Hafta')], ['ay', _autoMetin('Ay')], ['yil', _autoMetin('Yıl')], ['tum', _autoMetin('Tüm Zamanlar')]];
    const DONEM_BASLIK = { gun: _autoMetin('Günün ilk 10\'u'), hafta: _autoMetin('Haftanın ilk 10\'u'), ay: _autoMetin('Ayın ilk 10\'u'), yil: _autoMetin('Yılın ilk 10\'u') };
    const donemSekme = siralamaTuru === 'servet' ? `<div class="donem-sekme" role="tablist" aria-label="${_autoHtml('Dönem')}">${DONEMLER.map(([k, a]) => `<button role="tab" data-donem="${k}" aria-selected="${siralamaDonem === k}">${esc(a)}</button>`).join('')}</div>` : '';
    const TATIL_AD = { maldivler: _autoMetin('🏝️ Maldivler, 7 gece'), yurtdisi: _autoMetin('🌍 Dilediği yurt dışı, 7 gece'), yurtici: _autoMetin('🇹🇷 Dilediği yurt içi, 7 gece') };
    const odulKarti = donem ? `<div class="kart donem-odul">
        <div class="do-ust"><b>🏆 ${esc(DONEM_BASLIK[donem])}</b><span class="do-kalan">⏳ <b data-donem-kalan>${sureMetni(Math.max(0, s.bitis - simdi()))}</b></span></div>
        <p class="kucuk soluk" style="margin:2px 0 8px">${_autoSablon`Dönem bitince Türkiye sıralamasının ilk 10'u toplam <b>${tl(s.oduller.reduce((x, y) => x + y, 0))}</b> paylaşır.`}${siralamaKapsam !== 'turkiye' ? ' ' + _autoHtml('(Ödüller Türkiye sıralamasına göre verilir.)') : ''}</p>
        <ol class="do-oduller">${s.oduller.map((o, i) => `<li class="${i < 3 ? 'm' + (i + 1) : ''}"><span>${i + 1}.</span><b>${tl(o)}</b>${s.tatil && s.tatil[i] ? '<small>+ 🧳</small>' : ''}</li>`).join('')}</ol>
        ${s.tatil ? `<p class="do-tatil">🧳 ${s.tatil.map((k, i) => `<b>${i + 1}.</b> ${esc(TATIL_AD[k] || '')}`).join(' · ')}</p>` : ''}
        ${s.gecen && s.gecen.liste.length ? `<details class="do-gecen"><summary>${_autoHtml('Geçen dönemin kazananları')}</summary><ul class="satirlar">${s.gecen.liste.map((x) => `<li class="${x.id === s.benimId ? 'ben' : ''}"><span>${x.sira}. ${esc(x.kullaniciAdi)}</span><span class="sag arti">+${tl(x.odul)}</span></li>`).join('')}</ul></details>` : ''}
      </div>` : '';
    // 0.49.0: sıra kartı: madalya, kazanç (ya da servet) ve ilk 10 durumu
    const benimSira = donem ? s.benimSiram : s.benimSiram;
    const benimTutar = donem ? s.benimKazanc : siralamaTuru === 'nakit' ? (d.genel.oyuncu.bakiye || 0) : s.benimServet;
    let durumSatiri = '';
    if (donem) {
      const odulum = s.trSiram && s.trSiram <= 10 ? s.oduller[s.trSiram - 1] : 0;
      if (odulum) durumSatiri = `<div class="sk-durum basari">🏆 ${_autoSablon`Şu an Türkiye'de ${s.trSiram}. sıradasın. Dönem böyle biterse <b>${tl(odulum)}</b> kazanırsın!`}</div>`;
      else if (!s.benimKazanc) durumSatiri = `<div class="sk-durum">💡 ${_autoHtml("Bu dönem henüz kazancın yok. Tezgâhta bir iş bitir, listeye gir!")}</div>`;
      else {
        const eksik = Math.max(100, s.ilk10Esik - s.benimKazanc + 100);
        const oran = Math.max(4, Math.min(100, (100 * s.benimKazanc) / Math.max(1, s.ilk10Esik)));
        durumSatiri = `<div class="sk-durum"><span>🎯 ${_autoSablon`İlk 10'a girmek için <b>${tl(eksik)}</b> daha kazan.`}</span><i class="sk-cubuk"><i style="width:${oran}%"></i></i></div>`;
      }
    }
    const ozet = `<div class="kart sira-kart${donem ? ' donemli' : ''}">
        <div class="sk-ust">${siraMadalyasi(benimSira)}
          <span class="sk-bilgi"><small>${_autoSablon`${esc(kapsamAdi)} sıran`} · ${_autoSablon`${s.toplamOyuncu} oyuncu`}</small>
            <b>${tl(benimTutar)}</b><small>${donem ? _autoHtml("Bu dönemki kazancın") : siralamaTuru === 'nakit' ? _autoHtml("Nakdin") : _autoHtml("Servetin")}</small></span></div>
        ${durumSatiri}${siralamaTuru === 'servet' ? `<details class="servet-dokum" data-servet-dokum><summary>🔎 ${_autoHtml("Servetinin dökümü")}</summary><div data-servet-kalemler><p class="kucuk soluk">${_autoHtml("Yükleniyor…")}</p></div></details>` : ''}</div>`;
    p.querySelector('.panel-govde').innerHTML = `${sekmeHtml}
      <div class="cipler kapsam-cip">${[['turkiye', _autoMetin('🇹🇷 Türkiye')], ['il', `🏙️ ${esc(s.yer.il)}`], ['ilce', `🏘️ ${esc(s.yer.ilce)}`]].map(([k, a]) => `<button class="cip ${siralamaKapsam === k ? 'secili' : ''}" data-kapsam="${k}">${a}</button>`).join('')}</div>
      ${donemSekme}
      ${ozet}
      <div class="kart"><ol class="satirlar" id="siralama-liste"></ol>${s.toplamOyuncu > 1000 ? `<p class="kucuk soluk" style="margin:8px 0 0;text-align:center">${_autoHtml('Listede ilk 1000 oyuncu gösterilir; senin sıran her zaman yukarıda yazar.')}</p>` : ''}</div>
      ${odulKarti}
      <p class="kucuk soluk">${donem
        ? _autoHtml("Kazanç = tezgâh satışları ve servisleri, dükkân kasası, pazar ve tedarik satışları, tesis ve hizmet gelirleri, elektrik satışı, ihale ödemeleri, kira, reklam ve temettü gelirleri. Mülk, hisse ya da tesis satışı, iadeler ve ödüller sayılmaz. Gün, hafta (pazartesi), ay ve yıl Türkiye saatiyle başlar. Liste birkaç dakikada bir yenilenir.")
        : _autoHtml("Servet = nakit + banka (vadesiz ve vadeli) + döviz, altın, hisse ve varlıklar + tesislerin, dükkânların (kasa, depozito ve raftaki stok dahil) ve tezgâh ekipmanlarının değeri + ambardaki ve pazardaki mal − kredi, kredi kartı, icra ve vergi borçları. Listede görünen servetler en çok 10 dakika öncesine aittir.")}</p>`;
    bagla();
    // 0.57.9: servet dökümü: hangi kalemin ne kadar tuttuğu (açılınca sunucudan alınır)
    const dokum = p.querySelector('[data-servet-dokum]');
    if (dokum) dokum.addEventListener('toggle', async () => {
      if (!dokum.open || dokum.dataset.yuklendi) return;
      dokum.dataset.yuklendi = '1';
      const kutu = dokum.querySelector('[data-servet-kalemler]');
      try {
        const r = await api('servet');
        const AD = { nakit: _autoMetin('Nakit'), banka: _autoMetin('Banka hesapları'), kredi: _autoMetin('Banka kredileri'), doviz: _autoMetin('Döviz, altın ve gümüş'), borsa: _autoMetin('Borsa'),
          arsa: _autoMetin('Arsa ve tarlalar'), ev: _autoMetin('Evler'), araba: _autoMetin('Arabalar'), yat: _autoMetin('Yatlar'), tesis: _autoMetin('Tesisler'), dukkan: _autoMetin('Dükkânlar'),
          ambar: _autoMetin('Ambar ve mal'), tezgah: _autoMetin('Tezgâh'), tekne: _autoMetin('Balıkçı tekneleri'), sirket: _autoMetin('Sigorta şirketi ve reklam ajansı'), emanet: _autoMetin('Emanetteki para'), borc: _autoMetin('Borçlar') };
        const l = r.kalemler.filter((x) => x.tutar);
        kutu.innerHTML = `<ul class="satirlar servet-kalemler">${l.map((x) => `<li><span>${x.simge} ${esc(AD[x.kod] || x.ad)}</span><span class="sag${x.tutar < 0 ? ' eksi' : ''}">${tl(x.tutar)}</span></li>`).join('')}
          <li class="servet-toplam"><span><b>${_autoHtml("Toplam servet")}</b></span><span class="sag"><b>${tl(r.toplam)}</b></span></li></ul>
          <p class="kucuk soluk">${_autoHtml("Araba, yat, ev ve arsa bugünkü değeriyle; tesisler kurulumun %60'ı, dükkânlar kurulumun yarısı, mallar toptan alış fiyatıyla sayılır. Bir şey satın aldığında nakit o varlığa dönüşür: servetin yalnızca vergi, harç ve komisyon kadar azalır.")}</p>`;
      } catch (e) { delete dokum.dataset.yuklendi; kutu.innerHTML = `<p class="kucuk soluk">${esc(e.message)}</p>`; }
    });
    p.querySelectorAll('[data-kapsam]').forEach((b) => b.addEventListener('click', () => { siralamaKapsam = b.dataset.kapsam; ses.tik(); siralamaPaneli(); }));
    p.querySelectorAll('[data-donem]').forEach((b) => b.addEventListener('click', () => { if (siralamaDonem === b.dataset.donem) return; siralamaDonem = b.dataset.donem; ses.tik(); siralamaPaneli(); }));
    clearInterval(d.panelZamanlayici);
    if (donem) d.panelZamanlayici = setInterval(() => {
      const k = p.querySelector('[data-donem-kalan]');
      if (!k) return;
      const kalan = s.bitis - simdi();
      if (kalan <= 0) { clearInterval(d.panelZamanlayici); siralamaPaneli(); return; }
      k.textContent = sureMetni(kalan);
    }, 1000);
    let ilk = s;
    // 0.41: satıra dokununca oyuncunun profili açılır
    p.querySelector('#siralama-liste').addEventListener('click', (e) => { const li = e.target.closest('[data-profil-ac]'); if (li) { ses.tik(); oyuncuKarti(Number(li.dataset.profilAc)); } });
    sayfaGezgini(p.querySelector('#siralama-liste'), {
      bos: donem ? _autoMetin('Bu dönemde henüz kazanç yok. İlk sen ol!') : undefined,
      async yukle(bas) {
        const r = ilk || (await api('siralama?bas=' + (bas || 0) + `&tur=${siralamaTuru}&kapsam=${siralamaKapsam}${donem ? '&donem=' + donem : ''}`));
        ilk = null;
        const b = bas || 0;
        return { liste: r.liste.map((x, i) => ({ ...x, sira: b + i + 1 })), devam: r.devam, imlec: b + r.liste.length };
      },
      satir: (x) => `<li class="${x.id === s.benimId ? 'ben' : ''} tiklanir" data-profil-ac="${x.id}" role="button" tabindex="0">
          <span style="display:flex;align-items:center;min-width:0;gap:8px;flex:1"><span class="madalya ${x.sira <= 3 ? 'm' + x.sira : ''}">${x.sira}</span>
            ${avatarHtml(x.foto, x.kullaniciAdi, 34, '', x.gr)}
            <span style="min-width:0"><b><span class="siralama-durum ${x.cevrimici ? 'cevrimici' : 'cevrimdisi'}" role="img" aria-label="${x.cevrimici ? _autoHtml('Çevrimiçi') : _autoHtml('Çevrimdışı')}" title="${x.cevrimici ? _autoHtml('Çevrimiçi') : _autoHtml('Çevrimdışı')}"></span>${isimHtml(x.kullaniciAdi, x.gr)}</b> <span class="kucuk soluk">${_autoSablon`· ${x.seviye}. sv`}</span><br><span class="kucuk soluk">${x.sirket ? `🏛️ ${esc(x.sirket)} · ` : ''}${esc(x.il)}</span></span></span>
          <span class="sag">${donem
            ? `${tl(x.kazanc)}${siralamaKapsam === 'turkiye' && x.sira <= 10 && s.oduller[x.sira - 1] ? `<br><small class="do-rozet">🏆 ${tl(s.oduller[x.sira - 1])}</small>` : ''}`
            : `${tl(siralamaTuru === 'nakit' ? x.bakiye : x.servet)}${siralamaTuru === 'servet' ? `<br><small class="soluk">${_autoSablon`nakit ${tl(x.bakiye)}`}</small>` : ''}`}</span></li>`,
    });
  } catch (e) { bildir(e.message, true); }
}

async function hesapPaneli(sekme = d.hesapSekmesi || 'profil') {
  d.hesapSekmesi = sekme;
  const o = d.genel.oyuncu;
  const gizle = (k) => (sekme === k ? '' : 'hidden');
  const adSerbest = !o.kullaniciAdiYeniden || o.kullaniciAdiYeniden <= simdi();
  const p = panelAc({
    ikon: '👤', baslik: t('nav.hesap'), rota: 'hesap', alt: `${esc(o.kullaniciAdi)} · ${o.mahalle ? esc(o.mahalle.ad) + ', ' : ''}${esc(o.ilce.ad)}`,
    govde: `<div data-menu-arama></div>
      <section class="hesap-kimlik" aria-label="${esc(t('nav.hesap'))}">
        <div class="hk-ust">
          <button class="profil-foto" data-eylem="foto" aria-label="${esc(t('account.photo'))}">${avatarHtml(o.foto, o.kullaniciAdi, 68)}<i aria-hidden="true">📷</i></button>
          <div class="hk-kim">
            <div class="profil-baslik"><b class="profil-ad">${esc(o.kullaniciAdi)}</b>${d.genel.esnaf ? `<span class="hk-esnaf" title="${esc(_autoMetin('Esnaf Kartı'))}">🎫 ${_autoHtml("Esnaf")}</span>` : ''}<a class="profil-yonetim" href="yonetici" data-yonetim-link hidden>${esc(t('account.admin'))}</a></div>
            <div class="hk-yer">${esc(t('account.level',{level:o.seviye}))} · ${o.mahalle ? esc(o.mahalle.ad) + ', ' : ''}${esc(o.ilce.ad)}, ${esc(o.il.ad)}</div>
            <div class="hk-alt"><span class="hk-vkn" title="${esc(o.vergiDairesi ? _autoSablon`${(o.ilce && o.ilce.ad) || ''} Vergi Dairesi` : '')}">VKN <b>${esc(o.vergiNo || '')}</b></span><button class="hk-bag" data-eylem="mahalle-degis">${esc(t(o.mahalle?'account.changeNeighborhood':'account.chooseNeighborhood'))} ›</button></div>
          </div>
        </div>
        <div class="hk-rakam">
          <div><small>${_autoHtml("Bakiye")}</small><b>${tl(o.bakiye)}</b></div>
          <div><small>${_autoHtml("Tecrübe")}</small><b>${_autoSablon`${sayiTr(o.tecrube)} TP`}</b></div>
          ${d.genel.yasam ? `<button data-git-yasam><small>${_autoHtml("Keyif")}</small><b>${d.genel.yasam.simge} ${d.genel.yasam.keyif}</b></button>` : `<div><small>${_autoHtml("Seviye")}</small><b>${o.seviye}</b></div>`}
        </div>
        <nav class="hk-menu">
          <button data-profilim><i>👤</i><span>${_autoHtml("Profilim")}</span></button>
          <button data-git-arkadas><i>👥</i><span>${_autoHtml("Arkadaşlar")}</span>${sekmeSayaci(Number(d.genel.arkadasIstek) || 0)}</button>
          <button data-git-oyun><i>🎮</i><span>${_autoHtml("Oyun Köşesi")}</span>${d.genel.miniOyun && d.genel.miniOyun.durum === 'acik' && d.genel.miniOyun.bitis > simdi() ? '<em class="hk-nokta" aria-hidden="true"></em>' : ''}</button>
          <button data-git-esnaf><i>🎫</i><span>${_autoHtml("Esnaf Kartı")}</span></button>
          <button data-git-banka="not"><i>📊</i><span>${esc(t('account.credit'))}</span></button>
          <button data-git-kupon><i>🎟️</i><span>${esc(t('account.coupon'))}</span></button>
        </nav>
      </section>
      <div class="sekmeler" role="tablist">
        <button role="tab" data-hesap-sekme="profil" aria-selected="${sekme === 'profil'}">⭐ ${esc(t('account.progress'))}</button>
        <button role="tab" data-hesap-sekme="ayarlar" aria-selected="${sekme === 'ayarlar'}">⚙️ ${esc(t('account.settings'))}</button>
        <button role="tab" data-hesap-sekme="guvenlik" aria-selected="${sekme === 'guvenlik'}">🔐 ${esc(t('account.security'))}</button>
        <button role="tab" data-hesap-sekme="destek" aria-selected="${sekme === 'destek'}">💬 ${esc(t('account.support'))}</button>
      </div>

      <div data-bolum="profil" ${gizle('profil')}>
      <div class="kart tecrube-karti">
        <div class="tecrube-ust"><span class="seviye-buyuk">${o.seviye}</span><div style="flex:1;min-width:0">
          <b>${_autoSablon`${sayiTr(o.tecrube)} tecrübe puanı (TP)`}</b>
          <div class="kucuk soluk">${o.seviye >= 99 ? _autoHtml('En üst seviyedesin!') : _autoSablon`${sayiTr(o.seviyeUst)} TP'de ${o.seviye + 1}. seviye · ${sayiTr(o.seviyeUst - o.tecrube)} TP kaldı`}</div></div></div>
        <div class="cubuk"><div style="width:${o.seviye >= 99 ? 100 : Math.max(2, Math.min(100, (100 * (o.tecrube - o.seviyeAlt)) / Math.max(1, o.seviyeUst - o.seviyeAlt)))}%"></div></div>
        <p class="kucuk soluk" style="margin:0 0 10px">${_autoMetin("TP; tezgâhta çalışarak, tesislerinden ürün toplayarak ve mahallede yardım ederek kazanılır. Her seviye yeni işler ve <b>1 yetenek puanı</b> açar. Oyun 99 seviyedir; sektörler (tarım, fabrika, maden…) 15. seviyeden başlayıp 50. seviyeye kadar açılır.")}</p>
        <button class="dugme mavi kucuk" data-git="yetenekler">${_autoHtml("🎯 Yetenekler")}${o.yetenekBos ? ` ${_autoSablon`· <b>${o.yetenekBos} puan bekliyor</b>`}` : ''}</button>
      </div>
      <div class="hizli-gecis">
        <button data-git="sertifika"><span>🏆</span><b>${esc(t('account.certificates'))}</b><small>${_autoHtml("Başarılarını paylaş")}</small></button>
        <button data-git="siralama"><span>📊</span><b>${esc(t('account.ranking'))}</b><small>${_autoHtml("Servet, il, ilçe, lig")}</small></button>
        <button data-git="davet"><span>🎉</span><b>${esc(t('account.referral'))}</b><small>${tutarEndeksle(_autoHtml("Her davet 10.000 ₺"))}</small></button>
        <button data-git="belediye"><span>🏛️</span><b>${esc(t('account.municipality'))}</b><small>${_autoHtml("Ruhsat ve seçim")}</small></button>
      </div>
      </div>

      <div data-bolum="ayarlar" ${gizle('ayarlar')}>
      <div class="kart"><h3>🌐 ${esc(t('auth.language'))}</h3>${dilSeciciHtml()}</div>
      <div class="kart"><h3>👤 ${esc(t('settings.username'))}</h3>
        <p class="kucuk soluk">${esc(t('settings.usernameHelp'))}</p>
        ${adSerbest ? `<form id="kullanici-adi-formu"><label class="alan"><span>${esc(t('settings.newUsername'))}</span>
          <input name="kullaniciAdi" autocomplete="off" autocapitalize="off" spellcheck="false" required minlength="3" maxlength="20" pattern="[A-Za-z0-9_çğıöşüÇĞİÖŞÜ]{3,20}" value="${esc(o.kullaniciAdi)}"></label>
          <button class="dugme mavi kucuk" type="submit">${esc(t('settings.rename'))}</button></form>` : `<p class="kucuk">${esc(t('settings.currentName',{name:o.kullaniciAdi}))}<br>${esc(t('settings.renameDate',{date:new Date(o.kullaniciAdiYeniden).toLocaleString(aktifDil(), { timeZone:'Europe/Istanbul',dateStyle:'long',timeStyle:'short' })}))}</p>`}
      </div>
      <div class="kart" id="bildirim-kart"><h3>📱 ${esc(t('settings.push'))}</h3>
        <p class="kucuk soluk" id="bildirim-yazi" style="margin:0 0 10px">${esc(t('common.checking'))}</p>
        <div class="bilgi-izgara" id="bildirim-dugmeler"></div></div>
      <div class="kart"><h3>🎨 ${esc(t('settings.graphics'))}</h3>
        <p class="kucuk soluk">${esc(t('settings.graphicsHelp'))}</p>
        <div class="sekmeler" role="group" aria-label="${esc(t('settings.graphics'))}">
          ${[['otomatik', t('settings.automatic')], ...Object.keys(KALITELER).map(k=>[k,t('settings.'+k)])]
            .map(([k, ad]) => `<button data-kalite="${k}" aria-selected="${kaliteTercihi() === k}">${esc(ad)}</button>`).join('')}
        </div></div>
      <div class="kart"><h3>⚡ ${esc(t('settings.fps'))}</h3>
        <p class="kucuk soluk" style="margin:0 0 8px">${esc(t('settings.fpsHelp'))}</p>
        <div class="sekmeler" role="group" aria-label="${esc(t('settings.fps'))}">
          ${[[30,t('settings.fps30')],[60,t('settings.fps60')]].map(([fps, ad]) => `<button type="button" data-fps="${fps}" aria-pressed="${sahne.fpsDegeri() === fps}" aria-selected="${sahne.fpsDegeri() === fps}">${esc(ad)}</button>`).join('')}
        </div></div>
      <div class="kart"><h3>🔋 ${esc(t('settings.battery'))}</h3>
        <p class="kucuk soluk" style="margin:0 0 8px">${esc(t('settings.batteryHelp'))}</p>
        <div class="sekmeler" role="group" aria-label="${esc(t('settings.battery'))}">
          ${[['otomatik',t('settings.automatic')],['acik',t('settings.batteryOn')],['kapali',t('settings.off')]].map(([k, ad]) => `<button type="button" data-pil="${k}" aria-pressed="${sahne.pilTercihi() === k}" aria-selected="${sahne.pilTercihi() === k}">${esc(ad)}</button>`).join('')}
        </div><p class="kucuk soluk" data-pil-durum style="margin:8px 0 0">${esc(pilDurumYazisi())}</p></div>
      <div class="kart"><h3>🔊 ${esc(t('settings.audio'))}</h3><p class="kucuk soluk" style="margin:0 0 8px">${esc(t('settings.audioHelp'))}</p>
        ${(() => { const a = ses.sesAyarlari(); return SES_KANALLARI.map(([k, i, ad]) => `<label class="alan ses-alan"><span>${i} ${esc(t('settings.'+k))}: <b data-hs-yuzde="${k}">${a.kapali[k] ? esc(t('settings.off')) : '%' + Math.round(a[k] * 100)}</b></span>
          <input type="range" min="0" max="100" step="5" value="${a.kapali[k] ? 0 : Math.round(a[k] * 100)}" data-hs="${k}"></label>`).join(''); })()}
        <button class="dugme gri kucuk" data-eylem="ses">${ses.sesAcikMi() ? '🔇 '+esc(t('settings.mute')) : '🔊 '+esc(t('settings.unmute'))}</button></div>
      ${isletmeBildirimKarti()}
      ${cagriKarti()}
      </div>

      <div data-bolum="guvenlik" ${gizle('guvenlik')}>
      <div class="kart"><h3>${_autoHtml("🔐 Hesap güvenliği")}</h3>
        <p class="kucuk soluk" style="margin:0 0 10px">${o.eposta ? `${_autoSablon`E-posta: <b>${esc(o.eposta)}</b>. Şifreni unutursan yenileme bağlantısı buraya gelir.`}` : _autoHtml('Hesabına e-posta eklersen şifreni unuttuğunda yenileyebilirsin.')}</p>
        <div class="bilgi-izgara">
          <button class="dugme gri kucuk" data-eylem="eposta">📧 ${o.eposta ? _autoHtml('E-postayı değiştir') : _autoHtml('E-posta ekle')}</button>
          <button class="dugme gri kucuk" data-eylem="sifre" style="margin-top:0">🔑 ${o.sifreVar ? _autoHtml('Şifre değiştir') : _autoHtml('Şifre belirle')}</button>
        </div>
        <form class="gizli-form" id="guvenlik-formu" hidden></form>
        <div id="sosyal-baglantilar"></div></div>
      <div class="kart foto-kart"><h3>${_autoHtml("🖼️ Profil fotoğrafı")}</h3>
        <div class="foto-alan">
          <button class="foto-onizleme" data-eylem="foto" aria-label="${_autoHtml("Fotoğraf seç")}">${avatarHtml(o.foto, o.kullaniciAdi, 96)}<span class="foto-kamera" aria-hidden="true">📷</span></button>
          <div class="foto-bilgi">
            <b>${o.foto ? _autoHtml('Fotoğrafın mahallede görünüyor') : _autoHtml('Henüz fotoğrafın yok')}</b>
            <p class="kucuk soluk">${_autoHtml("Sıralamada, sohbette ve sertifikalarında bu fotoğraf kullanılır. JPG veya PNG seç; kare olarak kırpılır.")}</p>
            <div class="dugme-satiri">
              <button class="dugme mavi kucuk" data-eylem="foto">📤 ${o.foto ? _autoHtml('Değiştir') : _autoHtml('Fotoğraf yükle')}</button>
              ${o.foto ? `<button class="dugme gri kucuk" data-eylem="foto-sil">${_autoHtml("🗑️ Kaldır")}</button>` : ''}
            </div>
          </div>
        </div></div>
      </div>

      <div data-bolum="destek" ${gizle('destek')}>
      <div class="hizli-gecis">
        <button data-git="bildirimler"><span>💳</span><b>${esc(t('account.transactions'))}</b><small>${_autoHtml("Tüm gelir ve giderler")}</small></button>
        <button data-git="iletisim"><span>✉️</span><b>${esc(t('auth.write'))}</b><small>${_autoHtml("Soru, öneri, hata")}</small></button>
        <button data-eylem="tanitim"><span>🎬</span><b>${esc(t('account.intro'))}</b><small>${_autoHtml("Yeniden izle")}</small></button>
        <button data-git="gorevler"><span>🎯</span><b>${esc(t('hud.tasks'))}</b><small>${_autoHtml("Ödüllü işler")}</small></button>
        <button data-git="anket"><span>📊</span><b>${_autoHtml("Anketler")}</b><small>${_autoHtml("Fikrini söyle")}</small></button>
        <button data-git="magaza"><span>🛍️</span><b>${_autoHtml("Mağaza")}</b><small>${_autoHtml("Çerçeve, isim rengi, araç süsleri")}</small></button>
      </div>
      </div>
      <div class="hizli-gecis hesap-ekip">
        <button data-git="gelistirici"><span>🛠️</span><b>${d.genel.ekipUyesi ? _autoHtml('Katkıda Bulun') : esc(t('account.join'))}</b><small>${_autoHtml("Kod, hata ve fikir")}</small></button>
        <button data-git="jenerik"><span>🎞️</span><b>${esc(t('account.credits'))}</b><small>${_autoHtml("Oyuna emek verenler")}</small></button>
        <button data-git="gelistiriciler"><span>👩‍💻</span><b>${_autoHtml("Geliştiriciler")}</b><small>${_autoHtml("Oyunu geliştiren ekip")}</small></button>
        <button data-git="yenilikler"><span>📰</span><b>${_autoHtml("Yenilikler")}</b><small>${_autoHtml("Güncellemeler ve planlananlar")}</small></button>
      </div>
      <button class="dugme kirmizi" data-eylem="cikis" style="margin-top:16px">🚪 ${esc(t('account.logout'))}</button>`,
    hazir(g) {
      menuAramasiKur(g.querySelector('[data-menu-arama]'), { ses, devletMenusu });
      // Yetkiyi mevcut yönetim API'si belirler; iki adımlı giriş panelde devam eder.
      api('yonetim/durum').then(y => {
        const link = g.querySelector('[data-yonetim-link]');
        if (g.isConnected && link && y?.yonetici === true) link.hidden = false;
      }).catch(() => {});
      const adFormu = g.querySelector('#kullanici-adi-formu');
      if (adFormu) adFormu.addEventListener('submit', async (e) => {
        e.preventDefault();
        const yeni = adFormu.elements.kullaniciAdi.value.trim();
        if (yeni === o.kullaniciAdi) return bildir(t('settings.renameSame'), true);
        const sonuc = await eylem(adFormu.querySelector('button'), () => api('kullanici-adi', { kullaniciAdi: yeni }));
        if (sonuc === undefined) return;
        ses.satinAl();
        await durumYenile();
        arayuzCiz();
        hesapPaneli('ayarlar');
        bildir(t('settings.renamed'));
      });
      g.querySelectorAll('[data-git]').forEach((b) => b.addEventListener('click', () => { location.hash = '#/' + b.dataset.git; }));
      g.querySelector('[data-profilim]')?.addEventListener('click', () => { ses.tik(); oyuncuKarti(o.id); });
      g.querySelector('[data-git-arkadas]')?.addEventListener('click', () => { ses.tik(); location.hash = '#/arkadaslar'; });
      g.querySelector('[data-git-oyun]')?.addEventListener('click', () => { ses.tik(); location.hash = '#/oyunlar'; });
      g.querySelector('[data-git-esnaf]')?.addEventListener('click', () => { ses.tik(); location.hash = '#/magaza/kartlar'; });
      // sekmeler pencereyi yeniden açmadan yerinde değişir
      g.querySelectorAll('[data-hesap-sekme]').forEach((b) => b.addEventListener('click', () => {
        ses.tik();
        d.hesapSekmesi = b.dataset.hesapSekme;
        g.querySelectorAll('[data-hesap-sekme]').forEach((x) => x.setAttribute('aria-selected', x === b));
        g.querySelectorAll('[data-bolum]').forEach((x) => { x.hidden = x.dataset.bolum !== d.hesapSekmesi; });
      }));
      const sd = g.querySelector('[data-eylem=ses]');
      if (sd) sd.addEventListener('click', () => {
        ses.sesDegistir();
        hesapPaneli('ayarlar');
        const hud = document.getElementById('ses-dugme');
        if (hud) hud.textContent = sesSimgesi();
      });
      if (g.querySelector('.cagri-kart')) cagriKartiBagla(g);
      const ib = g.querySelector('[data-isletme-bildirim]');
      if (ib) ib.addEventListener('click', () => {
        const acik = !isletmeBildirimiAcik();
        try { localStorage.setItem('tezgah_isletme_bildirim', acik ? '1' : '0'); } catch (e) { /* yok say */ }
        ib.classList.toggle('acik', acik); ib.setAttribute('aria-checked', acik); ib.querySelector('i').textContent = acik ? _autoMetin('Açık') : _autoMetin('Kapalı');
        ses.tik();
      });
      g.querySelectorAll('[data-hs]').forEach((inp) => inp.addEventListener('input', () => {
        ses.kanalAyarla(inp.dataset.hs, Number(inp.value) / 100);
        g.querySelector(`[data-hs-yuzde=${inp.dataset.hs}]`).textContent = Number(inp.value) ? '%' + inp.value : t('settings.off');
        const hud = document.getElementById('ses-dugme');
        if (hud) hud.textContent = sesSimgesi();
      }));
      g.querySelectorAll('[data-kalite]').forEach((b) => b.addEventListener('click', () => {
        if (kaliteTercihi() === b.dataset.kalite) return;
        kaliteKaydet(b.dataset.kalite);
        bildir(t('settings.graphicsRestart'));
        setTimeout(() => location.reload(), 700);
      }));
      let dilKaydi=false;
      g.querySelectorAll('[data-dil]').forEach(secim=>secim.addEventListener('change',async()=>{
        if(dilKaydi)return;dilKaydi=true;secim.disabled=true;
        const onceki=aktifDil(),yeniAd=g.querySelector('[name=kullaniciAdi]')?.value;
        try {
          if(!await dilDegistir(secim.value))return;
          await api('dunya/tercihler',{dil:aktifDil()});
          yerellestir(arayuz);document.dispatchEvent(new CustomEvent('cirak:dil-kaydedildi'));
          if(g.isConnected&&!katman.hidden&&d.panelRota==='hesap'){
            const kaydirma=g.scrollTop;await hesapPaneli('ayarlar');
            const yeni=katman.querySelector('.panel-govde');if(yeni){yeni.scrollTop=kaydirma;const input=yeni.querySelector('[name=kullaniciAdi]');if(input&&yeniAd!==undefined)input.value=yeniAd;}
          }
        }catch(e){await dilDegistir(onceki);secim.value=onceki;yerellestir(arayuz);bildir(e.message,true);}
        finally{dilKaydi=false;if(secim.isConnected)secim.disabled=false;}
      }));
      g.querySelectorAll('[data-pil]').forEach((b) => b.addEventListener('click', () => {
        sahne.pilAyarla(b.dataset.pil);
        g.querySelectorAll('[data-pil]').forEach((secim) => {
          const secili = secim.dataset.pil === sahne.pilTercihi();
          secim.setAttribute('aria-pressed', String(secili));
          secim.setAttribute('aria-selected', String(secili));
        });
        const y = g.querySelector('[data-pil-durum]'); if (y) y.textContent = pilDurumYazisi();
      }));
      g.querySelectorAll('[data-fps]').forEach((b) => b.addEventListener('click', () => {
        const fps = sahne.fpsAyarla(b.dataset.fps);
        g.querySelectorAll('[data-fps]').forEach((secim) => {
          const secili = Number(secim.dataset.fps) === fps;
          secim.setAttribute('aria-pressed', String(secili));
          secim.setAttribute('aria-selected', String(secili));
        });
      }));
      bildirimKartiCiz(g);
      g.querySelectorAll('[data-eylem=foto]').forEach((b) => b.addEventListener('click', async (e) => {
        e.preventDefault();
        ses.tik();
        let veri;
        try { veri = await fotoSec(); } catch (err) { return bildir(err.message, true); }
        if (!veri) return;
        const r = await eylem(null, () => api('profil-foto', { foto: veri }));
        if (r === undefined) return;
        ses.satinAl();
        bildir(_autoMetin('Profil fotoğrafın güncellendi.'));
        await durumYenile();
        arayuzCiz();
        hesapPaneli();
      }));
      const fs = g.querySelector('[data-eylem=foto-sil]');
      if (fs) fs.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!(await onayla(_autoMetin('Profil fotoğrafın kaldırılsın mı?'), { evet: _autoMetin('Kaldır'), tehlike: true, ikon: '🗑️' }))) return;
        if ((await eylem(null, () => api('profil-foto/sil', {}))) === undefined) return;
        await durumYenile();
        arayuzCiz();
        hesapPaneli();
      });
      sosyalBaglantilarCiz(g.querySelector('#sosyal-baglantilar'));
      const md = g.querySelector('[data-eylem=mahalle-degis]');
      if (md) md.addEventListener('click', async () => {
        ses.tik();
        let liste;
        try { liste = await api(`ilceler/${o.ilce.id}/mahalleler`); } catch (e) { return bildir(e.message, true); }
        if (!liste.length) return bildir(_autoMetin('Bu ilçe için mahalle listesi yok.'), true);
        const kutu = document.createElement('div');
        kutu.className = 'mahalle-sec';
        kutu.innerHTML = `<select aria-label="${_autoHtml("Mahalle")}">${liste.map((m) => `<option value="${m.id}" ${o.mahalle && o.mahalle.id === m.id ? 'selected' : ''}>${esc(m.ad)}</option>`).join('')}</select>
          <button class="dugme yesil kucuk">${_autoHtml("Kaydet")}</button>`;
        md.replaceWith(kutu);
        kutu.querySelector('button').addEventListener('click', async (e) => {
          const r = await eylem(e.currentTarget, () => api('mahalle', { mahalleId: Number(kutu.querySelector('select').value) }));
          if (r === undefined) return;
          ses.satinAl();
          bildir(_autoMetin('Mahallen güncellendi.'));
          await durumYenile();
          await caddeYenile();
          arayuzCiz();
          hesapPaneli();
        });
      });
      g.querySelector('[data-eylem=tanitim]').addEventListener('click', async () => {
        panelKapat(true);
        location.hash = '#/mahalle';
        await introOynat({ harita, mahalle, oyuncu: d.genel.oyuncu, isimler: d.cadde && d.cadde.isimler });
        rotaUygula();
      });
      g.querySelector('[data-eylem=cikis]').addEventListener('click', async () => {
        await bildirimler.cikistaSil();
        canliKapat();
        try { await api('cikis', {}); } catch (e) { /* yok say */ }
        d.genel.oyuncu = null;
        history.replaceState(null, '', location.pathname);
        girisCiz();
      });
    },
  });
  p.dir=aktifDil()==='ar'?'rtl':'ltr';
  guvenlikKur(p);
  const nb = p.querySelector('[data-git-banka]');
  if (nb) nb.addEventListener('click', () => { ses.tik(); location.hash = '#/banka/not'; });
  const yb = p.querySelector('[data-git-yasam]');
  if (yb) yb.addEventListener('click', () => { ses.tik(); location.hash = '#/yasam/keyif'; });
  const kb = p.querySelector('[data-git-kupon]');
  if (kb) kb.addEventListener('click', () => { ses.tik(); location.hash = '#/kupon'; });
}

// ---------- Geliştirici başvurusu ve katkıları ----------
// 0.41: Geliştiriciler: oyunu geliştiren ekip (profillerine dokunulabilir)
async function gelistiricilerPaneli() {
  const p = panelAc({ ikon: '👩‍💻', baslik: _autoMetin('Geliştiriciler'), rota: 'gelistiriciler', alt: _autoMetin('Oyunu geliştiren ekip'), govde: `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>` });
  const kutu = p.querySelector('.panel-govde');
  let r;
  try { r = await api('gelistiriciler'); } catch (e) { kutu.innerHTML = `<p class="hata">${esc(e.message)}</p>`; return; }
  if (!kutu.isConnected) return;
  const alanAdi = { kod: _autoMetin('Kod'), topluluk: _autoMetin('Topluluk'), ikisi: _autoMetin('Kod ve topluluk') };
  kutu.innerHTML = `<p class="kucuk soluk">${_autoHtml("Çırak'ı oyuncularla birlikte geliştiriyoruz. Ekipteki herkes kod, hata bildirimi ve fikirleriyle katkı veriyor.")}</p>
    ${r.ekip.length ? `<ul class="ark-liste">${r.ekip.map((x) => `<li class="ark-kisi"><button class="ark-ac" data-profil-ac="${x.id}"><span class="ark-foto">${avatarHtml(x.foto, x.ad, 48)}</span>
      <span class="ark-bilgi"><b>${x.durum === 'aktif' ? isimHtml(x.ad, { o: 'g' }) : esc(x.ad)}${x.durum === 'deneme' ? ` <small class="rozetcik">${_autoHtml("Deneme")}</small>` : ''}</b><small>${esc(alanAdi[x.alan] || '')} · ${_autoSablon`${x.katki} uygulanan katkı`}</small></span></button></li>`).join('')}</ul>`
      : `<div class="bos-durum"><span>👩‍💻</span><b>${_autoHtml("Ekip yeni kuruluyor")}</b><small>${_autoHtml("İlk geliştiricilerden biri olmak ister misin?")}</small></div>`}
    <a class="dugme yesil ortali-dugme" href="#/gelistirici">🛠️ ${d.genel.ekipUyesi ? _autoHtml('Katkıda Bulun') : esc(t('account.join'))}</a>`;
  kutu.querySelectorAll('[data-profil-ac]').forEach((b) => b.addEventListener('click', () => { ses.tik(); oyuncuKarti(Number(b.dataset.profilAc)); }));
}
async function gelistiriciPaneli() {
  let veri;
  try { veri = await api('gelistirici'); } catch (e) { return bildir(e.message, true); }
  const b = veri.basvuru;
  const adlar = { bekliyor: _autoMetin('İnceleniyor'), deneme: _autoMetin('Deneme sürecinde'), aktif: _oyunMetni("ui.9ed367f359c1"), donduruldu: _autoMetin('Donduruldu'), reddedildi: 'Reddedildi', kapatildi: _autoMetin('Kapatıldı') };
  const yetkili = b && ['deneme', 'aktif'].includes(b.durum);
  const tekrarDurumu = b && ['reddedildi', 'kapatildi'].includes(b.durum);
  const basvuruAcik = !b || (tekrarDurumu && Date.now() >= Number(b.yenidenBasvuru));
  const p = panelAc({ ikon: '🛠️', baslik: _oyunMetni("ui.9ed367f359c1"), rota: 'gelistirici',
    govde: `<div class="kart"><h3>${_autoHtml("Oyunu birlikte geliştirelim")}</h3><p>${_autoHtml("İki şekilde katkıda bulunabilirsin: kod örneği veya açık depo bağlantısı paylaşabilir; oyundaki hataları ve fikirlerini düzenli olarak bildirebilirsin.")}</p>
      <p class="kucuk soluk">${_autoHtml("Başvuru kabulü oyun parası, yönetim paneli veya sunucu erişimi vermez. Kodlar incelendikten sonra proje sahibi tarafından uygulanır.")}</p></div>
      ${b ? `<div class="kart"><h3>${_autoSablon`Başvurun · ${esc(adlar[b.durum] || b.durum)}`}</h3><p class="kucuk">${esc(b.alan === 'ikisi' ? _autoMetin('Kod ve topluluk') : b.alan === 'kod' ? _autoMetin('Kod katkısı') : _autoMetin('Hata ve fikir'))}</p>${b.cevap ? `<p>${esc(b.cevap)}</p>` : ''}</div>` : ''}
      ${tekrarDurumu && !basvuruAcik ? `<div class="kart"><p>${_autoSablon`Yeniden başvuru tarihi: ${new Date(Number(b.yenidenBasvuru)).toLocaleDateString('tr-TR')}`}</p></div>` : ''}
      ${basvuruAcik ? `<form class="kart gelistirici-form" id="gelistirici-basvuru"><h3>${_autoHtml("Geliştirici başvurusu")}</h3>
        <label class="alan"><span>${_autoHtml("Katkı alanın")}</span><select name="alan" required><option value="topluluk">${_autoHtml("Hata ve fikir")}</option><option value="kod">${_autoHtml("Kod katkısı")}</option><option value="ikisi">${_autoHtml("Kod ve hata/fikir")}</option></select></label>
        <label class="alan"><span>${_autoHtml("Kendini ve katkı planını anlat")}</span><textarea name="niyet" minlength="40" maxlength="1200" required placeholder="${_autoHtml("Neler yapabilirsin? Hangi alanlarla ilgileniyorsun?")}"></textarea></label>
        <label class="alan" data-kod-baglanti hidden><span>${_autoHtml("Açık kod örneği bağlantısı")}</span><input name="baglanti" type="url" maxlength="300" placeholder="https://github.com/..."></label>
        <label class="alan"><span>${_autoSablon`Adın ve soyadın ${esc(t('auth.optional'))}`}</span><input name="adSoyad" maxlength="100" autocomplete="name" value="${esc(d.genel.oyuncu.adSoyad || '')}" placeholder="${_autoHtml("Jenerikte görünmek istersen")}"></label>
        <label class="gelistirici-onay"><input type="checkbox" name="jenerikte"> ${_autoHtml("Katkım uygulanırsa adımın jenerikte görünmesini istiyorum.")}</label>
        <button class="dugme mavi" type="submit">${_autoHtml("Başvurumu gönder")}</button></form>` : ''}
      ${b && !basvuruAcik ? `<form class="kart gelistirici-form" id="gelistirici-tercih"><h3>${_autoHtml("Jenerikte adın")}</h3><p class="kucuk soluk">${_autoHtml("İstediğin zaman görünürlüğünü kapatabilirsin. Yalnızca uygulanmış katkılar listelenir.")}</p>
        <label class="alan"><span>${_autoHtml("Adın ve soyadın")}</span><input name="adSoyad" maxlength="100" autocomplete="name" value="${esc(b.adSoyad || '')}"></label>
        <label class="gelistirici-onay"><input type="checkbox" name="jenerikte" ${b.jenerikte ? 'checked' : ''}> ${_autoHtml("Jenerikte adım görünsün")}</label>
        <button class="dugme gri kucuk" type="submit">${_autoHtml("Tercihimi kaydet")}</button></form>` : ''}
      ${yetkili ? `<form class="kart gelistirici-form" id="gelistirici-katki"><h3>${_autoHtml("Yeni katkı gönder")}</h3>
        <label class="alan"><span>${_autoHtml("Katkı türü")}</span><select name="tur"><option value="hata">${_autoHtml("🐛 Hata bildirimi")}</option><option value="fikir">${_autoHtml("💡 Fikir")}</option><option value="kod">${_autoHtml("💻 Kod bağlantısı")}</option></select></label>
        <label class="alan"><span>${_autoHtml("Başlık")}</span><input name="baslik" minlength="5" maxlength="100" required></label>
        <label class="alan"><span>${_autoHtml("Nasıl tekrar edilir veya ne öneriyorsun?")}</span><textarea name="aciklama" minlength="20" maxlength="2000" required></textarea></label>
        <label class="alan"><span>${_autoHtml("Açık HTTPS bağlantısı (kod katkısında zorunlu)")}</span><input name="baglanti" type="url" maxlength="300" placeholder="https://github.com/..."></label>
        <button class="dugme mavi" type="submit">${_autoHtml("Katkıyı gönder")}</button><p class="kucuk soluk">${b.durum === 'aktif' ? _autoHtml('Aktif geliştiriciler için günlük katkı sınırı yok.') : _autoHtml("24 saatte en fazla 5 katkı.")}</p></form>` : ''}
      <div class="kart"><h3>${_autoHtml("Katkılarım")}</h3><ul class="gelistirici-liste" id="gelistirici-liste"></ul></div>`,
    hazir(g) {
      for (const [kimlik, yol, alanlar] of [['gelistirici-basvuru', 'gelistirici/basvur', ['alan', 'niyet', 'baglanti', 'adSoyad']], ['gelistirici-katki', 'gelistirici/katki', ['tur', 'baslik', 'aciklama', 'baglanti']]]) {
        const f = g.querySelector('#' + kimlik);
        if (!f) continue;
        if (kimlik === 'gelistirici-basvuru') {
          const kodAlani = f.querySelector('[data-kod-baglanti]');
          const alanGuncelle = () => {
            const kod = f.elements.alan.value === 'kod';
            kodAlani.hidden = f.elements.alan.value === 'topluluk';
            f.elements.baglanti.required = kod;
            if (kodAlani.hidden) f.elements.baglanti.value = '';
          };
          f.elements.alan.addEventListener('change', alanGuncelle);
          alanGuncelle();
        }
        f.addEventListener('submit', async (e) => {
          e.preventDefault();
          const v = Object.fromEntries(alanlar.map((k) => [k, f.elements[k].value.trim()]));
          if (kimlik === 'gelistirici-basvuru') v.jenerikte = f.elements.jenerikte.checked;
          const r = await eylem(f.querySelector('button[type=submit]'), () => api(yol, v));
          if (r) { bildir(kimlik.endsWith('basvuru') ? _autoMetin('Başvurun incelemeye alındı.') : _autoMetin('Katkın alındı.')); gelistiriciPaneli(); }
        });
      }
      const tercih = g.querySelector('#gelistirici-tercih');
      if (tercih) tercih.addEventListener('submit', async (e) => {
        e.preventDefault();
        const r = await eylem(tercih.querySelector('button'), () => api('gelistirici/jenerik', {
          adSoyad: tercih.elements.adSoyad.value.trim(), jenerikte: tercih.elements.jenerikte.checked,
        }));
        if (r) { bildir(_autoMetin('Jenerik tercihin kaydedildi.')); gelistiriciPaneli(); }
      });
    },
  });
  const ul = p.querySelector('#gelistirici-liste');
  sayfaliListe(ul, {
    async yukle(once) { const r = once ? await api('gelistirici?once=' + once) : veri; return { liste: r.katkilar, devam: r.devam, imlec: r.katkilar.at(-1)?.id || once }; },
    satir: (x) => `<li class="gelistirici-katki"><b>${esc(x.baslik)}</b><small>${x.tur === 'kod' ? '💻 Kod' : x.tur === 'hata' ? '🐛 Hata' : '💡 Fikir'} · ${esc(x.durum)} · ${new Date(Number(x.olusturma)).toLocaleDateString('tr-TR')}</small><p>${esc(x.aciklama)}</p>${x.cevap ? `<p class="gelistirici-cevap">${_autoSablon`Yanıt: ${esc(x.cevap)}`}</p>` : ''}${x.baglanti ? `${_autoSablon`<a href="${esc(x.baglanti)}" target="_blank" rel="noopener noreferrer">Bağlantıyı aç ↗</a>`}` : ''}</li>`,
    bos: _autoMetin('Henüz katkı gönderilmedi.'),
  });
}

async function jenerikPaneli() {
  let bolumler;
  try { bolumler = jenerikDuzenle(await api('jenerik')).bolumler; } catch (e) { return bildir(e.message, true); }
  if (aktifRota() !== 'jenerik') return;
  panelAc({ ikon: '🎞️', baslik: _oyunMetni("ui.41997f890c3d"), rota: 'jenerik',
    govde: `<div class="jenerik-sahne" aria-label="${_autoHtml("ÇIRAK oyun ekibi")}">
      <button class="jenerik-indir" data-jenerik-indir hidden title="${_autoHtml("Emeği geçenleri video olarak indir")}">⬇ ${_autoHtml("İndir")}</button>
      <div class="jenerik-isik"></div><div class="jenerik-akis"><div class="jenerik-acilis-logo"><div class="jenerik-logo acilis-logo">${_autoHtml("Çırak")}</div><span class="jenerik-imza">${_autoHtml("Bu senin hikâyen")}</span></div><p class="jenerik-giris">${_autoMetin("<strong>Çıraklıktan Patronluğa</strong><br>Birlikte çalışıyor, birlikte büyüyoruz.")}</p>
        ${bolumler.map((b, i) => `${i === 0 || bolumler[i - 1].anaBolum !== b.anaBolum ? `<h2 class="jenerik-ana-bolum">${esc(_autoMetin(b.anaBolum || b.ad))}</h2>` : ''}<section class="jenerik-bolum">${b.ad !== b.anaBolum ? `<h3>${esc(_autoMetin(b.ad))}</h3>` : ''}${b.kayitlar?.length ? b.kayitlar.map((k) => `<div class="jenerik-kisi">${k.gorev || k.lider ? `<small class="jenerik-gorev">${k.lider ? _autoHtml('LİDER · ') : ''}${esc(_autoMetin(k.gorev || 'Ekip Lideri'))}</small>` : ''}<p>${esc(k.adSoyad)}</p>${k.aciklama ? `<small class="jenerik-aciklama">${esc(k.aciklama)}</small>` : ''}${k.baglanti ? `${_autoSablon`<a class="jenerik-lisans" href="${esc(k.baglanti)}" target="_blank" rel="noopener noreferrer">Kaynak ve lisans metni ↗</a>`}` : ''}</div>`).join('') : b.kisiler.length ? b.kisiler.map((ad) => `<p>${esc(ad)}</p>`).join('') : `<p class="jenerik-bekliyor">${_autoHtml("Ekip büyüdükçe burada buluşacağız.")}</p>`}</section>`).join('')}
        <div class="jenerik-final"><div class="jenerik-logo acilis-logo">${_autoHtml("Çırak")}</div><small>${_autoMetin("Bu hikâyenin bir parçası da sensin.<br>Oynadığın ve birlikte büyüdüğümüz için teşekkürler.")}</small></div></div></div>
      <div class="jenerik-kontrol"><button class="dugme gri kucuk" data-tekrar>${_autoHtml("↻ Baştan izle")}</button><button class="dugme gri kucuk" data-duraklat>${_autoHtml("⏸ Duraklat")}</button></div>`,
    hazir(g, p) {
      p.classList.add('jenerik-panel');
      g.scrollTop = 0;
      const jenerikSahne = g.querySelector('.jenerik-sahne');
      const akis = jenerikSahne.querySelector('.jenerik-akis'), final = jenerikSahne.querySelector('.jenerik-final');
      const olculeriAyarla = () => {
        jenerikSahne.style.setProperty('--jenerik-yukseklik', jenerikSahne.clientHeight + 'px');
        // 0.57.9: açılış (logo + alt yazı) kutunun ortasında başlar; kutu küçülünce yazılar alttaki karartmanın içine kaymaz
        const acilisLogo = akis.querySelector('.jenerik-acilis-logo'), giris = akis.querySelector('.jenerik-giris');
        // ölçü yerleşim değerlerinden (offset) alınır: panel açılış animasyonundaki ölçek dönüşümü sonucu bozmaz
        const blok = giris.offsetTop + giris.offsetHeight - acilisLogo.offsetTop, H = jenerikSahne.clientHeight;
        // ortala; ama yazının altı kutunun alttaki %20'lik karartmasına girmesin
        const ust = Math.max(12, Math.min(Math.round((H - blok) / 2), Math.round(H * 0.8 - blok)));
        jenerikSahne.style.setProperty('--jenerik-ust', ust + 'px');
        // 0.57.9: açılışta yalnız logo ve alt yazı görünür; sonraki bölüm (yapımcılar) kutunun altından girer
        jenerikSahne.style.setProperty('--jenerik-giris-alt', Math.max(90, H - ust - blok + 24) + 'px');
        const mesafe = Math.max(0, akis.offsetTop + final.offsetTop + final.offsetHeight / 2 - jenerikSahne.clientHeight / 2);
        jenerikSahne.style.setProperty('--jenerik-mesafe', mesafe + 'px');
        jenerikSahne.style.setProperty('--jenerik-sure', Math.max(24, mesafe / 36 + 6) + 's');
        if (akis.dataset.bitti) akis.style.transform = `translateY(-${mesafe}px)`;

      };
      olculeriAyarla();
      document.fonts?.ready.then(() => { if (p.isConnected) olculeriAyarla(); });
      const muzik = ses.jenerikMuzigi();
      const ortamSes = ses.jenerikOrtami(); // 0.57.9: hafif yağmur sesi ve şimşekte gök gürültüsü
      const yagmurDur = yagmurBaslat(jenerikSahne, { onSimsek: (tur) => ortamSes.simsek(tur) }); // 0.49.6: yağmur efekti

      let boyutTemizle = () => {};
      if (typeof ResizeObserver === 'function') {
        let sonBoyut = '';
        const gozlem = new ResizeObserver(() => {
          const boyut = `${jenerikSahne.clientWidth}:${jenerikSahne.clientHeight}:${akis.scrollHeight}`;
          if (boyut === sonBoyut || !p.isConnected) return;
          sonBoyut = boyut;
          olculeriAyarla();
        });
        gozlem.observe(jenerikSahne);
        gozlem.observe(akis);
        boyutTemizle = () => gozlem.disconnect();
      } else {
        window.addEventListener('resize', olculeriAyarla);
        boyutTemizle = () => window.removeEventListener('resize', olculeriAyarla);
      }
      let donusZamani = null;
      const donusuIptalEt = () => { clearTimeout(donusZamani); donusZamani = null; };
      const jenerikBitti = (e) => {
        if (e.target !== akis || e.animationName !== 'jenerikAkis') return;
        akis.dataset.bitti = '1'; for (const a of akis.getAnimations()) a.cancel(); akis.style.animation = 'none'; olculeriAyarla();
        donusuIptalEt();
        donusZamani = setTimeout(() => {
          donusZamani = null;
          if (!p.isConnected || aktifRota() !== 'jenerik' || jenerikSahne.classList.contains('jenerik-durak')) return;
          d.hesapSekmesi = 'destek';
          location.hash = '#/hesap';
        }, 5000);
      };
      akis.addEventListener('animationend', jenerikBitti);
      d.panelTemizle = () => { donusuIptalEt(); akis.removeEventListener('animationend', jenerikBitti); boyutTemizle(); muzik.bitir(); ortamSes.bitir(); yagmurDur(); };
      g.querySelector('[data-tekrar]').addEventListener('click', () => { donusuIptalEt(); jenerikSahne.classList.remove('jenerik-durak'); for (const a of akis.getAnimations()) a.cancel(); delete akis.dataset.bitti; akis.style.transform = ''; akis.style.animation = 'none'; olculeriAyarla(); void jenerikSahne.offsetWidth; akis.style.animation = ''; muzik.bastan(); ortamSes.duraklat(false); g.querySelector('[data-duraklat]').textContent = '⏸ Duraklat'; });
      g.querySelector('[data-duraklat]').addEventListener('click', (e) => { donusuIptalEt(); jenerikSahne.classList.toggle('jenerik-durak'); const durak = jenerikSahne.classList.contains('jenerik-durak'); muzik.duraklat(durak); ortamSes.duraklat(durak); e.currentTarget.textContent = durak ? _autoMetin('▶ Devam et') : '⏸ Duraklat'; });
      // 0.49.1: yöneticiler jenerik oynarken videosunu indirebilir (tanıtımdaki gibi; oyunculara görünmez)
      const indir = g.querySelector('[data-jenerik-indir]');
      api('yonetim/durum').then((y) => { if (y && y.yonetici === true && indir.isConnected) indir.hidden = false; }).catch(() => {});
      indir.addEventListener('click', async () => {
        ses.tik();
        if (!jenerikSahne.classList.contains('jenerik-durak')) g.querySelector('[data-duraklat]').click();
        const m = await import('./jenerik-indir.js?v=0.57.17');
        m.jenerikIndirmePenceresi(jenerikSahne);
      });
    },
  });
}

// ---------- Kupon kodu ----------
// 9 haneli kod üç kutuda (3-3-3) girilir; yapıştırınca kendiliğinden bölünür. Doğru kodda tutar bakiyeye yüklenir.
// Adres "#/kupon/123456789" ise kod hazır doldurulur (kuponun paylaşım bağlantısı).
async function kuponPaneli(hazirKod = '') {
  let gecmis = [];
  try { gecmis = (await api('kupon')).gecmis || []; } catch (e) { /* geçmiş alınamadı */ }
  const gecmisHtml = () => gecmis.length ? `<div class="kart"><h3>${_autoHtml("Kullandığın kuponlar")}</h3><ul class="satirlar">${gecmis.map((g) => `<li><span>🎟️ ${esc(g.ad)}<small>${gunEtiketi(g.zaman)} ${saatMetni(g.zaman)}</small></span><span class="sag arti">+${tl(g.tutar)}</span></li>`).join('')}</ul></div>` : '';
  const p = panelAc({
    ikon: '🎟️', baslik: _autoMetin('Kupon kodu'), alt: _autoMetin('Kodunu gir, bakiyene yüklensin'), rota: 'kupon',
    govde: `<form class="kupon-form" id="kupon-form" autocomplete="off">
        <div class="kupon-bilet">
          <small>${_autoHtml("9 haneli kupon kodun")}</small>
          <div class="kupon-kutular">
            ${[0, 1, 2].map((i) => `<input inputmode="numeric" pattern="[0-9]*" maxlength="3" aria-label="${esc(_autoSablon`Kodun ${i + 1}. bölümü`)}" data-parca="${i}" placeholder="000">`).join('<span aria-hidden="true">–</span>')}
          </div>
          <div class="kupon-sonuc" id="kupon-sonuc" aria-live="polite"></div>
        </div>
        <button class="dugme yesil buyuk" type="submit" id="kupon-gonder" disabled>${_autoHtml("Kuponu kullan")}</button>
        <p class="kucuk soluk">${_autoHtml("Kupon kodları kampanyalarda, çekilişlerde ve etkinliklerde dağıtılır. Her kod bir kez kullanılır; kampanyaya göre kişi başı sınır olabilir.")}</p>
      </form>
      <div id="kupon-gecmis">${gecmisHtml()}</div>`,
    hazir(g) {
      const kutular = [...g.querySelectorAll('[data-parca]')];
      const gonder = g.querySelector('#kupon-gonder');
      const sonuc = g.querySelector('#kupon-sonuc');
      const kod = () => kutular.map((k) => k.value).join('');
      const guncelle = () => { gonder.disabled = kod().length !== 9; sonuc.className = 'kupon-sonuc'; sonuc.textContent = ''; };
      const dagit = (metin, bas = 0) => {
        const r = String(metin).replace(/\D/g, '').slice(0, 9 - bas * 3);
        for (let i = bas; i < 3; i++) kutular[i].value = r.slice((i - bas) * 3, (i - bas) * 3 + 3);
        const bos = kutular.find((k) => k.value.length < 3);
        (bos || kutular[2]).focus();
        guncelle();
      };
      kutular.forEach((k, i) => {
        k.addEventListener('input', () => {
          const r = k.value.replace(/\D/g, '');
          if (r.length > 3) { dagit(r, i); return; }
          k.value = r;
          if (r.length === 3 && i < 2) kutular[i + 1].focus();
          guncelle();
        });
        k.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !k.value && i > 0) { kutular[i - 1].focus(); } });
        k.addEventListener('paste', (e) => { e.preventDefault(); dagit((e.clipboardData || window.clipboardData).getData('text'), i); });
      });
      if (hazirKod) dagit(hazirKod); else setTimeout(() => kutular[0].focus(), 250);
      g.querySelector('#kupon-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (kod().length !== 9) return;
        gonder.disabled = true;
        gonder.textContent = 'Kontrol ediliyor…';
        try {
          const r = await api('kupon', { kod: kod() });
          sonuc.className = 'kupon-sonuc iyi';
          sonuc.innerHTML = `<b>+${tl(r.tutar)}</b><span>${_autoSablon`${esc(r.ad)} kuponu bakiyene yüklendi${r.icra ? ` (icra kesintisi ${tl(r.icra)})` : ''}.`}</span>`;
          ses.kasa();
          kutular.forEach((k) => { k.value = ''; });
          if (r.bakiye != null) { d.genel.oyuncu.bakiye = r.bakiye; bakiyeSay(r.bakiye); }
          gecmis = [{ ad: r.ad, tutar: r.tutar, zaman: simdi() }, ...gecmis];
          g.querySelector('#kupon-gecmis').innerHTML = gecmisHtml();
        } catch (x) {
          sonuc.className = 'kupon-sonuc kotu';
          sonuc.textContent = x.message;
          ses.hata();
          g.querySelector('.kupon-bilet').classList.remove('salla'); void g.querySelector('.kupon-bilet').offsetWidth; g.querySelector('.kupon-bilet').classList.add('salla');
        } finally {
          gonder.textContent = 'Kuponu kullan';
          gonder.disabled = kod().length !== 9;
        }
      });
    },
  });
  return p;
}

// Hesabım: e-posta ekleme ve şifre değiştirme (küçük açılır form)
function guvenlikKur(p) {
  const f = p.querySelector('#guvenlik-formu');
  if (!f) return;
  const ac = (tur) => {
    f.hidden = false;
    f.dataset.tur = tur;
    f.innerHTML = tur === 'eposta'
      ? `<label class="alan"><span>${_autoHtml("E-posta adresin")}</span><input name="eposta" type="email" autocomplete="email" maxlength="120" placeholder="ornek@eposta.com"></label>
         ${d.genel.oyuncu.sifreVar ? `<label class="alan"><span>${_autoHtml("Şu anki şifren")}</span><input name="sifre" type="password" autocomplete="current-password" required></label>` : ''}
         <button class="dugme yesil" type="submit">${_autoHtml("Kaydet")}</button>`
      : `${d.genel.oyuncu.sifreVar ? `<label class="alan"><span>${_autoHtml("Şu anki şifren")}</span><input name="eski" type="password" autocomplete="current-password" required></label>` : `<p class="kucuk soluk">${_autoHtml("Google/Facebook ile üye oldun. Bir şifre belirlersen kullanıcı adınla da girebilirsin.")}</p>`}
         <label class="alan"><span>${_autoHtml("Yeni şifre")}</span><input name="yeni" type="password" autocomplete="new-password" minlength="6" required></label>
         <button class="dugme yesil" type="submit">${_autoHtml("Şifreyi değiştir")}</button>`;
    f.querySelector('input').focus();
  };
  p.querySelector('[data-eylem=eposta]').addEventListener('click', () => { ses.tik(); ac('eposta'); });
  p.querySelector('[data-eylem=sifre]').addEventListener('click', () => { ses.tik(); ac('sifre'); });
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(f).entries());
    const r = await eylem(f.querySelector('button'), () => api(f.dataset.tur === 'eposta' ? 'eposta' : 'sifre-degistir', v));
    if (r === undefined) return;
    ses.satinAl();
    bildir(f.dataset.tur === 'eposta' ? (r.eposta ? 'E-posta adresin kaydedildi.' : _autoMetin("E-posta adresin kaldırıldı.")) : (d.genel.oyuncu.sifreVar ? _autoMetin("Şifren değişti.") : _autoMetin("Şifren belirlendi.")));
    await durumYenile();
    hesapPaneli();
  });
}

// Hesabım: Google / Facebook bağlantıları
async function sosyalBaglantilarCiz(kutu) {
  if (!kutu) return;
  let b;
  try { b = await api('oauth/baglantilar'); } catch (e) { return; }
  const adlar = { google: ['Google', GOOGLE_SVG], facebook: ['Facebook', FACEBOOK_SVG] };
  const acik = Object.keys(adlar).filter((k) => b.yontemler[k]);
  if (!acik.length || !kutu.isConnected) return;
  kutu.innerHTML = `<h4 class="kucuk" style="margin:14px 0 8px">${_autoHtml("Hızlı giriş")}</h4>` + acik.map((k) => b.bagli[k]
    ? `<div class="sosyal-satir"><span class="sosyal-dugme ${k} kucuk">${adlar[k][1]}<span>${_autoSablon`${adlar[k][0]} bağlı ✓`}</span></span>
        <button class="dugme gri kucuk" data-kaldir="${k}">${_autoHtml("Kaldır")}</button></div>`
    : `<div class="sosyal-satir"><a class="sosyal-dugme ${k} kucuk" href="api/oauth/${k}/basla?bagla=1">${adlar[k][1]}<span>${_autoSablon`${adlar[k][0]} hesabını bağla`}</span></a></div>`).join('');
  kutu.querySelectorAll('[data-kaldir]').forEach((x) => x.addEventListener('click', async () => {
    if (!(await onayla(_autoSablon`${adlar[x.dataset.kaldir][0]} bağlantısı kaldırılsın mı?`, { evet: _autoMetin('Kaldır'), tehlike: true, ikon: '🔗' }))) return;
    if ((await eylem(x, () => api('oauth/kaldir', { saglayici: x.dataset.kaldir }))) === undefined) return;
    sosyalBaglantilarCiz(kutu);
  }));
}

// ---------- Yetenekler ----------
function sayiTr(x) { return Number(x).toLocaleString(sayiDili()); }
async function yeteneklerPaneli() {
  const p = panelAc({ ikon: '🎯', baslik: _autoMetin('Yetenekler'), rota: 'yetenekler', govde: `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>` });
  let y;
  try { y = await api('yetenekler'); } catch (e) { return bildir(e.message, true); }
  if (aktifRota() !== 'yetenekler') return;
  const g = p.querySelector('.panel-govde');
  g.innerHTML = `<div class="kart"><b>${y.bos ? _autoSablon`${y.bos} yetenek puanın var` : _autoMetin("Boş puanın yok")}</b>
      <p class="kucuk soluk" style="margin:4px 0 0">${_autoSablon`Her seviye atlayışta 1 puan kazanırsın (toplam ${y.puan}, dağıtılan ${y.kullanilan}). Her yetenek en fazla ${y.enCok} derece.`}</p></div>
    <div class="yetenek-listesi">${y.liste.map((x) => `<div class="kart yetenek">
      <div class="yetenek-ust"><span class="tesis-simge">${x.simge}</span><div style="flex:1;min-width:0"><b>${esc(x.ad)}</b>
        <div class="derece">${Array.from({ length: y.enCok }, (_, i) => `<i class="${i < x.derece ? 'dolu' : ''}"></i>`).join('')}</div></div>
        <button class="dugme yesil kucuk" style="width:auto" data-yukselt="${x.kod}" ${y.bos && x.sonraki ? '' : 'disabled'}>＋</button></div>
      <p class="kucuk" style="margin:6px 0 0">${x.derece ? esc(_autoMetin(x.simdi)) : `<span class="soluk">${_autoHtml("Henüz yok.")}</span>`}${x.sonraki ? `<br><span class="soluk">${_autoSablon`Sonraki derece: ${esc(_autoMetin(x.sonraki))}`}</span>` : ''}</p></div>`).join('')}</div>
    ${y.kullanilan ? `<button class="metin-dugme" data-sifirla>${_autoSablon`Puanları yeniden dağıt (${tl(y.sifirlamaUcreti)})`}</button>` : ''}`;
  g.querySelectorAll('[data-yukselt]').forEach((b) => b.addEventListener('click', async () => {
    const r = await eylem(b, () => api('yetenekler/yukselt', { kod: b.dataset.yukselt }));
    if (r === undefined) return;
    ses.satinAl();
    await durumYenile();
    hudGuncelle();
    yeteneklerPaneli();
  }));
  const sf = g.querySelector('[data-sifirla]');
  if (sf) sf.addEventListener('click', async () => {
    if (!(await onayla(_autoSablon`Tüm yetenek puanların geri alınsın mı? Bedeli ${tamTl(y.sifirlamaUcreti)}.`, { evet: _autoMetin('Yeniden dağıt'), ikon: '🎯' }))) return;
    if ((await eylem(sf, () => api('yetenekler/sifirla', {}))) === undefined) return;
    await durumYenile();
    hudGuncelle();
    yeteneklerPaneli();
  });
}

// ---------- Başarı sertifikası ----------
function sertifikaAdresi(kod) { return location.origin + location.pathname + 's/' + kod; }
function sertifikaMetni(seviye, baslik) {
  const ne = baslik && !/seviye$/.test(baslik) ? _autoSablon`"${baslik}" sertifikamı aldım` : _autoSablon`${seviye}. seviyeye ulaştım`;
  return _autoSablon`Çırak'ta ${ne}! 🏆 Beni geçebilir misin? Tezgâhını kur, çıraklıktan patronluğa yüksel. Davetimle ek sermayeyle başla:`;
}
// Sertifika resmi ve paylaşım düğmeleri (seviye atlayınca ve Hesabım'dan açılır)
function sertifikaKartiHtml(s) {
  const altin = s.altin ?? d.altinSertifika; // 0.42.1: altın sertifika (resmin çevresine altın çerçeve)
  return `${altin ? `<div class="altin-serit">★ ${_autoHtml("Altın sertifika")}</div>` : ''}<figure class="sertifika-resim${altin ? ' altin' : ''}"><img src="api/sertifika/${esc(s.kod)}.jpg" width="1024" height="541" alt="${_autoSablon`${esc(s.baslik || _oyunMetni('account.level', { level: s.seviye }))} başarı sertifikan`}" loading="eager"></figure>
    <div class="paylas-izgara">
      <button class="paylas whatsapp" data-paylas="whatsapp">${_autoHtml("WhatsApp")}</button>
      <button class="paylas facebook" data-paylas="facebook">${_autoHtml("Facebook")}</button>
      <button class="paylas x" data-paylas="x">X</button>
      <button class="paylas telegram" data-paylas="telegram">${_autoHtml("Telegram")}</button>
    </div>
    <div class="bilgi-izgara">
      <button class="dugme mavi kucuk" data-eylem="kopyala">🔗 ${_autoHtml("Bağlantıyı kopyala")}</button>
      <button class="dugme gri kucuk" data-eylem="indir" style="margin-top:0">⬇️ ${_autoHtml("Resmi indir")}</button>
    </div>
    <div class="bilgi-izgara">
      <button class="dugme gri kucuk" data-eylem="hikaye">📱 ${_autoHtml("Hikâye sürümü (9:16)")}</button>
      <button class="dugme gri kucuk" data-eylem="resim-paylas" style="margin-top:0" hidden>📸 ${_autoHtml("Resim olarak paylaş")}</button>
    </div>`;
}
function sertifikaKartiKur(kok, s) {
  const link = sertifikaAdresi(s.kod);
  const metin = sertifikaMetni(s.seviye, s.baslik);
  kok.querySelectorAll('[data-paylas]').forEach((b) => b.addEventListener('click', () => { ses.tik(); paylasimPenceresi(b.dataset.paylas, { metin, link }); }));
  kok.querySelector('[data-eylem=kopyala]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(`${metin} ${link}`); bildir(_autoMetin('Bağlantı kopyalandı, istediğin yere yapıştır.')); } catch (e) { bildir(link); }
  });
  kok.querySelector('[data-eylem=indir]').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = `api/sertifika/${s.kod}.jpg?indir=1`;
    a.download = `cirak-sertifika-${s.seviye}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
  // dikey hikâye: telefonda doğrudan paylaşılır (Instagram, WhatsApp durumu), olmazsa indirilir
  kok.querySelector('[data-eylem=hikaye]').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    b.disabled = true;
    try {
      const paylasildi = await resimPaylas(`api/sertifika/${s.kod}.jpg?hikaye=1`, `cirak-hikaye-${s.kod}.jpg`, { metin, link });
      if (!paylasildi) {
        const a = document.createElement('a');
        a.href = `api/sertifika/${s.kod}.jpg?hikaye=1&indir=1`;
        a.download = `cirak-hikaye-${s.kod}.jpg`;
        document.body.appendChild(a); a.click(); a.remove();
        bildir(_autoMetin('Hikâye görseli indirildi. Instagram ya da WhatsApp durumuna ekleyebilirsin.'));
      }
    } catch (err) { bildir(_autoMetin('Hikâye görseli hazırlanamadı.'), true); }
    b.disabled = false;
  });
  const rp = kok.querySelector('[data-eylem=resim-paylas]');
  if (navigator.canShare && navigator.canShare({ files: [new File([''], 'a.jpg', { type: 'image/jpeg' })] })) {
    rp.hidden = false;
    rp.addEventListener('click', async () => {
      if (!(await resimPaylas(`api/sertifika/${s.kod}.jpg`, `cirak-sertifika-${s.seviye}.jpg`, { metin, link }))) bildir(_autoMetin('Telefonun resim paylaşmayı desteklemiyor, "Resmi indir"i kullan.'), true);
    });
  }
}

// Tek bir sertifikayı paylaşma kartıyla gösterir (lüks alım, mazbata…)
function sertifikaGoster(s) {
  const p = panelAc({ ikon: '🏆', baslik: s.baslik || _autoMetin('Sertifika'), govde: `${s.kutlama ? `<p class="kucuk"><b>${esc(s.kutlama)}</b></p>` : ''}<div class="kart sertifika-kart">${sertifikaKartiHtml(s)}</div>
    <button class="dugme gri" data-geri>${_autoHtml("Tamam")}</button>` });
  sertifikaKartiKur(p.querySelector('.sertifika-kart'), s);
  p.querySelector('[data-geri]').addEventListener('click', () => panelKapat());
}

async function sertifikaPaneli() {
  const p = panelAc({ ikon: '🏆', baslik: _oyunMetni("ui.fe0562c82a8d"), rota: 'sertifika', govde: `<p class="soluk">${_autoHtml("Hazırlanıyor…")}</p>` });
  let l, ist;
  try { [l, ist] = await Promise.all([api('sertifikalar'), api('sertifikalar/istatistik')]); } catch (e) { return bildir(e.message, true); }
  if (aktifRota() !== 'sertifika') return;
  const g = p.querySelector('.panel-govde');
  if (!l.length) {
    g.innerHTML = `<div class="kart"><p>${_autoMetin("İlk sertifikan <b>2. seviyede</b> geliyor. Tezgâhını kur, işleri bitir, seviye atla!")}</p>
      <button class="dugme" data-git="tezgahlar">${_autoHtml("İşlerime git")}</button></div>`;
    g.querySelector('[data-git]').addEventListener('click', () => { location.hash = '#/tezgahlar'; });
    return;
  }
  const son = l[0];
  d.altinSertifika = !!son.altin;
  g.innerHTML = `<div class="kart sertifika-kart"><h3>🏆 ${esc(son.baslik)}</h3>${sertifikaKartiHtml(son)}</div>
    <div class="bilgi-izgara">
      <div><small>${_autoHtml("Görüntülenme")}</small><b>${ist.goruntulenme}</b></div>
      <div><small>${_autoHtml("Sertifikandan katılan")}</small><b class="arti">${_autoSablon`${ist.katilan} kişi`}</b></div>
    </div>
    <div class="kart meydan-kart"><b>${_autoHtml("⚔️ Beni geçebilir misin?")}</b>
      <p class="kucuk" style="margin:4px 0 0">${_autoSablon`Sertifikandan gelip kayıt olan arkadaşın, sertifikadaki seviyeye ulaşınca <b>ikinize de ${tl(ist.meydanOdulu)}</b> ödül. Üstüne normal davet ödülleri de işler.`}</p></div>
    <p class="kucuk soluk">${_autoHtml("Seviye atladıkça, ilk dükkânını açınca, ilk tesisini kurunca, ilk milyonunu yapınca, şirket kurunca ve haftanın ilçe birincisi olunca yeni sertifika gelir.")}</p>
    ${l.length > 1 ? `<div class="kart"><h3>${_autoHtml("Tüm sertifikaların")}</h3><div class="sertifika-liste">${l.slice(1).map((x) => `<button class="sertifika-kucuk" data-kod="${esc(x.kod)}" data-sev="${x.seviye}" data-baslik="${esc(x.baslik)}"><img src="api/sertifika/${esc(x.kod)}.jpg" alt="" loading="lazy"><span>${esc(x.baslik)}</span></button>`).join('')}</div></div>` : ''}`;
  sertifikaKartiKur(g.querySelector('.sertifika-kart'), son);
  g.querySelectorAll('.sertifika-kucuk').forEach((b) => b.addEventListener('click', () => {
    const s = { kod: b.dataset.kod, seviye: Number(b.dataset.sev), baslik: b.dataset.baslik };
    const k = g.querySelector('.sertifika-kart');
    k.innerHTML = `<h3>🏆 ${esc(s.baslik)}</h3>` + sertifikaKartiHtml(s);
    sertifikaKartiKur(k, s);
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

// ---------- Bildirim merkezi: bildirimler ve hesap hareketleri ----------
const BILDIRIM_IKON = { mesaj: '💬', seyyar: '🧺', izin: '⚠️', raf: '📦', borc: '🚨', kapandi: '❌', ruhsat: '✅', seviye: '⭐', davet: '🎉', gorev: '🎁', uretim: '🏭', pazar: '📈', secim: '🗳️', duyuru: '📣' };
const HAREKET_IKON = {
  seyyar: '🧺', ekipman: '🧺', stok: '📦', oto_tedarik: '📦', kasa: '🏪', depozito: '🏪', kurulum: '🔧', ruhsat: '📄', kapanis: '🏪', iade: '↩️',
  pazar: '📈', uretim: '🏭', tesis: '🏭', enerji: '⚡', sigorta: '🛡️', banka: '🏦', yatirim: '🥇', tedarik: '🤝', odul: '🏆', bonus: '🎁',
  davet: '🎉', duzeltme: '🛠️', secim: '🗳️', sirket: '🏛️', gorev: '🎯', izin: '📄', ceza: '🚨', bahsis: '💵',
  borsa: '📈', reklam: '📣', ihale: '📑', mulk: '🏠', isletme_gider: '🏪', kapanis_: '🏪', kupon: '🎟️', kart: '💳', icra: '⚖️',
  hosgeldin: '👋', davet_hediye: '🎁', davet_odul: '🏆', referans: '🤝', paylasim: '🔗',
  ekipman_satis: '🧺', seyyar_malzeme: '🥖', cirak: '👷', seyyar_ciro: '💵', seyyar_servis: '🛵',
  eglence: '🎟️', tatil: '🏖️', ev: '🏠', kumar: '🎰', yetenek: '✨', vergi: '🧾', havale: '💸', kredi: '🏦', faiz: '🏦', varlik: '💎', magaza: '🛍️',
  tasinma: '🚚', seyahat: '🧳',
};
function gunAdi(ms) {
  const tarih = new Date(ms + 3 * 3600000), b = new Date(simdi() + 3 * 3600000);
  const g = (x) => x.toISOString().slice(0, 10);
  if (g(tarih) === g(b)) return t('notify.today');
  if (g(tarih) === g(new Date(b.getTime() - 86400000))) return t('notify.yesterday');
  return tarih.toLocaleDateString(aktifDil(), { day: 'numeric', month: 'long', weekday: 'long', timeZone: 'UTC' });
}
function saatYaz(ms) { return new Date(ms + 3 * 3600000).toISOString().slice(11, 16); }

// Bildirimler panelindeki sekme sayaçları: okunmamış bildirim ve görülmemiş hesap hareketi
function sekmeSayaci(n) { return n > 0 ? `<span class="sekme-sayac" aria-label="${n}">${n > 99 ? '99+' : n}</span>` : ''; }
function sekmeSayilari() {
  const g = d.genel || {};
  for (const [s, n] of [['bildirim', g.okunmamisBildirim], ['hareket', g.yeniHareket]]) {
    const b = document.querySelector(`#panel-katman .sekmeler [data-sekme="${s}"]`);
    if (!b) continue;
    const eski = b.querySelector('.sekme-sayac');
    const yeni = b.getAttribute('aria-selected') === 'true' ? 0 : Number(n) || 0;
    if (eski && String(yeni) === eski.getAttribute('aria-label')) continue;
    if (eski) eski.remove();
    if (yeni > 0) b.insertAdjacentHTML('beforeend', sekmeSayaci(yeni));
  }
}
// Bildirim metninde geçen bölüm adları (ör. yönetimin duyurusundaki "Hesabım → Ayarlar") dokunulabilir bağlantı olur.
// Metin önceden kaçırılmış (escape) HTML'dir; yalnızca tam kelime eşleşmeleri sarılır.
const BOLUM_BAGLANTILARI = [
  [['Hesabım', 'Hesabim', 'Hesap'], '#/hesap/profil'], [['Ayarlar', 'Ayarlarım'], '#/hesap/ayarlar'], [['Bildirimler'], '#/bildirimler'],
  [['Mesajlar', 'Sohbet'], '#/mesajlar'], [['Harita'], '#/harita'], [['İşlerim', 'Tezgâhlarım'], '#/tezgahlar'], [['Günlük görevler', 'Görevler'], '#/gorevler'],
  [['Sektörler', 'Üretim'], '#/uretim'], [['Üretim bölgeleri', 'Bölgeler'], '#/bolge'], [['Tefon Bank', 'Banka'], '#/banka'], [['Sıralama'], '#/siralama'], [['Davet et', 'Davetler'], '#/davet'],
  [['Yaşam', 'Keyif'], '#/yasam'], [['Belediye'], '#/belediye'], [['Borsa'], '#/borsa'], [['Emeği geçenler'], '#/jenerik'], [['Bize yaz', 'İletişim'], '#/iletisim'],
  [['Seçimler'], '#/secim'], [['Yetenekler'], '#/yetenekler'], [['Sertifikalar', 'Sertifika'], '#/sertifika'],
  [['Yenilikler'], '#/yenilikler'], [['Arkadaşlar'], '#/arkadaslar'], [['Vergi Dairesi'], '#/vergi'], [['Kamu ihaleleri', 'İhaleler'], '#/ihale'], [['Meslek odaları', 'Esnaf Odası', 'Ticaret Odası', 'Sanayi Odası'], '#/odalar'], [['Destek'], '#/hesap/destek'],
];
let bolumDeseni = null;
// Bildirim kartına dokununca gidilecek yer: adres bildirim merkezinin kendisiyse (eski duyurular) metinde geçen ilk bölüm
function bildirimAdresi(x) {
  if (x.adres && x.adres !== '#/bildirimler') return x.adres;
  const m = /data-bolum-git="([^"]+)"/.exec(bolumBaglantilari(esc(bildirimMetni(x, 'metin'))));
  return m ? m[1] : (x.adres || '');
}
function bolumBaglantilari(html) {
  if (!bolumDeseni) {
    const adlar = [];
    for (const [l, adres] of BOLUM_BAGLANTILARI) for (const ad of l) adlar.push([ad, adres]);
    // yerel dildeki sekme adları da (ör. İngilizcede "Account", "Settings") tanınır
    for (const [k, adres] of [['nav.hesap', '#/hesap/profil'], ['account.settings', '#/hesap/ayarlar'], ['nav.bildirimler', '#/bildirimler'], ['nav.mesajlar', '#/mesajlar']]) { const v = t(k); if (v && v !== k) adlar.push([v, adres]); }
    adlar.sort((a, b) => b[0].length - a[0].length);
    const harita = new Map(adlar.map(([a, adres]) => [a.toLocaleLowerCase('tr'), adres]));
    const kac = (x) => esc(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    bolumDeseni = { re: new RegExp('(^|[^\\p{L}])(' + adlar.map(([a]) => kac(a)).join('|') + ')(?![\\p{L}])', 'giu'), harita };
  }
  return html.replace(bolumDeseni.re, (m, on, ad) => { const adres = bolumDeseni.harita.get(ad.toLocaleLowerCase('tr')); return adres ? `${on}<a href="${adres}" class="bolum-bag" data-bolum-git="${adres}">${ad}</a>` : m; });
}
async function bildirimlerPaneli(sekme = d.bildirimSekmesi || 'bildirim') {
  d.bildirimSekmesi = sekme;
  const gn = d.genel || {};
  // açılan sekmenin sayacı bu açılışta okunmuş sayılır; diğer sekmeninki kalır
  const okunmamisB = Number(gn.okunmamisBildirim) || 0, yeniH = Number(gn.yeniHareket) || 0;
  const p = panelAc({
    ikon: sekme === 'hareket' ? '💳' : '🔔', baslik: t('nav.bildirimler'), rota: 'bildirimler',
    govde: `<div class="sekmeler" role="tablist">
        <button role="tab" data-sekme="bildirim" aria-selected="${sekme === 'bildirim'}">🔔 ${esc(t('nav.bildirimler'))}${sekme === 'bildirim' ? '' : sekmeSayaci(okunmamisB)}</button>
        <button role="tab" data-sekme="hareket" aria-selected="${sekme === 'hareket'}">💳 ${esc(t('account.transactions'))}${sekme === 'hareket' ? '' : sekmeSayaci(yeniH)}</button>
      </div>
      ${sekme === 'hareket' ? `<div class="hareket-ozet" id="h-ozet"></div><p class="kucuk soluk">${esc(t('notify.transactionsRetention'))}</p>` : `<div class="bildirim-ust"><span class="kucuk soluk">${esc(t('notify.retention'))}</span><button class="dugme gri kucuk" data-eylem="hepsini-sil">🗑️ ${esc(t('notify.deleteAll'))}</button></div>`}
      <ul class="${sekme === 'hareket' ? 'hareket-liste' : 'bildirim-liste2'}" id="b-liste"><li class="soluk">${_autoHtml("Yükleniyor…")}</li></ul>`,
    hazir(g) {
      g.querySelectorAll('[data-sekme]').forEach((b) => b.addEventListener('click', () => { ses.tik(); bildirimlerPaneli(b.dataset.sekme); }));
    },
  });
  const ul = p.querySelector('#b-liste');
  let sonGun = '';
  const gunBasligi = (ms) => {
    const g = gunAdi(ms);
    if (g === sonGun) return '';
    sonGun = g;
    return `<li class="gun-baslik">${esc(g)}</li>`;
  };
  if (sekme === 'hareket') {
    let bugunGiren = 0, bugunCikan = 0, gorulen = null;
    sayfaliListe(ul, {
      async yukle(once) {
        const r = await api('hareketler' + (once ? '?once=' + once : ''));
        if (!once && r.gorulen != null) {
          gorulen = r.gorulen;
          if (r.hareket) d.hareketSonId = Math.max(d.hareketSonId || 0, r.hareket);
          // sekme açıldı: hepsi görüldü
          api('hareketler/goruldu', {}).then(() => { d.genel.yeniHareket = 0; sekmeSayilari(); }).catch(() => {});
        }
        for (const x of r.liste) if (gunAdi(x.zaman) === t('notify.today')) { if (x.tutar > 0) bugunGiren += x.tutar; else bugunCikan -= x.tutar; }
        const oz = p.querySelector('#h-ozet');
        if (oz) oz.innerHTML = `<div><small>${_autoHtml("Bugün giren")}</small><b class="arti">+${tl(bugunGiren)}</b></div><div><small>${_autoHtml("Bugün çıkan")}</small><b class="eksi">−${tl(bugunCikan)}</b></div><div><small>${_autoHtml("Bakiyen")}</small><b>${tl(d.genel.oyuncu.bakiye)}</b></div>`;
        return { ...r, imlec: r.liste.length ? r.liste[r.liste.length - 1].id : once };
      },
      satir: (x) => `${gunBasligi(x.zaman)}<li class="hareket${gorulen != null && x.id > gorulen ? ' yeni' : ''}" data-tur="${esc(x.tur)}">
          <span class="h-ikon ${x.tutar >= 0 ? 'giris' : 'cikis'}" aria-hidden="true">${HAREKET_IKON[x.tur] || (x.tutar >= 0 ? '💰' : '💸')}</span>
          <span class="h-yazi">${esc(x.aciklama)}<small>${saatYaz(x.zaman)}${x.bakiyeSonrasi != null ? ` · ${esc(t('notify.balance'))} ${tl(x.bakiyeSonrasi)}` : ''}</small></span>
          <span class="h-tutar ${x.tutar >= 0 ? 'arti' : 'eksi'}" title="${tamTl(x.tutar)}">${isaretliTl(x.tutar)}</span></li>`,
      bos: t('notify.transactionsEmpty'),
    });
    return;
  }
  sayfaliListe(ul, {
    async yukle(once) {
      const r = await api('bildirimler' + (once ? '?once=' + once : ''));
      return { ...r, imlec: r.liste.length ? r.liste[r.liste.length - 1].id : once };
    },
    satir: (x) => `${gunBasligi(x.zaman)}<li class="bildirim-kart ${x.okundu ? '' : 'yeni'}" ${bildirimAdresi(x) ? `data-adres="${esc(bildirimAdresi(x))}" role="button" tabindex="0"` : ''}>
        <span class="b-ikon">${BILDIRIM_IKON[x.tur] || '🔔'}</span>
        <span class="b-yazi"><b>${esc(bildirimMetni(x,'baslik').replace(/^\p{Extended_Pictographic}️?\s*/u, ''))}</b><span>${bolumBaglantilari(esc(bildirimMetni(x,'metin')))}</span><small>${saatYaz(x.zaman)}</small></span>
        <button class="b-sil" data-sil="${x.id}" aria-label="${esc(t('notify.delete'))}" title="${esc(t('notify.delete'))}">✕</button></li>`,
    bos: t('notify.notificationsEmpty'),
  });
  ul.addEventListener('click', async (e) => {
    const bag = e.target.closest('[data-bolum-git]');
    if (bag) { e.preventDefault(); e.stopPropagation(); ses.tik(); const a = bag.dataset.bolumGit; if (location.hash === a) rotaUygula(); else location.hash = a; return; }
    const sil = e.target.closest('[data-sil]');
    if (sil) {
      e.stopPropagation();
      const li = sil.closest('li');
      li.classList.add('siliniyor');
      try { await api('bildirimler/sil', { id: Number(sil.dataset.sil) }); } catch (err) { li.classList.remove('siliniyor'); return bildir(err.message, true); }
      ses.tik();
      setTimeout(() => {
        const onceki = li.previousElementSibling, sonraki = li.nextElementSibling;
        li.remove();
        // o güne ait başka bildirim kalmadıysa gün başlığını da kaldır
        if (onceki && onceki.classList.contains('gun-baslik') && (!sonraki || sonraki.classList.contains('gun-baslik'))) onceki.remove();
        if (!ul.querySelector('.bildirim-kart')) ul.innerHTML = `<li class="soluk">${esc(t('notify.notificationsEmpty'))}</li>`;
      }, 220);
      return;
    }
    const li = e.target.closest('[data-adres]');
    if (!li) return;
    ses.tik();
    const a = li.dataset.adres;
    if (a === '#/mesajlar') { d.mesajSekmesi = 'ozel'; }
    if (location.hash === a) rotaUygula(); else location.hash = a;
  });
  const hs = p.querySelector('[data-eylem=hepsini-sil]');
  if (hs) hs.addEventListener('click', async () => {
    if (!(await onayla(t('notify.deleteConfirm'), { evet: t('notify.deleteAll'), tehlike: true, ikon: '🗑️' }))) return;
    if ((await eylem(hs, () => api('bildirimler/sil', {}))) === undefined) return;
    bildir(_autoMetin('Bildirimler silindi.'));
    bildirimlerPaneli('bildirim');
  });
  // açılınca hepsi okundu sayılır
  try {
    await api('bildirimler/okundu', {});
    d.genel.okunmamisBildirim = 0;
    toplaButonuGuncelle();
    sekmeSayilari();
  } catch (e) { /* sessiz */ }
}

// İletişim (oyun içinden)
function iletisimPaneli() {
  panelAc({
    ikon: '✉️', baslik: _autoMetin('Bize yaz'), rota: 'iletisim', alt: _autoMetin('Soru, öneri ya da hata bildirimi'),
    // 0.50: ekip üyeleri hata ve fikirlerini Katkıda Bulun bölümünden gönderir (katkı olarak kaydedilir, yeniliklerde adı görünür)
    govde: (d.genel.ekipUyesi ? `<div class="kart ekip-yonlendir"><p style="margin:0 0 8px">🛠️ ${_autoHtml('Ekip üyesisin: hata bildirimi, fikir ve kod katkılarını Katkıda Bulun bölümünden gönder. Böylece katkın kaydedilir ve uygulanırsa yeniliklerde adın görünür.')}</p>
      <a class="dugme mavi" href="#/gelistirici">🛠️ ${_autoHtml('Katkıda Bulun')}</a></div>` : '') + iletisimFormu(true),
    hazir(g) {
      const f = g.querySelector('#iletisim-formu');
      // ekip üyesi "Hata bildirimi" ya da "Öneri" seçerse katkı formuna yönlendirilir
      if (d.genel.ekipUyesi) f.konu.addEventListener('change', () => { if (f.konu.selectedIndex === 1 || f.konu.selectedIndex === 2) location.hash = '#/gelistirici'; });
      if (!d.genel.oyuncu) dogrulamaKur(f);
      // 0.43: banka sayfasındaki MASAK uyarısından gelindiyse konu ve metin hazır gelir
      if (rotaEki() === 'masak') {
        f.konu.selectedIndex = 3;
        f.metin.value = _autoMetin("MASAK incelemesi: banka hesabıma bloke kondu / işlemlerim durduruldu. Havalelerin nedeni şu:") + '\n';
        setTimeout(() => { f.metin.focus(); f.metin.setSelectionRange(f.metin.value.length, f.metin.value.length); }, 50);
      }
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const r = await eylem(f.querySelector('button[type=submit]'), () => api('iletisim', Object.fromEntries(new FormData(f).entries())));
        if (r === undefined) { dogrulamaYenile(f); return; }
        kart({ ikon: '✉️', baslik: _oyunMetni("ui.dfdd15aa8747"), metin: _autoMetin('Teşekkürler! En kısa sürede dönüş yapacağız.'), tur: 'basari' });
        location.hash = '#/hesap';
      });
    },
  });
}

function ilPaneli(id) {
  const v = d.haritaVeri && d.haritaVeri.find((x) => x.id === id);
  if (!v) return;
  ses.tik();
  const benim = d.genel.oyuncu.il.id === id;
  panelAc({ icerikBoyu: true,
    ikon: benim ? '⭐' : '📍', baslik: v.ad, alt: _autoSablon`${_autoHtml(v.bolge)} bölgesi${v.buyuksehir ? _autoHtml(', büyükşehir') : ''}${v.kiyi ? _autoHtml(', kıyı ili') : ''}`,
    govde: `
      <div class="bilgi-izgara">
        <div><small>${_autoHtml("Nüfus")}</small><b>${nufusMetni(v.nufus)}</b></div>
        <div><small>${_autoHtml("Oyuncu")}</small><b>${v.oyuncu}</b></div>
        <div><small>${_autoHtml("Seyyar tezgâh")}</small><b>${v.tezgah}</b></div>
        <div><small>${_autoHtml("Belediye")}</small><b>${_autoHtml("🤖 Bot")}</b></div>
      </div>
      ${benim
        ? `<p>${_autoHtml("Burası senin ilin. İşlerin burada.")}</p><button class="dugme" data-eylem="mahalle">${_autoHtml("🏘️ Mahalleme dön")}</button>`
        : `<p>${_autoMetin("Haritada bu ilin ilçelerine dokun ya da aşağıdan bir ilçe seçip caddesini gez: oradaki oyuncuların tezgâhlarını ve dükkânlarını görürsün, dilersen <b>şube</b> açarsın.")}</p>`}
      <h3 class="bolum-baslik">${_autoHtml("🔥 İlçelerdeki hareket")}</h3><ul class="ilce-canli" data-ilce-canli><li class="soluk kucuk">${_autoHtml("Yükleniyor…")}</li></ul>`,
    async hazir(g) {
      const b = g.querySelector('[data-eylem=mahalle]');
      if (b) b.addEventListener('click', () => { panelKapat(); location.hash = '#/mahalle'; });
      const ul = g.querySelector('[data-ilce-canli]');
      try {
        const l = (await api(`iller/${id}/canli`)).sort((a, x) => x.tezgah + x.dukkan * 2 + x.oyuncu - (a.tezgah + a.dukkan * 2 + a.oyuncu) || a.ad.localeCompare(x.ad, 'tr'));
        ul.innerHTML = l.map((x) => `<li><button data-gez="${x.id}"><b>${esc(x.ad)}${x.id === d.genel.oyuncu.ilce.id ? ' ⭐' : ''}</b><span>👥 ${x.oyuncu}</span><span>🛒 ${x.tezgah}</span><span>🏪 ${x.dukkan}</span><i>${_autoHtml("Gez ›")}</i></button></li>`).join('');
        ul.querySelectorAll('[data-gez]').forEach((x) => x.addEventListener('click', () => {
          const iid = Number(x.dataset.gez);
          if (iid === d.genel.oyuncu.ilce.id) { panelKapat(); ziyaretBitir(); location.hash = '#/mahalle'; } else ilceyiGez(iid, { ilId: id });
        }));
      } catch (e) { ul.innerHTML = `<li class="soluk kucuk">${esc(e.message)}</li>`; }
    },
  });
}

async function ilcePaneli(ilceId, ilId) {
  let liste = [];
  let canli = [];
  try { [liste, canli] = await Promise.all([api(`iller/${ilId}/ilceler`), api(`iller/${ilId}/canli`).catch(() => [])]); } catch (e) { return; }
  const v = liste.find((x) => x.id === ilceId);
  if (!v) return;
  const canliV = canli.find((x) => x.id === ilceId);
  ses.tik();
  const benim = d.genel.oyuncu.ilce.id === ilceId;
  panelAc({ icerikBoyu: true,
    ikon: benim ? '⭐' : '🏙️', baslik: v.ad, alt: _autoSablon`${esc(harita.ilAdi(ilId))} ilçesi`,
    govde: `
      <div class="bilgi-izgara">
        <div><small>${_autoHtml("Nüfus")}</small><b>${nufusMetni(v.nufus)}</b></div>
        ${v.oyuncu != null ? `<div><small>${_autoHtml("Oyuncu")}</small><b>${v.oyuncu}</b></div>` : ''}
        ${canliV ? `<div><small>${_autoHtml("Açık tezgâh")}</small><b>${canliV.tezgah}</b></div><div><small>${_autoHtml("Oyuncu dükkânı")}</small><b>${canliV.dukkan}</b></div>` : ''}
      </div>
      ${benim
        ? `<p>${_autoSablon`Senin ilçen. ${d.cadde && d.cadde.isimler ? esc(d.cadde.isimler.mahalle) : 'Mahallen'} burada.`}</p><button class="dugme" data-eylem="mahalle">${_autoHtml("📍 Sokağıma in")}</button>`
        : `<p>${_autoMetin("Bu ilçenin caddesini gezebilir, oradaki oyuncuların tezgâhlarını ve dükkânlarını görebilirsin. Beğendiğin kiralık dükkânı <b>şube</b> olarak açabilirsin.")}</p>
          <button class="dugme mavi" data-eylem="gez">${Number(ilId) !== Number(d.genel.oyuncu.il.id) ? _autoHtml("🧳 Yolculuğa çık") : _autoHtml("👀 Caddesini gez")}</button><button class="dugme yesil" data-eylem="sube">${_autoHtml("🏪 Burada şube aç")}</button>
          <button class="dugme gri" data-eylem="tasin">${_autoHtml("🚚 Buraya taşın")}</button>`}`,
    hazir(g) {
      const b = g.querySelector('[data-eylem=mahalle]');
      if (b) b.addEventListener('click', () => { panelKapat(true); d.mahalleUstten = true; location.hash = '#/mahalle'; });
      const sb = g.querySelector('[data-eylem=sube]');
      if (sb) sb.addEventListener('click', () => subePaneli(ilceId));
      const gz = g.querySelector('[data-eylem=gez]');
      if (gz) gz.addEventListener('click', () => ilceyiGez(ilceId, { ilId }));
      const ts = g.querySelector('[data-eylem=tasin]');
      if (ts) ts.addEventListener('click', () => { panelKapat(true); location.hash = '#/tasinma/' + ilceId; });
    },
  });
}

// Başka ilçede şube: o ilçenin caddesindeki kiralık dükkânlar liste hâlinde
async function subePaneli(ilceId) {
  let r;
  try { r = await api('sube/' + ilceId); } catch (e) { return bildir(e.message, true); }
  const kiralik = r.yerler.filter((y) => !y.isletme);
  const dolu = r.yerler.filter((y) => y.isletme);
  panelAc({ icerikBoyu: true,
    ikon: '🏪', baslik: _autoSablon`${r.ilce.ad} şubesi`, alt: `${esc(r.ilce.il)} · ${esc(r.isimler ? r.isimler.anaCadde || '' : '')}`,
    govde: `${r.durum.engel ? `<div class="kart uyari">🔒 ${esc(r.durum.engel)}</div>` : `<div class="kart basari">${_autoSablon`Şube hakkın: <b>${r.durum.sayi}/${r.durum.sinir}</b> kullanıldı.`}</div>`}
      <h3 class="bolum-baslik">${_autoSablon`Kiralık dükkânlar (${kiralik.length})`}</h3>
      ${kiralik.length ? `<ul class="tezgah-listesi">${kiralik.map((y) => `<li><button class="tezgah-satiri" data-no="${y.no}" ${r.durum.engel ? 'disabled' : ''}>
        <span class="resim">🏪</span><span class="bilgi"><span class="ad">${_autoSablon`${esc(y.boyutAdi)} dükkân · ${y.m2} m²`}</span><br><span class="alt">${_autoSablon`No ${y.no}`}</span></span>
        <span class="sag">${tl(y.kira)}<small>${_autoHtml("aylık kira")}</small></span></button></li>`).join('')}</ul>` : `<p class="soluk">${_autoHtml("Bu caddede kiralık dükkân kalmadı.")}</p>`}
      <details class="kilitli-grup"><summary>${_autoSablon`Caddedeki dükkânlar (${dolu.length})`}</summary><ul class="satirlar">${dolu.map((y) => `<li><span>${y.isletme.simge} ${esc(y.isletme.ad)}</span><span class="sag kucuk soluk">${esc(_dukkanTuru(y.isletme.turAdi))}</span></li>`).join('')}</ul></details>`,
    hazir(g) {
      g.querySelectorAll('[data-no]').forEach((b) => b.addEventListener('click', () => {
        const y = kiralik.find((x) => x.no === Number(b.dataset.no));
        kiralamaPaneli(y, null, '', ilceId);
      }));
    },
  });
}

// ---------- Dükkânlar ----------
function dukkanPaneli(no) {
  // başka bir ilçeyi gezerken o ilçenin dükkânları: kiralık olan şube olarak kiralanabilir
  const kaynak = d.ziyaret ? d.ziyaret.yerler : d.cadde && d.cadde.yerler;
  const y = kaynak && kaynak.find((x) => x.no === no);
  if (!y) return;
  if (!y.isletme) return d.ziyaret && !d.ziyaret.ilce.benim ? kiralamaPaneli(y, null, '', d.ziyaret.ilce.id) : kiralamaPaneli(y);
  if (y.isletme.benim) return isletmePaneli(y.isletme.id);
  return baskaDukkanPaneli(y);
}

// Dükkân yerinin adresi: numara ve cadde (ana cadde ya da arka sokak) — taşırken ve kiralarken karışmasın
function yerAdresi(no, yerler = null, isimler = null) {
  const kaynak = yerler || (d.ziyaret ? d.ziyaret.yerler : d.cadde && d.cadde.yerler) || [];
  const ad = isimler || (d.ziyaret ? d.ziyaret.isimler : d.cadde && d.cadde.isimler) || {};
  const y = kaynak.find((x) => x.no === no);
  const arka = y && (y.sira || 0) > 0;
  const cadde = arka ? (ad.arkaSokak || _autoMetin('Arka sokak')) : (ad.anaCadde || _autoMetin('Ana cadde'));
  return _autoSablon`No ${no} · ${cadde}${arka ? _autoMetin(' (arka sokak)') : ''}`;
}
// 0.57.13: kiralama ekranında sektör arama, filtre ve sıralama. Tür seçilince panel yeniden çizildiği için
// filtre modül düzeyinde tutulur; harita/caddeden yeni bir kiralama açılınca sıfırlanır.
const TUR_FILTRE_BOS = { q: '', kat: '', tip: '', butce: false, acik: false, sira: '' };
const turFiltre = { ...TUR_FILTRE_BOS };
const turFiltreAktif = () => Object.keys(TUR_FILTRE_BOS).some((k) => turFiltre[k] !== TUR_FILTRE_BOS[k]);
// Türkçe harfler ve aksanlar sadeleşir ("cicek" → Çiçekçi); Latin dışı yazılar (Arapça, Çince, Rusça) olduğu gibi kalır
const turAramaMetni = (s) => String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c').replace(/[.,;:!?()'"\/-]+/g, ' ').replace(/\s+/g, ' ').trim();
const turToplami = (b, t) => (t.kira || b.kira) * 2 + t.kurulum + b.ruhsat;
function turSuzgeci(b) {
  const q = turAramaMetni(turFiltre.q);
  const kelimeler = q ? q.split(' ') : [];
  const bakiye = Number(d.genel.oyuncu.bakiye) || 0;
  const sonuc = [];
  b.turler.forEach((t, sira) => {
    if (turFiltre.kat && t.kategoriAdi !== turFiltre.kat) return;
    if (turFiltre.tip === 'mal' && t.hizmet) return;
    if (turFiltre.tip === 'hizmet' && !t.hizmet) return;
    if (turFiltre.acik && t.kilitli) return;
    if (turFiltre.butce && (t.kilitli || turToplami(b, t) > bakiye)) return;
    let puan = 0, urunIpucu = [];
    if (kelimeler.length) {
      const ad = turAramaMetni(`${_dukkanTuru(t.ad)} ${t.ad}`);
      const kat = turAramaMetni(`${_dukkanKategorisi(t.kategoriAdi)} ${t.kategoriAdi}`);
      const urunler = (t.urunler || []).map((u) => ({ ad: _urunAdi(u), m: turAramaMetni(`${_urunAdi(u)} ${u}`) }));
      const hepsi = `${ad} ${kat} ${urunler.map((u) => u.m).join(' ')}`;
      if (!kelimeler.every((k) => hepsi.includes(k))) return;
      puan = ad.startsWith(q) ? 0 : ad.split(' ').some((w) => w.startsWith(kelimeler[0])) ? 1 : ad.includes(kelimeler[0]) ? 2 : kat.includes(kelimeler[0]) ? 3 : 4;
      // tür adı tutmadıysa hangi ürün yüzünden bulunduğu kartta gösterilir. Ürünle bulunanlarda, aranan ürün
      // dükkânın ana malıysa (listede önde, birden çok ürünü tutuyorsa) öne çıkar: "ekmek" → önce Fırın, sonra Bakkal
      if (puan >= 3) {
        const tutan = urunler.map((u, i) => ({ ...u, i })).filter((u) => kelimeler.some((k) => u.m.includes(k)));
        urunIpucu = tutan.map((u) => u.ad).slice(0, 3);
        if (puan === 4 && tutan.length) puan = 4 + (tutan[0].i / Math.max(1, urunler.length)) - Math.min(tutan.length, 4) * 0.05;
      }
    }
    sonuc.push({ t, sira, puan, urunIpucu });
  });
  const anahtar = {
    kurulum: (x) => x.t.kurulum, kira: (x) => x.t.kira || b.kira, toplam: (x) => turToplami(b, x.t), calisan: (x) => x.t.calisan,
  }[turFiltre.sira];
  sonuc.sort((x, y) => {
    if (turFiltre.sira === 'ad') return _dukkanTuru(x.t.ad).localeCompare(_dukkanTuru(y.t.ad), aktifDil());
    if (anahtar) return anahtar(x) - anahtar(y) || x.sira - y.sira;
    return x.puan - y.puan || x.sira - y.sira;
  });
  // kilitli türler sıralamada hep sona
  if (turFiltre.sira) sonuc.sort((x, y) => Number(x.t.kilitli) - Number(y.t.kilitli));
  return sonuc;
}
function turDugmesi(t, seciliTur, urunIpucu = []) {
  return `<button data-tur="${t.kod}" aria-pressed="${t.kod === seciliTur}" ${t.kilitli ? 'disabled' : ''}>
          <span class="tur-ikon">${t.simge}</span><b>${esc(_dukkanTuru(t.ad))}</b>${t.kilitli ? `<small class="kilit-rozet">${_oyunHtml("account.level", {level:t.seviye})}</small>` : `<small>${_oyunHtml("rental.setup", {amount:tl(t.kurulum)})}</small>${t.kira ? `<small>${_autoSablon`Kira ${tl(t.kira)}/ay`}</small>` : ''}<small>${_oyunHtml("rental.staff", {count:t.calisan})}${t.hizmet ? ', '+_oyunHtml("rental.noStock") : ''}</small>`}${urunIpucu.length ? `<small class="tur-eslesme">🔎 ${esc(urunIpucu.join(', '))}</small>` : ''}</button>`;
}
function turListesiHtml(b, seciliTur) {
  const liste = turSuzgeci(b);
  if (!liste.length) return `<div class="kart tur-bos"><p>🔎 ${_oyunHtml("rental.noMatch")}</p>
    <div class="tur-bos-dugmeler">${turFiltreAktif() ? `<button class="dugme kucuk" type="button" data-tur-temizle>${_oyunHtml("rental.clearFilters")}</button>` : ''}
    ${turFiltre.q.trim().length >= 2 ? `<button class="dugme mavi kucuk" type="button" data-tur-oner>💡 ${_oyunHtml("rental.suggestThis")}</button>` : ''}</div></div>`;
  // önerilen sırada ve aramasız görünümde kategori başlıkları korunur; arama ya da sıralamada tek liste
  if (!turFiltre.q.trim() && !turFiltre.sira) {
    const katlar = [...new Set(liste.map((x) => x.t.kategoriAdi))];
    return katlar.map((kat) => `
        <div class="kategori-adi">${esc(_dukkanKategorisi(kat))}</div>
        <div class="tur-secimi">${liste.filter((x) => x.t.kategoriAdi === kat).map((x) => turDugmesi(x.t, seciliTur)).join('')}</div>`).join('');
  }
  return `<div class="tur-secimi">${liste.map((x) => turDugmesi(x.t, seciliTur, x.urunIpucu)).join('')}</div>`;
}
function turFiltreHtml(b) {
  const katlar = [...new Set(b.turler.map((t) => t.kategoriAdi))];
  const cip = (veri, secili, yazi, sayi = null) => `<button type="button" class="cip${secili ? ' secili' : ''}" ${veri} aria-pressed="${secili}">${yazi}${sayi != null ? `<small class="cip-sayi">${sayi}</small>` : ''}</button>`;
  // 0.57.14: seçenekler açılıp kapanan anahtarlar (işaret kutusu görünümü)
  const anahtar = (veri, secili, simge, yazi) => `<button type="button" class="tf-anahtar${secili ? ' secili' : ''}" ${veri} aria-pressed="${secili}"><span class="tf-kutu" aria-hidden="true"></span><span class="tf-simge" aria-hidden="true">${simge}</span>${yazi}</button>`;
  const siralar = [['', 'rental.sortDefault'], ['toplam', 'rental.sortTotal'], ['kurulum', 'rental.sortSetup'], ['kira', 'rental.sortRent'], ['calisan', 'rental.sortStaff'], ['ad', 'rental.sortName']];
  // çevirilerdeki baştaki simgeler ayrı yazıldığı için ayıklanır ("📦 Mal satanlar" → "Mal satanlar")
  const sade = (k) => _oyunHtml(k).replace(/^[^\p{L}\p{N}]+/u, '');
  return `<div class="tur-filtre">
      <label class="arama-alan tf-ara"><svg class="tf-ara-simge" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><input type="search" data-tur-ara enterkeyhint="search" autocomplete="off" spellcheck="false" value="${esc(turFiltre.q)}" placeholder="${_oyunHtml("rental.searchHint")}" aria-label="${_oyunHtml("rental.searchHint")}"><button type="button" class="tf-sil" data-tur-ara-sil aria-label="${_autoHtml("Aramayı temizle")}"${turFiltre.q ? '' : ' hidden'}>✕</button></label>
      <div class="cipler tf-katlar" data-tur-katlar>${cip('data-kat=""', !turFiltre.kat, _oyunHtml("rental.all"), b.turler.length)}${katlar.map((k) => cip(`data-kat="${esc(k)}"`, turFiltre.kat === k, esc(_dukkanKategorisi(k)), b.turler.filter((t) => t.kategoriAdi === k).length)).join('')}</div>
      <div class="tf-anahtarlar">
        ${anahtar('data-tip="mal"', turFiltre.tip === 'mal', '📦', sade("rental.filterGoods"))}
        ${anahtar('data-tip="hizmet"', turFiltre.tip === 'hizmet', '🛠️', sade("rental.filterService"))}
        ${anahtar('data-anahtar="butce"', turFiltre.butce, '💰', sade("rental.filterBudget"))}
        ${anahtar('data-anahtar="acik"', turFiltre.acik, '🔓', sade("rental.filterUnlocked"))}
      </div>
      <div class="tur-filtre-sira">
        <label class="tf-sirala"><span>${_oyunHtml("rental.sortLabel")}</span><select data-tur-sira>${siralar.map(([v, k]) => `<option value="${v}"${turFiltre.sira === v ? ' selected' : ''}>${_oyunHtml(k)}</option>`).join('')}</select></label>
        <span class="tf-sonuc" data-tur-sonuc></span>
        <button type="button" class="tf-temizle" data-tur-temizle${turFiltreAktif() ? '' : ' hidden'}>✕ ${_oyunHtml("rental.clearFilters")}</button>
      </div>
    </div>`;
}
let kiralamaIstegi = 0;
async function kiralamaPaneli(y, seciliTur = null, ad = '', ilceId = null, tabelaOdak = false) {
  if (!seciliTur && !tabelaOdak) Object.assign(turFiltre, TUR_FILTRE_BOS);
  const istek = ++kiralamaIstegi;
  let b;
  try { b = await api(`kiralama/${y.no}${ilceId ? `?ilce=${ilceId}` : ''}`); } catch (e) { return bildir(e.message, true); }
  if (istek !== kiralamaIstegi) return;
  const tur = b.turler.find((t) => t.kod === seciliTur);
  const toplam = tur ? (tur.kira || b.kira) * 2 + tur.kurulum + b.ruhsat : 0;
  const varsayilanAd = ad || (tur ? Array.from(`${d.genel.oyuncu.kullaniciAdi} ${_dukkanTuru(tur.ad)}`).slice(0, 18).join('') : '');
  panelAc({
    kaydirmayiKoru: !tabelaOdak,
    ikon: '🏪', baslik: b.sube ? _autoSablon`Şube: ${b.ilce.ad}` : _oyunMetni("rental.title"), alt: `<b>📍 ${esc(yerAdresi(y.no))}</b><br>` + _autoSablon`${b.sube ? `${esc(b.ilce.il)} · ` : ''}${esc(y.boyutAdi)} dükkân, ${y.m2} m²`,
    govde: `${b.sube && b.subeDurumu && b.subeDurumu.engel ? `<div class="kart uyari">🔒 ${esc(b.subeDurumu.engel)}</div>` : ''}
      <div class="bilgi-izgara">
        <div><small>${_oyunHtml("rental.monthlyRent")}</small><b>${tl(b.kira)}</b></div>
        <div><small>${_oyunHtml("rental.depositTwo")}</small><b>${tl(b.depozito)}</b></div>
        <div><small>${_oyunHtml("rental.permitFee")}</small><b>${tl(b.ruhsat)}</b></div>
        <div><small>${_oyunHtml("rental.dailyRent")}</small><b>${tl(b.kira / 30)}</b></div>
      </div>
      <p class="kucuk soluk" style="margin:-2px 2px 6px">${_autoHtml("Kira işletme türüne göre değişir: kalabalık ilçede kârlı işler daha yüksek kira öder. Küçük ilçede kira, elektrik ve maaş daha düşüktür.")}</p>
      ${b.davetIndirim > 0 ? `<p class="kucuk arti" style="margin:-2px 2px 8px">🏷️ ${_autoSablon`Davet indirimin uygulandı: %${Math.round(b.davetIndirim * 100)} (tam kira ${tl(b.tamKira)})`}</p>` : ''}
      <h3 class="bolum-baslik">${_oyunHtml("rental.choose")}</h3>
      ${turFiltreHtml(b)}
      <div id="tur-listesi">${turListesiHtml(b, seciliTur)}</div>
      ${tur ? `
      <label class="alan"><span>${_oyunHtml("rental.name")}</span><input data-tabela-ad name="ad" maxlength="18" value="${esc(varsayilanAd)}" autocomplete="off"></label>
      <p class="kucuk isim-durum" id="isim-durum">${_oyunHtml("rental.signHint")}</p>
      <div class="kart"><table class="tablo">
        <tr><td>${_autoHtml("Aylık kira")}</td><td>${tl(tur.kira || b.kira)}</td></tr>
        <tr><td>${_oyunHtml("rental.deposit")}</td><td>${tl((tur.kira || b.kira) * 2)}</td></tr>
        <tr><td>${_oyunHtml("rental.decor")}</td><td>${tl(tur.kurulum)}</td></tr>
        <tr><td>${_oyunHtml("rental.application")}</td><td>${tl(b.ruhsat)}</td></tr>
        <tr class="toplam"><td>${_oyunHtml("rental.payNow")}</td><td>${tl(toplam)}</td></tr>
      </table>
      <p class="kucuk soluk" style="margin-bottom:0">${_oyunHtml("rental.dailyCosts", {count:tur.calisan})}</p></div>
      <button class="dugme yesil" data-eylem="kirala" ${d.genel.oyuncu.bakiye < toplam ? 'disabled' : ''}>🔑 ${_oyunHtml("rental.apply")}</button>
      ${d.genel.oyuncu.bakiye < toplam ? `<p class="kucuk eksi">${_oyunHtml("rental.shortage", {amount:tl(toplam - d.genel.oyuncu.bakiye)})}</p>` : ''}` : `<p class="kucuk soluk">${_oyunHtml("rental.chooseFirst")}</p>`}
      <div class="kart kategori-oner"><h3>💡 ${_oyunHtml("rental.suggest")}</h3>
        <p class="kucuk soluk" style="margin:0 0 8px">${_oyunHtml("rental.suggestHint")}</p>
        <form id="kategori-formu"><label class="alan"><span>${_oyunHtml("rental.categoryName")}</span><input name="ad" maxlength="60" placeholder="${_oyunHtml("rental.example")}"></label>
          <label class="alan"><span>${_oyunHtml("rental.sellsHow")} ${esc(t('auth.optional'))}</span><textarea name="aciklama" rows="2" maxlength="500"></textarea></label>
          <button class="dugme mavi kucuk" type="submit">${_oyunHtml("rental.sendSuggestion")}</button></form></div>`,
    hazir(g) {
      g.querySelector('#kategori-formu').addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target;
        const r = await eylem(f.querySelector('button'), () => api('kategori-oner', Object.fromEntries(new FormData(f).entries())));
        if (r === undefined) return;
        f.reset();
        f.querySelector('button').disabled = false;
        kart({ ikon: '💡', baslik: _oyunMetni("ui.ffe16e4ae323"), metin: _oyunMetni("rental.thanks"), tur: 'basari' });
      });
      // 0.57.13: tür listesi arama/filtreyle yeniden çizilir, panelin geri kalanı (tabela adı, maliyet) yerinde kalır
      const turListe = g.querySelector('#tur-listesi');
      const turBagla = () => {
        turListe.querySelectorAll('[data-tur]').forEach((bt) => bt.addEventListener('click', () => {
          ses.tik();
          const girilen = g.querySelector('[data-tabela-ad]');
          kiralamaPaneli(y, bt.dataset.tur, girilen && girilen.value !== varsayilanAd ? girilen.value : '', ilceId, true);
        }));
        const oner = turListe.querySelector('[data-tur-oner]');
        if (oner) oner.addEventListener('click', () => {
          const f = g.querySelector('#kategori-formu');
          f.elements.ad.value = turFiltre.q.trim().slice(0, 60);
          f.scrollIntoView({ block: 'center', behavior: 'smooth' });
          f.elements.aciklama.focus({ preventScroll: true });
        });
        turListe.querySelectorAll('[data-tur-temizle]').forEach((bt) => bt.addEventListener('click', turTemizle));
      };
      const turYenile = () => {
        turListe.innerHTML = turListesiHtml(b, seciliTur);
        turBagla();
        g.querySelectorAll('[data-kat]').forEach((bt) => { const s = bt.dataset.kat === turFiltre.kat; bt.classList.toggle('secili', s); bt.setAttribute('aria-pressed', s); });
        g.querySelectorAll('[data-tip]').forEach((bt) => { const s = bt.dataset.tip === turFiltre.tip; bt.classList.toggle('secili', s); bt.setAttribute('aria-pressed', s); });
        g.querySelectorAll('[data-anahtar]').forEach((bt) => { const s = !!turFiltre[bt.dataset.anahtar]; bt.classList.toggle('secili', s); bt.setAttribute('aria-pressed', s); });
        const sayac = g.querySelector('[data-tur-sonuc]');
        if (sayac) sayac.textContent = turFiltreAktif() ? _oyunMetni("rental.resultCount", { count: turSuzgeci(b).length }) : '';
        const temizle = g.querySelector('.tur-filtre [data-tur-temizle]');
        if (temizle) temizle.hidden = !turFiltreAktif();
      };
      const araGirdi = g.querySelector('[data-tur-ara]');
      const siraSec = g.querySelector('[data-tur-sira]');
      const turTemizle = () => { Object.assign(turFiltre, TUR_FILTRE_BOS); araGirdi.value = ''; siraSec.value = ''; const sl = g.querySelector('[data-tur-ara-sil]'); if (sl) sl.hidden = true; turYenile(); };
      let araZaman = null;
      const araSil = g.querySelector('[data-tur-ara-sil]');
      araGirdi.addEventListener('input', () => { if (araSil) araSil.hidden = !araGirdi.value; clearTimeout(araZaman); araZaman = setTimeout(() => { turFiltre.q = araGirdi.value; turYenile(); }, 120); });
      if (araSil) araSil.addEventListener('click', (e) => { e.preventDefault(); ses.tik(); araGirdi.value = ''; araSil.hidden = true; turFiltre.q = ''; turYenile(); araGirdi.focus({ preventScroll: true }); });
      araGirdi.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); araGirdi.blur(); }
        else if (e.key === 'Escape' && araGirdi.value) { e.preventDefault(); e.stopPropagation(); araGirdi.value = ''; turFiltre.q = ''; const sl = g.querySelector('[data-tur-ara-sil]'); if (sl) sl.hidden = true; turYenile(); }
      });
      siraSec.addEventListener('change', () => { turFiltre.sira = siraSec.value; turYenile(); });
      g.querySelectorAll('[data-kat]').forEach((bt) => bt.addEventListener('click', () => { ses.tik(); turFiltre.kat = bt.dataset.kat; turYenile(); }));
      g.querySelectorAll('[data-tip]').forEach((bt) => bt.addEventListener('click', () => { ses.tik(); turFiltre.tip = turFiltre.tip === bt.dataset.tip ? '' : bt.dataset.tip; turYenile(); }));
      g.querySelectorAll('[data-anahtar]').forEach((bt) => bt.addEventListener('click', () => { ses.tik(); turFiltre[bt.dataset.anahtar] = !turFiltre[bt.dataset.anahtar]; turYenile(); }));
      g.querySelector('.tur-filtre [data-tur-temizle]').addEventListener('click', turTemizle);
      turYenile();
      // seçili kategori çipi görünür olsun (yatay kaydırmalı satırda sağda kalmış olabilir)
      const seciliKat = g.querySelector('[data-tur-katlar] .cip.secili');
      if (seciliKat && turFiltre.kat) seciliKat.scrollIntoView({ block: 'nearest', inline: 'center' });
      // tabela adı yazılırken ilçede kullanılıp kullanılmadığı gösterilir
      const adGirdi = g.querySelector('[data-tabela-ad]');
      const durumYazi = g.querySelector('#isim-durum');
      let isimZaman = null;
      const isimKontrol = () => {
        clearTimeout(isimZaman);
        isimZaman = setTimeout(async () => {
          if (!adGirdi?.isConnected || !durumYazi?.isConnected) return;
          const v = adGirdi.value.trim();
          if (v.length < 2) { durumYazi.textContent = _oyunMetni("rental.minName"); durumYazi.className = 'kucuk isim-durum'; return; }
          try {
            const r = await api('isim-kontrol?ad=' + encodeURIComponent(v) + (ilceId ? '&ilce=' + ilceId : ''));
            if (!durumYazi.isConnected || adGirdi.value.trim() !== v) return;
            durumYazi.textContent = r.uygun ? _oyunMetni("rental.nameFree") : _oyunMetni("rental.nameTaken", {number:r.yerNo});
            durumYazi.className = 'kucuk isim-durum ' + (r.uygun ? 'arti' : 'eksi');
          } catch (e) { /* yok say */ }
        }, 350);
      };
      d.panelTemizle = () => { clearTimeout(isimZaman); clearTimeout(araZaman); };
      if (adGirdi && durumYazi) {
        adGirdi.addEventListener('input', isimKontrol); isimKontrol();
        if (tabelaOdak) { adGirdi.scrollIntoView({ block: 'center', behavior: 'smooth' }); adGirdi.focus({ preventScroll: true }); }
      }
      const k = g.querySelector('[data-eylem=kirala]');
      if (k) k.addEventListener('click', async () => {
        const r = await eylem(k, () => api('kirala', { yerNo: y.no, tur: seciliTur, ad: adGirdi.value, ilceId }));
        if (r === undefined) return;
        ses.kasa();
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        bildir(_oyunMetni("rental.rented"));
        isletmePaneli(r.id);
      });
    },
  });
}

// 0.49.4: raflar dolunca dükkânın önüne tek toptancı aracı gelir. Toplu siparişte (rafları doldur) markasız
// "TOPTANCI" kamyonu, tek ürün alınınca ürünün kendi toptancısı. Araç zaten yoldaysa yenisi gelmez.
function toptanciGonder(x, urunler, toplu = false) {
  // 0.50: araç mahallede görünürse yalnız "yola çıktı" bildirimi çıkar (önce "getirdi", sonra "yola çıktı" denmesin)
  if (!x || x.yerNo == null || !d.genel || !d.genel.oyuncu || x.ilceId !== d.genel.oyuncu.ilce.id || !mahalle.teslimat || d.ziyaret) return false;
  const gruplar = urunler.map((u) => urunGrubu(u.kod));
  const r = mahalle.teslimat(x.yerNo, gruplar, { toplu: toplu || new Set(gruplar).size > 1 });
  if (r === 'yeni') bildir(_autoMetin('🚚 Toptancı yola çıktı, mallar dükkânına geliyor.'));
  else if (r === 'yolda') bildir(_autoMetin('🚚 Toptancı zaten yolda, mallar aynı seferle geliyor.'));
  return r === 'yeni' || r === 'yolda';
}
// 0.49.7: dükkânlar arası geçiş (‹ ›) ve gecikmeli yenilemelerin başka dükkânın penceresini ezmemesi
let isletmeIstekNo = 0;
async function isletmeListesi() {
  if (d.isletmelerimOnbellek && d.isletmelerimOnbellek.length) return d.isletmelerimOnbellek;
  try { d.isletmelerimOnbellek = await api('isletmelerim'); } catch (e) { return []; }
  return d.isletmelerimOnbellek;
}
async function isletmePaneli(id) {
  const istekNo = ++isletmeIstekNo;
  let x;
  try { x = await api(`isletme/${id}`); } catch (e) { return bildir(e.message, true); }
  let liste = (await isletmeListesi()).filter((z) => z.durum !== 'kapandi');
  if (!liste.some((z) => Number(z.id) === Number(id))) { d.isletmelerimOnbellek = null; liste = (await isletmeListesi()).filter((z) => z.durum !== 'kapandi'); }
  // bu arada başka bir dükkân açıldıysa (ya da pencere kapandıysa) bu cevap gösterilmez
  if (istekNo !== isletmeIstekNo) return;
  const sira = liste.findIndex((z) => Number(z.id) === Number(id));
  const gezgin = liste.length > 1 && sira >= 0 ? (() => {
    const once = liste[(sira - 1 + liste.length) % liste.length], sonra = liste[(sira + 1) % liste.length];
    return `<nav class="dk-gezgin" aria-label="${esc(_autoMetin('Dükkânlarım arasında geçiş'))}">
      <button class="dk-ok" data-dk-git="${once.id}" title="${esc(once.ad)}" aria-label="${esc(_autoSablon`Önceki dükkân: ${once.ad}`)}">‹</button>
      <span class="dk-orta"><b>${sira + 1} / ${liste.length}</b><small>${esc(_autoMetin('Dükkânlarım'))} · ${esc(_autoMetin('← → tuşlarıyla da geçebilirsin'))}</small></span>
      <button class="dk-ok" data-dk-git="${sonra.id}" title="${esc(sonra.ad)}" aria-label="${esc(_autoSablon`Sonraki dükkân: ${sonra.ad}`)}">›</button></nav>`;
  })() : '';
  const kar = x.dun.ciro - x.dun.gider;
  const durum = x.durum === 'ruhsat'
    ? `<div class="kart uyari"><h3>⏳ ${_oyunHtml("shop.permit")}</h3><p class="kucuk" style="margin:0">${_oyunHtml("shop.permitBefore")} <b class="sayi" data-geri="${x.ruhsat ? x.ruhsat.bitis : 0}">${x.ruhsat ? sureMetni(x.ruhsat.bitis - simdi()) : ''}</b> ${_oyunHtml("shop.permitAfter")}</p></div>`
    : x.kasa < 0
      ? `<div class="kart tehlike"><h3>⚠️ ${_oyunHtml("shop.debt")}</h3><p class="kucuk" style="margin:0">${x.borcGun > 0 ? _oyunHtml("shop.debtDays", {count:x.borcGun}) : _oyunHtml("shop.debtToday")} ${_oyunHtml("shop.debtLimit")}</p>
        <button class="dugme kirmizi kucuk" data-borc-ode style="margin-top:10px">💳 ${_oyunHtml("shop.payDebt")} (${tl(-x.kasa)})</button>
        <p class="kucuk soluk" style="margin:6px 0 0">${_oyunHtml("shop.debtSources")}</p></div>`
      : `<div class="kart basari"><p style="margin:0">✅ ${_oyunHtml('shop.openHours',{start:String(x.saat[0]).padStart(2,'0')+':00',end:String(x.saat[1]%24).padStart(2,'0')+':00'})}</p></div>`;
  const doluluk = Math.round((x.doluluk / x.kapasite) * 100);
  // işlem bittikten sonra yenileme yalnızca pencere hâlâ bu dükkânı gösteriyorsa yapılır
  // 0.57.9: yenileme, pencere hâlâ bu dükkânı gösteriyorsa her zaman yapılır. Eskiden bir yenileme sürerken eski
  // ekrandan yapılan ikinci alım (ör. art arda iki ürüne +1) sunucuda işleniyor ama ekran güncellenmiyordu.
  const tazele = () => { if (!katman.hidden && katman.querySelector(`[data-isletme-panel="${Number(id)}"]`)) isletmePaneli(id); };
  panelAc({
    ikon: x.simge, baslik: x.ad, alt: _oyunHtml("shop.subtitle", {type:_dukkanTuru(x.turAdi),size:_oyunMetni(({kucuk:'shop.sizeSmall',orta:'shop.sizeMedium',buyuk:'shop.sizeLarge'})[x.boyut] || 'shop.sizeMedium'),area:x.m2}) + (x.sokak != null && x.ilceId === (d.genel && d.genel.oyuncu && d.genel.oyuncu.ilce && d.genel.oyuncu.ilce.id) ? ` · 📍 ${esc(dukkanAdresi(x))}` : ''),
    govde: `<span hidden data-isletme-panel="${Number(id)}"></span>${gezgin}${durum}
      <div class="kart kasa-kart">
        <div><small class="soluk">${_oyunHtml("shop.balance")}</small><div class="kasa-tutar ${x.kasa < 0 ? 'eksi' : ''}">${tl(x.kasa)}</div>${x.kasaAktarim ? `<small class="kasa-aktarim">🏦 ${x.kasaAktarim - Date.now() > 60000 ? _oyunHtml("shop.autoTransferIn", { time: sureMetni(x.kasaAktarim - Date.now()) }) : _oyunHtml("shop.autoTransferSoon")}</small>` : ''}</div>
        <button class="dugme yesil kucuk" data-eylem="kasa" ${x.kasa > 0 ? '' : 'disabled'} style="width:auto">💰 ${_oyunHtml("shop.collect")}</button>
      </div>
      <div class="bilgi-izgara">
        <div><small>${_oyunHtml("shop.todaySales")}</small><b>${tl(x.bugun.ciro)}</b></div>
        <div><small>${_oyunHtml("shop.todayCustomers")}</small><b>${x.bugun.musteri}</b></div>
        <div><small>${_oyunHtml("shop.yesterdaySales")}</small><b>${tl(x.dun.ciro)}</b></div>
        <div><small>${_oyunHtml("shop.yesterdayProfit")}</small><b class="${kar >= 0 ? 'arti' : 'eksi'}">${isaretliTl(kar)}</b></div>
      </div>
      ${x.durum === 'acik' && (x.bugun.ciro || x.bugun.tedarik || x.bugun.isletmeGider) ? (() => {
        // 0.57.9: kasa dökümü yeniden tasarlandı: simgeli satırlar, satılan adet alt satırda, en altta günün neti
        const adet = x.hizmet ? 0 : x.urunler.reduce((a, u) => a + (u.bugunSatis || 0), 0);
        const net = (x.bugun.ciro || 0) - (x.bugun.tedarik || 0) - (x.bugun.isletmeGider || 0);
        const satir = (ikon, ad, alt, tutar, sinif) => `<li><span class="kd-ikon" aria-hidden="true">${ikon}</span><span class="kd-ad">${ad}${alt ? `<small>${alt}</small>` : ''}</span><b class="${sinif}">${tutar}</b></li>`;
        return `<div class="kart kasa-dokum">
        <h4>🧾 ${_autoHtml('Bugün kasaya giren ve çıkan')}</h4>
        <ul class="kd-liste">
          ${satir('🛒', _autoHtml('Satışlar'), adet > 0 ? esc(_autoSablon`${adet.toLocaleString(sayiDili())} adet satıldı`) : '', '+' + tl(x.bugun.ciro), 'arti')}
          ${x.bugun.tedarik ? satir('🚚', _autoHtml('Otomatik mal alımı'), _autoHtml('Raflar dolduruldu'), '−' + tl(x.bugun.tedarik), 'eksi') : ''}
          ${satir('🏢', _autoHtml('Kira, maaş, elektrik-su'), '', '−' + tl(x.bugun.isletmeGider || 0), 'eksi')}
        </ul>
        <div class="kd-net"><span>${_autoHtml('Bugünün neti')}</span><b class="${net >= 0 ? 'arti' : 'eksi'}">${isaretliTl(net)}</b></div>
        ${x.bugun.tedarik ? `<p class="kd-not">ℹ️ ${_autoHtml('Alınan mal rafta durur; satıldıkça yeniden paraya döner.')}</p>` : ''}
      </div>`;
      })() : ''}
      ${(() => {
        // yalnızca şu an rafta biten ürün varsa uyar (dünün kaçan satışları raflar dolduktan sonra da görünmesin)
        if (x.hizmet || x.durum !== 'acik') return '';
        const biten = x.urunler.filter((u) => u.miktar <= 0);
        if (!biten.length) return '';
        return `<div class="kart uyari kucuk"><b>📦 ${_oyunHtml("shop.outOfStock")}</b> ${biten.map((u) => esc(_urunAdi(u.ad))).join(', ')}.
          ${x.bugun.kaybedilen > 0 ? _oyunHtml("shop.missedSales", {count:x.bugun.kaybedilen}) : _oyunHtml("shop.missingProducts")}</div>`;
      })()}
      <p class="kucuk soluk">${_oyunHtml("shop.dailyCosts", {amount:tl(x.gunlukGider),count:x.calisan})}</p>
      ${x.hizmet ? `<div class="kart"><h3>${_oyunHtml("shop.servicePrices")}</h3><p class="kucuk soluk" style="margin:0">${_oyunHtml("shop.serviceHint")}</p></div>` : `<div class="kart">
        <div class="depo-ust"><h3 style="margin:0">${_oyunHtml("shop.shelves")}</h3><span class="kucuk soluk">${_oyunHtml("shop.stockAmount", {current:x.doluluk,capacity:x.kapasite})}</span></div>
        <div class="cubuk"><div style="width:${doluluk}%"></div></div>
        <button class="dugme mavi kucuk" data-eylem="doldur" ${x.doluluk >= x.kapasite ? 'disabled' : ''}>🚚 ${_oyunHtml("shop.refill")}</button>
        <label class="anahtar-satir"><span><b>${_oyunHtml("shop.autoSupply")}</b><br><span class="kucuk soluk">${_oyunHtml("shop.autoHint")}</span></span>
          <input type="checkbox" data-eylem="oto" ${x.otoTedarik ? 'checked' : ''}><span class="anahtar"></span></label>
      </div>`}
      <ul class="urun-listesi">${x.urunler.map((u) => `<li data-urun="${u.kod}">
        <div class="urun-ust"><b>${esc(_urunAdi(u.ad))}</b>${x.hizmet ? `<span class="soluk kucuk">${_oyunHtml("shop.perUnit", {unit:_birimAdi(u.birim)})}</span>` : `<span class="${u.miktar <= 0 ? 'eksi' : 'soluk'} kucuk">${u.miktar <= 0 ? _oyunHtml("shop.empty") + ' · ' : ''}${u.miktar > 0 ? u.miktar : 0} / ${u.kapasite} ${esc(_birimAdi(u.birim))}</span>`}</div>
        ${x.hizmet ? '' : `<div class="raf-cubuk" title="${_autoHtml('Rafta / raf kapasitesi')}"><i style="width:${Math.min(100, Math.round((Math.max(0, u.miktar) / Math.max(1, u.kapasite)) * 100))}%"></i></div>`}
        ${u.bugunSatis || u.dunSatis ? `<div class="kucuk soluk">${_autoSablon`Bugün ${u.bugunSatis} satıldı · dün ${u.dunSatis}`}</div>` : ''}
        <div class="urun-alt">
          <div class="fiyat-ayar">
            <button data-fiyat="-" aria-label="${_oyunHtml("shop.priceDown")}">−</button>
            <span class="sayi" data-fiyat-deger>${tl(u.fiyat)}</span>
            <button data-fiyat="+" aria-label="${_oyunHtml("shop.priceUp")}">+</button>
          </div>
          ${x.hizmet ? '' : (() => { const bos = Math.max(0, u.kapasite - Math.max(0, u.miktar)); return `<div class="al-dugmeler">${[10, 50].filter((n) => n < bos).map((n) => `<button data-al="${n}">+${n}</button>`).join('')}<button data-al="${bos}" ${bos ? '' : 'disabled'} title="${_autoHtml('Rafı doldur')}">${bos ? '+' + bos : '✓'}</button></div>`; })()}
        </div>
        <div class="kucuk soluk">${_oyunHtml("shop.priceCosts", {label:_oyunMetni(x.hizmet ? 'stall.materials' : 'shop.wholesale'),cost:tl(u.toptan),market:tl(u.piyasa)})}${u.bozulma >= 0.2 ? ', '+_oyunHtml("shop.perishable") : ''}${u.toptanListe > u.toptan ? ` · <span class="arti">🤝 ${_autoSablon`Pazarlıkçı: %${Math.round((1 - u.toptan / u.toptanListe) * 100)} indirimli`}</span>` : ''}</div>
      </li>`).join('')}</ul>
      ${x.satinAlmaBedeli && x.durum === 'acik' ? `<div class="kart"><h3>🏠 ${_oyunHtml("shop.buyProperty")}</h3><p class="kucuk" style="margin:0 0 8px">${_oyunHtml("shop.buyHint", {amount:tl(x.satinAlmaBedeli),months:Math.round(x.satinAlmaBedeli / Math.max(1,x.tamKira || x.kira))})}</p>
        <button class="dugme mavi kucuk" data-eylem="mulk">${_oyunHtml("shop.buy")}</button></div>` : x.mulk ? `<div class="kart kucuk">🏠 ${_oyunHtml("shop.propertyOwned", {amount:tl(x.mulk)})}</div>` : ''}
      ${x.durum !== 'kapandi' ? `<div class="kart"><h3>📈 ${_oyunHtml("shop.grow")}</h3><div class="dugme-satiri">
        ${x.boyut !== 'buyuk' ? `<button class="dugme kucuk" data-eylem="tasi">📦 ${_oyunHtml("shop.move")}</button>` : ''}
        <button class="dugme kucuk" data-eylem="tabela">🪧 ${_autoHtml('Tabelayı değiştir')}</button>
        <a class="dugme mavi kucuk" href="#/reklam">📣 ${_oyunHtml("shop.advertise")}</a></div>
        <p class="kucuk soluk" style="margin:6px 0 0">${_oyunHtml("shop.moveHint")}</p></div>` : ''}
      <button class="metin-dugme" data-eylem="kapat">${_oyunHtml("shop.closeSummary", {refund:_oyunMetni(x.mulk ? "shop.propertySold" : "shop.deposit")})}</button>`,
    hazir(g) {
      let aktifId = Number(id); // hızlı art arda geçişlerde bir sonraki dükkân, son istenen dükkâna göre seçilir
      const komsu = (yon) => { const i = liste.findIndex((y) => Number(y.id) === aktifId); return i < 0 ? null : liste[(i + yon + liste.length) % liste.length]; };
      const dukkanaGec = (hedef) => {
        const z = liste.find((y) => Number(y.id) === Number(hedef));
        if (!z) return;
        aktifId = Number(z.id);
        const sayac = g.querySelector('.dk-orta b');
        if (sayac) sayac.textContent = `${liste.indexOf(z) + 1} / ${liste.length}`;
        const gz = g.querySelector('.dk-gezgin');
        if (gz) gz.classList.add('geciyor');
        ses.tik();
        // aynı ilçedeyse kamera da o dükkâna gider
        if (aktifRota() === 'mahalle' && !z.sube && z.yerNo != null && mahalle.dukkanaOdakla) dukkanaOdaklaSokak(z.yerNo, z.sokak);
        d.panelGeriDonus = true; // geçişler geri geçmişini doldurmasın
        isletmePaneli(z.id);
      };
      g.querySelectorAll('[data-dk-git]').forEach((b, i) => b.addEventListener('click', () => { const z = komsu(i === 0 ? -1 : 1); if (z) dukkanaGec(z.id); }));
      if (gezgin) {
        const tus = (e) => {
          if (katman.hidden || e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) return;
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          const z = komsu(e.key === 'ArrowLeft' ? -1 : 1);
          if (z) { e.preventDefault(); e.stopPropagation(); dukkanaGec(z.id); }
        };
        document.addEventListener('keydown', tus, true);
        const eskiTemizle = d.panelTemizle;
        d.panelTemizle = () => { document.removeEventListener('keydown', tus, true); if (eskiTemizle) eskiTemizle(); };
      }
      const borcB = g.querySelector('[data-borc-ode]');
      if (borcB) borcB.addEventListener('click', async () => {
        const r = await eylem(borcB, () => api(`isletme/${id}/borc-ode`, {}));
        if (r === undefined) return;
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        const kaynak = [r.nakit ? _oyunMetni("shop.cashSource", {amount:tamTl(r.nakit)}) : '', r.vadesiz ? _oyunMetni("shop.bankSource", {amount:tamTl(r.vadesiz)}) : '', r.kart ? _oyunMetni("shop.cardSource", {amount:tamTl(r.kart)}) : ''].filter(Boolean).join(', ');
        bildir(r.kasa >= 0 ? _oyunMetni("shop.debtPaid", {sources:kaynak}) : _oyunMetni("shop.debtPartial", {amount:tamTl(r.tutar),sources:kaynak,remaining:tamTl(-r.kasa)}));
        tazele();
      });
      const tabelaB = g.querySelector('[data-eylem=tabela]');
      if (tabelaB) tabelaB.addEventListener('click', async () => {
        const t = await eylem(tabelaB, () => api(`isletme/${id}/tabela`));
        if (t === undefined) return;
        if (t.kalan <= 0) return bildir(_autoSablon`Bu dükkânın tabelası son 30 günde ${t.sinir} kez değişti. Yeni değişiklik ${tarihMetni(t.sonraki)} tarihinden sonra yapılabilir.`, true);
        const yeni = await sor(_autoSablon`Yeni tabela: ${tl(t.ucret)} (yapım ve montaj) + belediye ilan-reklam bildirimi harcı ${tl(t.harc)} = ${tl(t.toplam)}. 30 günde en çok ${t.sinir} kez değiştirilebilir; bu dönem ${t.kalan} hakkın kaldı.`,
          { baslik: _autoMetin('Tabelayı değiştir'), ipucu: t.ad, ikon: '🪧', uzunluk: 18, evet: _autoMetin('Tabelayı yaptır') });
        if (!yeni || !yeni.trim()) return;
        const r = await eylem(tabelaB, () => api(`isletme/${id}/tabela`, { ad: yeni.trim() }));
        if (r === undefined) return;
        ses.satinAl();
        d.isletmelerimOnbellek = null;
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        bildir(_autoSablon`Yeni tabela asıldı: ${r.ad}`);
        tazele();
      });
      const tasiB = g.querySelector('[data-eylem=tasi]');
      if (tasiB) tasiB.addEventListener('click', () => tasimaPaneli(id));
      const mulkB = g.querySelector('[data-eylem=mulk]');
      if (mulkB) mulkB.addEventListener('click', async () => {
        if (!(await onayla(_oyunMetni("shop.buyConfirm", {name:x.ad,amount:tamTl(x.satinAlmaBedeli)}), { baslik: _oyunMetni("ui.8ee602116400"), evet: _oyunMetni("shop.buy"), ikon: '🏠' }))) return;
        if ((await eylem(mulkB, () => api(`isletme/${id}/mulk`, {}))) === undefined) return;
        ses.satinAl();
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        bildir(_oyunMetni("shop.bought"));
        tazele();
      });
      const kasaB = g.querySelector('[data-eylem=kasa]');
      kasaB.addEventListener('click', async () => {
        const rect = kasaB.getBoundingClientRect();
        const r = await eylem(kasaB, () => api(`isletme/${id}/kasa`, {}));
        if (r === undefined) return;
        await yenileHepsi();
        await sikkeUcur(rect, 12);
        ses.kasa();
        bakiyeSay(d.genel.oyuncu.bakiye);
        bildir(_oyunMetni("shop.collected", {amount:isaretliTl(r.tutar)}));
        tazele();
      });
      const oto = g.querySelector('[data-eylem=oto]');
      if (oto) oto.addEventListener('change', async () => {
        const istenen = oto.checked;
        oto.disabled = true;
        const r = await eylem(null, () => api(`isletme/${id}/oto`, { acik: istenen }));
        oto.disabled = false;
        // 0.57.9: istek başarısızsa anahtar eski haline döner (ekranda açık görünüp kapalı kalmasın)
        if (r === undefined) { oto.checked = !istenen; return; }
        x.otoTedarik = istenen;
        d.isletmelerimOnbellek = null;
        bildir(istenen ? _oyunMetni("shop.autoOn") : _oyunMetni("shop.autoOff"));
      });
      const doldur = g.querySelector('[data-eylem=doldur]');
      if (doldur) doldur.addEventListener('click', async () => {
        // 0.57.9: her ürün kendi rafının sınırına kadar doldurulur
        const eksik = x.urunler.map((u) => [u, Math.max(0, u.kapasite - Math.max(0, u.miktar))]).filter(([, n]) => n > 0);
        if (!eksik.length) return bildir(_oyunMetni("shop.full"), true);
        const adet = eksik.reduce((a, [, n]) => a + n, 0);
        const tutar = eksik.reduce((a, [u, n]) => a + u.toptan * n, 0);
        if (!(await onayla(_autoSablon`Raflar doldurulsun mu? ${eksik.length} ürün için toplam ${adet} birim mal alınacak: ${tl(tutar)}.`, { baslik: _oyunMetni("ui.ebcd597c2fbc"), evet: _oyunMetni("shop.buy"), ikon: '🚚' }))) return;
        doldur.disabled = true;
        try {
          for (const [u, n] of eksik) await api(`isletme/${id}/stok`, { urun: u.kod, miktar: n });
          ses.satinAl();
          if (!toptanciGonder(x, x.urunler, true)) bildir(_oyunMetni("shop.supplied"));
        } catch (e) { bildir(e.message, true); }
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        tazele();
      });
      g.querySelectorAll('[data-urun]').forEach((li) => {
        const u = x.urunler.find((z) => z.kod === li.dataset.urun);
        let fiyat = u.fiyat;
        let zamanlayici = null;
        const deger = li.querySelector('[data-fiyat-deger]');
        li.querySelectorAll('[data-fiyat]').forEach((b) => b.addEventListener('click', () => {
          const adim = Math.max(50, Math.round(u.piyasa * 0.05 / 50) * 50);
          const yeni = fiyat + (b.dataset.fiyat === '+' ? adim : -adim);
          if (yeni < u.piyasa * 0.3 || yeni > u.piyasa * 3) return bildir(_oyunMetni("shop.priceRange"), true);
          fiyat = yeni;
          deger.textContent = tl(fiyat);
          deger.className = 'sayi ' + (fiyat > u.piyasa * 1.15 ? 'eksi' : fiyat < u.piyasa * 0.9 ? 'arti' : '');
          ses.tik();
          clearTimeout(zamanlayici);
          zamanlayici = setTimeout(() => api(`isletme/${id}/fiyat`, { urun: u.kod, fiyat }).catch((e) => bildir(e.message, true)), 600);
        }));
        li.querySelectorAll('[data-al]').forEach((b) => b.addEventListener('click', async () => {
          const r = await eylem(b, () => api(`isletme/${id}/stok`, { urun: u.kod, miktar: Number(b.dataset.al) }));
          if (r === undefined) return;
          ses.satinAl();
          // 0.52: araç gelmeyen yerlerde (arka sokak, başka ilçe) de bilgi verilir
          if (!toptanciGonder(x, [u])) bildir(_oyunMetni("shop.supplied"));
          await yenileHepsi();
          bakiyeSay(d.genel.oyuncu.bakiye);
          tazele();
        }));
      });
      g.querySelector('[data-eylem=kapat]').addEventListener('click', async () => {
        if (!(await onayla(_oyunMetni("shop.closeConfirm"), { baslik: _oyunMetni("ui.ca049ac28ec6"), evet: _oyunMetni("shop.close"), tehlike: true, ikon: '🏚️' }))) return;
        const r = await eylem(null, () => api(`isletme/${id}/kapat`, {}));
        if (r === undefined) return;
        await yenileHepsi();
        bakiyeSay(d.genel.oyuncu.bakiye);
        panelKapat();
        bildir(_oyunMetni("shop.closed", {amount:isaretliTl(r.toplam)}));
      });
      // ruhsat geri sayımı
      const geri = g.querySelector('[data-geri]');
      if (geri) {
        d.panelZamanlayici = setInterval(async () => {
          const kalan = Number(geri.dataset.geri) - simdi();
          if (kalan > 0) { geri.textContent = sureMetni(kalan); return; }
          clearInterval(d.panelZamanlayici);
          await yenileHepsi();
          tazele();
        }, 1000);
      }
    },
  });
}

// Dükkânı aynı caddede daha büyük boş bir yere taşımak
async function tasimaPaneli(id) {
  const shopSize = value => ({'Küçük':'shop.sizeSmall','Orta':'shop.sizeMedium','Büyük':'shop.sizeLarge'})[value] ? _oyunMetni(({'Küçük':'shop.sizeSmall','Orta':'shop.sizeMedium','Büyük':'shop.sizeLarge'})[value]) : value;
  const p = panelAc({ ikon: '📦', baslik: _oyunMetni("ui.cd785f81be9f"), govde: `<p class="soluk">${_oyunHtml('auth.loading')}</p>` });
  let b;
  try { b = await api(`isletme/${id}/tasima`); } catch (e) { bildir(e.message, true); return; }
  const g = p.querySelector('.panel-govde');
  if (!g.isConnected) return;
  g.innerHTML = `<p class="kucuk">${_oyunHtml("shop.moveIntro", {name:b.isletme.ad,size:shopSize(b.isletme.boyutAd),number:b.isletme.yerNo})}</p>
    ${b.yerler.length ? `<ul class="satirlar">${b.yerler.map((y) => `<li><span><b>${_oyunHtml("shop.place", {number:y.no,size:shopSize(y.boyutAd)})}</b><br><span class="kucuk">📍 ${esc(yerAdresi(y.no))}</span><br><span class="kucuk soluk">${_oyunHtml("shop.moveCosts", {rent:tl(y.kira),deposit:tl(y.depozito),shelves:tl(y.kurulumFarki),fee:tl(y.harc),refund:tl(y.iade)})}</span></span>
      <span class="sag"><b>${y.net >= 0 ? tl(y.net) : '+' + tl(-y.net)}</b><br><button class="dugme gri kucuk" data-tasi-gor="${y.no}">👁️ ${_autoHtml('Yerini gör')}</button><button class="dugme yesil kucuk" data-tasi="${y.no}">${_oyunHtml("ui.5747c5b5d5dd")}</button></span></li>`).join('')}</ul>`
      : `<div class="kart"><p class="kucuk" style="margin:0">${_oyunHtml("shop.moveEmpty")}</p></div>`}
    <p class="kucuk soluk">${_oyunHtml("shop.moveTerms", {refund:_oyunMetni(b.isletme.mulk ? "shop.propertySold" : "shop.depositReturned")})}</p>
    <button class="dugme gri" data-geri-isletme>← ${_oyunHtml("shop.back")}</button>`;
  g.querySelector('[data-geri-isletme]').addEventListener('click', () => isletmePaneli(id));
  // taşımadan önce yeni yerin sokakta nerede olduğu görülür
  g.querySelectorAll('[data-tasi-gor]').forEach((btn) => btn.addEventListener('click', () => {
    const no = Number(btn.dataset.tasiGor);
    ses.tik();
    panelKapat();
    history.replaceState(null, '', '#/mahalle'); rotaUygula();
    mahalle.dukkanaOdakla(no);
    kart({ ikon: '📍', baslik: yerAdresi(no), metin: _autoMetin('Taşıyacağın yer burası. Karar verdiysen dükkânının penceresinden Taşı düğmesine dokun.'), eylemAdi: _autoMetin('Taşıma ekranına dön'), eylem: () => tasimaPaneli(id), sure: 12000 });
  }));
  g.querySelectorAll('[data-tasi]').forEach((btn) => btn.addEventListener('click', async () => {
    const y = b.yerler.find((z) => String(z.no) === btn.dataset.tasi);
    if (!(await onayla(_oyunMetni("shop.moveConfirm", {name:b.isletme.ad,number:y.no,size:shopSize(y.boyutAd),amount:tamTl(Math.max(0,y.net))}) + '\n📍 ' + yerAdresi(y.no), { baslik: _oyunMetni("ui.5747c5b5d5dd"), evet: _oyunMetni("ui.5747c5b5d5dd"), ikon: '📦' }))) return;
    if ((await eylem(btn, () => api(`isletme/${id}/tasi`, { yer: y.no }))) === undefined) return;
    ses.satinAl();
    await yenileHepsi();
    bildir(_oyunMetni("shop.moved"));
    isletmePaneli(id);
  }));
}

// 0.49.4: her zaman açık özel dükkânlar: üstüne dokununca teşekkür yazısı
const OZEL_TESEKKUR = {
  tefon: () => _autoMetin('Bu dükkân, Çırak\'a ilham veren ustalardan birine adanmıştır. Alın terine, sabrına ve bize öğrettiği dürüst esnaflığa sonsuz teşekkürler.'),
  hulya: () => _autoMetin('Bu eczane, şifa dağıtan güzel ellere adanmıştır. Her gün gösterdiği sevgi, emek ve destek için sonsuz teşekkürler.'),
  sukru: () => _autoMetin('Bu dükkân, dürüstlüğü ve çalışkanlığıyla yol gösteren bir ustaya adanmıştır. Verdiği güç ve emekleri için sonsuz teşekkürler.'),
  // 0.57.9: teşekkür değil, dükkânın hikâyesi
  derece: () => _autoMetin('2006 yılında, Yılmaz Garip ve Veli Can Tefon tarafından kurulmuş olan Derece Bilgisayar, büyük bir teknoloji şirketi olma yolunda ilerlerken, dolandırıcılar tarafından yağmalanmıştır.'),
};
const OZEL_HIKAYE = new Set(['derece']);
function ozelDukkanPaneli(i) {
  panelAc({ icerikBoyu: true,
    ikon: i.simge, baslik: i.ad, alt: _autoMetin('Her zaman açık'),
    govde: `<div class="kart ozel-tesekkur"><span class="ozel-kalp" aria-hidden="true">${OZEL_HIKAYE.has(i.ozel) ? '📜' : '💛'}</span><b>${OZEL_HIKAYE.has(i.ozel) ? _autoHtml('Dükkânın hikâyesi') : _autoHtml('Özel teşekkür')}</b><p>${esc(OZEL_TESEKKUR[i.ozel]())}</p><small>🕰️ ${_autoHtml('Bu dükkân gece gündüz açıktır.')}</small></div>
      <button class="dugme gri" data-kapat>${_oyunHtml("stall.ok")}</button>`,
  });
}
function baskaDukkanPaneli(y) {
  const i = y.isletme;
  if (i.ozel && OZEL_TESEKKUR[i.ozel]) return ozelDukkanPaneli(i);
  panelAc({ icerikBoyu: true,
    ikon: i.simge, baslik: i.ad, alt: _oyunHtml("shop.owner", {type:_dukkanTuru(i.turAdi),name:i.sahip}),
    govde: i.bot
      ? `<div class="kart"><p style="margin:0">${_oyunHtml("shop.localOwner")}</p></div>
         <button class="dugme gri" data-kapat>${_oyunHtml("stall.ok")}</button>`
      : `<div class="kart"><p style="margin:0">${_oyunHtml("shop.otherOwner")}</p></div>
      <button class="dugme mavi" data-eylem="mesaj">✉️ ${_oyunHtml("shop.messageOwner", {name:i.sahip})}</button>`,
    hazir(g) { const b = g.querySelector('[data-eylem=mesaj]'); if (b) b.addEventListener('click', () => konusmaPaneli(i.sahip)); },
  });
}

// ---------- Belediye ----------
const BASVURU_DURUM = { bekliyor: ['⏳','Bekliyor'], onaylandi: ['✅','Onaylandı'], reddedildi: ['❌','Reddedildi'] };
const basvuruDurumMetni = durum => BASVURU_DURUM[durum] ? BASVURU_DURUM[durum][0]+' '+_autoHtml(BASVURU_DURUM[durum][1]) : esc(durum);
async function belediyePaneli() {
  const p = panelAc({ ikon: '🏛️', baslik: _autoMetin('Belediye'), rota: 'belediye', govde: `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>` });
  try {
    const b = await api('belediye');
    if (aktifRota() !== 'belediye') return;
    p.querySelector('h2').textContent = `${b.ilce} Belediyesi`;
    p.querySelector('.panel-govde').innerHTML = `
      <div class="kart"><h3>${_autoHtml("Başkan:")} ${b.baskan.bot ? (b.baskan.sistem ? `${esc(b.baskan.ad)} <span class="rozetcik">${_autoHtml("Sistem")}</span>` : _autoHtml('🤖 Belediye Botu')) : esc(b.baskan.ad)}</h3>
        <p class="kucuk soluk" style="margin:0">${b.baskan.bot ? _autoHtml('Başkan oyuncu olmadığı için ruhsat ve izin başvurularını bot yürütür; kurallara uyan başvuruları yaklaşık 3 dakikada onaylar.') : _autoHtml('Başvuruları başkan inceler. 12 saat içinde bakmazsa bot karar verir.')}</p></div>
      <div id="secim-kart"></div>
      <div class="bilgi-izgara"><div><small>${_autoHtml("Belediye kasası")}</small><b>${tl(b.kasa)}</b></div><div><small>${_autoHtml("Son başvurular")}</small><b>${b.sonBasvurular.length}${b.sonBasvurularDevam ? '+' : ''}</b></div></div>
      <div id="belediye-calisma"></div>
      <div class="kart"><h3>${_autoHtml("Başvurularım")}</h3><ul class="satirlar" id="basvurularim"></ul></div>
      <div class="kart"><h3>${_autoHtml("İlçedeki son başvurular")}</h3><ul class="satirlar" id="ilce-basvurulari"></ul></div>`;
    const g = p.querySelector('.panel-govde');
    secimCiz(g.querySelector('#secim-kart'));
    belediyeCalismaCiz(g.querySelector('#belediye-calisma'), b.calisma);
    // ilk sayfa belediye cevabıyla gelir, devamı 25'er
    const ilkSayfa = (liste, devam, yol) => {
      let ilk = { liste, devam };
      return async (once) => {
        const r = ilk || (await api(yol + '?once=' + once));
        ilk = null;
        return { ...r, imlec: r.liste.length ? r.liste[r.liste.length - 1].id : once };
      };
    };
    sayfaGezgini(g.querySelector('#basvurularim'), {
      yukle: ilkSayfa(b.basvurularim, b.basvurularimDevam, 'basvurularim'),
      satir: (x) => `<li><span>${esc(x.ad)}<br><span class="kucuk soluk">${tarihMetni(x.olusturma)}</span>${x.aciklama ? `<br><span class="kucuk eksi">${esc(x.aciklama)}</span>` : ''}</span><span class="sag kucuk">${basvuruDurumMetni(x.durum)}</span></li>`,
      bos: _autoMetin('Henüz başvurun yok.'),
    });
    sayfaGezgini(g.querySelector('#ilce-basvurulari'), {
      yukle: ilkSayfa(b.sonBasvurular, b.sonBasvurularDevam, 'ilce-basvurulari'),
      satir: (x) => `<li><span>${esc(x.oyuncu)}<br><span class="kucuk soluk">${esc(x.ad)} · ${tarihMetni(x.olusturma)}</span></span><span class="sag kucuk">${basvuruDurumMetni(x.durum)}</span></li>`,
      bos: _autoMetin('Henüz başvuru yok.'),
    });
  } catch (e) { bildir(e.message, true); }
}

// 0.49: Belediye çalışmaları: süren iş, müşteri etkisi, geçmiş; başkan yeni çalışma başlatır
function belediyeCalismaCiz(kutu, c) {
  if (!kutu || !c) return;
  const yuzde = (x) => `%${Math.round(x * 100)}`;
  const a = c.aktif;
  kutu.innerHTML = `<div class="kart bel-calisma"><h3>🏗️ ${_autoHtml('Belediye çalışmaları')}</h3>
    ${a ? `<div class="bel-aktif"><span class="bel-simge">${a.simge}</span><div style="flex:1;min-width:0"><b>${esc(a.ad)}</b>
        <div class="cubuk"><div style="width:${Math.min(100, Math.round(((simdi() - a.basla) / (a.bitis - a.basla)) * 100))}%"></div></div>
        <small class="soluk">${_autoSablon`Bitmesine ${sureMetni(a.bitis - simdi())} · ekip mahallede çalışıyor`}</small></div></div>`
      : `<p class="kucuk soluk" style="margin:0 0 8px">${_autoHtml('Şu an süren bir çalışma yok.')}</p>`}
    <p class="kucuk" style="margin:6px 0">${c.etki > 0 ? _autoSablon`✨ Biten çalışmalar ilçedeki dükkân ve tezgâhlara ${yuzde(c.etki)} daha çok müşteri getiriyor.` : _autoHtml('Biten çalışmalar ilçedeki dükkân ve tezgâhlara bir süre daha çok müşteri getirir.')}</p>
    ${c.suren.length ? `<ul class="bel-etkiler">${c.suren.map((x) => `<li>${x.simge} ${esc(x.ad)} <small class="soluk">${_autoSablon`${sureMetni(x.etkiBitis - simdi())} daha`}</small></li>`).join('')}</ul>` : ''}
    ${c.baskanMiyim ? `<h4>${_autoHtml('Yeni çalışma başlat')} <small class="soluk">· ${_autoSablon`kasa ${tl(c.kasa)}`}</small></h4><div class="bel-secenekler">${c.secenekler.map((x) => `<button class="bel-secenek" data-bel-calisma="${x.kod}" ${a || c.kasa < x.maliyet ? 'disabled' : ''}>
        <span>${x.simge}</span><b>${esc(x.ad)}</b><small>${tl(x.maliyet)} · ${_autoSablon`${x.saat} sa`} · +${yuzde(x.etki)} · ${_autoSablon`${x.gun} gün`}${x.keyif ? ` · 😊+${x.keyif}` : ''}</small></button>`).join('')}</div>`
      : `<p class="kucuk soluk" style="margin:6px 0 0">${_autoHtml('Çalışmaları başkan başlatır; başkan yoksa belediye kasası yettikçe kendisi yapar. Belediye kasası ruhsat, izin ve zabıta cezalarıyla ve genel bütçe payıyla dolar.')}</p>`}
  </div>`;
  kutu.querySelectorAll('[data-bel-calisma]').forEach((b) => b.addEventListener('click', async () => {
    const x = c.secenekler.find((y) => y.kod === b.dataset.belCalisma);
    if (!(await onayla(_autoSablon`${x.ad} başlatılsın mı? Belediye kasasından ${tl(x.maliyet)} harcanır.`, { evet: _autoMetin('Başlat'), ikon: x.simge }))) return;
    const r = await eylem(b, () => api('belediye/calisma', { tur: x.kod }));
    if (r === undefined) return;
    bildir(_autoMetin('Çalışma başladı. Ekip mahallede!'));
    await caddeYenile().catch(() => {});
    belediyePaneli();
  }));
}

// Belediye penceresinde seçim özeti: takvim, başkansan bekleyen başvuru sayısı; ayrıntı Seçimler ekranında
async function secimCiz(kutu) {
  if (!kutu) return;
  let x;
  try { x = await api('secim'); } catch (e) { return; }
  if (!kutu.isConnected) return;
  const s = x.secimler.belediye;
  const evre = s.evre === 'adaylik' ? _autoSablon`🎤 Adaylık açık! ${sureMetni(s.oylamaBas - simdi())} kaldı.` : s.evre === 'oylama' ? _autoSablon`🗳️ Oylama sürüyor: ${sureMetni(s.gorevBas - simdi())} kaldı.` : _autoSablon`Sıradaki adaylık ${sureMetni(s.adaylikBas - simdi())} sonra açılır.`;
  kutu.innerHTML = `${x.belediye.baskanMiyim ? `<div class="kart basari"><h3>${_autoSablon`🏛️ Başkansın: ${x.belediye.bekleyenler.length} bekleyen başvuru`}</h3><a class="dugme yesil kucuk" href="#/secim/belediye">${_autoHtml("Başkanlık masasına git")}</a></div>` : ''}
    <div class="kart"><h3>🗳️ ${_autoHtml("Başkanlık seçimi")}</h3><p class="kucuk" style="margin:0 0 8px">${_autoSablon`${evre} Seçim her ay yapılır; kazanan ayın 1'inde göreve başlar.`}</p>
      <a class="dugme mavi kucuk" href="#/secim/belediye">${_autoHtml("Seçim ekranına git")}</a></div>`;
}

// ---------- Mesajlar ----------
function saatMetni(ms) {
  const t = new Date(ms);
  const bugun = new Date().toDateString() === t.toDateString();
  return bugun ? t.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : t.toLocaleString(sayiDili(), { dateStyle: 'short', timeStyle: 'short' });
}

// ---------- Sohbet görünümü ----------
// Mesajlar sabit yükseklikte bir kutuda akar; yazı alanı tek satır ve sabit boydadır (yazdıkça büyümez).
// Aynı kişinin art arda (5 dk içinde) yazdıkları tek grupta toplanır; gün değişince ayraç çıkar.
function gunEtiketi(ms) {
  const t = new Date(ms + 3 * 3600000);
  const bugun = new Date(simdi() + 3 * 3600000);
  const fark = Math.round((Date.UTC(bugun.getUTCFullYear(), bugun.getUTCMonth(), bugun.getUTCDate()) - Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate())) / 86400000);
  if (fark === 0) return _autoMetin('Bugün');
  if (fark === 1) return _autoMetin('Dün');
  if (fark < 7) return haftaGunuAdi(t.getUTCDay());
  return `${t.getUTCDate()}.${String(t.getUTCMonth() + 1).padStart(2, '0')}.${t.getUTCFullYear()}`;
}
function gunAnahtari(ms) { return new Date(ms + 3 * 3600000).toISOString().slice(0, 10); }
// akis: mesajların eklendiği kutu; mesajlar: { id, metin, zaman, benden, ad?, foto?, seviye? }
function sohbetEkle(akis, mesajlar, { basa = false, kimlik = null } = {}) {
  const parca = document.createDocumentFragment();
  let son = basa ? null : akis._son || null;
  for (const m of mesajlar) {
    const yazar = m.benden ? '__ben' : (m.ad || (kimlik && kimlik.ad) || '');
    const gun = gunAnahtari(m.zaman);
    if (!son || son.gun !== gun) {
      const a = document.createElement('div');
      a.className = 'sy-gun';
      a.dataset.gun = gun;
      a.innerHTML = `<span>${gunEtiketi(m.zaman)}</span>`;
      parca.appendChild(a);
      son = null;
    }
    if (m.sistem) {
      // grup bilgi satırı (kuruldu, eklendi, ayrıldı…)
      const b2 = document.createElement('div');
      b2.className = 'sy-sistem';
      b2.textContent = m.metin;
      parca.appendChild(b2);
      son = { yazar: '__sistem', zaman: m.zaman, gun };
      continue;
    }
    const devam = son && son.yazar === yazar && m.zaman - son.zaman < 5 * 60000;
    const sat = document.createElement('div');
    sat.className = `sy-satir ${m.benden ? 'ben' : ''} ${devam ? 'devam' : 'ilk'}`;
    const ad = m.ad || (kimlik && kimlik.ad) || '';
    const foto = m.foto !== undefined ? m.foto : kimlik && kimlik.foto;
    sat.innerHTML = `${m.benden ? '' : `<span class="sy-avatar">${devam ? '' : `<button data-ad="${esc(ad)}" title="${esc(ad)}">${avatarHtml(foto, ad, 34, '', m.gr)}</button>`}</span>`}
      <div class="sy-balon">${!m.benden && !devam && m.ad ? `<button class="sy-ad" data-ad="${esc(ad)}">${isimHtml(ad, m.gr)}${m.seviye ? `<i>${m.seviye}</i>` : ''}</button>` : ''}
        <span class="sy-metin">${esc(m.metin)}</span><small class="sy-saat">${saatMetni(m.zaman)}</small></div>`;
    parca.appendChild(sat);
    son = { yazar, zaman: m.zaman, gun };
  }
  const bos = akis.querySelector('.sy-bos');
  if (bos && mesajlar.length) bos.remove();
  if (basa) akis.prepend(parca);
  else { akis.appendChild(parca); akis._son = son; }
}
function sohbetKutusu({ ipucu, bos, ust = '' }) {
  return `<div class="sy-kutu">${ust}<div class="sy-akis" data-akis><div class="sy-bos">${bos}</div></div>
    <form class="sy-yaz" data-yaz><input name="metin" maxlength="300" placeholder="${esc(ipucu)}" autocomplete="off" enterkeyhint="send" aria-label="Mesaj">
      <button type="submit" class="sy-gonder" aria-label="Gönder"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg></button></form></div>`;
}
function asagiKaydir(akis, yumusak) {
  requestAnimationFrame(() => akis.scrollTo({ top: akis.scrollHeight, behavior: yumusak ? 'smooth' : 'auto' }));
}

// ---------- Mesajlaşma (Messenger düzeni) ----------
// Tam yükseklikte tek pencere: solda sohbet listesi, sağda açık sohbet (dar ekranda ikisi sırayla).
// Üst bilgi sabit, mesaj akışı kendi içinde kayar, yazma alanı her zaman en altta görünür.
// Telefonda klavye açılınca pencere görünen alana (visualViewport) göre küçülür; yazma alanı klavyenin üstünde kalır.
const ms = { kok: null, secili: null, jeton: 0, sonId: 0, enEski: 0, devam: false, yukleniyor: false, listeSayfa: 0, sonSohbet: 0, tik: 0 };
const msGenis = () => window.matchMedia('(min-width: 900px)').matches;
const GONDER_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg>';
const ARA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3a7 7 0 1 0 4.2 12.6l5.1 5.1 1.4-1.4-5.1-5.1A7 7 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/></svg>';

function mesajlarPaneli(sekme = d.mesajSekmesi || 'ozel') { d.mesajSekmesi = sekme; return mesajlasma({ sekme }); }
function konusmaPaneli(ad) { return mesajlasma({ ad }); }

function mesajlasma({ sekme, ad, grup } = {}) {
  if (aktifRota() !== 'mesajlar') history.replaceState(null, '', '#/mesajlar');
  let kok = !katman.hidden && katman.querySelector('.ms');
  if (!kok) {
    const p = panelAc({
      baslik: _autoMetin('Mesajlar'), rota: 'mesajlar',
      govde: `<div class="ms" data-gorunum="liste">
        <aside class="ms-liste" aria-label="${_autoHtml("Sohbetler")}">
          <header class="ms-bas"><h2>${_autoHtml("Sohbetler")}</h2><button class="ms-ikon-dugme ms-kapat" data-kapat aria-label="${_autoHtml("Kapat")}">✕</button></header>
          <form class="ms-ara" data-ara>${ARA_SVG}<input name="ad" maxlength="20" placeholder="${_autoHtml("Türkiye'deki bir oyuncuyu ara")}" autocapitalize="off" autocomplete="off" aria-label="${_autoHtml("Oyuncu adı")}" enterkeyhint="go"></form>
          <div class="ms-kaydir" data-liste-kaydir>
            <div data-arama hidden><div class="ms-ara-baslik">${_autoHtml("Oyuncular")}</div><ul class="ms-kisiler" data-arama-sonuc></ul></div>
            <button class="ms-kisi ms-ilce" data-ilce><span class="ms-avatar ms-ilce-ikon" aria-hidden="true">🏘️</span>
              <span class="ms-kisi-bilgi"><span class="ms-kisi-ust"><b>${_autoSablon`${esc(d.genel.oyuncu.ilce.ad)} sohbeti`}</b></span><span class="ms-kisi-alt">${_autoHtml("İlçedeki herkesle konuş")}</span></span></button>
            <a class="ms-kisi ms-ilce" href="#/arkadaslar" data-arkadaslar><span class="ms-avatar ms-ilce-ikon" aria-hidden="true">👥</span>
              <span class="ms-kisi-bilgi"><span class="ms-kisi-ust"><b>${_autoHtml("Arkadaşlar")}</b>${Number(d.genel.arkadasIstek) > 0 ? `<span class="ms-sayac">${Number(d.genel.arkadasIstek)}</span>` : ''}</span><span class="ms-kisi-alt">${Number(d.genel.arkadasIstek) > 0 ? _autoSablon`${Number(d.genel.arkadasIstek)} yeni arkadaşlık isteği` : _autoHtml("Arkadaşların, istekler ve oyuncu bul")}</span></span></a>
            <div class="ms-ara-baslik ms-baslik-eylem"><span>${_autoHtml("Gruplar")}</span><button data-grup-kur>${_autoHtml("＋ Grup kur")}</button></div>
            <ul class="ms-kisiler" data-gruplar></ul>
            <div class="ms-ara-baslik">${_autoHtml("Özel mesajlar")}</div>
            <ul class="ms-kisiler" data-kisiler><li class="ms-yukleniyor"><span></span><span></span><span></span></li></ul>
            <button class="ms-alt-dugme" data-daha hidden>${_autoHtml("Daha eski sohbetler")}</button>
            <button class="ms-alt-dugme" data-engelliler>${_autoHtml("🚫 Engellediğin kişiler")}</button>
            <p class="ms-saklama">${_autoHtml("🕑 Mesajlar 30 gün saklanır, sonra kendiliğinden silinir.")}</p>
          </div>
        </aside>
        <section class="ms-sohbet" data-sohbet aria-live="polite">
          <div class="ms-secilmedi"><span aria-hidden="true">💬</span><b>${_autoHtml("Bir sohbet seç")}</b><small>${_autoHtml("Soldan bir kişi ya da ilçe sohbetini seç, veya yukarıdan oyuncu adıyla yeni sohbet başlat.")}</small><small class="ms-saklama">${_autoHtml("🕑 Mesajlar 30 gün saklanır, sonra kendiliğinden silinir.")}</small></div>
        </section>
      </div>`,
    });
    p.classList.add('ms-panel');
    katman.classList.add('mesajlasma');
    kok = p.querySelector('.ms');
    msKur(kok);
  }
  if (ad) msAc(kok, { tur: 'ozel', ad });
  else if (grup) msAc(kok, { tur: 'grup', id: Number(grup) });
  else if (sekme === 'sohbet') msAc(kok, { tur: 'ilce' });
  else msListeyeDon(kok);
}

function msKur(kok) {
  ms.kok = kok; ms.secili = null; ms.jeton++;
  kok.querySelector('[data-ilce]').addEventListener('click', () => { ses.tik(); msAc(kok, { tur: 'ilce' }); });
  kok.querySelector('[data-kisiler]').addEventListener('click', (e) => { const b = e.target.closest('[data-kisi]'); if (b) { ses.tik(); msAc(kok, { tur: 'ozel', ad: b.dataset.kisi }); } });
  kok.querySelector('[data-daha]').addEventListener('click', () => { ses.tik(); msListeYukle(kok, ms.listeSayfa + 1); });
  kok.querySelector('[data-engelliler]').addEventListener('click', () => { ses.tik(); msEngelliler(kok); });
  kok.querySelector('[data-gruplar]').addEventListener('click', (e) => { const b = e.target.closest('[data-grup]'); if (b) { ses.tik(); msAc(kok, { tur: 'grup', id: Number(b.dataset.grup) }); } });
  kok.querySelector('[data-grup-kur]').addEventListener('click', () => { ses.tik(); msGrupKur(kok); });
  const aramaKutu = kok.querySelector('[data-arama]');
  const aramaUl = kok.querySelector('[data-arama-sonuc]');
  aramaUl.addEventListener('click', (e) => { const b = e.target.closest('[data-kisi]'); if (b) { ses.tik(); msAc(kok, { tur: 'ozel', ad: b.dataset.kisi }); } });
  const ara = kok.querySelector('[data-ara]');
  let araZaman = null;
  ara.elements.ad.addEventListener('input', () => {
    const q = ara.elements.ad.value.trim().toLocaleLowerCase('tr');
    kok.querySelectorAll('[data-kisiler] > li[data-ad]').forEach((li) => { li.hidden = !!q && !li.dataset.ad.toLocaleLowerCase('tr').includes(q); });
    kok.querySelectorAll('[data-gruplar] > li[data-ad]').forEach((li) => { li.hidden = !!q && !li.dataset.ad.toLocaleLowerCase('tr').includes(q); });
    // Türkiye'deki bütün oyuncular arasında arama (adın bir parçası yeter)
    clearTimeout(araZaman);
    if (q.length < 2) { aramaKutu.hidden = true; return; }
    araZaman = setTimeout(async () => {
      let l = [];
      try { l = await api('oyuncu-ara?q=' + encodeURIComponent(q)); } catch (e) { /* yok say */ }
      if (ara.elements.ad.value.trim().toLocaleLowerCase('tr') !== q) return;
      aramaKutu.hidden = false;
      aramaUl.innerHTML = l.length ? l.map((x) => `<li><button class="ms-kisi" data-kisi="${esc(x.ad)}"><span class="ms-avatar" aria-hidden="true">${avatarHtml(x.foto, x.ad, 44)}</span>
        <span class="ms-kisi-bilgi"><span class="ms-kisi-ust"><b>${esc(x.ad)}</b><small>${_autoSablon`${x.seviye}. sv`}</small></span><span class="ms-kisi-alt">📍 ${esc(x.yer)}</span></span></button></li>`).join('')
        : `<li class="ms-liste-bos">${_autoHtml("Bu adla oyuncu bulunamadı.")}</li>`;
    }, 280);
  });
  ara.addEventListener('submit', (e) => {
    e.preventDefault();
    const ad = ara.elements.ad.value.trim();
    if (!ad) return;
    const ilk = aramaUl.querySelector('[data-kisi]');
    ara.elements.ad.value = '';
    ara.elements.ad.dispatchEvent(new Event('input'));
    msAc(kok, { tur: 'ozel', ad: ilk && !aramaKutu.hidden ? ilk.dataset.kisi : ad });
  });
  msListeYukle(kok, 0);
  // canlı bağlantı varsa yeni mesajlar anında gelir; yoklama yalnızca yedek
  clearInterval(d.panelZamanlayici);
  d.panelZamanlayici = setInterval(() => {
    if (!kok.isConnected) return;
    ms.tik++;
    msTazele(kok);
    if (ms.tik % 3 === 0) msListeYukle(kok, 0, true);
  }, canliAcik() ? 30000 : 5000);
  d.panelCanli = (tur, v) => {
    if (!kok.isConnected) return false;
    if (tur === 'sohbet') { if (ms.secili && ms.secili.tur === 'ilce' && (!v || !v.kanal || v.kanal < 1000000)) msTazele(kok); return false; }
    if (tur === 'grup' && v) {
      msListeYukle(kok, 0, true);
      if (ms.secili && ms.secili.tur === 'grup' && ms.secili.id === Number(v.grupId)) { msTazele(kok); if (v.metin) ses.mesaj(); return true; }
      return false;
    }
    if (tur !== 'mesaj' || !v) return false;
    msListeYukle(kok, 0, true);
    if (ms.secili && ms.secili.tur === 'ozel' && String(v.ad).toLocaleLowerCase('tr') === String(ms.secili.ad).toLocaleLowerCase('tr')) {
      msTazele(kok);
      ses.mesaj();
      return true;
    }
    return false;
  };
}

function msKisiSatiri(x) {
  const zamanM = gunEtiketi(x.zaman) === _autoMetin('Bugün') ? saatMetni(x.zaman) : gunEtiketi(x.zaman);
  const secili = ms.secili && ms.secili.tur === 'ozel' && ms.secili.ad.toLocaleLowerCase('tr') === x.ad.toLocaleLowerCase('tr');
  return `<li data-ad="${esc(x.ad)}"><button class="ms-kisi ${x.okunmamis ? 'yeni' : ''} ${secili ? 'secili' : ''}" data-kisi="${esc(x.ad)}">
    <span class="ms-avatar" aria-hidden="true">${avatarHtml(x.foto, x.ad, 48)}</span>
    <span class="ms-kisi-bilgi"><span class="ms-kisi-ust"><b>${esc(x.ad)}</b><small>${zamanM}</small></span>
      <span class="ms-kisi-alt">${x.benden ? _autoHtml('Sen: ') : ''}${esc(String(x.son || '').slice(0, 80))}</span></span>
    ${x.okunmamis ? `<span class="ms-sayac">${x.okunmamis > 99 ? '99+' : x.okunmamis}</span>` : ''}</button></li>`;
}

function msGrupSatiri(g) {
  const zamanM = gunEtiketi(g.zaman) === _autoMetin('Bugün') ? saatMetni(g.zaman) : gunEtiketi(g.zaman);
  const secili = ms.secili && ms.secili.tur === 'grup' && ms.secili.id === g.id;
  return `<li data-ad="${esc(g.ad)}"><button class="ms-kisi ${g.okunmamis ? 'yeni' : ''} ${secili ? 'secili' : ''}" data-grup="${g.id}">
    <span class="ms-avatar ms-grup-ikon" aria-hidden="true">${esc(g.ad.slice(0, 1).toLocaleUpperCase('tr'))}<i>👥</i></span>
    <span class="ms-kisi-bilgi"><span class="ms-kisi-ust"><b>${esc(g.ad)}</b><small>${zamanM}</small></span>
      <span class="ms-kisi-alt">${esc(String(g.son || _autoSablon`${g.uye} üye`).slice(0, 80))}</span></span>
    ${g.okunmamis ? `<span class="ms-sayac">${g.okunmamis > 99 ? '99+' : g.okunmamis}</span>` : ''}</button></li>`;
}
async function msGruplariYukle(kok) {
  let l;
  try { l = await api('gruplar'); } catch (e) { return; }
  if (!kok.isConnected) return;
  const ul = kok.querySelector('[data-gruplar]');
  ul.innerHTML = l.length ? l.map(msGrupSatiri).join('') : `<li class="ms-liste-bos kucuk">${_autoHtml("Henüz bir grubun yok. Arkadaşlarınla grup kur!")}</li>`;
}
async function msListeYukle(kok, sayfa, sessiz) {
  if (sayfa === 0) msGruplariYukle(kok);
  const ul = kok.querySelector('[data-kisiler]');
  const daha = kok.querySelector('[data-daha]');
  let r;
  try { r = await api('mesajlar?sayfa=' + sayfa); } catch (e) { if (!sessiz) ul.innerHTML = `<li class="ms-hata">${esc(e.message)}</li>`; return; }
  if (!kok.isConnected) return;
  // sessiz yenilemede yalnızca ilk sayfa tazelenir (daha eski sayfalar yerinde kalır)
  if (sayfa === 0) {
    const eskiler = sessiz ? [...ul.querySelectorAll('li[data-ad][data-sayfa]')].filter((li) => Number(li.dataset.sayfa) > 0) : [];
    ul.innerHTML = r.liste.length ? r.liste.map(msKisiSatiri).join('') : `<li class="ms-liste-bos">${_autoHtml("Henüz özel mesajın yok. Birinin adına dokunarak ya da yukarıdan adını yazarak sohbet başlat.")}</li>`;
    const adlar = new Set(r.liste.map((x) => x.ad));
    for (const li of eskiler) if (!adlar.has(li.dataset.ad)) ul.appendChild(li);
    if (!sessiz) ms.listeSayfa = 0;
  } else {
    ul.insertAdjacentHTML('beforeend', r.liste.map(msKisiSatiri).join('').replace(/<li /g, `<li data-sayfa="${sayfa}" `));
    ms.listeSayfa = sayfa;
  }
  if (!sessiz || sayfa > 0) daha.hidden = !r.devam;
  const q = kok.querySelector('[data-ara]').elements.ad.value;
  if (q) kok.querySelector('[data-ara]').elements.ad.dispatchEvent(new Event('input'));
}

function msListeyeDon(kok) {
  kok.dataset.gorunum = 'liste';
  if (!msGenis()) { ms.secili = null; ms.jeton++; }
  msListeYukle(kok, 0, true);
}

function msSeciliIsaretle(kok) {
  const s = ms.secili;
  kok.querySelector('[data-ilce]').classList.toggle('secili', !!s && s.tur === 'ilce');
  kok.querySelectorAll('[data-kisi]').forEach((b) => b.classList.toggle('secili', !!s && s.tur === 'ozel' && b.dataset.kisi.toLocaleLowerCase('tr') === s.ad.toLocaleLowerCase('tr')));
  kok.querySelectorAll('[data-grup]').forEach((b) => b.classList.toggle('secili', !!s && s.tur === 'grup' && Number(b.dataset.grup) === s.id));
}

function msBaslik({ avatar, ad, alt, eylemler = '' }) {
  return `<header class="ms-sohbet-bas">
    <button class="ms-ikon-dugme ms-geri" data-geri aria-label="Sohbetlere dön"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 4.6 14 3.2 5.2 12l8.8 8.8 1.4-1.4L8 12z"/></svg></button>
    <span class="ms-avatar">${avatar}</span>
    <span class="ms-sohbet-ad"><b>${ad}</b><small>${alt}</small></span>
    <span class="ms-sohbet-eylem">${eylemler}<button class="ms-ikon-dugme ms-kapat-dar" data-kapat aria-label="Kapat">✕</button></span>
  </header>`;
}
function msYazici(ipucu) {
  return `<form class="ms-yaz" data-yaz><textarea name="metin" rows="1" maxlength="300" placeholder="${esc(ipucu)}" enterkeyhint="send" aria-label="Mesaj yaz"></textarea>
    <button type="submit" class="ms-gonder" aria-label="Gönder" disabled>${GONDER_SVG}</button></form>`;
}

async function msAc(kok, secim) {
  const bolum = kok.querySelector('[data-sohbet]');
  const jeton = ++ms.jeton;
  ms.secili = secim; ms.sonId = 0; ms.enEski = 0; ms.devam = false; ms.sonSohbet = 0;
  kok.dataset.gorunum = 'sohbet';
  msSeciliIsaretle(kok);
  let k = null;
  if (secim.tur === 'ozel') {
    bolum.innerHTML = `${msBaslik({ avatar: avatarHtml(null, secim.ad, 40), ad: esc(secim.ad), alt: _autoMetin('Yükleniyor…') })}<div class="ms-akis"><div class="ms-yukleniyor"><span></span><span></span><span></span></div></div>`;
    msBaslikBagla(kok, bolum);
    try { k = await api('mesajlar/' + encodeURIComponent(secim.ad)); } catch (e) {
      if (jeton !== ms.jeton) return;
      bolum.querySelector('.ms-akis').innerHTML = `<div class="ms-secilmedi"><span aria-hidden="true">🤷</span><b>${esc(e.message)}</b><small>${_autoHtml("Kullanıcı adını kontrol edip yeniden dene.")}</small></div>`;
      bolum.querySelector('.ms-sohbet-ad small').textContent = '';
      return;
    }
    if (jeton !== ms.jeton) return;
    secim.ad = k.diger.ad;
    ms.kimlik = { ad: k.diger.ad, foto: k.diger.foto, id: k.diger.id };
    ms.engelli = !!k.diger.engelli;
    bolum.innerHTML = msBaslik({
      avatar: `<button class="ms-profil" data-profil aria-label="${esc(k.diger.ad)} profili">${avatarHtml(k.diger.foto, k.diger.ad, 40)}</button>`,
      ad: `<button class="ms-profil" data-profil>${esc(k.diger.ad)}</button>`,
      alt: k.diger.engelli ? _autoMetin('🚫 Engelledin') : _autoMetin('Özel mesaj'),
      eylemler: `<span class="ms-menu-kutu"><button class="ms-ikon-dugme" data-menu aria-label="${_autoHtml("Seçenekler")}" aria-haspopup="true" aria-expanded="false">⋯</button>
        <span class="ms-menu" data-menu-liste hidden role="menu">
          <button role="menuitem" data-profil>${_autoHtml("👤 Profili gör")}</button>
          <button role="menuitem" data-engel>${k.diger.engelli ? _autoHtml('✅ Engeli kaldır') : '🚫 Engelle'}</button>
          <button role="menuitem" data-sikayet>${_autoHtml("⚑ Şikâyet et")}</button></span></span>`,
    }) + `<div class="ms-akis-kutu"><div class="ms-akis" data-akis>
        <div class="ms-onceki" data-onceki hidden><span class="ms-yukleniyor"><span></span><span></span><span></span></span></div>
        <div class="sy-bos ms-ilk"><span class="ms-ilk-avatar">${avatarHtml(k.diger.foto, k.diger.ad, 72)}</span><b>${esc(k.diger.ad)}</b><small>${_autoHtml("Henüz konuşmadınız. İlk mesajı sen yaz! ✍️")}</small></div></div>
        <button class="ms-yeni-mesaj" data-asagi hidden>↓ ${_autoHtml("Yeni mesaj")}</button></div>
      ${k.diger.engelli
        ? `<div class="ms-engel-serit">🚫 <span>${_autoSablon`${esc(k.diger.ad)} kişisini engelledin. Sana yazamaz, sen de ona yazamazsın.`}</span><button class="dugme kucuk mavi" data-engel>${_autoHtml("Engeli kaldır")}</button></div>`
        : msYazici(_autoSablon`${k.diger.ad} kişisine yaz…`)}`;
  } else if (secim.tur === 'grup') {
    ms.kimlik = null; ms.engelli = false;
    bolum.innerHTML = `${msBaslik({ avatar: '<span class="ms-ilce-ikon ms-grup-ikon">👥</span>', ad: 'Grup', alt: _autoMetin('Yükleniyor…') })}<div class="ms-akis"><div class="ms-yukleniyor"><span></span><span></span><span></span></div></div>`;
    msBaslikBagla(kok, bolum);
    try { k = await api('gruplar/' + secim.id); } catch (e) {
      if (jeton !== ms.jeton) return;
      bolum.querySelector('.ms-akis').innerHTML = `<div class="ms-secilmedi"><span aria-hidden="true">👥</span><b>${esc(e.message)}</b></div>`;
      return;
    }
    if (jeton !== ms.jeton) return;
    ms.grup = k.grup;
    bolum.innerHTML = msBaslik({
      avatar: `<span class="ms-ilce-ikon ms-grup-ikon">${esc(k.grup.ad.slice(0, 1).toLocaleUpperCase('tr'))}</span>`,
      ad: `<button class="ms-profil" data-uyeler>${esc(k.grup.ad)}</button>`,
      alt: `<button class="ms-profil" data-uyeler>${_autoSablon`${k.grup.uyeler.length} üye ·`} ${esc(k.grup.uyeler.slice(0, 4).map((u) => u.ad).join(', '))}${k.grup.uyeler.length > 4 ? '…' : ''}</button>`,
      eylemler: `<span class="ms-menu-kutu"><button class="ms-ikon-dugme" data-menu aria-label="${_autoHtml("Grup seçenekleri")}" aria-haspopup="true" aria-expanded="false">⋯</button>
        <span class="ms-menu" data-menu-liste hidden role="menu">
          <button role="menuitem" data-uyeler>${_autoHtml("👥 Üyeler ve üye ekle")}</button>
          <button role="menuitem" data-grup-ad>${_autoHtml("✏️ Grubun adını değiştir")}</button>
          <button role="menuitem" data-grup-ayril>🚪 ${_oyunHtml("ui.7d87365e0a5c")}</button></span></span>`,
    }) + `<div class="ms-akis-kutu"><div class="ms-akis" data-akis>
        <div class="ms-onceki" data-onceki hidden><span class="ms-yukleniyor"><span></span><span></span><span></span></span></div>
        <div class="sy-bos">${_autoHtml("Gruba ilk mesajı sen yaz! 👋")}</div></div>
        <button class="ms-yeni-mesaj" data-asagi hidden>↓ ${_autoHtml("Yeni mesaj")}</button></div>${msYazici(`${k.grup.ad} grubuna yaz…`)}`;
    bolum.querySelectorAll('[data-uyeler]').forEach((b) => b.addEventListener('click', () => { ses.tik(); msGrupUyeleri(kok, secim.id); }));
    bolum.querySelector('[data-grup-ad]').addEventListener('click', async () => {
      const yeni = await sor(_autoMetin('Grubun yeni adı:'), { baslik: _oyunMetni("ui.7422a039c11e"), ipucu: k.grup.ad, ikon: '✏️', uzunluk: 40 });
      if (!yeni) return;
      if (await eylem(null, () => api(`gruplar/${secim.id}/ad`, { ad: yeni })) !== undefined) msAc(kok, { tur: 'grup', id: secim.id });
    });
    bolum.querySelector('[data-grup-ayril]').addEventListener('click', async () => {
      if (!(await onayla(_autoSablon`"${k.grup.ad}" grubundan ayrılırsan mesajlarını göremezsin. Biri seni yeniden ekleyebilir.`, { baslik: _oyunMetni("ui.7d87365e0a5c"), evet: _autoMetin('Ayrıl'), tehlike: true, ikon: '🚪' }))) return;
      if (await eylem(null, () => api(`gruplar/${secim.id}/ayril`, {})) !== undefined) { bildir(_autoMetin("Gruptan ayrıldın.")); ms.secili = null; msListeyeDon(kok); if (msGenis()) kok.querySelector('[data-sohbet]').innerHTML = `<div class="ms-secilmedi"><span aria-hidden="true">💬</span><b>${_autoHtml("Bir sohbet seç")}</b></div>`; }
    });
  } else {
    ms.kimlik = null; ms.engelli = false;
    bolum.innerHTML = msBaslik({ avatar: '<span class="ms-ilce-ikon">🏘️</span>', ad: `${esc(d.genel.oyuncu.ilce.ad)} sohbeti`, alt: _autoMetin('İlçedeki herkes görür · Özel yazmak için ada dokun') })
      + `<div class="ms-akis-kutu"><div class="ms-akis" data-akis><div class="sy-bos">${_autoHtml("Henüz kimse yazmamış. İlk mesajı sen yaz! 👋")}</div></div>
        <button class="ms-yeni-mesaj" data-asagi hidden>↓ ${_autoHtml("Yeni mesaj")}</button></div>${msYazici(_autoSablon`${d.genel.oyuncu.ilce.ad} ilçesine yaz…`)}`;
  }
  msBaslikBagla(kok, bolum);
  const akis = bolum.querySelector('[data-akis]');
  const asagi = bolum.querySelector('[data-asagi]');
  akis.addEventListener('click', (e) => { const b = e.target.closest('.sy-ad[data-ad], .sy-avatar [data-ad]'); if (b && b.dataset.ad && secim.tur !== 'ozel') msAc(kok, { tur: 'ozel', ad: b.dataset.ad }); });
  akis.addEventListener('scroll', () => {
    if (akis.scrollHeight - akis.scrollTop - akis.clientHeight < 60) asagi.hidden = true;
    if (akis.scrollTop < 80 && ms.devam && !ms.yukleniyor && secim.tur !== 'ilce') msOncekiler(akis, jeton);
  }, { passive: true });
  asagi.addEventListener('click', () => { asagi.hidden = true; asagiKaydir(akis, true); });
  if (k) {
    msEkle(akis, k.mesajlar, true);
    ms.devam = k.devam;
    ms.enEski = k.mesajlar.length ? k.mesajlar[0].id : 0;
    // okundu işaretlendi: rozetleri güncelle
    durumYenile().then(toplaButonuGuncelle).catch(() => {});
    if (secim.tur === 'grup') ms.grupId = secim.id;
    msListeYukle(kok, 0, true);
  } else await msTazele(kok, true);
  const form = bolum.querySelector('[data-yaz]');
  if (form) msYaziciBagla(kok, form, secim);
  if (form && msGenis()) form.elements.metin.focus({ preventScroll: true });
}

function msBaslikBagla(kok, bolum) {
  const geri = bolum.querySelector('[data-geri]');
  if (geri) geri.addEventListener('click', () => { ses.tik(); msListeyeDon(kok); });
  const menu = bolum.querySelector('[data-menu]');
  const liste = bolum.querySelector('[data-menu-liste]');
  if (menu) {
    const kapat = (e) => { if (!e || !e.target.closest('.ms-menu-kutu')) { liste.hidden = true; menu.setAttribute('aria-expanded', 'false'); document.removeEventListener('pointerdown', kapat, true); } };
    menu.addEventListener('click', () => {
      ses.tik();
      liste.hidden = !liste.hidden;
      menu.setAttribute('aria-expanded', String(!liste.hidden));
      if (!liste.hidden) document.addEventListener('pointerdown', kapat, true);
    });
    liste.addEventListener('click', () => kapat());
  }
  bolum.querySelectorAll('[data-profil]').forEach((b) => b.addEventListener('click', () => { if (ms.kimlik && ms.kimlik.id) oyuncuKarti(ms.kimlik.id); }));
  bolum.querySelectorAll('[data-engel]').forEach((b) => b.addEventListener('click', () => msEngelDegistir(kok, ms.secili.ad, !ms.engelli)));
  const sik = bolum.querySelector('[data-sikayet]');
  if (sik) sik.addEventListener('click', async () => {
    const ad = ms.secili.ad;
    const neden = await sor(_autoMetin('Şikâyet nedenin nedir?'), { baslik: _autoSablon`${ad} adlı oyuncuyu şikâyet et`, ipucu: _autoMetin('Küfür, dolandırıcılık, rahatsız etme…'), ikon: '⚑' });
    if (!neden) return;
    const son = [...bolum.querySelectorAll('.sy-satir:not(.ben) .sy-metin')].slice(-5).map((x) => x.textContent).join(' | ');
    const r = await eylem(null, () => api('sikayet', { ad, neden, metin: son }));
    if (r !== undefined) bildir(_autoMetin("Şikâyetin yöneticiye iletildi. Teşekkürler."));
  });
}

async function msEngelDegistir(kok, ad, engelle) {
  if (engelle && !(await onayla(_autoSablon`${ad} sana özel mesaj gönderemez, ilçe sohbetindeki yazılarını da görmezsin. Sen de ona yazamazsın. İstediğin zaman engeli kaldırabilirsin.`, { baslik: `${ad} engellensin mi?`, evet: _autoMetin('Engelle'), tehlike: true, ikon: '🚫' }))) return;
  const r = await eylem(null, () => api('engelle', { ad, acik: engelle }));
  if (r === undefined) return;
  bildir(engelle ? `${ad} engellendi.` : _autoSablon`${ad} için engel kaldırıldı.`);
  if (ms.secili && ms.secili.tur === 'ozel' && ms.secili.ad === ad) await msAc(kok, { tur: 'ozel', ad });
  else if (kok.querySelector('[data-engelli-liste]')) msEngelliler(kok);
  msListeYukle(kok, 0, true);
}

async function msEngelliler(kok) {
  const bolum = kok.querySelector('[data-sohbet]');
  ms.secili = null; ms.jeton++;
  kok.dataset.gorunum = 'sohbet';
  msSeciliIsaretle(kok);
  bolum.innerHTML = msBaslik({ avatar: '<span class="ms-ilce-ikon">🚫</span>', ad: _autoMetin('Engellediğin kişiler'), alt: _autoMetin('Sana yazamazlar, sohbette yazıları görünmez') })
    + '<div class="ms-akis ms-engelliler" data-engelli-liste><div class="ms-yukleniyor"><span></span><span></span><span></span></div></div>';
  msBaslikBagla(kok, bolum);
  let l;
  try { l = await api('engellenenler'); } catch (e) { return bildir(e.message, true); }
  const kutu = bolum.querySelector('[data-engelli-liste]');
  if (!kutu) return;
  kutu.innerHTML = l.length ? `<ul class="ms-engel-liste">${l.map((x) => `<li><span class="ms-avatar">${avatarHtml(x.foto, x.ad, 40)}</span><b>${esc(x.ad)}</b><button class="dugme kucuk gri" data-kaldir="${esc(x.ad)}">${_autoHtml("Engeli kaldır")}</button></li>`).join('')}</ul>`
    : `<div class="ms-secilmedi"><span aria-hidden="true">🕊️</span><b>${_autoHtml("Kimseyi engellemedin")}</b><small>${_autoHtml("Rahatsız eden birini sohbet ekranındaki ⋯ menüsünden engelleyebilirsin.")}</small></div>`;
  kutu.querySelectorAll('[data-kaldir]').forEach((b) => b.addEventListener('click', () => msEngelDegistir(kok, b.dataset.kaldir, false)));
}

function msEkle(akis, liste, ilk) {
  const yeni = liste.filter((m) => m.id > ms.sonId);
  if (!yeni.length) return 0;
  const altta = ilk || akis.scrollHeight - akis.scrollTop - akis.clientHeight < 100;
  sohbetEkle(akis, yeni, { kimlik: ms.kimlik });
  ms.sonId = Math.max(ms.sonId, ...yeni.map((m) => m.id));
  if (ilk) { akis.scrollTop = akis.scrollHeight; asagiKaydir(akis); }
  else if (altta || yeni.some((m) => m.benden)) asagiKaydir(akis, true);
  else { const a = akis.parentElement.querySelector('[data-asagi]'); if (a) a.hidden = false; }
  return yeni.length;
}

async function msTazele(kok, ilk) {
  const s = ms.secili;
  if (!s) return;
  const jeton = ms.jeton;
  const akis = kok.querySelector('[data-sohbet] [data-akis]');
  if (!akis) return;
  try {
    if (s.tur === 'ilce') {
      const yeni = await api('sohbet?son=' + ms.sonSohbet);
      if (jeton !== ms.jeton || !yeni.length) return;
      ms.sonSohbet = Math.max(ms.sonSohbet, ...yeni.map((m) => m.id));
      msEkle(akis, yeni, ilk);
    } else if (s.tur === 'grup') {
      const y = await api('gruplar/' + s.id);
      if (jeton !== ms.jeton) return;
      msEkle(akis, y.mesajlar, ilk);
    } else {
      const y = await api('mesajlar/' + encodeURIComponent(s.ad));
      if (jeton !== ms.jeton) return;
      msEkle(akis, y.mesajlar, ilk);
    }
  } catch (e) { /* sessiz */ }
}

async function msOncekiler(akis, jeton) {
  if (!ms.enEski || !ms.secili) return;
  ms.yukleniyor = true;
  const y = akis.querySelector('[data-onceki]');
  if (y) y.hidden = false;
  try {
    const r = await api((ms.secili.tur === 'grup' ? 'gruplar/' + ms.secili.id : 'mesajlar/' + encodeURIComponent(ms.secili.ad)) + '?once=' + ms.enEski);
    if (jeton !== ms.jeton) return;
    const yukseklik = akis.scrollHeight;
    const ilkAyrac = akis.querySelector('.sy-gun');
    const ilkMesaj = akis.querySelector('.sy-satir');
    if (ilkAyrac && r.mesajlar.length && ilkMesaj && ilkAyrac.dataset.gun === gunAnahtari(r.mesajlar[r.mesajlar.length - 1].zaman)) ilkAyrac.remove();
    sohbetEkle(akis, r.mesajlar, { basa: true, kimlik: ms.kimlik });
    if (y) akis.prepend(y);
    if (r.mesajlar.length) ms.enEski = r.mesajlar[0].id;
    ms.devam = r.devam;
    akis.scrollTop += akis.scrollHeight - yukseklik;
  } catch (e) { ms.devam = false; }
  if (y) y.hidden = true;
  ms.yukleniyor = false;
}

function msYaziciBagla(kok, form, secim) {
  const alan = form.elements.metin;
  const dugme = form.querySelector('.ms-gonder');
  const boyutla = () => { alan.style.height = 'auto'; alan.style.height = Math.min(alan.scrollHeight, 132) + 'px'; dugme.disabled = !alan.value.trim(); };
  alan.addEventListener('input', boyutla);
  alan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  // klavye açılınca son mesajlar görünür kalsın
  alan.addEventListener('focus', () => { const akis = kok.querySelector('[data-akis]'); if (akis) setTimeout(() => asagiKaydir(akis), 280); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const metin = alan.value.trim();
    if (!metin) return;
    alan.value = '';
    boyutla();
    alan.focus({ preventScroll: true });
    const r = await eylem(null, () => (secim.tur === 'ilce' ? api('sohbet', { metin }) : secim.tur === 'grup' ? api(`gruplar/${secim.id}/mesaj`, { metin }) : api('mesaj', { alici: secim.ad, metin })));
    if (r === undefined) { if (!alan.value) { alan.value = metin; boyutla(); } return; }
    ses.tik();
    await msTazele(kok);
    msListeYukle(kok, 0, true);
  });
}


// Oyuncu seçici: ad yazdıkça Türkiye'deki oyuncular listelenir, seçilenler çip olur (grup kurma, etkinlik daveti)
function oyuncuSecici(kutu, { ipucu = _autoMetin('Oyuncu adı yaz…'), sinir = 29, secilince = null, tekli = false } = {}) {
  const secilen = new Map();
  kutu.classList.add('os');
  kutu.innerHTML = `<div class="os-cipler" data-cipler></div>
    <div class="os-giris"><input type="search" placeholder="${esc(ipucu)}" autocomplete="off" autocapitalize="off" aria-label="Oyuncu ara"></div>
    <ul class="os-sonuc" data-sonuc hidden></ul>`;
  const inp = kutu.querySelector('input');
  const sonuc = kutu.querySelector('[data-sonuc]');
  const cipler = kutu.querySelector('[data-cipler]');
  const ciz = () => {
    cipler.innerHTML = [...secilen.values()].map((x) => `<span class="os-cip">${avatarHtml(x.foto, x.ad, 22)}<b>${esc(x.ad)}</b><button type="button" data-cikar="${esc(x.ad)}" aria-label="${esc(x.ad)} çıkar">✕</button></span>`).join('');
  };
  cipler.addEventListener('click', (e) => { const b = e.target.closest('[data-cikar]'); if (b) { secilen.delete(b.dataset.cikar); ciz(); } });
  let z = null;
  inp.addEventListener('input', () => {
    clearTimeout(z);
    const q = inp.value.trim();
    if (q.length < 2) { sonuc.hidden = true; return; }
    z = setTimeout(async () => {
      let l = [];
      try { l = await api('oyuncu-ara?q=' + encodeURIComponent(q)); } catch (e) { /* yok say */ }
      if (inp.value.trim() !== q) return;
      sonuc.hidden = false;
      sonuc.innerHTML = l.length ? l.map((x, i) => `<li><button type="button" data-sec="${i}">${avatarHtml(x.foto, x.ad, 30)}<span><b>${esc(x.ad)}</b><small>${_autoSablon`${x.seviye}. sv · ${esc(x.yer)}`}</small></span>${secilen.has(x.ad) ? '<i>✓</i>' : ''}</button></li>`).join('')
        : `<li class="os-yok">${_autoHtml("Bu adla oyuncu bulunamadı.")}</li>`;
      sonuc.querySelectorAll('[data-sec]').forEach((b) => b.addEventListener('click', () => {
        const x = l[Number(b.dataset.sec)];
        if (tekli) secilen.clear();
        if (secilen.size >= sinir && !secilen.has(x.ad)) return bildir(_autoSablon`En çok ${sinir} kişi seçebilirsin.`, true);
        secilen.set(x.ad, x);
        ciz();
        inp.value = '';
        sonuc.hidden = true;
        inp.focus();
        if (secilince) secilince(x);
      }));
    }, 250);
  });
  return { secilenler: () => [...secilen.keys()], temizle() { secilen.clear(); ciz(); } };
}

function msGrupKur(kok) {
  const bolum = kok.querySelector('[data-sohbet]');
  ms.secili = null; ms.jeton++;
  kok.dataset.gorunum = 'sohbet';
  msSeciliIsaretle(kok);
  bolum.innerHTML = msBaslik({ avatar: '<span class="ms-ilce-ikon ms-grup-ikon">👥</span>', ad: _autoMetin('Yeni grup'), alt: _autoMetin('Türkiye\'nin her yerinden oyuncuları ekleyebilirsin') })
    + `<div class="ms-akis ms-form"><form data-grup-form>
        <label>${_oyunHtml("ui.7422a039c11e")}<input name="ad" maxlength="40" placeholder="${_autoHtml("Örn. Kadıköy esnafı")}" required></label>
        <label>${_autoHtml("Üyeler")}</label><div data-secici></div>
        <p class="kucuk soluk">${_autoSablon`En çok ${30} kişi. Üyeler sonradan da eklenebilir.`}</p>
        <button class="dugme yesil">👥 ${_autoHtml("Grubu kur")}</button></form></div>`;
  msBaslikBagla(kok, bolum);
  const secici = oyuncuSecici(bolum.querySelector('[data-secici]'), { ipucu: _autoMetin('Eklemek istediğin oyuncunun adı…') });
  bolum.querySelector('[data-grup-form]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ad = e.target.elements.ad.value.trim();
    const r = await eylem(e.target.querySelector('button'), () => api('gruplar', { ad, uyeler: secici.secilenler() }));
    if (r === undefined) return;
    ses.satinAl();
    msGruplariYukle(kok);
    msAc(kok, { tur: 'grup', id: r.id });
  });
}

async function msGrupUyeleri(kok, grupId) {
  const bolum = kok.querySelector('[data-sohbet]');
  let k;
  try { k = await api('gruplar/' + grupId); } catch (e) { return bildir(e.message, true); }
  ms.jeton++;
  bolum.innerHTML = msBaslik({ avatar: `<span class="ms-ilce-ikon ms-grup-ikon">${esc(k.grup.ad.slice(0, 1).toLocaleUpperCase('tr'))}</span>`, ad: esc(k.grup.ad), alt: _autoSablon`${k.grup.uyeler.length} üye` })
    + `<div class="ms-akis ms-form">
        <label>${_autoHtml("Üye ekle")}</label><div data-secici></div>
        <ul class="ms-engel-liste">${k.grup.uyeler.map((u) => `<li><span class="ms-avatar">${avatarHtml(u.foto, u.ad, 40)}</span><b>${esc(_urunAdi(u.ad))}${u.id === k.grup.kurucuId ? ` <small class="ms-yonetici">${_autoHtml("yönetici")}</small>` : ''}</b>
          ${u.id !== d.genel.oyuncu.id ? `<button class="dugme kucuk gri" data-yaz-kisi="${esc(_urunAdi(u.ad))}">💬</button>` : ''}
          ${k.grup.kurucu && u.id !== d.genel.oyuncu.id ? `<button class="dugme kucuk kirmizi" data-cikar-uye="${esc(_urunAdi(u.ad))}">${_autoHtml("Çıkar")}</button>` : ''}</li>`).join('')}</ul>
        <button class="dugme gri" data-sohbete-don>‹ ${_autoHtml("Sohbete dön")}</button></div>`;
  msBaslikBagla(kok, bolum);
  const geri = bolum.querySelector('[data-geri]');
  if (geri) geri.replaceWith(geri.cloneNode(true));
  const g2 = bolum.querySelector('[data-geri]');
  if (g2) g2.addEventListener('click', () => msAc(kok, { tur: 'grup', id: grupId }));
  bolum.querySelector('[data-sohbete-don]').addEventListener('click', () => msAc(kok, { tur: 'grup', id: grupId }));
  oyuncuSecici(bolum.querySelector('[data-secici]'), {
    ipucu: _autoMetin('Gruba eklenecek oyuncunun adı…'), tekli: true,
    secilince: async (x) => { if (await eylem(null, () => api(`gruplar/${grupId}/uye`, { ad: x.ad })) !== undefined) { bildir(`${x.ad} gruba eklendi.`); msGrupUyeleri(kok, grupId); } },
  });
  bolum.querySelectorAll('[data-yaz-kisi]').forEach((b) => b.addEventListener('click', () => msAc(kok, { tur: 'ozel', ad: b.dataset.yazKisi })));
  bolum.querySelectorAll('[data-cikar-uye]').forEach((b) => b.addEventListener('click', async () => {
    if (!(await onayla(_autoSablon`${b.dataset.cikarUye} gruptan çıkarılsın mı?`, { baslik: _oyunMetni("ui.f40bd5a73799"), evet: _autoMetin('Çıkar'), tehlike: true, ikon: '👥' }))) return;
    if (await eylem(null, () => api(`gruplar/${grupId}/cikar`, { ad: b.dataset.cikarUye })) !== undefined) msGrupUyeleri(kok, grupId);
  }));
}

// ---------- Günlük ödül ----------
// ---------- Hava durumu ----------
const HAVA_GENEL = {
  acik: 'Güzel bir gün, sokaklar kalabalık.',
  parcali: 'Parçalı bulutlu, işler normal.',
  bulutlu: 'Kapalı bir gün, işler normal.',
  sis: 'Sisli bir gün.',
  ciseleme: 'Çiseliyor, şemsiyeler açılmaya başladı.',
  yagmur: 'Yağmur yağıyor: şemsiyeci ve ayakkabı boyacısı kazanır, dondurmacı ve pamuk şekerci zorlanır.',
  kar: 'Kar yağıyor: sokaklar sakin, şemsiyeci kazanır.',
  firtina: 'Sağanak ve fırtına: şemsiyeci çok kazanır, açık havadaki işler zorlanır.',
};
async function havaPaneli() {
  const o = d.genel.oyuncu;
  let tk = null;
  try { tk = await api('takvim'); } catch (e) { /* takvim alınamadı */ }
  const takvimKarti = tk ? `<div class="kart takvim-karti"><h3>🗓️ ${_autoHtml("Takvim")}</h3>
    ${tk.bugun ? `<div class="bugun-ozel ${tk.bugun.tur}"><span aria-hidden="true">${tk.bugun.ikon}</span><div><b>${_autoSablon`Bugün: ${esc(tk.bugun.ad)}`}</b><small>${esc(tk.bugun.mesaj || '')}${tk.bugun.carpan > 1 ? _autoSablon` · tezgâh kazancı +%${Math.round((tk.bugun.carpan - 1) * 100)}` : ''}</small></div></div>` : ''}
    ${tk.yaklasanlar.filter((y) => y.kalanGun > 0).length ? `<ul class="satirlar ozel-gunler">${tk.yaklasanlar.filter((y) => y.kalanGun > 0).map((y) => `<li><span>${y.ikon} ${esc(y.ad.replace(/ \(\d\. gün\)/, ''))}<small>${esc(y.tarih)}</small></span><span class="sag">${y.kalanGun === 1 ? _autoHtml('yarın') : _autoSablon`${y.kalanGun} gün`}</span></li>`).join('')}</ul>`
      : `<p class="kucuk soluk" style="margin:0">${_autoHtml("Önümüzdeki iki ayda resmî tatil ya da bayram yok.")}</p>`}
    <p class="kucuk soluk" style="margin:8px 0 0">${_autoHtml("Bayramlarda, millî bayramlarda ve yılbaşında çarşı kalabalık olur: tezgâh kazancı artar.")}</p></div>` : '';
  const h = d.genel.hava;
  const saatYaz = (ms) => new Date(ms + 3 * 3600000).toISOString().slice(11, 16);
  const etkiler = h && d.seyyar ? d.seyyar.isler.filter((i) => !i.kilitli && i.havaCarpani && Math.abs(i.havaCarpani - 1) >= 0.05)
    .sort((a, b) => b.havaCarpani - a.havaCarpani) : [];
  panelAc({ icerikBoyu: true,
    ikon: h ? h.ikon : '🌤️', baslik: _autoSablon`${o.il.ad} hava durumu`, alt: h ? `${esc(_autoMetin(h.ad))}, ${h.sicaklik}°` : _autoMetin('Bilgi alınamadı'), // 0.50: hava adı oyuncunun dilinde
    govde: h ? `
      <div class="bilgi-izgara">
        <div><small>${_autoHtml("Sıcaklık")}</small><b>${h.sicaklik}°</b></div>
        <div><small>${_autoHtml("Hissedilen")}</small><b>${h.hissedilen}°</b></div>
        <div><small>${_autoHtml("Rüzgâr")}</small><b>${_autoSablon`${h.ruzgar} km/sa`}</b></div>
        <div><small>${_autoHtml("Bulut")}</small><b>%${Math.round(h.bulut)}</b></div>
      </div>
      ${h.sonraki && h.sonraki.length ? `<div class="kart"><h3>${_autoHtml("Önümüzdeki saatler")}</h3><div class="hava-saatler">
        ${h.sonraki.map((s) => `<div><small>${saatYaz(s.ms)}</small><span aria-hidden="true">${s.ikon}</span><b>${s.sicaklik}°</b></div>`).join('')}
      </div></div>` : ''}
      <div class="kart"><h3>${_autoHtml("Seyyar işlere etkisi")}</h3>
        <p class="kucuk" style="margin:0 0 8px">${esc(_autoMetin(HAVA_GENEL[h.tur] || ''))}</p>
        ${etkiler.length ? `<ul class="satirlar">${etkiler.map((i) => `<li><span>${i.simge} ${esc(i.ad)}</span>
          <span class="sag ${i.havaCarpani > 1 ? 'arti' : 'eksi'}">${i.havaCarpani > 1 ? '+' : '−'}%${Math.round(Math.abs(i.havaCarpani - 1) * 100)}</span></li>`).join('')}</ul>`
          : `<p class="kucuk soluk" style="margin:0">${_autoHtml("Hava şu an hiçbir işi etkilemiyor.")}</p>`}
      </div>
      ${takvimKarti}
      <p class="kucuk soluk">${_autoSablon`Hava ${esc(o.il.ad)} için gerçek tahmindir, günde bir kez güncellenir.`}</p>`
      : `<p class="soluk">${_autoHtml("Hava durumu şu an alınamadı. Oyun mevsime göre hava ile devam ediyor.")}</p>${takvimKarti}`,
  });
}

// ---------- Geri sayım ----------
// Şık geri sayım kutucukları (gün · saat · dakika · saniye); panel açıkken her saniye güncellenir.
// Süre dolunca "bitti" çağrılır (ör. panel yenilenir ve ödül açılır).
// Görünüm: solda simge ve kısa açıklama, sağda sabit genişlikli süre; altta günün geçen kısmını gösteren ince çubuk.
function geriSayimHtml(hedef, { baslik = '', tur = '', ikon = '⏳', donem = 86400000 } = {}) {
  const kutu = (k, ad) => `<span class="gsy-kutu" data-gsy-kutu="${k}"><b data-gsy="${k}">00</b><i>${esc(ad)}</i></span>`;
  return `<div class="gsy ${tur}" data-geri-sayim="${Number(hedef) || 0}" data-donem="${Number(donem) || 0}" role="timer">
    <span class="gsy-ikon" aria-hidden="true">${ikon}</span>${baslik ? `<small class="gsy-baslik">${esc(baslik)}</small>` : ''}
    <div class="gsy-kutular">${kutu('gun', t('timer.day'))}${kutu('saat', t('timer.hour'))}<span class="gsy-ayrac">:</span>${kutu('dakika', t('timer.minute'))}<span class="gsy-ayrac">:</span>${kutu('saniye', t('timer.second'))}</div>
    <span class="gsy-cubuk" aria-hidden="true"><i></i></span></div>`;
}
function geriSayimBaslat(kok, bitti) {
  const liste = [...kok.querySelectorAll('[data-geri-sayim]')];
  if (!liste.length) return;
  const iki = (n) => String(n).padStart(2, '0');
  const tik = () => {
    for (const e of liste) {
      if (!e.isConnected) continue;
      const kalan = Math.max(0, Number(e.dataset.geriSayim) - simdi());
      const sn = Math.floor(kalan / 1000);
      const deger = { gun: Math.floor(sn / 86400), saat: Math.floor((sn % 86400) / 3600), dakika: Math.floor((sn % 3600) / 60), saniye: sn % 60 };
      e.querySelector('[data-gsy-kutu=gun]').hidden = deger.gun <= 0;
      for (const [k, v] of Object.entries(deger)) {
        const b = e.querySelector(`[data-gsy=${k}]`);
        const yeni = k === 'gun' ? String(v) : iki(v);
        if (b.textContent !== yeni) b.textContent = yeni;
      }
      e.classList.toggle('az-kaldi', kalan < 10 * 60000);
      const donem = Number(e.dataset.donem) || 0;
      if (donem) { const o = Math.max(0, Math.min(1, 1 - kalan / donem)).toFixed(3); if (e.dataset.oran !== o) { e.dataset.oran = o; e.style.setProperty('--gsy-oran', o); } }
      if (e.dataset.basladi === undefined) e.dataset.basladi = kalan > 0 ? '1' : '0';
      // yalnızca bu ekranda gerçekten sıfıra inen sayaç yenileme ister (hedefi geçmiş sayaç panoyu sürekli yeniden çizdirmesin)
      if (kalan <= 0 && !e.dataset.bitti) { e.dataset.bitti = '1'; if (bitti && e.dataset.basladi === '1') setTimeout(bitti, 600); }
    }
  };
  tik();
  clearInterval(d.panelZamanlayici);
  d.panelZamanlayici = setInterval(tik, 1000);
}

async function bonusPaneli() {
  let b;
  try { b = await api('bonus'); } catch (e) { return bildir(e.message, true); }
  const gunler = b.oduller.map((tutar, i) => {
    const no = i + 1;
    const alindi = no <= b.alinan;
    const siradaki = b.siradaki === no;
    return `<button class="bonus-gun ${alindi ? 'alindi' : ''} ${siradaki ? 'siradaki' : ''} ${no === 7 ? 'buyuk' : ''}" ${siradaki ? 'data-al' : 'disabled'}>
      <small>${_autoSablon`${no}. gün`}</small><span class="bonus-ikon">${alindi ? '✅' : no === 7 ? '🏆' : '💰'}</span><b>${sade(tutar)} ₺</b>${no === 7 ? `<small>${_autoHtml("+ seyyar izni")}</small>` : ''}</button>`;
  }).join('');
  panelAc({ icerikBoyu: true,
    ikon: '🎁', baslik: _oyunMetni("ui.271d6617a57f"), alt: _autoSablon`Bugün ${b.bugunNo}. günün. Her gün gir, ödüller büyüsün; 7. günden sonra yeniden 1. günden başlar.`,
    govde: `<div class="bonus-takvim">${gunler}</div>
      ${b.sonraki ? geriSayimHtml(b.sonraki, b.alinan >= 7 ? { baslik: t('timer.nextRound', { amount: `${sade(b.oduller[0])} ₺` }), ikon: '🗓️' } : { baslik: t('timer.nextDay', { day: b.alinan + 1, amount: `${sade(b.oduller[b.alinan])} ₺` }), ikon: '🎁' }) : ''}
      ${b.bugunAlindi && videoEylemi('gunluk') && !videoEylemi('gunluk').alindi ? videoDugmesiHtml('gunluk', 0, _autoSablon`📺 Video izle: bugünkü ödülü ikiye katla (+${sade(b.oduller[b.alinan - 1])} ₺)`, _autoSablon`⭐ Bugünkü ödülü ikiye katla (+${sade(b.oduller[b.alinan - 1])} ₺)`) : ''}
      <p class="kucuk soluk" style="text-align:center">${b.siradaki ? _autoHtml('Bugünün kutusuna dokun!') : b.alinan >= 7 ? _autoHtml('7 günün hepsini tamamladın! Yarın yeni tur 1. günden başlıyor.') : _autoHtml('Bugünün ödülünü aldın. Yarın yine gel!')}</p>`,
    hazir(g) {
      geriSayimBaslat(g, () => { if (aktifPanel() === _autoMetin('Günlük ödül')) bonusPaneli(); });
      const vg = g.querySelector('[data-video="gunluk"]');
      if (vg) {
        reklamHazirla(d.genel.odulluVideo);
        vg.addEventListener('click', async () => {
          const r = await videoEylem('gunluk', 0, vg);
          if (!r || !(r.tutar > 0)) return;
          { const ve = videoEylemi('gunluk'); ve.kalan = Math.max(0, (ve.kalan || 1) - 1); ve.alindi = ve.kalan <= 0; }
          await sikkeUcur(vg.getBoundingClientRect(), 10);
          ses.kasa();
          await yenileHepsi().catch(() => {});
          bakiyeSay(d.genel.oyuncu.bakiye);
          bildir(_autoSablon`Günlük ödül ikiye katlandı: ${isaretliTl(r.tutar)}`);
          if (g.isConnected) bonusPaneli();
        });
      }
      const k = g.querySelector('[data-al]');
      if (k) k.addEventListener('click', async () => {
        const rect = k.getBoundingClientRect();
        const r = await eylem(k, () => api('bonus/al', {}));
        if (r === undefined) return;
        d.genel.bonusVar = false;
        await yenileHepsi();
        await sikkeUcur(rect, r.gun === 7 ? 16 : 10);
        ses.kasa();
        bakiyeSay(d.genel.oyuncu.bakiye);
        bildir(_autoSablon`${r.gun}. gün ödülü: ${isaretliTl(r.tutar)}${r.izin ? _autoHtml(' ve 1 aylık seyyar izni!') : ''}`);
        bonusPaneli();
      });
    },
  });
}

// ---------- Davet, referans ve paylaşım ----------
async function davetPaneli() {
  const p = panelAc({ ikon: '🎉', baslik: _oyunMetni("ui.3cb4c7018a15"), rota: 'davet', govde: `<p class="soluk">${_autoHtml("Yükleniyor…")}</p>` });
  let b;
  try { b = await api('davet'); } catch (e) { return bildir(e.message, true); }
  if (aktifRota() !== 'davet') return;
  const link = location.origin + location.pathname + '?davet=' + b.kod;
  const metin = _autoSablon`Çırak'ta çıraklıktan patronluğa yükseliyorum. Sen de gel, ${sade(guncelFiyat(2500000) + b.kurallar.hediye)} ₺ ile başla! Davet kodum: ${b.kod}`;
  const k = b.kurallar;
  // paylaşım sayfalarının adresi tıklanınca hazırlanır
  const PAYLASIM = {
    whatsapp: ['api.whatsapp.com', '/send', { text: metin + ' ' + link }],
    telegram: ['t.me', '/share/url', { url: link, text: metin }],
    facebook: ['www.facebook.com', '/sharer/sharer.php', { u: link }],
    x: ['twitter.com', '/intent/tweet', { text: metin, url: link }],
  };
  const paylasimAc = (ad) => {
    const [alan, yol, param] = PAYLASIM[ad];
    const u = new URL(yol, 'https://' + alan);
    for (const [k, v] of Object.entries(param)) u.searchParams.set(k, v);
    window.open(u.toString(), '_blank', 'noopener');
  };
  p.querySelector('.panel-govde').innerHTML = `
    <div class="kart davet-kart">
      <small class="soluk">${_autoHtml("Davet kodun")}</small>
      <div class="davet-kodu">${esc(b.kod)}</div>
      <div class="paylas-izgara">
        <button class="paylas whatsapp" data-paylas="whatsapp">${_autoHtml("WhatsApp")}</button>
        <button class="paylas telegram" data-paylas="telegram">${_autoHtml("Telegram")}</button>
        <button class="paylas facebook" data-paylas="facebook">${_autoHtml("Facebook")}</button>
        <button class="paylas x" data-paylas="x">X</button>
      </div>
      <button class="dugme mavi kucuk" data-eylem="kopyala">🔗 ${_autoHtml("Bağlantıyı kopyala")}</button>
    </div>
    <div class="bilgi-izgara">
      <div><small>${_autoHtml("Davetten toplam kazancın")}</small><b class="arti">${tl(b.toplamKazanc)}</b><small class="soluk">${_autoHtml("Ömür boyu toplam · güncel nakit bakiyen ayrı")}</small></div>
      <div><small>${_autoHtml("Bugün gelen ziyaretçi")}</small><b>${b.bugunZiyaret} / ${k.paylasimGunluk}</b></div>
    </div>
    ${b.indirim ? `<div class="kart davet-indirim${b.indirim.oran > 0 ? ' aktif' : ''}">
      <div class="di-ust"><span class="di-oran">${Number(b.indirim.oran).toLocaleString(sayiDili(), { style: 'percent', maximumFractionDigits: 0 })}</span><div><b>${_autoHtml("Davet indirimi")}</b><small>${_autoSablon`Tezgâh masrafların ve dükkân kiraların bu oranda daha az. ${b.indirim.aktif} aktif davet.`}</small></div></div>
      <div class="cubuk"><div style="width:${Math.min(100, (100 * b.indirim.kullanilan) / Math.max(1, b.indirim.sinir))}%"></div></div>
      <small class="soluk">${_autoSablon`Arkadaşın ${k.odulSeviye}. seviyeye ulaşınca ${b.indirim.gun} gün boyunca %${b.indirim.birim} indirim. ${b.indirim.kullanilan}/${b.indirim.sinir} davet hakkı kullanıldı.`}${b.indirim.ilkBitis ? ' ' + _autoSablon`İlk indirimin ${sureMetni(b.indirim.ilkBitis - simdi())} sonra biter.` : ''}</small>
    </div>` : ''}
    <div class="kart"><h3>${_autoHtml("Nasıl kazanırsın?")}</h3>
      <ul class="kural-listesi">
        <li>${_autoSablon`🎁 Kodunla kayıt olan arkadaşın hemen <b>${tl(k.hediye)}</b> hediye alır.`}</li>
        ${b.indirim ? `<li>${_autoSablon`🏷️ Arkadaşın ${k.odulSeviye}. seviyeye ulaşınca ${b.indirim.gun} gün boyunca tezgâh masrafların ve dükkân kiraların <b>%${b.indirim.birim}</b> azalır (en çok ${b.indirim.sinir} davet, toplam %${b.indirim.birim * b.indirim.sinir}).`}</li>` : ''}
        <li>${_autoSablon`⭐ Arkadaşın ${k.odulSeviye}. seviyeye ulaşınca sen <b>${tl(k.odul)}</b> kazanırsın.`}</li>
        <li>${_autoSablon`📈 Arkadaşının ilk ${k.gun} gündeki kazancının <b>%${k.oran}</b>'i kadar referans payı alırsın (kişi başı en fazla ${tl(k.tavan)}). Arkadaşının kazancından bir şey kesilmez.`}</li>
        <li>${_autoSablon`🔗 Paylaştığın bağlantıdan gelen her yeni ziyaretçi için <b>${tl(k.paylasimOdul)}</b> (günde en fazla ${k.paylasimGunluk} kişi).`}</li>
      </ul></div>
    <div class="kart"><h3>${_autoSablon`Davet ettiklerin (${b.davetSayisi})`}</h3><ul class="satirlar" id="davet-liste"></ul></div>`;
  let ilkDavet = b;
  sayfaGezgini(p.querySelector('#davet-liste'), {
    async yukle(once) {
      const r = ilkDavet || await api('davet/liste' + (once ? '?once=' + encodeURIComponent(once) : ''));
      ilkDavet = null;
      const liste = r.davetEdilenler || r.liste;
      return { liste, devam: r.davetDevam ?? r.devam, imlec: liste.at(-1)?.id };
    },
    satir: (x) => `<li><span><b>${esc(x.ad)}</b><br><span class="kucuk soluk">${_autoSablon`${x.seviye}. seviye${x.odulVerildi ? _autoHtml(', davet ödülü alındı') : _autoSablon`, ödül ${k.odulSeviye}. seviyede`}${x.referansBitis > simdi() ? '' : _autoHtml(', referans süresi bitti')}`}${x.indirimBitis ? `<br><span class="di-satir${x.indirimBitis > simdi() ? ' aktif' : ''}">${x.indirimBitis > simdi() ? _autoSablon`🏷️ İndirim ${sureMetni(x.indirimBitis - simdi())} daha sürer` : _autoHtml('🏷️ İndirim süresi bitti')}</span>` : ''}</span></span><span class="sag arti">${tl(x.komisyon)}</span></li>`,
    bos: _autoMetin('Henüz kimseyi davet etmedin. Yukarıdaki düğmelerle paylaş!'),
  });
  p.querySelectorAll('[data-paylas]').forEach((b3) => b3.addEventListener('click', () => paylasimAc(b3.dataset.paylas)));
  p.querySelector('[data-eylem=kopyala]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(metin + ' ' + link); bildir(_autoMetin("Bağlantı kopyalandı.")); } catch (e) { bildir(link); }
  });
  if (navigator.share) {
    const b2 = document.createElement('button');
    b2.className = 'dugme gri kucuk';
    b2.textContent = _autoMetin('📤 Diğer uygulamalarla paylaş');
    b2.addEventListener('click', async () => { try { await navigator.share({ title: _autoMetin('Çırak'), text: metin, url: link }); } catch (e) { /* vazgeçildi */ } });
    p.querySelector('.davet-kart').appendChild(b2);
  }
}

// ---------- Oyun içi bildirimler ----------
// Oyuncuyu oyunda tutan kısa bildirimler. Aynı bildirim belli bir süre tekrarlanmaz.
// 0.57.9: kasa doldu ve boşalan raf bildirimleri (Ayarlar > Bildirimler); varsayılan açık
function isletmeBildirimiAcik() { try { return localStorage.getItem('tezgah_isletme_bildirim') !== '0'; } catch (e) { return true; } }
function isletmeBildirimKarti() {
  const acik = isletmeBildirimiAcik();
  return `<div class="kart cagri-kart"><h3>${_autoHtml('💵 İşletme bildirimleri')}</h3>
    <ul class="cagri-liste"><li><span class="cl-ikon" aria-hidden="true">🏪</span>
      <span class="cl-bilgi"><b>${_autoHtml('Kasa doldu ve raf bildirimleri')}</b><small>${_autoHtml('Dükkânlarının kasası dolunca ya da rafları boşalınca haber verir; en çok 6 saatte bir. Borç uyarıları her zaman gelir.')}</small></span>
      <button type="button" class="anahtar${acik ? ' acik' : ''}" role="switch" aria-checked="${acik}" data-isletme-bildirim aria-label="${_autoHtml('Kasa doldu ve raf bildirimleri')}"><span></span><i>${acik ? _autoMetin('Açık') : _autoMetin('Kapalı')}</i></button>
    </li></ul></div>`;
}
// 0.57.9: önemli = 5 sn (sürüm, borç, ruhsat, boş raf, izin…), diğerleri 3 sn (kasa doldu, tezgâh, ipuçları)
function oyunBildirimi(anahtar, ikon, baslik, metin, eylemAdi, eylem, tekrarDk = 30, onemli = false) {
  try {
    const son = Number(localStorage.getItem('tezgah_bld_' + anahtar) || 0);
    if (Date.now() - son < tekrarDk * 60000) return;
    localStorage.setItem('tezgah_bld_' + anahtar, String(Date.now()));
  } catch (e) { /* yok say */ }
  kart({ ikon, baslik, metin, eylemAdi, eylem, sure: onemli ? 5000 : 3000, onemli });
  ses.mesaj();
}

const bildirimDurumu = { sonKontrol: 0, sonHareket: 0, kasaUyari: {}, ruhsat: {}, rakip: null };
const SERVET_ESIKLERI = [50000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000].map((x) => x * 100);

async function bildirimKontrol() {
  if (!d.genel || !d.genel.oyuncu || document.hidden) return;
  const o = d.genel.oyuncu;
  const git = (r) => () => { location.hash = '#/' + r; };
  // 1. servet eşikleri
  const esik = SERVET_ESIKLERI.filter((e) => o.bakiye >= e).pop();
  if (esik) oyunBildirimi('servet_' + esik, '💰', _autoMetin('Servetin büyüyor!'), _autoSablon`Hesabın ${tl(esik)}'yi geçti. Böyle devam!`, null, null, 60 * 24 * 365);
  // 2. dükkân açmaya yakınsın
  const kiralik = d.cadde && d.cadde.yerler.filter((y) => !y.isletme);
  if (kiralik && kiralik.length && !(d.cadde.yerler.some((y) => y.isletme && y.isletme.benim))) {
    const enUcuz = Math.min(...kiralik.map((y) => y.kira * 2 + guncelFiyat(2500000))); // 0.57.9: kurulum ve ruhsat fiyat endeksiyle
    if (o.bakiye >= enUcuz) oyunBildirimi('dukkan_hazir', '🏪', _autoMetin('Dükkân açabilirsin!'), _autoMetin('Paran caddedeki kiralık bir dükkânı açmaya yetiyor.'), _autoMetin('Kiralık bul'), git('tezgahlar'), 120);
    else if (o.bakiye >= enUcuz * 0.75) oyunBildirimi('dukkan_yakin', '🏪', _autoMetin('Dükkân açmaya yakınsın'), _autoSablon`${tl(enUcuz - o.bakiye)} daha biriktirirsen ilk dükkânını açabilirsin.`, null, null, 180);
  }
  // 3. seviye atlamaya az kaldı
  if (o.seviye < 99 && o.seviyeUst - o.tecrube <= 8) oyunBildirimi('seviye_' + o.seviye, '⭐', _oyunMetni('tips.nearLevel'), _oyunMetni('tips.nearLevelHint'), _oyunMetni('tips.stalls'), git('tezgahlar'), 600);
  // 4. günlük ödül
  if (d.genel.bonusVar) oyunBildirimi('bonus', '🎁', _oyunMetni('tips.rewardReady'), d.genel.bonusGun ? _oyunMetni('tips.rewardDay',{day:d.genel.bonusGun}) : _oyunMetni('tips.rewardToday'), _oyunMetni('tips.open'), bonusPaneli, 180);
  // 5. biten tezgâh
  const biten = bitenIsler();
  if (biten.length) oyunBildirimi('biten_' + biten.map((x) => x.id).join('_'), '🧺', _autoMetin('Tezgâhın işi bitirdi'), _autoSablon`${biten[0].isAdi} kazancını toplamanı bekliyor.`, null, null, 600);
  // 6. boşta tezgâh
  if (d.seyyar && !d.seyyar.aktifler.length && d.seyyar.isler.some((i) => i.sahip)) oyunBildirimi('bosta', '😴', _autoMetin('Tezgâhın boşta duruyor'), _autoMetin('Kısa bir işe başla, müşteriler bekliyor.'), null, null, 20);
  // 7. seyyar izni
  if (d.seyyar && d.seyyar.isler.some((i) => i.sahip)) {
    const kalan = d.seyyar.izin.bitis - simdi();
    if (d.seyyar.izin.var && kalan < 24 * 3600000) oyunBildirimi('izin_bitiyor', '⚠️', 'Seyyar iznin bitiyor', _autoSablon`İznin ${sureMetni(kalan)} sonra bitiyor. Zabıtaya yakalanmadan uzat.`, 'Uzat', () => izinUzat(), 30, true);
  }
  // 8-12. dükkânlar: kasa, raflar, borç, ruhsat, rakip
  if (d.cadde) {
    // 0.57.9: kasası dolan dükkânlar tek bildirimde toplanır ve en çok 6 saatte bir gelir; Ayarlar'dan kapatılabilir
    const dolu = d.cadde.yerler.filter((y) => y.isletme && y.isletme.benim && y.isletme.kasa >= guncelFiyat(500000));
    if (dolu.length && isletmeBildirimiAcik()) {
      const top = dolu.reduce((a, y) => a + Number(y.isletme.kasa), 0);
      if (dolu.length === 1) oyunBildirimi('kasa_toplu', '💵', _autoSablon`${dolu[0].isletme.ad} kasası doldu`, _autoSablon`Kasada ${tl(top)} birikti. Alıp yatırıma çevir.`, _oyunMetni('tips.open'), () => dukkanPaneli(dolu[0].no), 360);
      else oyunBildirimi('kasa_toplu', '💵', _autoSablon`${dolu.length} dükkânının kasası doldu`, _autoSablon`Kasalarda toplam ${tl(top)} birikti.`, _autoMetin('İşlerim'), () => { location.hash = '#/tezgahlar'; }, 360);
    }
    for (const y of d.cadde.yerler) {
      const i = y.isletme;
      if (!i || !i.benim) continue;
      if (i.kasa < 0) oyunBildirimi('borc_' + i.id, '🚨', _autoSablon`${i.ad} borçta`, _autoMetin('Giderler ödenemiyor. 7 gün böyle kalırsa dükkân kapanır.'), _oyunMetni('tips.open'), () => dukkanPaneli(y.no), 60, true);
      if (bildirimDurumu.ruhsat[i.id] === 'ruhsat' && i.durum === 'acik') oyunBildirimi('ruhsat_' + i.id, '✅', _autoMetin('Ruhsatın onaylandı'), _autoSablon`${i.ad} artık açık, rafları doldurmayı unutma.`, _oyunMetni('tips.open'), () => dukkanPaneli(y.no), 99999, true);
      bildirimDurumu.ruhsat[i.id] = i.durum;
    }
    const benimTurler = new Set(d.cadde.yerler.filter((y) => y.isletme && y.isletme.benim).map((y) => y.isletme.tur));
    const rakipler = d.cadde.yerler.filter((y) => y.isletme && !y.isletme.benim && benimTurler.has(y.isletme.tur)).map((y) => y.isletme.id);
    if (bildirimDurumu.rakip && rakipler.some((r) => !bildirimDurumu.rakip.includes(r))) oyunBildirimi('rakip_' + rakipler.join('_'), '🥊', 'Rakibin geldi', _autoMetin('Caddene senin türünde yeni bir dükkân açıldı. Fiyatlarını gözden geçir.'), null, null, 99999, true);
    bildirimDurumu.rakip = rakipler;
  }
  // 13. raflar boşalıyor (arada bir kontrol)
  if (Date.now() - bildirimDurumu.sonKontrol > 90000) {
    bildirimDurumu.sonKontrol = Date.now();
    try {
      const liste = await api('isletmelerim');
      // 0.57.9: boşalan raflar da tek bildirimde, en çok 6 saatte bir (Ayarlar'dan kapatılabilir)
      const bos = liste.filter((x) => !x.hizmet && x.bitenUrun > 0 && x.durum === 'acik');
      if (bos.length && isletmeBildirimiAcik()) {
        if (bos.length === 1) oyunBildirimi('raf_toplu', '📦', _autoSablon`${bos[0].ad} rafları boşalıyor`, _autoSablon`${bos[0].bitenUrun} ürün bitti, müşteriler eli boş dönüyor.`, _autoMetin('Doldur'), () => isletmePaneli(bos[0].id), 360, true);
        else oyunBildirimi('raf_toplu', '📦', _autoSablon`${bos.length} dükkânında raflar boşalıyor`, _autoMetin('Bazı ürünler bitti, müşteriler eli boş dönüyor.'), _autoMetin('İşlerim'), () => { location.hash = '#/tezgahlar'; }, 360, true);
      }
      // 14-15. davet ve referans ödülleri
      const hareketler = await api('hareketler');
      const h = hareketler.liste;
      if (Number.isFinite(Number(hareketler.bakiye))) bakiyeUygula(Number(hareketler.bakiye), Number(hareketler.hareket) || 0);
      const yeni = h.filter((x) => x.id > bildirimDurumu.sonHareket && ['davet_odul', 'referans', 'paylasim'].includes(x.tur));
      if (bildirimDurumu.sonHareket && yeni.length) {
        const top = yeni.reduce((a, x) => a + x.tutar, 0);
        oyunBildirimi('davet_' + yeni[0].id, '🎉', _autoMetin('Davet kazancın kaydedildi'), _autoSablon`${yeni[0].aciklama}. Kazanç ${isaretliTl(top)}; güncel bakiyen ${tl(d.genel.oyuncu.bakiye)}.`, 'Hareketler', () => {
          d.bildirimSekmesi = 'hareket';
          if (aktifRota() === 'bildirimler') bildirimlerPaneli('hareket');
          else location.hash = '#/bildirimler';
        }, 99999, true);
      }
      if (h.length) bildirimDurumu.sonHareket = Math.max(bildirimDurumu.sonHareket, h[0].id);
    } catch (e) { /* sessiz */ }
  }
  // 16. telefon bildirimleri kapalıysa, tezgâhı çalışan oyuncuya bir kez hatırlat
  if (d.seyyar && d.seyyar.aktifler.length && bildirimler.destekleniyor() && !bildirimler.iosAnaEkranGerekli() && Notification.permission === 'default') {
    oyunBildirimi('bildirim_oner', '🔔', _autoMetin('İşin bitince haber vereyim mi?'), _autoMetin('Oyun kapalıyken tezgâhın, dükkânın ve mesajların için telefonuna bildirim gelsin.'), _oyunMetni('tips.open'), () => bildirimAc(), 60 * 24 * 3, true);
  }
  // 17. eski hesaplar: mahalle seçilmemişse bir kez hatırlat
  if (!o.mahalle) oyunBildirimi('mahalle_sec', '🏘️', _oyunMetni('tips.neighborhood'), _oyunMetni('tips.neighborhoodHint'), _oyunMetni('tips.choose'), () => { d.hesapSekmesi = 'profil'; location.hash = '#/hesap'; }, 60 * 24 * 7, true);
  izinSeridiGuncelle();
}

async function bildirimAc() {
  try {
    await bildirimler.ac();
    bildir(_autoMetin('Bildirimler açıldı. Oyun kapalıyken önemli haberler telefonuna gelecek.'));
    return true;
  } catch (e) {
    bildir(e.message, true);
    return false;
  }
}

async function bildirimKartiCiz(g) {
  const yazi = g.querySelector('#bildirim-yazi');
  const dugmeler = g.querySelector('#bildirim-dugmeler');
  if (!yazi) return;
  const dur = await bildirimler.durum();
  const METIN = {
    acik: _autoMetin('Açık. Oyun kapalıyken tezgâhın bitince, dükkânın borca girince, rafların boşalınca ve mesaj gelince haber veririm.'),
    kapali: _autoMetin('Kapalı. Açarsan oyun kapalıyken bile önemli haberleri kaçırmazsın.'),
    engelli: _autoMetin('Bu tarayıcıda bildirim izni kapatılmış. Adres çubuğundaki kilit simgesinden bu site için bildirimlere izin ver, sonra buraya dön.'),
    'ana-ekran': _autoMetin('iPhone ve iPad\'de bildirim için oyunu ana ekrana eklemelisin: Safari\'de Paylaş düğmesine dokun, “Ana Ekrana Ekle”yi seç, sonra oyunu ana ekrandaki simgeden aç.'),
    desteklenmiyor: _autoMetin('Bu tarayıcı bildirimleri desteklemiyor. Chrome, Firefox, Edge ya da Safari\'nin güncel sürümünü kullanabilirsin.'),
  };
  yazi.textContent = METIN[dur] || '';
  if (dur === 'acik') {
    dugmeler.innerHTML = `<button class="dugme gri kucuk" data-b="dene">🔔 ${_autoHtml("Deneme gönder")}</button><button class="dugme gri kucuk" data-b="kapat" style="margin-top:0">${_autoHtml("Kapat")}</button>`;
  } else if (dur === 'kapali') {
    dugmeler.innerHTML = `<button class="dugme yesil kucuk" data-b="ac">${_autoHtml("Bildirimleri aç")}</button>`;
  } else dugmeler.innerHTML = '';
  dugmeler.querySelectorAll('[data-b]').forEach((b) => b.addEventListener('click', async () => {
    ses.tik();
    b.disabled = true;
    if (b.dataset.b === 'ac') await bildirimAc();
    if (b.dataset.b === 'kapat') { await bildirimler.kapat(); bildir(_autoMetin('Bildirimler kapatıldı.')); }
    if (b.dataset.b === 'dene') {
      const r = await eylem(null, () => api('bildirim/dene', {}));
      if (r !== undefined) bildir(r.gonderilen ? _autoMetin('Deneme bildirimi gönderildi. Birkaç saniye içinde gelir.') : _autoMetin('Bildirim gönderilemedi, kapatıp yeniden açmayı dene.'), !r.gonderilen);
    }
    bildirimKartiCiz(g);
  }));
}

// Resmi izin bitmeye yakınken ekranda kalıcı uyarı şeridi
function izinSeridiGuncelle() {
  let serit = document.getElementById('izin-serit');
  const s = d.seyyar;
  const tezgahVar = s && s.isler.some((i) => i.sahip);
  const kalan = s ? s.izin.bitis - simdi() : 0;
  let metin = '';
  if (tezgahVar && s.izin.var && kalan < 24 * 3600000) metin = _autoSablon`⚠️ Seyyar iznin ${sureMetni(kalan)} sonra bitiyor`;
  else if (tezgahVar && !s.izin.var && s.izin.bitis > 0) metin = _autoMetin('⚠️ Seyyar iznin bitti, zabıta ceza kesebilir');
  // X ile kapatılan şerit bir saat görünmez (durum değişirse, ör. izin biterse yeniden çıkar)
  const tur = s && s.izin.var ? 'bitiyor' : 'bitti';
  let kapali = null;
  try { kapali = JSON.parse(localStorage.getItem('tezgah_izin_serit') || 'null'); } catch (e) { /* yok say */ }
  const gizli = kapali && kapali.tur === tur && Date.now() - kapali.t < 3600000;
  if (!metin || gizli || aktifRota() !== 'mahalle') { if (serit) serit.remove(); return; }
  if (!serit) {
    serit = document.createElement('div');
    serit.id = 'izin-serit';
    serit.innerHTML = `<span></span><button class="dugme kucuk">${_autoHtml("Uzat")}</button><button class="serit-kapat" aria-label="Kapat">✕</button>`;
    serit.querySelector('.dugme').addEventListener('click', () => izinUzat());
    serit.querySelector('.serit-kapat').addEventListener('click', () => {
      try { localStorage.setItem('tezgah_izin_serit', JSON.stringify({ tur: serit.dataset.tur, t: Date.now() })); } catch (e) { /* yok say */ }
      serit.remove();
    });
    arayuz.appendChild(serit);
  }
  serit.dataset.tur = tur;
  serit.querySelector('span').textContent = metin;
}

async function izinUzat() {
  const r = await eylem(null, () => api('seyyar/izin', {}));
  if (r === undefined) return;
  ses.satinAl();
  await yenileHepsi();
  bakiyeSay(d.genel.oyuncu.bakiye);
  bildir(_autoMetin('Seyyar iznin 7 gün uzatıldı.'));
  izinSeridiGuncelle();
}

// 0.47: pil tasarrufu durumu (ayarlar kartı) ve pil azalınca bir kez bilgi
function pilDurumYazisi() {
  const p = sahne.pilBilgisi();
  if (p.aktif) return t('settings.batteryActive');
  if (p.tercih === 'otomatik') return p.destek ? t('settings.batteryAutoHelp') : t('settings.batteryNoInfo');
  return '';
}
let pilUyarildi = false;
sahne.pilDinle((p) => {
  const y = document.querySelector('[data-pil-durum]'); if (y) y.textContent = pilDurumYazisi();
  if (p.aktif && p.tercih === 'otomatik' && !pilUyarildi && d.genel && d.genel.oyuncu) { pilUyarildi = true; bildir(t('settings.batteryAutoOn')); }
});

let bildirimZamani = null;
function bildirimleriBaslat() {
  clearInterval(bildirimZamani);
  setTimeout(bildirimKontrol, 4000);
  bildirimZamani = setInterval(bildirimKontrol, 15000);
}

// ---------- Döngüler ----------
setInterval(() => {
  if (!d.genel || !d.genel.oyuncu) return;
  saatGuncelle();
  toplaButonuGuncelle();
  rehberKontrol();
}, 1000);

// ---------- Yeni oyuncu rehberi (Çırak Bot) ----------
const REHBER = [
  { anahtar: 'dialog.guide1', metin: 'Hoş geldin! Ben Çırak Bot. Önce kendine bir tezgâh alalım: ışıkla gösterdiğim boş tezgâha dokun.', hedef: 'satin' },
  { anahtar: 'dialog.guide2', metin: 'Tezgâhın hazır! Şimdi tezgâhına dokun ve 1 saatlik bir işe başla.', hedef: 'bos' },
  { anahtar: 'dialog.guide3', metin: 'Müşteriler geliyor! Sipariş balonlarına dokun: anında kazanırsın, bahşiş de kaparsın.', hedef: 'siparis' },
  // 0.52: sipariş verildikten sonra iş bitene kadar bekleme adımı ("iş bitti" iş gerçekten bitince gelir)
  { anahtar: 'dialog.guideWait', metin: 'Harika! İşin sürüyor. Tezgâhın üstündeki halka dolunca 💰 kese çıkar; o zaman sana haber veririm.', hedef: 'suruyor' },
  { anahtar: 'dialog.guide4', metin: 'İş bitti! Tezgâhın üstündeki 💰 keseye dokun ve kazancını topla.', hedef: 'kese' },
  { anahtar: 'dialog.guide5', metin: 'Aferin! Her gün gir, 🎁 ödülünü al. Paran birikince caddede kiralık bir dükkân aç. Kolay gelsin!', hedef: null, son: true },
];
function rehberAnahtari() { return 'tezgah_rehber_' + d.genel.oyuncu.id; }
function rehberAdimi() {
  let kayit = null;
  try { kayit = localStorage.getItem(rehberAnahtari()); } catch (e) { /* yok say */ }
  if (kayit === 'bitti') return -1;
  const s = d.seyyar;
  if (!s) return -1;
  // yalnızca yeni oyuncular için (1-3. seviye)
  if (!kayit && d.genel.oyuncu.seviye > 3) return -1;
  const sahip = s.isler.some((i) => i.sahip);
  const biten = s.aktifler.some((a) => a.bitis <= simdi());
  if (!sahip) return 0;
  if (kayit === '4' || kayit === '5') return 5;
  if (biten) return 4;
  if (s.aktifler.length) return d.rehberServis ? 3 : 2;
  return 1;
}
function rehberBitir() {
  try { localStorage.setItem(rehberAnahtari(), 'bitti'); } catch (e) { /* yok say */ }
  rehberKaldir();
}
function rehberKaldir() {
  cancelAnimationFrame(rehberKare);
  rehberKare = 0;
  const k = document.getElementById('rehber');
  if (k) k.remove();
  const s = document.getElementById('rehber-spot');
  if (s) s.remove();
  document.body.classList.remove('rehber-acik');
}
// Işık halkası gösterilen yeri her karede izler (tezgâh ekranda kaydıkça halka da kayar); çevre karartılır
let rehberKare = 0;
function rehberIzle() {
  rehberKare = 0;
  const kutu = document.getElementById('rehber');
  const spot = document.getElementById('rehber-spot');
  if (!kutu || !spot) return;
  const hd = kutu.dataset.hedef && mahalle && mahalle.rehberHedefi ? mahalle.rehberHedefi(kutu.dataset.hedef) : null;
  if (hd) {
    const w = Math.round(hd.w), hh = Math.round(hd.h);
    const tr = `translate(${Math.round(hd.x - w / 2)}px, ${Math.round(hd.y - hh / 2)}px)`;
    if (spot._tr !== tr + w + hh) { spot._tr = tr + w + hh; spot.style.transform = tr; spot.style.width = w + 'px'; spot.style.height = hh + 'px'; }
    spot.classList.add('gorunur');
    // halka ekranın alt yarısındaysa kart üste geçer (gösterilen yeri örtmesin)
    kutu.classList.toggle('ustte', hd.y > window.innerHeight * 0.52);
  } else spot.classList.remove('gorunur');
  rehberKare = requestAnimationFrame(rehberIzle);
}
function rehberKontrol() {
  let kutu = document.getElementById('rehber');
  // 0.52: mahalle yüklenirken (yükleme kartı, tanıtım) Çırak Bot görünmez
  const adim = aktifRota() === 'mahalle' && katman.hidden && !d.oyunYukleniyor && !document.body.classList.contains('sinemada') && !document.querySelector('.oyun-yukleniyor') ? rehberAdimi() : -1;
  if (adim < 0) { if (kutu) rehberKaldir(); return; }
  const r = REHBER[adim];
  if (!kutu) {
    kutu = document.createElement('div');
    kutu.id = 'rehber';
    kutu.setAttribute('role', 'dialog');
    kutu.setAttribute('aria-label', t('dialog.guideTitle'));
    kutu.innerHTML = `<div class="rehber-avatar" aria-hidden="true">🧔</div>
      <div class="rehber-balon"><div class="rehber-ust"><b>${_autoHtml("Çırak Bot")}</b><span class="rehber-adim"></span><button type="button" class="rehber-kapat" data-rehber-kapat aria-label="${esc(t('dialog.guideClose'))}">✕</button></div>
        <p aria-live="polite"></p>
        <div class="rehber-alt"><span class="rehber-noktalar" aria-hidden="true">${REHBER.map(() => '<i></i>').join('')}</span><span class="rehber-dugmeler"></span></div></div>`;
    kutu.querySelector('[data-rehber-kapat]').addEventListener('click', () => { ses.tik(); rehberBitir(); });
    arayuz.appendChild(kutu);
    const spot = document.createElement('div');
    spot.id = 'rehber-spot';
    spot.setAttribute('aria-hidden', 'true');
    spot.innerHTML = '<span class="rehber-el">👆</span>';
    document.body.appendChild(spot);
    document.body.classList.add('rehber-acik');
  }
  if (Number(kutu.dataset.adim) !== adim || kutu.dataset.dil !== aktifDil()) {
    kutu.dataset.dil=aktifDil();
    kutu.setAttribute('aria-label',t('dialog.guideTitle'));
    kutu.querySelector('[data-rehber-kapat]').setAttribute('aria-label',t('dialog.guideClose'));
    kutu.dataset.adim = adim;
    kutu.dataset.hedef = r.hedef || '';
    // gösterilen yer küçük kalmasın: kamera oraya yaklaşır (ilk açılışta bütün sokak görünüyordu)
    if (['satin', 'bos'].includes(r.hedef) && mahalle && mahalle.rehberYeri && mahalle.bak) {
      setTimeout(() => {
        const k = mahalle.rehberYeri(r.hedef);
        if (k) mahalle.bak(k.x, k.z + 1, 34);
      }, 400);
    }
    kutu.querySelector('p').textContent = t(r.anahtar);
    kutu.querySelector('.rehber-adim').textContent = `${adim + 1}/${REHBER.length}`;
    kutu.querySelectorAll('.rehber-noktalar i').forEach((n, i) => { n.className = i < adim ? 'tamam' : i === adim ? 'simdi' : ''; });
    kutu.querySelector('.rehber-dugmeler').innerHTML = r.son ? `<button type="button" class="dugme kucuk yesil" data-rehber="bitir">${esc(t('dialog.guideStart'))}</button>` : `<button type="button" class="rehber-gec" data-rehber="gec">${esc(t('dialog.guideSkip'))}</button>`;
    kutu.querySelector('[data-rehber]').addEventListener('click', () => { ses.tik(); rehberBitir(); });
    kutu.classList.remove('yeni');
    void kutu.offsetWidth;
    kutu.classList.add('yeni');
  }
  if (!rehberKare) rehberKare = requestAnimationFrame(rehberIzle);
  // öneri ipucu balonunu rehber varken gizle
  const ip = document.getElementById('ipucu-yeri');
  if (ip) ip.innerHTML = '';
}

let yoklamaSayac = 0;
setInterval(async () => {
  if (document.hidden || !d.genel || !d.genel.oyuncu) return;
  // canlı bağlantı açıkken haberler zaten anında gelir: tam yenileme dakikada bir yeter
  // 0.47: oyuncu 2 dakikadır dokunmuyorsa (ekran açık, telefon masada) yenileme daha da seyrekleşir: pil ve ısı
  const bosta = sahne.bostaSure() > 120000;
  if (canliAcik() ? yoklamaSayac++ % (bosta ? 6 : 3) !== 0 : bosta && yoklamaSayac++ % 2 !== 0) return;
  try {
    const onceki = d.genel.oyuncu.bakiye;
    await yenileHepsi();
    if (d.genel.oyuncu && d.genel.oyuncu.bakiye !== onceki) bakiyeSay(d.genel.oyuncu.bakiye);
  } catch (e) {
    if (e instanceof OturumYok) { d.genel.oyuncu = null; girisCiz(); }
  }
}, 20000);

document.addEventListener('visibilitychange', async () => {
  if (document.hidden || !d.genel || !d.genel.oyuncu) return;
  try { await yenileHepsi(); } catch (e) { /* yok say */ }
});

// ---------- Başlangıç ----------
(async () => {
  const acilis = document.getElementById('acilis');
  try {
    window.TEZGAH_YUKLEME?.(88, _autoMetin('Haritalar hazırlanıyor'));
    const geo = await fetch((window.TEZGAH_VARLIK || {})['veri/turkiye.json'] || 'veri/turkiye.json').then((r) => r.json());
    harita.yukle(geo);
    harita.genelBakis(window.innerWidth < window.innerHeight);
    harita.dunyaYukle((window.TEZGAH_VARLIK || {})['veri/dunya.json'] || 'veri/dunya.json');
    await durumYenile();
    try { d.haritaVeri = await api('harita'); harita.istatistik(d.haritaVeri); } catch (e) { /* harita verisi opsiyonel */ }
    const gelenKod = new URLSearchParams(location.search).get('davet');
    // sertifika sayfasından gelindiyse ("Beni geçebilir misin?" meydan okuması için) hatırlanır
    const gelenSertifika = new URLSearchParams(location.search).get('s');
    if (gelenSertifika && /^[a-z2-9]{8}$/.test(gelenSertifika)) { try { localStorage.setItem('cirak_gelen_sertifika', gelenSertifika); } catch (e) { /* yok say */ } }
    if (gelenKod && !d.genel.oyuncu) {
      try {
        const anahtar = 'tezgah_ziyaret_' + gelenKod;
        if (!localStorage.getItem(anahtar)) { localStorage.setItem(anahtar, '1'); api('ziyaret', { kod: gelenKod }).catch(() => {}); }
      } catch (e) { /* yok say */ }
    }
    if (d.genel.oyuncu) await oyunuAc();
    else {
      if (gelenKod) d.girisSekmesi = 'kayit';
      adresDurumlari();
      await girisCiz();
    }
  } catch (e) {
    arayuz.innerHTML = `<div class="giris"><div class="giris-kart"><p>${esc(e.message)}</p><button class="dugme" onclick="location.reload()">${_autoHtml("Tekrar dene")}</button></div></div>`;
  }
  if (!arayuz.querySelector('[data-yukleme-tekrar]') && !arayuz.querySelector('[onclick="location.reload()"]')) window.TEZGAH_YUKLEME?.(100, _autoMetin('Hazır'));
  acilis.classList.add('gizli');
  setTimeout(() => acilis.remove(), 600);
})();
