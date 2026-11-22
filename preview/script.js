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

// Keep poster visible on reduced-motion or data-saving devices.
// Only fetch the hero video when motion is allowed.
const video=$('.hero-video');
if(video){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData=Boolean(navigator.connection?.saveData);
  const canAnimate=()=>!reduceMotion.matches&&!saveData;
  const source=video.querySelector('source[data-src]');
  let loaded=false;
  const startVideo=()=>{
    if(!canAnimate()||document.hidden){
      video.pause();
      return;
    }
    if(!loaded&&source){
      source.src=source.dataset.src;
      loaded=true;
      video.load();
    }
    if(loaded)video.play().catch(()=>{});
  };
  video.muted=true;
  video.defaultMuted=true;
  video.loop=true;
  video.playsInline=true;
  startVideo();
  window.addEventListener('pageshow',startVideo);
  document.addEventListener('visibilitychange',startVideo);
  reduceMotion.addEventListener('change',startVideo);
}
