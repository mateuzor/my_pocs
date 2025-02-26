module.exports = [
  (node) => {
    if (node.type === "VariableDeclaration" && node.kind === "var") {
      return {
        message: "Avoid using 'var'. Use 'let' or 'const' instead.",
        line: node.loc.start.line,
      };
    }
  },
  (node) => {
    if (node.type === "FunctionDeclaration" && node.params.length > 5) {
      return {
        message: "Avoid functions with more than 5 parameters.",
        line: node.loc.start.line,
      };
    }
  },
];
