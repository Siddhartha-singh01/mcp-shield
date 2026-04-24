import type { SecretsRedactionConfig } from '../types.js';

export function secretsRedactor(payload: any, config: SecretsRedactionConfig | boolean): any {
  if (config === false) return payload;
  const cfg = config === true ? { patterns: [] } : config;

  const patterns = cfg.patterns || [];
  if (patterns.length === 0) return payload;

  function redact(obj: any): any {
    if (typeof obj === 'string') {
      let result = obj;
      for (const pattern of patterns) {
        let flags = pattern.flags;
        if (!flags.includes('g')) flags += 'g';
        const globalPattern = new RegExp(pattern.source, flags);
        result = result.replace(globalPattern, '[REDACTED]');
      }
      return result;
    } else if (Array.isArray(obj)) {
      return obj.map(redact);
    } else if (obj !== null && typeof obj === 'object') {
      const cloned: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = redact(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  return redact(payload);
}
