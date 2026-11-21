import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateProbabilities, runWalkForwardBacktest } from '../../src/Logica/analytics/probability';
import type { Candle } from '../../src/Datos/types';

function candlesFromCloses(closes: number[]): Candle[] {
  return closes.map((close, index) => ({ time: index * 3_600_000, open: close, high: close * 1.01, low: close * 0.99, close, volume: 100 }));
}

test('probability estimate is unavailable with too few historical observations', () => {
  const result = estimateProbabilities(candlesFromCloses(Array.from({ length: 20 }, (_, i) => 100 + i)), 'TEST', '1h');
  assert.equal(result.available, false);
});

test('probabilities add up to 1 and all values are finite', () => {
  const closes = Array.from({ length: 600 }, (_, index) => 100 * Math.exp(0.0001 * index + Math.sin(index / 4) * 0.015));
  const result = estimateProbabilities(candlesFromCloses(closes), 'TEST', '1h');
  assert.equal(result.available, true);
  if (result.available) {
    const { up, down, stable } = result.result.probabilities;
    assert.ok(Number.isFinite(up) && Number.isFinite(down) && Number.isFinite(stable));
    assert.ok(Math.abs(up + down + stable - 1) < 1e-10);
    assert.ok(result.result.sampleSize > 30);
  }
});

test('walk-forward backtest returns metrics only when enough out-of-sample samples exist', () => {
  const closes = Array.from({ length: 800 }, (_, index) => 100 * Math.exp(Math.sin(index / 8) * 0.03 + index * 0.00005));
  const result = runWalkForwardBacktest(candlesFromCloses(closes), '1h');
  assert.equal(result.available, true);
  if (result.available) {
    assert.ok(result.testSamples >= 10);
    assert.ok(result.brierScore >= 0 && result.brierScore <= 2);
  }
});
