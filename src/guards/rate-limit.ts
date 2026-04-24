import { LRUCache } from 'lru-cache';
import type { RateLimitConfig } from '../types.js';

const defaultStore = new LRUCache<string, number[]>({ max: 10000 });

export function rateLimitGuard(clientId: string, config: RateLimitConfig | boolean): void {
  if (config === false) return;
  const cfg = config === true ? { windowMs: 60000, max: 100, perClient: true } : config;
  
  const windowMs = cfg.windowMs ?? 60000;
  const max = cfg.max ?? 100;
  
  const key = cfg.perClient !== false ? clientId : 'global';
  
  const now = Date.now();
  let timestamps = defaultStore.get(key) || [];
  
  timestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (timestamps.length >= max) {
    throw new Error(`Rate limit exceeded. Maximum ${max} requests per ${windowMs}ms allowed.`);
  }
  
  timestamps.push(now);
  defaultStore.set(key, timestamps);
}
