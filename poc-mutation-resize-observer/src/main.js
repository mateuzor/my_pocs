// ===== MutationObserver demo =====
const list = document.getElementById("list");
const addBtn = document.getElementById("add");
const removeBtn = document.getElementById("remove");
const mutationLog = document.getElementById("mutation-log");

let addedCount = 0;
let removedCount = 0;

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      // checks for direct li children inside ul
      addedCount += mutation.addedNodes.length;
      removedCount += mutation.removedNodes.length;

      mutationLog.textContent = `Added: ${addedCount}, Removed: ${removedCount}. Total items: ${list.children.length}`;
    }
  });
});
mutationObserver.observe(list, { childList: true }); // notifies whenever child elements are added or removed

let count = 1;

addBtn.addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = `Item ${count++}`;
  list.appendChild(li);
});

removeBtn.addEventListener("click", () => {
  const last = list.lastElementChild;
  if (last) list.removeChild(last);
});

// ===== ResizeObserver demo =====
const box = document.getElementById("box");
const resizeLog = document.getElementById("resize-log");

// entries represent all observed size changes in monitored elements
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect; // dimensions
    resizeLog.textContent = `Box size: ${Math.round(width)} × ${Math.round(
      height
    )}`;
  }
});

resizeObserver.observe(box);
