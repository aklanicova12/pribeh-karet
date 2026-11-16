/* ============================================================
   PŘÍBĚH BALÍČKU KARET – script.js
   Kompletní logika pro všech 6 interaktivních miniher
   + navigace + progress bar + lightbox
   ============================================================ */

'use strict';

/* ── SCORE TRACKING ───────────────────────────────────────── */
const TaskScores = {
  task1: 0, // max 13 (1 per pair)
  task2: 0, // max 5
  task3: 0, // max 8
  task4: 0, // max 8 (2 per germanism)
  task5: 0, // max 12
  task6: 0  // max 15 (5 per question)
};

function updateGlobalScoreDisplay() {
  const total = Object.values(TaskScores).reduce((a, b) => a + b, 0);
  const el = document.getElementById('score-value');
  const panel = document.getElementById('score-panel');
  if (el) {
    el.textContent = total;
  }
  if (panel) {
    panel.style.transform = 'scale(1.15)';
    setTimeout(() => { panel.style.transform = ''; }, 250);
  }
}

/* ── PROGRESS BAR ─────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const updateBar = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)).toFixed(1) + '%';
  };
  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/* ── ACTIVE NAVIGATION ────────────────────────────────────── */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const chapters = document.querySelectorAll('.chapter');
  if (!links.length || !chapters.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = '';
    chapters.forEach(ch => {
      const top = ch.offsetTop;
      const height = ch.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = ch.id;
      }
    });
    if (!currentId && window.scrollY < 200 && chapters[0]) {
      currentId = chapters[0].id;
    }
    links.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === '#' + currentId);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── LIGHTBOX ─────────────────────────────────────────────── */
