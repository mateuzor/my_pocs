// LocalStorage Example
function useLocalStorage() {
  localStorage.setItem("name", "John Doe");
  console.log("LocalStorage:", localStorage.getItem("name"));
  localStorage.removeItem("name");
}

// SessionStorage Example
function useSessionStorage() {
  sessionStorage.setItem("session", "active");
  console.log("SessionStorage:", sessionStorage.getItem("session"));
  sessionStorage.removeItem("session");
}

// Cookies Example
function useCookies() {
  document.cookie =
    "user=Jane Doe; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";
  console.log("Cookies:", document.cookie);
}

// IndexedDB Example
function useIndexedDB() {
  const dbName = "MyTestDB";
  const request = indexedDB.open(dbName, 1);

  // It's where you define or modify the database schema (object stores and indexes)
  // run on the db created or version number upgraded
  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("users", { keyPath: "id" });
  };

  // run after db connection established
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");
    store.add({ id: 1, name: "IndexedDB User" });
    store.get(1).onsuccess = function (event) {
      console.log("IndexedDB:", event.target.result);
    };
  };
}

useLocalStorage();
useSessionStorage();
useCookies();
useIndexedDB();
