// Map: Key-value pairs with any type as key (not just strings)
const cache = new Map();

// Set values
cache.set("user:1", { name: "Alice" });
cache.set(123, "numeric key");
cache.set(true, "boolean key");

// Get values
console.log(cache.get("user:1")); // { name: "Alice" }
console.log(cache.get(123)); // "numeric key"

// Check if key exists
console.log(cache.has("user:1")); // true
console.log(cache.has("user:2")); // false

// Size
console.log(cache.size); // 3

// Delete
cache.delete(123);
console.log(cache.size); // 2

// Map vs Object: Map preserves insertion order
const userMap = new Map([
  ["name", "Alice"],
  ["age", 25],
  ["email", "alice@example.com"],
]);

// Iterate over Map
userMap.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Map with object keys (Object can't do this)
const obj1 = { id: 1 };
const obj2 = { id: 2 };
const metadata = new Map();

metadata.set(obj1, "metadata for obj1");
metadata.set(obj2, "metadata for obj2");

console.log(metadata.get(obj1)); // "metadata for obj1"

// Set: Unique values only (no duplicates)
const tags = new Set();

tags.add("javascript");
tags.add("nodejs");
tags.add("react");
tags.add("javascript"); // Ignored (duplicate)

console.log(tags.size); // 3
console.log(tags.has("nodejs")); // true

// Delete from Set
tags.delete("react");
console.log(tags.size); // 2

// Use case: Remove duplicates from array
const duplicates = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const unique = [...new Set(duplicates)]; // [1, 2, 3, 4]
console.log(unique);

// Iterate over Set
tags.forEach((tag) => {
  console.log(`Tag: ${tag}`);
});

// Convert Set to Array
const tagArray = Array.from(tags);
const tagArray2 = [...tags];

// Set operations
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...setA, ...setB]); // [1, 2, 3, 4, 5, 6]

// Intersection
const intersection = new Set([...setA].filter((x) => setB.has(x))); // [3, 4]

// Difference
const difference = new Set([...setA].filter((x) => !setB.has(x))); // [1, 2]
