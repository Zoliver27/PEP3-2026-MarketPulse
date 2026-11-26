# Matriz de cumplimiento de la rúbrica

Fecha de revisión: 25 de noviembre de 2026.  
Repositorio: [Zoliver27/PEP3-2026-MarketPulse](https://github.com/Zoliver27/PEP3-2026-MarketPulse), rama `main`.

| Requisito de la rúbrica | Estado en el repositorio | Evidencia / acción necesaria |
|---|---|---|
| Código fuente | Incluido en la estructura actual | `src/Presentacion/`, `src/Logica/`, `src/Datos/`; contrastar con la versión local v1.0.2 antes de afirmar sincronización completa. |
| README con descripción, funciones e instrucciones | Incluido y actualizado | `README.md` |
| Evidencias mediante capturas | **Incluido** | PDF real versionado: [`docs/evidencias/capturas/Capturas.pdf`](../evidencias/capturas/Capturas.pdf). |
| Historial de commits identificable | Existe, requiere refuerzo para esta versión | Consultar [contribuciones.md](contribuciones.md). Cada integrante debe registrar su propia contribución desde su cuenta. |
| Participación activa de cada integrante | En proceso | Cada integrante debe publicar una revisión y una contribución propia relacionada con MARKET PULSE. |
| Revisión de lenguaje, base de datos, gestión de datos y funcionalidades | Preparada; revisiones individuales pendientes | Cada integrante completa su ficha en `revisiones/` y comenta en su Issue asignado. |
| Enlace público de GitHub | Disponible; comprobar acceso sin iniciar sesión antes de entregar | https://github.com/Zoliver27/PEP3-2026-MarketPulse |

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

La estimación de avance **aproximadamente 80%** es una autoevaluación interna orientativa del equipo para el MVP de consulta y análisis. No es certificación del docente ni una medición independiente de calidad o preparación para producción.

| Módulo / entregable | Estado | Observación |
|---|---|---|
| Dashboard y navegación | Incluido | Overview y navegación entre secciones |
| Cotizaciones cripto | Incluido | REST y WebSocket público de Binance |
| Historiales y gráficos cripto | Incluido | Velas OHLCV para varios periodos |
| Divisas FX | Incluido con limitación | Datos de referencia diaria de Frankfurter |
| Modelo de probabilidades | Incluido | Subida, bajada y estabilidad con muestra mínima |
| Indicadores técnicos | Incluido | SMA, EMA, RSI, MACD, Bollinger y volatilidad |
| Backtesting walk-forward | Incluido | Métricas condicionadas a muestra suficiente |
| Comparador | Implementado en la fuente v1.0.2 compartida; publicación y validación end-to-end pendientes | La copia local contiene dos series normalizadas a Base 100, intersección temporal y dos líneas. Falta probar con activos distintos y verificar la respuesta real del proveedor. |
| Persistencia propia de datos | No implementada | No hay base de datos ni histórico propio |
| Pruebas automatizadas en CI | Aprobadas en la ejecución registrada | GitHub Actions completó `npm install`, `npm test`, `npm run typecheck` y `npm run build` en el run documentado. Esto no valida cambios locales posteriores. [Ver Run #44948013705](https://github.com/Zoliver27/PEP3-2026-MarketPulse/actions/runs/44948013705). |
| Pruebas manuales y despliegue | Pendiente de validar | Pruebas visuales de v1.0.2, proveedores externos y hosting público |

## Acciones finales antes de entregar en Moodle

- [ ] Alison y Camila completan/publican sus revisiones individuales desde sus cuentas.
- [ ] Cada integrante registra al menos un commit propio relacionado con MARKET PULSE.
- [x] PDF de capturas incorporado a `docs/evidencias/capturas/Capturas.pdf`.
- [ ] Revisar el comparador y registrar el resultado observado.
- [ ] Confirmar si el código publicado en `main` corresponde íntegramente a la versión local v1.0.2.
- [ ] Verificar que el enlace sea público y abrirlo sin iniciar sesión.
- [ ] Publicar en Moodle el enlace público del repositorio.