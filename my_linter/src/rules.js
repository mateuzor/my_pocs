// Rule to detect 'var' usage - recommends using let/const instead
const noVarRule = (node) => {
  if (node.type === "VariableDeclaration" && node.kind === "var") {
    return {
      message: "Unexpected var, use let or const instead",
      line: node.loc.start.line,
      column: node.loc.start.column,
      severity: "error",
      ruleId: "no-var",
    };
  }
};

// Rule to detect console.log statements
const noConsoleRule = (node) => {
  if (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object.name === "console"
  ) {
    return {
      message: "Unexpected console statement",
      line: node.loc.start.line,
      column: node.loc.start.column,
      severity: "warning",
      ruleId: "no-console",
    };
  }
};

// Rule to check if line length exceeds 80 characters
const maxLineLengthRule = (node) => {
  if (node.loc) {
    const lineLength = node.loc.end.column - node.loc.start.column;
    if (lineLength > 80) {
      return {
        message: `Line has a length of ${lineLength}. Maximum allowed is 80`,
        line: node.loc.start.line,
        column: node.loc.start.column,
        severity: "warning",
        ruleId: "max-len",
      };
    }
  }
};

// Rule to track variable declarations and usage
const declarations = new Set();

const noRedeclareRule = (node) => {
  if (node.type === "VariableDeclarator") {
    const varName = node.id.name;

    if (declarations.has(varName)) {
      return {
        message: `'${varName}' is already declared`,
        line: node.loc.start.line,
        column: node.loc.start.column,
        severity: "error",
        ruleId: "no-redeclare",
      };
    }

    declarations.add(varName);
  }
};

const globals = new Set(["console", "log"]);

const noOutOfScopeUsageRule = (
  node,
  globalVarsAndFunctions,
  functionScopes
) => {
  if (node.type === "Identifier") {
    const varName = node.name;

    if (globals.has(varName)) return;

    if (globalVarsAndFunctions.has(varName)) return;

    const isInScope = functionScopes.some((scope) => scope.has(varName));

    if (!isInScope) {
      return {
        message: `'${varName}' is used outside its declared scope.`,
        line: node.loc.start.line,
        column: node.loc.start.column,
        severity: "error",
        ruleId: "no-out-of-scope",
      };
    }
  }
};

module.exports = [
  noVarRule,
  noConsoleRule,
  maxLineLengthRule,
  noRedeclareRule,
  noOutOfScopeUsageRule,
];
