const acorn = require("acorn");
const estraverse = require("estraverse");
const rules = require("./rules");

function lint(code) {
  const ast = acorn.parse(code, { ecmaVersion: 2020, locations: true });
  const errors = [];

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

module.exports = { lint, reportErrors };
