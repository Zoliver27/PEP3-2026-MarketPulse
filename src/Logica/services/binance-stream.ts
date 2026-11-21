import WebSocket from 'ws';
import { env } from '../config/env';
import { cryptoCatalog } from '../../Datos/providers/binance.provider';
import { updateLiveAsset } from '../../Datos/services/market-cache';

export type StreamListener = (message: unknown) => void;
const listeners = new Set<StreamListener>();
let socket: WebSocket | null = null;
let retryTimer: NodeJS.Timeout | null = null;
let retryDelay = 3_000;
let started = false;

function publish(message: unknown) { for (const listener of listeners) listener(message); }

function connect() {
  const streams = cryptoCatalog().map((asset) => `${asset.pair.toLowerCase()}@ticker`).join('/');
  const url = `${env.binanceStreamUrl}?streams=${streams}`;
  try {
    socket = new WebSocket(url);
    socket.on('open', () => { retryDelay = 3_000; publish({ type: 'status', connected: true, provider: 'Binance WebSocket' }); });
    socket.on('message', (buffer) => {
      try {
        const message = JSON.parse(buffer.toString()) as { data?: Record<string, string> };
        const ticker = message.data;
        if (!ticker?.s || !ticker.c) return;
        const pair = ticker.s;
        const asset = cryptoCatalog().find((item) => item.pair === pair);
        const price = Number(ticker.c);
        const change = Number(ticker.P);
        if (!asset || !Number.isFinite(price) || !Number.isFinite(change)) return;
        const update = {
          id: asset.id, name: asset.name, symbol: asset.symbol, pair,
          price, change24h: change, high24h: Number(ticker.h), low24h: Number(ticker.l),
          volume24h: Number(ticker.v), quoteVolume24h: Number(ticker.q),
          source: 'Binance Spot WebSocket', updatedAt: new Date().toISOString(), dataStatus: 'live' as const
        };
        updateLiveAsset(update);
        publish({ type: 'ticker', data: update });
      } catch { /* Ignore malformed provider messages without breaking the stream. */ }
    });
    socket.on('error', () => socket?.close());
    socket.on('close', () => {
      publish({ type: 'status', connected: false, provider: 'Binance WebSocket' });
      socket = null;
      if (!started) return;
      retryTimer = setTimeout(connect, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30_000);
    });
  } catch {
    retryTimer = setTimeout(connect, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30_000);
  }
}

export function startBinanceStream() {
  if (started) return;
  started = true;
  connect();
}

export function stopBinanceStream() {
  started = false;
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
  socket?.close();
  socket = null;
}

export function subscribeStream(listener: StreamListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function streamStatus() { return socket?.readyState === WebSocket.OPEN; }
