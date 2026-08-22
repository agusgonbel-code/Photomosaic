# PhotoMosaic — Continuous Improvement Sprint 500X

Fecha: 2026-08-22

## Objetivo de producto
Convertir PhotoMosaic en dos flujos profesionales claramente separados: creación artística de mosaicos y diseño físico de composiciones para pared.

## Arquitectura incorporada
- Launcher con dos caminos independientes.
- Studio bloqueado por modo: no mezcla controles de mosaico con controles de forma.
- `project-preflight-v20.js`: control de calidad previo.
- `wall-fit-v21.js`: valida si el diseño físico cabe en la pared real y calcula desbordamiento/escala.
- `wall-preview-v22.js`: simulador visual local sobre una foto real de la pared, con tamaño, opacidad y colocación arrastrable.
- Plano numerado y CSV siguen siendo la referencia de medidas exactas.

## Recorrido probado como usuario de mosaico
1. Elegir Mosaico fotográfico.
2. Seleccionar foto principal y teselas.
3. Validar resolución, duplicados y variedad.
4. Generar y exportar.

## Recorrido probado como usuario de pared
1. Elegir Forma para pared.
2. Elegir forma, tamaño de foto y separación.
3. Seleccionar una cantidad válida de fotos.
4. Comprobar resolución de impresión.
5. Introducir ancho/alto real de pared y margen de seguridad.
6. Validar si el diseño cabe.
7. Cargar foto de la pared y simular visualmente posición/tamaño.
8. Generar plano numerado y coordenadas CSV.

## Fallos encontrados y corregidos
- El CI antiguo seguía buscando controles de ambos flujos en una única pantalla; actualizado a la nueva arquitectura.
- Los nuevos módulos de pared no estaban incluidos en el build público/offline; corregidos en `scripts/build-site.mjs` y `service-worker.js`.
- Se añadió un gate independiente `PhotoMosaic Wall Simulator QA`.
- Browser Smoke ampliado para confirmar que el modo pared carga simulador y motores físicos sin errores JS.

## Privacidad
La foto de pared y las fotos del proyecto se procesan localmente. El simulador no requiere subir imágenes a un servidor.

## Gates de calidad
- Shape engine.
- Mosaic engine.
- Generation lifecycle.
- Preflight QA.
- Wall-fit geometry.
- Wall-preview geometry.
- Browser Smoke de ambos flujos.
- Build público y PWA offline.
- iOS Native CI.

## Riesgos pendientes antes de App Store
- Validación visual en iPhone pequeño/grande e iPad.
- Verificar rendimiento con lotes de fotos de alta resolución.
- Firma/Archive Apple.

## Resultado del sprint
La modalidad de pared deja de ser solo una forma dibujada en pantalla y pasa a un flujo de planificación física: calidad de fotos → geometría → compatibilidad con pared → simulación visual → plano de montaje.
