import { app } from './app';
import { env } from './config/env';
import { startBinanceStream, stopBinanceStream } from './services/binance-stream';

const server = app.listen(env.port, () => {
  console.log(`\n  MARKET PULSE API  ·  http://localhost:${env.port}`);
  console.log(`  Entorno: ${env.nodeEnv}\n`);
});
startBinanceStream();

function shutdown(signal: string) {
  console.log(`\n${signal}: cerrando Market Pulse API...`);
  stopBinanceStream();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 8_000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
