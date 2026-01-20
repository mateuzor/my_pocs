// Error.cause - Chain errors to preserve context (ES2022)

// OLD WAY: Concatenating error messages
console.log("=== OLD WAY: String Concatenation ===");

function oldWayExample() {
  try {
    // Simulate database error
    const dbError = new Error("Connection timeout");
    throw new Error("Failed to fetch user: " + dbError.message);
  } catch (error) {
    console.log("Error:", error.message);
    // Lost: original error object, stack trace, error type
  }
}

oldWayExample();

// NEW WAY: Using Error.cause

function newWayExample() {
  try {
    const dbError = new Error("Connection timeout");
    throw new Error("Failed to fetch user", { cause: dbError });
  } catch (error) {
    console.log("Error:", error.message);
    console.log("Cause:", error.cause.message);
    console.log("Has cause object:", error.cause instanceof Error);
  }
}

newWayExample();
