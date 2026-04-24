# @siddhartha/mcp-shield

> **Security middleware for MCP servers in one line.**

### Why it exists
Audits in 2026 found 36.7% of public MCP servers vulnerable to SSRF and 43% with unsafe command-execution paths. The official MCP SDK ships no auth, CORS, rate limiting, input validation, or prompt-injection defenses. Every production server has to reinvent them. `mcp-shield` is the "helmet + express-rate-limit + cors, but for MCP" single package.

### Target users
Anyone publishing an MCP server to production — startups, enterprise platform teams, and hobbyists.

### Installation
```bash
npm install @siddhartha/mcp-shield
```

### Public API

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { shield, presets } from '@siddhartha/mcp-shield';

const server = new McpServer({ name: 'my-server', version: '1.0.0' });

server.use(shield(presets.strict));

// or fine-grained:
server.use(shield({
  ssrf: { allowedHosts: ['api.example.com'], blockPrivateIPs: true },
  rateLimit: { windowMs: 60_000, max: 100, perClient: true },
  cors: { origin: ['https://claude.ai', 'https://app.cursor.com'] },
  inputValidation: { maxArgSize: 64 * 1024, rejectDeepObjects: { depth: 8 } },
  promptInjection: { mode: 'warn', redact: true },
  commandExec: { sandbox: 'allowlist', allowlist: ['ls', 'cat'] },
  secretsRedaction: { patterns: [/sk-[A-Za-z0-9]{32,}/, /ghp_[A-Za-z0-9]{36}/] },
  requestSizeLimit: '1mb',
  onViolation: (v) => console.warn(v),
}));
```

You can also export individual middlewares for à-la-carte use: `ssrfGuard`, `rateLimitGuard`, `corsGuard`, `inputValidator`, `promptInjectionScanner`, `commandExecSandbox`, `secretsRedactor`.

### Presets
- `presets.strict` — maximum safety, deny-by-default, best for public servers.
- `presets.balanced` — safe defaults, reasonable for internal/enterprise.
- `presets.permissive` — audit-only mode; logs violations without blocking.
