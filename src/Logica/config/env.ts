import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: process.env.ENV_FILE ?? path.resolve(process.cwd(), '../../.env') });

function numberFromEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  port: numberFromEnv(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  binanceRestUrl: process.env.BINANCE_REST_URL ?? 'https://data-api.binance.vision',
  binanceStreamUrl: process.env.BINANCE_STREAM_URL ?? 'wss://data-stream.binance.vision/stream',
  frankfurterApiUrl: process.env.FRANKFURTER_API_URL ?? 'https://api.frankfurter.dev/v2',
  marketCacheTtlMs: numberFromEnv(process.env.MARKET_CACHE_TTL_MS, 10_000)
};
