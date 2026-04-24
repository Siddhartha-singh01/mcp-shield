import { describe, expect, it } from 'vitest';
import { ssrfGuard } from '../src/guards/ssrf.js';

describe('ssrfGuard', () => {
  it('blocks private IP addresses', async () => {
    const config = { blockPrivateIPs: true };
    await expect(ssrfGuard('169.254.169.254', config)).rejects.toThrow(
      'SSRF violation',
    );
    await expect(ssrfGuard('127.0.0.1', config)).rejects.toThrow(
      'SSRF violation',
    );
    await expect(ssrfGuard('192.168.1.1', config)).rejects.toThrow(
      'SSRF violation',
    );
    await expect(ssrfGuard('10.0.0.1', config)).rejects.toThrow(
      'SSRF violation',
    );
  });

  it('allows public IP addresses', async () => {
    const config = { blockPrivateIPs: true };
    await expect(ssrfGuard('8.8.8.8', config)).resolves.not.toThrow();
  });

  it('resolves and blocks hostnames pointing to private IPs', async () => {
    const config = { blockPrivateIPs: true };
    await expect(ssrfGuard('localhost', config)).rejects.toThrow(
      'SSRF violation',
    );
  });

  it('allows hostnames in the allowlist', async () => {
    const config = { blockPrivateIPs: true, allowedHosts: ['localhost'] };
    await expect(ssrfGuard('localhost', config)).resolves.not.toThrow();
  });
});
