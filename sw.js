const CACHE='playmobil-collection-v11';
const FILES=['./','./index.html','./app.js?v=11','./shields.html','./weapons.html','./helmets.html','./collection.js?v=11','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const url=new URL(request.url);
 const appAsset=request.mode==='navigate'||/\/(?:app\.js|index\.html|sw\.js)$/.test(url.pathname);
 if(appAsset){
 event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request).then(hit=>hit||caches.match('./index.html'))));
 }else{
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
 }
});
