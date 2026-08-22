# PhotoMosaic — Sprint 500X Wall Project v30

## Objetivo
Convertir Forma para pared en un flujo de diseño físicamente reproducible, no solo una preview bonita.

## Implementación
- Nuevo `wall-project-v30.js`.
- Cálculo de bounds, dimensiones finales y ajuste a pared.
- Coordenadas numeradas por centro de cada fotografía.
- Secuencia de instalación y exportación CSV.
- Activación explícita en Studio de `wall-fit-v21.js`, `wall-preview-v22.js` y `wall-project-v30.js`.
- Inclusión completa en build web, build nativo y service worker.

## Prueba como usuario
Tests comprueban coordenadas reproducibles, dimensiones físicas, detección de diseño demasiado grande y CSV numerado.

## Fallos encontrados
Los motores de ajuste y preview ya estaban presentes en el proyecto/build, pero `studio.html` no los cargaba explícitamente. El sprint corrige esa desconexión y añade una capa de proyecto de instalación.

## Gates
Unit → CI/preflight → Browser Smoke → iOS Native CI → Pages tras merge.
