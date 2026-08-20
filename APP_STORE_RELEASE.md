# Preparación de PhotoMosaic para App Store

## Identidad verificada

- Nombre: PhotoMosaic
- Bundle ID: `com.agusgonbel.photomosaic`
- Versión: `1.0.0`
- Build: `1`
- Sistema mínimo: iOS 15.0
- Privacidad: procesamiento local, sin seguimiento ni datos recopilados por la aplicación

`ios-release.json` es la fuente única para versión, build y sistema mínimo. `npm run ios:release:check` comprueba que coincide con Capacitor y `package.json`, que el icono fuente es válido y que existe la declaración de privacidad. Después, `npm run ios:add` instala esos valores en el proyecto Xcode.

La CI compila la configuración `Release` para simulador y valida dentro de `PhotoMosaic.app` el nombre visible, bundle ID, versión, build, sistema mínimo, páginas legales y manifiesto de privacidad.

## Para crear la distribución firmada

1. Incrementar `buildNumber` en `ios-release.json` para cada nueva subida.
2. Ejecutar `npm ci`, `npm run ios:release:check` y `npm run ios:add` en un Mac.
3. Abrir el proyecto con `npm run ios:open`.
4. Seleccionar el equipo de Apple Developer del propietario para el target `App`.
5. Crear el archivo desde Xcode con `Product > Archive`.
6. Validar y subir el archivo desde Organizer a App Store Connect.
7. Completar la ficha con las URL públicas de privacidad y soporte indicadas en el README.

La firma y la subida no deben automatizarse hasta disponer de acceso autorizado a Apple Developer y App Store Connect.
