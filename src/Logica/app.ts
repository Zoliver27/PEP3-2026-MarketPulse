import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env';
import { marketRouter } from './routes/market.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { fxRouter } from './routes/fx.routes';

export const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.frontendOrigin.split(',').map((item) => item.trim()), credentials: false }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Market Pulse API', version: '1.0.2', timestamp: new Date().toISOString() }));
app.use('/api/market', marketRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/fx', fxRouter);
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Error interno inesperado.';
  res.status(500).json({ error: 'Error interno del servidor.', detail: env.nodeEnv === 'development' ? message : undefined });
});
