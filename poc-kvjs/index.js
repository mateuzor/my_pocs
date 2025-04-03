const kvjs = require("@heyputer/kv.js");

// Initialize the KV database
const kv = new kvjs();

console.log("Starting KV.js POC...");

// 1. Store a simple value
kv.set("username", "mateus");
console.log("Stored value: username -> mateus");

// 2. Retrieve a value
const username = kv.get("username");
console.log("Retrieved value: username ->", username);

// 3. List all keys
const keys = kv.keys("*");
console.log("Stored keys:", keys);

// 4. Delete a key
kv.del("username");
console.log("Key 'username' deleted");

// 5. Atomic operations (increment)
kv.set("counter", 0);
kv.incr("counter");
const counter = kv.get("counter");
console.log("Updated counter: counter ->", counter);

// 6. Using Hashes
kv.hset("user:1", "name", "Mateus");
kv.hset("user:1", "age", "32");
const user = {
  name: kv.hget("user:1", "name"),
  age: kv.hget("user:1", "age"),
};
console.log("Stored user in hash 'user:1':", user);

// 7. Key expiration
kv.set("tempKey", "temporary");
kv.expire("tempKey", 10); // Expires in 10s
console.log("Key 'tempKey' created with a 10s expiration");

// 8. Working with Sets
kv.sadd("mySet", "apple");
kv.sadd("mySet", "banana");
kv.sadd("mySet", "cherry");
kv.sadd("mySet", "cherry");
const setMembers = kv.smembers("mySet");
console.log("Set elements in 'mySet':", setMembers);
