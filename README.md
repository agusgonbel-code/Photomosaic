# PhotoMosaic

Aplicación PWA para crear mosaicos de una foto principal usando 10 o más fotografías.

## Incluye
- Procesamiento privado dentro del dispositivo.
- Selección múltiple desde 10 imágenes.
- Compatibilidad con JPG, PNG, WebP y HEIC/HEIF cuando el navegador pueda decodificarlos.
- Memoria adaptada automáticamente al detalle y resolución elegidos.
- Ajuste de detalle, mezcla y resolución.
- Guardado y hoja nativa de compartir del iPhone en JPG.
- Instalación en la pantalla de inicio del iPhone o Android.

## Probar en ordenador
Dentro de la carpeta ejecuta `python -m http.server 8080` y abre `http://localhost:8080`.

## Publicar gratis
Al fusionar el PR en `main`, GitHub Actions construye un paquete mínimo y lo despliega automáticamente mediante GitHub Pages. El artefacto público solo incluye la aplicación, el manifiesto, el service worker y los iconos; no publica pruebas ni configuración interna.

## Instalar en iPhone
Abre la URL publicada en Safari > Compartir > Añadir a pantalla de inicio.
