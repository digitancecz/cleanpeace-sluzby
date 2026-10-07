# sluzby.cleanpeace.cz

Statické landing pages pro kampaně CleanPeace (GitHub Pages).

| URL | Soubor |
|---|---|
| https://sluzby.cleanpeace.cz/ | `index.html` – rozcestník |
| https://sluzby.cleanpeace.cz/uklid/ | `uklid/index.html` |
| https://sluzby.cleanpeace.cz/tepovani/ | `tepovani/index.html` |

- `assets/consent.js` – cookie lišta + Google Consent Mode v2 a načtení GTM (nastavení `CFG` na začátku souboru)
- `assets/fonts/` – font Asap hostovaný lokálně (žádné požadavky na Google před souhlasem)
- `assets/style.css` – sdílené styly, `assets/main.js` – přenos UTM/gclid do odkazů na app.cleanpeace.cz + `dataLayer` událost `cta_click` (atributy `data-cta`, `data-loc`)
- `assets/img/` – optimalizované WebP fotky, `IMG/` – zdrojové fotky (v `.gitignore`, na web nejdou)
- Stránky mají `noindex` – jsou určené pro placené kampaně.

## Nasazení
1. Nahrát obsah této složky do kořene repozitáře (soubor `CNAME` už obsahuje `sluzby.cleanpeace.cz`).
2. GitHub → Settings → Pages → Deploy from branch → `main` / `(root)`.
3. V DNS domény cleanpeace.cz: `CNAME  sluzby  →  <uzivatel>.github.io.`
4. Po ověření domény zapnout **Enforce HTTPS**.

## Před spuštěním doplnit
- ID vlastního GTM kontejneru do `assets/consent.js` → `CFG.gtmId`. V GTM nastavit u tagů kontrolu souhlasu (GA4 → `analytics_storage`, Google Ads / Sklik / Meta → `ad_storage`); pro vlastní triggery je k dispozici událost `consent_update` s proměnnými `consent_analytics` a `consent_marketing`.
- Místa označená `TODO` (orientační ceny, rozsah okolí, zakomentované FAQ): `grep -rn TODO --include=*.html .`
