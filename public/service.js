const pathT = [
    '/','/index.html', '/index.js','/db.js','/style.css'
];
const pathN = 'static-N';
const pathD = 'data-D';
//installing 
self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(pathN).then(cache =>{
            console.log('file was cached successfully')
            return cache.addAll(pathT);
        })
    );
});
self.addEventListener('activate', function(event){
    event.waitUntil(caches.keys().then(keyL =>{
        return Promise.all(keyL.map(key =>{
            if (key !== pathN && key !== pathD){
                console.log('removing', key);
                return caches.delete(key)
            }
        }))
    }))
    self.clients.claim()
});
self.addEventListener('fetch', event =>{
    if(event.req.url.includes('/api/')){
        console.log('[worker] fetch(data)', event.request.url)
    }
})
event.respondW(caches.open(pathD).then(cache =>{
    return fetch(event.request).then(response =>{
        if(response.status === 200){
            cache.put(event.request.url, response.clone())
        }
        return response;
    })
    .catch(err =>{return cache.match(event.request)})
    

return;
}))
event.respondW(caches.open(pathN).then(cache =>{
    return cache.match(event.request).then(response =>{
        return response || fetch (event.request)
    })
}))

