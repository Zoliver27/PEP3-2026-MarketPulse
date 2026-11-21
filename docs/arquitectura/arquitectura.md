# Arquitectura técnica

## Decisión general

MARKET PULSE utiliza una arquitectura web dividida en tres responsabilidades: presentación React + TypeScript + Vite, lógica de aplicación Node.js + Express + TypeScript y acceso a datos a través de proveedores independientes. El frontend consume la API propia; las integraciones financieras y el cálculo estadístico se ejecutan en el backend.

## Componentes

- **Presentación (`src/Presentacion/`):** navegación, visualizaciones, tablas, controles de horizonte, búsqueda, comparación y cliente HTTP.
- **API (`src/Logica/`):** rutas Express, validación de parámetros, CORS, Helmet, rate limit, coordinación de servicios y respuestas JSON/SSE.
- **Análisis (`src/Logica/analytics/`):** indicadores técnicos, probabilidades empíricas, intervalos de Wilson y backtesting walk-forward.
- **Datos (`src/Datos/providers/`):** adaptadores Binance Spot y Frankfurter.
- **Caché (`src/Datos/services/`):** almacenamiento temporal de cotizaciones en memoria.
- **Contratos y utilidades (`src/Datos/`):** tipos de series, cotizaciones y funciones HTTP compartidas.

## Flujo de criptomonedas

1. La presentación consulta `GET /api/market/crypto`.
2. La API obtiene tickers REST y reutiliza la caché según el TTL configurado.
3. En paralelo, un WebSocket combinado recibe tickers de los activos iniciales y actualiza los valores recientes en memoria.
4. La presentación escucha `/api/market/stream` mediante Server-Sent Events (SSE).
5. Para los gráficos y el análisis, la API consulta velas históricas bajo demanda.

## Flujo de divisas

1. La API consulta cada par mediante Frankfurter v2.
2. La respuesta conserva el valor, la fecha de observación, la fuente y la frecuencia de referencia diaria.
3. Un par sin cobertura se devuelve como no disponible; no se inventan valores para completar la tabla.
4. El análisis FX utiliza observaciones diarias y horizonte de siete días cuando la muestra es suficiente.

## Resiliencia

- Timeout HTTP definido para solicitudes externas.
- Endpoint REST alternativo para Binance cuando falla la fuente principal.
- Errores de proveedor convertidos en respuestas HTTP controladas.
- Stream con reconexión limitada.
- Los datos REST siguen disponibles cuando el WebSocket está desconectado.

## Límites actuales

- La caché existe solo durante la vida del proceso; reiniciar la API la vacía.
- No hay base de datos persistente ni historial de mercado propio.
- No hay autenticación: la aplicación es de consulta pública.
- La presentación estática y la API se deben desplegar como componentes coordinados.
- El despliegue público aún no se ha configurado en este repositorio.

## Organización del código

- `src/Presentacion/`: interfaz React, componentes, estilos y cliente HTTP.
- `src/Logica/`: API Express, rutas, configuración y análisis estadístico.
- `src/Datos/`: proveedores Binance/Frankfurter, contratos, utilidades y caché.
- `tests/`: pruebas automatizadas separadas del código de producción.
