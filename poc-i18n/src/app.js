async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  const translations = await res.json();

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[key] || key;
  });
}

document.getElementById("language-switcher").addEventListener("change", (e) => {
  const lang = e.target.value;
  loadLanguage(lang);
});

window.addEventListener("DOMContentLoaded", () => {
  loadLanguage("en");
});
