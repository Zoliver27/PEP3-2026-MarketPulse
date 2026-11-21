import { Router } from 'express';
import { estimateProbabilities } from '../analytics/probability';
import { fetchFxHistory, fetchFxPairs } from '../../Datos/providers/frankfurter.provider';

export const fxRouter = Router();

fxRouter.get('/pairs', async (_req, res) => {
  try {
    const data = await fetchFxPairs();
    res.json({ data, source: 'Frankfurter', updatedAt: new Date().toISOString(), frequency: 'Referencia diaria' });
  } catch (error) {
    res.status(502).json({ error: 'No se pudo consultar el proveedor de divisas.', detail: error instanceof Error ? error.message : 'Error de proveedor' });
  }
});

fxRouter.get('/pair/:base/:quote', async (req, res) => {
  try {
    const base = req.params.base!.toUpperCase();
    const quote = req.params.quote!.toUpperCase();
    const history = await fetchFxHistory(base, quote, 365);
    const candles = history.map((item) => ({ ...item, time: item.time }));
    const analysis = estimateProbabilities(candles, `${base}/${quote}`, '7d');
    if (!analysis.available) return res.status(422).json({ error: analysis.reason });
    res.json({ data: analysis.result, history, source: 'Frankfurter · tipos de referencia', frequency: 'Referencia diaria', updatedAt: new Date().toISOString() });
  } catch (error) {
    res.status(502).json({ error: 'No se pudo consultar el par solicitado.', detail: error instanceof Error ? error.message : 'Par no disponible o error del proveedor' });
  }
});
