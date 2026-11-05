'use strict';
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const header = $('#header');
const toTop = $('#toTop');
const toggle = $('#navToggle');
const nav = $('#navLinks');

function onScroll(){
  header.classList.toggle('scrolled', window.scrollY > 24);
  toTop.classList.toggle('visible', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

function closeMenu(){
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-label','Åpne meny');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}
toggle.addEventListener('click',()=>{
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded',String(!open));
  toggle.setAttribute('aria-label',open?'Åpne meny':'Lukk meny');
  nav.classList.toggle('open',!open);
  document.body.classList.toggle('menu-open',!open);
});
$$('#navLinks a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* =========================================
   1. HOVEDQUIZ (KI-RADAR)
   ========================================= */
const questions = [
 {q:'Hva betyr KI?',a:['Kunstig intelligens','Kunnskap på internett','Kommunikasjon og informasjon'],correct:0,why:'KI står for kunstig intelligens — teknologi som kan løse oppgaver vi ofte forbinder med menneskelig intelligens.'},
 {q:'Hva er en deepfake?',a:['En dyp samtale','Syntetisk video eller lyd som etterligner noen','En type passord'],correct:1,why:'Deepfakes bruker teknologi til å lage eller endre video og lyd slik at det kan virke ekte.'},
 {q:'Kan KI gi feil informasjon selv om svaret høres sikkert ut?',a:['Nei, aldri','Bare hvis du spør på engelsk','Ja, det kan skje'],correct:2,why:'KI kan finne på opplysninger. Sjekk viktige svar mot pålitelige kilder.'},
 {q:'Hva er lurt å gjøre før du deler en sjokkerende video?',a:['Sjekke kilden og lete etter bekreftelse','Dele den raskt','Stole på antall likes'],correct:0,why:'Sjekk hvem som publiserte innholdet, og om andre troverdige kilder bekrefter det.'},
 {q:'Hva kan KI være nyttig til på skolen?',a:['Å gjøre all læring unødvendig','Å forklare et vanskelig tema på en ny måte','Å garantere toppkarakter'],correct:1,why:'KI kan være en læringspartner, men du må fortsatt forstå og vurdere svaret selv.'},
 {q:'Hva bør du unngå å dele med en KI-tjeneste?',a:['Et generelt spørsmål om matte','Personlige eller sensitive opplysninger','Et spørsmål om grammatikk'],correct:1,why:'Tenk over personvern før du deler informasjon om deg selv eller andre.'},
 {q:'Hvem har ansvar for å vurdere om et KI-svar kan brukes?',a:['Brukeren må vurdere det kritisk','KI har alltid ansvaret','Ingen'],correct:0,why:'KI er et verktøy. Du må sjekke kvaliteten og følge reglene som gjelder.'},
 {q:'Hva er hovedrådet fra KI-Ishiki?',a:['Aldri bruk KI','Stol på alt KI sier','Bruk KI som verktøy — men tenk selv'],correct:2,why:'Bruk teknologien når den hjelper, men behold din egen kritiske sans.'}
];
const Quiz = {
 index:0, score:0, answered:false,
 startButton:$('#startKnapp'), start:$('#quizStart'), game:$('#quizBoks'), result:$('#quizResultat'),
 counter:$('#spørsmålTeller'), scoreLabel:$('#poengTeller'), bar:$('#quizBarFyll'),
 question:$('#spørsmålTekst'), answers:$('#svarBoks'), feedback:$('#feedback'), next:$('#nesteKnapp'),
 init(){this.startButton.addEventListener('click',()=>this.begin());this.next.addEventListener('click',()=>this.advance());},
 begin(){this.index=0;this.score=0;this.start.classList.add('hidden');this.result.classList.add('hidden');this.game.classList.remove('hidden');this.render();},
 render(){
  this.answered=false;const q=questions[this.index];
  this.counter.textContent=`Spørsmål ${this.index+1} av ${questions.length}`;
  this.scoreLabel.textContent=`${this.score} poeng`;
  this.bar.style.width=`${this.index/questions.length*100}%`;
  this.question.textContent=q.q;this.feedback.textContent='';
  this.next.disabled=true;this.next.textContent=this.index===questions.length-1?'Se resultat →':'Neste →';
  this.answers.replaceChildren();
  q.a.forEach((answer,i)=>{const b=document.createElement('button');b.type='button';b.textContent=answer;b.addEventListener('click',()=>this.choose(i,b));this.answers.appendChild(b)});
 },
 choose(index,button){
  if(this.answered)return;this.answered=true;
  const q=questions[this.index];const buttons=$$('button',this.answers);
  buttons.forEach(b=>b.disabled=true);
  if(index===q.correct){this.score++;button.classList.add('correct');this.feedback.textContent='✓ Riktig! '+q.why}
  else{button.classList.add('wrong');buttons[q.correct].classList.add('correct');this.feedback.textContent='Ikke helt! '+q.why}
  this.scoreLabel.textContent=`${this.score} poeng`;this.next.disabled=false;
 },
 advance(){this.index++;if(this.index>=questions.length){this.finish();return}this.render()},
 finish(){
  this.game.classList.add('hidden');this.result.classList.remove('hidden');this.bar.style.width='100%';
  const pct=Math.round(this.score/questions.length*100);
  let title='Nysgjerrig på KI 👀',text='Du har startet — fortsett å stille spørsmål og sjekk kildene.';
  if(pct>=88){title='KI-radar: skarp! 🧠';text='Du har god oversikt. Bruk kunnskapen til å hjelpe andre å tenke kritisk.'}
  else if(pct>=63){title='Bevisst bruker ✳';text='Solid! Du har kontroll på mye, men det er alltid mer å lære.'}
  else if(pct>=38){title='På vei 🚀';text='Du har fått med deg det viktigste. Ta en runde til og se om du kan slå poengsummen.'}
  this.result.innerHTML=`<span class="mini-label">RESULTATET DITT</span><h3>${title}</h3><div class="score-big">${this.score}/${questions.length}</div><p>${text}</p><button class="btn btn-lime full" id="restartKnapp">Prøv igjen ↻</button>`;
  $('#restartKnapp').addEventListener('click',()=>this.begin());
 }
};
Quiz.init();

/* =========================================
   2. MINI-GAME: EKTE ELLER KI?
   ========================================= */
const gameData = [
  { text: "«Jeg er spesielt bekymret for bruken av AI blant svært små barn. De trenger å lære å lese og skrive først.»", isAI: false, exp: "Dette er et ekte sitat fra en forsker intervjuet i en artikkel om KI i skolen." },
  { text: "Forskning viser at 89% av ungdomsskoleelever bruker KI til å gjøre leksene sine hjemme.", isAI: true, exp: "89% av skoleeierne sier elevene bruker KI, ikke elevene selv. Og ikke bare hjemme." },
  { text: "«Når jeg stiller et dumt spørsmål i timen, kan folk le av meg. AI ville aldri gjort det.»", isAI: false, exp: "Dette er et ekte sitat fra Zhanna i podkasten deres!" },
  { text: "KI-genererte videoer (deepfakes) brukes nå i 90% av all reklame på TikTok.", isAI: true, exp: "Dette er en oppdiktet statistikk. Men deepfakes brukes absolutt i reklame og svindel!" },
  { text: "Ifølge tall fra KI-indeksen har sysselsettingen for unge (21-30 år) i utsatte yrker sunket med 6,6%.", isAI: false, exp: "Dette er ekte tall som Emilia nevner i podkasten." }
];

const Game = {
  idx: 0, score: 0,
  card: $('#gameCard'), text: $('#gameText'), tag: $('#gameTag'),
  actions: $$('.game-btn'), feedback: $('#gameFeedback'), fbTitle: $('#fbTitle'), fbText: $('#fbText'), nextBtn: $('#gameNext'),
  
  init() {
    if(!this.card) return;
    this.actions.forEach(btn => btn.addEventListener('click', (e) => this.answer(e.target.dataset.answer)));
    this.nextBtn.addEventListener('click', () => this.next());
    this.load();
  },
  
  load() {
    if(this.idx >= gameData.length) {
      this.tag.textContent = "FERDIG!";
      this.text.textContent = `Du fikk ${this.score} av ${gameData.length} riktige.`;
      this.actions.forEach(b => b.classList.add('hidden'));
      this.feedback.classList.add('hidden');
      return;
    }
    this.card.classList.remove('hidden');
    this.actions.forEach(b => { b.classList.remove('hidden'); b.disabled = false; });
    this.feedback.classList.add('hidden');
    this.tag.textContent = "EKTE ELLER KI?";
    this.text.textContent = gameData[this.idx].text;
  },
  
  answer(choice) {
    this.actions.forEach(b => b.disabled = true);
    const isCorrect = (choice === 'ai' && gameData[this.idx].isAI) || (choice === 'human' && !gameData[this.idx].isAI);
    
    if(isCorrect) {
      this.score++;
      this.fbTitle.textContent = "🎉 Riktig!";
      this.fbTitle.style.color = "#2ecc71";
    } else {
      this.fbTitle.textContent = "❌ Oops, feil!";
      this.fbTitle.style.color = "#e74c3c";
    }
    
    this.fbText.textContent = gameData[this.idx].exp;
    this.feedback.classList.remove('hidden');
    this.nextBtn.textContent = this.idx === gameData.length - 1 ? "Se poengsum →" : "Neste utfordring →";
  },
  
  next() {
    this.idx++;
    this.load();
  }
};
Game.init();

/* =========================================
   3. PERSONLIGHETSTEST: HVEM ER DU?
   ========================================= */
const personalityData = [
  { q: "Hva tenker du når du hører ordet 'Kunstig Intelligens'?", a: [
    { t: "Kult! Jeg bruker det hele tiden.", type: "Polina" },
    { t: "Skummelt. Hva om det tar over?", type: "Alisa" },
    { t: "Spørs om det egentlig funker da.", type: "Viktoriia" },
    { t: "Jeg bare later som jeg forstår det.", type: "Emilia" }
  ]},
  { q: "Du får en vanskelig matteoppgave. Hva gjør du?", a: [
    { t: "Spør ChatGPT med en gang.", type: "Polina" },
    { t: "Prøver selv, men bruker KI for å sjekke.", type: "Emilia" },
    { t: "Kopierer svaret og håper på det beste.", type: "Zhanna" },
    { t: "Jeg tør ikke bruke KI, tenk om det er feil?", type: "Viktoriia" }
  ]},
  { q: "Du ser en syk video på TikTok. Hva gjør du?", a: [
    { t: "Deler den med en gang!", type: "Zhanna" },
    { t: "Tenker at det sikkert er fake.", type: "Viktoriia" },
    { t: "Sjekker kilden først.", type: "Emilia" },
    { t: "Blir bekymret for hva KI kan gjøre.", type: "Alisa" }
  ]}
];

const Personality = {
  idx: 0, score: { Emilia: 0, Viktoriia: 0, Alisa: 0, Polina: 0, Zhanna: 0 },
  startBtn: $('#persStartBtn'), startDiv: $('#persStart'), gameDiv: $('#persGame'), resultDiv: $('#persResult'),
  qText: $('#persQuestion'), aBox: $('#persAnswers'),
  
  init() {
    if(!this.startBtn) return;
    this.startBtn.addEventListener('click', () => this.start());
  },
  
  start() {
    this.startDiv.classList.add('hidden');
    this.gameDiv.classList.remove('hidden');
    this.idx = 0;
    this.score = { Emilia: 0, Viktoriia: 0, Alisa: 0, Polina: 0, Zhanna: 0 };
    this.render();
  },
  
  render() {
    const data = personalityData[this.idx];
    this.qText.textContent = data.q;
    this.aBox.innerHTML = '';
    data.a.forEach(ans => {
      const b = document.createElement('button');
      b.textContent = ans.t;
      b.addEventListener('click', () => this.answer(ans.type));
      this.aBox.appendChild(b);
    });
  },
  
  answer(type) {
    this.score[type]++;
    this.idx++;
    if(this.idx >= personalityData.length) {
      this.finish();
    } else {
      this.render();
    }
  },
  
  finish() {
    this.gameDiv.classList.add('hidden');
    this.resultDiv.classList.remove('hidden');
    
    // Finn hvem som fikk høyest poeng
    let winner = Object.keys(this.score).reduce((a, b) => this.score[a] > this.score[b] ? a : b);
    
    let text = "";
    if(winner === "Polina") text = "Du er optimisten! Du ser mulighetene med KI og synes det gjør hverdagen enklere.";
    if(winner === "Alisa") text = "Du er den bekymrede! Du tenker på konsekvensene og er redd for at vi skal miste kontrollen.";
    if(winner === "Viktoriia") text = "Du er skeptikeren! Du stoler ikke blindt på teknologien og krever at ting faktisk funker.";
    if(winner === "Zhanna") text = "Du er entusiasten! Du liker å teste nye ting og synes KI er gøy, men kanskje litt for lett å jukse med?";
    if(winner === "Emilia") text = "Du er programlederen! Du prøver å holde balansen og ser både fordeler og ulemper.";
    
    this.resultDiv.innerHTML = `
      <span class="mini-label">DITT RESULTAT</span>
      <h3>Du er ${winner}! 🤩</h3>
      <p>${text}</p>
      <button class="btn btn-lime full" id="restartPers">Ta testen igjen ↻</button>
    `;
    
    $('#restartPers').addEventListener('click', () => {
      this.resultDiv.classList.add('hidden');
      this.startDiv.classList.remove('hidden');
    });
  }
};
Personality.init();

console.log('%cKI-Ishiki ✳ klar!', 'color:#121212;font-weight:bold;font-size:14px');