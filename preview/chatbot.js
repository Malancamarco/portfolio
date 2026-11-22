/* Static portfolio assistant: operates locally. No API keys, storage or network requests. */
(() => {
  'use strict';
  const root = document.createElement('aside');
  root.className = 'mm-chat-root';
  root.setAttribute('aria-label', 'Assistente del portfolio');
  root.innerHTML = `
    <section class="mm-chat-panel" id="mm-chat-panel" role="dialog" aria-label="Assistente del portfolio di Marco Malanca" hidden>
      <div class="mm-chat-top">
        <div class="mm-chat-brand">
          <span class="mm-chat-avatar" aria-hidden="true"><svg class="mm-chat-brandmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4H9m3 0h3M3 13H1m22 0h-2"/><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/></svg></span>
          <div class="mm-chat-headline"><strong>Assistente di Marco</strong><span>Informazioni sul profilo professionale</span></div>
        </div>
        <button class="mm-chat-close" type="button" aria-label="Chiudi assistente">×</button>
      </div>
      <div class="mm-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="mm-chat-chips" aria-label="Domande suggerite"></div>
      <form class="mm-chat-form">
        <input class="mm-chat-input" type="text" maxlength="250" aria-label="Scrivi una domanda" autocomplete="off" placeholder="Chiedimi qualcosa sul mio profilo…" required>
        <button class="mm-chat-send" type="submit" aria-label="Invia messaggio"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></button>
      </form>
      
    </section>
    <button class="mm-chat-toggle" type="button" aria-expanded="false" aria-controls="mm-chat-panel" aria-label="Apri assistente di Marco">
      <span class="mm-chat-toggle-icon" aria-hidden="true"><svg class="mm-chat-brandmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4H9m3 0h3M3 13H1m22 0h-2"/><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/></svg></span><span class="mm-chat-toggle-label">Ti serve aiuto?</span>
    </button>`;
  document.body.appendChild(root);
  const toggle = root.querySelector('.mm-chat-toggle');
  const panel = root.querySelector('.mm-chat-panel');
  const close = root.querySelector('.mm-chat-close');
  const messages = root.querySelector('.mm-chat-messages');
  const chips = root.querySelector('.mm-chat-chips');
  const form = root.querySelector('.mm-chat-form');
  const input = root.querySelector('.mm-chat-input');
  const normalize = str => str.toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+#]+/g,' ').trim();
  const has = (t, terms) => terms.some(x => t.includes(x));

  const topics = [
    {
      label:'Esperienze',
      keys:['esperienz','lavor','azienda','day1','sevenia','wdigital','w r digital','carriera','occupaz'],
      answer:'Dal 2024 a oggi lavoro presso DAY1 Business Development come IT Specialist: mi occupo di supporto IT, campagne email, contenuti digitali per il settore farmaceutico e automazioni AI. Ho lavorato in W[r]Digital (2024–2024) su siti web, SEO, newsletter e materiali grafici, e in Sevenia Tech (2023–2024) nello sviluppo e nella manutenzione di siti e applicazioni web.'
    },
    {
      label:'Competenze IT',
      keys:['supporto','informat','sistem','hardware','windows','software','help desk','account','rete','linux','vpn','it specialist'],
      answer:'Mi occupo di assistenza agli utenti, configurazione di software Windows e macOS, gestione di account e permessi e risoluzione dei problemi operativi. Tra gli strumenti indicati nel portfolio ci sono Windows 10/11, Linux, VPN e AnyDesk.'
    },
    {
      label:'AI e strumenti',
      keys:['intelligenza artificiale',' ai ','openai','chatgpt','gemini','claude','copilot','heygen','prompt','automaz','workflow','agent','manus','notebooklm','api'],
      answer:"Utilizzo l'AI generativa per creare contenuti digitali, sviluppare automazioni e ottimizzare i flussi di lavoro. Tra gli strumenti presenti nel portfolio: ChatGPT, Claude, Google Gemini, Microsoft Copilot, Perplexity, Manus, NotebookLM, HeyGen, Adobe Firefly, Google AI Studio e Lumen5."
    },
    {
      label:'Sviluppo web',
      keys:['svilupp','programmaz','javascript','node','php','html','css','wordpress','frontend','front end','github','bootstrap','tailwind','sito web','codice'],
      answer:'Mi occupo di sviluppo e manutenzione di siti e applicazioni web, con attenzione a funzionalità, esperienza utente e compatibilità tra dispositivi. Tra le tecnologie del portfolio: HTML, CSS, JavaScript, PHP, Node.js, WordPress, GitHub, Visual Studio Code, Bootstrap e Tailwind CSS. Ho svolto attività di sviluppo web presso Sevenia Tech (2023–2024).'
    },
    {
      label:'Marketing e design',
      keys:['marketing','dem','amazon','grafica','grafich','design','video','adobe','photoshop','illustrator','canva','seo','newsletter','mailchimp','brevo','e commerce','presentaz','comunicaz'],
      answer:"Realizzo campagne email, contenuti grafici e video, presentazioni, materiali per l'e-commerce e testi ottimizzati SEO. Nel portfolio figurano Amazon Seller Central e A+ Content, Mailchimp, Brevo, Adobe Photoshop, Illustrator, InDesign, Lightroom, Acrobat, Canva e Figma."
    },
    {
      label:'Formazione',
      keys:['formaz','studi','diploma','certificat','aulab','ecampus','corso','istruz','universit','scuola','lingu','inglese','francese'],
      answer:'Il mio percorso comprende Conversation & Prompt Design (Aulab, 2025), Digital Graphic Design & Communication (eCampus, 2023–2024), Coding Bootcamp Full Stack (Aulab, 2022) e il Diploma Economico Sociale (Liceo Clemente Rebora, 2017–2022). Lingue: italiano madrelingua, inglese B1 e francese B1.'
    },
    {
      label:'Contatti',
      keys:['contatt','email','mail','linkedin','scriv','raggiung','colloquio','candid','assum','opportunit','recapito'],
      answer:'Valuto opportunità professionali in ambito IT, intelligenza artificiale e digital. Puoi contattarmi tramite email o LinkedIn.',
      links:[['Scrivimi una email','mailto:malancamarco3@gmail.com'],['Il mio LinkedIn','https://www.linkedin.com/in/marcomalanca']]
    }
  ];
  const suggestions = ['Esperienze','Competenze IT','AI e strumenti','Sviluppo web','Formazione','Contatti'];
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
    if(has(t,[' ciao ',' salve ',' buongiorno ',' buonasera ',' hello ',' hey ']))
      return {answer:'Ciao! Posso raccontarti le mie competenze, le esperienze professionali e il mio percorso formativo. Scegli un argomento o scrivimi una domanda.'};
    if(has(t,[' chi sei ',' cosa sei ',' chatbot ',' sei un ai ',' sei ai ',' sei umano ']))
      return {answer:"Sono l'assistente virtuale del portfolio di Marco. Rispondo alle domande sul suo profilo utilizzando informazioni preimpostate del sito; non sono Marco e non utilizzo un servizio di AI generativa."};
    const scores=topics.map(topic=>topic.keys.reduce((n,key)=>n+(t.includes(key)?key.length:0),0));
    const index=scores.indexOf(Math.max(...scores));
    if(scores[index]>0)return topics[index];
    return {answer:'Posso raccontarti le mie esperienze professionali, le competenze IT, il mio lavoro con l’intelligenza artificiale, lo sviluppo web e la formazione. Se hai altre domande, puoi contattarmi direttamente via email.',links:[['Scrivimi','mailto:malancamarco3@gmail.com']]};
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
  appendMessage('Ciao! Posso aiutarti a conoscere le competenze, le esperienze e la formazione di Marco Malanca. Da quale argomento vuoi iniziare?','bot');
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
    toggle.setAttribute('aria-label',open?'Chiudi assistente di Marco':'Apri assistente di Marco');
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
