'use strict';
const section=location.pathname.endsWith('helmets.html')?'helmets':'weapons';
const titles={helmets:'🪖 Helmets',weapons:'⚔️ Weapons'};
const types={weapons:['Sword','Axe','Spear','Bow','Crossbow','Dagger','Mace','Halberd','Staff','Firearm','Other'],helmets:['Knight Helmet','Viking Helmet','Roman Helmet','Medieval Helmet','Modern Helmet','Fantasy Helmet','Hat','Other']};
const $=id=>document.getElementById(id);
const storageKey='playmobil-collection-'+section+'-v11';
let records=[];
try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(data))records=data.filter(x=>x&&typeof x.key==='string')}catch{}
let selected=null;
function store(){localStorage.setItem(storageKey,JSON.stringify(records))}
function validLink(value){if(!value)return true;try{return ['http:','https:'].includes(new URL(value).protocol)}catch{return false}}
function makeKey(){return 'manual-'+Date.now()+'-'+Math.random().toString(36).slice(2)}
$('title').textContent=titles[section];$('navTitle').textContent=section;
for(const name of types[section]){const option=document.createElement('option');option.value=name;option.textContent=name;$('type').append(option)}
function render(){
 const term=$('search').value.toLocaleLowerCase(),filter=$('filter').value;
 const visible=records.filter(x=>(!term||[x.name,x.part,x.type].join(' ').toLocaleLowerCase().includes(term))&&(filter==='all'||(filter==='owned')===!!x.owned));
 $('grid').replaceChildren();
 for(const entry of visible){
 const tile=document.createElement('article');tile.className='tile'+(entry.owned?' owned':'');
 const art=document.createElement('div');
 if(entry.image){const img=document.createElement('img');img.src=entry.image;img.loading='lazy';img.alt=entry.name||entry.part;img.onerror=()=>{art.textContent=section==='weapons'?'⚔️':'🪖';art.className='art'};art.append(img)}
 else{art.className='art';art.textContent=section==='weapons'?'⚔️':'🪖'}
 const name=document.createElement('b');name.textContent=entry.name||entry.part||'Névtelen cikk';
 const number=document.createElement('small');number.textContent=entry.part||entry.type||'';
 const details=document.createElement('button');details.className='detailBtn';details.textContent='Részletek';details.onclick=e=>{e.stopPropagation();edit(entry)};
 tile.append(art,name,number,details);tile.onclick=()=>{entry.owned=!entry.owned;store();render()};$('grid').append(tile)
 }
 $('count').textContent=records.filter(x=>x.owned).length+' / '+records.length+' megvan · '+visible.length+' látható';
}
function edit(entry){
 selected=entry||null;$('dialogTitle').textContent=entry?'Cikk szerkesztése':'Új cikk';
 $('name').value=entry?.name||'';$('part').value=entry?.part||'';$('type').value=entry?.type||types[section][0];
 $('image').value=entry?.image||'';$('source').value=entry?.source||'';$('delete').hidden=!entry;
 $('sourceLink').hidden=!entry?.source;if(entry?.source)$('sourceLink').href=entry.source;
 $('dialog').showModal();
}
$('add').onclick=()=>edit(null);$('cancel').onclick=()=>$('dialog').close();
$('save').onclick=()=>{
 const name=$('name').value.trim(),part=$('part').value.trim(),type=$('type').value,image=$('image').value.trim(),source=$('source').value.trim();
 if(!name&&!part){alert('Adj meg egy megnevezést vagy cikkszámot.');return}
 if(!validLink(image)||!validLink(source)){alert('Csak érvényes http vagy https linket adj meg.');return}
 if(selected)Object.assign(selected,{name,part,type,image,source});else records.push({key:makeKey(),name,part,type,image,source,owned:false});
 store();$('dialog').close();render();
};
$('delete').onclick=()=>{if(!selected||!confirm('Biztosan törlöd ezt a cikket?'))return;records=records.filter(x=>x.key!==selected.key);store();$('dialog').close();render()};
$('search').oninput=render;$('filter').onchange=render;
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:11,section,records},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='playmobil-'+section+'-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('importBtn').onclick=()=>$('importFile').click();
$('importFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const obj=JSON.parse(await file.text());if(obj.section!==section||!Array.isArray(obj.records))throw Error('Más kategória vagy hibás mentés');if(!confirm('Felülírod a jelenlegi '+section+' listát?'))return;records=obj.records.filter(x=>x&&typeof x.key==='string'&&typeof x.name==='string'&&typeof x.part==='string'&&types[section].includes(x.type)&&validLink(x.image||'')&&validLink(x.source||''));store();render()}catch(err){alert('Hibás mentés: '+err.message)}e.target.value=''};
render();
