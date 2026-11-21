import type { Candle, Horizon, Outcome, Probabilities } from '../../Datos/types';
import { calculateIndicators, calculateVolatility, classifyTrend } from './indicators';

const CLASSES: Outcome[] = ['up', 'down', 'stable'];
const HORIZON_STEPS: Record<Horizon, number> = { '1h': 1, '24h': 24, '7d': 7 };

function quantileInterval(successes: number, total: number, z = 1.96) {
  if (total === 0) return { lower: 0, upper: 1 };
  const p = successes / total;
  const denominator = 1 + z * z / total;
  const center = (p + z * z / (2 * total)) / denominator;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / denominator;
  return { lower: Math.max(0, center - margin), upper: Math.min(1, center + margin) };
}

function horizonReturns(closes: number[], steps: number): number[] {
  const returns: number[] = [];
  for (let i = 0; i + steps < closes.length; i += 1) {
    const start = closes[i]!;
    const end = closes[i + steps]!;
    if (start > 0 && end > 0 && Number.isFinite(start) && Number.isFinite(end)) returns.push(end / start - 1);
  }
  return returns;
}

function classifyReturn(value: number, threshold: number): Outcome {
  if (value > threshold) return 'up';
  if (value < -threshold) return 'down';
  return 'stable';
}

function distribution(returns: number[]) {
  if (returns.length < 2) return { probabilities: { up: 0, down: 0, stable: 0 }, threshold: 0 };
  const average = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance = returns.reduce((sum, value) => sum + (value - average) ** 2, 0) / (returns.length - 1);
  // The neutral band is 10% of observed horizon volatility, with a small floor to avoid classifying floating-point noise as a move.
  const threshold = Math.max(0.0005, Math.sqrt(variance) * 0.1);
  const counts: Record<Outcome, number> = { up: 0, down: 0, stable: 0 };
  for (const value of returns) counts[classifyReturn(value, threshold)] += 1;
  // Laplace smoothing prevents a class from receiving an artificial exact zero in small samples.
  const denominator = returns.length + CLASSES.length;
  const probabilities = {
    up: (counts.up + 1) / denominator,
    down: (counts.down + 1) / denominator,
    stable: (counts.stable + 1) / denominator
  };
  return { probabilities, threshold };
}

export function estimateProbabilities(candles: Candle[], symbol: string, horizon: Horizon) {
  const steps = HORIZON_STEPS[horizon];
  const closes = candles.map((candle) => candle.close).filter((close) => Number.isFinite(close) && close > 0);
  const returns = horizonReturns(closes, steps);
  if (returns.length < 30) {
    return {
      available: false as const,
      reason: `Datos insuficientes: se requieren al menos 30 observaciones históricas para el horizonte ${horizon}; se obtuvieron ${returns.length}.`,
      symbol,
      horizon,
      sampleSize: returns.length
    };
  }
  const { probabilities, threshold } = distribution(returns);
  const counts: Record<Outcome, number> = { up: 0, down: 0, stable: 0 };
  for (const value of returns) counts[classifyReturn(value, threshold)] += 1;
  const intervals = {
    up: quantileInterval(counts.up, returns.length),
    down: quantileInterval(counts.down, returns.length),
    stable: quantileInterval(counts.stable, returns.length)
  };
  const interval = horizon === '7d' ? '1d' : '1h';
  const indicators = calculateIndicators(candles);
  const volatility = calculateVolatility(candles, interval);
  const trend = classifyTrend(indicators);
  const sum = probabilities.up + probabilities.down + probabilities.stable;
  const normalized = {
    up: probabilities.up / sum,
    down: probabilities.down / sum,
    stable: probabilities.stable / sum
  };
  return {
    available: true as const,
    result: {
      symbol,
      horizon,
      probabilities: normalized,
      sampleSize: returns.length,
      stabilityThresholdPct: threshold * 100,
      confidenceIntervals: intervals,
      trend,
      volatility,
      indicators,
      note: 'Estimación empírica: frecuencias históricas de rendimientos solapados del mismo horizonte. No es una probabilidad causal ni una garantía de rendimiento futuro.',
      generatedAt: new Date().toISOString()
    }
  };
}

export function runWalkForwardBacktest(candles: Candle[], horizon: Horizon) {
  const steps = HORIZON_STEPS[horizon];
  const closes = candles.map((candle) => candle.close).filter((close) => Number.isFinite(close) && close > 0);
  const predictions: Array<{ probabilities: Probabilities; actual: Outcome; predicted: Outcome }> = [];
  const warmup = Math.max(80, steps * 4);
  for (let index = warmup; index + steps < closes.length; index += Math.max(1, steps)) {
    const training = horizonReturns(closes.slice(Math.max(0, index - 500), index), steps);
    if (training.length < 30) continue;
    const model = distribution(training);
    const actualReturn = closes[index + steps]! / closes[index]! - 1;
    const actual = classifyReturn(actualReturn, model.threshold);
    const entries = Object.entries(model.probabilities) as Array<[Outcome, number]>;
    entries.sort((a, b) => b[1] - a[1]);
    predictions.push({ probabilities: model.probabilities, actual, predicted: entries[0]![0] });
  }
  if (predictions.length < 10) {
    return { available: false as const, reason: 'No hay suficientes predicciones walk-forward para evaluar el modelo.', testSamples: predictions.length };
  }
  let brier = 0;
  let correct = 0;
  const confusion: Record<Outcome, Record<Outcome, number>> = {
    up: { up: 0, down: 0, stable: 0 },
    down: { up: 0, down: 0, stable: 0 },
    stable: { up: 0, down: 0, stable: 0 }
  };
  const precisionRecall: Record<Outcome, { tp: number; fp: number; fn: number }> = {
    up: { tp: 0, fp: 0, fn: 0 }, down: { tp: 0, fp: 0, fn: 0 }, stable: { tp: 0, fp: 0, fn: 0 }
  };
  for (const prediction of predictions) {
    for (const outcome of CLASSES) {
      const target = prediction.actual === outcome ? 1 : 0;
      brier += (prediction.probabilities[outcome] - target) ** 2;
      if (prediction.predicted === outcome && prediction.actual === outcome) precisionRecall[outcome].tp += 1;
      else if (prediction.predicted === outcome) precisionRecall[outcome].fp += 1;
      else if (prediction.actual === outcome) precisionRecall[outcome].fn += 1;
    }
    if (prediction.predicted === prediction.actual) correct += 1;
    confusion[prediction.actual][prediction.predicted] += 1;
  }
  const metrics = Object.fromEntries(CLASSES.map((outcome) => {
    const item = precisionRecall[outcome];
    return [outcome, {
      precision: item.tp + item.fp ? item.tp / (item.tp + item.fp) : 0,
      recall: item.tp + item.fn ? item.tp / (item.tp + item.fn) : 0
    }];
  }));
  return {
    available: true as const,
    method: 'Walk-forward expanding window; cada predicción utiliza únicamente observaciones anteriores al instante evaluado.',
    testSamples: predictions.length,
    accuracy: correct / predictions.length,
    brierScore: brier / predictions.length,
    precisionRecall: metrics,
    confusionMatrix: confusion,
    evaluatedAt: new Date().toISOString()
  };
}
