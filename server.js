const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const dataRoot = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(root, "data");
const usersFile = path.join(dataRoot, "users.json");
const sessionsFile = path.join(dataRoot, "sessions.json");
const supportPostsFile = path.join(dataRoot, "support-posts.json");
const sessionCookieName = "maplementor_session";
const maxBodyBytes = 256 * 1024;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

const progressDefaults = {
  sessionsCompleted: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  bestStreak: 0,
  savedIds: [],
  completedIds: [],
  missedIds: [],
  categoryStats: {},
  testDate: "",
  settings: {
    englishVoiceName: "",
    spanishVoiceName: "",
    rate: 1,
    volume: 1,
    autoRead: false,
    autoReadChosen: false,
    listenAfterRead: false,
    showSpanish: false,
    fontScale: "base",
    easyView: false
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeNumber(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function safeCount(value) {
  return Math.max(0, Math.min(1000000, Math.round(safeNumber(value, 0))));
}

function sanitizeProgress(input = {}) {
  const settings = input.settings || {};
  const merged = clone(progressDefaults);
  merged.sessionsCompleted = safeCount(input.sessionsCompleted);
  merged.totalAnswered = safeCount(input.totalAnswered);
  merged.totalCorrect = Math.min(merged.totalAnswered, safeCount(input.totalCorrect));
  merged.bestStreak = safeCount(input.bestStreak);
  merged.savedIds = Array.isArray(input.savedIds)
    ? [...new Set(input.savedIds.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim().slice(0, 120)))]
    : [];
  merged.completedIds = Array.isArray(input.completedIds)
    ? [...new Set(input.completedIds.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim().slice(0, 120)))]
    : [];
  merged.missedIds = Array.isArray(input.missedIds)
    ? [...new Set(input.missedIds.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim().slice(0, 120)))]
    : [];
  merged.testDate = typeof input.testDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.testDate) ? input.testDate : "";
  merged.categoryStats = {};

  if (input.categoryStats && typeof input.categoryStats === "object") {
    for (const [category, stats] of Object.entries(input.categoryStats)) {
      if (typeof category !== "string" || !stats || typeof stats !== "object") continue;
      const answered = safeCount(stats.answered);
      const correct = Math.min(answered, safeCount(stats.correct));
      merged.categoryStats[category.slice(0, 80)] = { answered, correct };
    }
  }

  const fontScale = ["base", "large", "xlarge", "max"].includes(settings.fontScale) ? settings.fontScale : progressDefaults.settings.fontScale;
  merged.settings = {
    englishVoiceName: typeof settings.englishVoiceName === "string" ? settings.englishVoiceName.slice(0, 120) : "",
    spanishVoiceName: typeof settings.spanishVoiceName === "string" ? settings.spanishVoiceName.slice(0, 120) : "",
    rate: Math.min(1.5, Math.max(0.7, safeNumber(settings.rate, 1))),
    volume: Math.min(1, Math.max(0, safeNumber(settings.volume, 1))),
    autoRead: Boolean(settings.autoRead),
    autoReadChosen: Boolean(settings.autoReadChosen),
    listenAfterRead: Boolean(settings.listenAfterRead),
    showSpanish: Boolean(settings.showSpanish),
    fontScale,
    easyView: Boolean(settings.easyView)
  };

  return merged;
}

function ensureDataFiles() {
  fs.mkdirSync(dataRoot, { recursive: true });

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
  }
  if (!fs.existsSync(sessionsFile)) {
    fs.writeFileSync(sessionsFile, JSON.stringify({ sessions: [] }, null, 2));
  }
  if (!fs.existsSync(supportPostsFile)) {
    fs.writeFileSync(supportPostsFile, JSON.stringify({ posts: [] }, null, 2));
  }
}

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return clone(fallback);
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function readUsers() {
  ensureDataFiles();
  const store = readJson(usersFile, { users: [] });
  return Array.isArray(store.users) ? store : { users: [] };
}

function writeUsers(store) {
  ensureDataFiles();
  writeJson(usersFile, store);
}

function readSessions() {
  ensureDataFiles();
  const store = readJson(sessionsFile, { sessions: [] });
  return Array.isArray(store.sessions) ? store : { sessions: [] };
}

