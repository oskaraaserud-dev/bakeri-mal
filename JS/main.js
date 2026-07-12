/* ============================================================================
   BAKERI-MAL – sideoppførsel

   Anvender config.js på DOM-en, og kjører scroll-animasjoner og header.
   Krever at JS/mal.js er lastet først (i <head>).

   OM FALLBACK: all HTML har lesbar generisk tekst inni seg. Skulle JS feile
   eller være slått av, ser besøkende malens generiske bakeri – ikke en ødelagt
   side. Derfor ERSTATTER vi innhold her; vi bygger ikke opp fra tomt.
   ============================================================================ */
(function () {
  'use strict';

  var M = window.MAL;
  if (!M) return;                    // uten mal.js: behold HTML-ens fallback

  var hent = M.hent, esc = M.esc, abs = M.abs;

  function alle(v, rot) { return Array.prototype.slice.call((rot || document).querySelectorAll(v)); }
  function en(v, rot) { return (rot || document).querySelector(v); }

  /* Rik tekst fra config: escapes FØRST, så tolkes et lite, lukket sett med
     markører. Config kan dermed aldri injisere vilkårlig HTML, men du får
     likevel uthevet tekst og klikkbar kontaktinfo midt i en setning.

       **fet**      ->  <strong>fet</strong>
       {telefon}    ->  klikkbar tel:-lenke
       {epost}      ->  klikkbar mailto:-lenke                                */
  function rik(tekst) {
    var tlf = hent('kontakt.telefon'), tlfLenke = hent('kontakt.telefonTel');
    var epost = hent('kontakt.epost');
    return esc(tekst)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\{telefon\}/g, tlfLenke
        ? '<a class="kontakt-lenke" href="tel:' + esc(tlfLenke) + '">' + esc(tlf) + '</a>'
        : esc(tlf))
      .replace(/\{epost\}/g, epost
        ? '<a class="kontakt-lenke" href="mailto:' + esc(epost) + '">' + esc(epost) + '</a>'
        : '');
  }

  /* ---------- 1) Tekst- og attributt-slots -------------------------------- */

  // Fallback-tekst i HTML-en som ikke lenger stemmer med config. Samles opp
  // her og rapporteres av devSjekk() – se forklaringen der.
  var utdatert = [];

  function fyllSlots() {
    // <h1 data-bak="bedrift.navn">Ditt Bakeri</h1>
    alle('[data-bak]').forEach(function (el) {
      var sti = el.getAttribute('data-bak');
      var v = hent(sti);
      if (!v) return;
      if (el.textContent.trim() !== String(v).trim()) utdatert.push(sti);
      el.textContent = v;
    });

    // <img data-bak-src="bilder.logo">
    alle('[data-bak-src]').forEach(function (el) {
      var v = hent(el.getAttribute('data-bak-src'));
      if (v) el.setAttribute('src', v);
    });

    // <a data-bak-href="side.url">
    alle('[data-bak-href]').forEach(function (el) {
      var v = hent(el.getAttribute('data-bak-href'));
      if (v) el.setAttribute('href', v);
    });

    // <a data-bak-tel="kontakt.telefonTel">  ->  href="tel:+47…"
    alle('[data-bak-tel]').forEach(function (el) {
      var v = hent(el.getAttribute('data-bak-tel'));
      if (v) el.setAttribute('href', 'tel:' + v);
    });

    // <a data-bak-epost="kontakt.epost">  ->  href="mailto:…"
    alle('[data-bak-epost]').forEach(function (el) {
      var v = hent(el.getAttribute('data-bak-epost'));
      if (v) el.setAttribute('href', 'mailto:' + v);
    });

    // <p data-bak-rik="meny.note">  ->  tekst med **fet** og {telefon}/{epost}
    alle('[data-bak-rik]').forEach(function (el) {
      var v = hent(el.getAttribute('data-bak-rik'));
      if (v) el.innerHTML = rik(v);
    });

    // <div data-bak-avsnitt="bedrift.omOss">  ->  ett <p> per element
    alle('[data-bak-avsnitt]').forEach(function (el) {
      var liste = hent(el.getAttribute('data-bak-avsnitt'), []);
      if (!liste.length) return;
      el.innerHTML = liste.map(function (t) { return '<p>' + rik(t) + '</p>'; }).join('');
    });

    // Adresse på én linje: "Storgata 1, 0155 Storby"
    var a = hent('kontakt.adresse', {});
    var linje = [a.gate, [a.postnr, a.sted].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    if (linje) alle('[data-bak-adresse]').forEach(function (el) { el.textContent = linje; });
  }

  /* ---------- 2) Produktkort ---------------------------------------------- */

  function renderProdukter() {
    var produkter = hent('produkter', []);
    alle('.produkt-grid').forEach(function (grid) {
      if (!produkter.length) { grid.remove(); return; }
      grid.innerHTML = produkter.map(function (p) {
        return '<article class="produkt-kort">' +
          '<img src="' + esc(p.bilde) + '" alt="' + esc(p.alt) + '" class="produkt-bilde"' +
          ' width="' + esc(p.bredde || 800) + '" height="' + esc(p.hoyde || 800) + '" loading="lazy">' +
          '<h3>' + esc(p.tittel) + '</h3>' +
          '<p>' + esc(p.tekst) + '</p>' +
        '</article>';
      }).join('');
    });
  }

  /* ---------- 3) Åpningstider (samme kilde som JSON-LD) ------------------- */

  function renderApningstider() {
    var tabell = en('table.apningstider');
    if (!tabell) return;
    tabell.innerHTML = M.apningstidRader().map(function (r) {
      return '<tr><th scope="row">' + esc(r.navn) + '</th><td>' + esc(r.tekst) + '</td></tr>';
    }).join('');
  }

  /* ---------- 4) Menysiden: prisliste + på bestilling ---------------------- */

  function renderMeny() {
    var vert = en('[data-bak-prisliste]');
    if (vert) {
      vert.innerHTML = hent('meny.grupper', []).map(function (g) {
        var rader = (g.varer || []).map(function (v) {
          var pris = v.pris ? '<span class="pris">' + esc(v.pris) + '</span>' : '';
          return '<li class="prisrad">' +
            '<div class="prisrad__vare">' +
              '<h4>' + esc(v.navn) + '</h4>' +
              (v.beskrivelse ? '<p>' + esc(v.beskrivelse) + '</p>' : '') +
            '</div>' + pris +
          '</li>';
        }).join('');
        return '<div class="menygruppe">' +
          '<h3 class="menygruppe__tittel">' + esc(g.tittel) + '</h3>' +
          '<ul class="prisliste">' + rader + '</ul>' +
        '</div>';
      }).join('');
    }

    var best = en('[data-bak-bestilling]');
    if (best) {
      best.innerHTML = hent('meny.paaBestilling', []).map(function (k) {
        return '<li class="meny-kategori"><h3>' + esc(k.tittel) + '</h3><p>' + esc(k.tekst) + '</p></li>';
      }).join('');
    }
  }

  /* ---------- 5) Kart og veibeskrivelse ----------------------------------- */

  function renderKart() {
    var a = hent('kontakt.adresse', {});
    var sok = encodeURIComponent([a.gate, a.postnr, a.sted].filter(Boolean).join(', '));
    if (!sok) return;

    var ramme = en('.kart iframe');
    if (ramme) {
      ramme.setAttribute('src', 'https://maps.google.com/maps?q=' + sok + '&z=15&output=embed');
      ramme.setAttribute('title', 'Kart som viser ' + hent('bedrift.navn') + ' i ' +
        [a.gate, a.sted].filter(Boolean).join(', '));
    }
    var vei = en('[data-bak-veibeskrivelse]');
    if (vei) vei.setAttribute('href', 'https://www.google.com/maps/dir/?api=1&destination=' + sok);
  }

  /* ---------- 6) Bestillingsskjema ----------------------------------------
     Uten Formspree-ID skjules skjemaet og e-post/telefon vises i stedet. Bedre
     enn et skjema som stille kaster bestillingene i havet.                  */

  function renderSkjema() {
    var skjema = en('.bestill-skjema');
    if (!skjema) return;

    var action = M.skjemaAction();
    if (!action) {
      skjema.hidden = true;
      var mangler = en('[data-bak-skjema-mangler]');
      if (mangler) mangler.hidden = false;
      return;
    }
    skjema.setAttribute('action', action);

    var emne = en('input[name="_subject"]', skjema);
    if (emne) emne.value = hent('bestilling.emneFelt') || ('Ny bestilling – ' + hent('bedrift.navn'));

    var neste = en('input[name="_next"]', skjema);
    if (neste) neste.value = abs(hent('bestilling.takkSide', 'takk.html'));

    var typer = hent('bestilling.typer', []);
    var valg = en('select[name="Type"]', skjema);
    if (valg && typer.length) {
      valg.innerHTML = typer.map(function (t) {
        return '<option value="' + esc(t) + '">' + esc(t) + '</option>';
      }).join('');
    }
  }

  /* ---------- 7) Sosiale lenker ------------------------------------------- */

  function renderSosialt() {
    var vert = en('[data-bak-sosialt]');
    if (!vert) return;
    var lenker = hent('sosialt', []);
    if (!lenker.length) { vert.remove(); return; }
    vert.innerHTML = lenker.map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
        esc(l.navn) + '</a>';
    }).join('');
  }

  /* ---------- 8) Scroll-animasjoner, header, logo-lenke -------------------- */

  function sideoppforsel() {
    var mal = alle('.reveal');
    if ('IntersectionObserver' in window && mal.length) {
      var obs = new IntersectionObserver(function (poster, o) {
        poster.forEach(function (p) {
          if (p.isIntersecting) { p.target.classList.add('is-visible'); o.unobserve(p.target); }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      mal.forEach(function (el) { obs.observe(el); });
    } else {
      mal.forEach(function (el) { el.classList.add('is-visible'); });
    }

    var header = en('header.over-hero');
    if (header) {
      var vedScroll = function () { header.classList.toggle('is-solid', window.scrollY > 60); };
      window.addEventListener('scroll', vedScroll, { passive: true });
      vedScroll();
    }

    // Myk scroll til toppen ved klikk på logo/navn – men KUN når lenken peker
    // på et anker på samme side. På undersider peker den til index.html og må
    // få navigere som vanlig, ellers slutter logoen å ta deg hjem.
    var brand = en('a.brand');
    if (brand && (brand.getAttribute('href') || '').charAt(0) === '#') {
      brand.addEventListener('click', function (e) {
        e.preventDefault();
        var reduser = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduser ? 'auto' : 'smooth' });
      });
    }
  }

  /* ---------- 9) Utviklersjekk: er <head> i utakt med config? --------------
     <head> MÅ være statisk (Facebook kjører ikke JS når den lager
     lenkeforhåndsvisning), men den GENERERES fra config av
     verktoy/publiser.html. Glemmer du å lime inn på nytt etter en
     config-endring, sier denne fra. Kjører kun lokalt eller med ?sjekk=1.  */

  function devSjekk() {
    var lokalt = location.hostname === 'localhost' || location.hostname === '127.0.0.1' ||
                 location.protocol === 'file:';
    if (!lokalt && location.search.indexOf('sjekk=1') === -1) return;

    var base = String(hent('side.url', '')).replace(/\/+$/, '');
    var canon = en('link[rel="canonical"]');
    if (canon && base && (canon.getAttribute('href') || '').indexOf(base) !== 0) {
      console.warn('[bakeri-mal] <head> er i utakt med config.js: canonical er "' +
        canon.getAttribute('href') + '", men side.url er "' + hent('side.url') +
        '". Kjør verktoy/publiser.html og lim inn head-blokken på nytt.');
    }

    var ogTittel = en('meta[property="og:title"]');
    var navn = hent('bedrift.navn');
    if (ogTittel && navn && (ogTittel.getAttribute('content') || '').indexOf(navn) === -1) {
      console.warn('[bakeri-mal] <head> er i utakt: og:title nevner ikke "' + navn +
        '". Facebook viser da feil navn ved deling. Kjør verktoy/publiser.html på nytt.');
    }

    // Fallback-teksten i HTML-en er det no-JS-brukere OG crawlere som ikke
    // kjører JS faktisk ser. Stemmer den ikke med config, viser rå HTML feil
    // bedrift – i verste fall et feil telefonnummer som klikkbar lenke.
    if (utdatert.length) {
      console.warn('[bakeri-mal] Fallback-teksten i HTML-en er i utakt med config.js ' +
        'for: ' + utdatert.join(', ') + '.\nJS retter det opp i nettleseren, men rå HTML ' +
        '(no-JS, enkelte crawlere, «vis kilde») viser fortsatt de gamle verdiene. ' +
        'Bak inn skallene på nytt – se «Bake inn fallback-teksten» i README.');
    }
  }

  /* ---------- Kjør -------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    fyllSlots();
    renderProdukter();
    renderApningstider();
    renderMeny();
    renderKart();
    renderSkjema();
    renderSosialt();
    sideoppforsel();
    devSjekk();
  });

})();
