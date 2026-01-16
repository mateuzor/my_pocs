// Modern operators: **, ||=, &&=, ??=

// Exponentiation operator (**)
console.log("=== Exponentiation Operator (**) ===");
console.log("2 ** 3 =", 2 ** 3); // 8
console.log("5 ** 2 =", 5 ** 2); // 25
console.log("10 ** -1 =", 10 ** -1); // 0.1
console.log("2 ** 0.5 =", 2 ** 0.5); // 1.414... (square root)

// Comparison with Math.pow
console.log("\n** vs Math.pow():");
console.log("2 ** 8 =", 2 ** 8);
console.log("Math.pow(2, 8) =", Math.pow(2, 8));

// Practical example: compound interest
function calculateCompoundInterest(principal, rate, years) {
  return principal * (1 + rate) ** years;
}

console.log("\nCompound Interest Example:");
const investment = calculateCompoundInterest(1000, 0.05, 10);
console.log("$1000 at 5% for 10 years: $" + investment.toFixed(2));

// Logical OR assignment (||=)
console.log("\n=== Logical OR Assignment (||=) ===");
let config = {
  timeout: 0,
  retries: null,
  debug: false,
};

// Only assigns if the value is falsy
config.timeout ||= 5000;
config.retries ||= 3;
config.debug ||= true;
config.name ||= "default";

console.log("Config after ||= assignments:", config);
// { timeout: 5000, retries: 3, debug: true, name: 'default' }
// Note: timeout was 0 (falsy), so it got replaced

// Comparison with traditional approach
let options = {};
options.theme = options.theme || "light"; // Old way
options.language ||= "en"; // New way
console.log("Options:", options);

// Logical AND assignment (&&=)
console.log("\n=== Logical AND Assignment (&&=) ===");
let user = {
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
  status: null,
};

// Only assigns if the current value is truthy
user.name &&= user.name.toUpperCase();
user.email &&= user.email.toLowerCase();
user.role &&= user.role + "-verified";
user.status &&= "active"; // Won't assign because status is null

console.log("User after &&= assignments:", user);
// { name: 'ALICE', email: 'alice@example.com', role: 'admin-verified', status: null }

// Practical example: sanitizing input
let formData = {
  username: "  Alice  ",
  bio: "Developer",
  website: null,
};

formData.username &&= formData.username.trim();
formData.bio &&= formData.bio.substring(0, 100);
formData.website &&= formData.website.toLowerCase(); // Won't execute

console.log("\nSanitized form data:", formData);

// Nullish coalescing assignment (??=)
let settings = {
  volume: 0,
  brightness: null,
  contrast: undefined,
  notifications: false,
};

// Only assigns if the value is null or undefined
settings.volume ??= 50; // Won't assign (0 is not nullish)
settings.brightness ??= 75; // Will assign (null is nullish)
settings.contrast ??= 100; // Will assign (undefined is nullish)
settings.notifications ??= true; // Won't assign (false is not nullish)

console.log("Settings after ??= assignments:", settings);
// { volume: 0, brightness: 75, contrast: 100, notifications: false }

// Comparison: ||= vs ??=
console.log("\n=== Comparing ||= and ??= ===");

let obj1 = { value: 0 };
let obj2 = { value: 0 };

obj1.value ||= 10; // Assigns because 0 is falsy
obj2.value ??= 10; // Doesn't assign because 0 is not nullish

console.log("Using ||=:", obj1.value); // 10
console.log("Using ??=:", obj2.value); // 0
