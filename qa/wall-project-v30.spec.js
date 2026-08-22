const {test,expect}=require('@playwright/test');
const BASE='http://127.0.0.1:4173';
test('wall project runtime is active in shape studio',async({page})=>{await page.goto(`${BASE}/studio.html?mode=shape`);await page.waitForLoadState('domcontentloaded');const info=await page.evaluate(()=>({api:Boolean(globalThis.PhotoMosaicWallProjectV30),mode:document.documentElement.dataset.photomosaicMode,section:Boolean(document.getElementById('wallProjectV30'))}));expect(info.api).toBeTruthy();expect(info.mode).toBe('shape');expect(info.section).toBeTruthy();});
