import { env } from '../../Logica/config/env';
import type { FxRate } from '../types';
import { fetchJson, isoDateDaysAgo } from '../utils/http';

interface FrankfurterRate { date: string; base: string; quote: string; rate: number; }
const PAIRS = [
  ['USD', 'BOB'], ['EUR', 'USD'], ['USD', 'JPY'], ['GBP', 'USD'], ['USD', 'BRL'],
  ['USD', 'MXN'], ['USD', 'CHF'], ['USD', 'CNY'], ['USD', 'CAD'], ['EUR', 'BOB']
] as const;

async function getRate(base: string, quote: string): Promise<FrankfurterRate> {
  return fetchJson<FrankfurterRate>(`${env.frankfurterApiUrl}/rate/${base.toLowerCase()}/${quote.toLowerCase()}`);
}

export async function fetchFxPairs(): Promise<FxRate[]> {
  return Promise.all(PAIRS.map(async ([base, quote]) => {
    try {
      const result = await getRate(base, quote);
      if (!Number.isFinite(result.rate) || result.rate <= 0) throw new Error('El proveedor devolvió una tasa inválida.');
      return {
        pair: `${base}/${quote}`, base, quote, rate: result.rate, date: result.date,
        source: 'Frankfurter · tasas de referencia agregadas', frequency: 'Referencia diaria' as const, available: true
      };
    } catch (error) {
      return {
        pair: `${base}/${quote}`, base, quote, rate: null, date: null,
        source: 'Frankfurter', frequency: 'Referencia diaria' as const, available: false,
        message: error instanceof Error ? error.message : 'Par no disponible en la fuente.'
      };
    }
  }));
}

export async function fetchFxHistory(base: string, quote: string, days = 180) {
  const safe = (code: string) => /^[A-Z]{3}$/.test(code) ? code : '';
  const normalizedBase = safe(base.toUpperCase());
  const normalizedQuote = safe(quote.toUpperCase());
  if (!normalizedBase || !normalizedQuote || normalizedBase === normalizedQuote) throw new Error('Par de divisas inválido.');
  const from = isoDateDaysAgo(Math.min(730, Math.max(30, days)));
  const url = `${env.frankfurterApiUrl}/rates?from=${from}&base=${normalizedBase}&quotes=${normalizedQuote}`;
  const records = await fetchJson<FrankfurterRate[]>(url, 12_000);
  return records.filter((record) => Number.isFinite(record.rate) && record.rate > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((record) => ({ time: Date.parse(`${record.date}T00:00:00Z`), close: record.rate, open: record.rate, high: record.rate, low: record.rate, volume: 0 }));
}
