import { describe, expect, it } from 'vitest';
import { corsGuard } from '../src/guards/cors.js';

describe('corsGuard', () => {
  it('allows allowed origins', () => {
    const config = { origin: ['https://allowed.com'] };
    expect(() => corsGuard('https://allowed.com', config)).not.toThrow();
  });

  it('blocks disallowed origins', () => {
    const config = { origin: ['https://allowed.com'] };
    expect(() => corsGuard('https://blocked.com', config)).toThrow(
      'CORS violation',
    );
  });

  it('allows all if origin is *', () => {
    const config = { origin: '*' };
    expect(() => corsGuard('https://anything.com', config)).not.toThrow();
  });

  it('handles missing origin gracefully based on config', () => {
    const config = { origin: ['https://allowed.com'] };
    expect(() => corsGuard(undefined, config)).toThrow('CORS violation');
  });
});
