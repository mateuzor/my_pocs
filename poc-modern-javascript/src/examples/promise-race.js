// Promise.race examples
// Unlike Promise.all (waits for ALL promises), Promise.race returns the FIRST settled promise

// Basic example

const fast = new Promise((resolve) =>
  setTimeout(() => resolve("Fast: 500ms"), 500),
);
const slow = new Promise((resolve) =>
  setTimeout(() => resolve("Slow: 1500ms"), 1500),
);

Promise.race([fast, slow]).then((winner) => {
  console.log("Winner:", winner); // 'Fast: 500ms'
});

// Timeout pattern - useful for request cancellation
console.log("\n=== Timeout Pattern ===");

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms),
  );
  return Promise.race([promise, timeout]);
}

const request = new Promise((resolve) =>
  setTimeout(() => resolve("Data"), 2000),
);

withTimeout(request, 1000)
  .then((data) => console.log("Success:", data))
  .catch((err) => console.log("Error:", err.message)); // 'Timeout'

// Fastest API endpoint
const servers = [
  new Promise((resolve) => setTimeout(() => resolve("US-East"), 300)),
  new Promise((resolve) => setTimeout(() => resolve("EU"), 150)),
  new Promise((resolve) => setTimeout(() => resolve("Asia"), 400)),
];

Promise.race(servers).then((fastest) => {
  console.log("Fastest:", fastest); // 'EU'
});
