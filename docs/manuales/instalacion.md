# Instalación en Windows 10/11

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Conexión a Internet para consultar los proveedores financieros.
- Visual Studio Code recomendado.

## Preparación y ejecución

1. Clonar o descargar el repositorio `PEP3-2026-MarketPulse`.
2. Abrir la carpeta raíz del proyecto en Visual Studio Code.
3. Abrir `Terminal > Nueva terminal`.
4. Ejecutar `install.bat`. El script crea `.env` a partir de `.env.example` cuando no existe e instala las dependencias.
5. Ejecutar `start.bat`.
6. Abrir `http://localhost:5173`.

La API local se ejecuta en `http://localhost:4000`; comprobarla en `http://localhost:4000/api/health`.

También se puede realizar la instalación manual:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

## Variables de entorno

- `PORT`: puerto de la API (por defecto 4000).
- `NODE_ENV`: entorno de ejecución (`development` por defecto).
- `FRONTEND_ORIGIN`: origen o lista separada por comas de orígenes permitidos por CORS.
- `BINANCE_REST_URL`: URL base REST de Binance.
- `BINANCE_STREAM_URL`: URL del WebSocket combinado de Binance.
- `FRANKFURTER_API_URL`: URL base de Frankfurter v2.
- `MARKET_CACHE_TTL_MS`: duración de la caché de cotizaciones, en milisegundos.

Los endpoints públicos utilizados en esta versión no requieren claves API. No guardar credenciales en GitHub.

## Comandos adicionales

```powershell
npm test
npm run typecheck
npm run build
npm start
```

`npm start` inicia la API compilada. Para uso local de desarrollo, `npm run dev` inicia conjuntamente API y frontend.

## Producción

`npm run build` compila el backend y genera el frontend estático. El backend compilado se emite bajo `src/Logica/dist/Logica/` y `src/Logica/dist/Datos/`; el frontend se genera en `src/Presentacion/dist/`. El frontend y la API deben publicarse como servicios coordinados y configurar `VITE_API_URL`, CORS y las variables del backend para sus dominios públicos.

El despliegue público aún no forma parte de esta entrega. La publicación, disponibilidad permanente y dominio deben verificarse y documentarse cuando se configure el alojamiento.
