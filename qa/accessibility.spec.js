const { test, expect } = require('@playwright/test');
const BASE='http://127.0.0.1:4173';

async function auditPage(page,label){
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id).filter(Boolean));
  expect(new Set(ids).size,`${label}: duplicate ids`).toBe(ids.length);
  const images=await page.locator('img').evaluateAll(nodes=>nodes.filter(n=>!n.hasAttribute('alt')).map(n=>n.src));
  expect(images,`${label}: images without alt`).toEqual([]);
  const controls=page.locator('button:visible,select:visible,input:visible,textarea:visible,label.upload:visible,a:visible');
  const unnamed=await controls.evaluateAll(nodes=>nodes.filter(el=>{
    if(el.matches('button,a,label.upload'))return !(el.getAttribute('aria-label')||el.textContent?.trim());
    const id=el.id,explicit=id?document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent?.trim():'';
    const parent=el.closest('label')?.textContent?.trim();
    const placeholder=el.getAttribute('placeholder');
    return !(el.getAttribute('aria-label')||explicit||parent||placeholder);
  }).map(el=>el.outerHTML.slice(0,180)));
  expect(unnamed,`${label}: unnamed controls`).toEqual([]);
  const tinyButtons=await page.locator('button:visible').evaluateAll(nodes=>nodes.filter(el=>{const r=el.getBoundingClientRect();return r.width<44||r.height<44}).map(el=>({text:el.textContent.trim().slice(0,40),w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height})));
  expect(tinyButtons,`${label}: touch targets below 44px`).toEqual([]);
}

for(const width of [320,390,430]){
  test(`PhotoMosaic accessibility baseline at ${width}px`,async({browser})=>{
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});
    const page=await context.newPage();
    await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});await auditPage(page,`launcher-${width}`);
    for(const mode of ['rectangle','shape']){
      await page.goto(`${BASE}/studio.html?mode=${mode}`,{waitUntil:'domcontentloaded'});await auditPage(page,`${mode}-${width}`);
    }
    await context.close();
  });
}

test('PhotoMosaic CSS exposes focus indication and reduced motion',async({page})=>{
  const css=await (await page.request.get(BASE+'/styles.css')).text();
  expect(css).toMatch(/focus-visible/i);expect(css).toMatch(/prefers-reduced-motion/i);
});
