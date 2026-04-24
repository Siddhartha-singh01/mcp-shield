export interface SsrfConfig {
  allowedHosts?: string[];
  blockPrivateIPs?: boolean;
}

export interface RateLimitConfig {
  windowMs?: number;
  max?: number;
  perClient?: boolean;
}

export interface CorsConfig {
  origin?: string | string[];
}

export interface InputValidationConfig {
  maxArgSize?: number;
  rejectDeepObjects?: { depth: number };
}

export interface PromptInjectionConfig {
  mode?: 'warn' | 'block';
  redact?: boolean;
}

export interface CommandExecConfig {
  sandbox?: 'none' | 'allowlist' | 'reject';
  allowlist?: string[];
}

export interface SecretsRedactionConfig {
  patterns?: RegExp[];
}

export interface ShieldViolation {
  guard: string;
  message: string;
  context?: Record<string, unknown>;
}

export interface ShieldConfig {
  ssrf?: SsrfConfig | boolean;
  rateLimit?: RateLimitConfig | boolean;
  cors?: CorsConfig | boolean;
  inputValidation?: InputValidationConfig | boolean;
  promptInjection?: PromptInjectionConfig | boolean;
  commandExec?: CommandExecConfig | boolean;
  secretsRedaction?: SecretsRedactionConfig | boolean;
  requestSizeLimit?: string;
  onViolation?: (violation: ShieldViolation) => void;
}
