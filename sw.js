const C="thebanger-v13",SDK="tb-sdk-v1";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==SDK).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET")return;
  if(u.hostname==="www.gstatic.com"&&u.pathname.startsWith("/firebasejs/")){
    e.respondWith(caches.open(SDK).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));
    return;
  }
  if(u.origin!==location.origin)return;
  const isDoc=r.mode==="navigate"||u.pathname.endsWith(".html")||u.pathname.endsWith("/");
  if(isDoc){
    e.respondWith(new Promise(res=>{
      let done=false;
      const t=setTimeout(()=>{caches.match(r).then(m=>{if(m&&!done){done=true;res(m)}})},1500);
      fetch(r).then(n=>{clearTimeout(t);const c=n.clone();caches.open(C).then(x=>x.put(r,c));if(!done){done=true;res(n)}}).catch(()=>{clearTimeout(t);caches.match(r).then(m=>{if(!done){done=true;res(m||caches.match("index.html"))}})});
    }));
  }else{
    e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{const f=fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n}).catch(()=>m);return m||f})));
  }
});