function writeSessions(store) {
  ensureDataFiles();
  writeJson(sessionsFile, store);
}

function readSupportPosts() {
  ensureDataFiles();
  const store = readJson(supportPostsFile, { posts: [] });
  return Array.isArray(store.posts) ? store : { posts: [] };
}

function writeSupportPosts(store) {
  ensureDataFiles();
  writeJson(supportPostsFile, store);
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((acc, chunk) => {
    const trimmed = chunk.trim();
    if (!trimmed) return acc;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return acc;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function isSecureRequest(req) {
  const proto = req.headers["x-forwarded-proto"];
  return proto === "https" || process.env.NODE_ENV === "production";
}

function setSessionCookie(res, req, token) {
  const parts = [
    `${sessionCookieName}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=2592000"
  ];

  if (isSecureRequest(req)) {
    parts.push("Secure");
  }

  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(res, req) {
  const parts = [
    `${sessionCookieName}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0"
  ];

  if (isSecureRequest(req)) {
    parts.push("Secure");
  }

  res.setHeader("Set-Cookie", parts.join("; "));
}

function send(res, statusCode, body, contentType, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-cache",
    ...extraHeaders
  });
  res.end(body);
}

function json(res, statusCode, payload, extraHeaders = {}) {
  send(res, statusCode, JSON.stringify(payload), "application/json; charset=utf-8", extraHeaders);
}

function safePath(urlPath) {
  const trimmed = urlPath.split("?")[0];
  const normalized = path.normalize(trimmed === "/" ? "/index.html" : trimmed);
  const resolved = path.resolve(root, `.${normalized}`);
  if (!resolved.startsWith(root)) {
    return null;
  }
  return resolved;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBodyBytes) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        resolve(body && typeof body === "object" ? body : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

function sanitizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function sanitizeEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 160);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeSupportType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["issue", "feedback", "idea"].includes(normalized) ? normalized : "feedback";
}

function sanitizeSupportTitle(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 120);
}

function sanitizeSupportMessage(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1200);
}

