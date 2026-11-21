# Planificación y estado

## Fases de evolución
1. **Base funcional:** frontend, API, proveedores, gráficos y navegación.
2. **Validación de datos:** comprobar respuestas reales, marcas temporales, cobertura FX y tolerancia a fallos.
3. **Validación estadística:** revisar tamaño muestral, calibración, backtesting y estabilidad temporal del modelo.
4. **Calidad y seguridad:** pruebas unitarias, integración, accesibilidad, CORS y gestión de configuración.
5. **Publicación web:** configurar despliegue separado de frontend y backend, variables de entorno, CORS público, observabilidad y política de disponibilidad.

## Estado documentado
La versión incluida se ejecutó localmente por el equipo y se corrigieron los controles de la interfaz reportados. Las pruebas unitarias del motor probabilístico existen en `tests/analytics/`. La compilación integral, pruebas de integración externas y el despliegue público deben registrarse solo después de ejecutarlos en un entorno con dependencias instaladas y acceso a los proveedores.

## Próximas tareas sugeridas
- Añadir pruebas de integración para los endpoints REST con proveedores simulados.
- Registrar resultados de backtesting por activo y horizonte en un conjunto de evaluación separado.
- Evaluar calibración de probabilidades con partición temporal y datos no solapados.
- Definir alojamiento, variables de entorno y dominio cuando se acuerde el despliegue.
