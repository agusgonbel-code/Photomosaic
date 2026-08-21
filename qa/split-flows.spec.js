const { test, expect } = require('@playwright/test');

test('launcher exposes two independent creation modes', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.stack||e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('link',{name:/Abrir mosaico fotográfico/i})).toBeVisible();
  await expect(page.getByRole('link',{name:/Abrir forma para pared/i})).toBeVisible();
  expect(errors).toEqual([]);
});

test('classic mosaic shows only the classic workflow', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.stack||e.message));
  await page.goto('http://127.0.0.1:4173/studio.html?mode=rectangle',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#targetSection')).toBeVisible();
  await expect(page.locator('#mosaicOnlyControls')).toBeVisible();
  await expect(page.locator('#shapeControls')).toBeHidden();
  await expect(page.locator('#modeChooser')).toBeHidden();
  expect(await page.locator('#mosaicMode').inputValue()).toBe('rectangle');
  expect(errors).toEqual([]);
});

test('wall shape hides mosaic-only controls and activates shape controls', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.stack||e.message));
  await page.goto('http://127.0.0.1:4173/studio.html?mode=shape',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#targetSection')).toBeHidden();
  await expect(page.locator('#mosaicOnlyControls')).toBeHidden();
  await expect(page.locator('#shapeControls')).toBeVisible();
  await expect(page.locator('#modeChooser')).toBeHidden();
  expect(await page.locator('#mosaicMode').inputValue()).toBe('shape');
  await expect(page.locator('#photoWidth')).toBeVisible();
  await expect(page.locator('#photoHeight')).toBeVisible();
  await expect(page.locator('#photoGap')).toBeVisible();
  expect(errors).toEqual([]);
});