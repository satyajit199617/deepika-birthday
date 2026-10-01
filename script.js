const surpriseBtn=document.getElementById("surpriseBtn");
const letter=document.getElementById("letter");
const cake=document.getElementById("cake");
const musicHint=document.getElementById("musicHint");
const wishBtn=document.getElementById("wishBtn");
const wishMessage=document.getElementById("wishMessage");

// A gentle original melody made with the Web Audio API.
// No music file or external copyright-restricted track is required.
let audioCtx=null, master=null, musicTimer=null, musicStarted=false;
const melody=[
  [261.63,.30],[329.63,.30],[392.00,.45],[329.63,.30],
  [293.66,.30],[349.23,.30],[440.00,.45],[349.23,.30],
  [261.63,.30],[329.63,.30],[392.00,.30],[523.25,.55],
  [392.00,.30],[349.23,.30],[293.66,.45],[261.63,.55]
];

function startMusic(){
  if(musicStarted)return;
  musicStarted=true;
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  master=audioCtx.createGain();
  master.gain.value=.055;
  master.connect(audioCtx.destination);
  let i=0;
  function play(){
    const [freq,dur]=melody[i%melody.length];
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type="sine"; osc.frequency.value=freq;
    gain.gain.setValueAtTime(0.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.8,audioCtx.currentTime+.04);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur-.03);
    osc.connect(gain);gain.connect(master);osc.start();osc.stop(audioCtx.currentTime+dur);
    i++; musicTimer=setTimeout(play,dur*1000);
  }
  play();
  musicHint.classList.add("show");
}

surpriseBtn.addEventListener("click",()=>{
  startMusic();
  letter.classList.remove("hidden");
  cake.classList.remove("hidden");
  surpriseBtn.textContent="💖 The surprise is yours!";
  surpriseBtn.disabled=true;
  launchConfetti();
  setTimeout(()=>letter.scrollIntoView({behavior:"smooth",block:"start"}),250);
  createBalloons(18);
});

wishBtn.addEventListener("click",()=>{
  startMusic();
  wishMessage.classList.remove("hidden");
  wishBtn.textContent="🌟 Wish sent!";
  launchConfetti();
});

function createBalloons(n){
  const emojis=["🎈","🎈","💗","🎈","🎀"];
  for(let i=0;i<n;i++){
    const b=document.createElement("div");
    b.className="balloon";b.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    b.style.left=(Math.random()*100)+"vw";
    b.style.animationDuration=(6+Math.random()*6)+"s";
    b.style.animationDelay=(Math.random()*2)+"s";
    document.getElementById("balloons").appendChild(b);
    setTimeout(()=>b.remove(),15000);
  }
}

function launchConfetti(){
  const canvas=document.getElementById("confetti"),ctx=canvas.getContext("2d");
  canvas.width=innerWidth;canvas.height=innerHeight;
  const pieces=Array.from({length:170},()=>({
    x:innerWidth/2+(Math.random()-.5)*180,y:innerHeight*.28,
    vx:(Math.random()-.5)*10,vy:Math.random()*-9-2,
    g:.22+Math.random()*.1,s:4+Math.random()*7,r:Math.random()*Math.PI
  }));
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx;p.vy+=p.g;p.y+=p.vy;p.r+=.12;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);
      ctx.fillStyle=`hsl(${Math.random()*360},90%,70%)`;ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*1.7);ctx.restore();
    });
    if(frame++<180)requestAnimationFrame(draw);else ctx.clearRect(0,0,canvas.width,canvas.height);
  }draw();
}
