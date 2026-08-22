(()=>{'use strict';
const params=new URLSearchParams(location.search),mode=params.get('mode')==='shape'?'shape':'rectangle';
const $=id=>document.getElementById(id),select=$('mosaicMode'),chooser=$('modeChooser'),title=$('studioTitle'),subtitle=$('studioSubtitle'),eyebrow=$('studioEyebrow'),target=$('targetSection'),mosaic=$('mosaicOnlyControls'),hint=$('tilesHint');
const applyMode=()=>{
  if(select&&select.value!==mode)select.value=mode;
  if(chooser){chooser.hidden=true;chooser.setAttribute('aria-hidden','true');}
  if(mode==='shape'){
    document.documentElement.dataset.photomosaicMode='shape';document.title='Forma para pared · PhotoMosaic';
    if(title)title.textContent='Forma para pared';if(eyebrow)eyebrow.textContent='DISEÑO FÍSICO CON FOTOS';if(subtitle)subtitle.textContent='Elige una silueta, medidas reales y las fotos que formarán únicamente el contorno.';if(target)target.hidden=true;if(mosaic)mosaic.hidden=true;if(hint)hint.textContent='La app calculará qué cantidades completan el contorno';
  }else{
    document.documentElement.dataset.photomosaicMode='mosaic';document.title='Mosaico fotográfico · PhotoMosaic';
    if(title)title.textContent='Mosaico fotográfico';if(eyebrow)eyebrow.textContent='MOSAICO CON TUS FOTOS';if(subtitle)subtitle.textContent='Reconstruye una foto principal utilizando tus propias imágenes como teselas.';if(target)target.hidden=false;if(mosaic)mosaic.hidden=false;if(hint)hint.textContent='Selecciona 10 o más imágenes para crear las teselas';
  }
};
function installModeExportName(){
  const engine=globalThis.PhotoMosaicEngine;if(!engine||engine.__modeFilenameV24)return;
  const original=engine.exportFilename?.bind(engine);if(typeof original!=='function')return;
  engine.exportFilename=(format='jpeg',date=new Date())=>{const base=original(format,date);return mode==='shape'?base.replace(/^photomosaic-/,'forma-pared-'):base;};
  engine.__modeFilenameV24=true;
}
function downloadFile(file){const u=URL.createObjectURL(file),a=document.createElement('a');a.href=u;a.download=file.name||'photomosaic';a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);}
function installShareFallback(){
  if(!navigator.share||navigator.__photomosaicShareV25)return;
  const nativeShare=navigator.share.bind(navigator);
  const safeShare=async data=>{try{return await nativeShare(data);}catch(error){if(error?.name==='AbortError')throw error;const file=data?.files?.[0];if(file){downloadFile(file);return;}throw error;}};
  try{Object.defineProperty(navigator,'share',{configurable:true,value:safeShare});Object.defineProperty(navigator,'__photomosaicShareV25',{configurable:true,value:true});}catch{}
}
applyMode();installModeExportName();installShareFallback();
if(select){select.value=mode;select.dispatchEvent(new Event('change'));select.addEventListener('change',()=>{if(select.value===mode)return;select.value=mode;applyMode();select.dispatchEvent(new Event('change'));});}
})();
