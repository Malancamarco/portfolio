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
          <span class="mm-chat-avatar" aria-hidden="true">M<b>M</b></span>
          <div class="mm-chat-headline"><strong>Assistente di Marco</strong><span>Informazioni sul profilo professionale</span></div>
        </div>
        <button class="mm-chat-close" type="button" aria-label="Chiudi assistente">×</button>
      </div>
      <div class="mm-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="mm-chat-chips" aria-label="Domande suggerite"></div>
      <form class="mm-chat-form">
        <input class="mm-chat-input" type="text" maxlength="250" aria-label="Scrivi una domanda" autocomplete="off" placeholder="Chiedimi qualcosa su Marco…" required>
        <button class="mm-chat-send" type="submit" aria-label="Invia domanda">↗</button>
      </form>
      <p class="mm-chat-disclaimer">Risposte preimpostate, basate sul portfolio. Nessuna AI esterna o invio di dati.</p>
    </section>
    <button class="mm-chat-toggle" type="button" aria-expanded="false" aria-controls="mm-chat-panel" aria-label="Apri assistente di Marco">
      <span class="mm-chat-toggle-icon" aria-hidden="true">MM</span><span class="mm-chat-toggle-label">Hai una domanda?</span>
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
      answer:'Marco lavora dal 2024 presso DAY1 Business Development come IT Specialist, occupandosi di supporto informatico, contenuti digitali e strumenti AI. In precedenza ha lavorato in W[r]Digital su WordPress, SEO e newsletter e in Sevenia Tech sullo sviluppo web.'
    },
    {
      label:'Competenze IT',
      keys:['supporto','informat','sistem','hardware','windows','software','help desk','account','rete','linux','vpn','it specialist'],
      answer:'Le principali attività IT di Marco comprendono assistenza agli utenti, configurazione e manutenzione di software Windows, gestione di account e permessi e risoluzione dei problemi operativi. Tra gli strumenti confermati: Windows 10/11, Linux, VPN e AnyDesk.'
    },
    {
      label:'AI e strumenti',
      keys:['intelligenza artificiale',' ai ','openai','chatgpt','gemini','claude','copilot','heygen','prompt','automaz','workflow','agent','manus','notebooklm','api'],
      answer:'Marco applica l’intelligenza artificiale alla produzione di materiali digitali e all’ottimizzazione dei processi. Utilizza ChatGPT/OpenAI, Claude, Gemini, Copilot, Perplexity, Manus, NotebookLM, HeyGen, Adobe Firefly e Google AI Studio. Ha indicato anche esperienza con OpenAI API.'
    },
    {
      label:'Sviluppo web',
      keys:['svilupp','programmaz','javascript','node','php','html','css','wordpress','frontend','front end','github','bootstrap','tailwind','sito web','codice'],
      answer:'Marco ha esperienza nello sviluppo e aggiornamento di siti e applicazioni web. Utilizza HTML, CSS, JavaScript, PHP, Node.js, WordPress, Visual Studio Code, GitHub, Bootstrap e Tailwind CSS. Ha lavorato nello sviluppo web presso Sevenia Tech.'
    },
    {
      label:'Marketing e design',
      keys:['marketing','dem','amazon','grafica','grafich','design','video','adobe','photoshop','illustrator','canva','seo','newsletter','mailchimp','brevo','e commerce','presentaz','comunicaz'],
      answer:'Le competenze digitali di Marco comprendono campagne DEM, contenuti Amazon A+, materiali grafici, video, presentazioni e articoli SEO. Tra gli strumenti: Adobe Photoshop, Illustrator, InDesign, Lightroom, Acrobat, Canva, Figma, Mailchimp, Brevo e Amazon Seller Central.'
    },
    {
      label:'Formazione',
      keys:['formaz','studi','diploma','certificat','aulab','ecampus','corso','istruz','universit','scuola','lingu','inglese','francese'],
      answer:'Il percorso di Marco comprende Conversation & Prompt Design (Aulab, 2025), Digital Graphic Design & Communication (eCampus, 2023–2024), Coding Bootcamp Full Stack (Aulab, 2022) e un diploma al Liceo Clemente Rebora. Lingue: italiano madrelingua, inglese B1 e francese B1.'
    },
    {
      label:'Contatti',
      keys:['contatt','email','mail','linkedin','scriv','raggiung','colloquio','candid','assum','opportunit','recapito'],
      answer:'Per opportunità professionali puoi contattare Marco direttamente via email o tramite LinkedIn.',
      links:[['Scrivi una email','mailto:malancamarco3@gmail.com'],['Profilo LinkedIn','https://www.linkedin.com/in/marcomalanca']]
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
      return {answer:'Ciao! Posso raccontarti le competenze, le esperienze e la formazione di Marco, oppure indicarti come contattarlo. Scegli un argomento o scrivi una domanda.'};
    if(has(t,[' chi sei ',' cosa sei ',' chatbot ',' sei un ai ',' sei ai ',' sei umano ']))
      return {answer:'Sono un assistente informativo con risposte preimpostate sul portfolio di Marco. Non sono una AI generativa e non invio i tuoi messaggi a servizi esterni.'};
    const scores=topics.map(topic=>topic.keys.reduce((n,key)=>n+(t.includes(key)?key.length:0),0));
    const index=scores.indexOf(Math.max(...scores));
    if(scores[index]>0)return topics[index];
    return {answer:'Posso aiutarti con esperienze professionali, competenze IT, intelligenza artificiale, sviluppo web, formazione e contatti. Per altre informazioni puoi scrivere direttamente a Marco.',links:[['Contatta Marco','mailto:malancamarco3@gmail.com']]};
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
  appendMessage('Ciao! Sono l’assistente del portfolio di Marco. Posso aiutarti a conoscere le sue competenze, esperienze e formazione. Da cosa vuoi iniziare?','bot');
  function setOpen(open) {
    panel.hidden=!open;
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Chiudi assistente di Marco':'Apri assistente di Marco');
    if(open)input.focus({preventScroll:true});
    else toggle.focus({preventScroll:true});
  }
  toggle.addEventListener('click',()=>setOpen(panel.hidden));
  close.addEventListener('click',()=>setOpen(false));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!panel.hidden)setOpen(false);
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const q=input.value;
    input.value='';
    handleQuestion(q);
    input.focus({preventScroll:true});
  });
})();
