const CATS = ["All topics", "Rights & Responsibilities", "Government", "Justice System", "Symbols & Identity", "History", "Indigenous & Diversity", "Geography"];
const CHAPTERS = [
  { category: "Rights & Responsibilities", label: "Rights & Responsibilities", copy: "Rights, voting, and civic duties" },
  { category: "Government", label: "Government", copy: "How Canada is governed" },
  { category: "Justice System", label: "Justice System", copy: "Laws, courts, and policing" },
  { category: "Symbols & Identity", label: "Symbols & Identity", copy: "Values, symbols, and identity" },
  { category: "History", label: "History", copy: "Key moments in Canada's story" },
  { category: "Indigenous & Diversity", label: "Indigenous & Diversity", copy: "First Peoples and diversity" },
  { category: "Geography", label: "Geography", copy: "Regions, provinces, and places" }
];
const MODES = {
  study: { label: "Study Deck", kick: "Guided learning", title: "Study one card at a time with explanations and audio support." },
  quiz: { label: "Quiz Sprint", kick: "Fast recall", title: "Answer quickly and get instant feedback after every question." },
  mock: { label: "Mock Test", kick: "Pressure mode", title: "Mixed-question practice with a timer and end-of-session review." },
};
const MOBILE_VIEWS = {
  home: { kicker: "Your Study Plan", title: "Home" },
  setup: { kicker: "App Settings", title: "Settings" },
  practice: { kicker: "Current Session", title: "Practice" },
  help: { kicker: "Support Tools", title: "Help" },
};
const LETTERS = ["A", "B", "C", "D"];
const SAVE_DELAY_MS = 320;
const RESUME_PREFIX = "maple-mentor-resume-v2";
const SPANISH_TRANSLATIONS = window.SPANISH_TRANSLATIONS || {};
const el = {
  authShell: document.querySelector("#auth-shell"),
  authModeBtns: document.querySelectorAll("[data-auth-mode]"),
  authStatus: document.querySelector("#auth-status"),
  signupForm: document.querySelector("#signup-form"),
  loginForm: document.querySelector("#login-form"),
  authInputs: document.querySelectorAll("#auth-shell input, #auth-shell button"),
  signupName: document.querySelector("#signup-name"),
  signupEmail: document.querySelector("#signup-email"),
  signupPassword: document.querySelector("#signup-password"),
  signupConfirm: document.querySelector("#signup-confirm"),
  loginEmail: document.querySelector("#login-email"),
  loginPassword: document.querySelector("#login-password"),
  homePanel: document.querySelector(".home-panel"),
  continueTitle: document.querySelector("#continue-title"),
  continueCopy: document.querySelector("#continue-copy"),
  continueMeta: document.querySelector("#continue-meta"),
  continueBtn: document.querySelector("#continue-btn"),
  homeOverall: document.querySelector("#home-overall-accuracy"),
  homeSessions: document.querySelector("#home-sessions-completed"),
  homeSaved: document.querySelector("#home-saved-count"),
  homeStreak: document.querySelector("#home-best-streak"),
  chapterGrid: document.querySelector("#chapter-grid"),
  freshHomeCopy: document.querySelector("#fresh-home-copy"),
  freshQuestionsBtn: document.querySelector("#fresh-questions-btn"),
  missedHomeCopy: document.querySelector("#missed-home-copy"),
  missedQuestionsBtn: document.querySelector("#missed-questions-btn"),
  savedHomeCopy: document.querySelector("#saved-home-copy"),
  savedCardsBtn: document.querySelector("#saved-cards-btn"),
  weakTopicsList: document.querySelector("#weak-topics-list"),
  testDateTitle: document.querySelector("#test-date-title"),
  testDateSummary: document.querySelector("#test-date-summary"),
  readinessSummary: document.querySelector("#readiness-summary"),
  openTestSettingsBtn: document.querySelector("#open-test-settings-btn"),
  testDateInput: document.querySelector("#test-date-input"),
  testPlanNote: document.querySelector("#test-plan-note"),
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
  readSpanishBtn: document.querySelector("#read-spanish-btn"),
  readyBtn: document.querySelector("#ready-answer-btn"),
  pauseBtn: document.querySelector("#pause-audio-btn"),
  replayBtn: document.querySelector("#replay-audio-btn"),
  slowerBtn: document.querySelector("#slower-audio-btn"),
  repeatOptionBtn: document.querySelector("#repeat-option-btn"),
  revealBtn: document.querySelector("#reveal-btn"),
  nextBtn: document.querySelector("#next-btn"),
  restartBtn: document.querySelector("#restart-btn"),
  stopBtn: document.querySelector("#stop-audio-btn"),
  openPracticeAudioBtn: document.querySelector("#open-practice-audio-btn"),
  strip: document.querySelector("#review-strip"),
  englishVoice: document.querySelector("#english-voice-select"),
  spanishVoice: document.querySelector("#spanish-voice-select"),
  rate: document.querySelector("#rate-range"),
  vol: document.querySelector("#volume-range"),
  autoRead: document.querySelector("#auto-read-toggle"),
  autoListen: document.querySelector("#listen-toggle"),
  showSpanish: document.querySelector("#show-spanish-toggle"),
  listenBtn: document.querySelector("#listen-btn"),
  voiceStatus: document.querySelector("#voice-status"),
  transcript: document.querySelector("#transcript-text"),
  results: document.querySelector("#results-panel"),
  resultsTitle: document.querySelector("#results-title"),
  resultsSummary: document.querySelector("#results-summary"),
  resultsFollowupNote: document.querySelector("#results-followup-note"),
  nextSetBtn: document.querySelector("#next-set-btn"),
  retryMissedBtn: document.querySelector("#retry-missed-btn"),
  studyWeakTopicBtn: document.querySelector("#study-weak-topic-btn"),
  resultsReview: document.querySelector("#results-review"),
  accountName: document.querySelector("#account-name"),
  accountEmail: document.querySelector("#account-email"),
  syncStatus: document.querySelector("#sync-status"),
  signOutBtn: document.querySelector("#sign-out-btn"),
};

const defaults = {
  sessionsCompleted: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  bestStreak: 0,
  savedIds: [],
  completedIds: [],
  missedIds: [],
  categoryStats: {},
  testDate: "",
  settings: { englishVoiceName: "", spanishVoiceName: "", rate: 1, volume: 1, autoRead: true, listenAfterRead: false, showSpanish: false, fontScale: "base", easyView: false },
};

