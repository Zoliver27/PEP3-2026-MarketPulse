# Metodología matemática y estadística

## Rendimientos

Se usan rendimientos simples para clasificar resultados:

`r(t,h) = P(t+h) / P(t) - 1`

Los horizontes para cripto equivalen a una barra 1h, 24 barras 1h o 7 barras 1d. FX utiliza una serie diaria y solo ofrece horizonte 7d.

## Umbral neutral

Para el conjunto de rendimientos históricos del horizonte se calcula la desviación estándar muestral `s`. La banda neutral es:

`epsilon = max(0.0005, 0.1 * s)`

- Subida: `r > epsilon`.
- Bajada: `r < -epsilon`.
- Estabilidad: `-epsilon <= r <= epsilon`.

## Estimación de probabilidades

Se usan frecuencias empíricas suavizadas:

`P(clase) = (n_clase + 1) / (n + 3)`

Cada clase recibe una pseudo-observación. La suma de las tres probabilidades es 1. Se requiere un mínimo de 30 ventanas históricas.

## Intervalos

Los intervalos se calculan mediante la aproximación de Wilson con z=1.96. Deben interpretarse como intervalos descriptivos de proporciones; las ventanas solapadas introducen dependencia serial, por lo que la cobertura nominal del 95% no está garantizada.

## Backtesting

Se usa una evaluación walk-forward. Para cada punto de evaluación se construyen las ventanas de entrenamiento con precios anteriores a ese punto, se estima la distribución, y se clasifica el resultado futuro con el umbral calculado en entrenamiento. Las predicciones se evalúan mediante Brier Score multicategoría, accuracy, precision, recall y matriz de confusión.

No es una estrategia de inversión optimizada. No incorpora comisiones, slippage, spread, liquidez o ejecución; por ello no debe confundirse con un backtest de rentabilidad.

## Indicadores

- SMA20 y SMA50.
- EMA12 y EMA26.
- RSI14.
- MACD y señal EMA9.
- Bandas de Bollinger 20 periodos y 2 desviaciones.
- Volatilidad histórica de rendimientos logarítmicos, expresada diaria y anualizada.

Los indicadores contextualizan el mercado, pero no se usan como pesos subjetivos en la estimación principal.
