# Fuentes externas y APIs

## Binance Spot

**Documentación:** https://github.com/binance/binance-spot-api-docs

- REST base: `https://data-api.binance.vision`
- REST de respaldo: `https://api.binance.com`
- Stream: `wss://data-stream.binance.vision/stream`
- Ticker 24h: `/api/v3/ticker/24hr?symbols=[...]`
- Velas: `/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1000`

Se consultan endpoints públicos de datos de mercado. No se necesitan API keys ni se realizan operaciones o movimientos de fondos.

## Frankfurter

**Documentación:** https://frankfurter.dev/

- API v2: `https://api.frankfurter.dev/v2`
- Par individual: `/rate/usd/bob`
- Serie histórica: `/rates?from=YYYY-MM-DD&base=USD&quotes=BOB`

Los datos son tasas de referencia agregadas; no son cotizaciones intradía ni precios ejecutables. El backend mantiene la fecha de observación y muestra indisponibilidad cuando un par no tiene cobertura.

## Política de uso

Antes de un despliegue público, revisar documentación, políticas de uso, atribución y cambios de endpoints. La aplicación limita solicitudes hacia el backend, cachea los tickers y realiza llamadas históricas bajo demanda.

## Organización en el repositorio

Los conectores de proveedores están en `src/Datos/providers/`; las rutas HTTP que los orquestan están en `src/Logica/routes/`.
