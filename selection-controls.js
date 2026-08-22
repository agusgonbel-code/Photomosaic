(()=>{
  const strip=document.querySelector('#strip');
  const shapeInfo=document.querySelector('#shapeInfo');
  const mode=document.querySelector('#mosaicMode');
  const shape=document.querySelector('#shape');
  const result=document.querySelector('#result');
  const again=document.querySelector('#again');
  const countLabel=document.querySelector('#count');
  const shapeApi=window.PhotoMosaicShapes;
  if(!strip||!shapeInfo||!mode||!shape)return;

  const style=document.createElement('style');
  style.textContent=`
    #strip .tile-thumb{position:relative;width:68px;height:68px;flex:0 0 68px;padding:3px}
    #strip .tile-thumb img{display:block;width:62px;height:62px;object-fit:cover;border-radius:12px}
    #strip .tile-remove{position:absolute;top:-5px;right:-5px;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;border-radius:999px;background:rgba(17,24,39,.88);color:#fff;font-size:20px;line-height:44px;display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.22);z-index:2}
    #strip .tile-remove:active{transform:scale(.94)}
    #strip .tile-remove:focus-visible,.shape-trim:focus-visible{outline:3px solid #2563eb;outline-offset:2px}
    .selection-preview-note{display:block;margin:7px 0 0;color:#64748b;font-size:12px;line-height:1.4}
    .shape-adjustment{display:block;margin-top:7px;font-weight:800;color:#1d4ed8}
    .shape-trim{display:block;width:100%;margin-top:10px;padding:10px 12px;min-height:44px;background:#1d4ed8;color:#fff}
    .result-integrity-note{margin:10px 0 0;padding:10px 12px;border-radius:14px;background:#ecfdf5;color:#166534;font-size:13px;line-height:1.4}
  `;
  document.head.append(style);

  function renderSelectionNote(){
    let note=document.querySelector('#selectionPreviewNote');
    if(st.tiles.length<=80){note?.remove();return;}
    if(!note){note=document.createElement('span');note.id='selectionPreviewNote';note.className='selection-preview-note';note.setAttribute('role','status');(countLabel||strip).insertAdjacentElement(countLabel?'afterend':'beforebegin',note);}
    note.textContent=`Mostrando 80 miniaturas de ${st.tiles.length}. Las ${st.tiles.length} fotos seleccionadas participan en la generación.`;
  }
  function decorateThumbnails(){
    const images=[...strip.children].filter(node=>node.tagName==='IMG');
    images.forEach((img,index)=>{
      const wrap=document.createElement('div');wrap.className='tile-thumb';
      const remove=document.createElement('button');remove.type='button';remove.className='tile-remove';remove.setAttribute('aria-label',`Eliminar foto ${index+1}`);remove.dataset.index=String(index);remove.textContent='×';
      img.replaceWith(wrap);wrap.append(img,remove);
    });
  }
  function refreshShapeHint(){
    shapeInfo.querySelector('.shape-adjustment')?.remove();
    if(mode.value!=='shape'||shape.value==='custom'||!st.tiles.length)return;
    const count=st.tiles.length,near=shapeApi.nearbyCounts(shape.value,count);if(near.exact)return;
    const options=[];
    if(near.lower&&count>near.lower){const remove=count-near.lower;options.push(`quita ${remove} foto${remove===1?'':'s'} para quedarte con ${near.lower}`);}
    if(near.upper&&count<near.upper){const add=near.upper-count;options.push(`añade ${add} foto${add===1?'':'s'} para llegar a ${near.upper}`);}
    if(!options.length)return;
    const extra=document.createElement('span');extra.className='shape-adjustment';extra.textContent=`Para ajustar la forma: ${options.join(' o ')}. Puedes quitar fotos una a una tocando la × de cada miniatura.`;
    if(near.lower&&count>near.lower){const remove=count-near.lower,trim=document.createElement('button');trim.type='button';trim.className='shape-trim';trim.dataset.count=String(near.lower);trim.textContent=`Quitar ${remove} y usar ${near.lower} fotos`;trim.disabled=generation.isRunning();extra.append(trim);}
    shapeInfo.append(extra);
  }
  function syncSelectionControls(){decorateThumbnails();renderSelectionNote();refreshShapeHint();}
  new MutationObserver(()=>queueMicrotask(syncSelectionControls)).observe(strip,{childList:true});
  strip.addEventListener('click',ev=>{const button=ev.target.closest('.tile-remove');if(!button||generation.isRunning())return;const index=Number(button.dataset.index);if(!Number.isInteger(index)||index<0||index>=st.tiles.length)return;st.tiles.splice(index,1);renderTiles();refreshShapeHint();});
  shapeInfo.addEventListener('click',ev=>{const button=ev.target.closest('.shape-trim');if(!button||generation.isRunning())return;const count=Number(button.dataset.count);st.tiles=shapeApi.trimSelection(st.tiles,count);renderTiles();});
  mode.addEventListener('change',()=>queueMicrotask(refreshShapeHint));shape.addEventListener('change',()=>queueMicrotask(refreshShapeHint));

  let locked=false;const previousDisabled=new Map();
  const sourceControls=()=>[...document.querySelectorAll('#targetSection input,#targetSection button,#tilesSection input,#tilesSection button,#settingsSection input,#settingsSection select,#settingsSection button,#generate,.tile-remove,.shape-trim')];
  function lockResultInputs(){if(locked||!result||result.classList.contains('hidden'))return;locked=true;previousDisabled.clear();sourceControls().forEach(control=>{previousDisabled.set(control,Boolean(control.disabled));control.disabled=true;});if(!result.querySelector('.result-integrity-note')){const note=document.createElement('p');note.className='result-integrity-note';note.textContent='Resultado protegido: las fotos y medidas quedan bloqueadas para que la imagen, el plano numerado y el CSV sigan coincidiendo. Pulsa “Crear otro” para volver a editar.';result.querySelector('h2')?.insertAdjacentElement('afterend',note);}}
  function unlockResultInputs(){if(!locked)return;locked=false;previousDisabled.forEach((disabled,control)=>{if(control?.isConnected)control.disabled=disabled;});previousDisabled.clear();queueMicrotask(()=>{try{updateShape();}catch{}});}
  if(result)new MutationObserver(()=>{if(!result.classList.contains('hidden'))setTimeout(lockResultInputs,0);}).observe(result,{attributes:true,attributeFilter:['class']});
  again?.addEventListener('click',()=>setTimeout(unlockResultInputs,0));
  syncSelectionControls();
})();
