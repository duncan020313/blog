(function () {
  var STORAGE_KEY = "blog-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("dark-mode-toggle");
  var state = toggle && toggle.querySelector("[data-theme-toggle-state]");
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage failures and keep the in-memory theme state.
    }
  }

  function preferredTheme() {
    var storedTheme = readStoredTheme();

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return media && media.matches ? "dark" : "light";
  }

  function updateToggle(theme) {
    if (!toggle) {
      return;
    }

    var isDark = theme === "dark";
    var lightLabel = toggle.getAttribute("data-theme-light-label") || "Light";
    var darkLabel = toggle.getAttribute("data-theme-dark-label") || "Dark";
    var toggleLabel = toggle.getAttribute("data-theme-toggle-label") || "Toggle color theme";
    var activeLabel = isDark ? darkLabel : lightLabel;

    if (state) {
      state.textContent = activeLabel;
    }

    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    toggle.setAttribute("aria-label", toggleLabel + ": " + activeLabel);
    toggle.setAttribute("title", toggleLabel + ": " + activeLabel);
  }

  function setTheme(theme, persist) {
    root.classList.toggle("theme-dark", theme === "dark");
    updateToggle(theme);

    if (persist) {
      writeStoredTheme(theme);
    }
  }

  function currentTheme() {
    return root.classList.contains("theme-dark") ? "dark" : "light";
  }

  function toggleTheme() {
    setTheme(currentTheme() === "dark" ? "light" : "dark", true);
  }

  function syncWithSystem(event) {
    if (readStoredTheme()) {
      return;
    }

    setTheme(event.matches ? "dark" : "light", false);
  }

  setTheme(preferredTheme(), false);

  if (toggle) {
    toggle.addEventListener("click", toggleTheme);
  }

  if (media) {
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncWithSystem);
    } else if (typeof media.addListener === "function") {
      media.addListener(syncWithSystem);
    }
  }
})();
