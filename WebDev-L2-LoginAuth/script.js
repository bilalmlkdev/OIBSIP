(function () {
  var USERS_KEY = "oibsip-auth-users-v1";
  var SESSION_KEY = "oibsip-auth-session-v1";

  var authView = document.getElementById("auth-view");
  var dashView = document.getElementById("dash-view");
  var tabLogin = document.getElementById("tab-login");
  var tabRegister = document.getElementById("tab-register");
  var loginPanel = document.getElementById("login-panel");
  var registerPanel = document.getElementById("register-panel");
  var loginError = document.getElementById("login-error");
  var registerError = document.getElementById("register-error");
  var logoutBtn = document.getElementById("logout-btn");

  /* ---------- storage helpers ---------- */

  function loadUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function loadSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      return s && typeof s.email === "string" ? s : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(session) {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }

  /* ---------- SHA-256 via Web Crypto (async) ---------- */

  async function hashPassword(password) {
    var data = new TextEncoder().encode(password);
    var buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map(function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  /* ---------- validation ---------- */

  function showError(el, msg) {
    if (!msg) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = msg;
  }

  function isValidEmail(email) {
    // Practical pattern - not full RFC
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function normalizeEmail(email) {
    return email.trim().toLowerCase();
  }

  /* ---------- tabs ---------- */

  function activateTab(which) {
    var isLogin = which === "login";
    tabLogin.classList.toggle("is-active", isLogin);
    tabRegister.classList.toggle("is-active", !isLogin);
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabRegister.setAttribute("aria-selected", String(!isLogin));
    loginPanel.classList.toggle("is-active", isLogin);
    registerPanel.classList.toggle("is-active", !isLogin);
    loginPanel.hidden = !isLogin;
    registerPanel.hidden = isLogin;
    showError(loginError, "");
    showError(registerError, "");
  }

  tabLogin.addEventListener("click", function () { activateTab("login"); });
  tabRegister.addEventListener("click", function () { activateTab("register"); });

  /* ---------- views ---------- */

  function showDashboard(session) {
    var users = loadUsers();
    var user = users[session.email] || {};
    var name = user.name || session.email;
    document.getElementById("dash-name").textContent = name;
    document.getElementById("dash-email").textContent = session.email;
    document.getElementById("dash-since").textContent = session.since
      ? new Date(session.since).toLocaleString()
      : "-";
    document.getElementById("dash-welcome").textContent =
      "Welcome, " + name.split(" ")[0] + ".";
    document.getElementById("dash-avatar").textContent =
      (name.trim()[0] || "?").toUpperCase();
    authView.hidden = true;
    dashView.hidden = false;
  }

  function showAuth() {
    dashView.hidden = true;
    authView.hidden = false;
    activateTab("login");
  }

  /* ---------- register ---------- */

  registerPanel.addEventListener("submit", async function (e) {
    e.preventDefault();
    showError(registerError, "");

    var name = document.getElementById("reg-name").value.trim();
    var email = normalizeEmail(document.getElementById("reg-email").value);
    var password = document.getElementById("reg-password").value;
    var confirm = document.getElementById("reg-confirm").value;

    if (name.length < 2) {
      showError(registerError, "Name must be at least 2 characters.");
      return;
    }
    if (!isValidEmail(email)) {
      showError(registerError, "Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      showError(registerError, "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      showError(registerError, "Passwords do not match.");
      return;
    }

    var users = loadUsers();
    if (users[email]) {
      showError(registerError, "An account with this email already exists.");
      return;
    }

    var hash = await hashPassword(password);
    users[email] = {
      name: name,
      email: email,
      hash: hash,
      createdAt: Date.now()
    };
    saveUsers(users);

    // Auto-login after register
    var session = { email: email, since: Date.now() };
    saveSession(session);
    registerPanel.reset();
    showDashboard(session);
  });

  /* ---------- login ---------- */

  loginPanel.addEventListener("submit", async function (e) {
    e.preventDefault();
    showError(loginError, "");

    var email = normalizeEmail(document.getElementById("login-email").value);
    var password = document.getElementById("login-password").value;

    if (!isValidEmail(email)) {
      showError(loginError, "Enter a valid email address.");
      return;
    }
    if (!password) {
      showError(loginError, "Password is required.");
      return;
    }

    var users = loadUsers();
    var user = users[email];
    if (!user) {
      showError(loginError, "No account found for this email.");
      return;
    }

    var hash = await hashPassword(password);
    if (hash !== user.hash) {
      showError(loginError, "Incorrect password.");
      return;
    }

    var session = { email: email, since: Date.now() };
    saveSession(session);
    loginPanel.reset();
    showDashboard(session);
  });

  /* ---------- logout ---------- */

  logoutBtn.addEventListener("click", function () {
    saveSession(null);
    showAuth();
  });

  /* ---------- boot: restore session if present ---------- */

  var existing = loadSession();
  if (existing && loadUsers()[existing.email]) {
    showDashboard(existing);
  } else {
    showAuth();
  }
})();
