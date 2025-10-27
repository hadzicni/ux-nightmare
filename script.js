// Absichtlich nervige Interaktionen, Popups, Fehlverhalten und Cursor-Spielereien

(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Fake Loader: läuft endlos und tut nichts
  function startFakeLoader() {
    const bar = document.querySelector('#fake-loader .bar');
    if (!bar) return;
    let w = 1;
    setInterval(() => {
      w += Math.random() * 9;
      if (w > 99) w = 1;
      bar.style.width = w + '%';
    }, 200);
  }

  // Buttons tun nicht, was sie sagen
  function wireBadButtons() {
    const buy = $('#buy-btn');
    if (buy) {
      buy.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Danke für NICHTS! Dieser Button macht gar nichts.');
        if (confirm('Bist du sicher, dass du sicher bist?')) {
          prompt('Warum hast du auf JETZT KAUFEN geklickt?', 'Keine Ahnung');
        }
      });
    }
  }

  // Navigation macht verwirrende Dinge
  function wireBadNav() {
    const home = $('#nav-home');
    const about = $('#nav-about');
    const contact = $('#nav-contact');
    const surprise = $('#nav-surprise');

    if (home) {
      home.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Willkommen zuhause... NICHT!');
      });
    }
    if (about) {
      about.addEventListener('click', (e) => {
        e.preventDefault();
        const a = confirm('Willst du mehr erfahren?');
        const b = confirm('Wirklich? Ganz sicher?');
        if (a && b) {
          window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 9999, behavior: 'smooth' });
        }
      });
    }
    if (contact) {
      contact.addEventListener('click', (e) => {
        e.preventDefault();
        setTimeout(() => alert('Kontakt? Später vielleicht.'), 200);
        setTimeout(() => alert('Immer noch später...'), 1000);
        setTimeout(() => alert('Okay, nie. Bye.'), 1800);
      });
    }
    if (surprise) {
      surprise.addEventListener('click', (e) => {
        e.preventDefault();
        annoyingBeep(440, 0.3);
        alert('ÜBERRASCHUNG!');
        setTimeout(() => confirm('Noch eine Überraschung?'), 300);
        setTimeout(() => prompt('Bewerte diese Seite (1-10)?', '11'), 600);
      });
    }

    // Erzeuge absichtlich überlappende, duplizierte Navigation
    const nav = document.getElementById('main-nav');
    if (nav) {
      const clone = nav.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.top = '80px';
      clone.style.left = '40px';
      clone.style.zIndex = '9998';
      clone.style.opacity = '0.7';
      document.body.appendChild(clone);
    }
  }

  // Cursor flieht bei Hover über einen Button
  function wireRunawayButton() {
    const btn = $('#runaway');
    if (!btn) return;
    const moveRandom = () => {
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const x = Math.max(0, Math.floor(Math.random() * (vw - btn.offsetWidth)));
      const y = Math.max(0, Math.floor(Math.random() * (vh - btn.offsetHeight)));
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
    };
    btn.style.position = 'fixed';
    btn.addEventListener('mouseenter', () => {
      annoyingBeep(880, 0.08);
      moveRandom();
      document.body.style.cursor = 'none';
      setTimeout(() => (document.body.style.cursor = 'progress'), 200);
      setTimeout(() => (document.body.style.cursor = 'crosshair'), 800);
    });
    // auch bei Fokus versuchen zu fliehen
    btn.addEventListener('focus', moveRandom);
  }

  // Regelmässige nervige Popups
  function startRandomPopups() {
    const messages = [
      'Bist du noch da?',
      'Diese Seite lädt gleich schneller. Versprochen!',
      'Klick doch mal irgendwo hin!',
      'Fehler 200: Alles okay, aber fühlt sich falsch an.',
      'Hinweis: Es gibt hier keine Hinweise.',
    ];
    setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      alert(msg);
    }, 12000);
  }

  // Beep-Sound via WebAudio (ohne externe Assets)
  let audioCtx;
  function annoyingBeep(freq = 440, dur = 0.15) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.value = 0.03;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      setTimeout(() => o.stop(), dur * 1000);
    } catch {}
  }

  // Spielt Sounds bei jedem Klick auf der Seite
  function clickBeep() {
    document.addEventListener('click', () => {
      annoyingBeep(330 + Math.random() * 660, 0.05 + Math.random() * 0.1);
    });
  }

  // Navigation bewegt sich zufällig zusätzlich
  function jitterNav() {
    const navs = $$('.nav');
    setInterval(() => {
      navs.forEach((n) => {
        n.style.marginLeft = Math.round(Math.random() * 20 - 10) + 'px';
        n.style.marginTop = Math.round(Math.random() * 6 - 3) + 'px';
      });
    }, 500);
  }

  // Initialisiert alle nervigen Effekte
  function initBadSite() {
    startFakeLoader();
    wireBadButtons();
    wireBadNav();
    wireRunawayButton();
    startRandomPopups();
    clickBeep();
    jitterNav();
  }

  // Epilepsie-Warnung anzeigen und erst nach Zustimmung starten
  function createEpilepsyWarning() {
    const overlay = document.createElement('div');
    overlay.className = 'epilepsy-overlay';
    overlay.innerHTML = `
      <div class="epilepsy-modal">
        <h3>Epilepsie-Warnung</h3>
        <p>Diese Seite enthält blinkende Lichter, schnelle Animationen und starke Farbkontraste.</p>
        <p>Wenn du empfindlich auf solche Effekte reagierst, verlasse die Seite jetzt.</p>
        <div class="epilepsy-actions">
          <button class="epilepsy-btn" id="warn-continue">Weiter</button>
          <button class="epilepsy-btn" id="warn-leave">Zurück</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Professional black modal content
    overlay.innerHTML = `
      <div class="epilepsy-modal">
        <h3>Epilepsie-Warnung</h3>
        <p>Diese Seite enthält blinkende Lichter, schnelle Animationen und starke Farbkontraste.</p>
        <p>Wenn du zu fotosensitiver Epilepsie neigst oder dich unwohl fühlst, verlasse bitte die Seite.</p>
        <p>Mit Klick auf "Weiter" bestätigst du, dass du fortfahren möchtest. Alle Effekte werden dann aktiviert.</p>
        <div class="epilepsy-actions">
          <button class="epilepsy-btn" id="warn-leave">Seite verlassen</button>
          <button class="epilepsy-btn" id="warn-continue">Weiter</button>
        </div>
      </div>
    `;

    const accept = overlay.querySelector('#warn-continue');
    const leave = overlay.querySelector('#warn-leave');

    accept.addEventListener('click', () => {
      document.body.classList.remove('suspend-animations');
      overlay.remove();
      initBadSite();
    });

    leave.addEventListener('click', () => {
      try {
        if (history.length > 1) {
          history.back();
        } else {
          window.location.href = 'about:blank';
        }
      } catch {
        alert('Bitte verlasse die Seite, wenn du empfindlich reagierst.');
      }
    });
  }

  // Starte mit Warnung
  window.addEventListener('DOMContentLoaded', () => {
    createEpilepsyWarning();
  });
})();
