const {test,expect}=require('@playwright/test');
const BASE='http://127.0.0.1:4173/';
async function home(page){await page.goto(BASE,{waitUntil:'domcontentloaded'});await expect(page.locator('.modeHome')).toBeVisible()}
async function studio(page,mode='rectangle'){await page.goto(`${BASE}studio.html?mode=${mode}`,{waitUntil:'domcontentloaded'});await expect(page.locator('#generate')).toBeVisible()}
function errs(page){const a=[];page.on('pageerror',e=>a.push(e.message));return a}
test('usuario entiende que existen dos productos',async({page})=>{await home(page);await expect(page.locator('.modeCard')).toHaveCount(2)});
test('usuario entra en Mosaico desde inicio',async({page})=>{await home(page);await page.getByLabel('Abrir mosaico fotográfico').click();await expect(page).toHaveURL(/mode=rectangle/)});
test('usuario entra en Forma desde inicio',async({page})=>{await home(page);await page.getByLabel('Abrir forma para pared').click();await expect(page).toHaveURL(/mode=shape/)});
for(const width of [320,375,390,430])test(`inicio cabe a ${width}px`,async({page})=>{await page.setViewportSize({width,height:760});await home(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2)).toBeTruthy()});
for(const mode of ['rectangle','shape'])test(`${mode} muestra flujo de fotos y ajustes`,async({page})=>{await studio(page,mode);await expect(page.locator('#tilesSection')).toBeVisible();await expect(page.locator('#settingsSection')).toBeVisible()});
test('Mosaico muestra foto principal',async({page})=>{await studio(page,'rectangle');await expect(page.locator('#targetSection')).toBeVisible()});
test('Forma oculta foto principal',async({page})=>{await studio(page,'shape');await expect(page.locator('#targetSection')).toBeHidden()});
test('Forma muestra controles de silueta',async({page})=>{await studio(page,'shape');await expect(page.locator('#shapeControls')).toBeVisible()});
test('Mosaico muestra controles de columnas',async({page})=>{await studio(page,'rectangle');await expect(page.locator('#mosaicOnlyControls')).toBeVisible()});
test('usuario cambia resolución',async({page})=>{await studio(page);await page.locator('#resolution').selectOption('3200');await expect(page.locator('#resolution')).toHaveValue('3200')});
test('usuario cambia formato a PNG',async({page})=>{await studio(page);await page.locator('#exportFormat').selectOption('png');await expect(page.locator('#exportFormat')).toHaveValue('png')});
test('usuario cambia variedad del mosaico',async({page})=>{await studio(page);await page.locator('#diversity').selectOption('36');await expect(page.locator('#diversity')).toHaveValue('36')});
test('usuario configura medidas físicas de forma',async({page})=>{await studio(page,'shape');await page.locator('#photoWidth').fill('12');await page.locator('#photoHeight').fill('18');await page.locator('#photoGap').fill('3');await expect(page.locator('#photoWidth')).toHaveValue('12')});
test('usuario elige corazón',async({page})=>{await studio(page,'shape');await page.locator('#shape').selectOption('heart');await expect(page.locator('#shape')).toHaveValue('heart')});
test('usuario elige forma personalizada',async({page})=>{await studio(page,'shape');await page.locator('#shape').selectOption('custom');await expect(page.locator('#customShapeControls')).toBeVisible()});
test('botón crear permanece bloqueado sin fotos',async({page})=>{await studio(page);await expect(page.locator('#generate')).toBeDisabled()});
test('contador de fotos anuncia estado',async({page})=>{await studio(page);await expect(page.locator('#count')).toHaveAttribute('aria-live','polite')});
test('resultado canvas tiene nombre accesible',async({page})=>{await studio(page);await expect(page.locator('#canvas')).toHaveAttribute('aria-label',/Vista previa/)});
test('usuario vuelve a elegir modo',async({page})=>{await studio(page);await page.getByRole('link',{name:/Elegir otro modo/}).click();await expect(page.locator('.modeHome')).toBeVisible()});
test('usuario con reducir movimiento mantiene Studio',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await studio(page);await expect(page.locator('#generate')).toBeVisible()});
test('controles principales tienen target táctil adecuado',async({page})=>{await studio(page);const n=await page.locator('button:visible').evaluateAll(ns=>ns.filter(x=>x.getBoundingClientRect().height<44).length);expect(n).toBe(0)});
test('Studio no genera pageerror al alternar ajustes',async({page})=>{const e=errs(page);await studio(page);await page.locator('#resolution').selectOption('1400');await page.locator('#exportFormat').selectOption('png');await page.locator('#cols').fill('55');expect(e).toEqual([])});
test('Studio cabe en iPhone 320',async({page})=>{await page.setViewportSize({width:320,height:700});await studio(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2)).toBeTruthy()});
test('Forma cabe en iPhone 320',async({page})=>{await page.setViewportSize({width:320,height:700});await studio(page,'shape');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2)).toBeTruthy()});
test('usuario puede enfocar la interfaz con teclado',async({page})=>{await studio(page);await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement!==document.body)).toBeTruthy()});