function publicSupportPost(post) {
  return {
    id: post.id,
    type: sanitizeSupportType(post.type),
    title: sanitizeSupportTitle(post.title),
    message: sanitizeSupportMessage(post.message),
    status: typeof post.status === "string" ? post.status.slice(0, 40) : "new",
    authorName: sanitizeName(post.authorName || "Maple Mentor user"),
    createdAt: typeof post.createdAt === "string" ? post.createdAt : new Date().toISOString()
  };
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password, salt, expectedHash) {
  const actual = Buffer.from(hashPassword(password, salt), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

function createSession(userId) {
  const store = readSessions();
  const token = crypto.randomBytes(24).toString("hex");
  store.sessions = store.sessions.filter((entry) => entry && entry.userId !== userId);
  store.sessions.push({
    token,
    userId,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString()
  });
  writeSessions(store);
  return token;
}

function removeSession(token) {
  const store = readSessions();
  const nextSessions = store.sessions.filter((entry) => entry && entry.token !== token);
  if (nextSessions.length !== store.sessions.length) {
    store.sessions = nextSessions;
    writeSessions(store);
  }
}

function findSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[sessionCookieName];
  if (!token) return null;

  const sessionsStore = readSessions();
  const session = sessionsStore.sessions.find((entry) => entry && entry.token === token);
  if (!session) return null;

  session.lastSeenAt = new Date().toISOString();
  writeSessions(sessionsStore);

  const usersStore = readUsers();
  const user = usersStore.users.find((entry) => entry && entry.id === session.userId);
  if (!user) {
    removeSession(token);
    return null;
  }

  return { token, user };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/auth/session") {
    const session = findSession(req);
    if (!session) {
      json(res, 401, { error: "Not signed in." });
      return true;
    }

    json(res, 200, {
      user: publicUser(session.user),
      progress: sanitizeProgress(session.user.progress)
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signup") {
    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
      json(res, 400, { error: error.message === "Body too large" ? "Request too large." : "Please send valid JSON." });
      return true;
    }

    const name = sanitizeName(body.name);
    const email = sanitizeEmail(body.email);
    const password = String(body.password || "");

    if (name.length < 2) {
      json(res, 400, { error: "Please enter a full name." });
      return true;
    }
    if (!validEmail(email)) {
      json(res, 400, { error: "Please enter a valid email address." });
      return true;
    }
    if (password.length < 8) {
      json(res, 400, { error: "Password must be at least 8 characters." });
      return true;
    }

    const usersStore = readUsers();
    if (usersStore.users.some((user) => user.email === email)) {
      json(res, 409, { error: "An account with that email already exists." });
      return true;
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordSalt: salt,
      passwordHash: hashPassword(password, salt),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: clone(progressDefaults)
    };

    usersStore.users.push(user);
    writeUsers(usersStore);

    const token = createSession(user.id);
    setSessionCookie(res, req, token);
    json(res, 201, { user: publicUser(user), progress: user.progress });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
      json(res, 400, { error: error.message === "Body too large" ? "Request too large." : "Please send valid JSON." });
      return true;
    }

    const email = sanitizeEmail(body.email);
    const password = String(body.password || "");
    const usersStore = readUsers();
    const user = usersStore.users.find((entry) => entry.email === email);

    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      json(res, 401, { error: "Email or password is not correct." });
      return true;
    }

    user.updatedAt = new Date().toISOString();
    writeUsers(usersStore);

    const token = createSession(user.id);
    setSessionCookie(res, req, token);
    json(res, 200, { user: publicUser(user), progress: sanitizeProgress(user.progress) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    const cookies = parseCookies(req);
    if (cookies[sessionCookieName]) {
      removeSession(cookies[sessionCookieName]);
    }
    clearSessionCookie(res, req);
    json(res, 200, { ok: true });
    return true;
  }

  if (req.method === "PUT" && url.pathname === "/api/progress") {
    const session = findSession(req);
    if (!session) {
      json(res, 401, { error: "Not signed in." });
      return true;
    }

    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
      json(res, 400, { error: error.message === "Body too large" ? "Request too large." : "Please send valid JSON." });
      return true;
    }

    const nextProgress = sanitizeProgress(body.progress || {});
    const usersStore = readUsers();
    const user = usersStore.users.find((entry) => entry.id === session.user.id);
    if (!user) {
      json(res, 404, { error: "User not found." });
      return true;
    }

    user.progress = nextProgress;
    user.updatedAt = new Date().toISOString();
    writeUsers(usersStore);

    json(res, 200, { progress: nextProgress });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/support-posts") {
    const store = readSupportPosts();
    const posts = [...store.posts]
      .map(publicSupportPost)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 80);
    json(res, 200, { posts });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/support-posts") {
    const session = findSession(req);
    if (!session) {
      json(res, 401, { error: "Please sign in to post on the support board." });
      return true;
    }

    let body;
    try {
      body = await parseBody(req);
    } catch (error) {
      json(res, 400, { error: error.message === "Body too large" ? "Request too large." : "Please send valid JSON." });
      return true;
    }

    const type = sanitizeSupportType(body.type);
    const title = sanitizeSupportTitle(body.title);
    const message = sanitizeSupportMessage(body.message);

    if (title.length < 4) {
      json(res, 400, { error: "Please add a short title so we know what the post is about." });
      return true;
    }

    if (message.length < 8) {
      json(res, 400, { error: "Please add a little more detail so we can understand the issue or idea." });
      return true;
    }

    const store = readSupportPosts();
    const post = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      status: "new",
      authorName: session.user.name,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.posts.unshift(post);
    store.posts = store.posts.slice(0, 500);
    writeSupportPosts(store);

    json(res, 201, { post: publicSupportPost(post) });
    return true;
  }

  json(res, 404, { error: "Not found." });
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    const filePath = safePath(req.url || "/");

    if (!filePath) {
      send(res, 403, "Forbidden", "text/plain; charset=utf-8");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        if (error.code === "ENOENT") {
          send(res, 404, "Not found", "text/plain; charset=utf-8");
          return;
        }
        send(res, 500, "Server error", "text/plain; charset=utf-8");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mimeTypes[ext] || "application/octet-stream";
      send(res, 200, data, type);
    });
  } catch (error) {
    json(res, 500, { error: "Server error." });
  }
});

ensureDataFiles();

server.listen(port, "0.0.0.0", () => {
  console.log(`Maple Mentor listening on port ${port}`);
});
