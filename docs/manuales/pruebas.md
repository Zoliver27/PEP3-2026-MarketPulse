# Pruebas y validación

## Pruebas automatizadas

`tests/analytics/probability.test.ts` contiene tres pruebas del motor probabilístico:

1. La estimación no está disponible cuando existen menos de 30 observaciones.
2. Las probabilidades son finitas y suman 1 (100 %).
3. El backtesting walk-forward devuelve métricas cuando hay suficientes observaciones de evaluación.

Ejecutar desde la raíz:

```powershell
npm test
```

## Comprobaciones complementarias

```powershell
npm run typecheck
npm run build
```

Antes de una versión pública también debe verificarse:

- `GET /api/health`.
- Carga de mercado `GET /api/market/crypto`.
- Stream `GET /api/market/stream`.
- Históricos y probabilidades para BTC, ETH y SOL.
- Pares FX cubiertos y no cubiertos.
- Actualización manual y automática de datos.
- Navegación, accesibilidad básica y vistas móvil/escritorio.
- Comportamiento cuando los proveedores están fuera de servicio.

## Validación registrada durante la migración

- TypeScript: comprobación de tipos del backend y frontend completada sin errores.
- Backend: compilación TypeScript completada.
- Motor estadístico: tres pruebas ejecutadas con transpilación TypeScript y Node.js; 3 aprobadas.
- Compilación final de Vite y llamadas externas en producción: pendientes de verificación en un entorno con las dependencias correctas y acceso a los proveedores.

No se debe presentar una comprobación pendiente como prueba superada.
