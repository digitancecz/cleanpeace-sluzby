/* CleanPeace – služby
   1) Přenese UTM / gclid / fbclid / sklik parametry z landing page do odkazů na app.cleanpeace.cz,
      aby se zdroj kampaně neztratil při přechodu na jinou subdoménu.
   2) Při kliknutí na CTA pošle do dataLayer událost "cta_click" (pro GTM). */
(function () {
  var KEYS = /^(utm_[a-z]+|gclid|gbraid|wbraid|fbclid|sznclid|msclkid)$/;
  var params = new URLSearchParams(window.location.search);
  var keep = [];
  params.forEach(function (v, k) { if (KEYS.test(k)) keep.push([k, v]); });

  var links = document.querySelectorAll('a[href^="https://app.cleanpeace.cz"]');
  if (keep.length) {
    links.forEach(function (a) {
      var url = new URL(a.href);
      keep.forEach(function (p) { if (!url.searchParams.has(p[0])) url.searchParams.set(p[0], p[1]); });
      a.href = url.toString();
    });
  }

  // Logo vrací na začátek stránky. Odkaz #top funguje i bez JS; skript posouvá plynule
  // a pokud prohlížeč plynulý posun přeruší (iOS při dojíždění scrollu), dorovná to okamžitě.
  var logo = document.querySelector('.site-header .logo[href="#top"]');
  if (logo) logo.addEventListener('click', function (e) {
    e.preventDefault();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
    setTimeout(function () {
      if (window.pageYOffset > 0) { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; window.scrollTo(0, 0); }
    }, 700);
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });

  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-cta]');
    if (!a) return;
    window.dataLayer.push({
      event: 'cta_click',
      cta_type: a.getAttribute('data-cta'),
      cta_location: a.getAttribute('data-loc') || '',
      page_service: document.body.getAttribute('data-service') || ''
    });
  });
})();
