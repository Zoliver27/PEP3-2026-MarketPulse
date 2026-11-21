# PEP3-2026-MarketPulse

**MARKET PULSE — Real-Time Financial Intelligence Platform**

Plataforma web académica para consultar criptomonedas y divisas, visualizar historiales de mercado y estudiar estimaciones estadísticas de subida, bajada y estabilidad.

> **Versión organizada en GitHub:** v1.0.2. El equipo ha informado que la aplicación se ejecuta localmente. El despliegue público todavía no está configurado. Las capturas incorporadas al repositorio deben identificar exactamente la versión que aparece en ellas.

## Equipo autor

- **Oliver Zunagua** — [@Zoliver27](https://github.com/Zoliver27)
- **Camila Andia** — [@camilita4cami-png](https://github.com/camilita4cami-png)
- **Alison Bejarano** — [@AlisonBejarano7](https://github.com/AlisonBejarano7)

Las responsabilidades específicas de MARKET PULSE deben ser confirmadas por cada integrante en [docs/equipo/roles.md](docs/equipo/roles.md). Las revisiones personales están en [docs/seguimiento/revisiones/](docs/seguimiento/revisiones/).

## Avance del proyecto

**Estimación interna orientativa del MVP funcional: aproximadamente 80%.** Es una autoevaluación inicial del equipo, no una certificación del docente ni una declaración de que el producto esté listo para producción. La estimación debe contrastarse con las funciones efectivamente probadas. La persistencia propia de datos, pruebas integrales y despliegue público siguen pendientes; el comparador requiere validación funcional.

Consulta la [matriz de cumplimiento de la rúbrica](docs/seguimiento/matriz-rubrica.md) para revisar componentes implementados y tareas pendientes.

## Funcionalidades incluidas

- Dashboard general con diez criptomonedas iniciales: BTC, ETH, SOL, BNB, XRP, ADA, DOGE, LTC, DOT y AVAX.
- Cotizaciones Spot de Binance mediante REST y actualizaciones WebSocket públicas.
- Consulta de historial OHLCV y gráficos de precios de criptomonedas.
- Consulta de pares de divisas y series históricas de referencia mediante Frankfurter.
- Indicadores SMA, EMA, RSI, MACD, bandas de Bollinger y volatilidad histórica.
- Estimación empírica de subida, bajada y estabilidad con suavizado de Laplace e intervalos de Wilson.
- Backtesting walk-forward y métricas de evaluación cuando existe muestra suficiente.
- Secciones de criptomonedas, divisas, comparador, metodología e información del proyecto.

El estado de cada componente y sus limitaciones están descritos en [docs/seguimiento/matriz-rubrica.md](docs/seguimiento/matriz-rubrica.md).

## Lenguajes y tecnologías

| Área | Tecnología |
|---|---|
| Lenguajes | TypeScript y JavaScript |
| Interfaz | React, TypeScript y Vite |
| API / backend | Node.js y Express |
| Visualización | Recharts |
| Datos de mercado | Binance Spot REST y WebSocket |
| Divisas | Frankfurter API v2 |
| Pruebas | Node.js Test Runner y TypeScript |

## Base de datos y gestión de datos

**Actualmente no hay una base de datos persistente implementada.** No se debe afirmar que el proyecto utiliza MySQL, PostgreSQL, SQL Server, MongoDB u otra base de datos.

La aplicación consulta proveedores externos. El backend mantiene una caché temporal en memoria para cotizaciones; esa caché se pierde al reiniciar el servidor. No existe en esta versión un repositorio histórico propio ni persistencia de usuarios.

- **Criptomonedas:** Binance Spot REST para tickers e históricos OHLCV; WebSocket público para actualizaciones de precios.
- **Divisas:** Frankfurter API v2 para tasas de referencia e historiales diarios.
- **Gestión:** validación de respuestas, manejo de errores, caché temporal y presentación de fuente/fecha cuando está disponible.
- **Frecuencia:** Binance ofrece datos de mercado y stream; Frankfurter proporciona tasas de referencia, no cotizaciones intradía de trading.

Más detalles: [fuentes y APIs](docs/arquitectura/apis.md) y [estado del proyecto](docs/seguimiento/matriz-rubrica.md).

## Arquitectura y estructura

```text
PEP3-2026-MarketPulse/
├── .github/                 # Plantillas y automatización de GitHub
├── data/                    # Política, muestras y esquemas
├── docs/
│   ├── arquitectura/        # Arquitectura y APIs
│   ├── decisiones/         # Decisiones técnicas e historial
│   ├── equipo/             # Autores y responsabilidades
│   ├── evidencias/          # Capturas verificables del funcionamiento
│   ├── manuales/            # Instalación, uso y pruebas
│   ├── planificacion/       # Fases y tareas
│   ├── presentaciones/      # Material académico
│   ├── propuesta/           # Alcance y metodología
│   ├── requisitos/          # Requisitos
│   └── seguimiento/         # Rúbrica, contribuciones y revisiones
├── resources/               # Recursos del proyecto
├── src/
│   ├── Datos/               # Binance, Frankfurter, contratos y caché
│   ├── Logica/              # API, indicadores y motor estadístico
│   └── Presentacion/        # React, TypeScript, Vite y estilos
├── tests/                   # Pruebas automatizadas
├── .env.example
├── install.bat / start.bat
├── package.json
└── README.md
```

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Conexión a Internet para consultar los proveedores.
- Windows 10/11 recomendado para los scripts `.bat`.

## Instalación y ejecución local

1. Clonar o descargar el repositorio y abrir la carpeta raíz en Visual Studio Code.
2. Abrir **Terminal → Nueva terminal**.
3. Ejecutar `install.bat` una sola vez.
4. Ejecutar `start.bat`.
5. Abrir http://localhost:5173.

La API local responde en http://localhost:4000/api/health.

También se puede realizar manualmente:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

## Comandos

| Comando | Propósito |
|---|---|
| `npm run dev` | Inicia frontend y API en desarrollo |
| `npm run dev:backend` | Inicia solo el backend |
| `npm run dev:frontend` | Inicia solo el frontend |
| `npm test` | Ejecuta pruebas del motor estadístico |
| `npm run typecheck` | Comprueba tipos TypeScript |
| `npm run build` | Compila backend y frontend |
| `npm start` | Inicia la API compilada |

## Evidencias de funcionamiento

El directorio [docs/evidencias/](docs/evidencias/) explica cómo registrar capturas reales. La captura inicial compartida durante el trabajo muestra una versión anterior (v1.0.0); no se presenta como evidencia de v1.0.2. Antes de enviar la actividad, subir capturas recientes de v1.0.2 que muestren Overview, Criptomonedas, Divisas FX, Comparador y Metodología, con datos auténticos y sin credenciales visibles.

## Participación y commits

Cada integrante debe revisar el proyecto y registrar su propia contribución desde su cuenta GitHub. No se deben crear commits a nombre de otra persona ni atribuirle trabajo que no haya realizado.

El [registro de contribuciones](docs/seguimiento/contribuciones.md) distingue los commits históricos de la participación específica en la versión actual. Los Issues de seguimiento han sido asignados individualmente:
- [Revisión de Alison — Issue #3](https://github.com/Zoliver27/PEP3-2026-MarketPulse/issues/3)
- [Revisión de Camila — Issue #4](https://github.com/Zoliver27/PEP3-2026-MarketPulse/issues/4)
- [Revisión de Oliver — Issue #5](https://github.com/Zoliver27/PEP3-2026-MarketPulse/issues/5)

## Fuentes externas

- **Binance Spot:** https://github.com/binance/binance-spot-api-docs
- **Frankfurter:** https://frankfurter.dev/

Se utilizan endpoints públicos de consulta; no se realizan operaciones ni movimientos de fondos. Las tasas de Frankfurter son referencias diarias y no precios ejecutables.

## Pruebas y validación

Existen pruebas unitarias del motor probabilístico en `tests/analytics/probability.test.ts`. Antes de declarar una entrega validada, ejecutar `npm test`, `npm run typecheck` y `npm run build` desde la raíz. La compilación completa y las pruebas de integración deben comprobarse en el entorno del equipo; no se consideran aprobadas solo porque estén descritas en la documentación.

## Documentación académica

- [Propuesta y descripción](docs/propuesta/README.md)
- [Metodología matemática](docs/propuesta/metodologia.md)
- [Arquitectura y APIs](docs/arquitectura/README.md)
- [Requisitos](docs/requisitos/README.md)
- [Manual de instalación](docs/manuales/instalacion.md)
- [Manual de usuario](docs/manuales/manual_usuario.md)
- [Pruebas](docs/manuales/pruebas.md)
- [Matriz de la rúbrica](docs/seguimiento/matriz-rubrica.md)
- [Registro de contribuciones](docs/seguimiento/contribuciones.md)
- [Evidencias](docs/evidencias/README.md)

## Licencia y aviso

El código propio se distribuye bajo MIT; consulta [LICENSE](LICENSE). Las estimaciones describen frecuencias históricas bajo una definición matemática, no garantizan resultados futuros y no constituyen asesoramiento financiero.
