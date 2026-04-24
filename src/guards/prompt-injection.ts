import { logger } from '../logger.js';
import type { PromptInjectionConfig } from '../types.js';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+prompt/i,
  /disregard\s+previous/i,
  /new\s+rule:/i,
];

export function promptInjectionScanner(
  payload: any,
  config: PromptInjectionConfig | boolean,
): any {
  if (config === false) return payload;
  const cfg =
    config === true ? { mode: 'warn' as const, redact: true } : config;

  let hasViolation = false;

  function scanAndRedact(obj: any): any {
    if (typeof obj === 'string') {
      let result = obj;
      for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(result)) {
          hasViolation = true;
          if (cfg.redact) {
            let flags = pattern.flags;
            if (!flags.includes('g')) flags += 'g';
            const globalPattern = new RegExp(pattern.source, flags);
            result = result.replace(
              globalPattern,
              '[REDACTED_PROMPT_INJECTION]',
            );
          }
        }
      }
      return result;
    }
    if (Array.isArray(obj)) {
      return obj.map(scanAndRedact);
    }
    if (obj !== null && typeof obj === 'object') {
      const cloned: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = scanAndRedact(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  const resultPayload = scanAndRedact(payload);

  if (hasViolation) {
    if (cfg.mode === 'block') {
      throw new Error('Prompt injection violation detected.');
    }
    logger.warn({
      guard: 'promptInjection',
      message: 'Potential prompt injection detected',
    });
  }

  return resultPayload;
}
