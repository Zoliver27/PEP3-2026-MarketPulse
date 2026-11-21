export async function fetchJson<T>(url: string, timeoutMs = 9_000): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/json', 'user-agent': 'MarketPulse/1.0 academic-project' }
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Proveedor respondió HTTP ${response.status}${body ? `: ${body.slice(0, 180)}` : ''}`);
    }
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

export function isoDateDaysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}
