// Classes: Blueprint for creating objects (ES6+)

class User {
  // Constructor: runs when new User() is called
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  // Instance method
  greet() {
    return `Hello, I'm ${this.name}`;
  }

  // Getter: access like property
  get age() {
    const years = new Date().getFullYear() - this.createdAt.getFullYear();
    return years;
  }

  // Setter: set like property
  set username(value) {
    this._username = value.toLowerCase();
  }

  get username() {
    return this._username;
  }

  // Static method: called on class, not instance
  static compareUsers(user1, user2) {
    return user1.createdAt - user2.createdAt;
  }
}

const alice = new User("Alice", "alice@example.com");
console.log(alice.greet()); // "Hello, I'm Alice"
alice.username = "ALICE";
console.log(alice.username); // "alice"

// Inheritance: extending classes
class Admin extends User {
  constructor(name, email, permissions) {
    super(name, email); // Call parent constructor
    this.permissions = permissions;
  }

  // Override parent method
  greet() {
    return `${super.greet()}, I'm an admin`;
  }

  hasPermission(perm) {
    return this.permissions.includes(perm);
  }
}

const admin = new Admin("Bob", "bob@example.com", ["read", "write", "delete"]);
console.log(admin.greet()); // "Hello, I'm Bob, I'm an admin"
console.log(admin.hasPermission("delete")); // true

// Private fields (ES2022): # prefix
class BankAccount {
  #balance = 0; // Private field

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// console.log(account.#balance); // SyntaxError: Private field
