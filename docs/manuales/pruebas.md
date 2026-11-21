# Pruebas y validación

## Pruebas automatizadas existentes

El proyecto incluye `tests/analytics/probability.test.ts` con casos para la lógica probabilística y backtesting. La existencia de los archivos de prueba no demuestra por sí misma que el estado actual de `main` haya pasado todas las validaciones.

## Ejecutar en el equipo

Desde la raíz del repositorio, después de instalar dependencias:

```powershell
npm install
npm test
npm run typecheck
npm run build
```

Guardar la salida real de cada comando y registrar fecha, sistema operativo y versión de Node.js/npm. Si un comando falla, anotar el error; no marcarlo como aprobado.

## Comprobaciones manuales recomendadas

- `GET /api/health`.
- Carga de mercado `GET /api/market/crypto`.
- Stream `GET /api/market/stream`.
- Históricos y probabilidades para BTC, ETH y SOL.
- Pares FX cubiertos y no cubiertos.
- Actualización manual y automática de datos.
- Navegación, accesibilidad básica y vistas móvil/escritorio.
- Comportamiento cuando los proveedores están fuera de servicio.
- Comparación de dos activos, comprobando que los periodos y las monedas base sean comparables.

## Estado de validación de la entrega

La compilación integral y las llamadas externas no se declaran verificadas para el commit actual hasta que el equipo ejecute los comandos en su entorno y archive los resultados. Mantener los resultados de pruebas en un documento fechado o adjuntar logs sin credenciales.
