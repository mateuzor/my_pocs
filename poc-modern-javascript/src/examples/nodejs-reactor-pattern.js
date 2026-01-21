// Node.js Reactor Pattern: Event-driven, non-blocking I/O architecture
// Single-threaded event loop handling async operations

// Event Loop phases:
// 1. Timers (setTimeout, setInterval)
// 2. I/O callbacks (file system, network)
// 3. Idle, prepare (internal)
// 4. Poll (new I/O events)
// 5. Check (setImmediate)
// 6. Close callbacks (socket.on('close'))

console.log("1. Sync code runs first");

setTimeout(() => {
  console.log("4. Timer callback (macrotask)");
}, 0);

setImmediate(() => {
  console.log("5. setImmediate (runs after I/O)");
});

Promise.resolve().then(() => {
  console.log("3. Promise (microtask, runs before macrotasks)");
});

process.nextTick(() => {
  console.log("2. nextTick (highest priority microtask)");
});

console.log("1. More sync code");

// Reactor Pattern demonstration
const EventEmitter = require("events");

class FileProcessor extends EventEmitter {
  processFile(filename) {
    console.log(`Starting to process: ${filename}`);

    // Simulating async I/O operation
    setImmediate(() => {
      this.emit("reading", filename);

      setTimeout(() => {
        this.emit("processing", { file: filename, lines: 1000 });

        process.nextTick(() => {
          this.emit("complete", { file: filename, success: true });
        });
      }, 100);
    });
  }
}

const processor = new FileProcessor();

processor.on("reading", (file) => console.log(`Reading file: ${file}`));
processor.on("processing", (data) => console.log(`Processing ${data.lines} lines`));
processor.on("complete", (result) => console.log(`Done: ${result.file}`));

processor.processFile("data.txt");

// Why Node.js is fast:
// - Non-blocking I/O: doesn't wait for file/network operations
// - Event loop delegates I/O to OS (libuv)
// - Single thread = no context switching overhead
// - Microtasks (Promises, nextTick) run before next event loop phase
