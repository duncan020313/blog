(function () {
  var STORAGE_KEY = "blog-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("dark-mode-toggle");

  function setTheme(theme) {
    if (theme === "dark") {
      root.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }

  function currentTheme() {
    return localStorage.getItem(STORAGE_KEY) || "light";
  }

  function toggleTheme() {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  }

  root && setTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener("click", toggleTheme);
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
  }

  window.toggleTheme = toggleTheme;
})();
