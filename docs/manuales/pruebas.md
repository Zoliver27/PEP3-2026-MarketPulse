# Pruebas y validación

## Pruebas automatizadas existentes

El proyecto incluye `tests/analytics/probability.test.ts` con casos para la lógica probabilística y backtesting.

## Validación continua de GitHub Actions

El workflow `Market Pulse CI` se ejecutó correctamente sobre el commit `5ba2f6c970026b67e014ae5ad744589930b69456` (21 de noviembre de 2026).

| Paso ejecutado en GitHub Actions | Resultado |
|---|---|
| Checkout del repositorio | Correcto |
| Configuración de Node.js 22 | Correcto |
| `npm install` | Correcto |
| `npm test` | Correcto |
| `npm run typecheck` | Correcto |
| `npm run build` | Correcto |

Ejecución verificable: [Market Pulse CI — Run #44948013705](https://github.com/Zoliver27/PEP3-2026-MarketPulse/actions/runs/44948013705).

Esto demuestra que el repositorio se instaló, ejecutó las pruebas, pasó el chequeo TypeScript y compiló en el runner Ubuntu/Node.js 22 de GitHub Actions. No demuestra por sí mismo que las pruebas manuales de UI o los proveedores externos funcionen en todos los escenarios ni que el sistema esté desplegado públicamente.

## Ejecutar también en el equipo

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

## Estado de validación pendiente

Las pruebas manuales de la interfaz v1.0.2, comprobación de los proveedores en ejecución, evaluación del comparador y despliegue público aún deben registrarse por el equipo. Adjuntar capturas y resultados reales; no sustituirlos por inferencias a partir de la CI.
