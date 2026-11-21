import type { Candle } from '../../Datos/types';

const mean = (values: number[]): number | null => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

export function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  return mean(values.slice(-period));
}

export function emaSeries(values: number[], period: number): number[] {
  if (!values.length) return [];
  const multiplier = 2 / (period + 1);
  const result = [values[0]!];
  for (let i = 1; i < values.length; i += 1) {
    result.push(values[i]! * multiplier + result[i - 1]! * (1 - multiplier));
  }
  return result;
}

export function rsi(values: number[], period = 14): number | null {
  if (values.length <= period) return null;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - period; i < values.length; i += 1) {
    const change = values[i]! - values[i - 1]!;
    if (change > 0) gains += change;
    else losses -= change;
  }
  const averageGain = gains / period;
  const averageLoss = losses / period;
  if (averageLoss === 0) return averageGain === 0 ? 50 : 100;
  return 100 - 100 / (1 + averageGain / averageLoss);
}

function standardDeviation(values: number[]): number | null {
  if (values.length < 2) return null;
  const average = mean(values)!;
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1));
}

export function calculateIndicators(candles: Candle[]) {
  const closes = candles.map((candle) => candle.close);
  const ema12Series = emaSeries(closes, 12);
  const ema26Series = emaSeries(closes, 26);
  const macdSeries = ema12Series.map((value, index) => value - (ema26Series[index] ?? value));
  const signalSeries = emaSeries(macdSeries, 9);
  const middle = sma(closes, 20);
  const deviation = standardDeviation(closes.slice(-20));
  return {
    sma20: sma(closes, 20),
    sma50: sma(closes, 50),
    ema12: ema12Series.at(-1) ?? null,
    ema26: ema26Series.at(-1) ?? null,
    rsi14: rsi(closes),
    macd: macdSeries.at(-1) ?? null,
    signal9: signalSeries.at(-1) ?? null,
    bollingerUpper: middle !== null && deviation !== null ? middle + 2 * deviation : null,
    bollingerLower: middle !== null && deviation !== null ? middle - 2 * deviation : null
  };
}

export function calculateVolatility(candles: Candle[], interval: '1h' | '1d') {
  const closes = candles.map((candle) => candle.close);
  const returns = closes.slice(1).flatMap((close, index) => {
    const previous = closes[index]!;
    return previous > 0 && close > 0 ? [Math.log(close / previous)] : [];
  });
  const deviation = standardDeviation(returns);
  if (deviation === null) return { dailyPct: 0, annualizedPct: 0, level: 'No disponible' as const };
  const periodsPerDay = interval === '1h' ? 24 : 1;
  const dailyPct = deviation * Math.sqrt(periodsPerDay) * 100;
  const annualizedPct = deviation * Math.sqrt(interval === '1h' ? 24 * 365 : 365) * 100;
  return {
    dailyPct,
    annualizedPct,
    level: dailyPct < 1 ? 'Baja' as const : dailyPct < 3 ? 'Media' as const : 'Alta' as const
  };
}

export function classifyTrend(indicators: ReturnType<typeof calculateIndicators>): 'Alcista' | 'Bajista' | 'Lateral' | 'No disponible' {
  if (indicators.sma20 === null || indicators.sma50 === null || indicators.macd === null) return 'No disponible';
  if (indicators.sma20 > indicators.sma50 && indicators.macd > 0) return 'Alcista';
  if (indicators.sma20 < indicators.sma50 && indicators.macd < 0) return 'Bajista';
  return 'Lateral';
}
