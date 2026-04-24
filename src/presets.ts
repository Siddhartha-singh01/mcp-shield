import type { ShieldConfig } from './types.js';

export const strict: ShieldConfig = {
  ssrf: { blockPrivateIPs: true },
  rateLimit: { windowMs: 60000, max: 100, perClient: true },
  cors: false,
  inputValidation: { maxArgSize: 64 * 1024, rejectDeepObjects: { depth: 8 } },
  promptInjection: { mode: 'block', redact: false },
  commandExec: { sandbox: 'reject' },
  secretsRedaction: { patterns: [/sk-[a-zA-Z0-9]{32,}/, /ghp_[a-zA-Z0-9]{36}/] }
};

export const balanced: ShieldConfig = {
  ssrf: { blockPrivateIPs: true },
  rateLimit: { windowMs: 60000, max: 1000, perClient: true },
  cors: false,
  inputValidation: { maxArgSize: 1024 * 1024, rejectDeepObjects: { depth: 16 } },
  promptInjection: { mode: 'warn', redact: true },
  commandExec: { sandbox: 'allowlist', allowlist: ['ls', 'cat', 'echo'] },
  secretsRedaction: { patterns: [/sk-[a-zA-Z0-9]{32,}/, /ghp_[a-zA-Z0-9]{36}/] }
};

export const permissive: ShieldConfig = {
  ssrf: false,
  rateLimit: false,
  cors: false,
  inputValidation: false,
  promptInjection: false,
  commandExec: false,
  secretsRedaction: false
};

export const presets = { strict, balanced, permissive };
