if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service Worker registered');
  });
}

async function fetchData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const data = await res.json();
  const ul = document.getElementById('output');
  ul.innerHTML = '';
  data.forEach(post => {
    const li = document.createElement('li');
    li.textContent = post.title;
    ul.appendChild(li);
    saveToIndexedDB(post);
  });
}

function saveToIndexedDB(post) {
  const request = indexedDB.open("PostCacheDB", 1);
  request.onupgradeneeded = event => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("posts")) {
      db.createObjectStore("posts", { keyPath: "id" });
    }
  };
  request.onsuccess = event => {
    const db = event.target.result;
    const tx = db.transaction("posts", "readwrite");
    const store = tx.objectStore("posts");
    store.put(post);
  };
}
