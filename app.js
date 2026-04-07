const CATS = ["All topics", "Rights & Responsibilities", "Government", "Justice System", "Symbols & Identity", "History", "Indigenous & Diversity", "Geography"];
const MODES = {
  study: { label: "Study Deck", kick: "Guided learning", title: "Study one card at a time with explanations and audio support." },
  quiz: { label: "Quiz Sprint", kick: "Fast recall", title: "Answer quickly and get instant feedback after every question." },
  mock: { label: "Mock Test", kick: "Pressure mode", title: "Mixed-question practice with a timer and end-of-session review." },
};
const MOBILE_VIEWS = {
  setup: { kicker: "App Settings", title: "Settings" },
  practice: { kicker: "Current Session", title: "Practice" },
  help: { kicker: "Support Tools", title: "Help" },
};
const LETTERS = ["A", "B", "C", "D"];
const REVIEW_SECONDS = 6;
const STORE = "maple-mentor-progress-v1";
const SPANISH_TRANSLATIONS = window.SPANISH_TRANSLATIONS || {};
const el = {
  count: document.querySelector("#question-count"),
  mobileViewBtns: document.querySelectorAll("[data-mobile-view]"),
  mobileViewTitle: document.querySelector("#mobile-view-title"),
  mobileViewKicker: document.querySelector("#mobile-view-kicker"),
  mobileBackBtn: document.querySelector("#mobile-back-btn"),
  mobileSettingsBtn: document.querySelector("#mobile-settings-btn"),
  languageBtns: document.querySelectorAll("[data-language-mode]"),
  fontScaleBtns: document.querySelectorAll("[data-font-scale]"),
  easyViewBtn: document.querySelector("#easy-view-btn"),
  modeBtns: document.querySelectorAll("[data-mode]"),
  heroBtns: document.querySelectorAll("[data-start]"),
  chips: document.querySelector("#category-chips"),
  overall: document.querySelector("#overall-accuracy"),
  sessions: document.querySelector("#sessions-completed"),
  streak: document.querySelector("#best-streak"),
  saved: document.querySelector("#saved-count"),
  kick: document.querySelector("#session-kicker"),
  title: document.querySelector("#session-title"),
  progress: document.querySelector("#session-progress"),
  timer: document.querySelector("#timer-pill"),
  cat: document.querySelector("#question-category"),
  saveBtn: document.querySelector("#bookmark-btn"),
  q: document.querySelector("#question-text"),
  readingBanner: document.querySelector("#reading-banner"),
  list: document.querySelector("#option-list"),
  fb: document.querySelector("#feedback-panel"),
  fbTitle: document.querySelector("#feedback-title"),
  fbCopy: document.querySelector("#feedback-copy"),
  translationCard: document.querySelector("#translation-card"),
  translationQuestion: document.querySelector("#translation-question"),
  translationOptions: document.querySelector("#translation-options"),
  translationExplanation: document.querySelector("#translation-explanation"),
  readBtn: document.querySelector("#read-btn"),
  revealBtn: document.querySelector("#reveal-btn"),
  nextBtn: document.querySelector("#next-btn"),
  restartBtn: document.querySelector("#restart-btn"),
  strip: document.querySelector("#review-strip"),
  englishVoice: document.querySelector("#english-voice-select"),
  spanishVoice: document.querySelector("#spanish-voice-select"),
  rate: document.querySelector("#rate-range"),
  vol: document.querySelector("#volume-range"),
  autoRead: document.querySelector("#auto-read-toggle"),
  autoListen: document.querySelector("#listen-toggle"),
  showSpanish: document.querySelector("#show-spanish-toggle"),
  listenBtn: document.querySelector("#listen-btn"),
  readSpanishBtn: document.querySelector("#read-spanish-btn"),
  stopBtn: document.querySelector("#stop-audio-btn"),
  voiceStatus: document.querySelector("#voice-status"),
  transcript: document.querySelector("#transcript-text"),
  results: document.querySelector("#results-panel"),
  resultsTitle: document.querySelector("#results-title"),
  resultsSummary: document.querySelector("#results-summary"),
  resultsReview: document.querySelector("#results-review"),
};

const defaults = {
  sessionsCompleted: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  bestStreak: 0,
  savedIds: [],
  categoryStats: {},
  settings: { englishVoiceName: "", spanishVoiceName: "", rate: 1, volume: 1, autoRead: true, listenAfterRead: false, showSpanish: false, fontScale: "base", easyView: false },
};

const state = {
  mode: "study",
  category: "All topics",
  mobileView: "practice",
  session: [],
  idx: 0,
  answers: [],
  streak: 0,
  bestRun: 0,
  done: false,
  recorded: false,
  finishReason: "completed",
  timer: null,
  timerId: null,
  voices: [],
  rec: null,
  recOk: false,
  listening: false,
  answerLocked: false,
  reviewCountdown: 0,
  reviewTimerId: null,
  readAlong: null,
  speechRunId: 0,
  interacted: false,
  progress: load(),
};

