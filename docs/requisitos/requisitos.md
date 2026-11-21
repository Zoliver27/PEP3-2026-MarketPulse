# Requisitos de MARKET PULSE

## Funcionales
1. Consultar activos de criptomonedas y sus precios Spot disponibles.
2. Recibir actualizaciones de mercado mediante WebSocket y disponer de respaldo REST.
3. Consultar históricos OHLCV y visualizar gráficos por período.
4. Consultar pares de divisas y distinguir tasas de referencia diaria de cotizaciones intradía.
5. Calcular indicadores técnicos a partir de series históricas disponibles.
6. Estimar P(subida), P(bajada) y P(estabilidad) con frecuencias empíricas suavizadas.
7. No producir estimaciones cuando la muestra histórica sea insuficiente.
8. Presentar intervalos descriptivos y resultados de backtesting walk-forward cuando hay suficientes observaciones.
9. Comparar activos y mostrar fuente y fecha de actualización.
10. Explicar metodología, autores y limitaciones del sistema.

## No funcionales
- Separación de presentación, lógica y acceso a datos.
- TypeScript estricto y módulos reutilizables.
- Manejo de errores, timeout, CORS, Helmet y límite de solicitudes en la API.
- No incluir secretos, `.env` ni dependencias instaladas en Git.
- Interfaz adaptable y legible.
- Documentar la frecuencia y procedencia de los datos.

## Limitaciones conocidas
- El backend usa caché en memoria y no tiene base de datos persistente.
- El servicio FX de referencia diaria no equivale a una cotización negociable en tiempo real.
- La calidad predictiva no se da por demostrada por la existencia del modelo: debe juzgarse mediante backtesting y datos adicionales.
