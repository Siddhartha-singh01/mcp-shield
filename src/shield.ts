import type { ShieldConfig } from './types.js';
import { rateLimitGuard } from './guards/rate-limit.js';
import { corsGuard } from './guards/cors.js';
import { inputValidator } from './guards/input-validator.js';
import { promptInjectionScanner } from './guards/prompt-injection.js';
import { secretsRedactor } from './guards/secrets-redactor.js';
import { logger } from './logger.js';

export function shield(config: ShieldConfig) {
  // Returns a generic middleware wrapper. For MCP SDK, you might 
  // wrap specific handlers or monkey-patch setRequestHandler.
  return async function shieldMiddleware(req: any, ctx: any, next: (req: any) => Promise<any>) {
    try {
      if (config.rateLimit !== false) {
        const clientId = ctx?.client?.id || ctx?.remoteAddr || 'global';
        rateLimitGuard(clientId, config.rateLimit || true);
      }
      
      if (config.cors !== false) {
        corsGuard(ctx?.headers?.origin, config.cors || true);
      }
      
      if (config.inputValidation !== false) {
        inputValidator(req, config.inputValidation || true);
      }

      let processedReq = req;

      if (config.promptInjection !== false) {
        processedReq = promptInjectionScanner(processedReq, config.promptInjection || true);
      }

      if (config.secretsRedaction !== false) {
        processedReq = secretsRedactor(processedReq, config.secretsRedaction || true);
      }

      let res = await next(processedReq);

      if (config.secretsRedaction !== false) {
        res = secretsRedactor(res, config.secretsRedaction || true);
      }

      return res;
    } catch (error: any) {
      if (config.onViolation) {
        config.onViolation({
          guard: 'shield',
          message: error.message,
          context: { req }
        });
      } else {
        logger.error({ guard: 'shield', message: error.message, context: { req } });
      }
      throw error;
    }
  };
}
