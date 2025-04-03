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
  const globalVarsAndFunctions = new Map();
  const functionScopes = [new Set()];

  // Traverse the AST and apply rules
  estraverse.traverse(ast, {
    enter(node) {
      if (node.type === "FunctionDeclaration") {
        functionScopes.push(new Set()); // Create a new scope for this function
        globalVarsAndFunctions.set(node.id.name, node.loc.start.line); // Store the function name as globally accessible
      }

      if (node.type === "VariableDeclaration") {
        node.declarations.forEach((declaration) => {
          if (declaration.id.type === "Identifier") {
            const varName = declaration.id.name;

            if (node.kind === "var" && functionScopes.length === 1) {
              globalVarsAndFunctions.set(varName, node.loc.start.line);
            } else {
              functionScopes[functionScopes.length - 1].add(varName); // Store it in the current function scope
            }
          }
        });
      }

      rules.forEach((rule) => {
        const error = rule(node, globalVarsAndFunctions, functionScopes);
        if (error) errors.push(error);
      });
    },
    leave(node) {
      // When exiting a function, remove its scope from the stack
      if (node.type === "FunctionDeclaration") {
        functionScopes.pop();
      }
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