function openLightbox(src, alt) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div class="lightbox-content">
      <button type="button" class="lightbox-close" aria-label="Zavřít zvětšený náhled">✕</button>
      <img src="${src}" alt="${alt}">
    </div>`;

  const close = () => {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
  };
  const onKey = e => {
    if (e.key === 'Escape') close();
  };

  overlay.querySelector('.lightbox-close').addEventListener('click', close);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
}

function initLightboxes() {
  document.querySelectorAll('.archive-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
    wrap.setAttribute('tabindex', '0');
    wrap.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        wrap.click();
      }
    });
  });
}

/* ── UTILITY: SHUFFLE ─────────────────────────────────────── */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ════════════════════════════════════════════════════════════
   ÚKOL 1: SPOJOVAČKA – DUCHOVNÍ A BIBLICKÝ VÝZNAM KARET
   ════════════════════════════════════════════════════════════ */
function initTask1() {
  const container = document.getElementById('task1');
  if (!container) return;

  const CARDS_DATA = [
    { id: 1,  name: 'Eso (Ace) ♠',       meaning: 'Jediný Bůh (one God only)' },
    { id: 2,  name: 'Dvojka (Deuce) ♥',    meaning: 'Otec a Syn (the Father and the Son)' },
    { id: 3,  name: 'Trojka (Trey) ♣',    meaning: 'Otec, Syn a Duch svatý (the Father, Son, and Holy Ghost)' },
    { id: 4,  name: 'Čtyřka (Four) ♦',   meaning: 'Čtyři evangelisté – Matouš, Marek, Lukáš a Jan' },
    { id: 5,  name: 'Pětka (Five) ♠',     meaning: 'Pět moudrých panen s lampami (z celkových deseti)' },
    { id: 6,  name: 'Šestka (Six) ♥',   meaning: 'Šest dní, v nichž Pán stvořil nebe a zemi' },
    { id: 7,  name: 'Sedmička (Seven) ♣', meaning: 'Sedmý den, kdy Bůh odpočinul od díla a posvětil jej' },
    { id: 8,  name: 'Osmička (Eight) ♦',  meaning: 'Osm spravedlivých osob zachráněných v arše před potopou' },
    { id: 9,  name: 'Devítka (Nine) ♠',  meaning: 'Devět malomocných, které Spasitel uzdravil (nepoděkovali)' },
    { id: 10, name: 'Desítka (Ten) ♥',  meaning: 'Desatero Božích přikázání, jež Bůh dal Mojžíšovi na hoře Sinaj' },
    { id: 11, name: 'Kluk (Knave) ♣',     meaning: 'Odložen jako darebák – označuje městského seržanta (knave)' },
    { id: 12, name: 'Královna (Queen) ♦', meaning: 'Královna ze Sáby (a v mladším tisku britská královna Viktorie)' },
    { id: 13, name: 'Král (King) ♠',     meaning: 'Velký Král nebes i země, Bůh všemohoucí' },
  ];

  const cardsContainer = document.getElementById('match-cards');
  const meaningsContainer = document.getElementById('match-meanings');
  const progressEl = document.getElementById('task1-progress');
  const resultEl = document.getElementById('task1-result');
  const resetBtn = document.getElementById('reset-task1-btn');

  let selectedItem = null; // { el, type: 'card'|'meaning', id }
  let matchedCount = 0;
  let isChecking = false;

  function updateProgress() {
    if (progressEl) {
      progressEl.innerHTML = `Spárováno: <strong>${matchedCount}</strong> / 13`;
    }
  }

  function renderGame() {
    selectedItem = null;
    matchedCount = 0;
    isChecking = false;
    updateProgress();

    if (resultEl) {
      resultEl.className = 'task-result';
      resultEl.style.display = 'none';
      resultEl.textContent = '';
    }

    cardsContainer.innerHTML = '';
    meaningsContainer.innerHTML = '';

    // Left: all 13 cards in natural order 1..13
    CARDS_DATA.forEach(card => {
      const el = document.createElement('div');
      el.className = 'match-item';
      el.dataset.id = card.id;
      el.dataset.type = 'card';
      el.textContent = card.name;
      cardsContainer.appendChild(el);
    });

    // Right: 13 meanings shuffled
    const shuffledMeanings = shuffleArray(CARDS_DATA);
    shuffledMeanings.forEach(item => {
      const el = document.createElement('div');
      el.className = 'match-item';
      el.dataset.id = item.id;
      el.dataset.type = 'meaning';
      el.textContent = item.meaning;
      meaningsContainer.appendChild(el);
    });
  }

  container.addEventListener('click', e => {
    const item = e.target.closest('.match-item');
    if (!item || item.classList.contains('matched') || isChecking) return;

    const id = parseInt(item.dataset.id, 10);
    const type = item.dataset.type;

    // First click
    if (!selectedItem) {
      item.classList.add('selected');
      selectedItem = { el: item, type, id };
      return;
    }

    // Clicked the exact same element -> deselect
    if (selectedItem.el === item) {
      item.classList.remove('selected');
      selectedItem = null;
      return;
    }

    // Clicked another element of the SAME type (e.g. card then another card)
    if (selectedItem.type === type) {
      selectedItem.el.classList.remove('selected');
      item.classList.add('selected');
      selectedItem = { el: item, type, id };
      return;
    }

    // Clicked opposite type (card + meaning) -> Evaluate pair!
    const firstEl = selectedItem.el;
    const secondEl = item;
    const isCorrect = selectedItem.id === id;

    if (isCorrect) {
      firstEl.classList.remove('selected');
      firstEl.classList.add('matched');
      secondEl.classList.add('matched');
      selectedItem = null;
      matchedCount++;
      TaskScores.task1 = matchedCount;
      updateGlobalScoreDisplay();
      updateProgress();

      if (matchedCount === CARDS_DATA.length) {
        if (resultEl) {
          resultEl.className = 'task-result success';
          resultEl.innerHTML = '🎉 <strong>Výborně!</strong> Všech 13 karet a jejich biblických významů je správně spárováno. Získáváš 13 bodů!';
        }
      }
    } else {
      isChecking = true;
      firstEl.classList.add('wrong-flash');
      secondEl.classList.add('wrong-flash');
      setTimeout(() => {
        firstEl.classList.remove('selected', 'wrong-flash');
        secondEl.classList.remove('wrong-flash');
        selectedItem = null;
        isChecking = false;
      }, 550);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', renderGame);
  }

  renderGame();
}

/* ════════════════════════════════════════════════════════════
   ÚKOL 2: ČÍSELNÝ ZÁMEK (365 – 52 – 13)
   ════════════════════════════════════════════════════════════ */
function initTask2() {
  const container = document.getElementById('task2');
  if (!container) return;

  const CORRECT = [365, 52, 13];
  const inputs = [
    document.getElementById('lock-digit-0'),
    document.getElementById('lock-digit-1'),
    document.getElementById('lock-digit-2')
  ];
  const unlockBtn = document.getElementById('unlock-btn');
  const resetBtn = document.getElementById('reset-lock-btn');
  const resultEl = document.getElementById('task2-result');

  // Stepper buttons (▲ / ▼)
  container.querySelectorAll('.digit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      const input = inputs[idx];
      if (!input) return;
      let val = parseInt(input.value, 10);
      if (isNaN(val)) val = 0;
      if (btn.classList.contains('digit-up')) {
        val = Math.min(val + 1, 999);
      } else {
        val = Math.max(val - 1, 0);
      }
      input.value = val;
    });
  });

  // Clamp input values when user types
  inputs.forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      let val = parseInt(inp.value, 10);
      if (isNaN(val)) return;
      if (val < 0) inp.value = 0;
      if (val > 999) inp.value = 999;
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        unlockBtn.click();
      }
    });
  });

  unlockBtn.addEventListener('click', () => {
    const vals = inputs.map(inp => parseInt(inp ? inp.value : '0', 10) || 0);
    const isCorrect = vals[0] === CORRECT[0] && vals[1] === CORRECT[1] && vals[2] === CORRECT[2];

    if (isCorrect) {
      TaskScores.task2 = 5;
      updateGlobalScoreDisplay();
      resultEl.className = 'task-result success';
      resultEl.innerHTML = '🔓 <strong>Výborně!</strong> Celý balíček tak vojákovi nahrazuje Bibli, věčný kalendář (Almanack), modlitební knížku i samotné hrací karty. Získáváš 5 bodů!';
      unlockBtn.textContent = '🔓 Zámek odemčen';
    } else {
      const lockDisplay = container.querySelector('.lock-display');
      if (lockDisplay) {
        lockDisplay.classList.add('lock-shake');
        setTimeout(() => lockDisplay.classList.remove('lock-shake'), 450);
      }

      const hints = vals.map((v, i) => {
        if (v === CORRECT[i]) return '✓ správně';
        return v < CORRECT[i] ? 'přidej ↑' : 'uber ↓';
      });

      resultEl.className = 'task-result error';
      resultEl.innerHTML = `❌ <strong>Kombinace nesedí.</strong> Nápověda z příběhu: 1. pole (dny v roce) [${hints[0]}], 2. pole (týdny v roce) [${hints[1]}], 3. pole (štychy/lunární měsíce) [${hints[2]}].`;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      inputs.forEach(inp => { if (inp) inp.value = 0; });
      resultEl.className = 'task-result';
      resultEl.style.display = 'none';
      resultEl.textContent = '';
      unlockBtn.textContent = '🔒 Odemknout zámek';
    });
  }
}

/* ════════════════════════════════════════════════════════════
   ÚKOL 3: TŘÍDICÍ KVÍZ (ANGLICKÁ VS. NĚMECKÁ VERZE)
   ════════════════════════════════════════════════════════════ */
function initTask3() {
  const container = document.getElementById('task3');
  if (!container) return;

  const SORT_ITEMS = [
    { id: 'e1', text: 'Královna ze Sáby', target: 'eng' },
    { id: 'e2', text: 'Starosta v Glasgow', target: 'eng' },
    { id: 'e3', text: '13 lunárních měsíců', target: 'eng' },
    { id: 'e4', text: 'Odměna: chléb, sýr a pivo', target: 'eng' },
    { id: 'g1', text: 'Pět ran Kristových a Panna Maria', target: 'ger' },
    { id: 'g2', text: 'Hrozba trestu: běh uličkou', target: 'ger' },
    { id: 'g3', text: 'Výklad barev (kříže, piky, kára, srdce)', target: 'ger' },
    { id: 'g4', text: 'Udavač označen bohemismem „Stwerack“', target: 'ger' }
  ];

  const pool = document.getElementById('sort-pool');
  const engCol = document.getElementById('sort-eng');
  const gerCol = document.getElementById('sort-ger');
  const engItems = engCol ? engCol.querySelector('.sort-items') : null;
  const gerItems = gerCol ? gerCol.querySelector('.sort-items') : null;
  const checkBtn = document.getElementById('check-sort-btn');
  const resetBtn = document.getElementById('reset-sort-btn');
  const resultEl = document.getElementById('task3-result');

  let selectedChip = null;

  function renderItems() {
    selectedChip = null;
    if (resultEl) {
      resultEl.className = 'task-result';
      resultEl.style.display = 'none';
      resultEl.textContent = '';
    }
    pool.innerHTML = '';
    if (engItems) engItems.innerHTML = '';
    if (gerItems) gerItems.innerHTML = '';

    const shuffled = shuffleArray(SORT_ITEMS);
    shuffled.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'sortable-chip';
      chip.draggable = true;
      chip.dataset.id = item.id;
      chip.dataset.target = item.target;
      chip.textContent = item.text;

      // Drag events
      chip.addEventListener('dragstart', e => {
        chip.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
      });
      chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
      });

      pool.appendChild(chip);
    });
  }

  // Setup drop zones
  const dropZones = [
    { el: pool, container: pool },
    { el: engCol, container: engItems },
    { el: gerCol, container: gerItems }
  ];

  dropZones.forEach(zone => {
    if (!zone.el) return;
    zone.el.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.el.classList.add('drag-over');
    });
    zone.el.addEventListener('dragleave', () => {
      zone.el.classList.remove('drag-over');
    });
    zone.el.addEventListener('drop', e => {
      e.preventDefault();
      zone.el.classList.remove('drag-over');
      const chipId = e.dataTransfer.getData('text/plain');
      const chip = container.querySelector(`.sortable-chip[data-id="${chipId}"]`);
      if (chip && zone.container) {
        zone.container.appendChild(chip);
        chip.classList.remove('correct', 'incorrect', 'selected');
      }
    });
  });

  // Click-to-move interaction
  container.addEventListener('click', e => {
    const chip = e.target.closest('.sortable-chip');

    // Clicked on a chip
    if (chip) {
      // If clicked chip is inside a column, return it directly to the pool
      if (chip.parentElement === engItems || chip.parentElement === gerItems) {
        if (selectedChip === chip) selectedChip = null;
        chip.classList.remove('selected', 'correct', 'incorrect');
        pool.appendChild(chip);
        return;
      }

      // If clicked chip is in pool
      if (selectedChip === chip) {
        chip.classList.remove('selected');
        selectedChip = null;
      } else {
        if (selectedChip) selectedChip.classList.remove('selected');
        chip.classList.add('selected');
        selectedChip = chip;
      }
      return;
    }

    // Clicked on a column while a chip is selected
    if (selectedChip) {
      const targetCol = e.target.closest('.sort-col');
      if (targetCol) {
        const dest = targetCol === engCol ? engItems : gerItems;
        if (dest) {
          selectedChip.classList.remove('selected', 'correct', 'incorrect');
          dest.appendChild(selectedChip);
          selectedChip = null;
        }
      }
    }
  });

  // Evaluation
  checkBtn.addEventListener('click', () => {
    const engPlaced = engItems ? Array.from(engItems.children) : [];
    const gerPlaced = gerItems ? Array.from(gerItems.children) : [];
    const totalPlaced = engPlaced.length + gerPlaced.length;

    if (totalPlaced < SORT_ITEMS.length) {
      resultEl.className = 'task-result error';
      resultEl.textContent = `Zbývá zařadit ještě ${SORT_ITEMS.length - totalPlaced} kartiček ze zásobníku!`;
      return;
    }

    let correctCount = 0;
    engPlaced.forEach(chip => {
      if (chip.dataset.target === 'eng') {
        chip.classList.add('correct');
        chip.classList.remove('incorrect');
        correctCount++;
      } else {
        chip.classList.add('incorrect');
        chip.classList.remove('correct');
      }
    });

    gerPlaced.forEach(chip => {
      if (chip.dataset.target === 'ger') {
        chip.classList.add('correct');
        chip.classList.remove('incorrect');
        correctCount++;
      } else {
        chip.classList.add('incorrect');
        chip.classList.remove('correct');
      }
    });

    TaskScores.task3 = correctCount;
    updateGlobalScoreDisplay();

    if (correctCount === SORT_ITEMS.length) {
      resultEl.className = 'task-result success';
      resultEl.innerHTML = `🎉 <strong>Perfektní práce!</strong> Všech 8 pojmů je správně rozřazeno (8/8). Získáváš 8 bodů!<br>Anglická verze zdůrazňuje civilní prostředí a šprým, zatímco německá je přísně hierarchická a teologicky vážná.`;
    } else {
      resultEl.className = 'task-result error';
      resultEl.innerHTML = `Správně zařazeno <strong>${correctCount} / 8</strong> pojmů. Červeně označené kartičky patří do opačného sloupce. Klikni na ně pro vrácení a zkus to znovu!`;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', renderItems);
  }

  renderItems();
}

/* ════════════════════════════════════════════════════════════
   ÚKOL 4: JAZYKOVÝ DETEKTOR (GERMANISMY V RUKOPISU)
   ════════════════════════════════════════════════════════════ */
function initTask4() {
  const container = document.getElementById('task4');
  if (!container) return;

  const GERMANISMS = {
    felbebl: {
      name: 'Felbébl',
      origin: 'z něm. Feldwebel',
      meaning: 'šikovatel (poddůstojnická hodnost v habsburské armádě)'
    },
    arestyrovat: {
      name: 'Arestýrovat',
      origin: 'z něm. arrestieren',
      meaning: 'zatknout, uvěznit, vzít do vazby'
    },
    schorek: {
      name: 'Schorek',
      origin: 'z něm. Schurke',
      meaning: 'darebák, ničema (doslovný překlad německého výrazu pro karetního spodka/kluka)'
    },
    varta: {
      name: 'Varta',
      origin: 'z něm. Wache / Warte',
      meaning: 'stráž, hlídka (stát na vartě)'
    }
  };

  const countDisplay = document.getElementById('found-count');
  const explanationsContainer = document.getElementById('task4-explanations');
  const feedbackEl = document.getElementById('task4-feedback');
  const resultEl = document.getElementById('task4-result');
  const allWords = container.querySelectorAll('.detector-word');

  const foundSet = new Set();
  let feedbackTimer = null;

  function showFeedback(text, type) {
    if (!feedbackEl) return;
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackEl.className = 'detector-hint ' + type;
    feedbackEl.textContent = text;
    feedbackTimer = setTimeout(() => {
      feedbackEl.textContent = '';
      feedbackEl.className = 'detector-hint';
    }, 2800);
  }

  allWords.forEach(wordEl => {
    const clickHandler = () => {
      const key = wordEl.dataset.word;

      // 1. Kliknutí na hledaný germanismus
      if (key && GERMANISMS[key]) {
        const info = GERMANISMS[key];

        // Zvýrazni všechny výskyty tohoto slova v textu
        container.querySelectorAll(`.detector-word[data-word="${key}"]`).forEach(w => {
          w.classList.add('found');
          w.classList.remove('wrong-word');
        });

        if (!foundSet.has(key)) {
          foundSet.add(key);

          // Přidat řádek s etymologickým vysvětlením
          const item = document.createElement('div');
          item.className = 'explanation-item';
          item.innerHTML = `✅ <strong>${info.name}</strong> (<em>${info.origin}</em>) = ${info.meaning}`;
          explanationsContainer.appendChild(item);

          countDisplay.textContent = foundSet.size;
          TaskScores.task4 = foundSet.size * 2;
          updateGlobalScoreDisplay();

          showFeedback(`✅ Správně! Slovo „${info.name}“ je hledaný germanismus.`, 'success');

          if (foundSet.size === Object.keys(GERMANISMS).length) {
            resultEl.className = 'task-result success';
            resultEl.innerHTML = `🎉 <strong>Výborně!</strong> Nalezeny všechny 4 dobové germanismy. Získáváš 8 bodů!<br>Tento jazykový otisk dokazuje, jak hluboce byl text zakotven ve vojenské realitě rakouského císařství.`;
          }
        }
      } else {
        // 2. Kliknutí na běžné české slovo (nebo nehledaný výraz)
        if (wordEl.classList.contains('found')) return;

        wordEl.classList.remove('wrong-word');
        // Force reflow for animation restart
        void wordEl.offsetWidth;
        wordEl.classList.add('wrong-word');

        setTimeout(() => {
          wordEl.classList.remove('wrong-word');
        }, 1000);

        const cleanWord = wordEl.textContent.trim().replace(/[.,;:!?„“…]+$/, '');
        showFeedback(`❌ Slovo „${cleanWord}“ není hledaným germanismem. Hledej vojenské výrazy a hodnosti z němčiny!`, 'error');
      }
    };

    wordEl.addEventListener('click', clickHandler);
    wordEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   ÚKOL 5: SROVNÁVACÍ PŘIŘAZOVAČKA (TABULKA 4×3)
   ════════════════════════════════════════════════════════════ */
function initTask5() {
  const container = document.getElementById('task5');
  if (!container) return;

  const TABLE_DATA = [
    { id: 'c1',  target: 'dvojka-trnka',    text: 'Dvojí podstata Krista (Božství a Člověčenství)' },
    { id: 'c2',  target: 'dvojka-cerny',    text: 'Dvě části Bible (Starý a Nový zákon)' },
    { id: 'c3',  target: 'dvojka-tramvaj',  text: '2 vozy tramvaje = dvě ženy, které v životě miloval' },
    { id: 'c4',  target: 'kralovna-trnka',  text: 'Svaté mateřiny a Matka Boží pod křížem' },
    { id: 'c5',  target: 'kralovna-cerny',  text: 'Blahoslavená Panna Maria' },
    { id: 'c6',  target: 'kralovna-tramvaj',text: 'V tramvaji ji zastupuje sám řidič D. Taxis Tramway' },
    { id: 'c7',  target: 'kluk-trnka',      text: 'Křížový schorek = udavač; ostatní tři = Pilátovi kati a strážní' },
    { id: 'c8',  target: 'kluk-cerny',      text: 'Ďábel (všechny spodky dohromady)' },
    { id: 'c9',  target: 'kluk-tramvaj',    text: 'Šašek (jedna z rolí řidiče tramvaje)' },
    { id: 'c10', target: 'pointa-trnka',    text: 'Švejkovské přiznání: „Byla to velká práce, bych trestu ušel!“' },
    { id: 'c11', target: 'pointa-cerny',    text: 'Vážné potvrzení: „Ten voják se jmenoval T. Taxis Taylor.“' },
    { id: 'c12', target: 'pointa-tramvaj',  text: 'Absurdní výpočet cinknutí mezi Braníkem a Palmovkou' },
  ];

  const pool = document.getElementById('compare-pool');
  const cells = container.querySelectorAll('.compare-cell');
  const checkBtn = document.getElementById('check-compare-btn');
  const resetBtn = document.getElementById('reset-compare-btn');
  const resultEl = document.getElementById('task5-result');

  let selectedChip = null;

  function renderGame() {
    selectedChip = null;
    if (resultEl) {
      resultEl.className = 'task-result';
      resultEl.style.display = 'none';
      resultEl.textContent = '';
    }

    pool.innerHTML = '';
    cells.forEach(cell => {
      cell.innerHTML = '<span class="cell-empty-hint">Vlož kartičku</span>';
      cell.classList.remove('has-chip', 'correct-fill', 'wrong-fill', 'drag-over');
      delete cell.dataset.chipId;
    });

    const shuffled = shuffleArray(TABLE_DATA);
    shuffled.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'compare-chip';
      chip.draggable = true;
      chip.dataset.id = item.id;
      chip.dataset.target = item.target;
      chip.textContent = item.text;

      chip.addEventListener('dragstart', e => {
        chip.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
      });
      chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
      });

      pool.appendChild(chip);
    });
  }

  // Setup pool as drop zone
  pool.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    pool.classList.add('drag-over');
  });
  pool.addEventListener('dragleave', () => {
    pool.classList.remove('drag-over');
  });
  pool.addEventListener('drop', e => {
    e.preventDefault();
    pool.classList.remove('drag-over');
    const chipId = e.dataTransfer.getData('text/plain');
    const chip = container.querySelector(`.compare-chip[data-id="${chipId}"]`);
    if (chip) {
      // If was in a cell, clear that cell
      if (chip.parentElement.classList.contains('compare-cell')) {
        const cell = chip.parentElement;
        cell.classList.remove('has-chip', 'correct-fill', 'wrong-fill');
        delete cell.dataset.chipId;
        cell.innerHTML = '<span class="cell-empty-hint">Vlož kartičku</span>';
      }
      chip.classList.remove('in-table', 'selected');
      pool.appendChild(chip);
    }
  });

  // Setup cells as drop zones & click zones
  cells.forEach(cell => {
    cell.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      cell.classList.add('drag-over');
    });
    cell.addEventListener('dragleave', () => {
      cell.classList.remove('drag-over');
    });
    cell.addEventListener('drop', e => {
      e.preventDefault();
      cell.classList.remove('drag-over');
      const chipId = e.dataTransfer.getData('text/plain');
      const chip = container.querySelector(`.compare-chip[data-id="${chipId}"]`);
      if (chip) {
        placeChipInCell(chip, cell);
      }
    });

    cell.addEventListener('click', () => {
      // If cell already has a chip and no chip is selected -> return chip to pool
      if (cell.classList.contains('has-chip') && !selectedChip) {
        const existingChip = cell.querySelector('.compare-chip');
        if (existingChip) {
          existingChip.classList.remove('in-table', 'selected');
          pool.appendChild(existingChip);
        }
        cell.classList.remove('has-chip', 'correct-fill', 'wrong-fill');
        delete cell.dataset.chipId;
        cell.innerHTML = '<span class="cell-empty-hint">Vlož kartičku</span>';
        return;
      }

      // If a chip is currently selected -> place it into this cell
      if (selectedChip) {
        placeChipInCell(selectedChip, cell);
        selectedChip.classList.remove('selected');
        selectedChip = null;
      }
    });
  });

  function placeChipInCell(chip, cell) {
    // If the cell already contains another chip, return it to the pool
    const existing = cell.querySelector('.compare-chip');
    if (existing && existing !== chip) {
      existing.classList.remove('in-table', 'selected');
      pool.appendChild(existing);
    }

    // If chip came from another cell, clear that cell
    if (chip.parentElement.classList.contains('compare-cell') && chip.parentElement !== cell) {
      const oldCell = chip.parentElement;
      oldCell.classList.remove('has-chip', 'correct-fill', 'wrong-fill');
      delete oldCell.dataset.chipId;
      oldCell.innerHTML = '<span class="cell-empty-hint">Vlož kartičku</span>';
    }

    cell.innerHTML = '';
    chip.classList.add('in-table');
    cell.appendChild(chip);
    cell.classList.add('has-chip');
    cell.classList.remove('correct-fill', 'wrong-fill');
    cell.dataset.chipId = chip.dataset.id;
  }

  // Click on chip in pool
  pool.addEventListener('click', e => {
    const chip = e.target.closest('.compare-chip');
    if (!chip) return;
    if (selectedChip === chip) {
      chip.classList.remove('selected');
      selectedChip = null;
    } else {
      if (selectedChip) selectedChip.classList.remove('selected');
      chip.classList.add('selected');
      selectedChip = chip;
    }
  });

  // Evaluate
  checkBtn.addEventListener('click', () => {
    let placedCount = 0;
    let correctCount = 0;

    cells.forEach(cell => {
      const chip = cell.querySelector('.compare-chip');
      if (chip) {
        placedCount++;
        const target = cell.dataset.target;
        if (chip.dataset.target === target) {
          cell.classList.add('correct-fill');
          cell.classList.remove('wrong-fill');
          correctCount++;
        } else {
          cell.classList.add('wrong-fill');
          cell.classList.remove('correct-fill');
        }
      } else {
        cell.classList.remove('correct-fill', 'wrong-fill');
      }
    });

    if (placedCount < TABLE_DATA.length) {
      resultEl.className = 'task-result error';
      resultEl.textContent = `V tabulce je vyplněno pouze ${placedCount} z 12 políček. Doplň všechny kartičky!`;
      return;
    }

    TaskScores.task5 = correctCount;
    updateGlobalScoreDisplay();

    if (correctCount === TABLE_DATA.length) {
      resultEl.className = 'task-result success';
      resultEl.innerHTML = `🎉 <strong>Skvělé!</strong> Všech 12 políček je správně přiřazeno (12/12). Získáváš 12 bodů!<br><em>Zajímavost:</em> Miroslav Černý v roce 1969 převzal z americké předlohy protestantskou symboliku (dvojka = Bible, pětka = panny, osmička = Noe), ale u královny do ní vložil katolickou Pannu Marii, která v protestantském originálu vůbec není!`;
    } else {
      resultEl.className = 'task-result error';
      resultEl.innerHTML = `Správně přiřazeno <strong>${correctCount} / 12</strong> políček. Červeně podbarvená políčka obsahují nesprávnou kartičku. Klikni na ně pro vrácení do zásobníku a zkus to znovu!`;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', renderGame);
  }

  renderGame();
}

/* ════════════════════════════════════════════════════════════
   ÚKOL 6: ZÁVĚREČNÝ ANALYTICKÝ KVÍZ (A/B/C)
   ════════════════════════════════════════════════════════════ */
function initTask6() {
  const container = document.getElementById('task6');
  if (!container) return;

  const QUESTIONS_DATA = [
    {
      qIndex: 0,
      name: 'q1',
      correct: 'B',
      feedback: 'Správně! Závěrečná věta rukopisu („To si můžete, bratři, pomyslit, že to byla velká práce, když jsem se chtěl dobře zodpovídat, bych trestu ušel!“) odhaluje švejkovskou pointu – voják byl chytrý šibal, který si celý zbožný výklad vymyslel jen z taktiky.'
    },
    {
      qIndex: 1,
      name: 'q2',
      correct: 'A',
      feedback: 'Správně! Tři sestry parodují samotný princip numerické alegorie a absurdní matematiky (kola, nápravy, schody, cinknutí mezi Braníkem a Palmovkou) a přenášejí posvátnou scénu do recesistického světa Formule 1 a pražské MHD.'
    },
    {
      qIndex: 2,
      name: 'q3',
      correct: 'C',
      feedback: 'Správně! Jméno „T. Taxis Taylor“ je zkomoleninou jména country zpěváka T. Texase Tylera, která se v českém prostředí ustálila ústním a opisovaným šířením – přesně stejným mechanismem, jakým po staletí žily staré kramářské písně.'
    }
  ];

  const checkBtn = document.getElementById('check-quiz-btn');
  const resetBtn = document.getElementById('reset-quiz-btn');
  const finalBox = document.getElementById('quiz-final');
  const scoreDisplay = document.getElementById('quiz-score-display');
  const verdictDisplay = document.getElementById('quiz-verdict');

  // Radio button selection visual sync
  container.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const block = opt.closest('.quiz-question-block');
      if (!block) return;
      block.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  checkBtn.addEventListener('click', () => {
    let answeredCount = 0;
    let correctCount = 0;

    QUESTIONS_DATA.forEach(q => {
      const block = document.getElementById(`quiz-q${q.qIndex + 1}`);
      const fb = document.getElementById(`quiz-fb-${q.qIndex + 1}`);
      const selectedRadio = container.querySelector(`input[name="${q.name}"]:checked`);

      if (!selectedRadio) {
        if (fb) {
          fb.className = 'quiz-feedback show wrong-fb';
          fb.textContent = 'Prosím vyber odpověď (A, B nebo C).';
        }
        return;
      }

      answeredCount++;
      const userVal = selectedRadio.value;
      const isCorrect = userVal === q.correct;

      // Colorize options in this block
      block.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.add('evaluated');
        const optVal = opt.dataset.opt;
        opt.classList.remove('correct', 'incorrect', 'revealed');

        if (optVal === q.correct) {
          if (isCorrect) {
            opt.classList.add('correct');
          } else {
            opt.classList.add('revealed');
          }
        } else if (optVal === userVal && !isCorrect) {
          opt.classList.add('incorrect');
        }
      });

      if (isCorrect) {
        correctCount++;
        if (fb) {
          fb.className = 'quiz-feedback show correct-fb';
          fb.innerHTML = `<strong>Správně!</strong> ${q.feedback}`;
        }
      } else {
        if (fb) {
          fb.className = 'quiz-feedback show wrong-fb';
          fb.innerHTML = `<strong>Nesprávně.</strong> Správná odpověď je <strong>(${q.correct})</strong>. ${q.feedback}`;
        }
      }
    });

    if (answeredCount < QUESTIONS_DATA.length) {
      return;
    }

    const earnedPoints = correctCount * 5;
    TaskScores.task6 = earnedPoints;
    updateGlobalScoreDisplay();

    if (finalBox) {
      finalBox.className = 'task-result success';
      finalBox.style.display = 'block';
      if (scoreDisplay) {
        scoreDisplay.textContent = `${correctCount} / 3 správně (+${earnedPoints} bodů)`;
      }
      if (verdictDisplay) {
        if (correctCount === 3) {
          verdictDisplay.textContent = 'Excelentní výsledek! Dokonale rozumíš proměnám tohoto příběhu od 19. století až po moderní parodii.';
        } else if (correctCount === 2) {
          verdictDisplay.textContent = 'Velmi dobrý výsledek! Prohlédni si vysvětlení u zbývající otázky pro dokonalý přehled.';
        } else {
          verdictDisplay.textContent = 'Dobrý pokus! Projdi si kapitoly ještě jednou a vyzkoušej kvíz znovu.';
        }
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      container.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
      container.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected', 'evaluated', 'correct', 'incorrect', 'revealed');
      });
      container.querySelectorAll('.quiz-feedback').forEach(fb => {
        fb.className = 'quiz-feedback';
        fb.textContent = '';
      });
      if (finalBox) {
        finalBox.style.display = 'none';
      }
    });
  }
}

/* ── DOM READY INITIALIZATION ─────────────────────────────── */
function initAll() {
  initProgressBar();
  initActiveNav();
  initLightboxes();
  initTask1();
  initTask2();
  initTask3();
  initTask4();
  initTask5();
  initTask6();
  updateGlobalScoreDisplay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  // DOM is already ready
  initAll();
}
