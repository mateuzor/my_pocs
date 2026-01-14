// Generators and yield keyword examples

// Basic generator function
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

console.log('=== Basic Generator ===');
const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Generator with infinite sequence
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

console.log('\n=== Infinite Generator ===');
const infinite = infiniteSequence();
console.log(infinite.next().value); // 0
console.log(infinite.next().value); // 1
console.log(infinite.next().value); // 2

// Generator with yield*
function* generator1() {
  yield 1;
  yield 2;
}

function* generator2() {
  yield* generator1();
  yield 3;
  yield 4;
}

console.log('\n=== Generator with yield* ===');
for (const value of generator2()) {
  console.log(value); // 1, 2, 3, 4
}

// Generator for fibonacci sequence
function* fibonacci(limit = 10) {
  let [prev, curr] = [0, 1];
  let count = 0;
  
  while (count < limit) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
    count++;
  }
}

console.log('\n=== Fibonacci Generator ===');
console.log('First 8 Fibonacci numbers:');
for (const num of fibonacci(8)) {
  console.log(num);
}

// Generator with two-way communication
function* twoWayGenerator() {
  const response1 = yield 'What is your name?';
  console.log(`Hello, ${response1}!`);
  
  const response2 = yield 'How old are you?';
  console.log(`You are ${response2} years old.`);
}

console.log('\n=== Two-Way Communication ===');
const twoWay = twoWayGenerator();
console.log(twoWay.next().value);           // What is your name?
console.log(twoWay.next('Alice').value);    // Hello, Alice! -> How old are you?
twoWay.next('30');                           // You are 30 years old.
