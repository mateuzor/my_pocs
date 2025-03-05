# Custom Linter POC

A poc for a custom JavaScript linter that uses Abstract Syntax Tree (AST) analysis to detect potential code issues.

## Overview

This linter uses:

- `acorn` for parsing JavaScript code into an AST
- `estraverse` for traversing the AST
- Custom rules for code analysis

## Features

Currently implements the following lint rules:

- No `var` usage (suggests using `let` or `const`)
- Maximum line length (80 characters)
- No `console.log` statements
- Already used variable

## Project Structure

    my_linter/
    |
    |-- src/
    |   |-- linter.js        # Main linter implementation
    |   |-- rules.js         # Lint rules definitions
    |   |-- astExample.js    # AST conversion example
    |
    |-- examples/
    |   |-- test.js          # Sample file for testing
    |
    |-- syntaxTree.json      # Generated AST representation

## Installation

```bash
# Clone the repository
git clone https://github.com/mateuzor/my_pocs.git

cd my_pocs/my_linter

# Install dependencies
yarn install
```

## Usage

```bash
# Run linter on a file
yarn lint
```

## How It Works

1. **Code Parsing**:

   - The linter reads the source file
   - Converts it to an AST using Acorn
   - Saves the AST representation to `syntaxTree.json` for inspection

2. **AST Analysis**:

   - Traverses each node of the AST
   - Applies each rule to every relevant node
   - Collects any rule violations

3. **Error Reporting**:
   - Displays found issues with line numbers
   - Shows descriptive messages for each violation

## Example Output

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
