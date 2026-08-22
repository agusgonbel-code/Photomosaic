# PhotoMosaic — Informe de ingeniería, producto y QA
Fecha: 22/08/2026

## 1. Objetivo de producto
PhotoMosaic contiene dos trabajos diferentes y deben sentirse como dos herramientas independientes: crear un mosaico fotográfico y diseñar una forma física para pared.

## 2. Funciones
### Inicio
Presenta dos decisiones únicamente: `Mosaico fotográfico` y `Forma para pared`.

### Mosaico fotográfico
1. Foto principal.
2. Selección de 10–300 teselas.
3. Detalle/columnas, mezcla, diversidad, resolución y formato.
4. Generación cancelable.
5. Preview.
6. Guardado/compartir JPEG o PNG.

### Forma para pared
1. Elegir una de las formas o dibujar una personalizada con el dedo.
2. Definir ancho/alto de foto y separación.
3. Calcular mínimo, máximo y cantidades válidas.
4. Seleccionar/recortar las fotos hasta una cantidad válida.
5. Generar únicamente el contorno, dejando el interior vacío.
6. Preview con escala física.
7. Exportar imagen, plano numerado y CSV de coordenadas.

## 3. Arquitectura
Los dos flujos usan los mismos motores de selección, shape/layout, generación y exportación. Solo se separa la experiencia de usuario. Esto reduce duplicación y garantiza que una corrección del motor beneficie a ambos modos.

## 4. Hallazgos QA
- El antiguo `index.html` mezclaba ambos modos y mostraba controles que no eran relevantes para la tarea actual.
- El CI antiguo validaba esa estructura mezclada, por lo que falló correctamente tras la separación.
- El motor de formas y el motor de mosaico pasaron sus tests; también pasó la compilación nativa iOS.
- El fallo detectado estaba en la expectativa del shell web, no en el algoritmo.

## 5. Cambios de esta iteración
- Nuevo `index.html` como selector de herramienta.
- Nuevo `studio.html` compartido.
- `studio-mode.js` bloquea el modo y oculta controles ajenos.
- Build de Pages incorpora las nuevas rutas.
- Service worker cachea selector, estudio y router.
- CI actualizado para validar la nueva arquitectura.

## 6. QA obligatorio
- Completar ambos flujos sin cambiar de modo.
- Validar cantidades mínimas/máximas y recorte de selección.
- Trazado táctil en iPhone.
- 10, 50, 150 y 300 imágenes en Safari móvil.
- Cancelar/reintentar sin perder fotos.
- Coincidencia entre preview, plano y CSV.
- JPEG/PNG/Share Sheet.
- Offline tras primera carga.
- Safe areas y memoria en iPhone pequeño/grande.

## 7. App Store
Privacidad y soporte deben ser accesibles y coherentes con procesamiento local. El bundle nativo debe incluir PrivacyInfo.xcprivacy, assets finales y build reproducible. La firma/TestFlight exige Apple Developer.

## 8. Riesgos pendientes
- HEIC depende de capacidades reales del navegador/dispositivo: el error debe ser explícito cuando Safari no pueda decodificar un fichero.
- Las selecciones muy grandes requieren seguir controlando memoria y tamaño de decodificación.
- Antes de App Review debe comprobarse físicamente que la hoja Share/Save funciona en Safari y en el wrapper nativo.