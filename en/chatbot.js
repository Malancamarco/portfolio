/* Static portfolio assistant: operates locally. No API keys, storage or network requests. */
(() => {
  'use strict';
  const root = document.createElement('aside');
  root.className = 'mm-chat-root';
  root.setAttribute('aria-label', 'Portfolio assistant');
  root.innerHTML = `
    <section class="mm-chat-panel" id="mm-chat-panel" role="dialog" aria-label="Marco Malanca portfolio assistant" hidden>
      <div class="mm-chat-top">
        <div class="mm-chat-brand">
          <span class="mm-chat-avatar" aria-hidden="true"><svg class="mm-chat-brandmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 84" aria-hidden="true" focusable="false"><path fill="#FFFFFF" d="M0 60 8 54 7 19 9 17 32 35 63 10 63 0 32 25 0 0Z"/><path fill="#FFFFFF" d="M63 23 56 28 54 66 32 48 0 73 0 83 32 58 63 83Z"/></svg></span>
          <div class="mm-chat-headline"><strong>Marco's assistant</strong><span>Professional profile information</span></div>
        </div>
        <button class="mm-chat-close" type="button" aria-label="Close assistant">×</button>
      </div>
      <div class="mm-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="mm-chat-chips" aria-label="Suggested questions"></div>
      <form class="mm-chat-form">
        <input class="mm-chat-input" type="text" maxlength="250" aria-label="Type a question" autocomplete="off" placeholder="Ask me about my professional background…" required>
        <button class="mm-chat-send" type="submit" aria-label="Send message"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></button>
      </form>
      <p class="mm-chat-disclaimer">Predefined answers based on this portfolio. No external AI or message sharing.</p>
    </section>
    <button class="mm-chat-toggle" type="button" aria-expanded="false" aria-controls="mm-chat-panel" aria-label="Open Marco's assistant">
      <span class="mm-chat-toggle-icon" aria-hidden="true"><svg class="mm-chat-brandmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 84" aria-hidden="true" focusable="false"><path fill="#FFFFFF" d="M0 60 8 54 7 19 9 17 32 35 63 10 63 0 32 25 0 0Z"/><path fill="#FFFFFF" d="M63 23 56 28 54 66 32 48 0 73 0 83 32 58 63 83Z"/></svg></span><span class="mm-chat-toggle-label">Have a question?</span>
    </button>`;
  document.body.appendChild(root);
  const toggle = root.querySelector('.mm-chat-toggle');
  const panel = root.querySelector('.mm-chat-panel');
  const close = root.querySelector('.mm-chat-close');
  const messages = root.querySelector('.mm-chat-messages');
  const chips = root.querySelector('.mm-chat-chips');
  const form = root.querySelector('.mm-chat-form');
  const input = root.querySelector('.mm-chat-input');
  const normalize = str => str.toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+#]+/g,' ').trim();
  const has = (t, terms) => terms.some(x => t.includes(x));

  const topics = [
    {
      label:'Experience',
      keys:['experience','career','work','jobs','company','day1','sevenia','wdigital','w r digital','employment'],
      answer:"I've worked as an IT Specialist at DAY1 Business Development since 2024, combining IT support, digital content and AI tools. Previously, I worked on WordPress, SEO and newsletters at W[r]Digital and on web development at Sevenia Tech."
    },
    {
      label:'IT skills',
      keys:['it support','technical','computer','system','hardware','windows','software','help desk','account','network','linux','vpn','it specialist'],
      answer:"I provide end-user technical support, configure and maintain Windows software, manage accounts and permissions, and troubleshoot operational issues. My tools include Windows 10/11, Linux, VPN and AnyDesk."
    },
    {
      label:'AI & tools',
      keys:['artificial intelligence',' ai ','openai','chatgpt','gemini','claude','copilot','heygen','prompt','automation','workflow','agent','manus','notebooklm','api'],
      answer:"I use artificial intelligence to create digital materials and streamline workflows. I'm familiar with ChatGPT, Claude, Gemini, Copilot, Perplexity, Manus, NotebookLM, HeyGen, Adobe Firefly and Google AI Studio."
    },
    {
      label:'Web development',
      keys:['web development','development','programming','javascript','node','php','html','css','wordpress','frontend','front end','github','bootstrap','tailwind','website','coding'],
      answer:"I have experience developing and maintaining websites and web applications using HTML, CSS, JavaScript, PHP, Node.js, WordPress, Visual Studio Code, GitHub, Bootstrap and Tailwind CSS. I also worked in this area at Sevenia Tech."
    },
    {
      label:'Marketing & design',
      keys:['marketing','dem','amazon','graphic','design','video','adobe','photoshop','illustrator','canva','seo','newsletter','mailchimp','brevo','e commerce','presentation','communication'],
      answer:"I also work in digital communications, producing email marketing campaigns, Amazon A+ content, graphics, videos, presentations and SEO-oriented articles. I use Adobe Photoshop, Illustrator, InDesign, Lightroom, Acrobat, Canva, Figma, Mailchimp, Brevo and Amazon Seller Central."
    },
    {
      label:'Education',
      keys:['education','study','studies','diploma','certificate','aulab','ecampus','course','training','university','school','language','english','french'],
      answer:"My education includes Conversation & Prompt Design (Aulab, 2025), Digital Graphic Design & Communication (eCampus, 2023–2024), a Full Stack Coding Bootcamp (Aulab, 2022) and a high school diploma from Liceo Clemente Rebora. I speak Italian (native), English (B1) and French (B1)."
    },
    {
      label:'Contact',
      keys:['contact','email','mail','linkedin','reach','interview','recruit','hire','opportunity','opportunities'],
      answer:"For professional opportunities, you can reach me by email or on LinkedIn.",
      links:[['Send me an email','mailto:malancamarco3@gmail.com'],['My LinkedIn','https://www.linkedin.com/in/marcomalanca']]
    }
  ];
  const suggestions = ['Experience','IT skills','AI & tools','Web development','Education','Contact'];
  function appendMessage(text, who, links=[]) {
    const bubble=document.createElement('div');
    bubble.className='mm-chat-bubble mm-chat-bubble--'+who;
    bubble.textContent=text;
    links.forEach(([label,url])=>{
      const line=document.createElement('div');
      const a=document.createElement('a');
      a.href=url;a.textContent=label;
      if(url.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}
      line.appendChild(a);bubble.appendChild(line);
    });
    messages.appendChild(bubble);
    messages.scrollTop=messages.scrollHeight;
  }
  function answer(question) {
    const t=' '+normalize(question)+' ';
    if(has(t,[' hi ',' hello ',' hey ',' good morning ',' good afternoon ',' good evening ']))
      return {answer:"Hello! I can tell you about my skills, professional experience and education. Choose a topic or ask me a question."};
    if(has(t,[' who are you ',' what are you ',' chatbot ',' are you ai ',' are you human ',' are you a bot ']))
      return {answer:"I'm the virtual assistant for Marco's portfolio. I provide predefined answers in the first person, but I'm not Marco, I don't use generative AI and I don't share your messages with external services."};
    const scores=topics.map(topic=>topic.keys.reduce((n,key)=>n+(t.includes(key)?key.length:0),0));
    const index=scores.indexOf(Math.max(...scores));
    if(scores[index]>0)return topics[index];
    return {answer:"I can tell you about my professional experience, IT skills, AI work, web development and education. For anything else, feel free to contact me directly by email.",links:[['Email me','mailto:malancamarco3@gmail.com']]};
  }
  function handleQuestion(question) {
    const q=question.trim().slice(0,250);
    if(!q)return;
    appendMessage(q,'user');
    const response=answer(q);
    appendMessage(response.answer,'bot',response.links||[]);
  }
  suggestions.forEach(label=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='mm-chat-chip';
    button.textContent=label;
    button.addEventListener('click',()=>handleQuestion(label));
    chips.appendChild(button);
  });
  appendMessage('Hello! Welcome to my portfolio. You can explore my skills, experience and education. Where would you like to start?','bot');
  const mobileChat=window.matchMedia('(max-width: 600px)');
  function syncVisualViewport(){
    if(!mobileChat.matches||panel.hidden)return;
    const viewport=window.visualViewport;
    root.style.setProperty('--mm-chat-viewport-height',(viewport?viewport.height:window.innerHeight)+'px');
    root.style.setProperty('--mm-chat-viewport-top',(viewport?viewport.offsetTop:0)+'px');
  }
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',syncVisualViewport,{passive:true});
    window.visualViewport.addEventListener('scroll',syncVisualViewport,{passive:true});
  }
  window.addEventListener('resize',syncVisualViewport,{passive:true});
  function setOpen(open) {
    if(!open&&root.contains(document.activeElement))document.activeElement.blur();
    panel.hidden=!open;
    root.classList.toggle('chat-open',open);
    panel.setAttribute('aria-modal',String(open));
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?"Close Marco's assistant":"Open Marco's assistant");
    if(open){
      syncVisualViewport();
      // Focusing the close control avoids opening the keyboard on phones.
      if(mobileChat.matches)close.focus({preventScroll:true});
      else input.focus({preventScroll:true});
    }else{
      root.style.removeProperty('--mm-chat-viewport-height');
      root.style.removeProperty('--mm-chat-viewport-top');
      toggle.focus({preventScroll:true});
    }
  }
  toggle.addEventListener('click',()=>setOpen(panel.hidden));
  close.addEventListener('click',()=>setOpen(false));
  document.addEventListener('keydown',event=>{
    if(panel.hidden)return;
    if(event.key==='Escape'){
      event.preventDefault();
      setOpen(false);
      return;
    }
    if(event.key==='Tab'){
      const controls=Array.from(panel.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]'));
      const first=controls[0],last=controls[controls.length-1];
      if(!first)return;
      if(event.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){
        event.preventDefault();
        last.focus({preventScroll:true});
      }else if(!event.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){
        event.preventDefault();
        first.focus({preventScroll:true});
      }
    }
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const q=input.value;
    input.value='';
    handleQuestion(q);
    input.focus({preventScroll:true});
  });
})();
