import { describe, it, expect } from 'vitest';
import { rateLimitGuard } from '../src/guards/rate-limit.js';

describe('rateLimitGuard', () => {
  it('allows requests within limit', () => {
    const config = { windowMs: 1000, max: 2 };
    expect(() => rateLimitGuard('client1', config)).not.toThrow();
    expect(() => rateLimitGuard('client1', config)).not.toThrow();
  });

  it('blocks requests over the limit', () => {
    const config = { windowMs: 1000, max: 2 };
    expect(() => rateLimitGuard('client2', config)).not.toThrow();
    expect(() => rateLimitGuard('client2', config)).not.toThrow();
    expect(() => rateLimitGuard('client2', config)).toThrow('Rate limit exceeded');
  });

  it('separates limits by client identifier', () => {
    const config = { windowMs: 1000, max: 1 };
    expect(() => rateLimitGuard('client3', config)).not.toThrow();
    expect(() => rateLimitGuard('client3', config)).toThrow('Rate limit exceeded');
    expect(() => rateLimitGuard('client4', config)).not.toThrow(); // different client
  });
});
