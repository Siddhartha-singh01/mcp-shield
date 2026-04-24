import type { ShieldViolation } from './types.js';

export const logger = {
  warn: (violation: ShieldViolation) => {
    console.warn(
      `[mcp-shield] Violation [${violation.guard}]: ${violation.message}`,
      violation.context || '',
    );
  },
  error: (violation: ShieldViolation) => {
    console.error(
      `[mcp-shield] Violation [${violation.guard}]: ${violation.message}`,
      violation.context || '',
    );
  },
};
