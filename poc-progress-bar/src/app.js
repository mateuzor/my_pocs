document.getElementById("start").addEventListener("click", () => {
  const bar = document.querySelector(".progress-bar");
  const text = bar.querySelector(".progress-text");
  let value = 0;

  const interval = setInterval(() => {
    if (value >= 100) return clearInterval(interval);
    value++;
    bar.style.width = value + "%";
    bar.setAttribute("aria-valuenow", value);
    text.textContent = value + "%";
  }, 50);
});
