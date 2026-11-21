import { env } from '../../Logica/config/env';
import type { Candle, CryptoAsset } from '../types';
import { fetchJson } from '../utils/http';

const CATALOG = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', pair: 'BTCUSDT' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', pair: 'ETHUSDT' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', pair: 'SOLUSDT' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', pair: 'BNBUSDT' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', pair: 'XRPUSDT' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', pair: 'ADAUSDT' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', pair: 'DOGEUSDT' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', pair: 'LTCUSDT' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', pair: 'DOTUSDT' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', pair: 'AVAXUSDT' }
];

type BinanceTicker = {
  symbol: string; lastPrice: string; priceChangePercent: string; highPrice: string; lowPrice: string;
  volume: string; quoteVolume: string; openTime: number; closeTime: number;
};

type BinanceKline = [number, string, string, string, string, string, number, string, number, string, string, string];

async function getFromBinance<T>(path: string): Promise<T> {
  const primary = `${env.binanceRestUrl}${path}`;
  try {
    return await fetchJson<T>(primary);
  } catch (primaryError) {
    if (env.binanceRestUrl.includes('data-api.binance.vision')) {
      try { return await fetchJson<T>(`https://api.binance.com${path}`); }
      catch { throw primaryError; }
    }
    throw primaryError;
  }
}

export async function fetchCryptoMarket(): Promise<CryptoAsset[]> {
  const symbols = encodeURIComponent(JSON.stringify(CATALOG.map((asset) => asset.pair)));
  const tickers = await getFromBinance<BinanceTicker[]>(`/api/v3/ticker/24hr?symbols=${symbols}`);
  const bySymbol = new Map(tickers.map((ticker) => [ticker.symbol, ticker]));
  const updatedAt = new Date().toISOString();
  return CATALOG.flatMap((asset) => {
    const ticker = bySymbol.get(asset.pair);
    if (!ticker) return [];
    const numeric = [ticker.lastPrice, ticker.priceChangePercent, ticker.highPrice, ticker.lowPrice, ticker.volume, ticker.quoteVolume].map(Number);
    if (numeric.some((value) => !Number.isFinite(value))) return [];
    return [{
      ...asset,
      price: numeric[0]!,
      change24h: numeric[1]!,
      high24h: numeric[2]!,
      low24h: numeric[3]!,
      volume24h: numeric[4]!,
      quoteVolume24h: numeric[5]!,
      source: 'Binance Spot',
      updatedAt,
      dataStatus: 'rest' as const
    }];
  });
}

export async function fetchKlines(pair: string, interval: '1h' | '4h' | '1d', limit = 500): Promise<Candle[]> {
  const safePair = pair.toUpperCase();
  if (!/^[A-Z0-9]{5,15}$/.test(safePair)) throw new Error('Símbolo de mercado inválido.');
  const data = await getFromBinance<BinanceKline[]>(`/api/v3/klines?symbol=${safePair}&interval=${interval}&limit=${Math.min(1000, Math.max(30, limit))}`);
  return data.flatMap((row) => {
    const [time, open, high, low, close, volume, closeTime] = row;
    if (closeTime > Date.now()) return []; // Ignore the still-forming candle in historical statistics.
    const values = [Number(open), Number(high), Number(low), Number(close), Number(volume)];
    if (!Number.isFinite(time) || values.some((value) => !Number.isFinite(value))) return [];
    return [{ time, open: values[0]!, high: values[1]!, low: values[2]!, close: values[3]!, volume: values[4]! }];
  });
}

export function cryptoCatalog() { return CATALOG.map((asset) => ({ ...asset })); }