const state = {
  authReady: false,
  user: null,
  mode: "study",
  category: "All topics",
  mobileView: "home",
  mobileReturnView: "home",
  sessionSource: { kind: "all", label: "All topics" },
  sessionLimit: null,
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
  awaitingReady: false,
  readAlong: null,
  lastReadLang: "en",
  lastOptionIndex: null,
  audioPaused: false,
  speechRunId: 0,
  saveTimerId: null,
  saveInFlight: false,
  resumeSession: null,
  seriesSeenIds: [],
  interacted: false,
  progress: clone(defaults),
};

function clone(x) { return JSON.parse(JSON.stringify(x)); }
function normalizeProgress(progress) {
  const saved = progress && typeof progress === "object" ? progress : {};
  const merged = {
    ...clone(defaults),
    ...saved,
    settings: { ...defaults.settings, ...(saved.settings || {}) },
    savedIds: Array.isArray(saved.savedIds) ? saved.savedIds : [],
    completedIds: Array.isArray(saved.completedIds) ? saved.completedIds : [],
    missedIds: Array.isArray(saved.missedIds) ? saved.missedIds : []
  };
  if (!merged.settings.englishVoiceName && merged.settings.voiceName) {
    merged.settings.englishVoiceName = merged.settings.voiceName;
  }
  merged.savedIds = uniqueIds(merged.savedIds);
  merged.completedIds = uniqueIds(merged.completedIds);
  merged.missedIds = uniqueIds(merged.missedIds);
  if (!["base", "large", "xlarge", "max"].includes(merged.settings.fontScale)) {
    merged.settings.fontScale = "base";
  }
  merged.testDate = typeof merged.testDate === "string" ? merged.testDate : "";
  return merged;
}
async function api(path, options = {}) {
  const { body, keepalive = false, ...rest } = options;
  const response = await fetch(path, {
    credentials: "same-origin",
    keepalive,
    headers: {
      "Content-Type": "application/json"
    },
    ...rest,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = payload && typeof payload === "object" && payload.error ? payload.error : "Request failed.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}
function setAuthState(mode) {
  document.body.dataset.authState = mode;
}
function setAuthMode(mode) {
  document.body.dataset.authMode = mode;
  el.authModeBtns.forEach((button) => {
    const active = button.dataset.authMode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  el.signupForm.classList.toggle("hidden", mode !== "signup");
  el.loginForm.classList.toggle("hidden", mode !== "login");
}
function setAuthMessage(message, tone = "") {
  el.authStatus.textContent = message;
  el.authStatus.classList.remove("error", "success");
  if (tone) el.authStatus.classList.add(tone);
}
function setAuthBusy(isBusy) {
  el.authInputs.forEach((element) => {
    element.disabled = isBusy;
  });
}
function updateSyncStatus(message, tone = "") {
  el.syncStatus.textContent = message;
  el.syncStatus.classList.remove("error", "success");
  if (tone) el.syncStatus.classList.add(tone);
}
function hydrateControlsFromProgress() {
  el.rate.value = state.progress.settings.rate;
  el.vol.value = state.progress.settings.volume;
  el.autoRead.checked = state.progress.settings.autoRead;
  el.autoListen.checked = state.progress.settings.listenAfterRead;
  el.showSpanish.checked = state.progress.settings.showSpanish;
  if (el.testDateInput) el.testDateInput.value = state.progress.testDate || "";
}
function updateAccountPanel() {
  if (!state.user) {
    el.accountName.textContent = "Welcome";
    el.accountEmail.textContent = "No account connected yet.";
    updateSyncStatus("Sign in to keep your own progress.");
    return;
  }
  el.accountName.textContent = state.user.name;
  el.accountEmail.textContent = state.user.email;
}
async function flushProgressSave(options = {}) {
  const { keepalive = false, silent = false } = options;
  if (!state.user || !state.authReady) return;
  if (state.saveTimerId) {
    clearTimeout(state.saveTimerId);
    state.saveTimerId = null;
  }

  const snapshot = clone(state.progress);
  state.saveInFlight = true;
  if (!silent) updateSyncStatus("Saving your progress...", "");

  try {
    await api("/api/progress", { method: "PUT", body: { progress: snapshot }, keepalive });
    state.saveInFlight = false;
    if (!silent) updateSyncStatus("All changes saved to your account.", "success");
  } catch (error) {
    state.saveInFlight = false;
    updateSyncStatus(error.status === 401 ? "Please sign in again to keep saving." : "We could not save right now. Your latest changes may not be stored.", "error");
  }
}
function persist(options = {}) {
  const { immediate = false, keepalive = false, silent = false } = options;
  if (!state.user || !state.authReady) return Promise.resolve();
  if (state.saveTimerId) {
    clearTimeout(state.saveTimerId);
    state.saveTimerId = null;
  }
  if (immediate) {
    return flushProgressSave({ keepalive, silent });
  }
  updateSyncStatus("Saving your progress...", "");
  state.saveTimerId = setTimeout(() => {
    state.saveTimerId = null;
    void flushProgressSave({ silent });
  }, SAVE_DELAY_MS);
  return Promise.resolve();
}
function resumeStoreKey(userId) {
  return `${RESUME_PREFIX}-${userId}`;
}
function loadResumeSession(userId = state.user && state.user.id) {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(resumeStoreKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.session) || !parsed.session.length) return null;
    return parsed;
  } catch {
    return null;
  }
}
function clearResumeSession(userId = state.user && state.user.id) {
  if (!userId) return;
  try {
    localStorage.removeItem(resumeStoreKey(userId));
  } catch {
    // Ignore storage cleanup issues.
  }
  if (state.user && state.user.id === userId) state.resumeSession = null;
}
function uniqueIds(list = []) {
  return [...new Set(list.filter((item) => typeof item === "string" && item.trim()))];
}
function questionIdAt(index) {
  const question = QUESTION_BANK[index];
  return question ? question.id : "";
}
function sessionQuestionIds(session = state.session) {
  return uniqueIds(session.map((index) => questionIdAt(index)).filter(Boolean));
}
function storeResumeSession() {
  if (!state.user) return;
  if (!state.session.length || state.done) {
    clearResumeSession();
    return;
  }
  const snapshot = {
    mode: state.mode,
    source: clone(state.sessionSource),
    sessionLimit: state.sessionLimit,
    session: [...state.session],
    idx: state.idx,
    answers: clone(state.answers),
    streak: state.streak,
    bestRun: state.bestRun,
    timer: state.timer,
    seriesSeenIds: [...state.seriesSeenIds],
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(resumeStoreKey(state.user.id), JSON.stringify(snapshot));
    state.resumeSession = snapshot;
  } catch {
    // Ignore local storage write issues.
  }
}
function acc(c, a) { return a ? Math.round((c / a) * 100) : 0; }
function fmt(sec) { const m = Math.floor(sec / 60); const s = sec % 60; return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; }
function currentQ() { return QUESTION_BANK[state.session[state.idx]] || null; }
function currentA() { return state.answers[state.idx] || null; }
function currentSpanish() { const q = currentQ(); return q ? SPANISH_TRANSLATIONS[q.id] || null : null; }
function sayStatus(text) { el.voiceStatus.textContent = text; }
function shuffle(arr) { const x = [...arr]; for (let i = x.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
function stopTalk() {
  state.speechRunId += 1;
  state.audioPaused = false;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  state.readAlong = null;
  updateReadingBanner();
  applyReadAlongState();
  updateMiniPlayer();
}
function stopListen() { if (state.rec && state.listening) state.rec.stop(); }

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

function setMobileView(view, opts = {}) {
  const { remember = true } = opts;
  state.mobileView = view;
  if (remember && view !== "setup") state.mobileReturnView = view;
  document.body.dataset.mobileView = view;
}

function sourceLabel(source = state.sessionSource) {
  if (!source || source.kind === "all") return "All Topics";
  if (source.kind === "saved") return "Saved Cards";
  if (source.kind === "fresh") return source.label || "Fresh Questions";
  if (source.kind === "ids") return source.label || "Focused Review";
  return source.label || source.category || "Selected Topic";
}

function availableSavedIndexes() {
  const saved = new Set(state.progress.savedIds);
  return QUESTION_BANK.map((question, index) => ({ question, index }))
    .filter(({ question }) => saved.has(question.id))
    .map(({ index }) => index);
}

function baseIndexesForSource(source = state.sessionSource) {
  if (!source || source.kind === "all") {
    return QUESTION_BANK.map((_, index) => index);
  }
  if (source.kind === "saved") {
    return availableSavedIndexes();
  }
  if (source.kind === "fresh") {
    return baseIndexesForSource(source.baseSource || { kind: "all", label: "All topics" });
  }
  if (source.kind === "ids") {
    const ids = new Set(Array.isArray(source.ids) ? source.ids : []);
    return QUESTION_BANK.map((question, index) => ({ question, index }))
      .filter(({ question }) => ids.has(question.id))
      .map(({ index }) => index);
  }
  return QUESTION_BANK.map((question, index) => ({ question, index }))
    .filter(({ question }) => question.category === source.category)
    .map(({ index }) => index);
}

function availableFreshIndexes(source = { kind: "all", label: "All topics" }) {
  const completed = new Set(state.progress.completedIds);
  return baseIndexesForSource(source).filter((index) => !completed.has(questionIdAt(index)));
}

function availableMissedIndexes() {
  const missed = new Set(state.progress.missedIds);
  return QUESTION_BANK.map((question, index) => ({ question, index }))
    .filter(({ question }) => missed.has(question.id))
    .map(({ index }) => index);
}

function indexesForSource(source = state.sessionSource) {
  if (source && source.kind === "fresh") {
    return availableFreshIndexes(source.baseSource || { kind: "all", label: "All topics" });
  }
  return baseIndexesForSource(source);
}

function buildSourceFromCategory(category) {
  if (!category || category === "All topics") {
    return { kind: "all", label: "All topics" };
  }
  return { kind: "category", category, label: category };
}

function questionCountForCategory(category) {
  return QUESTION_BANK.filter((question) => question.category === category).length;
}

function weakestTopics(limit = 3) {
  return Object.entries(state.progress.categoryStats || {})
    .map(([category, stats]) => ({ category, answered: stats.answered || 0, correct: stats.correct || 0, accuracy: acc(stats.correct || 0, stats.answered || 0) }))
    .filter((item) => item.answered > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered)
    .slice(0, limit);
}

function formatFriendlyDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function dayCountdown(dateString) {
  if (!dateString) return null;
  const target = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  return { days: diff, formatted: formatFriendlyDate(dateString) };
}

function readinessText() {
  const overall = acc(state.progress.totalCorrect, state.progress.totalAnswered);
  if (!state.progress.totalAnswered) return "Start with a 3-question set so Maple Mentor can begin measuring your readiness.";
  if (overall >= 85) return "You look strong. Keep rotating through weak topics and do a full mock regularly.";
  if (overall >= 70) return "You are building confidence. Mix short sets with chapter review and saved cards.";
  return "Use Study by Chapter and your saved cards before taking another full mock.";
}

function formatResumeTime(updatedAt) {
  if (!updatedAt) return "Saved on this device.";
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "Saved on this device.";
  return `Updated ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
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
  if (state.awaitingReady) {
    el.readingBanner.textContent = "Take your time to review the question. Tap “I'm Ready To Answer” when you want to choose.";
    el.readingBanner.classList.remove("hidden");
    el.readingBanner.classList.add("reviewing");
    return;
  }

  if (state.readAlong) {
    const spoken = state.readAlong.kind === "prompt" ? "Reading question" : `Reading choice ${LETTERS[state.readAlong.index]}`;
    el.readingBanner.textContent = spoken;
    el.readingBanner.classList.remove("hidden");
    el.readingBanner.classList.remove("reviewing");
    return;
  }

  el.readingBanner.textContent = "";
  el.readingBanner.classList.add("hidden");
  el.readingBanner.classList.remove("reviewing");
}

function updateMiniPlayer() {
  const q = currentQ();
  const speaking = "speechSynthesis" in window && (speechSynthesis.speaking || speechSynthesis.paused);
  el.pauseBtn.disabled = !speaking;
  el.pauseBtn.textContent = "speechSynthesis" in window && speechSynthesis.paused ? "Resume" : "Pause";
  el.replayBtn.disabled = !q;
  el.slowerBtn.disabled = !q;
  el.repeatOptionBtn.disabled = !q || state.lastOptionIndex === null;
  el.readyBtn.classList.toggle("hidden", !state.awaitingReady);
  el.readyBtn.disabled = !state.awaitingReady;
}

function unlockAnswering() {
  state.answerLocked = false;
  state.awaitingReady = false;
  state.readAlong = null;
  updateReadingBanner();
  applyReadAlongState();
  updateActions(currentQ(), currentA());
}

function enterReviewState() {
  state.readAlong = null;
  state.awaitingReady = true;
  state.answerLocked = true;
  applyReadAlongState();
  updateReadingBanner();
  updateActions(currentQ(), currentA());
}

function buildSession(mode, source, sessionLimit, options = {}) {
  const { excludeIds = [] } = options;
  const excluded = new Set(excludeIds);
  const pool = indexesForSource(source).filter((index) => !excluded.has(questionIdAt(index)));
  if (mode === "study") return sessionLimit ? pool.slice(0, Math.min(sessionLimit, pool.length)) : pool;
  if (mode === "quiz") return shuffle(pool).slice(0, Math.min(sessionLimit || 10, pool.length));
  return shuffle(pool).slice(0, Math.min(sessionLimit || 20, pool.length));
}

function currentSessionEntries() {
  return state.session.map((questionIndex, index) => ({
    index,
    questionIndex,
    question: QUESTION_BANK[questionIndex],
    answer: state.answers[index] || null
  })).filter((entry) => entry.question);
}

function answeredSessionEntries() {
  return currentSessionEntries().filter((entry) => entry.answer && entry.answer.selectedIndex !== null);
}

function missedSessionEntries() {
  return answeredSessionEntries().filter((entry) => !entry.answer.isCorrect);
}

function followUpPool() {
  const seen = new Set(state.seriesSeenIds);
  return indexesForSource(state.sessionSource).filter((index) => !seen.has(questionIdAt(index)));
}

function weakestCategoryForSession() {
  const categories = byCategory(answeredSessionEntries().map((entry) => entry.answer));
  return categories.length ? categories[categories.length - 1] : weakestTopics(1)[0] || null;
}

function renderStats() {
  el.count.textContent = QUESTION_BANK.length;
  const overall = `${acc(state.progress.totalCorrect, state.progress.totalAnswered)}%`;
  el.overall.textContent = overall;
  el.sessions.textContent = state.progress.sessionsCompleted;
  el.streak.textContent = state.progress.bestStreak;
  el.saved.textContent = state.progress.savedIds.length;
  if (el.homeOverall) el.homeOverall.textContent = overall;
  if (el.homeSessions) el.homeSessions.textContent = state.progress.sessionsCompleted;
  if (el.homeSaved) el.homeSaved.textContent = state.progress.savedIds.length;
  if (el.homeStreak) el.homeStreak.textContent = state.progress.bestStreak;
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
  el.mobileBackBtn.classList.toggle("hidden", state.mobileView !== "setup");
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

function renderHome() {
  const resume = state.resumeSession;
  if (resume && Array.isArray(resume.session) && resume.session.length) {
    el.continueTitle.textContent = `${MODES[resume.mode].label} in ${sourceLabel(resume.source)}`;
    el.continueCopy.textContent = `You stopped on question ${Math.min(resume.idx + 1, resume.session.length)} of ${resume.session.length}.`;
    el.continueMeta.textContent = formatResumeTime(resume.updatedAt);
    el.continueBtn.textContent = "Continue Session";
  } else {
    el.continueTitle.textContent = "No unfinished session yet";
    el.continueCopy.textContent = "Start small with 3 questions, then come back later right where you stopped.";
    el.continueMeta.textContent = "Your latest study path will appear here.";
    el.continueBtn.textContent = "Start 3 Questions";
  }

  el.chapterGrid.innerHTML = CHAPTERS.map((chapter) => `<button class="chapter-card" type="button" data-chapter="${chapter.category}">${chapter.label}<small>${questionCountForCategory(chapter.category)} questions</small></button>`).join("");

  const freshCount = availableFreshIndexes().length;
  el.freshHomeCopy.textContent = freshCount
    ? `${freshCount} ${freshCount === 1 ? "question is" : "questions are"} still fresh for you.`
    : "You have already seen every question in this bank. Use missed questions or weak topics to keep practicing.";
  el.freshQuestionsBtn.disabled = freshCount === 0;
  el.freshQuestionsBtn.textContent = freshCount ? `Practice ${Math.min(5, freshCount)} Fresh ${Math.min(5, freshCount) === 1 ? "Question" : "Questions"}` : "All Questions Seen";

  const missedCount = availableMissedIndexes().length;
  el.missedHomeCopy.textContent = missedCount
    ? `${missedCount} ${missedCount === 1 ? "question still needs" : "questions still need"} another look.`
    : "When you miss a question, Maple Mentor will keep it here for focused review.";
  el.missedQuestionsBtn.disabled = missedCount === 0;
  el.missedQuestionsBtn.textContent = missedCount ? `Review ${missedCount} Missed ${missedCount === 1 ? "Question" : "Questions"}` : "No Missed Questions Yet";

  const savedCount = state.progress.savedIds.length;
  el.savedHomeCopy.textContent = savedCount
    ? `${savedCount} saved ${savedCount === 1 ? "card is" : "cards are"} ready for review.`
    : "Save cards during practice and they will appear here for focused review.";
  el.savedCardsBtn.disabled = savedCount === 0;
  el.savedCardsBtn.textContent = savedCount ? `Review ${savedCount} Saved ${savedCount === 1 ? "Card" : "Cards"}` : "No Saved Cards Yet";

  const weakTopics = weakestTopics();
  if (!weakTopics.length) {
    el.weakTopicsList.innerHTML = '<p class="home-empty">Complete a few questions and Maple Mentor will highlight the topics that need more review.</p>';
  } else {
    el.weakTopicsList.innerHTML = weakTopics.map((topic) => `<button class="weak-topic-btn" type="button" data-weak-topic="${topic.category}">${topic.category}<small>${topic.accuracy}% accuracy across ${topic.answered} answers</small></button>`).join("");
  }

  const countdown = dayCountdown(state.progress.testDate);
  if (!countdown) {
    el.testDateTitle.textContent = "Set your citizenship test date";
    el.testDateSummary.textContent = "Add your date in Settings to see a countdown and a study check-in.";
    el.testPlanNote.textContent = "Choose a date to see a countdown and readiness summary on your Home screen.";
  } else if (countdown.days > 1) {
    el.testDateTitle.textContent = `${countdown.days} days until test day`;
    el.testDateSummary.textContent = `Your planned test date is ${countdown.formatted}.`;
    el.testPlanNote.textContent = `You are counting down to ${countdown.formatted}.`;
  } else if (countdown.days === 1) {
    el.testDateTitle.textContent = "Your test is tomorrow";
    el.testDateSummary.textContent = `Your planned test date is ${countdown.formatted}.`;
    el.testPlanNote.textContent = `Tomorrow is your planned test date: ${countdown.formatted}.`;
  } else if (countdown.days === 0) {
    el.testDateTitle.textContent = "Your test is today";
    el.testDateSummary.textContent = `Today is your planned test date: ${countdown.formatted}.`;
    el.testPlanNote.textContent = "Take a calm final review and trust what you know.";
  } else {
    el.testDateTitle.textContent = "Your test date has passed";
    el.testDateSummary.textContent = `Your last saved date was ${countdown.formatted}.`;
    el.testPlanNote.textContent = "Update your test date anytime if it has changed.";
  }
  el.readinessSummary.textContent = readinessText();
}

function applyAuthenticatedSession(payload) {
  state.user = payload.user;
  state.authReady = true;
  state.progress = normalizeProgress(payload.progress);
  state.resumeSession = loadResumeSession(payload.user.id);
  hydrateControlsFromProgress();
  applyComfortSettings();
  stopTalk();
  stopListen();
  clearInterval(state.timerId);
  state.timerId = null;
  state.session = [];
  state.answers = [];
  state.idx = 0;
  state.timer = null;
  state.done = false;
  state.category = "All topics";
  state.sessionSource = { kind: "all", label: "All topics" };
  state.sessionLimit = null;
  state.seriesSeenIds = [];
  state.mobileReturnView = "home";
  setMobileView("home");
  setAuthState("signed-in");
  setAuthMessage(`Welcome back, ${payload.user.name}.`, "success");
  updateAccountPanel();
  updateSyncStatus("All changes saved to your account.", "success");
  populateVoices();
  render();
}

function clearAuthenticatedSession(message = "Sign in to continue your practice.") {
  state.user = null;
  state.authReady = true;
  state.progress = clone(defaults);
  state.resumeSession = null;
  state.session = [];
  state.answers = [];
  state.idx = 0;
  state.timer = null;
  state.done = false;
  state.category = "All topics";
  state.sessionSource = { kind: "all", label: "All topics" };
  state.sessionLimit = null;
  state.seriesSeenIds = [];
  el.signupForm.reset();
  el.loginForm.reset();
  hydrateControlsFromProgress();
  stopTalk();
  stopListen();
  state.mobileReturnView = "home";
  setMobileView("home");
  setAuthState("signed-out");
  setAuthMode("signup");
  setAuthMessage(message);
  updateAccountPanel();
}

async function restoreSession() {
  setAuthState("loading");
  setAuthMessage("Checking for your saved account...");
  try {
    const payload = await api("/api/auth/session", { method: "GET" });
    applyAuthenticatedSession(payload);
  } catch (error) {
    clearAuthenticatedSession(error.status === 401 ? "Create an account or sign in to keep your own progress." : "We could not reach the account service. Please try again.");
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const name = el.signupName.value.trim();
  const email = el.signupEmail.value.trim();
  const password = el.signupPassword.value;
  const confirmPassword = el.signupConfirm.value;

  if (password !== confirmPassword) {
    setAuthMessage("Passwords do not match yet.", "error");
    el.signupConfirm.focus();
    return;
  }

  setAuthBusy(true);
  setAuthMessage("Creating your account...");
  try {
    const payload = await api("/api/auth/signup", {
      method: "POST",
      body: { name, email, password }
    });
    el.signupForm.reset();
    applyAuthenticatedSession(payload);
  } catch (error) {
    setAuthMessage(error.message, "error");
  } finally {
    setAuthBusy(false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = el.loginEmail.value.trim();
  const password = el.loginPassword.value;

  setAuthBusy(true);
  setAuthMessage("Signing you in...");
  try {
    const payload = await api("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });
    el.loginForm.reset();
    applyAuthenticatedSession(payload);
  } catch (error) {
    setAuthMessage(error.message, "error");
  } finally {
    setAuthBusy(false);
  }
}

async function signOut() {
  await persist({ immediate: true, silent: true });
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch {
    // Best effort logout.
  }
  clearAuthenticatedSession("You have signed out. Sign back in when you are ready.");
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

function createUtterance(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = voiceForLanguage(lang);
  if (voice) utterance.voice = voice;
  utterance.lang = lang === "es" ? "es-ES" : "en-CA";
  utterance.rate = Number(state.progress.settings.rate);
  utterance.volume = Number(state.progress.settings.volume);
  return utterance;
}

function speak(text, opts = {}) {
  if (!("speechSynthesis" in window)) {
    sayStatus("Text-to-speech is not available in this browser.");
    return;
  }
  const { followQuestion = false, lang = "en", onstart = null, onend = null } = opts;
  stopTalk();
  const runId = state.speechRunId;
  const u = createUtterance(text, lang);
  u.onstart = () => {
    if (runId !== state.speechRunId) return;
    state.lastReadLang = lang;
    sayStatus("Reading aloud.");
    updateMiniPlayer();
    if (onstart) onstart();
  };
  u.onend = () => {
    if (runId !== state.speechRunId) return;
    if (followQuestion) {
      return setTimeout(() => {
        if (runId !== state.speechRunId) return;
        readQuestion();
      }, 140);
    }
    updateMiniPlayer();
    if (onend) onend();
    if (state.progress.settings.listenAfterRead && state.recOk) return startListening();
    sayStatus("Audio ready.");
  };
  u.onerror = () => {
    if (runId !== state.speechRunId) return;
    updateMiniPlayer();
    sayStatus("Audio could not finish.");
  };
  speechSynthesis.speak(u);
}

function speakSingleOption(lang, index) {
  const q = currentQ();
  const t = currentSpanish();
  if (!q || index === null || index === undefined) return;
  const options = lang === "es" && t ? t.options : q.options;
  const optionText = options[index];
  if (!optionText) return;
  speak(`${LETTERS[index]}. ${optionText}`, {
    lang,
    onstart: () => {
      state.readAlong = { lang, kind: "option", index };
      state.lastReadLang = lang;
      state.lastOptionIndex = index;
      updateReadingBanner();
      applyReadAlongState();
    },
    onend: () => {
      state.readAlong = null;
      updateReadingBanner();
      applyReadAlongState();
      sayStatus("Choice replayed.");
    }
  });
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
  state.lastReadLang = lang;
  state.lastOptionIndex = null;
  const segments = lang === "es"
    ? [{ kind: "prompt", text: t.prompt }, ...t.options.map((option, index) => ({ kind: "option", index, text: `${LETTERS[index]}. ${option}` }))]
    : [{ kind: "prompt", text: q.prompt }, ...q.options.map((option, index) => ({ kind: "option", index, text: `${LETTERS[index]}. ${option}` }))];

  const shouldLock = !currentA();
  if (shouldLock) {
    state.answerLocked = true;
    state.awaitingReady = false;
  }
  updateActions(currentQ(), currentA());
  updateReadingBanner();

  const speakSegment = (segmentIndex) => {
    if (runId !== state.speechRunId) return;
    const segment = segments[segmentIndex];
    if (!segment) {
      if (shouldLock) {
        enterReviewState();
      } else {
        unlockAnswering();
      }
      sayStatus("Audio ready.");
      updateMiniPlayer();
      return;
    }

    const utterance = createUtterance(segment.text, lang);
    utterance.onstart = () => {
      if (runId !== state.speechRunId) return;
      state.lastReadLang = lang;
      if (segment.kind === "option") state.lastOptionIndex = segment.index;
      state.readAlong = { lang, kind: segment.kind, index: segment.index ?? null };
      updateReadingBanner();
      applyReadAlongState();
      updateMiniPlayer();
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
      updateMiniPlayer();
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

function togglePauseAudio() {
  if (!("speechSynthesis" in window)) return;
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    state.audioPaused = false;
    sayStatus("Reading resumed.");
  } else if (speechSynthesis.speaking) {
    speechSynthesis.pause();
    state.audioPaused = true;
    sayStatus("Reading paused.");
  }
  updateMiniPlayer();
}

function replayAudio() {
  if (!currentQ()) return;
  if (state.lastReadLang === "es" && currentSpanish()) {
    readQuestionInSpanish();
    return;
  }
  readQuestion();
}

function slowDownAudio() {
  state.progress.settings.rate = Math.max(0.7, Number((state.progress.settings.rate - 0.1).toFixed(2)));
  el.rate.value = state.progress.settings.rate;
  persist();
  sayStatus(`Speaking pace set to ${state.progress.settings.rate.toFixed(2)}.`);
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
  if (n.includes("repeat")) return replayAudio();
  if (n.includes("spanish") || n.includes("espanol")) return readQuestionInSpanish();
  if (n.includes("continue")) return restoreResumeSession();
  if (n.includes("next")) return nextQuestion({ allowBlank: state.mode !== "quiz" });
  if (n.includes("reveal")) return revealAnswer();
  if (n.includes("study")) return startSession("study", { source: buildSourceFromCategory(state.category) });
  if (n.includes("quiz")) return startSession("quiz", { source: buildSourceFromCategory(state.category) });
  if (n.includes("mock")) return startSession("mock", { source: { kind: "all", label: "All topics" }, sessionLimit: 20 });
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
  updateMiniPlayer();
}

function renderQuestion() {
  const q = currentQ();
  const a = currentA();
  const m = MODES[state.mode];
  el.kick.textContent = state.session.length ? `${m.kick} • ${sourceLabel()}` : "Ready when you are";
  el.title.textContent = state.session.length ? m.title : "Use Home to choose a practice path";
  el.progress.textContent = state.session.length ? `${Math.min(state.idx + 1, state.session.length)} / ${state.session.length}` : "0 / 0";
  if (!q) {
    el.cat.textContent = "Home is the best place to begin";
    el.q.textContent = "Choose a quick set, a chapter review, saved cards, or continue where you left off from Home.";
    el.list.innerHTML = "";
    el.strip.innerHTML = "";
    el.fbTitle.textContent = "Start from Home";
    el.fbCopy.textContent = "Pick a short session if you want a gentle way to begin.";
    renderTranslation(null, null);
    updateReadingBanner();
    updateActions(null, null);
    return;
  }
  el.cat.textContent = state.sessionSource.kind === "saved" ? `${q.category} • Saved Cards` : q.category;
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

function followUpNote(nextCount, missedCount, weakestCategory) {
  if (nextCount > 0) return `${nextCount} more ${nextCount === 1 ? "question is" : "questions are"} ready in ${sourceLabel()}.`;
  if (missedCount > 0) return `Retry the missed questions now, or slow down with ${weakestCategory ? weakestCategory.category : "a weaker topic"} next.`;
  return "You finished this path. Fresh questions and weak-topic review are ready on Home.";
}

function renderResults() {
  if (!state.done) {
    el.results.classList.add("hidden");
    return;
  }
  const answeredEntries = answeredSessionEntries();
  const answered = answeredEntries.map((entry) => entry.answer);
  const correct = answered.filter((x) => x.isCorrect);
  const score = acc(correct.length, answered.length);
  const categories = byCategory(answered);
  const missed = missedSessionEntries();
  const nextPool = followUpPool();
  const nextCount = Math.min(state.sessionLimit || state.session.length || 5, nextPool.length);
  const weakestCategory = weakestCategoryForSession();
  el.results.classList.remove("hidden");
  el.resultsTitle.textContent = `${MODES[state.mode].label}: ${state.finishReason === "time" ? "Time reached" : "Session complete"}`;
  el.resultsSummary.innerHTML = `<div class="results-grid"><article class="result-chip"><strong>${score}%</strong><span>Session accuracy</span></article><article class="result-chip"><strong>${correct.length} / ${answered.length || state.session.length}</strong><span>Correct answers</span></article><article class="result-chip"><strong>${state.bestRun}</strong><span>Best correct streak</span></article></div><p>${resultNote(score, categories[0], categories[categories.length - 1])}</p>`;
  el.nextSetBtn.disabled = nextCount === 0;
  el.nextSetBtn.textContent = nextCount ? `Next ${nextCount} ${nextCount === 1 ? "Question" : "Questions"}` : "No More In This Path";
  el.retryMissedBtn.disabled = missed.length === 0;
  el.retryMissedBtn.textContent = missed.length ? `Practice ${missed.length} Missed ${missed.length === 1 ? "Question" : "Questions"}` : "No Missed Questions";
  el.studyWeakTopicBtn.disabled = !weakestCategory;
  el.studyWeakTopicBtn.textContent = weakestCategory ? `Study ${weakestCategory.category}` : "Study Weak Topic";
  el.resultsFollowupNote.textContent = followUpNote(nextCount, missed.length, weakestCategory);
  el.resultsReview.innerHTML = missed.length
    ? missed.map(({ question, index }) => `<article class="review-item"><h3>Question ${index + 1}: ${question.prompt}</h3><p><strong>Correct answer:</strong> ${LETTERS[question.answerIndex]}. ${question.options[question.answerIndex]}</p><p>${question.explanation}</p></article>`).join("")
    : `<article class="review-item"><h3>Strong finish</h3><p>You cleared every answered question in this session. Try a fresh set or study a weak topic to keep building confidence.</p></article>`;
}

function recordSession() {
  if (state.recorded) return;
  const answeredEntries = answeredSessionEntries();
  const answered = answeredEntries.map((entry) => entry.answer);
  const correct = answered.filter((x) => x.isCorrect);
  const completedIds = new Set(state.progress.completedIds);
  const missedIds = new Set(state.progress.missedIds);
  state.progress.sessionsCompleted += 1;
  state.progress.totalAnswered += answered.length;
  state.progress.totalCorrect += correct.length;
  state.progress.bestStreak = Math.max(state.progress.bestStreak, state.bestRun);
  answeredEntries.forEach(({ question, answer }) => {
    const current = state.progress.categoryStats[answer.category] || { answered: 0, correct: 0 };
    current.answered += 1;
    if (answer.isCorrect) current.correct += 1;
    state.progress.categoryStats[answer.category] = current;
    completedIds.add(question.id);
    if (answer.isCorrect) missedIds.delete(question.id);
    else missedIds.add(question.id);
  });
  state.progress.completedIds = [...completedIds];
  state.progress.missedIds = [...missedIds];
  state.recorded = true;
  persist({ immediate: true });
  renderStats();
}

function stopSessionTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
}

function startMockTimer(initialTimer) {
  stopSessionTimer();
  state.timer = initialTimer;
  state.timerId = setInterval(() => {
    state.timer -= 1;
    if (state.timer <= 0) {
      finishSession("time");
      return;
    }
    renderTimer();
    storeResumeSession();
  }, 1000);
}

function render() {
  applyComfortSettings();
  renderComfortControls();
  renderMobileChrome();
  updateAccountPanel();
  renderHome();
  setModeButtons();
  renderChips();
  renderStats();
  renderQuestion();
  renderResults();
}

function applySessionState(snapshot, opts = {}) {
  const { jumpToPractice = true } = opts;
  stopTalk();
  stopListen();
  stopSessionTimer();
  state.mode = snapshot.mode;
  state.sessionSource = snapshot.source || { kind: "all", label: "All topics" };
  state.sessionLimit = snapshot.sessionLimit || null;
  state.category = state.sessionSource.kind === "category" ? state.sessionSource.category : "All topics";
  state.session = Array.isArray(snapshot.session) ? snapshot.session : [];
  state.idx = Math.min(snapshot.idx || 0, Math.max(state.session.length - 1, 0));
  state.answers = Array.isArray(snapshot.answers) ? snapshot.answers : [];
  state.streak = snapshot.streak || 0;
  state.bestRun = snapshot.bestRun || 0;
  state.answerLocked = false;
  state.awaitingReady = false;
  state.readAlong = null;
  state.done = false;
  state.recorded = false;
  state.finishReason = "completed";
  state.lastOptionIndex = null;
  state.seriesSeenIds = uniqueIds([...(Array.isArray(snapshot.seriesSeenIds) ? snapshot.seriesSeenIds : []), ...sessionQuestionIds(state.session)]);
  if (state.mode === "mock") {
    startMockTimer(snapshot.timer || Math.max(state.session.length * 90, 600));
  } else {
    state.timer = null;
  }
  storeResumeSession();
  if (isMobileAppView() && jumpToPractice) setMobileView("practice");
  render();
}

function restoreResumeSession() {
  const snapshot = state.resumeSession || loadResumeSession();
  if (snapshot && snapshot.session && snapshot.session.length) {
    applySessionState(snapshot);
    return;
  }
  startSession("quiz", { sessionLimit: 3, source: { kind: "all", label: "All topics" } });
}

function finishSession(reason = "completed") {
  stopSessionTimer();
  state.done = true;
  state.finishReason = reason;
  clearResumeSession();
  recordSession();
  render();
  if (state.interacted) speak(`Session complete. You answered ${answeredSessionEntries().filter((entry) => entry.answer.isCorrect).length} correctly.`);
}

function choose(index) {
  const q = currentQ();
  if (!q || state.done || state.answerLocked) return;
  state.lastOptionIndex = index;
  const a = { selectedIndex: index, correctIndex: q.answerIndex, isCorrect: index === q.answerIndex, revealed: state.mode === "mock" ? false : true, category: q.category };
  state.answers[state.idx] = a;
  updateStreak(a.isCorrect);
  storeResumeSession();
  render();
  if (state.mode !== "mock" && state.interacted) speak(feedbackNarration(q, a));
  if (state.mode === "mock") setTimeout(() => { if (!state.done) nextQuestion({ allowBlank: true, silent: true }); }, 320);
}

function revealAnswer() {
  if (state.mode !== "study" || state.done || state.answerLocked) return;
  const q = currentQ();
  if (!q) return;
  state.answers[state.idx] = { selectedIndex: null, correctIndex: q.answerIndex, isCorrect: false, revealed: true, category: q.category };
  storeResumeSession();
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
  storeResumeSession();
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
  renderHome();
  renderQuestion();
}

function startSession(mode, opts = {}) {
  const {
    announce = true,
    source = buildSourceFromCategory(state.category),
    sessionLimit = null,
    sessionOverride = null,
    carrySeriesIds = []
  } = opts;
  stopTalk();
  stopListen();
  stopSessionTimer();
  state.mode = mode;
  state.sessionSource = source;
  state.sessionLimit = sessionLimit;
  state.category = source.kind === "category" ? source.category : "All topics";
  state.session = Array.isArray(sessionOverride) ? sessionOverride : buildSession(mode, source, sessionLimit);
  state.idx = 0;
  state.answers = [];
  state.streak = 0;
  state.bestRun = 0;
  state.answerLocked = false;
  state.awaitingReady = false;
  state.readAlong = null;
  state.done = false;
  state.recorded = false;
  state.finishReason = "completed";
  state.seriesSeenIds = uniqueIds([...carrySeriesIds, ...sessionQuestionIds(state.session)]);
  state.lastOptionIndex = null;
  if (mode === "mock") {
    startMockTimer(Math.max(state.session.length * 90, 600));
  } else {
    state.timer = null;
  }
  storeResumeSession();
  if (isMobileAppView()) setMobileView("practice");
  render();
  if (announce && state.interacted) speak(`${MODES[mode].label} started. ${MODES[mode].title}`, { followQuestion: true });
}

function startQuestionIdSession(ids, options = {}) {
  const {
    mode = "study",
    label = "Focused Review",
    sessionLimit = null
  } = options;
  const source = { kind: "ids", label, ids: uniqueIds(ids) };
  const session = buildSession(mode, source, sessionLimit);
  if (!session.length) return false;
  startSession(mode, { source, sessionLimit, sessionOverride: session });
  return true;
}

function startFreshQuestions(limit = 5) {
  const freshCount = availableFreshIndexes().length;
  if (!freshCount) return false;
  const nextLimit = Math.min(limit, freshCount);
  const source = { kind: "fresh", label: "Fresh Questions", baseSource: { kind: "all", label: "All topics" } };
  const session = buildSession("quiz", source, nextLimit);
  if (!session.length) return false;
  startSession("quiz", { source, sessionLimit: nextLimit, sessionOverride: session });
  return true;
}

function startNextSet() {
  const nextLimit = state.sessionLimit || state.session.length || 5;
  const session = buildSession(state.mode, state.sessionSource, nextLimit, { excludeIds: state.seriesSeenIds });
  if (!session.length) return false;
  startSession(state.mode, {
    source: state.sessionSource,
    sessionLimit: state.sessionLimit,
    sessionOverride: session,
    carrySeriesIds: state.seriesSeenIds
  });
  return true;
}

function startMissedRetry() {
  const missedIds = missedSessionEntries().map((entry) => entry.question.id);
  return startQuestionIdSession(missedIds, { label: "Missed Questions", mode: "study" });
}

function startWeakTopicReview() {
  const weakest = weakestCategoryForSession();
  if (!weakest) return false;
  startSession("study", { source: { kind: "category", category: weakest.category, label: weakest.category } });
  return true;
}

function bind() {
  el.authModeBtns.forEach((button) => {
    button.addEventListener("click", () => {
      setAuthMode(button.dataset.authMode);
      setAuthMessage(button.dataset.authMode === "signup" ? "Create an account to keep your own progress." : "Sign in to continue where you left off.");
    });
  });
  el.signupForm.addEventListener("submit", handleSignup);
  el.loginForm.addEventListener("submit", handleLogin);
  el.signOutBtn.addEventListener("click", () => {
    void signOut();
  });
  el.continueBtn.addEventListener("click", () => {
    state.interacted = true;
    restoreResumeSession();
  });
  el.freshQuestionsBtn.addEventListener("click", () => {
    state.interacted = true;
    startFreshQuestions(5);
  });
  el.missedQuestionsBtn.addEventListener("click", () => {
    if (!state.progress.missedIds.length) return;
    state.interacted = true;
    startQuestionIdSession(state.progress.missedIds, { label: "Missed Questions", mode: "study" });
  });
  el.savedCardsBtn.addEventListener("click", () => {
    if (!state.progress.savedIds.length) return;
    state.interacted = true;
    startSession("study", { source: { kind: "saved", label: "Saved Cards" } });
  });
  el.openTestSettingsBtn.addEventListener("click", () => {
    setMobileView("setup", { remember: false });
    render();
  });
  el.openPracticeAudioBtn.addEventListener("click", () => {
    setMobileView("practice");
    render();
  });
  el.nextSetBtn.addEventListener("click", () => {
    if (el.nextSetBtn.disabled) return;
    state.interacted = true;
    startNextSet();
  });
  el.retryMissedBtn.addEventListener("click", () => {
    if (el.retryMissedBtn.disabled) return;
    state.interacted = true;
    startMissedRetry();
  });
  el.studyWeakTopicBtn.addEventListener("click", () => {
    if (el.studyWeakTopicBtn.disabled) return;
    state.interacted = true;
    startWeakTopicReview();
  });
  el.homePanel.addEventListener("click", (event) => {
    const quickButton = event.target.closest("[data-quick-mode]");
    if (quickButton) {
      state.interacted = true;
      startSession(quickButton.dataset.quickMode, {
        source: { kind: "all", label: "All topics" },
        sessionLimit: Number(quickButton.dataset.quickLimit)
      });
      return;
    }
    const chapterButton = event.target.closest("[data-chapter]");
    if (chapterButton) {
      state.interacted = true;
      const category = chapterButton.dataset.chapter;
      startSession("study", { source: { kind: "category", category, label: category } });
      return;
    }
    const weakButton = event.target.closest("[data-weak-topic]");
    if (weakButton) {
      state.interacted = true;
      const category = weakButton.dataset.weakTopic;
      startSession("study", { source: { kind: "category", category, label: category } });
    }
  });
  el.mobileViewBtns.forEach((button) => {
    button.addEventListener("click", () => {
      setMobileView(button.dataset.mobileView);
      render();
    });
  });
  el.mobileSettingsBtn.addEventListener("click", () => {
    state.mobileReturnView = state.mobileView === "setup" ? state.mobileReturnView : state.mobileView;
    setMobileView("setup", { remember: false });
    render();
  });
  el.mobileBackBtn.addEventListener("click", () => {
    setMobileView(state.mobileReturnView || "home");
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
  el.testDateInput.addEventListener("change", (event) => {
    state.progress.testDate = event.target.value || "";
    persist();
    renderHome();
  });
  el.heroBtns.forEach((b) => b.addEventListener("click", () => {
    state.interacted = true;
    startSession(b.dataset.start, {
      source: { kind: "all", label: "All topics" },
      sessionLimit: b.dataset.start === "mock" ? 20 : null
    });
  }));
  el.modeBtns.forEach((b) => b.addEventListener("click", () => {
    state.interacted = true;
    startSession(b.dataset.mode, {
      source: buildSourceFromCategory(state.category),
      sessionLimit: b.dataset.mode === "mock" ? 20 : state.sessionLimit
    });
  }));
  el.chips.addEventListener("click", (e) => {
    const b = e.target.closest("[data-category]");
    if (!b) return;
    state.category = b.dataset.category;
    state.interacted = true;
    startSession(state.mode, {
      announce: false,
      source: buildSourceFromCategory(state.category),
      sessionLimit: state.mode === "mock" ? 20 : state.sessionLimit
    });
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
    storeResumeSession();
    render();
  });
  el.saveBtn.addEventListener("click", () => { state.interacted = true; toggleSave(); });
  el.readBtn.addEventListener("click", () => { state.interacted = true; readQuestion(); });
  el.readSpanishBtn.addEventListener("click", () => { state.interacted = true; readQuestionInSpanish(); });
  el.readyBtn.addEventListener("click", () => { unlockAnswering(); sayStatus("You can answer now."); });
  el.pauseBtn.addEventListener("click", () => { togglePauseAudio(); });
  el.replayBtn.addEventListener("click", () => { state.interacted = true; replayAudio(); });
  el.slowerBtn.addEventListener("click", () => { slowDownAudio(); });
  el.repeatOptionBtn.addEventListener("click", () => { if (state.lastOptionIndex !== null) speakSingleOption(state.lastReadLang, state.lastOptionIndex); });
  el.revealBtn.addEventListener("click", () => { state.interacted = true; revealAnswer(); });
  el.nextBtn.addEventListener("click", () => { state.interacted = true; nextQuestion({ allowBlank: state.mode !== "quiz" }); });
  el.restartBtn.addEventListener("click", () => {
    state.interacted = true;
    startSession(state.mode, { announce: false, source: state.sessionSource, sessionLimit: state.sessionLimit });
    if (state.progress.settings.autoRead) readQuestion();
  });
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
    render();
  });
  window.addEventListener("beforeunload", () => {
    storeResumeSession();
    void persist({ immediate: true, keepalive: true, silent: true });
  });
}

function init() {
  setAuthMode("signup");
  setAuthState("loading");
  setAuthMessage("Checking for your saved account...");
  hydrateControlsFromProgress();
  applyComfortSettings();
  bind();
  initRecognition();
  populateVoices();
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = populateVoices;
  void restoreSession();
}

init();
