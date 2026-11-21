export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  pair: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  quoteVolume24h: number;
  source: string;
  updatedAt: string;
  dataStatus: 'live' | 'rest';
}

export type Horizon = '1h' | '24h' | '7d';
export type Outcome = 'up' | 'down' | 'stable';

export interface Probabilities {
  up: number;
  down: number;
  stable: number;
}

export interface ProbabilityAnalysis {
  symbol: string;
  horizon: Horizon;
  probabilities: Probabilities;
  sampleSize: number;
  stabilityThresholdPct: number;
  confidenceIntervals: Record<Outcome, { lower: number; upper: number }>;
  trend: 'Alcista' | 'Bajista' | 'Lateral' | 'No disponible';
  volatility: { dailyPct: number; annualizedPct: number; level: 'Baja' | 'Media' | 'Alta' | 'No disponible' };
  indicators: {
    sma20: number | null;
    sma50: number | null;
    ema12: number | null;
    ema26: number | null;
    rsi14: number | null;
    macd: number | null;
    signal9: number | null;
    bollingerUpper: number | null;
    bollingerLower: number | null;
  };
  note: string;
  generatedAt: string;
}

export interface FxRate {
  pair: string;
  base: string;
  quote: string;
  rate: number | null;
  date: string | null;
  source: string;
  frequency: 'Referencia diaria';
  available: boolean;
  message?: string;
}
