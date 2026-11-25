# Matriz de cumplimiento de la rúbrica

Fecha de revisión: 25 de noviembre de 2026.  
Repositorio: [Zoliver27/PEP3-2026-MarketPulse](https://github.com/Zoliver27/PEP3-2026-MarketPulse), rama `main`.

| Requisito de la rúbrica | Estado en el repositorio | Evidencia / acción necesaria |
|---|---|---|
| Código fuente actualizado | **Incluido** | `src/Presentacion/`, `src/Logica/`, `src/Datos/` |
| README con descripción, funciones e instrucciones | **Incluido y actualizado** | `README.md` |
| Evidencias mediante capturas | **Pendiente de subir** | El PDF compartido contiene 5 páginas de capturas, pero el archivo PDF y sus imágenes aún no están incorporados al árbol GitHub. Añadirlo y/o extraer capturas verificadas a `docs/evidencias/capturas/`. |
| Historial de commits identificable | **Existe, requiere refuerzo para esta versión** | Consultar [contribuciones.md](contribuciones.md). Los commits históricos de Alison y Camila identifican cargas de archivos de equipo en el repositorio anterior; no son commits de código de MARKET PULSE. |
| Participación activa de cada integrante | **En proceso** | Cada integrante tiene un Issue asignado y debe publicar una revisión y una contribución propia relacionada con MARKET PULSE. |
| Revisión de lenguaje, base de datos, gestión de datos y funcionalidades | **Preparada; revisiones individuales pendientes** | Cada integrante completa su ficha en `revisiones/` y comenta en su Issue asignado. |
| Enlace público de GitHub | **Disponible; comprobar acceso sin iniciar sesión antes de entregar** | https://github.com/Zoliver27/PEP3-2026-MarketPulse |

## Estado técnico para la revisión

### Lenguajes y herramientas
- TypeScript y JavaScript.
- Frontend: React, TypeScript y Vite.
- Backend: Node.js y Express.

### Base de datos
**No existe una base de datos persistente implementada en esta versión.** Los proveedores entregan datos por API; el backend conserva cotizaciones temporalmente en memoria. La caché se pierde al reiniciar el servidor. No se debe declarar una tecnología de base de datos que no esté implementada.

### Recopilación y gestión de datos
- Binance Spot REST: tickers e históricos OHLCV de criptomonedas.
- Binance WebSocket: actualización pública de tickers.
- Frankfurter API v2: pares y series históricas de tipos de cambio de referencia diaria.
- El backend valida respuestas, aplica timeout y gestiona caché temporal en memoria. No hay almacenamiento histórico propio.
- Los tipos FX de Frankfurter son referencias diarias y no deben describirse como cotizaciones de trading en tiempo real.

## Estado funcional del MVP

La estimación de avance **aproximadamente 80%** es una autoevaluación interna orientativa del equipo para el MVP de consulta y análisis. No es certificación del docente ni una medición independiente de calidad o preparación para producción. Debe revisarse con el equipo después de probar cada módulo.

| Módulo / entregable | Estado | Observación |
|---|---|---|
| Dashboard y navegación | Incluido | Overview y navegación entre secciones |
| Cotizaciones cripto | Incluido | REST y WebSocket público de Binance |
| Historiales y gráficos cripto | Incluido | Velas OHLCV para varios periodos |
| Divisas FX | Incluido con limitación | Datos de referencia diaria de Frankfurter |
| Modelo de probabilidades | Incluido | Subida, bajada y estabilidad con muestra mínima |
| Indicadores técnicos | Incluido | SMA, EMA, RSI, MACD, Bollinger y volatilidad |
| Backtesting walk-forward | Incluido | Métricas condicionadas a muestra suficiente |
| Comparador | Implementado en la fuente v1.0.2 compartida; sincronización/validación GitHub pendiente | El ZIP inspeccionado contiene dos series normalizadas a Base 100, intersección temporal y dos líneas. Falta publicar el código exacto en `main` y ejecutar la prueba end-to-end con pares distintos. |
| Persistencia propia de datos | No implementada | No hay base de datos ni histórico propio |
| Pruebas automatizadas en CI | **Aprobadas** | GitHub Actions completó `npm install`, `npm test`, `npm run typecheck` y `npm run build` correctamente. [Ver Run #44948013705](https://github.com/Zoliver27/PEP3-2026-MarketPulse/actions/runs/44948013705). |
| Pruebas manuales y despliegue | Pendiente de validar | Pruebas visuales de v1.0.2, proveedores externos y hosting público |

## Acciones finales antes de entregar en Moodle

- [ ] Alison y Camila completan/publican sus revisiones individuales desde sus cuentas.
- [ ] Cada integrante registra al menos un commit propio relacionado con MARKET PULSE.
- [ ] Subir capturas reales de v1.0.2 a `docs/evidencias/capturas/`.
- [ ] Revisar el comparador y registrar el resultado observado.
- [ ] Verificar que el enlace sea público y abrirlo sin iniciar sesión.
- [ ] Publicar en Moodle el enlace público del repositorio.
