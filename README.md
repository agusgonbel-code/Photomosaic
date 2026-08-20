# PhotoMosaic

Aplicación PWA para crear mosaicos de una foto principal usando 10 o más fotografías.

## Incluye
- Procesamiento privado dentro del dispositivo.
- Selección múltiple desde 10 imágenes.
- Compatibilidad con JPG, PNG, WebP y HEIC/HEIF cuando el navegador pueda decodificarlos.
- Memoria adaptada automáticamente al detalle, resolución y número de fotos; los lotes grandes limitan la decodificación de teselas para evitar cierres de Safari.
- Ajuste de detalle, mezcla, resolución y variedad de fotografías.
- Composición de pared con 16 contornos: corazón, círculo, óvalo, cuadrado, rombo, triángulo, estrella, hexágono, flor, luna, cruz, rayo, nube, mariposa, flecha y trébol.
- Contorno personalizado dibujado con el dedo: permite crear cualquier silueta fuera del catálogo, cierra el trazo automáticamente y calcula las cantidades válidas de fotos.
- Las fotografías ocupan solo el borde de la figura y dejan el interior vacío; no necesitan foto principal y cada imagen se usa una sola vez.
- Cálculo automático del mínimo, máximo y cantidades válidas cercanas para montar el contorno físicamente.
- Plano de montaje físico configurable: ancho y alto de cada foto, separación, medidas totales en pared y CSV numerado con fila, columna y coordenadas desde la esquina superior izquierda.
- Plano visual vectorial numerado para imprimir o compartir, con la silueta completa, medidas de pared, tamaño de cada foto y orden de colocación; el CSV detallado sigue disponible por separado.
- Vista previa física fiel: la imagen terminada respeta el ancho, alto y separación elegidos, por lo que coincide con el plano que se trasladará a la pared.
- Ajuste flexible de la selección: muestra cuántas sobran o faltan, permite eliminar miniaturas individualmente o recortar con un toque hasta la cantidad válida inferior.
- Tres modos de selección: color fiel, equilibrio o mayor diversidad; al terminar indica cuántas fotos diferentes se utilizaron.
- Generación cancelable: las selecciones y ajustes quedan bloqueados durante el cálculo para evitar resultados inconsistentes, y las fotos siguen disponibles al cancelar.
- Guardado y hoja nativa de compartir del iPhone en JPEG optimizado o PNG sin pérdidas.
- Instalación en la pantalla de inicio del iPhone o Android.
- Paquete nativo reproducible con Capacitor 8 y compilación automática para simulador iOS antes de preparar TestFlight.

## Probar en ordenador
Dentro de la carpeta ejecuta `python -m http.server 8080` y abre `http://localhost:8080`.

## Publicar gratis
Al fusionar el PR en `main`, GitHub Actions construye un paquete mínimo y lo despliega automáticamente mediante GitHub Pages. El artefacto público solo incluye la aplicación, el manifiesto, el service worker y los iconos; no publica pruebas ni configuración interna.

## Instalar en iPhone
Abre la URL publicada en Safari > Compartir > Añadir a pantalla de inicio.

## Preparar la versión nativa de iPhone
Con Node.js 22 o posterior: `npm install`, `npm run ios:add` y `npm run ios:open`. La rama se valida también en macOS con Xcode, instala el icono nativo de PhotoMosaic y conserva el identificador `com.agusgonbel.photomosaic`; la firma, el equipo de Apple Developer y la subida a TestFlight se configuran únicamente al preparar la distribución.