function clone(x) { return JSON.parse(JSON.stringify(x)); }
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (!saved) return clone(defaults);
    const merged = { ...clone(defaults), ...saved, settings: { ...defaults.settings, ...(saved.settings || {}) }, savedIds: Array.isArray(saved.savedIds) ? saved.savedIds : [] };
    if (!merged.settings.englishVoiceName && merged.settings.voiceName) {
      merged.settings.englishVoiceName = merged.settings.voiceName;
    }
    return merged;
  } catch {
    return clone(defaults);
  }
}
function persist() { localStorage.setItem(STORE, JSON.stringify(state.progress)); }
function acc(c, a) { return a ? Math.round((c / a) * 100) : 0; }
function fmt(sec) { const m = Math.floor(sec / 60); const s = sec % 60; return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; }
function currentQ() { return QUESTION_BANK[state.session[state.idx]] || null; }
function currentA() { return state.answers[state.idx] || null; }
function currentSpanish() { const q = currentQ(); return q ? SPANISH_TRANSLATIONS[q.id] || null : null; }
function clearReviewTimer() {
  if (state.reviewTimerId) {
    clearInterval(state.reviewTimerId);
    state.reviewTimerId = null;
  }
}
function stopTalk() {
  state.speechRunId += 1;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  clearReviewTimer();
  state.readAlong = null;
}
function stopListen() { if (state.rec && state.listening) state.rec.stop(); }
function sayStatus(text) { el.voiceStatus.textContent = text; }
function shuffle(arr) { const x = [...arr]; for (let i = x.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }

function showTranslatedExplanation(answer) {
  return Boolean(answer && (state.mode !== "mock" || state.done || answer.revealed));
}

function applyComfortSettings() {
  document.documentElement.dataset.fontScale = state.progress.settings.fontScale || "base";
  document.body.dataset.easyView = state.progress.settings.easyView ? "on" : "off";
}

function isMobileAppView() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function setMobileView(view) {
  state.mobileView = view;
  document.body.dataset.mobileView = view;
}

function applyReadAlongState() {
  el.q.classList.toggle("reading-active", Boolean(state.readAlong && state.readAlong.lang === "en" && state.readAlong.kind === "prompt"));
  el.list.querySelectorAll("[data-option-index]").forEach((button) => {
    const matches = state.readAlong && state.readAlong.lang === "en" && state.readAlong.kind === "option" && Number(button.dataset.optionIndex) === state.readAlong.index;
    button.classList.toggle("reading-active", Boolean(matches));
  });
  el.translationQuestion.classList.toggle("reading-active", Boolean(state.readAlong && state.readAlong.lang === "es" && state.readAlong.kind === "prompt"));
  el.translationOptions.querySelectorAll("[data-translation-index]").forEach((item) => {
    const matches = state.readAlong && state.readAlong.lang === "es" && state.readAlong.kind === "option" && Number(item.dataset.translationIndex) === state.readAlong.index;
    item.classList.toggle("reading-active", Boolean(matches));
  });
}

function updateReadingBanner() {
  if (state.reviewCountdown > 0) {
    el.readingBanner.textContent = `Take a moment to review. Answers unlock in ${state.reviewCountdown}s.`;
    el.readingBanner.classList.remove("hidden");
    el.readingBanner.classList.add("reviewing");
    return;
  }

  if (state.readAlong) {
    const spoken = state.readAlong.kind === "prompt" ? "Reading question" : `Reading option ${LETTERS[state.readAlong.index]}`;
    el.readingBanner.textContent = spoken;
    el.readingBanner.classList.remove("hidden");
    el.readingBanner.classList.remove("reviewing");
    return;
  }

  el.readingBanner.textContent = "";
  el.readingBanner.classList.add("hidden");
  el.readingBanner.classList.remove("reviewing");
}

function unlockAnswering() {
  clearReviewTimer();
  state.reviewCountdown = 0;
  state.answerLocked = false;
  state.readAlong = null;
  updateReadingBanner();
  applyReadAlongState();
  updateActions(currentQ(), currentA());
}

function startReviewCountdown() {
  state.readAlong = null;
  applyReadAlongState();
  state.reviewCountdown = REVIEW_SECONDS;
  updateReadingBanner();
  updateActions(currentQ(), currentA());
  clearReviewTimer();
  state.reviewTimerId = setInterval(() => {
    state.reviewCountdown -= 1;
    if (state.reviewCountdown <= 0) {
      unlockAnswering();
      return;
    }
    updateReadingBanner();
  }, 1000);
}

function filteredIndexes() {
  return QUESTION_BANK.map((_, i) => i).filter((i) => state.category === "All topics" || QUESTION_BANK[i].category === state.category);
}

function buildSession(mode) {
  const pool = filteredIndexes();
  if (mode === "study") return pool;
  if (mode === "quiz") return shuffle(pool).slice(0, Math.min(10, pool.length));
  return shuffle(pool).slice(0, Math.min(20, pool.length));
}

function renderStats() {
  el.count.textContent = QUESTION_BANK.length;
  el.overall.textContent = `${acc(state.progress.totalCorrect, state.progress.totalAnswered)}%`;
  el.sessions.textContent = state.progress.sessionsCompleted;
  el.streak.textContent = state.progress.bestStreak;
  el.saved.textContent = state.progress.savedIds.length;
}

function renderComfortControls() {
  el.fontScaleBtns.forEach((button) => {
    const isActive = button.dataset.fontScale === state.progress.settings.fontScale;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  el.easyViewBtn.classList.toggle("active", state.progress.settings.easyView);
  el.easyViewBtn.setAttribute("aria-pressed", state.progress.settings.easyView ? "true" : "false");
  el.easyViewBtn.textContent = state.progress.settings.easyView ? "Easy View On" : "Easy View Off";
}

function renderMobileChrome() {
  setMobileView(state.mobileView);
  const mobileInfo = MOBILE_VIEWS[state.mobileView];
  const practiceTitle = state.done ? "Results" : MODES[state.mode].label;
  el.mobileViewKicker.textContent = state.mobileView === "practice" ? "Current Session" : mobileInfo.kicker;
  el.mobileViewTitle.textContent = state.mobileView === "practice" ? practiceTitle : mobileInfo.title;
  el.mobileBackBtn.classList.toggle("hidden", state.mobileView === "practice");
  el.mobileSettingsBtn.classList.toggle("active", state.mobileView === "setup");
  el.mobileSettingsBtn.setAttribute("aria-pressed", state.mobileView === "setup" ? "true" : "false");
  el.mobileViewBtns.forEach((button) => {
    const isActive = button.dataset.mobileView === state.mobileView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  el.languageBtns.forEach((button) => {
    const isActive = (button.dataset.languageMode === "support") === state.progress.settings.showSpanish;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function renderChips() {
  el.chips.innerHTML = CATS.map((c) => `<button class="chip ${c === state.category ? "active" : ""}" type="button" data-category="${c}">${c}</button>`).join("");
}

function renderTimer() {
  if (state.mode === "mock" && state.timer !== null) {
    el.timer.textContent = `Practice timer ${fmt(state.timer)}`;
    el.timer.classList.toggle("warning", state.timer <= 120);
  } else {
    el.timer.textContent = "Practice timer off";
    el.timer.classList.remove("warning");
  }
}

function setModeButtons() {
  el.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
}

function questionNarration(q) {
  return `Question ${state.idx + 1}. ${q.prompt}. ${q.options.map((x, i) => `${LETTERS[i]}. ${x}.`).join(" ")}`;
}

function feedbackNarration(q, a) {
  return a.isCorrect ? `Correct. ${q.explanation}` : `Not quite. The correct answer is ${LETTERS[q.answerIndex]}. ${q.options[q.answerIndex]}. ${q.explanation}`;
}

function spanishQuestionNarration(q, t, a) {
  if (!t) return "";
  const explanation = showTranslatedExplanation(a) ? ` Explicacion. ${t.explanation}` : "";
  return `Pregunta ${state.idx + 1}. ${t.prompt}. ${t.options.map((x, i) => `${LETTERS[i]}. ${x}.`).join(" ")}${explanation}`;
}

function voiceForLanguage(lang) {
  const startsWith = (voice, prefix) => voice.lang && voice.lang.toLowerCase().startsWith(prefix);
  const selectedEnglish = state.voices.find((x) => x.name === state.progress.settings.englishVoiceName);
  const selectedSpanish = state.voices.find((x) => x.name === state.progress.settings.spanishVoiceName);
  if (lang === "es") {
    return selectedSpanish || state.voices.find((x) => startsWith(x, "es")) || selectedEnglish || state.voices[0] || null;
  }
  return selectedEnglish || state.voices.find((x) => startsWith(x, "en")) || state.voices[0] || null;
}

function speak(text, opts = {}) {
  if (!("speechSynthesis" in window)) {
    sayStatus("Text-to-speech is not available in this browser.");
    return;
  }
  const { followQuestion = false, lang = "en" } = opts;
  stopTalk();
  const runId = state.speechRunId;
  const u = new SpeechSynthesisUtterance(text);
  const v = voiceForLanguage(lang);
  if (v) u.voice = v;
  u.lang = lang === "es" ? "es-ES" : "en-CA";
  u.rate = Number(state.progress.settings.rate);
  u.volume = Number(state.progress.settings.volume);
  u.onstart = () => {
    if (runId !== state.speechRunId) return;
    sayStatus("Reading aloud.");
  };
  u.onend = () => {
    if (runId !== state.speechRunId) return;
    if (followQuestion) {
      return setTimeout(() => {
        if (runId !== state.speechRunId) return;
        readQuestion();
      }, 140);
    }
    if (state.progress.settings.listenAfterRead && state.recOk) return startListening();
    sayStatus("Audio ready.");
  };
  speechSynthesis.speak(u);
}

function startGuidedRead(lang = "en") {
  const q = currentQ();
  const t = currentSpanish();
  if (!q) return;
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    sayStatus("Text-to-speech is not available in this browser.");
    return;
  }
  if (lang === "es" && !t) {
    sayStatus("Spanish support is not available for this card yet.");
    return;
  }

  stopTalk();
  const runId = state.speechRunId;
  const segments = lang === "es"
    ? [{ kind: "prompt", text: t.prompt }, ...t.options.map((option, index) => ({ kind: "option", index, text: `${LETTERS[index]}. ${option}` }))]
    : [{ kind: "prompt", text: q.prompt }, ...q.options.map((option, index) => ({ kind: "option", index, text: `${LETTERS[index]}. ${option}` }))];

  const shouldLock = !currentA();
  if (shouldLock) {
    state.answerLocked = true;
    state.reviewCountdown = 0;
  }
  updateActions(currentQ(), currentA());
  updateReadingBanner();

  const speakSegment = (segmentIndex) => {
    if (runId !== state.speechRunId) return;
    const segment = segments[segmentIndex];
    if (!segment) {
      if (shouldLock) {
        startReviewCountdown();
      } else {
        unlockAnswering();
      }
      sayStatus("Audio ready.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(segment.text);
    const voice = voiceForLanguage(lang);
    if (voice) utterance.voice = voice;
    utterance.lang = lang === "es" ? "es-ES" : "en-CA";
    utterance.rate = Number(state.progress.settings.rate);
    utterance.volume = Number(state.progress.settings.volume);
    utterance.onstart = () => {
      if (runId !== state.speechRunId) return;
      state.readAlong = { lang, kind: segment.kind, index: segment.index ?? null };
      updateReadingBanner();
      applyReadAlongState();
      sayStatus("Reading aloud.");
    };
    utterance.onend = () => {
      if (runId !== state.speechRunId) return;
      speakSegment(segmentIndex + 1);
    };
    utterance.onerror = () => {
      if (runId !== state.speechRunId) return;
      unlockAnswering();
      sayStatus("Audio could not finish. You can still answer this question.");
    };
    speechSynthesis.speak(utterance);
  };

  speakSegment(0);
}

function readQuestion() {
  startGuidedRead("en");
}

function readQuestionInSpanish() {
  startGuidedRead("es");
}

function normalize(t) { return t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }
function parseChoice(t) {
  const n = normalize(t);
  const direct = n.match(/\b(?:option|answer|letter)\s+([abcd])\b/);
  if (direct) return LETTERS.indexOf(direct[1].toUpperCase());
  if (/^(a|b|c|d)$/.test(n)) return LETTERS.indexOf(n.toUpperCase());
  if (/\b(one|1|first)\b/.test(n)) return 0;
  if (/\b(two|2|second)\b/.test(n)) return 1;
  if (/\b(three|3|third)\b/.test(n)) return 2;
  if (/\b(four|4|fourth)\b/.test(n)) return 3;
  return null;
}

function handleCommand(text) {
  const n = normalize(text);
  el.transcript.textContent = text;
  if (!n) return;
  if (n.includes("repeat")) return readQuestion();
  if (n.includes("spanish") || n.includes("espanol")) return readQuestionInSpanish();
  if (n.includes("next")) return nextQuestion({ allowBlank: state.mode !== "quiz" });
  if (n.includes("reveal")) return revealAnswer();
  if (n.includes("study")) return startSession("study");
  if (n.includes("quiz")) return startSession("quiz");
  if (n.includes("mock")) return startSession("mock");
  if (n.includes("save") || n.includes("bookmark")) return toggleSave();
  const choice = parseChoice(n);
  if (choice !== null) return choose(choice);
  sayStatus('Command heard, but not matched. Try "option A", "repeat", or "next".');
}

function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    el.listenBtn.disabled = true;
    el.autoListen.disabled = true;
    sayStatus("Voice answers depend on browser support. Text-to-speech still works in most modern browsers.");
    return;
  }
  state.recOk = true;
  state.rec = new SR();
  state.rec.lang = "en-CA";
  state.rec.interimResults = false;
  state.rec.maxAlternatives = 1;
  state.rec.onstart = () => { state.listening = true; el.listenBtn.textContent = "Listening..."; sayStatus("Listening for a voice command."); };
  state.rec.onend = () => {
    state.listening = false;
    el.listenBtn.textContent = "Start Listening";
    if (!("speechSynthesis" in window) || !speechSynthesis.speaking) sayStatus("Voice input ready.");
  };
  state.rec.onerror = (e) => { state.listening = false; el.listenBtn.textContent = "Start Listening"; sayStatus(`Voice input error: ${e.error}.`); };
  state.rec.onresult = (e) => handleCommand(e.results[0][0].transcript);
  sayStatus("Voice input ready.");
}

function startListening() {
  if (!state.recOk || !state.rec || state.listening) return;
  try { state.rec.start(); } catch { sayStatus("Voice input could not start right now."); }
}

function populateVoices() {
  if (!("speechSynthesis" in window)) {
    el.englishVoice.innerHTML = '<option value="">Browser speech unavailable</option>';
    el.spanishVoice.innerHTML = '<option value="">Browser speech unavailable</option>';
    sayStatus("Text-to-speech is not available in this browser.");
    return;
  }
  state.voices = speechSynthesis.getVoices().sort((a, b) => a.name.localeCompare(b.name));
  if (!state.voices.length) {
    el.englishVoice.innerHTML = '<option value="">Loading voices...</option>';
    el.spanishVoice.innerHTML = '<option value="">Loading voices...</option>';
    return;
  }
  const englishVoices = state.voices.filter((x) => x.lang && x.lang.toLowerCase().startsWith("en"));
  const spanishVoices = state.voices.filter((x) => x.lang && x.lang.toLowerCase().startsWith("es"));
  const englishDefault = englishVoices.find((x) => x.lang === "en-CA") || englishVoices[0] || state.voices[0];
  const spanishDefault = spanishVoices[0] || englishDefault;

  if (!state.progress.settings.englishVoiceName || !state.voices.some((x) => x.name === state.progress.settings.englishVoiceName)) {
    state.progress.settings.englishVoiceName = englishDefault ? englishDefault.name : "";
  }
  if (!state.progress.settings.spanishVoiceName || !state.voices.some((x) => x.name === state.progress.settings.spanishVoiceName)) {
    state.progress.settings.spanishVoiceName = spanishDefault ? spanishDefault.name : "";
  }

  const optionsMarkup = (voices, selectedName) => {
    if (!voices.length) {
      return '<option value="">No matching voices found</option>';
    }
    return voices.map((x) => `<option value="${x.name}" ${x.name === selectedName ? "selected" : ""}>${x.name} (${x.lang})</option>`).join("");
  };

  el.englishVoice.innerHTML = optionsMarkup(englishVoices.length ? englishVoices : state.voices, state.progress.settings.englishVoiceName);
  el.spanishVoice.innerHTML = optionsMarkup(spanishVoices.length ? spanishVoices : state.voices, state.progress.settings.spanishVoiceName);
  persist();
  sayStatus("Audio ready.");
}

function updateStreak(ok) {
  if (ok) {
    state.streak += 1;
    state.bestRun = Math.max(state.bestRun, state.streak);
  } else {
    state.streak = 0;
  }
}

function renderFeedback(q, a) {
  el.fb.classList.remove("good", "needs-work");
  if (!a) {
    el.fbTitle.textContent = state.mode === "mock" ? "Mock test mode" : "Coach note";
    el.fbCopy.textContent = state.mode === "mock" ? "Choose the best answer. Full review appears after the session." : "Pick the best answer, or use Reveal Answer in Study Deck if you want help first.";
    return;
  }
  if (state.mode === "mock" && !state.done && !a.revealed) {
    el.fbTitle.textContent = "Answer saved";
    el.fbCopy.textContent = "Your choice is recorded. Keep moving or use the numbered bubbles to review.";
    return;
  }
  el.fbTitle.textContent = a.isCorrect ? "Correct" : "Keep going";
  el.fbCopy.textContent = `Correct answer: ${LETTERS[q.answerIndex]}. ${q.options[q.answerIndex]}. ${q.explanation}`;
  el.fb.classList.add(a.isCorrect ? "good" : "needs-work");
}

function renderTranslation(q, a) {
  if (!state.progress.settings.showSpanish) {
    el.translationCard.classList.add("hidden");
    return;
  }

  const t = q ? SPANISH_TRANSLATIONS[q.id] || null : null;
  el.translationCard.classList.remove("hidden");

  if (!q || !t) {
    el.translationQuestion.textContent = "No Spanish translation is available for this card yet.";
    el.translationOptions.innerHTML = "";
    el.translationExplanation.textContent = "Try another card or keep using the English version for now.";
    return;
  }

  el.translationQuestion.textContent = t.prompt;
  el.translationOptions.innerHTML = t.options.map((option, index) => `<div class="translation-option" data-translation-index="${index}"><strong>${LETTERS[index]}.</strong> ${option}</div>`).join("");
  el.translationExplanation.textContent = showTranslatedExplanation(a) ? t.explanation : "Answer the question or reveal the card to see the translated explanation.";
}

function renderStrip() {
  el.strip.innerHTML = state.session.map((_, i) => {
    const a = state.answers[i];
    const classes = ["review-pill"];
    if (i === state.idx) classes.push("current");
    else if (a && (state.mode !== "mock" || state.done)) classes.push(a.isCorrect ? "correct" : "incorrect");
    return `<button class="${classes.join(" ")}" type="button" data-review-index="${i}">${i + 1}</button>`;
  }).join("");
}

function updateActions(q, a) {
  el.readBtn.disabled = !q;
  el.readSpanishBtn.disabled = !q || !(q && SPANISH_TRANSLATIONS[q.id]);
  el.revealBtn.disabled = !q || state.mode !== "study" || !!a || state.answerLocked;
  el.nextBtn.disabled = !q || (state.mode === "quiz" && !a) || state.answerLocked;
  el.nextBtn.textContent = state.idx === state.session.length - 1 ? "Finish Session" : "Next Card";
}

function renderQuestion() {
  const q = currentQ();
  const a = currentA();
  const m = MODES[state.mode];
  el.kick.textContent = m.kick;
  el.title.textContent = m.title;
  el.progress.textContent = `${Math.min(state.idx + 1, state.session.length)} / ${state.session.length}`;
  if (!q) {
    el.cat.textContent = "No questions loaded";
    el.q.textContent = "No questions are available for this category yet.";
    el.list.innerHTML = "";
    el.strip.innerHTML = "";
    renderTranslation(null, null);
    return;
  }
  el.cat.textContent = q.category;
  el.q.textContent = q.prompt;
  el.saveBtn.textContent = state.progress.savedIds.includes(q.id) ? "Saved card" : "Save card";
  el.list.innerHTML = q.options.map((text, i) => {
    const classes = ["option-button"];
    const show = a && (state.mode !== "mock" || state.done || a.revealed);
    if (a && a.selectedIndex === i) classes.push("selected");
    if (show && i === q.answerIndex) classes.push("correct");
    if (a && a.selectedIndex === i && !a.isCorrect && show) classes.push("incorrect");
    if (state.readAlong && state.readAlong.lang === "en" && state.readAlong.kind === "option" && state.readAlong.index === i) {
      classes.push("reading-active");
    }
    const disabled = (state.mode === "mock" && !state.done) ? (state.answerLocked ? "disabled" : "") : (a || state.answerLocked ? "disabled" : "");
    return `<button class="${classes.join(" ")}" type="button" data-option-index="${i}" ${disabled}><span class="option-prefix">${LETTERS[i]}</span><span>${text}</span></button>`;
  }).join("");
  renderFeedback(q, a);
  renderTranslation(q, a);
  renderStrip();
  renderTimer();
  updateActions(q, a);
  updateReadingBanner();
  applyReadAlongState();
}

function byCategory(entries) {
  const map = new Map();
  entries.forEach((a) => {
    const current = map.get(a.category) || { category: a.category, answered: 0, correct: 0 };
    current.answered += 1;
    if (a.isCorrect) current.correct += 1;
    map.set(a.category, current);
  });
  return [...map.values()].map((x) => ({ ...x, accuracy: acc(x.correct, x.answered) })).sort((a, b) => b.accuracy - a.accuracy);
}

function resultNote(score, best, weakest) {
  if (score >= 85) return `You are showing strong recall. ${best ? `Your sharpest area was ${best.category}.` : ""} Try another mock run and answer aloud for extra pressure.`;
  if (score >= 65) return `You are building momentum. ${weakest ? `Spend a little more time on ${weakest.category}.` : ""} Study Deck plus audio repetition is a strong next step.`;
  return "This is a useful checkpoint. Slow down, use Study Deck, and revisit saved cards before another timed session.";
}

function renderResults() {
  if (!state.done) {
    el.results.classList.add("hidden");
    return;
  }
  const answered = state.answers.filter(Boolean).filter((x) => x.selectedIndex !== null);
  const correct = answered.filter((x) => x.isCorrect);
  const score = acc(correct.length, answered.length);
  const categories = byCategory(answered);
  const missed = state.answers.map((a, i) => ({ a, q: QUESTION_BANK[state.session[i]], i })).filter((x) => x.a && x.a.selectedIndex !== null && !x.a.isCorrect);
  el.results.classList.remove("hidden");
  el.resultsTitle.textContent = `${MODES[state.mode].label}: ${state.finishReason === "time" ? "Time reached" : "Session complete"}`;
  el.resultsSummary.innerHTML = `<div class="results-grid"><article class="result-chip"><strong>${score}%</strong><span>Session accuracy</span></article><article class="result-chip"><strong>${correct.length} / ${answered.length || state.session.length}</strong><span>Correct answers</span></article><article class="result-chip"><strong>${state.bestRun}</strong><span>Best correct streak</span></article></div><p>${resultNote(score, categories[0], categories[categories.length - 1])}</p>`;
  el.resultsReview.innerHTML = missed.length ? missed.map(({ q, i }) => `<article class="review-item"><h3>Question ${i + 1}: ${q.prompt}</h3><p><strong>Correct answer:</strong> ${LETTERS[q.answerIndex]}. ${q.options[q.answerIndex]}</p><p>${q.explanation}</p></article>`).join("") : `<article class="review-item"><h3>Strong finish</h3><p>You cleared every answered question in this session. Try a different focus area or restart with Mock Test to keep the pressure high.</p></article>`;
}

function recordSession() {
  if (state.recorded) return;
  const answered = state.answers.filter(Boolean).filter((x) => x.selectedIndex !== null);
  const correct = answered.filter((x) => x.isCorrect);
  state.progress.sessionsCompleted += 1;
  state.progress.totalAnswered += answered.length;
  state.progress.totalCorrect += correct.length;
  state.progress.bestStreak = Math.max(state.progress.bestStreak, state.bestRun);
  answered.forEach((x) => {
    const current = state.progress.categoryStats[x.category] || { answered: 0, correct: 0 };
    current.answered += 1;
    if (x.isCorrect) current.correct += 1;
    state.progress.categoryStats[x.category] = current;
  });
  state.recorded = true;
  persist();
  renderStats();
}

function render() {
  applyComfortSettings();
  renderComfortControls();
  renderMobileChrome();
  setModeButtons();
  renderChips();
  renderStats();
  renderQuestion();
  renderResults();
}

function finishSession(reason = "completed") {
  clearInterval(state.timerId);
  state.timerId = null;
  state.done = true;
  state.finishReason = reason;
  render();
  recordSession();
  if (state.interacted) speak(`Session complete. You answered ${state.answers.filter(Boolean).filter((x) => x.isCorrect).length} correctly.`);
}

function choose(index) {
  const q = currentQ();
  if (!q || state.done || state.answerLocked) return;
  const a = { selectedIndex: index, correctIndex: q.answerIndex, isCorrect: index === q.answerIndex, revealed: state.mode === "mock" ? false : true, category: q.category };
  state.answers[state.idx] = a;
  updateStreak(a.isCorrect);
  render();
  if (state.mode !== "mock" && state.interacted) speak(feedbackNarration(q, a));
  if (state.mode === "mock") setTimeout(() => { if (!state.done) nextQuestion({ allowBlank: true, silent: true }); }, 320);
}

function revealAnswer() {
  if (state.mode !== "study" || state.done || state.answerLocked) return;
  const q = currentQ();
  if (!q) return;
  state.answers[state.idx] = { selectedIndex: null, correctIndex: q.answerIndex, isCorrect: false, revealed: true, category: q.category };
  render();
  if (state.interacted) speak(`Reveal answer. The correct answer is ${LETTERS[q.answerIndex]}. ${q.options[q.answerIndex]}. ${q.explanation}`);
}

function nextQuestion(opts = {}) {
  const { allowBlank = false, silent = false } = opts;
  if (state.answerLocked) return;
  if (!allowBlank && state.mode === "quiz" && !currentA()) {
    sayStatus("Pick an answer first, then move to the next question.");
    return;
  }
  if (state.idx >= state.session.length - 1) return finishSession();
  state.idx += 1;
  render();
  if (!silent && state.interacted && state.progress.settings.autoRead) readQuestion();
}

function toggleSave() {
  const q = currentQ();
  if (!q) return;
  const saved = new Set(state.progress.savedIds);
  if (saved.has(q.id)) saved.delete(q.id); else saved.add(q.id);
  state.progress.savedIds = [...saved];
  persist();
  renderStats();
  renderQuestion();
}

function startSession(mode, opts = {}) {
  const { announce = true } = opts;
  stopTalk();
  stopListen();
  clearInterval(state.timerId);
  state.mode = mode;
  state.session = buildSession(mode);
  state.idx = 0;
  state.answers = [];
  state.streak = 0;
  state.bestRun = 0;
  state.answerLocked = false;
  state.reviewCountdown = 0;
  state.readAlong = null;
  state.done = false;
  state.recorded = false;
  state.finishReason = "completed";
  state.timer = mode === "mock" ? Math.max(state.session.length * 90, 600) : null;
  if (mode === "mock") {
    state.timerId = setInterval(() => {
      state.timer -= 1;
      if (state.timer <= 0) return finishSession("time");
      renderTimer();
    }, 1000);
  } else {
    state.timerId = null;
  }
  if (isMobileAppView()) {
    setMobileView("practice");
  }
  render();
  if (announce && state.interacted) speak(`${MODES[mode].label} started. ${MODES[mode].title}`, { followQuestion: true });
}

function bind() {
  el.mobileViewBtns.forEach((button) => {
    button.addEventListener("click", () => {
      setMobileView(button.dataset.mobileView);
      render();
    });
  });
  el.mobileSettingsBtn.addEventListener("click", () => {
    setMobileView("setup");
    render();
  });
  el.mobileBackBtn.addEventListener("click", () => {
    setMobileView("practice");
    render();
  });
  el.languageBtns.forEach((button) => {
    button.addEventListener("click", () => {
      state.progress.settings.showSpanish = button.dataset.languageMode === "support";
      persist();
      render();
    });
  });
  el.fontScaleBtns.forEach((button) => {
    button.addEventListener("click", () => {
      state.progress.settings.fontScale = button.dataset.fontScale;
      persist();
      render();
    });
  });
  el.easyViewBtn.addEventListener("click", () => {
    state.progress.settings.easyView = !state.progress.settings.easyView;
    persist();
    render();
  });
  el.heroBtns.forEach((b) => b.addEventListener("click", () => { state.interacted = true; startSession(b.dataset.start); }));
  el.modeBtns.forEach((b) => b.addEventListener("click", () => { state.interacted = true; startSession(b.dataset.mode); }));
  el.chips.addEventListener("click", (e) => {
    const b = e.target.closest("[data-category]");
    if (!b) return;
    state.category = b.dataset.category;
    state.interacted = true;
    startSession(state.mode, { announce: false });
    if (state.progress.settings.autoRead) readQuestion();
  });
  el.list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-option-index]");
    if (!b) return;
    state.interacted = true;
    choose(Number(b.dataset.optionIndex));
  });
  el.strip.addEventListener("click", (e) => {
    const b = e.target.closest("[data-review-index]");
    if (!b) return;
    state.idx = Number(b.dataset.reviewIndex);
    render();
  });
  el.saveBtn.addEventListener("click", () => { state.interacted = true; toggleSave(); });
  el.readBtn.addEventListener("click", () => { state.interacted = true; readQuestion(); });
  el.readSpanishBtn.addEventListener("click", () => { state.interacted = true; readQuestionInSpanish(); });
  el.revealBtn.addEventListener("click", () => { state.interacted = true; revealAnswer(); });
  el.nextBtn.addEventListener("click", () => { state.interacted = true; nextQuestion({ allowBlank: state.mode !== "quiz" }); });
  el.restartBtn.addEventListener("click", () => { state.interacted = true; startSession(state.mode, { announce: false }); if (state.progress.settings.autoRead) readQuestion(); });
  el.englishVoice.addEventListener("change", (e) => { state.progress.settings.englishVoiceName = e.target.value; persist(); });
  el.spanishVoice.addEventListener("change", (e) => { state.progress.settings.spanishVoiceName = e.target.value; persist(); });
  el.rate.addEventListener("input", (e) => { state.progress.settings.rate = Number(e.target.value); persist(); });
  el.vol.addEventListener("input", (e) => { state.progress.settings.volume = Number(e.target.value); persist(); });
  el.autoRead.addEventListener("change", (e) => { state.progress.settings.autoRead = e.target.checked; persist(); });
  el.autoListen.addEventListener("change", (e) => { state.progress.settings.listenAfterRead = e.target.checked; persist(); });
  el.showSpanish.addEventListener("change", (e) => {
    state.progress.settings.showSpanish = e.target.checked;
    persist();
    renderQuestion();
  });
  el.listenBtn.addEventListener("click", () => { state.interacted = true; startListening(); });
  el.stopBtn.addEventListener("click", () => {
    stopTalk();
    stopListen();
    unlockAnswering();
    sayStatus("Audio stopped.");
  });
  window.addEventListener("resize", () => {
    if (isMobileAppView() && state.mobileView === "setup" && state.session.length && state.interacted) {
      setMobileView("practice");
    }
    render();
  });
}

function init() {
  applyComfortSettings();
  el.rate.value = state.progress.settings.rate;
  el.vol.value = state.progress.settings.volume;
  el.autoRead.checked = state.progress.settings.autoRead;
  el.autoListen.checked = state.progress.settings.listenAfterRead;
  el.showSpanish.checked = state.progress.settings.showSpanish;
  bind();
  initRecognition();
  populateVoices();
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = populateVoices;
  startSession("study", { announce: false });
  if (isMobileAppView()) {
    setMobileView("practice");
    render();
  }
}

init();
