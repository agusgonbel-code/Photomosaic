(()=>{'use strict';
const params=new URLSearchParams(location.search),mode=params.get('mode')==='shape'?'shape':'rectangle';
const $=id=>document.getElementById(id),select=$('mosaicMode'),chooser=$('modeChooser'),title=$('studioTitle'),subtitle=$('studioSubtitle'),eyebrow=$('studioEyebrow'),target=$('targetSection'),mosaic=$('mosaicOnlyControls'),hint=$('tilesHint');
const applyMode=()=>{
  if(select&&select.value!==mode)select.value=mode;
  if(chooser){chooser.hidden=true;chooser.setAttribute('aria-hidden','true');}
  if(mode==='shape'){
    document.documentElement.dataset.photomosaicMode='shape';
    document.title='Forma para pared · PhotoMosaic';
    if(title)title.textContent='Forma para pared';
    if(eyebrow)eyebrow.textContent='DISEÑO FÍSICO CON FOTOS';
    if(subtitle)subtitle.textContent='Elige una silueta, medidas reales y las fotos que formarán únicamente el contorno.';
    if(target)target.hidden=true;
    if(mosaic)mosaic.hidden=true;
    if(hint)hint.textContent='La app calculará qué cantidades completan el contorno';
  }else{
    document.documentElement.dataset.photomosaicMode='mosaic';
    document.title='Mosaico fotográfico · PhotoMosaic';
    if(title)title.textContent='Mosaico fotográfico';
    if(eyebrow)eyebrow.textContent='MOSAICO CON TUS FOTOS';
    if(subtitle)subtitle.textContent='Reconstruye una foto principal utilizando tus propias imágenes como teselas.';
    if(target)target.hidden=false;
    if(mosaic)mosaic.hidden=false;
    if(hint)hint.textContent='Selecciona 10 o más imágenes para crear las teselas';
  }
};
applyMode();
// Cada URL representa un producto distinto. Si otro script, autofill o estado restaurado
// intenta cambiar el selector interno oculto, se revierte antes de que mezcle ambos flujos.
if(select){
  select.value=mode;
  select.dispatchEvent(new Event('change'));
  select.addEventListener('change',()=>{
    if(select.value===mode)return;
    select.value=mode;
    applyMode();
    select.dispatchEvent(new Event('change'));
  });
}
})();
