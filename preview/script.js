const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const year=$('#year');if(year)year.textContent=new Date().getFullYear();

const menuBtn=$('#menuBtn');
const mobileNav=$('#mobileNav');
const mobileBreakpoint=window.matchMedia('(max-width: 980px)');
function setMenu(open,{restoreFocus=false}={}){
  if(!menuBtn||!mobileNav)return;
  const shouldOpen=!!open&&mobileBreakpoint.matches;
  mobileNav.classList.toggle('open',shouldOpen);
  menuBtn.setAttribute('aria-expanded',String(shouldOpen));
  menuBtn.setAttribute('aria-label',shouldOpen?'Chiudi menu':'Apri menu');
  document.body.classList.toggle('menu-open',shouldOpen);
  if(!shouldOpen&&restoreFocus){
    menuBtn.focus({preventScroll:true});
  }
}
menuBtn?.addEventListener('click',()=>setMenu(menuBtn.getAttribute('aria-expanded')!=='true',{restoreFocus:menuBtn.getAttribute('aria-expanded')==='true'}));
$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&mobileNav?.classList.contains('open'))setMenu(false,{restoreFocus:true});
  if(e.key==='Tab'&&mobileNav?.classList.contains('open')){
    const items=[...mobileNav.querySelectorAll('a'),menuBtn];
    const first=items[0],last=items.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
document.addEventListener('click',e=>{
  if(mobileNav?.classList.contains('open')&&!mobileNav.contains(e.target)&&!menuBtn?.contains(e.target))setMenu(false);
});
mobileBreakpoint.addEventListener('change',()=>setMenu(false));

let ticking=false;
window.addEventListener('scroll',()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(()=>{
    const total=document.documentElement.scrollHeight-window.innerHeight;
    const progress=$('#progress');
    if(progress)progress.style.width=Math.min(100,Math.max(0,window.scrollY/Math.max(total,1)*100))+'%';
    document.querySelector('#header')?.classList.toggle('is-scrolled',window.scrollY>20);
    ticking=false;
  });
},{passive:true});
document.querySelector('#header')?.classList.toggle('is-scrolled',window.scrollY>20);

// Four-clip cinematic playlist. Keep the active layer visible while the next buffers.
const heroLayers=Array.from(document.querySelectorAll('.hero-video-stack .hero-video'));
if(heroLayers.length===2){
  const clips=['02-intelligence','04-red-waves','05-processor','06-digital-wave'];
  const mediaRoot=new URL('assets/',document.currentScript?.src||document.baseURI);
  let currentLayer=0;
  let currentClip=0;
  let switching=false;
  let pauseRequested=false;
  const mediaURL=(name,extension)=>new URL(name+'.'+extension,mediaRoot).href;
  const setClip=(el,index)=>{
    const src=mediaURL(clips[index],'mp4');
    let source=el.querySelector('source');
    if(!source){
      source=document.createElement('source');
      source.type='video/mp4';
      el.appendChild(source);
    }
    if(source.src!==src){
      source.src=src;
      el.poster=mediaURL(clips[index],'jpg');
      el.load();
    }
  };
  const playCurrent=()=>{
    if(document.hidden)return;
    const el=heroLayers[currentLayer];
    el.muted=true;el.defaultMuted=true;el.playsInline=true;
    el.play().catch(()=>{});
  };
  function advance(){
    if(switching||document.hidden)return;
    switching=true;
    const nextIndex=(currentClip+1)%clips.length;
    const previous=heroLayers[currentLayer];
    const incoming=heroLayers[1-currentLayer];
    setClip(incoming,nextIndex);
    const onReady=()=>{
      if(!switching)return;
      incoming.muted=true;incoming.defaultMuted=true;incoming.playsInline=true;
      incoming.play().then(()=>{
        if(!switching)return;
        incoming.classList.add('is-active');
        previous.classList.remove('is-active');
        currentLayer=1-currentLayer;
        currentClip=nextIndex;
        window.setTimeout(()=>{
          previous.pause();
          previous.currentTime=0;
          switching=false;
        },850);
      }).catch(()=>{switching=false;});
    };
    if(incoming.readyState>=2)onReady();
    else incoming.addEventListener('canplay',onReady,{once:true});
  }
  heroLayers.forEach(el=>{
    el.muted=true;el.defaultMuted=true;el.playsInline=true;
    el.addEventListener('ended',()=>{if(el===heroLayers[currentLayer])advance();});
  });
  setClip(heroLayers[1],1);
  playCurrent();
  heroLayers[0].addEventListener('canplay',playCurrent,{once:true});
  window.addEventListener('pageshow',playCurrent);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      heroLayers.forEach(el=>el.pause());
    }else{
      playCurrent();
    }
  });
}
