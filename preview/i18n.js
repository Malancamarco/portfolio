/* Single-page IT/EN portfolio: translated content without a second HTML page. */
(()=>{
  'use strict';
  const translations=["Skip to main content","Skills","Experience","Tools","Education","IT","/","EN","Contact me ","↗","Skills","Experience","Tools","Education","Contact","IT","/","EN","LinkedIn","PROFESSIONAL PORTFOLIO — 2026","IT. AI.","DIGITAL.","IT Specialist experienced in technical support, web development and AI. I combine technical and digital skills to improve workflows and deliver communications projects.","Explore my skills ","Discover my profile ","TECH / AUTOMATION / DIGITAL","01 / SKILLS","AREAS OF EXPERTISE","PRACTICAL","SKILLS.","Skills in IT support, web development, artificial intelligence and digital marketing, applied to day-to-day business needs.","01 / IT","IT Support & Systems","End-user support, Windows and macOS software setup, account and permissions management, and operational troubleshooting.","02 / ARTIFICIAL INTELLIGENCE","AI & Automation","Using generative AI to create digital content, develop automations and streamline business workflows.","03 / DEVELOPMENT","Web Development","Developing and maintaining websites and web applications with a focus on functionality, user experience and cross-device compatibility.","04 / MARKETING & COMMUNICATIONS","Marketing & Digital Communication","Creating email campaigns, graphics, videos, presentations, e-commerce content and SEO-optimized copy.","02 / EXPERIENCE","CAREER PATH","CROSS-FUNCTIONAL","EXPERIENCE.","Experience across IT, web development and digital communications, with growing use of AI and automation in business processes.","2024 — PRESENT","DAY1 Business Development","IT Specialist","IT support and production of email campaigns, graphics, videos and digital materials for the pharmaceutical sector. Using AI and automation to improve workflows.","APR — JUN 2024","W[r]Digital","Web & Digital Marketing","Managing websites, writing SEO content and producing newsletters and graphics for digital communications.","FEB — SEP 2023","Sevenia Tech","Web Developer","Developing and maintaining websites and web applications, including interface updates, new features and technical troubleshooting.","03 / TECHNOLOGIES","PROFESSIONAL TOOLS","TECHNOLOGIES","& TOOLS.","Professional tools for IT support, web development, AI and digital communications, applied to daily tasks and business workflows.","01 / TECHNOLOGIES","Artificial intelligence","ChatGPT","Claude","Google Gemini","Microsoft Copilot","Perplexity","Manus","NotebookLM","HeyGen","Adobe Firefly","Google AI Studio","Lumen5","02 / TECHNOLOGIES","Web development & programming","HTML","CSS","JavaScript","PHP","Node.js","WordPress","Visual Studio Code","GitHub","Bootstrap","Tailwind CSS","03 / TECHNOLOGIES","IT & computer systems","Windows 10 / 11","Microsoft Teams","AnyDesk","VPN","Linux","04 / TECHNOLOGIES","Digital marketing & e-commerce","Amazon Seller Central","Amazon A+ Content","Mailchimp","Brevo","05 / TECHNOLOGIES","Graphic design, video & creative tools","Adobe Photoshop","Adobe Illustrator","Adobe InDesign","Adobe Lightroom","Adobe Acrobat","Canva","Figma","06 / TECHNOLOGIES","Productivity & collaboration","Microsoft Excel","Microsoft Word","Microsoft PowerPoint","Microsoft Outlook","Google Sheets","Google Docs","Google Drive","04 / EDUCATION","TRAINING & CERTIFICATIONS","SPECIALIST","TRAINING.","2025","Conversation & Prompt Design","Aulab · Professional certificate","2023 — 2024","Digital Graphic Design & Communication","eCampus · Post-secondary training","2022","Coding Bootcamp Full Stack","Aulab · Web development","2017 — 2022","Social Sciences & Economics High School Diploma","Liceo Clemente Rebora · Rho","LANGUAGES","ITALIAN / NATIVE","ENGLISH / B1","FRENCH / B1","05 / CONTACT","CAREER OPPORTUNITIES","LET'S CREATE","NEW OPPORTUNITIES.","I'm open to new opportunities in IT, artificial intelligence and digital roles. I bring technical expertise, hands-on experience and a problem-solving mindset.","Contact me by email ","LinkedIn","malancamarco3@gmail.com","© ","2026"," MARCO MALANCA"];
  const params=new URLSearchParams(location.search);
  const lang=params.get('lang')==='en'?'en':'it';
  const textWalker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(textWalker.nextNode()){
    const node=textWalker.currentNode;
    if(node.textContent.trim())nodes.push(node);
  }
  // A structural mismatch should never break the Italian content or chatbot.
  if(lang==='en' && nodes.length===translations.length){
    nodes.forEach((node,i)=>{node.textContent=translations[i]});
    document.documentElement.lang='en';
    document.title='Marco Malanca | IT Specialist · AI · Digital';
    document.querySelector('meta[name="description"]')?.setAttribute('content','Marco Malanca, IT Specialist with experience in technical support, web development, AI and digital communications.');
    document.querySelector('meta[property="og:description"]')?.setAttribute('content','An IT Specialist bringing together technical support, web development, AI and digital communications.');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content','https://malancamarco.github.io/portfolio/?lang=en');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://malancamarco.github.io/portfolio/?lang=en');
    const aria={
      'Navigazione principale':'Main navigation','Navigazione mobile':'Mobile navigation',
      'Vai al contenuto principale':'Skip to main content',
      'Marco Malanca, torna all\'inizio':'Marco Malanca, back to top',
      'Apri menu':'Open menu','Profilo LinkedIn di Marco Malanca':"Marco Malanca's LinkedIn profile",
      'Profilo LinkedIn di Marco Malanca (si apre in una nuova scheda)':"Marco Malanca's LinkedIn profile (opens in a new tab)",
      'Scrivi a Marco Malanca':'Email Marco Malanca','Lingua':'Language'
    };
    document.querySelectorAll('[aria-label]').forEach(el=>{
      const original=el.getAttribute('aria-label');
      if(Object.hasOwn(aria,original))el.setAttribute('aria-label',aria[original]);
    });
  }
  document.querySelectorAll('.language-switch a,.mobile-language-switch a').forEach(a=>{
    const selected=a.getAttribute('lang')===lang;
    if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  // Keep the existing, local rule-based chatbot with the matching interface language.
  const script=document.createElement('script');
  script.src=lang==='en'?'en/chatbot.js?v=single-page-i18n-v1':'preview/chatbot.js?v=brandmark-v1';
  script.defer=true;
  document.body.appendChild(script);
})();
