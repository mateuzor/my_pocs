const tabList = document.getElementById("tab-list");
const tabContent = document.getElementById("tab-content");
const addTabBtn = document.getElementById("add-tab");

let tabs = JSON.parse(localStorage.getItem("tabs")) || [];
let activeTabId = localStorage.getItem("activeTab") || null;

function createTab(id, title = "New Tab") {
  const tab = document.createElement("div");
  tab.classList.add("tab");
  tab.setAttribute("draggable", "true");
  tab.dataset.id = id;

  tab.innerHTML = `
        <span class="tab-title">${title}</span>
        <button class="close-tab">❌</button>
    `;

  tab.addEventListener("click", () => setActiveTab(id));
  tab.querySelector(".close-tab").addEventListener("click", (e) => {
    e.stopPropagation();
    removeTab(id);
  });

  // Drag Events
  tab.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", id);
    tab.classList.add("dragging");
  });

  tab.addEventListener("dragend", () => tab.classList.remove("dragging"));

  tabList.appendChild(tab);
}

function setActiveTab(id) {
  activeTabId = id;
  localStorage.setItem("activeTab", id);
  updateTabs();
}

function updateTabs() {
  tabList.innerHTML = "";
  tabs.forEach(({ id, title }) => createTab(id, title));

  // Highlight active tab
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.id === activeTabId);
  });

  // Update content area
  tabContent.innerHTML = activeTabId
    ? `<h2>Content for ${tabs.find((t) => t.id === activeTabId).title}</h2>`
    : "No tab selected.";
}

function addTab() {
  const newTab = { id: Date.now().toString(), title: `Tab ${tabs.length + 1}` };
  tabs.push(newTab);
  localStorage.setItem("tabs", JSON.stringify(tabs));
  setActiveTab(newTab.id);
}

function removeTab(id) {
  tabs = tabs.filter((tab) => tab.id !== id);
  localStorage.setItem("tabs", JSON.stringify(tabs));

  if (activeTabId === id) activeTabId = tabs.length ? tabs[0].id : null;
  localStorage.setItem("activeTab", activeTabId);

  updateTabs();
}

// Drag & Drop Handling
tabList.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const draggedTab = tabs.find((tab) => tab.id === draggedId);

  const dropTarget = e.target.closest(".tab");
  if (!dropTarget || draggedId === dropTarget.dataset.id) return;

  // Reorder tabs
  const dropIndex = tabs.findIndex((tab) => tab.id === dropTarget.dataset.id);
  tabs = tabs.filter((tab) => tab.id !== draggedId);
  tabs.splice(dropIndex, 0, draggedTab);

  localStorage.setItem("tabs", JSON.stringify(tabs));
  updateTabs();
});

addTabBtn.addEventListener("click", addTab);

// Initialize tabs on page load
updateTabs();
