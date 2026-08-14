(()=>{
  const strip=document.querySelector('#strip');
  const shapeInfo=document.querySelector('#shapeInfo');
  const mode=document.querySelector('#mosaicMode');
  const shape=document.querySelector('#shape');
  if(!strip||!shapeInfo||!mode||!shape)return;

  const style=document.createElement('style');
  style.textContent=`
    #strip .tile-thumb{position:relative;width:62px;height:62px;flex:0 0 62px}
    #strip .tile-thumb img{display:block;width:62px;height:62px;object-fit:cover;border-radius:12px}
    #strip .tile-remove{position:absolute;top:3px;right:3px;width:24px;height:24px;min-height:24px;padding:0;border-radius:999px;background:rgba(17,24,39,.84);color:#fff;font-size:17px;line-height:24px;display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.2);z-index:2}
    #strip .tile-remove:active{transform:scale(.94)}
    .shape-adjustment{display:block;margin-top:7px;font-weight:800;color:#1d4ed8}
  `;
  document.head.append(style);

  function decorateThumbnails(){
    const images=[...strip.children].filter(node=>node.tagName==='IMG');
    images.forEach((img,index)=>{
      const wrap=document.createElement('div');
      wrap.className='tile-thumb';
      const remove=document.createElement('button');
      remove.type='button';
      remove.className='tile-remove';
      remove.setAttribute('aria-label',`Eliminar foto ${index+1}`);
      remove.dataset.index=String(index);
      remove.textContent='×';
      img.replaceWith(wrap);
      wrap.append(img,remove);
    });
  }

  function refreshShapeHint(){
    shapeInfo.querySelector('.shape-adjustment')?.remove();
    if(mode.value!=='shape'||!st.tiles.length)return;
    const count=st.tiles.length;
    const near=nearbyCounts(shape.value,count);
    if(near.exact)return;

    const options=[];
    if(near.lower&&count>near.lower){
      const remove=count-near.lower;
      options.push(`quita ${remove} foto${remove===1?'':'s'} para quedarte con ${near.lower}`);
    }
    if(near.upper&&count<near.upper){
      const add=near.upper-count;
      options.push(`añade ${add} foto${add===1?'':'s'} para llegar a ${near.upper}`);
    }
    if(!options.length)return;

    const extra=document.createElement('span');
    extra.className='shape-adjustment';
    extra.textContent=`Para ajustar la forma: ${options.join(' o ')}. Puedes quitar fotos una a una tocando la × de cada miniatura.`;
    shapeInfo.append(extra);
  }

  function syncSelectionControls(){
    decorateThumbnails();
    refreshShapeHint();
  }

  const observer=new MutationObserver(()=>queueMicrotask(syncSelectionControls));
  observer.observe(strip,{childList:true});

  strip.addEventListener('click',ev=>{
    const button=ev.target.closest('.tile-remove');
    if(!button)return;
    const index=Number(button.dataset.index);
    if(!Number.isInteger(index)||index<0||index>=st.tiles.length)return;
    st.tiles.splice(index,1);
    renderTiles();
    refreshShapeHint();
  });

  mode.addEventListener('change',()=>queueMicrotask(refreshShapeHint));
  shape.addEventListener('change',()=>queueMicrotask(refreshShapeHint));

  syncSelectionControls();
})();
