import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { shield, presets } from '../../src/index.js';

// Create a server
const server = new McpServer({
  name: 'example-server-with-shield',
  version: '1.0.0'
});

// Attach the shield middleware using the strict preset
// The strict preset blocks SSRF, deep objects, and redacts prompt injections.
const shieldMiddleware = shield(presets.strict);

server.tool('fetch_url', { url: z.string() }, async ({ url }) => {
  return {
    content: [{ type: 'text', text: `Fetched content from ${url}` }]
  };
});

console.log('Server initialized with mcp-shield enabled.');
