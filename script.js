let step = 0;
let isTyping = false;
let fullText = "";
let currentIndex = 0;
let typingInterval;
let muted = false;
let currentSpeaker = "you";
let beggingIndex = 0;
let currentCallback = null;

const beggingLines = [
  "Plssssss",
  "Just think about ittt",
  "I'll treat you right fr",
  "Pleaseeee",
  "Trust meeeee plsss",
  "I will do anythinggg"
];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const typingSpeed = window.innerWidth < 600 ? 18 : 25;

function startBeggingLoop() {
  setChoices('');
  currentSpeaker = "you";

  typeText(beggingLines[beggingIndex], () => {
    beggingIndex = (beggingIndex + 1) % beggingLines.length;

    setChoices(`
      <button onclick="startBeggingLoop(); event.stopPropagation();">Nahhhh</button>
      <button onclick="answer(true); event.stopPropagation();">Fine... Yes</button>
    `);
  });
}

function acSound() {
  if (muted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 400 + Math.random() * 400;
  gain.gain.value = 0.015;
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function typeText(text, callback) {
  const textEl = document.getElementById('textContent');
  const arrow = document.getElementById('arrow');

  const you = document.getElementById('character');
  const her = document.getElementById('herCharacter');

  fullText = text;
  currentIndex = 0;
  textEl.innerHTML = '';
  arrow.style.display = 'none';
  isTyping = true;

  currentCallback = callback || null; // ✅ SET EARLY

  if (currentSpeaker === "you") {
    textEl.style.color = "#1e90ff";
    you.classList.add('talking');
    her.classList.remove('talking');
  } else {
    textEl.style.color = "#ff4d4d";
    her.classList.add('talking');
    you.classList.remove('talking');
  }

  typingInterval = setInterval(() => {
    const char = fullText[currentIndex];

    textEl.innerHTML += (char === ' ') ? '&nbsp;' : char;

    if (char !== ' ') acSound();

    currentIndex++;

    if (currentIndex >= fullText.length) {
      clearInterval(typingInterval);
      isTyping = false;
      arrow.style.display = 'block';

      you.classList.remove('talking');
      her.classList.remove('talking');

      const cb = currentCallback;
      currentCallback = null;

      if (cb) requestAnimationFrame(cb);
    }
  }, typingSpeed);
}

function handleContinue() {
  const bgm = document.getElementById('bgm');

  if (!muted && bgm.paused) bgm.play();

  if (isTyping) {
    clearInterval(typingInterval);

    document.getElementById('textContent').innerHTML = fullText;
    document.getElementById('arrow').style.display = 'block';

    document.getElementById('character').classList.remove('talking');
    document.getElementById('herCharacter').classList.remove('talking');

    isTyping = false;

    const cb = currentCallback;
    currentCallback = null;

    if (cb) requestAnimationFrame(cb);

    return;
  }

  nextStep();
}

function toggleMute(e) {
  e.stopPropagation();
  muted = !muted;
  document.getElementById('bgm').muted = muted;
  e.target.innerText = muted ? "🔇" : "🔊";
}

function setChoices(html) {
  document.getElementById('choices').innerHTML = html;
}

// SINGLE nextStep function (merged + fixed)
function nextStep() {
  if (isTyping) return;

  const container = document.getElementById('container');

  // MAIN FLOW
  if (step === 0) {
    currentSpeaker = "you";
    typeText("Heyyy babyy, I have something to tell you.");
    step++;

  } else if (step === 1) {
    currentSpeaker = "you";
    typeText("We've been talking for a while now...");
    step++;

  } else if (step === 2) {
    currentSpeaker = "you";
    typeText("It's been a month...");
    step++;

  } else if (step === 3) {
    currentSpeaker = "you";
    typeText("And honestly... I really really really like you.");
    step++;

  } else if (step === 4) {
    currentSpeaker = "you";
    typeText("This is kinda crazy but...");
    step++;

    } else if (step === 5) {
    container.classList.add('zoom');
    currentSpeaker = "you";

    typeText("Will you be my girlfriend?", () => {
        setChoices(`
        <button onclick="answer(true); event.stopPropagation();">Yes</button>
        <button onclick="answer(false); event.stopPropagation();">No</button>
        `);
    });

    step++;

  // AFTER YES FLOW
  } else if (step === 100) {
    setChoices('');
    currentSpeaker = "you";
    typeText("I promise I'll take care of you and make you happy every day.");
    step++;

  } else if (step === 101) {
    currentSpeaker = "you";
    typeText("Thank you for choosing me... I really appreciate you so much");
    step++;

  } else if (step === 102) {
    currentSpeaker = "her";
    typeText("Krazyyy~~ XD");
    step++;

  } else if (step === 103) {
    showEnding();
    step++;
  }
}

function moveNo() {
  const btn = document.getElementById('noBtn');
  btn.style.transform = `translate(${Math.random()*200-100}px, ${Math.random()*100-50}px)`;
}

function createHearts() {
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerText = '<3';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = '60%';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  }
}

function answer(isYes) {
  if (isYes) {
    document.getElementById('character').src = "juls2.png";

    const herImg = document.getElementById('herCharacter');
    herImg.classList.remove('hidden');
    herImg.src = "ara2.png";

    const yesSound = document.getElementById('yesSound');
    yesSound.volume = 0.2; // adjust here
    if (!muted) yesSound.play();

    createHearts();

    step = 100;
    currentSpeaker = "her";

    setChoices(''); // ✅ clear buttons immediately

    typeText("Yes... I will");

  } else {
    // 😭 BEGGING LOOP
    startBeggingLoop();
  }
}

function showEnding() {
  document.getElementById('endingScreen').classList.remove('hidden');
}

window.onload = () => {
  document.getElementById('bgm').volume = 0.1;
  nextStep();
};