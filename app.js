'use strict';
// Verified identifiers and shape groupings transcribed from Animobil Shields & Heraldry index.
// Some entries are identified by set numbers, not individual part numbers.
const groups = {
'Arched':'30 03 8545|30 62 0985|30 63 5214|30 64 2002|30 64 2012|30 64 2022|30 64 2032|70734 b|72213 a|80564',
'Axehead':'30 62 1556|30 62 9996|30 63 3623|30 63 5714|30 63 6833|30 63 9414|30 63 9626|30 64 2098|30 64 5482|30 64 7302|30 64 8132|9241|80549|80961',
'Buckler':'30 07 3200|30 28 1140|3511',
'Colossus':'30 24 4723',
'Double Concave':'30 22 2890|30 24 8840|30 62 4820|30 62 8541|30 62 8551|30 63 3250|30 63 3760|30 63 3820|30 63 3872|30 63 5664|30 64 0632',
'Double Indent':'30 63 5185',
'Dragon Wing':'30 20 4832|30 21 4123|30 62 3823|30 62 4029|30 62 7536|30 63 0323|30 63 0914|30 63 5564|30 64 5083|30 64 6843|30 64 6995|30 64 7382|30 64 7672|30 64 8032|4763|4937|9332|9443|70242|70565|72210 a',
'Elongated Oval':'30 64 2732|30 64 4282',
'Giant Shield':'30 45 2843|30 45 2313',
'Heater':'30 62 1561|30 62 1960|30 62 2182|30 62 2403|30 62 2413|4555|4689|4924 c|80509',
'Heater - Childs':'30 27 0220|30 62 4865|30 62 8448|30 63 3522|30 63 4862|30 63 9092|7386',
'Heater - Indented':'30 21 4073|30 21 4093|30 22 1850|30 62 1546|30 62 6413|30 62 6752|30 62 7232|30 63 1853|30 63 2006|30 63 2724|30 63 2773|30 63 3737|30 63 4062|30 63 5554|30 63 5555|30 63 5565|30 63 9424|30 64 2992|30 64 3612|30 64 5472|30 64 7742|30 64 7785|30 65 8202|4915c|4646|5886 a|70378|70752|72118|9835',
'Heater - Pointed':'30 20 9793|30 22 0142|30 62 2183|30 62 2323|30 62 2586|30 62 3203|30 62 3353|30 62 9326|30 63 2634|30 63 5224|30 63 5495|30 63 8873|30 64 0153|30 64 0606|30 64 0835|30 64 3364|30 64 9903|30 79 4623|5166a|5166b|5596 a|5596 b|72119|72210 b|72210 c',
'Heater - Pointed Small':'30 03 3784|30 20 4874|30 23 4482|30 62 9723',
'Heater - Small':'30 02 0676|30 02 3412|30 02 7230 a|30 02 7230 b|30 20 4914|30 20 4944|30 25 7742|30 26 2200|30 63 0620|30 64 4222|30 64 4830|30 64 5240|30 64 5250|30 64 5260|3291|3379|3482|3409|3624|3929|4953',
'Heater - Small 2':'30 03 1714|30 03 7664|30 03 7674|30 04 0834|30 06 5695',
'Heater - Type 1':'3130|3267',
'Kite':'30 20 7960|30 21 2110|4430|4434|5731|5888|7831|71604|71926|80584',
'Magic Light Shield':'30 65 0955',
'Oval':'30 62 3523|30 62 9740|30 63 0052|30 63 3752|30 63 7602|30 63 7612|30 63 9040|30 63 9192|30 64 7392|30 64 7623|5598 a|7460 b',
'Pavise':'30 62 4249|30 62 4792|30 62 6822|30 62 7082|30 63 5494|30 64 7552|30 64 3632|30 64 5510|3651|5887',
'Riot':'30 04 8144|30 63 3070|30 63 3080|30 63 4177|30 63 5485|30 63 5504|30 63 8780|30 63 8960|30 63 9152|30 63 9213|30 64 0420|30 64 6753|30 64 7548|30 64 7642|30 64 7982|30 64 8686|30 64 8706|30 64 9016|2951|3569 a|3569 b|3569 c|3569 d|3620|3732 a|3732 c|3733|4540|4569|9146 a|70734 a|71338|71836|72213 b|80602|80762',
'Round - Center Boss':'30 63 1414|30 63 1424|30 63 1444|30 63 1464|30 63 1962|30 63 5195|30 63 6923|30 64 2622|30 64 3642|30 64 6283|30 64 6874|30 64 7003|30 64 7162|30 64 8005|30 64 8025|30 64 8042|30 64 8142|30 64 9945|32 80 5813|4745|4769|5596 c|5886 b|9146 b|70069|70139 a|70148|71456|72028',
'Round - Center Boss 2':'30 64 4275',
'Round - Two Part':'30 04 8070|30 04 8872|30 05 6143|30 07 1772|30 07 6500|30 09 1850|30 22 8310|30 25 6513|30 29 4280|30 62 8740|30 64 1566|3060c|70975',
'Round - Jewel Center':'30 20 5072|35 20 5072|30 20 6662',
'Scutum':'30 62 6068|30 63 1932|30 64 2502|70139 b',
'Scutum 2':'30 21 7894|30 62 2728|30 64 4184|71268',
'Ships Wheel':'30 62 4215'
};
const categories = {
  "Arched": "https://animobil.info/shields/text/5d0863aa-569.html",
  "Axehead": "https://animobil.info/shields/text/5d0863aa-570.html",
  "Buckler": "https://animobil.info/shields/text/5d0863aa-380.html",
  "Colossus": "https://animobil.info/shields/text/5d0863aa(shields)-1128.html",
  "Double Concave": "https://animobil.info/shields/text/5d0863aa-584.html",
  "Double Indent": "https://animobil.info/shields/text/5d0863aa-shields-1203.html",
  "Dragon Wing": "https://animobil.info/shields/text/5d0863aa-585.html",
  "Elongated Oval": "https://animobil.info/shields/text/5d0863aa-575.html",
  "Giant Shield": "https://animobil.info/shields/text/5d0863aa-shields-1350.html",
  "Heater": "https://animobil.info/shields/text/5d0863aa-571.html",
  "Heater - Childs": "https://animobil.info/shields/text/5d0863aa-572.html",
  "Heater - Indented": "https://animobil.info/shields/text/5d0863aa-574.html",
  "Heater - Lyra": "https://animobil.info/shields/text/5d0863aa-shields15-1171.html",
  "Heater - Pointed": "https://animobil.info/shields/text/5d0863aa-623.html",
  "Heater - Pointed Small": "https://animobil.info/shields/text/5d0863aa(shields)-910.html",
  "Heater - Small": "https://animobil.info/shields/text/5d0863aa-573.html",
  "Heater - Small 2": "https://animobil.info/shields/text/5d0863aa-shields-1273.html",
  "Heater - Type 1": "https://animobil.info/shields/text/5d0863aa-shields-1295.html",
  "Kite": "https://animobil.info/shields/text/5d0863aa-583.html",
  "Kite - XXL": "https://animobil.info/shields/text/5d0863aa-shields-1303.html",
  "Magic Light Shield": "https://animobil.info/shields/text/5d0863aa-shields-1249.html",
  "Oval": "https://animobil.info/shields/text/5d0863aa-576.html",
  "Pavise": "https://animobil.info/shields/text/5d0863aa-577.html",
  "Riot": "https://animobil.info/shields/text/5d0863aa-578.html",
  "Round": "https://animobil.info/shields/text/5d0863aa-579.html",
  "Round Display": "https://animobil.info/shields/text/5d0863aa-shields-1279.html",
  "Round - Center Boss": "https://animobil.info/shields/text/5d0863aa-580.html",
  "Round - Center Boss 2": "https://animobil.info/shields/text/5d0863aa-shields-1218.html",
  "Round - Two Part": "https://animobil.info/shields/text/5d0863aa-581.html",
  "Round - Jewel Center": "https://animobil.info/shields/text/5d0863aa-618.html",
  "Scutum": "https://animobil.info/shields/text/5d0863aa-582.html",
  "Scutum 2": "https://animobil.info/shields/text/5d0863aa(shields15)-1162.html",
  "Ships Wheel": "https://animobil.info/shields/text/5d0863aa-shields-1188.html"
};
for (const name of Object.keys(categories)) if (!(name in groups)) groups[name]='';
categories['PlaymoDB Shields']='https://playmodb.org/cgi-bin/category.pl?category=Tool-Shield&pics=on';
const baseItems = Object.entries(groups).flatMap(([shape,s])=>s?s.split('|').map(id=>({id,shape,key:shape+'|'+id})):[]);
const customKey='playmobil-shields-custom-v5';
let customItems=[];
try { const saved=JSON.parse(localStorage.getItem(customKey)||'[]'); if(Array.isArray(saved)) customItems=saved.filter(x=>x&&typeof x.id==='string'&&typeof x.shape==='string'&&categories[x.shape]).map(x=>({id:x.id,shape:x.shape,key:x.shape+'|'+x.id,custom:true,source:x.source||''})); }catch{}
function saveCustom(){localStorage.setItem(customKey,JSON.stringify(customItems))}
const editsKey='playmobil-shields-edits-v10';
let itemEdits={};try{const saved=JSON.parse(localStorage.getItem(editsKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))itemEdits=saved}catch{}
function saveEdits(){localStorage.setItem(editsKey,JSON.stringify(itemEdits))}
const hiddenKey='playmobil-shields-hidden-v14';
let hiddenKeys=new Set();try{const v=JSON.parse(localStorage.getItem(hiddenKey)||'[]');if(Array.isArray(v))hiddenKeys=new Set(v)}catch{}
function saveHidden(){localStorage.setItem(hiddenKey,JSON.stringify([...hiddenKeys]))}
let playmodbShields=[];
async function loadPlaymodbShields(){
 try{
  const response=await fetch('./shields-catalog.json',{cache:'no-store'});
  if(!response.ok)return;
  const data=await response.json();
  playmodbShields=Array.isArray(data.items)?data.items.filter(x=>x&&x.part&&x.id).map(x=>({id:x.part,shape:'PlaymoDB Shields',key:x.id,name:x.name||x.part,image:x.image||'',source:x.source||'',custom:false,playmodb:true})):[];
  rebuildItems();render();
 }catch(e){console.warn('PlaymoDB shields not loaded',e)}
}
let items=[];
function rebuildItems(){ const unique=new Map();for(const x of [...baseItems,...customItems,...playmodbShields])unique.set(x.key,x);items=[...unique.values()].filter(item=>!hiddenKeys.has(item.key)).map(item=>{const edit=itemEdits[item.key];return edit?{...item,id:edit.id||item.id,shape:categories[edit.shape]?edit.shape:item.shape,name:edit.name||''}:item}); }rebuildItems();
const sourceKey='playmobil-shields-sources-v5';let itemSources={};try{const x=JSON.parse(localStorage.getItem(sourceKey)||'{}');if(x&&typeof x==='object'&&!Array.isArray(x))itemSources=x}catch{}
function saveSources(){localStorage.setItem(sourceKey,JSON.stringify(itemSources))}
// Animobil thumbnail paths contain the part number PLUS an image-specific suffix.
// Do not guess missing suffixes. Discover from the category HTML when CORS allows.
const knownAnimobilImages={'30038545':'https://animobil.info/shields/wit-icons/30038545-30822346a.png'};
const animobilDiscovered=new Map(Object.entries(knownAnimobilImages));
const scannedCategories=new Set();
// JSON is generated by the GitHub Actions scraper from actual Animobil HTML links.
async function loadSyncedCatalog(){
  try{
    const response=await fetch('./animobil-images.json',{cache:'no-store'});
    if(!response.ok){$('imageSyncStatus').textContent='Animobil képkatalógus: adatfájl még nem elérhető';return;}
    const data=await response.json();
    if(!data.imageMap||typeof data.imageMap!=='object')return;
    for(const [part,links] of Object.entries(data.imageMap)){
      if(!/^[0-9]{8}$/.test(part)||!Array.isArray(links))continue;
      const link=links.find(u=>typeof u==='string'&&u.startsWith('https://animobil.info/shields/wit-icons/'));
      if(link&&!animobilDiscovered.has(part))animobilDiscovered.set(part,link);
    }
    const total=Object.values(data.imageMap).reduce((sum,urls)=>sum+(Array.isArray(urls)?urls.length:0),0);
    const status=data.status==='partial'?' · részleges adatgyűjtés':'';
    $('imageSyncStatus').textContent='Animobil képek: '+total+' hivatkozás / '+Object.keys(data.imageMap).length+' cikkszám'+status;
    render();
  }catch(err){$('imageSyncStatus').textContent='Animobil képkatalógus: betöltési hiba';console.info('Szinkronizált képkatalógus még nem érhető el.',err.message)}
}

