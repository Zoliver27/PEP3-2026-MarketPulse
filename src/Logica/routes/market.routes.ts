import { Router } from 'express';
import { fetchCryptoMarket, fetchKlines, cryptoCatalog } from '../../Datos/providers/binance.provider';
import { getCachedMarket } from '../../Datos/services/market-cache';
import { subscribeStream, streamStatus } from '../services/binance-stream';
import type { Horizon } from '../../Datos/types';

export const marketRouter = Router();
const validPeriods = ['1d', '7d', '30d', '90d'] as const;

marketRouter.get('/crypto', async (_req, res) => {
  try {
    const assets = await getCachedMarket(fetchCryptoMarket);
    res.json({ data: assets, source: 'Binance Spot', updatedAt: new Date().toISOString(), streamConnected: streamStatus() });
  } catch (error) {
    res.status(502).json({ error: 'No se pudo obtener el mercado de criptomonedas desde Binance.', detail: error instanceof Error ? error.message : 'Error de proveedor' });
  }
});

marketRouter.get('/crypto/catalog', (_req, res) => res.json({ data: cryptoCatalog() }));

marketRouter.get('/crypto/:symbol/history', async (req, res) => {
  try {
    const asset = cryptoCatalog().find((item) => item.symbol === req.params.symbol?.toUpperCase());
    if (!asset) return res.status(404).json({ error: 'Activo no encontrado.' });
    const period = String(req.query.period ?? '7d');
    if (!validPeriods.includes(period as typeof validPeriods[number])) return res.status(400).json({ error: 'Período inválido.' });
    const interval = period === '1d' || period === '7d' ? '1h' : period === '30d' ? '4h' : '1d';
    const limit = period === '1d' ? 24 : period === '7d' ? 168 : period === '30d' ? 180 : 90;
    const candles = await fetchKlines(asset.pair, interval, limit);
    res.json({ data: candles, source: 'Binance Spot · velas históricas', interval, updatedAt: new Date().toISOString() });
  } catch (error) {
    res.status(502).json({ error: 'No se pudo obtener el historial del activo.', detail: error instanceof Error ? error.message : 'Error de proveedor' });
  }
});

marketRouter.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  res.write(`event: status\ndata: ${JSON.stringify({ connected: streamStatus(), provider: 'Binance WebSocket' })}\n\n`);
  const unsubscribe = subscribeStream((message) => res.write(`data: ${JSON.stringify(message)}\n\n`));
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25_000);
  req.on('close', () => { clearInterval(heartbeat); unsubscribe(); res.end(); });
});

export function isHorizon(value: unknown): value is Horizon {
  return value === '1h' || value === '24h' || value === '7d';
}
