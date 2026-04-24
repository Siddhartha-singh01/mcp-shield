import { describe, expect, it } from 'vitest';
import { inputValidator } from '../src/guards/input-validator.js';

describe('inputValidator', () => {
  it('allows valid small objects', () => {
    const config = { maxArgSize: 1000, rejectDeepObjects: { depth: 5 } };
    expect(() => inputValidator({ a: 1, b: 'hello' }, config)).not.toThrow();
  });

  it('blocks gigantic strings/arguments', () => {
    const config = { maxArgSize: 100, rejectDeepObjects: { depth: 5 } };
    const largePayload = { text: 'a'.repeat(200) };
    expect(() => inputValidator(largePayload, config)).toThrow(
      'Input violation',
    );
  });

  it('blocks deeply nested objects', () => {
    const config = { maxArgSize: 10000, rejectDeepObjects: { depth: 3 } };
    const deepPayload = { a: { b: { c: { d: { e: 1 } } } } };
    expect(() => inputValidator(deepPayload, config)).toThrow(
      'Input violation',
    );
  });

  it('detects and blocks circular references', () => {
    const config = { maxArgSize: 10000, rejectDeepObjects: { depth: 5 } };
    const circular: any = { a: 1 };
    circular.b = circular;
    expect(() => inputValidator(circular, config)).toThrow('Input violation');
  });
});
