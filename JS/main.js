// Ditt Bakeri – scroll-animasjoner og interaktiv header

document.addEventListener('DOMContentLoaded', function () {
  // 0) Personalisering: hent bakeriets navn fra lenka (?navn=Solsikke%20Bakeri)
  //    Slik kan SAMME nettside sendes til alle mottakere – du bytter bare URL-en.
  //    Uten parameter vises standardnavnet «Ditt Bakeri».
  try {
    var navn = new URLSearchParams(window.location.search).get('navn');
    // Navnet lagres ved første besøk, slik at det følger med når mottakeren
    // klikker videre til Meny/Om oss (der URL-en ikke lenger har ?navn=).
    if (navn) {
      navn = navn.trim().slice(0, 60);
      try { sessionStorage.setItem('bakerinavn', navn); } catch (e) {}
    } else {
      try { navn = sessionStorage.getItem('bakerinavn'); } catch (e) {}
    }
    if (navn) {
      document.querySelectorAll('.bakerinavn').forEach(function (el) {
        el.textContent = navn;
      });
      document.title = document.title.replace(/Ditt Bakeri/g, navn);
    }
  } catch (e) { /* eldre nettlesere: behold standardnavn */ }

  // 1) Avslør elementer når de scrolles inn i visning
  var revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealTargets.length) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: vis alt hvis IntersectionObserver ikke støttes
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // 2) Gjør den gjennomsiktige heroen-headeren solid når man scroller
  var header = document.querySelector('header.over-hero');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 60) {
        header.classList.add('is-solid');
      } else {
        header.classList.remove('is-solid');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3) Myk scroll til toppen når man klikker logo/navn og allerede er på forsiden.
  //    På andre sider oppfører lenka seg normalt (navigerer til index.html).
  var brand = document.querySelector('a.brand');
  if (brand) {
    var sti = window.location.pathname;
    var paaForsiden = sti.endsWith('/') || sti.endsWith('/index.html') || sti === '/index.html';
    if (paaForsiden) {
      brand.addEventListener('click', function (e) {
        e.preventDefault();
        var reduser = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduser ? 'auto' : 'smooth' });
      });
    }
  }
});
