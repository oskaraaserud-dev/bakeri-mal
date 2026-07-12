# bakeri-mal

Mal for bakeri- og kafénettsider. Ren HTML, CSS og JavaScript – ingen rammeverk,
ingen build-steg, ingen npm. Kjører rett på GitHub Pages.

Alt kundespesifikt ligger i **`config.js`**. Malfilene rører du ikke.

---

## Hva du får

- Helskjerms hero med logo, tittel og to CTA-er
- «Om oss»-seksjon, produktkort, åpningstider, Google Maps-kart og kontaktinfo
- Bestillingsskjema (Formspree) med takkeside
- Egen menyside med prisliste delt i kategorier
- Lokal SEO: JSON-LD `Bakery`-schema med adresse, koordinater og åpningstider
- Riktige forhåndsvisninger ved deling på Facebook/LinkedIn
- Responsivt, tilgjengelig (skip-lenke, `aria-current`, `prefers-reduced-motion`)

---

## Ny kunde på 6 steg

### 1. Opprett kundens repo og legg til malen som submodule

```bash
git init kundenavn && cd kundenavn
git submodule add https://github.com/oskaraaserud-dev/bakeri-mal.git mal
```

### 2. Kopier skallene fra malen til rota

```bash
cp mal/index.html mal/Meny.html mal/takk.html mal/config.js .
```

### 3. Rett stiene, siden malen nå ligger under `mal/`

I `index.html`, `Meny.html` og `takk.html` – tre søk-og-erstatt:

| Fra | Til |
|---|---|
| `href="CSS/` | `href="mal/CSS/` |
| `src="JS/` | `src="mal/JS/` |
| `href="Bilder/` | `href="mal/Bilder/` |

I `config.js` blir bildestiene tilsvarende `mal/Bilder/logo.svg` osv. – bortsett fra
kundens egne foto, som legges i kundens egen `Bilder/`-mappe.

### 4. Fyll ut `config.js`

Dette er den eneste fila med kundedata. Alt er kommentert. Husk:

- **`side.url`** må være full URL og slutte med skråstrek.
- **`bestilling.formspreeId`** – lag skjemaet gratis på [formspree.io](https://formspree.io)
  og koble det til kundens e-post. Er feltet tomt, skjules skjemaet og kundene henvises
  til e-post og telefon i stedet.
- **`apningstider`** skrives ÉN gang. Både tabellen på siden og `openingHoursSpecification`
  i JSON-LD utledes herfra, så de kan ikke komme i utakt.

### 5. Lag delingsbildet

`bilder.delingsbilde` **må være PNG eller JPG på 1200×630** – Facebook godtar ikke SVG.
Ta utgangspunkt i malens `Bilder/delingsbilde.png`, bytt navnet, og legg den i kundens
`Bilder/`-mappe. Dette er den ene tingen som ikke kan genereres automatisk.

### 6. Generer head-blokkene

Åpne **`mal/verktoy/publiser.html`** i nettleseren. Den leser `config.js` og skriver ut
ferdige blokker du limer inn i `index.html`, `Meny.html`, `takk.html`, `sitemap.xml` og
`robots.txt`.

> **Hvorfor for hånd?** Facebook, LinkedIn og Slack kjører ikke JavaScript når de lager
> forhåndsvisning av en lenke – de leser bare rå HTML. Fylte vi `<head>` i kjøretid, ville
> en deling vist «Ditt Bakeri» i stedet for kundens navn. Derfor er head-en statisk, men
> *generert fra config.js*, så du skriver aldri kundedata to steder.

Kjører du siden lokalt, sier `main.js` fra i konsollen hvis head og config har kommet i utakt.

---

## Slik utvider du menyen

I `config.js`, ikke i HTML-en:

- **Ny kategori** → nytt objekt i `meny.grupper[]`
- **Ny vare** → nytt objekt i den kategoriens `varer[]`

Layouten følger automatisk, uansett hvor mange varer og kategorier som kommer til.
Ingen CSS-endring nødvendig. Vil du ikke vise priser: sett `pris: ''` på hver vare.

**Plassholderpriser?** Sett `side.menyNoindex: true` mens tallene er oppdiktede. Da legger
`publiser.html` inn `noindex` på menysiden og holder den ute av sitemap-en, så ingen googler
seg fram til priser som ikke stemmer. Husk å sette den til `false` når de ekte tallene er inne.

---

## Farger

Bytt de fire merkevarefargene i `config.farger`. `mal.js` setter dem på `:root` før siden
males, så du ser aldri malens farger blinke først. RGB-triplettene som skygger og fokusglød
bruker, regnes ut automatisk fra hex – du trenger ikke oppgi dem.

Trenger kunden noe malen ikke dekker, lag en `overstyringer.css` i kundens repo og last den
etter `mal/CSS/style.css`. Ikke rediger malens stilark.

---

## Oppgradere en kunde til nyeste mal

```bash
cd kundenavn
git submodule update --remote mal
git add mal && git commit -m "Oppdater bakeri-mal"
```

Dette henter ny CSS, JS og verktøy. Har malens **HTML-skall** endret seg, må de kopieres
inn på nytt (steg 2–3 og 6).

---

## Begrensninger, ærlig sagt

1. **Kundens repo kan ikke bestå av kun `config.js`.** GitHub Pages har ingen includes, så
   de tre HTML-skallene må ligge i repoet. De inneholder til gjengjeld ingen kundedata.
2. **Delingsbildet lages manuelt** per kunde (se steg 5).
3. **Uten JavaScript** ser besøkende malens generiske tekst, ikke kundens. Google er dekket,
   fordi JSON-LD i head er statisk og inneholder navn, adresse, telefon og åpningstider –
   nettopp det lokalt søk trenger.
4. **Submodulen må være et public repo** og refereres med `https://`, ellers klarer ikke
   GitHub Pages å sjekke den ut. La Pages-kilden stå på «Deploy from a branch».
5. `git clone` av et kundeprosjekt trenger `--recurse-submodules`.

---

## Filer

| Fil | Rolle |
|---|---|
| `config.js` | **Den eneste fila du redigerer per kunde.** |
| `CSS/style.css` | Delt stilark. Alle farger via `var()`. |
| `JS/mal.js` | Leser config, setter farger på `:root` før siden males. |
| `JS/main.js` | Bygger DOM fra config; scroll-animasjoner og header. |
| `verktoy/publiser.html` | Genererer head-blokker, sitemap og robots fra config. |
| `Bilder/` | Generiske SVG-er + delingsbilde. Kundens foto hører hjemme i kundens repo. |
