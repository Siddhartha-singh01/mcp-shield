import type { CorsConfig } from '../types.js';

export function corsGuard(requestOrigin: string | undefined, config: CorsConfig | boolean): void {
  if (config === false) return;
  const cfg = config === true ? { origin: '*' } : config;

  if (!cfg.origin) return;
  if (cfg.origin === '*') return;

  const allowedOrigins = Array.isArray(cfg.origin) ? cfg.origin : [cfg.origin];
  
  if (!requestOrigin || !allowedOrigins.includes(requestOrigin)) {
    throw new Error(`CORS violation: origin ${requestOrigin || 'undefined'} is not allowed`);
  }
}
