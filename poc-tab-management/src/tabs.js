const tabList = document.getElementById("tab-list");
const tabContent = document.getElementById("tab-content");
const addTabBtn = document.getElementById("add-tab");

let tabs = JSON.parse(localStorage.getItem("tabs")) || [];
let activeTabId = localStorage.getItem("activeTab") || null;

function setActiveTab(id) {
  activeTabId = id;
  localStorage.setItem("activeTab", id);
  updateTabs();
}

function addTab() {
  const newTab = { id: Date.now().toString(), title: `Tab ${tabs.length + 1}` };
  tabs.push(newTab);
  localStorage.setItem("tabs", JSON.stringify(tabs));
  setActiveTab(newTab.id);
}

addTabBtn.addEventListener("click", addTab);

// Initialize tabs on page load
updateTabs();
