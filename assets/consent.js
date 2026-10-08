/* CleanPeace – cookie lišta + Google Consent Mode v2
   Načítá se synchronně v <head> PŘED čímkoliv dalším, co měří.

   - Výchozí stav: vše kromě nezbytného "denied" (opt-in dle § 89 odst. 3 z. č. 127/2005 Sb. a GDPR).
   - Volba se ukládá do cookie cp_consent na .cleanpeace.cz (12 měsíců, při odmítnutí 6 měsíců).
   - Souhlas lze kdykoliv změnit/odvolat odkazem s atributem [data-cc-open] (v patičce).
   - Při odvolání smaže existující měřicí cookies.
   - Do dataLayer posílá událost consent_update (consent_analytics / consent_marketing) pro triggery v GTM.

   MODE:
     'advanced' – GTM se načte vždy, tagy běží v režimu "denied" (cookieless pingy, modelace konverzí).
     'basic'    – GTM se načte až po udělení souhlasu (nejkonzervativnější varianta). */
(function () {
  var CFG = {
    gtmId: 'GTM-PLNTTTM7',
    mode: 'advanced',
    version: 1,               // zvýšením se lišta zobrazí znovu všem
    daysAccept: 365,
    daysReject: 182,
    cookie: 'cp_consent',
    privacyUrl: 'https://cleanpeace.cz/wp-content/uploads/2025/07/Privacy-Policy-CleanPeace-2.pdf'
  };

  var w = window, d = document;
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    personalization_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  /* ---------- úložiště ---------- */
  function rootDomain() {
    return /(^|\.)cleanpeace\.cz$/.test(location.hostname) ? '; domain=.cleanpeace.cz' : '';
  }
  function read() {
    var m = d.cookie.match(new RegExp('(?:^|; )' + CFG.cookie + '=([^;]*)'));
    if (!m) return null;
    try {
      var s = JSON.parse(decodeURIComponent(m[1]));
      return s && s.v === CFG.version ? s : null;
    } catch (e) { return null; }
  }
  function write(s) {
    var days = (s.a || s.m) ? CFG.daysAccept : CFG.daysReject;
    d.cookie = CFG.cookie + '=' + encodeURIComponent(JSON.stringify(s)) +
      '; max-age=' + days * 86400 + '; path=/' + rootDomain() + '; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
  }
  function purge(prefixes) {
    d.cookie.split('; ').forEach(function (c) {
      var name = c.split('=')[0];
      if (!prefixes.test(name)) return;
      ['', '; domain=' + location.hostname, '; domain=.cleanpeace.cz'].forEach(function (dom) {
        d.cookie = name + '=; max-age=0; path=/' + dom;
      });
    });
  }

  /* ---------- GTM ---------- */
  var gtmLoaded = false;
  function loadGTM() {
    if (gtmLoaded || !CFG.gtmId) return;
    gtmLoaded = true;
    w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var j = d.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + CFG.gtmId;
    d.head.appendChild(j);
  }

  /* ---------- aplikace souhlasu ---------- */
  function apply(s) {
    var a = s.a ? 'granted' : 'denied', m = s.m ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: a,
      personalization_storage: a,
      ad_storage: m,
      ad_user_data: m,
      ad_personalization: m
    });
    w.dataLayer.push({ event: 'consent_update', consent_analytics: s.a, consent_marketing: s.m });
  }

  var state = read();
  if (state) apply(state);
  if (CFG.mode === 'advanced' || (state && (state.a || state.m))) loadGTM();

  function save(a, m) {
    var prev = state;
    state = { v: CFG.version, a: !!a, m: !!m, ts: new Date().toISOString() };
    write(state);
    apply(state);
    if (prev && prev.a && !state.a) purge(/^(_ga|_gid|_gat|_clck|_clsk)/);
    if (prev && prev.m && !state.m) purge(/^(_gcl|_fbp|_fbc|_uet|sid|udid|_ttp)/);
    if (state.a || state.m) loadGTM();
    close();
  }

  /* ---------- UI ---------- */
  var box, lastFocus;
  function el(html) { var t = d.createElement('div'); t.innerHTML = html.trim(); return t.firstChild; }

  function build() {
    box = el(
      '<div class="cc" role="dialog" aria-modal="false" aria-labelledby="cc-title" aria-describedby="cc-desc">' +
        '<div class="cc-box">' +
          '<h2 id="cc-title" class="cc-title">Cookies a vaše soukromí</h2>' +
          '<p id="cc-desc" class="cc-text">Nezbytné cookies potřebujeme, aby web fungoval. S vaším souhlasem použijeme také analytické cookies k měření návštěvnosti a marketingové cookies k měření a zobrazování reklam (např. Google Ads, Sklik). Souhlas můžete kdykoliv změnit nebo odvolat v patičce webu přes „Nastavení cookies“. Více v <a href="' + CFG.privacyUrl + '" target="_blank" rel="noopener">zásadách ochrany osobních údajů</a>.</p>' +
          '<div class="cc-prefs" hidden>' +
            '<label class="cc-row"><span><strong>Nezbytné</strong>Zajišťují základní funkce webu a uložení vaší volby. Nelze je vypnout.</span><input type="checkbox" checked disabled><i class="cc-sw" aria-hidden="true"></i></label>' +
            '<label class="cc-row"><span><strong>Analytické</strong>Měření návštěvnosti a chování na webu (Google Analytics), abychom mohli web zlepšovat.</span><input type="checkbox" data-cc-cat="a"><i class="cc-sw" aria-hidden="true"></i></label>' +
            '<label class="cc-row"><span><strong>Marketingové</strong>Měření účinnosti reklam a jejich přizpůsobení (Google Ads, Sklik a další reklamní systémy).</span><input type="checkbox" data-cc-cat="m"><i class="cc-sw" aria-hidden="true"></i></label>' +
          '</div>' +
          '<div class="cc-actions">' +
            '<button type="button" class="btn btn-sm cc-btn-settings" data-cc="settings">Nastavení</button>' +
            '<button type="button" class="btn btn-sm cc-btn-settings" data-cc="save" hidden>Uložit výběr</button>' +
            '<button type="button" class="btn btn-sm cc-btn-main" data-cc="reject">Odmítnout vše</button>' +
            '<button type="button" class="btn btn-sm cc-btn-main" data-cc="accept">Přijmout vše</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]');
      if (!b) return;
      var act = b.getAttribute('data-cc');
      if (act === 'accept') save(true, true);
      else if (act === 'reject') save(false, false);
      else if (act === 'settings') showPrefs();
      else if (act === 'save') save(q('[data-cc-cat="a"]').checked, q('[data-cc-cat="m"]').checked);
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state) close();
    });
    d.body.appendChild(box);
  }
  function q(sel) { return box.querySelector(sel); }
  function showPrefs() {
    q('.cc-prefs').hidden = false;
    q('[data-cc="settings"]').hidden = true;
    q('[data-cc="save"]').hidden = false;
    q('[data-cc-cat="a"]').focus();
  }
  function open(withPrefs) {
    if (!box) build();
    lastFocus = d.activeElement;
    q('[data-cc-cat="a"]').checked = !!(state && state.a);
    q('[data-cc-cat="m"]').checked = !!(state && state.m);
    q('.cc-prefs').hidden = true;
    q('[data-cc="settings"]').hidden = false;
    q('[data-cc="save"]').hidden = true;
    box.classList.add('cc--open');
    d.documentElement.classList.add('cc-visible');
    if (withPrefs) showPrefs(); else q('[data-cc="accept"]').focus({ preventScroll: true });
  }
  function close() {
    if (!box) return;
    box.classList.remove('cc--open');
    d.documentElement.classList.remove('cc-visible');
    if (lastFocus && lastFocus.focus && lastFocus !== d.body) lastFocus.focus({ preventScroll: true });
  }

  function init() {
    d.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cc-open]');
      if (!t) return;
      e.preventDefault();
      open(true);
    });
    if (!state) open(false);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();

  w.CleanPeaceConsent = { open: function () { open(true); }, get: function () { return state; } };
})();
