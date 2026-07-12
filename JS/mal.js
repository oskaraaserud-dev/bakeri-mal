/* ============================================================================
   BAKERI-MAL – delt bibliotek

   Lastes i <head>, FØR CSS males. Setter fargevariablene med én gang, slik at
   besøkende aldri ser malens standardfarger blinke før kundens egne.

   Brukes av både JS/main.js (selve siden) og verktoy/publiser.html
   (som genererer <head>-blokker, sitemap og robots.txt fra samme config).

   Rører aldri config.js – den er data, dette er logikk.
   ============================================================================ */
(function (global) {
  'use strict';

  var cfg = global.BAKERI || {};

  /* --- Oppslag med punktnotasjon: hent('kontakt.telefon') ---------------- */
  function hent(sti, standard) {
    var verdi = sti.split('.').reduce(function (obj, nokkel) {
      return (obj && obj[nokkel] !== undefined && obj[nokkel] !== null) ? obj[nokkel] : undefined;
    }, cfg);
    return verdi !== undefined ? verdi : (standard !== undefined ? standard : '');
  }

  /* --- Absolutt URL fra side.url + relativ sti ---------------------------
     Trengs til canonical, og:image og skjemaets _next – de må være absolutte. */
  function abs(sti) {
    var base = String(hent('side.url', '')).replace(/\/+$/, '');
    var rel = String(sti || '').replace(/^\/+/, '');
    return rel ? base + '/' + rel : base + '/';
  }

  /* --- HTML-escaping. Config er vår egen, men vi bygger DOM fra den, og da
     escaper vi likevel – billig, og hindrer at en & eller < ødelegger siden. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* --- #rrggbb -> "r, g, b" ----------------------------------------------
     Lar rgba()-skygger og fokusglød følge merkevarefargen automatisk, uten at
     du må oppgi RGB-tripletter i config. */
  function hexTilRgb(hex) {
    var h = String(hex || '').trim().replace(/^#/, '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ].join(', ');
  }

  /* --- Farger og hero-bilde på :root -------------------------------------
     Kjøres UMIDDELBART (ikke på DOMContentLoaded) fordi <html> finnes så snart
     scriptet parses. Dermed er variablene satt før første maling. */
  var FARGEKART = {
    brunMork: '--brun-mork',
    brun: '--brun',
    krem: '--krem',
    gul: '--gul',
    gulLys: '--gul-lys',
    tekstDempet: '--tekst-dempet',
    kantlinje: '--kantlinje'
  };

  function bruktema() {
    if (!global.document || !document.documentElement) return;
    var rot = document.documentElement.style;
    var farger = hent('farger', {});

    Object.keys(FARGEKART).forEach(function (nokkel) {
      if (farger[nokkel]) rot.setProperty(FARGEKART[nokkel], farger[nokkel]);
    });

    // Utled RGB-triplettene som rgba()-reglene i CSS-en bruker.
    var mork = hexTilRgb(farger.brunMork);
    var brun = hexTilRgb(farger.brun);
    if (mork) rot.setProperty('--brun-mork-rgb', mork);
    if (brun) rot.setProperty('--brun-rgb', brun);

    // Hero-bildet må gjøres ABSOLUTT før det settes.
    // En relativ url() inne i en CSS-variabel løses av nettleseren relativt til
    // STILARKET som bruker var()-en – ikke til dokumentet. 'Bilder/hero.svg'
    // ville derfor blitt lest som 'CSS/Bilder/hero.svg' og gitt tom hero.
    var hero = hent('bilder.hero');
    if (hero) {
      var heroUrl = hero;
      try { heroUrl = new URL(hero, document.baseURI).href; } catch (e) { /* behold relativ */ }
      rot.setProperty('--hero-bilde', 'url("' + heroUrl.replace(/"/g, '%22') + '")');
    }
  }

  /* --- Åpningstider ------------------------------------------------------
     ÉN kilde (config.apningstider.dager) -> to former:
       rader()   -> HTML-tabellen på siden ("Mandag | 09:00–16:00")
       grupper() -> JSON-LD openingHoursSpecification, der dager med IDENTISKE
                    tider slås sammen til én oppføring. Stengte dager utelates,
                    slik schema.org forventer.                                */
  var DAGER = [
    { nokkel: 'mandag',  norsk: 'Mandag',  schema: 'Monday' },
    { nokkel: 'tirsdag', norsk: 'Tirsdag', schema: 'Tuesday' },
    { nokkel: 'onsdag',  norsk: 'Onsdag',  schema: 'Wednesday' },
    { nokkel: 'torsdag', norsk: 'Torsdag', schema: 'Thursday' },
    { nokkel: 'fredag',  norsk: 'Fredag',  schema: 'Friday' },
    { nokkel: 'lordag',  norsk: 'Lørdag',  schema: 'Saturday' },
    { nokkel: 'sondag',  norsk: 'Søndag',  schema: 'Sunday' }
  ];

  function apningstidRader() {
    var dager = hent('apningstider.dager', {});
    return DAGER.map(function (d) {
      var t = dager[d.nokkel];
      return {
        navn: d.norsk,
        tekst: (t && t.length === 2) ? (t[0] + '–' + t[1]) : 'Stengt'
      };
    });
  }

  function apningstidGrupper() {
    var dager = hent('apningstider.dager', {});
    var grupper = {};
    DAGER.forEach(function (d) {
      var t = dager[d.nokkel];
      if (!t || t.length !== 2) return;            // stengt -> utelates
      var nokkel = t[0] + '-' + t[1];
      if (!grupper[nokkel]) grupper[nokkel] = { dager: [], opens: t[0], closes: t[1] };
      grupper[nokkel].dager.push(d.schema);
    });
    return Object.keys(grupper).map(function (k) { return grupper[k]; });
  }

  /* --- Skjema-action fra Formspree-ID ------------------------------------ */
  function skjemaAction() {
    var id = hent('bestilling.formspreeId', '');
    return id ? 'https://formspree.io/f/' + id : '';
  }

  bruktema();

  global.MAL = {
    cfg: cfg,
    hent: hent,
    abs: abs,
    esc: esc,
    hexTilRgb: hexTilRgb,
    bruktema: bruktema,
    DAGER: DAGER,
    apningstidRader: apningstidRader,
    apningstidGrupper: apningstidGrupper,
    skjemaAction: skjemaAction
  };

})(window);
