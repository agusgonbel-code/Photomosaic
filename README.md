# PhotoMosaic

Aplicación PWA para crear mosaicos de una foto principal usando 10 o más fotografías.

## Incluye
- Procesamiento privado dentro del dispositivo.
- Selección múltiple desde 10 imágenes.
- Compatibilidad con JPG, PNG, WebP y HEIC/HEIF cuando el navegador pueda decodificarlos.
- Memoria adaptada automáticamente al detalle, resolución y número de fotos; los lotes grandes limitan la decodificación de teselas para evitar cierres de Safari.
- Ajuste de detalle, mezcla, resolución y variedad de fotografías.
- Modo con forma: corazón, círculo, óvalo, cuadrado, rombo, triángulo, estrella, hexágono y flor.
- Cálculo automático del mínimo, máximo y cantidades válidas cercanas; cada foto seleccionada se usa una sola vez en la forma.
- Ajuste flexible de la selección: muestra cuántas sobran o faltan, permite eliminar miniaturas individualmente o recortar con un toque hasta la cantidad válida inferior.
- Tres modos de selección: color fiel, equilibrio o mayor diversidad; al terminar indica cuántas fotos diferentes se utilizaron.
- Generación cancelable: las selecciones y ajustes quedan bloqueados durante el cálculo para evitar resultados inconsistentes, y las fotos siguen disponibles al cancelar.
- Guardado y hoja nativa de compartir del iPhone en JPEG optimizado o PNG sin pérdidas.
- Instalación en la pantalla de inicio del iPhone o Android.

## Probar en ordenador
Dentro de la carpeta ejecuta `python -m http.server 8080` y abre `http://localhost:8080`.

## Publicar gratis
Al fusionar el PR en `main`, GitHub Actions construye un paquete mínimo y lo despliega automáticamente mediante GitHub Pages. El artefacto público solo incluye la aplicación, el manifiesto, el service worker y los iconos; no publica pruebas ni configuración interna.

## Instalar en iPhone
Abre la URL publicada en Safari > Compartir > Añadir a pantalla de inicio.
