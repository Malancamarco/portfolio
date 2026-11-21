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
const video=$('.hero-video'),motionBtn=$('#motionBtn');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const saveData=navigator.connection?.saveData===true;
let userPaused=reducedMotion.matches||saveData;
let heroVisible=true;
function updateVideo(){if(!video)return;if(userPaused||!heroVisible||document.hidden){video.pause()}else{video.play().catch(()=>{})}if(motionBtn){motionBtn.textContent=userPaused?'RIPRENDI VIDEO ▶':'PAUSA VIDEO ❚❚';motionBtn.setAttribute('aria-pressed',String(userPaused));motionBtn.setAttribute('aria-label',userPaused?'Riprendi il video di sfondo':'Metti in pausa il video di sfondo')}}
motionBtn?.addEventListener('click',()=>{userPaused=!userPaused;updateVideo()});
if('IntersectionObserver'in window&&video){new IntersectionObserver(entries=>{heroVisible=entries[0]?.isIntersecting??true;updateVideo()},{threshold:0.05}).observe(video)}
document.addEventListener('visibilitychange',updateVideo);
updateVideo();
