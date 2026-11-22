const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const year=$('#year');if(year)year.textContent=new Date().getFullYear();

const menuBtn=$('#menuBtn');
const mobileNav=$('#mobileNav');
const mobileBreakpoint=window.matchMedia('(max-width: 980px)');
const englishPage=document.documentElement.lang==='en';
function setMenu(open,{restoreFocus=false}={}){
  if(!menuBtn||!mobileNav)return;
  const shouldOpen=!!open&&mobileBreakpoint.matches;
  mobileNav.classList.toggle('open',shouldOpen);
  menuBtn.setAttribute('aria-expanded',String(shouldOpen));
  menuBtn.setAttribute('aria-label',shouldOpen?(englishPage?'Close menu':'Chiudi menu'):(englishPage?'Open menu':'Apri menu'));
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

// Reliable native autoplay for the single optimized cinematic background.
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


// Premium motion: one-shot viewport reveals with no external dependencies.
// Content stays readable without JavaScript or IntersectionObserver.
(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches||!('IntersectionObserver' in window))return;
  const hero=document.querySelector('.hero');
  // Trigger a visible entrance even when the deferred script runs after first paint.
  if(hero)hero.classList.add('premium-hero-play');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      observer.unobserve(el);
      requestAnimationFrame(()=>el.classList.add('premium-visible'));
      el.addEventListener('transitionend',e=>{
        if(e.target===el&&e.propertyName==='opacity'){
          el.classList.remove('premium-entering');
          el.style.removeProperty('--premium-delay');
        }
      });
      window.setTimeout(()=>{
        el.classList.remove('premium-entering');
        el.style.removeProperty('--premium-delay');
      },1600);
    });
  },{rootMargin:'0px 0px -65px 0px',threshold:0.03});
  const cardsSelector='.section-id,.simple-heading,.simple-skills article,.simple-experience article,.simple-tools .tool-card,.language-strip,.contact-static>.container>h2,.contact-static>.container>p,.contact-static>.container>.pill';
  document.querySelectorAll('main section:not(.hero)').forEach(section=>{
    [...section.querySelectorAll(cardsSelector)].forEach((element,index)=>{
      // Avoid flashing elements already on screen at startup.
      if(element.getBoundingClientRect().top<window.innerHeight*.45)return;
      element.dataset.premiumReveal='';
      element.style.setProperty('--premium-delay',Math.min(index%4,3)*85+'ms');
      element.classList.add('premium-entering');
      observer.observe(element);
    });
  });
  reduced.addEventListener('change',event=>{
    if(!event.matches)return;
    observer.disconnect();
    document.querySelectorAll('.premium-entering').forEach(el=>{
      el.classList.remove('premium-entering');
      el.style.removeProperty('--premium-delay');
    });
    hero?.classList.remove('premium-hero-play');
  });
})();
