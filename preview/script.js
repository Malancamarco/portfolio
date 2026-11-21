const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const year=$('#year');if(year)year.textContent=new Date().getFullYear();
const menuBtn=$('#menuBtn'),mobileNav=$('#mobileNav');
function closeMenu(){if(!menuBtn||!mobileNav)return;mobileNav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Apri menu')}
menuBtn?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Chiudi menu':'Apri menu')});
$$('#mobileNav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(mobileNav?.classList.contains('open')&&!mobileNav.contains(e.target)&&!menuBtn.contains(e.target))closeMenu()});
window.addEventListener('resize',()=>{if(window.innerWidth>760)closeMenu()},{passive:true});
let ticking=false;
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{const total=document.documentElement.scrollHeight-innerHeight;const progress=$('#progress');if(progress)progress.style.width=scrollY/Math.max(total,1)*100+'%';ticking=false})}},{passive:true});
const video=$('.hero-video');
if(video){
  video.muted=true;
  video.defaultMuted=true;
  video.autoplay=true;
  video.loop=true;
  video.playsInline=true;
  const startVideo=()=>{if(!document.hidden)video.play().catch(()=>{});};
  if(video.readyState===0)video.load();
  startVideo();
  video.addEventListener('loadeddata',startVideo,{once:true});
  video.addEventListener('canplay',startVideo,{once:true});
  window.addEventListener('pageshow',startVideo);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else startVideo()});
}
