# PEP3-2026-MarketPulse

**MARKET PULSE – Real-Time Financial Intelligence Platform**

Plataforma web académica para consultar criptomonedas y divisas internacionales, visualizar históricos de mercado y estudiar estimaciones estadísticas de subida, bajada y estabilidad. El proyecto integra datos públicos de Binance Spot y tasas de referencia de Frankfurter, con separación entre presentación, lógica de aplicación y acceso a datos.

> **Estado:** versión local funcional v1.0.2 aportada por el equipo. Este repositorio organiza el código y la documentación. El despliegue público aún no está configurado ni debe considerarse activo.

## Equipo autor

- **Oliver Zunagua**
- **Camila Andia**
- **Alison Bejarano**

Las responsabilidades actualmente registradas están en [docs/equipo/roles.md](docs/equipo/roles.md). Los tres integrantes son autores del desarrollo propio; las bibliotecas, fuentes, servicios y datos de terceros mantienen sus respectivas licencias y condiciones.

## Funcionalidades de la versión

- Dashboard de mercado con diez criptomonedas iniciales: BTC, ETH, SOL, BNB, XRP, ADA, DOGE, LTC, DOT y AVAX.
- Cotizaciones Spot mediante Binance REST y actualizaciones WebSocket públicas con caché y reconexión.
- Historiales OHLCV y gráficos interactivos para distintos períodos.
- Pares FX con datos de referencia diaria de Frankfurter; se conserva la fecha de observación y no se presentan como cotizaciones intradía.
- Indicadores SMA, EMA, RSI, MACD, bandas de Bollinger y volatilidad histórica.
- Estimación empírica de tres resultados: subida, bajada y estabilidad, con suavizado de Laplace e intervalos de Wilson.
- Backtesting walk-forward y métricas de evaluación cuando existe muestra suficiente.
- Comparador de rendimiento relativo, metodología y sección de información del proyecto.

## Arquitectura y estructura

```text
PEP3-2026-MarketPulse/
├── .github/                 # Plantillas y automatización de GitHub
├── data/                    # Política, muestras y esquemas de datos
├── docs/
│   ├── arquitectura/        # Arquitectura y APIs externas
│   ├── decisiones/         # Historial y decisiones técnicas
│   ├── equipo/             # Autores y responsabilidades
│   ├── manuales/           # Instalación, uso y pruebas
│   ├── planificacion/      # Fases y tareas
│   ├── presentaciones/     # Material académico
│   ├── propuesta/          # Descripción y metodología
│   └── requisitos/         # Alcance y requisitos
├── resources/               # Recursos originales del equipo
├── src/
│   ├── Datos/              # Binance, Frankfurter, contratos y caché
│   ├── Logica/             # API Express, indicadores y modelo estadístico
│   └── Presentacion/       # React, TypeScript, Vite y estilos
├── tests/                   # Pruebas automatizadas
├── .env.example
├── install.bat / start.bat
├── package.json
└── README.md
```

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Conexión a Internet para consultar los proveedores de datos.
- Windows 10/11 (los comandos npm también pueden utilizarse en macOS/Linux).

## Instalación en Windows

1. Clona o descarga este repositorio y abre la carpeta raíz en Visual Studio Code.
2. Abre la terminal integrada.
3. Ejecuta `install.bat` una sola vez. El script copia `.env.example` a `.env` si todavía no existe e instala las dependencias.
4. Ejecuta `start.bat`.
5. Abre http://localhost:5173. La API local está disponible en http://localhost:4000/api/health.

También puedes ejecutar manualmente:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

## Comandos principales

| Comando | Propósito |
|---|---|
| `npm run dev` | Inicia API y frontend en desarrollo |
| `npm run dev:backend` | Inicia únicamente la API |
| `npm run dev:frontend` | Inicia únicamente el frontend |
| `npm test` | Ejecuta las pruebas estadísticas |
| `npm run typecheck` | Comprueba tipos TypeScript |
| `npm run build` | Compila backend y frontend |
| `npm start` | Inicia la API compilada |

## Fuentes de información

### Binance Spot

Se utilizan endpoints públicos REST para tickers e históricos OHLCV y un stream público WebSocket para cotizaciones. No se realizan operaciones ni movimientos de fondos y esta versión no requiere claves API para los endpoints utilizados.

- Documentación: https://github.com/binance/binance-spot-api-docs
- REST: `https://data-api.binance.vision`
- WebSocket: `wss://data-stream.binance.vision/stream`

### Frankfurter

Se consulta API v2 para tipos de cambio de referencia e historiales. Las tasas no deben interpretarse como precios ejecutables ni cotizaciones intradía.

- Documentación: https://frankfurter.dev/
- API: `https://api.frankfurter.dev/v2`

La cobertura y disponibilidad dependen de cada proveedor. La aplicación debe mostrar errores o falta de cobertura en lugar de inventar valores.

## Metodología estadística

El modelo calcula rendimientos para el horizonte seleccionado, clasifica cada observación como subida, bajada o estabilidad mediante un umbral neutral basado en volatilidad, aplica suavizado de Laplace y normaliza las probabilidades. Requiere al menos 30 observaciones históricas. Los intervalos de Wilson son descriptivos y las ventanas solapadas introducen dependencia serial. El backtesting walk-forward utiliza únicamente observaciones previas en cada predicción.

Los indicadores técnicos contextualizan los resultados; no reciben pesos subjetivos en la estimación principal. Los detalles matemáticos y las limitaciones se documentan en [docs/propuesta/metodologia.md](docs/propuesta/metodologia.md).

## Seguridad y datos

- No subir `.env`, tokens, claves privadas ni datos personales.
- `.env.example` contiene únicamente nombres de configuración y valores por defecto no secretos.
- No subir `node_modules`, `dist`, cachés, logs ni archivos temporales.
- Utilizar exclusivamente datos públicos o cuyo uso esté autorizado.
- Revisar términos de los proveedores antes de cualquier despliegue público.

## Pruebas y estado de validación

Las pruebas unitarias del motor probabilístico se ejecutan mediante `npm test`. Las pruebas de integración externa, compilación integral y validación del despliegue deberán registrarse después de ejecutarse en un entorno con dependencias instaladas y acceso a los proveedores. No se debe inferir que una prueba pasó por el mero hecho de que exista su documentación.

## Licencia y aviso financiero

El código propio se distribuye bajo MIT; consulta [LICENSE](LICENSE). Los mercados financieros son impredecibles. Las probabilidades describen frecuencias históricas bajo una definición matemática y no garantizan resultados futuros. MARKET PULSE es una herramienta académica e informativa, no asesoramiento financiero ni recomendación de inversión.
