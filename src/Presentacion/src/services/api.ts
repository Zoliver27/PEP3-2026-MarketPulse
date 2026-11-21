const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { headers: { accept: 'application/json' } });
  const payload = await response.json().catch(() => ({})) as { error?: string; detail?: string };
  if (!response.ok) throw new Error(payload.detail || payload.error || `Error HTTP ${response.status}`);
  return payload as T;
}

export function money(value: number, currency = 'USD', maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits, minimumFractionDigits: maximumFractionDigits > 2 ? 2 : 0 }).format(value);
}
export function compactMoney(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}
export function percent(value: number) { return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`; }
export function formatDate(value: string | number) {
  return new Intl.DateTimeFormat('es-BO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
