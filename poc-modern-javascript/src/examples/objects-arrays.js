// Objects: Key-value pairs
const user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
};

// Access properties
console.log(user.name); // "Alice"
console.log(user["email"]); // "alice@example.com"

// Object methods
const keys = Object.keys(user); // ["name", "age", "email"]
const values = Object.values(user); // ["Alice", 25, "alice@example.com"]
const entries = Object.entries(user); // [["name", "Alice"], ["age", 25], ...]

// Merge objects
const profile = { ...user, role: "admin" };
const merged = Object.assign({}, user, { active: true });

// Destructuring
const { name, age } = user;
console.log(name, age); // "Alice" 25

// Arrays: Ordered list of values
const numbers = [1, 2, 3, 4, 5];

// Common array methods
const doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8, 10]
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// Modern array methods
const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: true },
];

const alice = users.find((u) => u.name === "Alice");
const hasAdmin = users.some((u) => u.role === "admin");
const allActive = users.every((u) => u.active);

// Array destructuring
const [first, second, ...rest] = numbers;
console.log(first, second, rest); // 1 2 [3, 4, 5]

// Spread operator
const moreNumbers = [...numbers, 6, 7, 8];
const combined = [...numbers, ...moreNumbers];

// Sort and reverse (mutate original)
const sorted = [...numbers].sort((a, b) => b - a); // [5, 4, 3, 2, 1]

// Includes and indexOf
console.log(numbers.includes(3)); // true
console.log(numbers.indexOf(3)); // 2

// forEach (no return value)
users.forEach((user) => {
  console.log(`User: ${user.name}`);
});
