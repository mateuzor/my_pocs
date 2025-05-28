// LocalStorage Example
function useLocalStorage() {
  // Saving multiple values by serializing an object into JSON
  const user = { name: "John Doe", age: 30, profession: "Developer" };
  localStorage.setItem("user", JSON.stringify(user));

  // Retrieving and deserializing the object from LocalStorage
  const retrievedUser = JSON.parse(localStorage.getItem("user"));
  console.log("LocalStorage - Retrieved User:", retrievedUser);

  // Updating a single property within the stored object
  retrievedUser.age = 31;
  localStorage.setItem("user", JSON.stringify(retrievedUser));
  console.log(
    "LocalStorage - Updated User:",
    JSON.parse(localStorage.getItem("user"))
  );

  // Clearing all data in LocalStorage
  localStorage.clear();
  console.log("LocalStorage after clear:", localStorage.length);
}

// SessionStorage Example
function useSessionStorage() {
  // Storing multiple values
  sessionStorage.setItem("sessionID", "12345");
  sessionStorage.setItem("theme", "dark");

  // Displaying all keys and values stored in SessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    console.log(`SessionStorage - ${key}:`, sessionStorage.getItem(key));
  }

  // Removing a specific item and checking the remaining size
  sessionStorage.removeItem("theme");
  console.log(
    "SessionStorage size after removing 'theme':",
    sessionStorage.length
  );

  // Clearing all data in SessionStorage
  sessionStorage.clear();
  console.log("SessionStorage after clear:", sessionStorage.length);
}

// Cookies Example
function useCookies() {
  // Setting multiple cookies
  document.cookie =
    "user=Jane Doe; path=/; expires=Fri, 31 Dec 2025 23:59:59 GMT";
  document.cookie = "theme=dark; path=/; expires=Fri, 31 Dec 2025 23:59:59 GMT";

  // Displaying all cookies
  console.log("Cookies:", document.cookie);

  // Modifying an existing cookie
  document.cookie =
    "theme=light; path=/; expires=Fri, 31 Dec 2025 23:59:59 GMT";
  console.log("Updated Cookies:", document.cookie);

  // Removing a cookie by setting its expiration date in the past
  document.cookie = "theme=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  console.log("Cookies after removal:", document.cookie);
}

// IndexedDB Example
function useIndexedDB() {
  const dbName = "MyTestDB";
  const request = indexedDB.open(dbName, 2); // Incrementing the version to add a new object store

  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Creating multiple object stores
    if (!db.objectStoreNames.contains("users")) {
      db.createObjectStore("users", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings", { autoIncrement: true });
    }
  };

  request.onsuccess = function (event) {
    const db = event.target.result;

    // Adding data to different object stores
    const userTransaction = db.transaction("users", "readwrite");
    const userStore = userTransaction.objectStore("users");
    userStore.add({ id: 1, name: "IndexedDB User 1" });
    userStore.add({ id: 2, name: "IndexedDB User 2" });

    const settingsTransaction = db.transaction("settings", "readwrite");
    const settingsStore = settingsTransaction.objectStore("settings");
    settingsStore.add({ theme: "dark", notifications: true });

    // Retrieving all items from an object store
    const getAllRequest = userStore.getAll();
    getAllRequest.onsuccess = function (event) {
      console.log("IndexedDB - All Users:", event.target.result);
    };

    // Updating specific data in an object store
    const getUserRequest = userStore.get(1);
    getUserRequest.onsuccess = function (event) {
      const user = event.target.result;
      user.name = "Updated IndexedDB User 1";
      userStore.put(user);
    };

    // Closing the database after operations
    userTransaction.oncomplete = function () {
      db.close();
    };
  };
}

// Running all examples
useLocalStorage();
useSessionStorage();
useCookies();
useIndexedDB();
