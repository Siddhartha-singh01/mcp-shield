import type { InputValidationConfig } from '../types.js';

export function inputValidator(
  payload: any,
  config: InputValidationConfig | boolean,
): void {
  if (config === false) return;
  const cfg =
    config === true
      ? { maxArgSize: 64 * 1024, rejectDeepObjects: { depth: 8 } }
      : config;

  const maxDepth = cfg.rejectDeepObjects?.depth ?? 8;
  const maxSize = cfg.maxArgSize ?? 64 * 1024;

  let currentSize = 0;
  const seen = new WeakSet();

  function traverse(obj: any, depth: number) {
    if (depth > maxDepth) {
      throw new Error(`Input violation: max depth of ${maxDepth} exceeded`);
    }

    if (obj !== null && typeof obj === 'object') {
      if (seen.has(obj)) {
        throw new Error('Input violation: circular reference detected');
      }
      seen.add(obj);

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          currentSize += key.length * 2;
          if (currentSize > maxSize)
            throw new Error(
              `Input violation: payload size exceeds max limit of ${maxSize} bytes`,
            );
          traverse(obj[key], depth + 1);
        }
      }
      seen.delete(obj);
    } else if (typeof obj === 'string') {
      currentSize += obj.length * 2;
      if (currentSize > maxSize)
        throw new Error(
          `Input violation: payload size exceeds max limit of ${maxSize} bytes`,
        );
    } else if (typeof obj === 'number' || typeof obj === 'boolean') {
      currentSize += 8;
      if (currentSize > maxSize)
        throw new Error(
          `Input violation: payload size exceeds max limit of ${maxSize} bytes`,
        );
    }
  }

  traverse(payload, 0);
}
