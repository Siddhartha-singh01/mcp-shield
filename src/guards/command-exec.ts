import { parse } from 'shell-quote';
import type { CommandExecConfig } from '../types.js';

export function commandExecSandbox(
  commandStr: string,
  config: CommandExecConfig | boolean,
): void {
  if (config === false) return;
  const cfg =
    config === true ? { sandbox: 'reject' as const, allowlist: [] } : config;

  if (cfg.sandbox === 'none') return;
  if (cfg.sandbox === 'reject') {
    throw new Error(
      'Command execution violation: all command executions are rejected by policy.',
    );
  }

  const allowlist = cfg.allowlist || [];

  const parsed = parse(commandStr);
  let expectingCommand = true;

  for (const token of parsed) {
    if (typeof token === 'string') {
      if (expectingCommand) {
        if (!allowlist.includes(token)) {
          throw new Error(
            `Command execution violation: command '${token}' is not in the allowlist.`,
          );
        }
        expectingCommand = false;
      }
    } else if (typeof token === 'object' && token !== null && 'op' in token) {
      expectingCommand = true;
    }
  }
}
