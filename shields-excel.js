'use strict';
const $=id=>document.getElementById(id),key='playmobil-excel-owned-v19',hiddenKey='playmobil-excel-hidden-v19',editsKey='playmobil-excel-edits-v19';
const load=(k,def)=>{try{return JSON.parse(localStorage.getItem(k))??def}catch{return def}};
let owned=new Set(load(key,[])),hidden=new Set(load(hiddenKey,[])),edits=load(editsKey,{}),base=[];
const persist=()=>{localStorage.setItem(key,JSON.stringify([...owned]));localStorage.setItem(hiddenKey,JSON.stringify([...hidden]));localStorage.setItem(editsKey,JSON.stringify(edits))};
const settings=load('playmobil-types-v15',{}),types=Array.isArray(settings.shields)&&settings.shields.length?settings.shields:['Arched','Axehead','Buckler','Colossus','Double Concave','Double Indent','Dragon Wing','Elongated Oval','Giant Shield','Heater','Kite','Oval','Pavise','Riot','Round','Scutum','Other'];
const items=()=>base.map(x=>({...x,...edits[x.id]})).filter(x=>!hidden.has(x.id));
const sortpart=x=>String(x.part||'').replace(/[^a-z0-9]/gi,'').toLowerCase();
function render(){
 const q=$('search').value.toLocaleLowerCase(),filter=$('filter').value,shape=$('category').value,sort=$('sort').value;
 const arr=items().filter(x=>(!shape||shape==='all'||x.shape===shape)&&(!q||[x.part,x.shape,x.category].join(' ').toLocaleLowerCase().includes(q))&&(filter==='all'||(filter==='owned')===owned.has(x.id)));
 arr.sort((a,b)=>sort==='part-desc'?sortpart(b).localeCompare(sortpart(a),undefined,{numeric:true}):sort==='name'?a.part.localeCompare(b.part):sortpart(a).localeCompare(sortpart(b),undefined,{numeric:true}));
 $('grid').replaceChildren();
 for(const x of arr){
  const tile=document.createElement('article');tile.className='tile'+(owned.has(x.id)?' owned':'');tile.style.position='relative';
  const close=document.createElement('button');close.className='tileRemove';close.textContent='×';close.onclick=e=>{e.stopPropagation();if(confirm('Eltávolítod a listából?')){hidden.add(x.id);persist();render()}};
  const art=document.createElement('div');art.className='shield';
  if(x.image){const img=document.createElement('img');img.src=x.image;img.loading='lazy';img.alt=x.part;img.onerror=()=>{art.textContent='🛡️'};art.append(img)}else art.textContent='🛡️';
  const name=document.createElement('span');name.className='name';name.textContent=x.part;
  const type=document.createElement('span');type.className='type';type.textContent=x.shape;
  const more=document.createElement('button');more.textContent='Részletek';more.style.fontSize='11px';more.onclick=e=>{e.stopPropagation();edit(x)};
  tile.append(close,art,name,type,more);tile.onclick=()=>{if(owned.has(x.id))owned.delete(x.id);else owned.add(x.id);persist();render()};$('grid').append(tile);
 }
 $('count').textContent=items().filter(x=>owned.has(x.id)).length+' / '+items().length+' megvan · '+arr.length+' látható';
 $('empty').classList.toggle('hidden',arr.length>0);
}
let current=null;
function edit(x){current=x;$('detailTitle').textContent='Cikk szerkesztése';$('editPart').value=x.part;$('editName').value=x.category;$('editShape').value=x.shape;$('imageUrl').value=x.image||'';$('dialog').showModal()}
$('saveItemEdit').onclick=()=>{if(!current)return;const part=$('editPart').value.trim(),category=$('editName').value.trim(),shape=$('editShape').value,image=$('imageUrl').value.trim();if(!part)return alert('Add meg a cikkszámot');if(image&&!/^https?:\/\//i.test(image))return alert('Hibás képlink');edits[current.id]={part,category,shape,image};persist();$('dialog').close();render()};
$('close').onclick=()=>$('dialog').close();
$('search').oninput=render;$('filter').onchange=render;$('sort').onchange=render;$('category').onchange=render;
function fillSelect(id,names,all){const el=$(id);el.replaceChildren();if(all){const o=document.createElement('option');o.value='all';o.textContent='Minden forma';el.append(o)}for(const name of names){const o=document.createElement('option');o.value=name;o.textContent=name;el.append(o)}}
(async()=>{try{const r=await fetch('./shields-catalog.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();base=Array.isArray(d.items)?d.items:[];fillSelect('editShape',[...new Set([...types,...base.map(x=>x.shape)])]);fillSelect('category',[...new Set(base.map(x=>x.shape))],true);render()}catch(e){$('count').textContent='Katalógus hiba: '+e.message}})();
