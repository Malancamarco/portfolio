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

// Cinematic hero playlist: a pair of layers keeps the last frame visible
// while the next clip buffers, then crossfades without a blank background.
const heroVideos=Array.from(document.querySelectorAll('.hero-video-stack .hero-video'));
if(heroVideos.length===2){
  const clips=[
    {url:'01-infrastructure.mp4',poster:'01-infrastructure.jpg'},
    {url:'02-intelligence.mp4',poster:'02-intelligence.jpg'},
    {url:'03-systems.mp4',poster:'03-systems.jpg'}
  ];
  const assetRoot=new URL('assets/',document.currentScript?.src||document.baseURI);
  let active=0;
  let clipIndex=0;
  let transitioning=false;
  let firstPlay=true;
  const activeVideo=()=>heroVideos[active];
  const standbyVideo=()=>heroVideos[1-active];
  function setSource(video,index){
    const clip=clips[index];
    const url=new URL(clip.url,assetRoot).href;
    const source=video.querySelector('source');
    if(source?.src===url)return;
    if(source)source.src=url;
    video.poster=new URL(clip.poster,assetRoot).href;
    video.load();
  }
  function playActive(){
    const video=activeVideo();
    if(document.hidden)return;
    video.muted=true;
    video.defaultMuted=true;
    video.playsInline=true;
    video.play().catch(()=>{});
  }
  function rotateClip(){
    if(transitioning)return;
    const current=activeVideo();
    const next=standbyVideo();
    const nextIndex=(clipIndex+1)%clips.length;
    transitioning=true;
    setSource(next,nextIndex);
    const reveal=()=>{
      if(!transitioning)return;
      next.muted=true;
      next.playsInline=true;
      const p=next.play();
      if(p&&typeof p.then==='function'){
        p.then(()=>finish()).catch(()=>{
          // Keep the existing frame while the next video becomes available.
          transitioning=false;
          next.addEventListener('canplay',rotateClip,{once:true});
        });
      }else finish();
    };
    function finish(){
      if(!transitioning)return;
      next.classList.add('is-active');
      current.classList.remove('is-active');
      const previous=current;
      clipIndex=nextIndex;
      active=1-active;
      window.setTimeout(()=>{
        previous.pause();
        previous.currentTime=0;
        const upcoming=(clipIndex+1)%clips.length;
        setSource(previous,upcoming);
        transitioning=false;
      },850);
    }
    if(next.readyState>=2)reveal();
    else next.addEventListener('canplay',reveal,{once:true});
  }
  heroVideos.forEach(v=>{
    v.muted=true;
    v.defaultMuted=true;
    v.playsInline=true;
    v.addEventListener('ended',()=>{if(v===activeVideo())rotateClip();});
  });
  // Do not depend on metadata events alone for autoplay in Safari.
  playActive();
  activeVideo().addEventListener('canplay',playActive,{once:true});
  if(firstPlay){firstPlay=false;setSource(standbyVideo(),1);}
  window.addEventListener('pageshow',playActive);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)heroVideos.forEach(v=>v.pause());
    else playActive();
  });
}
