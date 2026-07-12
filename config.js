/* ============================================================================
   BAKERI-MAL – KONFIGURASJON

   Dette er den ENESTE fila du redigerer for en ny kunde.
   Alt annet (HTML, CSS, JS) er delt og skal stå urørt.

   Etter at du har fylt ut denne fila:
     1. Åpne verktoy/publiser.html i nettleseren.
     2. Kopier de ferdige <head>-blokkene inn i index.html, Meny.html og takk.html.
        (Head-en må være statisk fordi Facebook og LinkedIn ikke kjører JavaScript
         når de lager forhåndsvisning av lenker. Verktøyet genererer den fra
         nettopp denne fila, så du skriver aldri data to steder.)
     3. Kopier ut sitemap.xml og robots.txt derfra også.

   Se README.md for hele oppskriften.
   ============================================================================ */

window.BAKERI = {

  /* --- Siden som helhet -------------------------------------------------- */
  side: {
    // MÅ slutte med skråstrek. Brukes til å bygge absolutte URL-er
    // (canonical, og:image, skjemaets takkeside-redirect).
    url: 'https://brukernavn.github.io/ditt-bakeri/',
    sprak: 'nb',
    tittel: 'Ditt Bakeri – Bakeri og kafé i Storby',
    beskrivelse: 'Ditt Bakeri – lokalt bakeri og kafé. Nybakt bakverk, kaker og kaffe. Spis inne, eller forhåndsbestill kake og catering på nett.',
    // true mens menyen inneholder plassholderpriser – holder den utenfor Google.
    menyNoindex: false
  },

  /* --- Bedriften --------------------------------------------------------- */
  bedrift: {
    navn: 'Ditt Bakeri',
    heroTittel: 'Velkommen til Ditt Bakeri',
    heroIngress: 'Lokalt bakeri og kafé midt i sentrum. Nybakt bakverk, kaker og kaffe – kom innom og spis inne, eller bestill kake og catering på nett.',
    // Ett avsnitt per element. Marker fet tekst med **stjerner**.
    omOss: [
      'Ditt Bakeri er et lokalt bakeri og kafé. Hos oss kan du sette deg ned med en kopp kaffe og noe nybakt, eller ta med deg godsaker hjem.',
      'Skal du feire noe? Vi lager kaker og catering på bestilling. Bruk skjemaet lenger ned, så tar vi kontakt.'
    ],
    aarstall: 2026,
    // Brukes i JSON-LD (lokalt søk i Google).
    priceRange: '$$',
    serverer: ['Bakverk', 'Kaker', 'Kaffe'],
    omraade: 'Storby'
  },

  /* --- Farger ------------------------------------------------------------
     Settes på :root av mal.js før siden males. RGB-triplettene som
     rgba()-skygger bruker, regnes ut automatisk fra disse hex-verdiene.  */
  farger: {
    brunMork: '#3b1f0e',    // header, footer, hero-bunn, overskrifter
    brun: '#8B4513',        // aksent: hover, lenker, fokus
    krem: '#f5f0eb',        // sidebakgrunn og kort
    gul: '#f5c842',         // CTA-knapper, fokusring, kategoristrek
    gulLys: '#ffd966',      // hover på gul CTA
    tekstDempet: '#5a4636', // brødtekst i kort og ingresser
    kantlinje: '#e7dccd'    // skillelinjer
  },

  /* --- Bilder ------------------------------------------------------------
     Stier er relative til rota. Malen leveres med generiske SVG-er.       */
  bilder: {
    // I MALEN ligger delt kode på CSS/, JS/, Bilder/.
    // I ET KUNDEPROSJEKT er malen en submodule, så stiene blir mal/Bilder/…
    // (kundens egne foto legger du i kundens egen Bilder/-mappe).
    logo: 'Bilder/logo.svg',
    hero: 'Bilder/hero.svg',
    // Deles på Facebook/LinkedIn. MÅ være raster (PNG/JPG), 1200×630.
    // SVG godtas ikke av Facebook. Se README for hvordan du lager en per kunde.
    delingsbilde: 'Bilder/delingsbilde.png',
    delingsbildeAlt: 'Ditt Bakeri – lokalt bakeri og kafé'
  },

  /* --- Kontakt ----------------------------------------------------------- */
  kontakt: {
    telefon: '+47 22 00 00 00',   // slik det VISES
    telefonTel: '+4722000000',    // slik tel:-lenka ser ut (ingen mellomrom)
    epost: 'post@dittbakeri.no',
    adresse: {
      gate: 'Storgata 1',
      postnr: '0155',
      sted: 'Storby',
      region: 'Oslo',
      land: 'NO'
    },
    // Finn koordinatene ved å høyreklikke stedet i Google Maps.
    geo: { lat: 59.9138688, lng: 10.7522454 }
  },

  /* --- Åpningstider ------------------------------------------------------
     ÉN kilde. Både HTML-tabellen på siden og openingHoursSpecification i
     JSON-LD utledes herfra – du skriver dem aldri to ganger.
     Format: ['09:00', '15:00'].  null = stengt.                            */
  apningstider: {
    dager: {
      mandag:  ['09:00', '16:00'],
      tirsdag: ['09:00', '16:00'],
      onsdag:  ['09:00', '16:00'],
      torsdag: ['09:00', '16:00'],
      fredag:  ['09:00', '16:00'],
      lordag:  ['10:00', '15:00'],
      sondag:  null
    },
    note: 'Tider kan variere på helligdager – ring gjerne på forhånd.'
  },

  /* --- Produktkort (forsiden + «Fra disken» på menysiden) ---------------- */
  produkter: [
    {
      bilde: 'Bilder/produkt.svg',
      alt: 'Ferskt bakverk i disken',
      bredde: 800, hoyde: 800,
      tittel: 'Bakverk',
      tekst: 'Nybakt brød, boller, snurrer og wienerbrød – ferskt fra disken hver dag.'
    },
    {
      bilde: 'Bilder/produkt.svg',
      alt: 'Kake pyntet til fest',
      bredde: 800, hoyde: 800,
      tittel: 'Kaker til fest',
      tekst: 'Bursdags- og festkaker etter ønske. Bestilles på forhånd.'
    },
    {
      bilde: 'Bilder/produkt.svg',
      alt: 'Nystekte smultringer',
      bredde: 800, hoyde: 800,
      tittel: 'Smultringer',
      tekst: 'Nystekte smultringer, en ekte klassiker rett fra disken.'
    }
  ],

  /* --- Menysiden ---------------------------------------------------------
     Ny kategori: legg til et objekt i grupper[].
     Ny vare:     legg til et objekt i varer[].
     Layouten følger automatisk – ingen CSS-endring nødvendig.
     Sett pris til '' hvis du ikke vil vise priser i det hele tatt.         */
  meny: {
    ingress: 'Alt bakes fra bunnen hver dag. Utvalget varierer med sesong og dag – her er det vi vanligvis har inne.',
    grupper: [
      {
        tittel: 'Brød og rundstykker',
        varer: [
          { navn: 'Rundstykker', beskrivelse: 'Grove eller fine, rett fra ovnen.', pris: '25 kr' },
          { navn: 'Grovbrød',    beskrivelse: 'Helt brød, bakt samme morgen.',     pris: '55 kr' }
        ]
      },
      {
        tittel: 'Søtt bakverk',
        varer: [
          { navn: 'Kanelsnurr', beskrivelse: 'Nybakt snurr med smør og kanel.', pris: '42 kr' },
          { navn: 'Skolebrød',  beskrivelse: 'Vaniljekrem og kokos.',           pris: '42 kr' }
        ]
      },
      {
        tittel: 'Kafé og drikke',
        varer: [
          { navn: 'Kaffe',       beskrivelse: 'Traktet kaffe.',            pris: '39 kr' },
          { navn: 'Kaffe latte', beskrivelse: 'Espresso med dampet melk.', pris: '52 kr' }
        ]
      }
    ],
    paaBestilling: [
      { tittel: 'Kaker til fest', tekst: 'Bursdags- og festkaker etter ønske – si fra hva du vil ha, så lager vi den.' },
      { tittel: 'Catering',       tekst: 'Skal du feire noe? Vi lager catering på bestilling, og tar kontakt for å avtale detaljene.' }
    ],
    note: 'Prisene gjelder over disk og kan endre seg. Fullt utvalg får du i butikken.'
  },

  /* --- Bestillingsskjema -------------------------------------------------
     Lag et gratis skjema på https://formspree.io, koble det til kundens
     e-post, og lim inn ID-en (ser ut som 'mabcdefg').
     Er ID-en tom, skjules skjemaet og kunden ser e-post/telefon i stedet.  */
  bestilling: {
    formspreeId: '',
    emneFelt: 'Ny bestilling fra nettsiden',
    takkSide: 'takk.html',
    typer: ['Kake', 'Catering', 'Annet']
  },

  /* --- Sosiale lenker ----------------------------------------------------
     Tom liste = ingen lenker i footeren. Går også inn i JSON-LD (sameAs).  */
  sosialt: []

};
