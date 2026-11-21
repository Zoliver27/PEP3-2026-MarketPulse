import { env } from '../../Logica/config/env';
import type { CryptoAsset } from '../types';

let marketCache: { expiresAt: number; data: CryptoAsset[] } | null = null;
const liveOverrides = new Map<string, Partial<CryptoAsset>>();

export async function getCachedMarket(fetcher: () => Promise<CryptoAsset[]>) {
  if (marketCache && marketCache.expiresAt > Date.now()) return marketCache.data.map((asset) => {
    const live = liveOverrides.get(asset.symbol);
    const liveAt = live?.updatedAt ? Date.parse(live.updatedAt) : 0;
    return live && Date.now() - liveAt < 90_000 ? { ...asset, ...live } : asset;
  });
  const data = await fetcher();
  marketCache = { expiresAt: Date.now() + env.marketCacheTtlMs, data };
  return data.map((asset) => ({ ...asset, ...(liveOverrides.get(asset.symbol) ?? {}) }));
}

export function updateLiveAsset(update: Partial<CryptoAsset> & { symbol: string }) {
  const previous = liveOverrides.get(update.symbol) ?? {};
  liveOverrides.set(update.symbol, { ...previous, ...update, dataStatus: 'live' });
}

export function clearMarketCache() { marketCache = null; }
