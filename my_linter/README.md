# 🚀 Custom Linter POC

A proof of concept for a **custom JavaScript linter** that leverages **Abstract Syntax Tree (AST) analysis** to detect potential code issues.

## 📌 Overview

This linter is built using:

- **`acorn`** - Parses JavaScript code into an AST.
- **`estraverse`** - Traverses the AST for rule enforcement.
- **Custom lint rules** - Detects specific coding patterns and violations.

## 🛠 Features

Currently implements the following lint rules:

✅ **No `var` usage** - Suggests using `let` or `const` instead.  
✅ **Maximum line length (80 characters)** - Enforces readable code.  
✅ **No `console.log` statements** - Helps prevent debug logs in production.  
✅ **No re-declared variables** - Prevents duplicate variable declarations.

## 📁 Project Structure

```
my_linter/
│-- src/
│   │-- linter.js        # Main linter implementation
│   │-- rules.js         # Lint rules definitions
│   │-- astExample.js    # AST conversion example
│-- examples/
│   │-- test.js          # Sample file for testing
│-- syntaxTree.json      # Generated AST representation
│-- package.json        # Project dependencies
```

## 🚀 Installation

Ensure you have **Node.js** installed, then run:

```bash
# Clone the repository
git clone https://github.com/mateuzor/my_pocs.git

cd my_pocs/my_linter

# Install dependencies
yarn install
```

## ▶️ Usage

Run the linter on a file:

```bash
yarn lint examples/test.js
```

## 🔍 How It Works

1️⃣ **Code Parsing**:

- Reads the source file.
- Converts it to an AST using Acorn.
- Saves the AST representation to `syntaxTree.json` for debugging.

2️⃣ **AST Analysis**:

- Traverses each node of the AST.
- Applies each rule to relevant nodes.
- Collects rule violations.

3️⃣ **Error Reporting**:

- Displays found issues with line numbers.
- Provides descriptive messages for each violation.

## 📌 Example Output

```bash
Found 3 linting error(s):

examples/test.js
  1:0  error  Unexpected var, use let or const instead  no-var
  2:0  error  Unexpected var, use let or const instead  no-var
  3:0  warning  Unexpected console statement  no-console
  4:2  warning  Line has a length of 81. Maximum allowed is 80  max-len
  13:2  warning  Unexpected console statement  no-console
  14:6  error  'x' is already declared  no-redeclare

6 problems (3 errors, 3 warnings)
```

## 📌 Next Steps

- Expand linting rules to include additional best practices.
- Improve error reporting with suggested fixes.
- Support configuration files for custom rule sets.

---

🚀 **Project created to explore AST-based JavaScript linting!**
