# sluzby.cleanpeace.cz

Statické landing pages pro kampaně CleanPeace (GitHub Pages).

| URL | Soubor |
|---|---|
| https://sluzby.cleanpeace.cz/ | `index.html` – rozcestník |
| https://sluzby.cleanpeace.cz/uklid/ | `uklid/index.html` |
| https://sluzby.cleanpeace.cz/tepovani/ | `tepovani/index.html` |

- `assets/style.css` – sdílené styly, `assets/main.js` – přenos UTM/gclid do odkazů na app.cleanpeace.cz + `dataLayer` událost `cta_click` (atributy `data-cta`, `data-loc`)
- `assets/img/` – optimalizované WebP fotky, `IMG/` – zdrojové fotky (v `.gitignore`, na web nejdou)
- Stránky mají `noindex` – jsou určené pro placené kampaně.

## Nasazení
1. Nahrát obsah této složky do kořene repozitáře (soubor `CNAME` už obsahuje `sluzby.cleanpeace.cz`).
2. GitHub → Settings → Pages → Deploy from branch → `main` / `(root)`.
3. V DNS domény cleanpeace.cz: `CNAME  sluzby  →  <uzivatel>.github.io.`
4. Po ověření domény zapnout **Enforce HTTPS**.

## Před spuštěním doplnit
- GTM kontejner + Consent Mode v2 (komentář `<!-- GTM -->` v `<head>` každé stránky)
- Místa označená `TODO` (orientační ceny, rozsah okolí, zakomentované FAQ): `grep -rn TODO --include=*.html .`
