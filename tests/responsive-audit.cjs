const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:8765/';
const widths = [
  {name:'mobile-320',width:320,height:568,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  {name:'mobile-375',width:375,height:667,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  {name:'mobile-390',width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  {name:'mobile-430',width:430,height:932,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  {name:'landscape-667',width:667,height:375,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  {name:'tablet-768',width:768,height:1024,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  {name:'tablet-1024',width:1024,height:768,deviceScaleFactor:1},
  {name:'laptop-1280',width:1280,height:800,deviceScaleFactor:1},
  {name:'desktop-1440',width:1440,height:900,deviceScaleFactor:1},
  {name:'desktop-1920',width:1920,height:1080,deviceScaleFactor:1},
  {name:'ultrawide-2560',width:2560,height:1440,deviceScaleFactor:1},
  {name:'ultrawide-3440',width:3440,height:1440,deviceScaleFactor:1}
];
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{})});
  let problems=[];
  fs.mkdirSync('responsive-screenshots',{recursive:true});
  for(const device of widths){
    const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,isMobile:!!device.isMobile,hasTouch:!!device.hasTouch});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(800);
    const state=await page.evaluate(()=>{
      const rect=(sel)=>{const node=document.querySelector(sel);if(!node)return null;const r=node.getBoundingClientRect();return {x:r.x,y:r.y,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,visible:r.width>0&&r.height>0}};
      const header=rect('.site-header'),content=rect('#expertise .container'),heroInner=rect('.hero-inner'),headerPadding=parseFloat(getComputedStyle(document.querySelector('.site-header')).paddingLeft),logo=rect('.logo-abstract'),links=rect('.desktop-nav'),linkedin=rect('.navbar-linkedin'),cta=rect('.header-cta'),menu=rect('.mobile-menu'),hero=rect('.hero-main'),title=rect('.hero h1');
      const visibleHeader=[logo,links,linkedin,cta,menu].filter(r=>r&&r.visible);
      const overlap=visibleHeader.some((r,i)=>visibleHeader.slice(i+1).some(other=>r.right>other.left+2 && other.right>r.left+2 && r.bottom>other.top+2 && other.bottom>r.top+2));
      return {heroSection:rect('#home'),innerWidth:window.innerWidth,scrollWidth:document.documentElement.scrollWidth,header,headerPadding,content,heroInner,logo,links,linkedin,cta,menu,hero,title,overlap,chat:!!document.querySelector('.mm-chat-toggle'),images:[...document.querySelectorAll('img')].filter(el=>!el.complete).length};
    });
    const failed=[];
    if(state.scrollWidth>state.innerWidth+2)failed.push('horizontal overflow '+(state.scrollWidth-state.innerWidth)+'px');
    if(state.overlap)failed.push('header controls overlap');
    if(device.width>=1600 && (Math.abs(state.headerPadding-state.content.left)>2 || Math.abs(state.heroInner.left-state.content.left)>2)) failed.push('header / hero not aligned to content container');
    if(state.title?.left < -1||state.title?.right > device.width+1)failed.push('hero title outside screen');
    if(device.width<=760 && state.title.top < state.header.bottom) failed.push('hero title overlaps mobile header');
    if(device.width<=760 && state.heroSection.bottom-state.hero.bottom > 60) failed.push('excess space below mobile hero CTA');
    if(!state.chat)failed.push('chat button missing');
    if(errors.length)failed.push('JS exceptions: '+errors.slice(0,2).join('; '));
    try {
      const button=page.locator('#menuBtn');
      if(device.width<=980){
        await button.click({timeout:6000});
        if(await page.locator('#mobileNav').getAttribute('class')!=='mobile-nav open') failed.push('menu did not open');
        await page.locator('#mobileNav a[href="#expertise"]').click({timeout:6000});
        if((await page.locator('#mobileNav').getAttribute('class')).includes('open')) failed.push('menu did not close');
      }
      await page.locator('.mm-chat-toggle').click({timeout:6000});
      const chat=await page.locator('.mm-chat-panel').boundingBox();
      if(!chat)failed.push('chat did not open');
      else if(chat.x < -2||chat.x+chat.width > device.width+2||chat.y < -3||chat.y+chat.height > device.height+3) failed.push('chat outside viewport');
      await page.locator('.mm-chat-close').click({timeout:6000});
    }catch(e){failed.push('interactive control: '+e.message.slice(0,130))}
    await page.goto(BASE,{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(450);
    await page.screenshot({path:path.join('responsive-screenshots',device.name+'.png'),fullPage:false,animations:'disabled'});
    console.log(JSON.stringify({device:device.name,viewport:device.width+'x'+device.height,scrollWidth:state.scrollWidth,headerOverlap:state.overlap,heroTop:state.hero?.top,problems:failed}));
    if(failed.length) problems.push({device:device.name,problems:failed});
    await context.close();
  }
  await browser.close();
  if(problems.length){console.error('RESPONSIVE ISSUES '+JSON.stringify(problems));process.exitCode=1}
  else console.log('PASS: all '+widths.length+' viewport tests');
})().catch(e=>{console.error(e);process.exitCode=1});
