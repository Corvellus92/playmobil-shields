'use strict';
const $=id=>document.getElementById(id), DATA='playmobil-personal-inventory-v19', DB='playmobil-personal-photos-v19';
let items=[],editing=null,photoData=null;
try{const v=JSON.parse(localStorage.getItem(DATA)||'[]');if(Array.isArray(v))items=v}catch{}
const normalize=x=>String(x||'').toLocaleLowerCase('hu').replace(/[\s-]/g,'');
const saveData=()=>localStorage.setItem(DATA,JSON.stringify(items));
const photoUrls=new Map();
let dbPromise=null;
function db(){if(!dbPromise)dbPromise=new Promise((ok,fail)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('images');r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)});return dbPromise}
async function photoGet(id){const database=await db();return new Promise((ok,fail)=>{const t=database.transaction('images');const req=t.objectStore('images').get(id);req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error)})}
async function photoPut(id,blob){const database=await db();return new Promise((ok,fail)=>{const t=database.transaction('images','readwrite');t.objectStore('images').put(blob,id);t.oncomplete=ok;t.onerror=()=>fail(t.error)})}
async function photoDelete(id){const database=await db();return new Promise((ok,fail)=>{const t=database.transaction('images','readwrite');t.objectStore('images').delete(id);t.oncomplete=ok;t.onerror=()=>fail(t.error)})}
async function showPhotos(){for(const x of items){try{const blob=await photoGet(x.id);if(blob){photoUrls.set(x.id,URL.createObjectURL(blob))}}catch(e){console.warn(e)}}render()}
function duplicates(part,name,ignore){const p=normalize(part),n=normalize(name);return items.filter(x=>x.id!==ignore&&((p&&normalize(x.part)===p)||(n&&normalize(x.name)===n)))}
function render(){const term=normalize($('search').value),cat=$('categoryFilter').value;
 const list=items.filter(x=>(!cat||x.category===cat)&&(!term||normalize(x.name+' '+x.part+' '+x.notes).includes(term)));
 list.sort((a,b)=>a.name.localeCompare(b.name,'hu',{numeric:true}));
 $('grid').replaceChildren();
 for(const x of list){const tile=document.createElement('article');tile.className='tile';const remove=document.createElement('button');remove.className='x';remove.textContent='×';remove.title='Tétel törlése';remove.onclick=async e=>{e.stopPropagation();if(!confirm('Törlöd ezt a leltártételt és a fotóját?'))return;items=items.filter(i=>i.id!==x.id);saveData();try{await photoDelete(x.id)}catch{}photoUrls.delete(x.id);render()};
 const art=document.createElement('div');if(photoUrls.has(x.id)){const img=document.createElement('img');img.src=photoUrls.get(x.id);img.alt=x.name;img.loading='lazy';art.append(img)}else{art.className='placeholder';art.textContent='📦'}
 const name=document.createElement('strong');name.textContent=x.name;const details=document.createElement('small');details.textContent=[x.part,x.category,'×'+x.qty].filter(Boolean).join(' · ');const btn=document.createElement('button');btn.textContent='Szerkesztés';btn.onclick=()=>edit(x);tile.append(remove,art,name,details,btn);$('grid').append(tile)}
 $('empty').textContent=list.length?'':'Nincs még ilyen tétel.';
 $('count').textContent=items.length+' különböző tétel · '+items.reduce((n,x)=>n+Number(x.qty||1),0)+' darab';
}
function edit(item){editing=item||null;photoData=undefined;$('editorTitle').textContent=item?'Tétel szerkesztése':'Új tétel';for(const k of ['name','part','notes'])$(k).value=item?.[k]||'';$('category').value=item?.category||'Other';$('qty').value=item?.qty||1;$('photo').value='';$('warning').textContent='';$('preview').hidden=!item||!photoUrls.has(item.id);if(!$('preview').hidden)$('preview').src=photoUrls.get(item.id);$('editor').showModal()}
$('add').onclick=()=>edit(null);$('cancel').onclick=()=>$('editor').close();$('search').oninput=render;$('categoryFilter').onchange=render;
$('photo').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/')||f.size>8_000_000){alert('Legfeljebb 8 MB-os képfájlt válassz.');return}photoData=f;const url=URL.createObjectURL(f);$('preview').src=url;$('preview').hidden=false};
$('removePhoto').onclick=()=>{photoData=null;$('preview').hidden=true;$('photo').value=''};
$('save').onclick=async()=>{const name=$('name').value.trim(),part=$('part').value.trim(),category=$('category').value,qty=Number($('qty').value),notes=$('notes').value.trim();if(!name||!Number.isInteger(qty)||qty<1){alert('Adj meg megnevezést és pozitív darabszámot.');return}
 const dup=duplicates(part,name,editing?.id);if(dup.length){$('warning').textContent='Lehetséges duplikátum: '+dup.map(x=>x.name+' ('+(x.part||'nincs cikkszám')+')').join(', ');alert('Ezt a cikkszámot vagy megnevezést már felvetted. A meglévő tétel darabszámát módosítsd!');return}
 const id=editing?.id||'personal-'+Date.now()+'-'+Math.random().toString(36).slice(2);const item={id,name,part,category,qty,notes};
 try{if(photoData instanceof Blob){await photoPut(id,photoData);const old=photoUrls.get(id);if(old)URL.revokeObjectURL(old);photoUrls.set(id,URL.createObjectURL(photoData))}else if(photoData===null){await photoDelete(id);const old=photoUrls.get(id);if(old)URL.revokeObjectURL(old);photoUrls.delete(id)}}catch(err){alert('Nem menthető a fotó: '+err.message);return}
 if(editing)Object.assign(editing,item);else items.push(item);try{saveData()}catch(err){alert('A leltár nem menthető: '+err.message);return}$('editor').close();render()};
const toDataUrl=blob=>new Promise((ok,fail)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>fail(r.error);r.readAsDataURL(blob)});
$('backup').onclick=async()=>{const exported=[];for(const item of items){const x={...item};try{const b=await photoGet(item.id);if(b)x.photo=await toDataUrl(b)}catch{}exported.push(x)}
 const url=URL.createObjectURL(new Blob([JSON.stringify({version:17,items:exported},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='playmobil-sajat-gyujtemeny.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
$('restore').onclick=()=>$('restoreFile').click();
$('restoreFile').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!Array.isArray(data.items))throw Error('Érvénytelen leltár');if(!confirm('A jelenlegi saját gyűjteményt felülírod a mentéssel?'))return;
 const restored=[];for(const x of data.items){if(!x||typeof x.name!=='string'||!x.name.trim())continue;const id=String(x.id||'personal-'+Date.now()+'-'+Math.random());if(x.photo&&/^data:image\//.test(x.photo)){const blob=await(await fetch(x.photo)).blob();await photoPut(id,blob)}restored.push({id,name:x.name,part:String(x.part||''),category:['Shields','Weapons','Helmets','Other'].includes(x.category)?x.category:'Other',qty:Math.max(1,Number(x.qty)||1),notes:String(x.notes||'')})}
 items=restored;saveData();for(const u of photoUrls.values())URL.revokeObjectURL(u);photoUrls.clear();await showPhotos();alert(restored.length+' tétel visszaállítva')}catch(err){alert('Sikertelen import: '+err.message)}e.target.value=''};
render();showPhotos();
