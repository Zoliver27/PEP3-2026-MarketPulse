import { Router } from 'express';
import { estimateProbabilities, runWalkForwardBacktest } from '../analytics/probability';
import { fetchKlines, cryptoCatalog } from '../../Datos/providers/binance.provider';
import { isHorizon } from './market.routes';

export const analyticsRouter = Router();

analyticsRouter.get('/:symbol', async (req, res) => {
  try {
    const asset = cryptoCatalog().find((item) => item.symbol === req.params.symbol?.toUpperCase());
    if (!asset) return res.status(404).json({ error: 'Activo no encontrado.' });
    const horizon = req.query.horizon ?? '24h';
    if (!isHorizon(horizon)) return res.status(400).json({ error: 'Horizonte inválido. Usa 1h, 24h o 7d.' });
    const interval = horizon === '7d' ? '1d' : '1h';
    const candles = await fetchKlines(asset.pair, interval, 1000);
    const analysis = estimateProbabilities(candles, asset.symbol, horizon);
    if (!analysis.available) return res.status(422).json({ error: analysis.reason, sampleSize: analysis.sampleSize });
    res.json({ data: analysis.result, source: 'Binance Spot · historial OHLCV', updatedAt: new Date().toISOString() });
  } catch (error) {
    res.status(502).json({ error: 'No se pudo calcular el análisis del activo.', detail: error instanceof Error ? error.message : 'Error de proveedor' });
  }
});

analyticsRouter.get('/:symbol/backtest', async (req, res) => {
  try {
    const asset = cryptoCatalog().find((item) => item.symbol === req.params.symbol?.toUpperCase());
    if (!asset) return res.status(404).json({ error: 'Activo no encontrado.' });
    const horizon = req.query.horizon ?? '24h';
    if (!isHorizon(horizon)) return res.status(400).json({ error: 'Horizonte inválido.' });
    const candles = await fetchKlines(asset.pair, horizon === '7d' ? '1d' : '1h', 1000);
    res.json({ data: runWalkForwardBacktest(candles, horizon), source: 'Binance Spot · historial OHLCV' });
  } catch (error) {
    res.status(502).json({ error: 'No se pudo ejecutar el backtest.', detail: error instanceof Error ? error.message : 'Error de proveedor' });
  }
});
