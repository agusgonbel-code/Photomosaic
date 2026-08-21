# PhotoMosaic — Auditoría profesional de producto y QA · 22/08/2026

## Visión
La experiencia actual mezcla dos trabajos distintos. El producto debe abrir con dos opciones inequívocas y cada una debe completarse de principio a fin en su propia pantalla/flujo.

## Flujo A — Mosaico fotográfico
1. Elegir foto principal.
2. Elegir fotos para teselas.
3. Ajustar detalle, mezcla, diversidad, resolución y formato.
4. Generar.
5. Previsualizar, editar, guardar o compartir.

## Flujo B — Forma para pared
1. Elegir forma o dibujar contorno personalizado.
2. Elegir ancho/alto de foto y separación.
3. Calcular mínimo, máximo, cantidades válidas y dimensiones de pared.
4. Elegir exactamente una cantidad válida y eliminar sobrantes en el mismo flujo.
5. Generar contorno dejando el interior vacío.
6. Previsualizar escala física, plano numerado y CSV.
7. Guardar/compartir.

## Regla UX
Los motores y el manejo local de fotos pueden compartirse, pero no el estado visual. Ningún control exclusivo de mosaico aparece en Forma para pared y viceversa.

## Gates de QA
- Ambos modos completan el recorrido entero sin entrar en el otro.
- Volver atrás conserva el estado del modo actual.
- La vista previa física respeta ancho, alto y separación.
- Las cantidades válidas se explican antes de generar.
- El dibujo táctil cierra trazos de forma robusta.
- Grandes lotes no cierran Safari.
- JPEG/PNG/plano/CSV representan exactamente la vista actual.
- Cancelar generación conserva selección y ajustes.