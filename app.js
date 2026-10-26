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
const items = Object.entries(groups).flatMap(([shape,s])=>s.split('|').map(id=>({id,shape,key:shape+'|'+id})));
const storageKey='playmobil-shields-owned-v1';
let owned=new Set();try{const a=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(a))owned=new Set(a)}catch{}
const $=id=>document.getElementById(id);
const persist=()=>localStorage.setItem(storageKey,JSON.stringify([...owned]));
const plain=x=>x.replace(/[^0-9]/g,'');
function shieldSvg(shape){const round=/Round|Buckler|Riot/.test(shape),oval=/Oval|Scutum/.test(shape),kite=/Kite|Heater|Pavise/.test(shape);const outline=round?'<circle cx="40" cy="43" r="30"/>':oval?'<ellipse cx="40" cy="42" rx="27" ry="35"/>':kite?'<path d="M11 10 Q40 16 69 10 L65 52 Q54 70 40 80 Q26 70 15 52Z"/>':'<path d="M15 8 L65 8 L72 37 L40 81 L8 37Z"/>';return `<svg viewBox="0 0 80 86" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3">${outline}<path d="M40 22V61M23 42H57" stroke-width="2" opacity=".4"/></svg>`}
function render(){const q=$('search').value.toLowerCase().trim(),f=$('filter').value;let visible=items.filter(v=>(!q||(v.id+' '+v.shape).toLowerCase().includes(q))&&(f==='all'||(f==='owned')===owned.has(v.key)));const grid=$('grid');grid.replaceChildren();const frag=document.createDocumentFragment();for(const item of visible){let tile=document.createElement('article');tile.className='tile'+(owned.has(item.key)?' owned':'');tile.tabIndex=0;tile.setAttribute('role','button');tile.setAttribute('aria-pressed',owned.has(item.key)?'true':'false');tile.innerHTML=`<div class="shield">${shieldSvg(item.shape)}</div><span class="name"></span><span class="type"></span><span class="check">${owned.has(item.key)?'✓ Megvan':' '}</span><span class="more">Részletek ↗</span>`;tile.querySelector('.name').textContent=item.id;tile.querySelector('.type').textContent=item.shape;tile.addEventListener('click',e=>{if(e.target.closest('.more')){details(item);return}if(owned.has(item.key))owned.delete(item.key);else owned.add(item.key);persist();render()});tile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tile.click()}});frag.append(tile)}grid.append(frag);$('empty').classList.toggle('hidden',visible.length>0);$('count').textContent=`${owned.size} / ${items.length} megvan · ${visible.length} látható`}
function details(item){$('detailTitle').textContent=item.id;$('detailType').textContent='Forma: '+item.shape;$('animLink').href='https://animobil.info/shields/text/wit-toc.html';$('playLink').href='https://www.playmodb.org/';$('dialog').showModal()}
$('close').onclick=()=>$('dialog').close();$('search').oninput=render;$('filter').onchange=render;
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,owned:[...owned]},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='playmobil-pajzsok-mentes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500)};
$('import').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.owned))throw Error('Érvénytelen mentés');owned=new Set(data.owned.filter(x=>items.some(y=>y.key===x)));persist();render()}catch(err){alert('Nem sikerült a mentés beolvasása: '+err.message)}e.target.value=''};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});render();
