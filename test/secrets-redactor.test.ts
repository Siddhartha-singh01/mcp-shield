import { describe, it, expect } from 'vitest';
import { secretsRedactor } from '../src/guards/secrets-redactor.js';

describe('secretsRedactor', () => {
  const config = { patterns: [/sk-[a-zA-Z0-9]{32}/, /ghp_[a-zA-Z0-9]{36}/] };

  it('redacts secrets from strings', () => {
    const text = 'Here is my key: sk-12345678901234567890123456789012 and nothing else';
    const redacted = secretsRedactor(text, config);
    expect(redacted).toBe('Here is my key: [REDACTED] and nothing else');
  });

  it('redacts secrets deeply inside objects', () => {
    const payload = {
      user: 'alice',
      tokens: {
        github: 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        stripe: 'sk-abcdefghijklmnopqrstuvwxyz012345'
      }
    };
    const redacted = secretsRedactor(payload, config);
    expect(redacted.tokens.github).toBe('[REDACTED]');
    expect(redacted.tokens.stripe).toBe('[REDACTED]');
    expect(redacted.user).toBe('alice');
  });

  it('leaves clean payloads untouched', () => {
    const payload = { safe: 'text' };
    const redacted = secretsRedactor(payload, config);
    expect(redacted).toEqual(payload);
  });
});
