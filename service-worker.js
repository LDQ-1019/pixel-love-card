// Service Worker - 轻量缓存
var CACHE='plc-v1';
var ASSETS=['./','./index.html','./manifest.json','./opening.png','./icons/icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(r){
        var copy=r.clone();
        if(r.ok && r.type==='basic'){
          caches.open(CACHE).then(function(c){c.put(e.request,copy);});
        }
        return r;
      }).catch(function(){return caches.match('./index.html');});
    })
  );
});