const acorn = require("acorn");
const estraverse = require("estraverse");
const fs = require("fs");
const rules = require("./rules");

function lint(filePath) {
  const sourceCode = fs.readFileSync(filePath, "utf-8");

  // Parse the code into an AST
  const ast = acorn.parse(sourceCode, {
    ecmaVersion: 2020,
    locations: true,
    sourceType: "module",
  });

  // Save AST to a JSON file for inspection
  const astJson = JSON.stringify(ast, null, 2);
  fs.writeFileSync("syntaxTree.json", astJson);

  const errors = [];

  // Traverse the AST and apply rules
  estraverse.traverse(ast, {
    enter(node) {
      rules.forEach((rule) => {
        const error = rule(node);
        if (error) errors.push(error);
      });
    },
  });

  return errors;
}

function reportErrors(errors, filePath) {
  if (errors.length === 0) {
    console.log(`${filePath}  0 problems`);
    return;
  }

  console.log(`${filePath}`);

  errors.forEach((error) => {
    console.log(
      `  ${error.line}:${error.column || 0}  ` +
        `${error.severity}  ` +
        `${error.message}  ` +
        `${error.ruleId}`
    );
  });

  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;

  console.log(
    `\n${errors.length} problems (${errorCount} errors, ${warningCount} warnings)\n`
  );
}

// Get file path from command line arguments
const fileToLint = process.argv[2];

// Execute linting process
const errors = lint(fileToLint);
reportErrors(errors, fileToLint);

module.exports = { lint, reportErrors };
