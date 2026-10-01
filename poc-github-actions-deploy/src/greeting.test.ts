import { describe, it, expect } from 'vitest';
import { greeting } from './greeting';

describe('greeting', () => {
  it('greets by name', () => expect(greeting(' Ada ')).toBe('Hello, Ada!'));
  it('falls back for empty names', () => expect(greeting('')).toBe('Hello, stranger!'));
});
