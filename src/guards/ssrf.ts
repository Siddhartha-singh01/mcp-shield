import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';
import type { SsrfConfig } from '../types.js';

export async function ssrfGuard(
  hostOrIp: string,
  config: SsrfConfig | boolean,
): Promise<void> {
  if (config === false) return;
  const cfg = config === true ? { blockPrivateIPs: true } : config;

  if (cfg.allowedHosts?.includes(hostOrIp)) {
    return;
  }

  let ips: string[] = [];

  if (ipaddr.isValid(hostOrIp)) {
    ips = [hostOrIp];
  } else {
    try {
      const records = await dns.lookup(hostOrIp, { all: true });
      ips = records.map((r) => r.address);
    } catch (e) {
      throw new Error(`SSRF violation: unable to resolve host ${hostOrIp}`);
    }
  }

  if (cfg.blockPrivateIPs) {
    for (const ip of ips) {
      try {
        const addr = ipaddr.parse(ip);
        const range = addr.range();
        // 'unicast' is the standard public routing range.
        // We reject 'private', 'loopback', 'linkLocal', 'multicast', etc.
        if (range !== 'unicast') {
          throw new Error(
            `SSRF violation: target resolves to private/reserved IP range (${ip})`,
          );
        }
      } catch (e: any) {
        throw new Error(
          e.message.includes('SSRF violation')
            ? e.message
            : `SSRF violation: invalid IP format (${ip})`,
        );
      }
    }
  }
}
