/* ============================================================
   PŘÍBĚH BALÍČKU KARET – script.js
   6 interaktivních miniher + navigace + progress bar + lightbox
   ============================================================ */

'use strict';

/* ── GLOBAL SCORE ─────────────────────────────────────────── */
let totalScore = 0;
function addScore(pts) {
  totalScore += pts;
  const el = document.getElementById('score-value');
  if (el) {
    el.textContent = totalScore;
    el.closest('#score-panel').style.transform = 'scale(1.15)';
    setTimeout(() => { el.closest('#score-panel').style.transform = ''; }, 300);
  }
}

/* ── PROGRESS BAR ─────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct.toFixed(1) + '%';
  }, { passive: true });
}

/* ── ACTIVE NAV ───────────────────────────────────────────── */
function initActiveNav() {
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  const chapters = document.querySelectorAll('.chapter');
  if (!links.length || !chapters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  chapters.forEach(ch => observer.observe(ch));
}

/* ── LIGHTBOX ─────────────────────────────────────────────── */
function openLightbox(src, alt) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Zavřít">✕</button>
      <img src="${src}" alt="${alt}">
    </div>`;
  overlay.querySelector('.lightbox-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  const escFn = e => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escFn); } };
  document.addEventListener('keydown', escFn);
  document.body.appendChild(overlay);
}

function initLightboxes() {
  document.querySelectorAll('.archive-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
    wrap.setAttribute('tabindex', '0');
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') wrap.click(); });
  });
}

/* ══════════════════════════════════════════════════════════
   ÚKOL 1 – SPOJOVAČKA (13 karet ↔ 13 významů)
   ══════════════════════════════════════════════════════════ */
function initTask1() {
  const container = document.getElementById('task1');
  if (!container) return;

  const pairs = [
    { card: 'Eso ♠',       meaning: 'Jediný Bůh' },
    { card: 'Dvojka ♥',    meaning: 'Otec a Syn' },
    { card: 'Trojka ♣',    meaning: 'Otec, Syn a Duch svatý' },
    { card: 'Čtyřka ♦',   meaning: 'Čtyři evangelisté (Matouš, Marek, Lukáš, Jan)' },
    { card: 'Pětka ♠',     meaning: 'Pět moudrých panen s lampami' },
    { card: 'Šestka ♥',   meaning: 'Šest dní stvoření světa' },
    { card: 'Sedmička ♣', meaning: 'Sedmý den odpočinku a posvěcení' },
    { card: 'Osmička ♦',  meaning: 'Osm zachráněných při potopě (Noe, žena, 3 synové, jejich ženy)' },
    { card: 'Devítka ♠',  meaning: 'Devět malomocných uzdravených Spasitelem' },
    { card: 'Desítka ♥',  meaning: 'Desatero Božích přikázání' },
    { card: 'Kluk ♣',     meaning: 'Největší darebák – městský seržant (knave = darebák)' },
    { card: 'Královna ♦', meaning: 'Královna ze Sáby (a královna Viktorie)' },
    { card: 'Král ♠',     meaning: 'Velký Král nebes i země – Bůh všemohoucí' },
  ];

  // Shuffle helper
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const shuffledCards    = shuffle(pairs.map((p, i) => ({ ...p, idx: i })));
  const shuffledMeanings = shuffle(pairs.map((p, i) => ({ ...p, idx: i })));

  const cardsCol    = container.querySelector('#match-cards');
  const meaningsCol = container.querySelector('#match-meanings');
  const progressEl  = container.querySelector('.match-progress');
  const resultEl    = document.getElementById('task1-result');

  let selectedCard = null;
  let matchedCount = 0;
  let attempts     = 0;
  const task1Scored = new Set();

  function updateProgress() {
    if (progressEl) progressEl.textContent = `Spárováno: ${matchedCount} / 13`;
  }
  updateProgress();

  function renderItems(col, items, side) {
    col.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'match-item';
      div.dataset.idx  = item.idx;
      div.dataset.side = side;
      div.textContent  = side === 'card' ? item.card : item.meaning;
      col.appendChild(div);
    });
  }

  renderItems(cardsCol,    shuffledCards,    'card');
  renderItems(meaningsCol, shuffledMeanings, 'meaning');

  container.addEventListener('click', e => {
    const item = e.target.closest('.match-item');
    if (!item || item.classList.contains('matched')) return;

    const side = item.dataset.side;
    const idx  = parseInt(item.dataset.idx, 10);

    if (side === 'card') {
      // Deselect previous card selection
      container.querySelectorAll('.match-item[data-side="card"].selected')
        .forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      selectedCard = { el: item, idx };
    } else if (side === 'meaning' && selectedCard !== null) {
      attempts++;
      if (selectedCard.idx === idx) {
        // Correct match
        item.classList.add('matched');
        selectedCard.el.classList.remove('selected');
        selectedCard.el.classList.add('matched');
        matchedCount++;
        if (!task1Scored.has(idx)) { task1Scored.add(idx); addScore(1); }
        selectedCard = null;
        updateProgress();
        if (matchedCount === 13) {
          resultEl.className = 'task-result success';
          resultEl.textContent = `🎉 Výborně! Všech 13 karet správně spárováno za ${attempts} pokusů. Voják by byl hrdý!`;
        }
      } else {
        // Wrong match
        item.classList.add('wrong-flash');
        selectedCard.el.classList.add('wrong-flash');
        selectedCard.el.classList.remove('selected');
        setTimeout(() => {
          item.classList.remove('wrong-flash');
          selectedCard && selectedCard.el.classList.remove('wrong-flash');
        }, 550);
        selectedCard = null;
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   ÚKOL 2 – ČÍSELNÝ ZÁMEK (365 | 52 | 13)
   ══════════════════════════════════════════════════════════ */
function initTask2() {
  const container = document.getElementById('task2');
  if (!container) return;

  const CORRECT = [365, 52, 13];
  const inputs  = container.querySelectorAll('.digit-input');
  const btn     = container.querySelector('#unlock-btn');
  const resultEl = document.getElementById('task2-result');
  let scored = false;

  container.querySelectorAll('.digit-up').forEach((upBtn, i) => {
    upBtn.addEventListener('click', () => {
      let v = parseInt(inputs[i].value, 10) || 0;
      inputs[i].value = Math.min(v + 1, 999);
    });
  });
  container.querySelectorAll('.digit-down').forEach((downBtn, i) => {
    downBtn.addEventListener('click', () => {
      let v = parseInt(inputs[i].value, 10) || 0;
      inputs[i].value = Math.max(v - 1, 0);
    });
  });

  btn.addEventListener('click', () => {
    const vals = Array.from(inputs).map(inp => parseInt(inp.value, 10) || 0);
    const ok   = vals.every((v, i) => v === CORRECT[i]);

    if (ok) {
      resultEl.className = 'task-result success';
      resultEl.textContent = '🔓 Výborně! Celý balíček tak vojákovi nahrazuje Bibli, věčný kalendář (Almanack), modlitební knížku i samotné hrací karty.';
      btn.textContent = '🔓 Odemčeno!';
      btn.disabled = true;
      if (!scored) { scored = true; addScore(5); }
    } else {
      resultEl.className = 'task-result error';
      const hints = vals.map((v, i) => {
        if (v === CORRECT[i]) return '✓';
        return v < CORRECT[i] ? '↑ více' : '↓ méně';
      });
      resultEl.textContent = `❌ Zkus znovu. Nápověda: pole 1 ${hints[0]}, pole 2 ${hints[1]}, pole 3 ${hints[2]}.`;
      const lockDisp = container.querySelector('.lock-display');
      lockDisp.classList.add('lock-shake');
      setTimeout(() => lockDisp.classList.remove('lock-shake'), 420);
    }
  });

  // Allow Enter key
  inputs.forEach(inp => {
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  });
}

/* ══════════════════════════════════════════════════════════
   ÚKOL 3 – TŘÍDICÍ KVÍZ (Anglie vs. Německo)
   ══════════════════════════════════════════════════════════ */
function initTask3() {
  const container = document.getElementById('task3');
  if (!container) return;

  const items = [
    { text: 'Královna ze Sáby', correct: 'eng' },
    { text: 'Starosta v Glasgow', correct: 'eng' },
    { text: '13 lunárních měsíců', correct: 'eng' },
    { text: 'Odměna: chléb, sýr a pivo', correct: 'eng' },
    { text: 'Pět ran Kristových a Panna Maria', correct: 'ger' },
    { text: 'Hrozba trestu: běh uličkou', correct: 'ger' },
    { text: 'Výklad barev (kříže, piky, kára, srdce)', correct: 'ger' },
    { text: "Udavač označen bohemismem 'Stwerack'", correct: 'ger' },
  ];

  const pool    = container.querySelector('#sort-pool');
  const engCol  = container.querySelector('#sort-eng .sort-items');
  const gerCol  = container.querySelector('#sort-ger .sort-items');
  const checkBtn = container.querySelector('#check-sort-btn');
  const resultEl = document.getElementById('task3-result');
  let task3Scored = false;

  // Shuffle & render pool
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let selectedChip = null;

  function renderPool() {
    pool.innerHTML = '';
    shuffle(items).forEach((item, i) => {
      const chip = document.createElement('div');
      chip.className = 'sortable-chip';
      chip.dataset.correct = item.correct;
      chip.dataset.i = i;
      chip.textContent = item.text;
      pool.appendChild(chip);
    });
  }
  renderPool();

  function getChipInCols() {
    return [...engCol.querySelectorAll('.sortable-chip'), ...gerCol.querySelectorAll('.sortable-chip')];
  }

  container.addEventListener('click', e => {
    const chip = e.target.closest('.sortable-chip');
    if (!chip || chip.classList.contains('correct') || chip.classList.contains('incorrect')) return;

    if (chip.closest('#sort-pool') || chip.closest('.sort-items')) {
      // If a chip is already selected
      if (selectedChip && selectedChip !== chip) {
        selectedChip.classList.remove('selected');
      }
      if (selectedChip === chip) {
        chip.classList.remove('selected');
        selectedChip = null;
      } else {
        chip.classList.add('selected');
        selectedChip = chip;
      }
    }
  });

  // Click on column target areas
  container.querySelector('#sort-eng').addEventListener('click', e => {
    if (!e.target.closest('.sortable-chip') && selectedChip && selectedChip.closest('#sort-pool')) {
      selectedChip.classList.remove('selected');
      engCol.appendChild(selectedChip);
      selectedChip = null;
    } else if (selectedChip && selectedChip.closest('.sort-items')) {
      // Move between columns
      const inEng = engCol.contains(selectedChip);
      if (!inEng && !e.target.closest('.sortable-chip')) {
        selectedChip.classList.remove('selected');
        engCol.appendChild(selectedChip);
        selectedChip = null;
      }
    }
  });
  container.querySelector('#sort-ger').addEventListener('click', e => {
    if (!e.target.closest('.sortable-chip') && selectedChip && selectedChip.closest('#sort-pool')) {
      selectedChip.classList.remove('selected');
      gerCol.appendChild(selectedChip);
      selectedChip = null;
    } else if (selectedChip && selectedChip.closest('.sort-items')) {
      const inGer = gerCol.contains(selectedChip);
      if (!inGer && !e.target.closest('.sortable-chip')) {
        selectedChip.classList.remove('selected');
        gerCol.appendChild(selectedChip);
        selectedChip = null;
      }
    }
  });

  // Click chip in column → move back to pool
  [engCol, gerCol].forEach(col => {
    col.addEventListener('click', e => {
      const chip = e.target.closest('.sortable-chip');
      if (chip && !chip.classList.contains('correct') && !chip.classList.contains('incorrect')) {
        if (selectedChip === chip) {
          chip.classList.remove('selected');
          selectedChip = null;
          pool.appendChild(chip);
        }
      }
    });
  });

  checkBtn.addEventListener('click', () => {
    const engChips = [...engCol.querySelectorAll('.sortable-chip')];
    const gerChips = [...gerCol.querySelectorAll('.sortable-chip')];
    const allPlaced = engChips.length + gerChips.length;

    if (allPlaced < 8) {
      resultEl.className = 'task-result info';
      resultEl.textContent = 'Přetáhni všechny kartičky do sloupců a pak zkontroluj.';
      return;
    }

    let correct = 0;
    engChips.forEach(chip => {
      if (chip.dataset.correct === 'eng') { chip.classList.add('correct'); correct++; }
      else chip.classList.add('incorrect');
    });
    gerChips.forEach(chip => {
      if (chip.dataset.correct === 'ger') { chip.classList.add('correct'); correct++; }
      else chip.classList.add('incorrect');
    });

    if (!task3Scored) { task3Scored = true; addScore(correct); }

    if (correct === 8) {
      resultEl.className = 'task-result success';
      resultEl.textContent = `🎉 Perfektní! Všech 8 pojmů správně zařazeno. Text se při přechodu z Anglie do střední Evropy výrazně proměnil!`;
    } else {
      resultEl.className = 'task-result error';
      resultEl.textContent = `${correct} / 8 správně. Červeně označené pojmy jsou špatně – zkus je přesunout.`;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   ÚKOL 4 – JAZYKOVÝ DETEKTOR (Germanismy)
   ══════════════════════════════════════════════════════════ */
function initTask4() {
  const container = document.getElementById('task4');
  if (!container) return;

  const resultEl     = document.getElementById('task4-result');
  const countDisplay = container.querySelector('#found-count');
  const TOTAL_UNIQUE = 4;
  const foundGroups  = new Set();

  // Show tooltip near word
  const tooltipBox = document.getElementById('g-tooltip-box');

  container.querySelectorAll('.g-word').forEach(word => {
    // Hover tooltip
    word.addEventListener('mouseenter', () => {
      if (!word.classList.contains('clicked')) {
        word.title = word.dataset.tip;
      }
    });

    word.addEventListener('click', () => {
      const groupId = word.dataset.group;
      const tip     = word.dataset.tip;
      const already = foundGroups.has(groupId);

      // Mark ALL words in the same group
      container.querySelectorAll(`.g-word[data-group="${groupId}"]`)
        .forEach(w => w.classList.add('clicked'));

      if (!already) {
        foundGroups.add(groupId);
        addScore(2);
      }

      const found = foundGroups.size;
      if (countDisplay) countDisplay.textContent = found;

      // Show explanation below the text
      const expId = 'exp-' + groupId;
      let expEl = document.getElementById(expId);
      if (!expEl) {
        expEl = document.createElement('div');
        expEl.id = expId;
        expEl.style.cssText = 'margin:0.3rem 0;padding:0.4rem 0.75rem;background:rgba(44,74,30,0.1);border-left:3px solid #2c4a1e;border-radius:4px;font-size:0.85rem;font-style:normal;';
        expEl.innerHTML = '✅ <strong>' + tip.split('=')[0].trim() + '</strong> = ' + (tip.includes('=') ? tip.split('=').slice(1).join('=').trim() : tip);
        const detectorText = container.querySelector('.detector-text');
        if (detectorText && detectorText.parentNode) {
          detectorText.parentNode.insertBefore(expEl, detectorText.nextSibling);
        }
      }

      if (found === TOTAL_UNIQUE) {
        resultEl.className = 'task-result success';
        resultEl.textContent = '🎉 Skvěle! Všechny 4 germanismy nalezeny. Tento text prozrazuje, že byl vytvořen v prostředí habsburské armády habsburské monarchie!';
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   ÚKOL 5 – SROVNÁVACÍ PŘIŘAZOVAČKA (tabulka 4×3)
   ══════════════════════════════════════════════════════════ */
function initTask5() {
  const container = document.getElementById('task5');
  if (!container) return;

  const resultEl = document.getElementById('task5-result');
  const pool     = container.querySelector('#compare-pool');
  let selectedChip = null;
  let placedCount  = 0;
  let task5Scored  = false;

  // Data: each chip has a cellKey (row-col)
  const chips = [
    { text: 'Dvojí podstata Krista (Božství a Člověčenství)', cell: 'dvojka-trnka' },
    { text: 'Dvě části Bible (Starý a Nový zákon)', cell: 'dvojka-cerny' },
    { text: '2 vozy tramvaje = dvě milované ženy', cell: 'dvojka-tramvaj' },
    { text: 'Svaté mateřiny a Matka Boží pod křížem', cell: 'kralovna-trnka' },
    { text: 'Blahoslavená Panna Maria', cell: 'kralovna-cerny' },
    { text: 'Zastoupena samotným řidičem D. Taxisem Tramwayem', cell: 'kralovna-tramvaj' },
    { text: 'Křížový schorek = udavač; ostatní tři = Pilátovi kati a strážní', cell: 'kluk-trnka' },
    { text: 'Ďábel (všechny spodky dohromady)', cell: 'kluk-cerny' },
    { text: 'Šašek (jedna z rolí řidiče tramvaje)', cell: 'kluk-tramvaj' },
    { text: "Švejkovské přiznání: 'Byla to velká práce, bych trestu ušel!'", cell: 'pointa-trnka' },
    { text: "Vážné potvrzení: 'Ten voják se jmenoval T. Taxis Taylor.'", cell: 'pointa-cerny' },
    { text: 'Absurdní výpočet cinknutí mezi Braníkem a Palmovkou', cell: 'pointa-tramvaj' },
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Render pool
  function renderPool() {
    pool.innerHTML = '';
    shuffle(chips).forEach(chip => {
      const div = document.createElement('div');
      div.className = 'compare-chip';
      div.dataset.cell = chip.cell;
      div.textContent  = chip.text;
      pool.appendChild(div);
    });
  }
  renderPool();

  // Pool chip selection
  pool.addEventListener('click', e => {
    const chip = e.target.closest('.compare-chip');
    if (!chip || chip.classList.contains('placed')) return;
    if (selectedChip === chip) {
      chip.classList.remove('selected');
      selectedChip = null;
    } else {
      if (selectedChip) selectedChip.classList.remove('selected');
      chip.classList.add('selected');
      selectedChip = chip;
    }
  });

  // Cell click
  container.querySelectorAll('.compare-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      if (!selectedChip || cell.classList.contains('filled')) return;
      const chipCell = selectedChip.dataset.cell;
      const tgtCell  = cell.dataset.cell;

      // Place chip text in cell
      cell.textContent = selectedChip.textContent;
      cell.classList.add('filled');
      cell.dataset.placed = chipCell;

      // Mark correct / wrong immediately
      if (chipCell === tgtCell) {
        cell.classList.add('correct-fill');
        if (!task5Scored) addScore(1);
        placedCount++;
      } else {
        cell.classList.add('wrong-fill');
      }

      // Mark pool chip as placed
      selectedChip.classList.add('placed');
      selectedChip.classList.remove('selected');
      selectedChip = null;

      if (placedCount === 12) {
        task5Scored = true;
        resultEl.className = 'task-result success';
        resultEl.textContent = '🎉 Skvělé! Všechna políčka správně přiřazena. Zajímavost: Miroslav Černý v roce 1969 propašoval katolickou Pannu Marii tam, kde protestantský originál žádnou Pannu Marii nemá!';
      }
    });
  });

  // Reset button
  const resetBtn = container.querySelector('#reset-compare-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      container.querySelectorAll('.compare-cell').forEach(cell => {
        cell.textContent = '—';
        cell.className   = 'compare-cell';
        cell.dataset.placed = '';
      });
      placedCount  = 0;
      selectedChip = null;
      task5Scored  = false;
      resultEl.className = 'task-result';
      resultEl.style.display = 'none';
      renderPool();
    });
  }
}

/* ══════════════════════════════════════════════════════════
   ÚKOL 6 – ZÁVĚREČNÝ ABC KVÍZ
   ══════════════════════════════════════════════════════════ */
function initTask6() {
  const container = document.getElementById('task6');
  if (!container) return;

  const questions = [
    {
      q: 'Jak se mění postava vojáka v posledních třech větách rukopisu Johana Trnky (1850) oproti německému tisku z roku 1821?',
      opts: [
        'A) Voják na konci prosí o odpuštění a vstoupí do kláštera.',
        'B) Ze zbožného vojáka se stává „chytrý šibal", který se přizná, že si výklad vymyslel jen proto, aby unikl trestu.',
        'C) Voják odmítne odměnu od majora a obviní ho z nespravedlnosti.',
      ],
      correct: 1,
      feedback: 'Správně! Závěrečná věta „To si můžete, bratři, pomyslit, že to byla velká práce..." odhaluje švejkovskou pointu – zbožný výklad byl vychytralou záminkou, jak uniknout trestu.',
    },
    {
      q: 'Na jakém principu staví skupina Tři sestry parodii Tramvaj?',
      opts: [
        'A) Paroduje strukturu numerické alegorie a absurdní matematiky – místo karet a Boha jsou tu tramvajové nápravy a závod Formule 1 v Burkině Faso.',
        'B) Přebírá doslovný biblický výklad karet, ale mění hudební doprovod na punkový rytmus.',
        'C) Vypráví skutečný příběh řidiče pražské tramvaje, který v 90. letech vyhrál závod Formule 1.',
      ],
      correct: 0,
      feedback: 'Přesně tak! Tři sestry zachovávají strukturu (numerická alegorie + důvěrná zpověď + absurdní závěr), ale posvátný prostor kostela nahrazují závodní tratí a tramvajovým okruhem.',
    },
    {
      q: "Proč v písni Balíček karet (1969) figuruje jméno „T. Taxis Taylor"?",
      opts: [
        'A) Jde o skutečného českého legionáře z první světové války.',
        'B) Jde o smyšlené jméno, které vymyslel Lou Fanánek Hagen pro kapelu Tři sestry.',
        'C) Jde o zkomoleninu jména amerického country zpěváka T. Texase Tylera, která se ustálila vlivem ústního šíření (jako kdysi kramářské písně).',
      ],
      correct: 2,
      feedback: 'Správně! Jméno T. Texas Tyler se při opisování a ústním podání zdeformovalo na „T. Taxis Taylor" – stejným mechanismem, jakým se kdysi šířily kramářské písně.',
    },
  ];

  let quizScore = 0;
  let answered  = 0;
  let quiz6Scored = false;

  questions.forEach((q, qi) => {
    const block = container.querySelector(`#quiz-q${qi + 1}`);
    if (!block) return;
    const optEls = block.querySelectorAll('.quiz-option');
    const fb     = block.querySelector('.quiz-feedback');

    optEls.forEach((optEl, oi) => {
      optEl.addEventListener('click', () => {
        if (block.dataset.answered) return;
        block.dataset.answered = '1';
        answered++;

        optEls.forEach(el => el.classList.add('answered'));

        if (oi === q.correct) {
          optEl.classList.add('correct');
          quizScore++;
          if (!quiz6Scored) addScore(5);
          fb.className = 'quiz-feedback show correct-fb';
        } else {
          optEl.classList.add('incorrect');
          optEls[q.correct].classList.add('revealed');
          fb.className = 'quiz-feedback show wrong-fb';
        }
        fb.textContent = q.feedback;

        if (answered === questions.length) {
          const finalEl = container.querySelector('#quiz-final');
          const scoreDisp = container.querySelector('#quiz-score-display');
          if (finalEl) {
            finalEl.style.display = 'block';
            scoreDisp.textContent = `${quizScore} / ${questions.length}`;
            const msgs = [
              'Příběh balíčku karet ti zatím odolal. Přečti si kapitoly znovu!',
              'Dobrý pokus! Voják by z tebe byl spokojený šikovatel.',
              'Výborně! Jsi pravý příběhový detektiv – jako Richard Middleton.',
            ];
            finalEl.querySelector('#quiz-verdict').textContent = msgs[quizScore];
            quiz6Scored = true;
          }
        }
      });
    });
  });
}

/* ── INIT ALL ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initActiveNav();
  initLightboxes();
  initTask1();
  initTask2();
  initTask3();
  initTask4();
  initTask5();
  initTask6();
});