const animobilPart=id=>id.replace(/[^0-9]/g,'');
function imageCandidates(item){
  if(item.image)return [item.image];
  const part=animobilPart(item.id);
  const exact=imageUrls[item.key]||animobilDiscovered.get(part);
  if(exact)return [exact];
  // Guess only the simple filename requested by the collector. Unknown names are not catalogued as verified.
  if(!/^\d{8}$/.test(part))return [];
  return ['https://animobil.info/shields/wit-icons/'+part+'.png'];
}
function imageFor(item){return imageCandidates(item)[0]||''}
function updateAutomaticImages(){for(const tile of document.querySelectorAll('#grid .tile')){const key=tile.dataset.key;const item=items.find(x=>x.key===key);if(!item||photos.has(key)||imageUrls[key])continue;const url=imageFor(item);if(!url)continue;const host=tile.querySelector('.shield');const img=host.querySelector('img');if(img)continue;const node=document.createElement('img');node.loading='lazy';node.alt='Animobil pajzskép';node.referrerPolicy='no-referrer';node.onerror=()=>{node.remove();if(!host.querySelector('svg'))host.innerHTML=shieldSvg(item.shape)};node.src=url;host.replaceChildren(node)}}
async function discoverAnimobil(category){if(!category||category==='all'||scannedCategories.has(category))return;scannedCategories.add(category);
try{const response=await fetch(categories[category],{mode:'cors'});if(!response.ok)throw Error('HTTP '+response.status);
const html=await response.text();
const regex=/([0-9]{8}-[a-zA-Z0-9_-]+[.](?:png|jpg|jpeg|webp))/gi;
for(const match of html.matchAll(regex)){const file=match[1];const part=file.split('-')[0];if(/^[0-9]{8}$/.test(part))animobilDiscovered.set(part,'https://animobil.info/shields/wit-icons/'+file)}
updateAutomaticImages();
}catch(err){console.info('Animobil automatikus képfelderítés nem elérhető (lehet CORS tiltás).',err.message)}
}
const storageKey='playmobil-shields-owned-v1';
const imageUrlsKey='playmobil-shields-image-urls-v4';
let imageUrls={};try{const stored=JSON.parse(localStorage.getItem(imageUrlsKey)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))imageUrls=stored}catch{}
function saveImageUrls(){localStorage.setItem(imageUrlsKey,JSON.stringify(imageUrls))}
function validImageUrl(str){try{const u=new URL(str);return u.protocol==='https:'||u.protocol==='http:'}catch{return false}}
// User-provided pictures are stored locally in IndexedDB; no images are copied from third-party catalogs.
let photoDb;
const photos=new Map();
function dbOpen(){return new Promise((resolve,reject)=>{const req=indexedDB.open('playmobil-shields-photos',1);req.onupgradeneeded=()=>req.result.createObjectStore('photos');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function loadPhotos(){try{photoDb=await dbOpen();const tx=photoDb.transaction('photos','readonly');const store=tx.objectStore('photos');for(const item of items){const file=await new Promise(resolve=>{const r=store.get(item.key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve(null)});if(file)photos.set(item.key,URL.createObjectURL(file))}render()}catch(err){console.warn('Local photos unavailable',err)}}
async function savePhoto(key,file){if(!photoDb)photoDb=await dbOpen();await new Promise((resolve,reject)=>{const tx=photoDb.transaction('photos','readwrite');tx.objectStore('photos').put(file,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});if(photos.has(key))URL.revokeObjectURL(photos.get(key));photos.set(key,URL.createObjectURL(file));render()}
async function deletePhoto(key){if(!photoDb)return;await new Promise((resolve,reject)=>{const tx=photoDb.transaction('photos','readwrite');tx.objectStore('photos').delete(key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});if(photos.has(key)){URL.revokeObjectURL(photos.get(key));photos.delete(key)}render()}
let currentItem=null;
let owned=new Set();try{const a=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(a))owned=new Set(a)}catch{}
const $=id=>document.getElementById(id);
const persist=()=>localStorage.setItem(storageKey,JSON.stringify([...owned]));
const plain=x=>x.replace(/[^0-9]/g,'');
function shieldSvg(shape){const round=/Round|Buckler|Riot/.test(shape),oval=/Oval|Scutum/.test(shape),kite=/Kite|Heater|Pavise/.test(shape);const outline=round?'<circle cx="40" cy="43" r="30"/>':oval?'<ellipse cx="40" cy="42" rx="27" ry="35"/>':kite?'<path d="M11 10 Q40 16 69 10 L65 52 Q54 70 40 80 Q26 70 15 52Z"/>':'<path d="M15 8 L65 8 L72 37 L40 81 L8 37Z"/>';return `<svg viewBox="0 0 80 86" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3">${outline}<path d="M40 22V61M23 42H57" stroke-width="2" opacity=".4"/></svg>`}
function render(){const q=$('search').value.toLowerCase().trim(),f=$('filter').value;let visible=items.filter(v=>(!q||(v.id+' '+v.shape+' '+(v.name||'')).toLowerCase().includes(q))&&(f==='all'||(f==='owned')===owned.has(v.key)));const category=$('category').value;visible=visible.filter(v=>category==='all'||v.shape===category);const grid=$('grid');grid.replaceChildren();const frag=document.createDocumentFragment();for(const item of visible){let tile=document.createElement('article');tile.className='tile'+(owned.has(item.key)?' owned':'');tile.dataset.key=item.key;tile.tabIndex=0;tile.setAttribute('role','button');tile.setAttribute('aria-pressed',owned.has(item.key)?'true':'false');tile.innerHTML=`<div class="shield">${photos.has(item.key)?'<img loading="lazy" alt="Pajzsfotó" src="'+photos.get(item.key)+'">':(imageFor(item)?'<img loading="lazy" alt="Pajzsfotó">':shieldSvg(item.shape))}</div><span class="name"></span><span class="type"></span><span class="check">${owned.has(item.key)?'✓ Megvan':' '}</span><span class="more">Részletek ↗</span>`;if(!photos.has(item.key)&&imageFor(item)){const img=tile.querySelector('.shield img');img.referrerPolicy='no-referrer';img.src=imageFor(item);img.onerror=()=>{img.replaceWith((()=>{const el=document.createElement('span');el.innerHTML=shieldSvg(item.shape);return el})())}}tile.querySelector('.name').textContent=item.name||item.id;tile.querySelector('.type').textContent=item.shape;const remove=document.createElement('button');remove.className='tileRemove';remove.textContent='×';remove.title='Cikk elrejtése / törlése';remove.setAttribute('aria-label','Cikk eltávolítása');remove.onclick=e=>{e.stopPropagation();if(!confirm('Eltávolítod ezt a cikket a listából?'))return;hiddenKeys.add(item.key);saveHidden();render()};tile.append(remove);tile.addEventListener('click',e=>{if(e.target.closest('.more')){details(item);return}if(owned.has(item.key))owned.delete(item.key);else owned.add(item.key);persist();render()});tile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tile.click()}});frag.append(tile)}grid.append(frag);$('empty').classList.toggle('hidden',visible.length>0);$('empty').textContent=category!=='all'&&!items.some(v=>v.shape===category)?'Ehhez a kategóriához még nincs felvitt cikkszám. Az Animobil forrásoldal fent megnyitható.':'Nincs találat.';$('categoryLinks').innerHTML='';if(category!=='all'){const anchor=document.createElement('a');anchor.href=categories[category];anchor.target='_blank';anchor.rel='noopener';anchor.textContent='Animobil: '+category+' ↗';$('categoryLinks').append(anchor)}$('count').textContent=`${items.filter(x=>owned.has(x.key)).length} / ${items.length} megvan · ${visible.length} látható`}
function details(item){currentItem=item;$('photoInput').value='';$('imageUrl').value=imageUrls[item.key]||'';$('removeImageUrl').disabled=!imageUrls[item.key];$('removePhoto').hidden=!photos.has(item.key);$('detailTitle').textContent=item.id;$('detailType').textContent='Forma: '+item.shape;$('editName').value=item.name||'';$('editPart').value=item.id;$('editShape').value=item.shape;$('animLink').href=item.source||categories[item.shape]||'https://animobil.info/shields/text/wit-toc.html';$('playLink').href='https://www.playmodb.org/';$('directImageLink').href=imageFor(item)||categories[item.shape];$('directImageLink').textContent=imageFor(item)?'Pajzskép megnyitása ↗':'Animobil kategória megnyitása ↗';$('itemSource').value=itemSources[item.key]||item.source||'';$('deleteItem').hidden=!item.custom;$('dialog').showModal()}
for(const name of Object.keys(categories)){const opt=document.createElement('option');opt.value=name;opt.textContent=name;$('editShape').append(opt)}
$('saveItemEdit').onclick=()=>{
 if(!currentItem)return;
 const id=$('editPart').value.trim(),name=$('editName').value.trim(),shape=$('editShape').value;
 if(!id||id.length>90||name.length>120||!categories[shape]){alert('Érvénytelen cikkszám, megnevezés vagy típus.');return}
 // Keep the original stable key for owned flags, photos and image links.
 itemEdits[currentItem.key]={id,name,shape};saveEdits();rebuildItems();
 $('dialog').close();render();
};
const categorySelect=$('category');for(const name of Object.keys(categories)){const option=document.createElement('option');option.value=name;option.textContent=name+' ('+items.filter(x=>x.shape===name).length+')';categorySelect.append(option)}for(const name of Object.keys(categories)){const o=document.createElement('option');o.value=name;o.textContent=name;$('newShape').append(o)}categorySelect.onchange=()=>{render();discoverAnimobil(categorySelect.value)};
$('photoInput').onchange=async e=>{const f=e.target.files?.[0];if(!f||!currentItem)return;if(!f.type.startsWith('image/')||f.size>5_000_000){alert('Legfeljebb 5 MB-os képfájlt válassz.');return}try{await savePhoto(currentItem.key,f);$('dialog').close()}catch(err){alert('Nem sikerült a kép mentése: '+err.message)}};
$('saveImageUrl').onclick=()=>{if(!currentItem)return;const url=$('imageUrl').value.trim();if(!validImageUrl(url)){alert('Adj meg érvényes http(s) kép URL-t.');return}imageUrls[currentItem.key]=url;try{saveImageUrls()}catch{alert('Nem sikerült elmenteni a képhivatkozást.');return}render();$('dialog').close()};
$('removeImageUrl').onclick=()=>{if(!currentItem)return;delete imageUrls[currentItem.key];saveImageUrls();render();$('dialog').close()};
$('imageList').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const raw=await file.text();let entries=[];if(file.name.toLowerCase().endsWith('.json')){const data=JSON.parse(raw);const records=Array.isArray(data)?data:(data.images||[]);entries=records.map(r=>[r.shape+'|'+r.id,r.url])}else{entries=raw.split(/\r?\n/).filter(Boolean).map(line=>{const cols=line.split(line.includes('\t')?'\t':';');return [cols[0]+'|'+cols[1],cols[2]]})}let n=0;for(const [key,url] of entries){if(items.some(it=>it.key===key)&&validImageUrl(url)){imageUrls[key]=url;n++}}saveImageUrls();render();alert(n+' képhivatkozás betöltve.')}catch(err){alert('A képlista hibás: '+err.message)}e.target.value=''};
$('removePhoto').onclick=async()=>{if(!currentItem)return;await deletePhoto(currentItem.key);$('dialog').close()};
$('saveSource').onclick=()=>{if(!currentItem)return;const u=$('itemSource').value.trim();if(u&&!validImageUrl(u)){alert('Érvényes http(s) forráscímet adj meg.');return}if(u)itemSources[currentItem.key]=u;else delete itemSources[currentItem.key];saveSources();$('dialog').close()};
$('openSource').onclick=()=>{if(!currentItem)return;const url=itemSources[currentItem.key]||currentItem.source||categories[currentItem.shape];if(validImageUrl(url))window.open(url,'_blank','noopener')};
$('deleteItem').onclick=()=>{if(!currentItem?.custom)return;if(!confirm('Törlöd ezt a saját pajzsot?'))return;customItems=customItems.filter(x=>x.key!==currentItem.key);saveCustom();rebuildItems();owned.delete(currentItem.key);persist();$('dialog').close();render()};
$('addItem').onclick=()=>{const shape=$('category').value==='all'?Object.keys(categories)[0]:$('category').value;$('newShape').value=shape;$('addDialog').showModal()};
$('createItem').onclick=()=>{const shape=$('newShape').value,id=$('newId').value.trim(),source=$('newSource').value.trim();if(!id||id.length>90){alert('Adj meg egy cikkszámot vagy egyedi azonosítót (max. 90 karakter).');return}if(source&&!validImageUrl(source)){alert('Hibás forráslink.');return}const key=shape+'|'+id;if(items.some(x=>x.key===key)){alert('Ez a pajzs már szerepel a listában.');return}customItems.push({shape,id,key,custom:true,source});saveCustom();rebuildItems();$('category').value=shape;$('filter').value='all';$('search').value='';$('addDialog').close();$('newId').value='';$('newSource').value='';render()};
$('cancelAdd').onclick=()=>$('addDialog').close();
$('close').onclick=()=>$('dialog').close();$('search').oninput=render;$('filter').onchange=render;
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:5,owned:[...owned],imageUrls,customItems,itemSources,itemEdits,hiddenKeys:[...hiddenKeys]},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='playmobil-pajzsok-mentes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500)};
$('import').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.owned))throw Error('Érvénytelen mentés');if(Array.isArray(data.hiddenKeys)){hiddenKeys=new Set(data.hiddenKeys.filter(x=>typeof x==='string'));saveHidden()}if(data.itemEdits&&typeof data.itemEdits==='object'&&!Array.isArray(data.itemEdits)){itemEdits=data.itemEdits;saveEdits()}if(Array.isArray(data.customItems)){customItems=data.customItems.filter(x=>x&&categories[x.shape]&&typeof x.id==='string').map(x=>({id:x.id,shape:x.shape,key:x.shape+'|'+x.id,source:x.source||'',custom:true}));saveCustom();rebuildItems()}else rebuildItems();if(data.itemSources&&typeof data.itemSources==='object'){itemSources=Object.fromEntries(Object.entries(data.itemSources).filter(([k,v])=>items.some(x=>x.key===k)&&validImageUrl(v)));saveSources()}owned=new Set(data.owned.filter(x=>items.some(y=>y.key===x)));persist();if(data.imageUrls&&typeof data.imageUrls==='object'){for(const [key,url] of Object.entries(data.imageUrls)){if(items.some(it=>it.key===key)&&validImageUrl(url))imageUrls[key]=url}saveImageUrls()}render()}catch(err){alert('Nem sikerült a mentés beolvasása: '+err.message)}e.target.value=''};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});render();loadPhotos();loadSyncedCatalog();loadPlaymodbShields();
