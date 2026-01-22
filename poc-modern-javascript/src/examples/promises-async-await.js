// Promises: Handle async operations without callback hell

// Creating a Promise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Alice" });
      } else {
        reject(new Error("Invalid ID"));
      }
    }, 1000);
  });
}

// Using Promise with .then/.catch
fetchUser(1)
  .then((user) => {
    console.log("User:", user.name);
    return fetchUser(2); // Chain another promise
  })
  .then((user) => console.log("Second user:", user.name))
  .catch((error) => console.error("Error:", error.message));

// Async/Await: Cleaner syntax for promises
async function getUsers() {
  try {
    const user1 = await fetchUser(1);
    console.log("Async user:", user1.name);

    const user2 = await fetchUser(2);
    console.log("Second async user:", user2.name);
  } catch (error) {
    console.error("Async error:", error.message);
  }
}

getUsers();

// Promise.all: Run multiple promises in parallel
async function fetchMultipleUsers() {
  const [user1, user2, user3] = await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3),
  ]);

  console.log("All users:", user1.name, user2.name, user3.name);
}

fetchMultipleUsers();

// Real-world use case: Sequential vs Parallel
async function sequentialFetch() {
  console.time("Sequential");
  await fetchUser(1); // Wait 1s
  await fetchUser(2); // Wait 1s
  await fetchUser(3); // Wait 1s
  console.timeEnd("Sequential"); // ~3 seconds
}

async function parallelFetch() {
  console.time("Parallel");
  await Promise.all([fetchUser(1), fetchUser(2), fetchUser(3)]);
  console.timeEnd("Parallel"); // ~1 second
}

sequentialFetch();
parallelFetch();

// Promise.allSettled: Wait for all, even if some fail
async function fetchWithErrors() {
  const results = await Promise.allSettled([
    fetchUser(1),
    fetchUser(-1), // Will reject
    fetchUser(2),
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`User ${index}:`, result.value.name);
    } else {
      console.log(`User ${index} failed:`, result.reason.message);
    }
  });
}

fetchWithErrors();
