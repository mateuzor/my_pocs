const select = document.getElementById("customSelect");
const button = select.querySelector(".trigger");
const listbox = select.querySelector(".listbox");
const selectedText = select.querySelector(".selected");

button.addEventListener("click", () => {
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  listbox.hidden = isOpen;
});

listbox.addEventListener("click", (e) => {
  if (e.target.getAttribute("role") === "option") {
    selectedText.textContent = e.target.textContent;
    button.setAttribute("aria-expanded", "false");
    listbox.hidden = true;
  }
});

document.addEventListener("click", (e) => {
  if (!select.contains(e.target)) {
    button.setAttribute("aria-expanded", "false");
    listbox.hidden = true;
  }
});
