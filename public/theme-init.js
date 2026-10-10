(function () {
  try {
    const saved = localStorage.getItem("verso-theme");
    const isDark =
      saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  } catch (e) {
    //
  }
})();
