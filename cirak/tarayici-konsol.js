// Çırak — Tarayıcı Konsolu Botu (v1)
// KULLANIM: oyunsitem.com/cirak açıkken F12 -> Console -> bu dosyanın TAMAMINI yapıştır -> Enter.
// Tarayıcı senin oturumunla konuşur; şifre/çerez paylaşman gerekmez.
// Komutlar:  await CIRAK.durum()   await CIRAK.gunluk()   CIRAK.grind(25)   CIRAK.durdur()
// (Uçlar eski botlardan birebir: seyyar, seyyar/basla, seyyar/servis, seyyar/topla-hepsi, bonus/al ...)

const CIRAK = (() => {
  const api = async (yol, veri) => {
    const r = await fetch('/cirak/api/' + yol, {
      method: veri === undefined ? 'GET' : 'POST',
      headers: veri === undefined ? { Accept: 'application/json' }
        : { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'same-origin',
      body: veri === undefined ? undefined : JSON.stringify(veri || {}),
    });
    try { return await r.json(); } catch (e) { return { hata: 'HTTP ' + r.status }; }
  };
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const kisa = (v, n = 700) => { const s = JSON.stringify(v); return !s ? '' : (s.length > n ? s.slice(0, n) + '…' : s); };
  const tl = (k) => ((k || 0) / 100).toLocaleString('tr-TR') + '₺';

  // ---------- 1) DURUM ----------
  async function durum() {
    const uclar = ['durum', 'banka', 'vergi', 'gorevler', 'seyyar', 'kiralama', 'bonus', 'sezon',
      'isletmelerim', 'vaka', 'sokak', 'ligler', 'siralama', 'yetenekler', 'etkinlikler'];
    const o = {};
    for (const x of uclar) { o[x] = await api(x); await bekle(250); }
    const oy = (o.durum || {}).oyuncu || {};
    console.log('%c=== ÇIRAK DURUM ===', 'font-weight:bold');
    console.log('OYUNCU  :', oy.kullaniciAdi, '| SV', oy.seviye, '| TP', oy.tecrube, '| Bakiye', tl(oy.bakiye), '|', oy.il, oy.ilce, oy.mahalle);
    console.log('BANKA   :', kisa(o.banka));
    console.log('VERGİ   :', kisa(o.vergi));
    console.log('GÖREV   :', kisa(o.gorevler, 900));
    console.log('SEYYAR  :', kisa(o.seyyar, 900));
    console.log('KİRALIK :', kisa(o.kiralama, 800));
    console.log('İŞLETME :', kisa(o.isletmelerim, 800));
    console.log('YETENEK :', kisa(o.yetenekler, 600));
    console.log('DİĞER   :', kisa({ bonus: o.bonus, sezon: o.sezon, vaka: o.vaka, sokak: o.sokak, ligler: o.ligler, siralama: o.siralama, etkinlikler: o.etkinlikler }, 1400));
    try { copy(JSON.stringify(o)); console.log('%c✅ Panoya kopyalandı → sohbete yapıştır.', 'color:green'); }
    catch (e) { console.log('Kopyalama çalışmadı; satırları elle kopyala.'); }
    return o;
  }

  // ---------- 2) GÜNLÜK ÖDÜLLER (para harcamaz) ----------
  async function gunluk() {
    const s = {};
    const b = await api('bonus');
    if (b && !b.bugunAlindi && !b.alinmis) s.bonus = await api('bonus/al', {});
    const g = await api('gorevler');
    const gs = g.gorevler || [];
    if (gs.length && gs.every((x) => x.tamam) && !g.alindi) s.gorev = await api('gorevler/odul', {});
    const z = await api('sezon');
    if (z && (z.odulHazir || z.alinabilir)) s.sezon = await api('sezon/odul', {});
    console.log('GÜNLÜK:', kisa(s, 900));
    return s;
  }

  // ---------- 3) TEZGÂH GRİND (para kazandırır) ----------
  const BEN_SIRA = ['pazar', 'kestane', 'simit'];
  const CIRAK_SIRA = ['pazar', 'simit', 'pamuk', 'semsiye', 'kestane', 'misir', 'gozleme', 'midye'];
  let calisiyor = false;

  async function grind(sureDk = 25) {
    if (calisiyor) { console.log('zaten çalışıyor — durdurmak için CIRAK.durdur()'); return; }
    calisiyor = true;
    const t0 = Date.now(); let kazanc = 0, servis = 0, tur = 0;
    console.log('%c🌾 GRIND başladı (' + sureDk + ' dk) · durdurmak için CIRAK.durdur()', 'color:orange;font-weight:bold');
    while (calisiyor && (Date.now() - t0) / 60000 < sureDk) {
      tur++;
      let s = await api('seyyar') || {};
      const isler = Object.fromEntries((s.isler || []).map((j) => [j.kod, j]));
      let aktif = s.aktifler || [];

      // bitenleri topla
      if (aktif.some((x) => x.bitti)) {
        const r = await api('seyyar/topla-hepsi', {});
        if (Array.isArray(r) && r.length) {
          for (const p of r) { kazanc += (p.net || 0) / 100; }
          console.log('  🌾 toplandı:', kisa(r, 300));
        }
      }
      // görev ödülü
      await gunluk();

      // kendime bir tezgâh, kalan kârlı tezgâhları çırağa
      s = await api('seyyar') || {}; aktif = s.aktifler || [];
      let benim = aktif.find((x) => x.calisan === 'ben' && !x.bitti);
      if (!benim) {
        for (const kod of BEN_SIRA) {
          if ((isler[kod] || {}).sahip) {
            const r = await api('seyyar/basla', { isKodu: kod, sure: 'tam' });
            if (r && r.id) { benim = { id: r.id, isKodu: kod }; console.log('  👤 bana:', kod, kisa(r, 150)); break; }
          }
        }
      }
      const aktifKod = new Set(aktif.map((x) => x.isKodu));
      for (const kod of CIRAK_SIRA) {
        if (!(isler[kod] || {}).sahip || aktifKod.has(kod) || (benim && benim.isKodu === kod)) continue;
        const r = await api('seyyar/basla', { isKodu: kod, sure: 'tam' });
        if (r && r.id) { aktif.push({ id: r.id, isKodu: kod, calisan: 'cirak' }); console.log('  🧑🌾 çırak:', kod, kisa(r, 150)); }
      }

      // servis turu (kendi + çırak tezgâhları)
      if (!aktif.length) { console.log('#' + tur, 'tezgâh yok — kiralama/bekleme'); await bekle(8000); continue; }
      for (let i = 0; i < 8 && calisiyor; i++) {
        const is = aktif[i % aktif.length];
        const r = await api('seyyar/servis', { id: is.id });
        servis++;
        if (r && r.tutar) kazanc += r.tutar / 100;
        if (r && r.teklif) {
          const k = await api('seyyar/siparis', { id: is.id, kabul: true });
          console.log('  📦 sipariş kabul:', kisa(k, 150));
        }
        if (r && r.reddedildi) break;
        await bekle(450);
      }
      console.log('#' + tur, 'kazanç≈' + kazanc.toFixed(0) + '₺', 'servis', servis, '· aktif tezgâh', aktif.length);
      await bekle(2500);
    }
    calisiyor = false;
    console.log('%c🌾 GRIND bitti · ~' + kazanc.toFixed(0) + '₺ · ' + servis + ' servis · ' + tur + ' tur', 'color:green;font-weight:bold');
    return kazanc;
  }
  function durdur() { calisiyor = false; console.log('⏹ durduruldu'); }

  return { durum, gunluk, grind, durdur, api };
})();

console.log('%cÇırak botu hazır ✓  ·  await CIRAK.durum()  ·  await CIRAK.gunluk()  ·  CIRAK.grind(25)  ·  CIRAK.durdur()',
  'background:#111;color:#0f0;padding:5px;border-radius:4px');
