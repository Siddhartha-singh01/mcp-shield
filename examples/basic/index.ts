import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { presets, shield } from '../../src/index.js';

const server = new McpServer({
  name: 'example-server-with-shield',
  version: '1.0.0',
});

const shieldMiddleware = shield(presets.strict);

server.tool('fetch_url', { url: z.string() }, async ({ url }) => {
  return {
    content: [{ type: 'text', text: `Fetched content from ${url}` }],
  };
});


