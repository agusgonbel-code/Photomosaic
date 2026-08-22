const { test, expect } = require('@playwright/test');
const BASE='http://127.0.0.1:4173';
async function noOverflow(page,label=''){const d=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));expect(d.scroll,`${label} ${JSON.stringify(d)}`).toBeLessThanOrEqual(d.client+2)}
for(const width of [320,375,390,430]){
  test(`PhotoMosaic launcher fits ${width}px`,async({browser})=>{const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});const page=await context.newPage();await page.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});await noOverflow(page,'launcher');await context.close()});
  for(const mode of ['rectangle','shape'])test(`PhotoMosaic ${mode} studio fits ${width}px`,async({browser})=>{const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});const page=await context.newPage();await page.goto(`${BASE}/studio.html?mode=${mode}`,{waitUntil:'domcontentloaded'});await noOverflow(page,`${mode}-top`);await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(30);await noOverflow(page,`${mode}-bottom`);await context.close()});
}
test('PhotoMosaic stylesheet enforces safe-area and overflow protection',async({page})=>{const css=await (await page.request.get(`${BASE}/styles.css`)).text();expect(css).toContain('overflow-x:hidden');expect(css).toContain('safe-area-inset-left');expect(css).toContain('safe-area-inset-right');expect(css).toContain('@media(max-width:360px)')});
