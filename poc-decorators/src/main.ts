import { log } from './log';
import { memoize } from './memoize';
import { bound } from './bound';
import { range, upper } from './validate';
import { sealed } from './classDecorators';

@sealed
class Calculator {
  @upper label = 'calc';
  @range(0, 120) accessor age = 30;

  @log
  add(a: number, b: number) {
    return a + b;
  }

  // Expensive pure computation: cached after first call
  @memoize
  fib(n: number): number {
    return n < 2 ? n : this.fib(n - 1) + this.fib(n - 2);
  }

  @bound
  describe() {
    return `${this.label} (age ${this.age})`;
  }
}

const out: string[] = [];
const c = new Calculator();
out.push(`add: ${c.add(2, 3)}`);
out.push(`fib(40): ${c.fib(40)}`); // instant thanks to @memoize
const detached = c.describe; // would lose `this` without @bound
out.push(`bound: ${detached()}`);

try {
  c.age = 500;
} catch (e) {
  out.push(`validation: ${(e as Error).message}`);
}

document.querySelector('#out')!.textContent = out.join('\n');
