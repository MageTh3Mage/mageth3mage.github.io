/* ── guns.lol profile page | script.js ── */

/* ─────────────────────────────────────────
   SPLASH – falling snowflakes on canvas
───────────────────────────────────────── */
const splash     = document.getElementById('splash');
const splashCanvas = document.getElementById('splashCanvas');
const ctx        = splashCanvas.getContext('2d');

let splashFlakes = [];
let splashRAF;

function resizeSplash() {
  splashCanvas.width  = window.innerWidth;
  splashCanvas.height = window.innerHeight;
}

function mkFlake() {
  return {
    x:    Math.random() * splashCanvas.width,
    y:    Math.random() * splashCanvas.height * -1,
    r:    Math.random() * 3 + 1,
    speed:Math.random() * 0.8 + 0.3,
    drift:Math.random() * 0.4 - 0.2,
    alpha:Math.random() * 0.5 + 0.2,
    char: '❅',
  };
}

function initSplash() {
  resizeSplash();
  splashFlakes = Array.from({ length: 80 }, mkFlake);
  animateSplash();
}

function animateSplash() {
  ctx.clearRect(0, 0, splashCanvas.width, splashCanvas.height);
  ctx.font = '14px sans-serif';

  splashFlakes.forEach(f => {
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle   = '#fff';
    ctx.fillText(f.char, f.x, f.y);

    f.y += f.speed;
    f.x += f.drift;

    if (f.y > splashCanvas.height + 20) {
      f.y = -20;
      f.x = Math.random() * splashCanvas.width;
    }
  });

  ctx.globalAlpha = 1;
  splashRAF = requestAnimationFrame(animateSplash);
}

window.addEventListener('resize', resizeSplash);
initSplash();


/* ─────────────────────────────────────────
   ENTER – click splash to reveal profile
───────────────────────────────────────── */
const profilePage = document.getElementById('profilePage');

splash.addEventListener('click', enter);
splash.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') enter(); });
splash.setAttribute('tabindex', '0');

function enter() {
  splash.classList.add('fade-out');
  setTimeout(() => {
    splash.style.display = 'none';
    cancelAnimationFrame(splashRAF);
  }, 650);

  profilePage.classList.remove('hidden');
  // tiny delay so transition fires
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      profilePage.classList.add('visible');
    });
  });

  startBgSnow();
  startTypewriter();
}


/* ─────────────────────────────────────────
   BACKGROUND SNOW – lighter, on profile
───────────────────────────────────────── */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx    = bgCanvas.getContext('2d');
let bgFlakes   = [];
let bgRAF;

function resizeBg() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function mkBgFlake() {
  return {
    x:     Math.random() * bgCanvas.width,
    y:     Math.random() * bgCanvas.height,
    r:     Math.random() * 2.5 + 0.5,
    speed: Math.random() * 0.5 + 0.2,
    drift: Math.random() * 0.3 - 0.15,
    alpha: Math.random() * 0.3 + 0.05,
  };
}

function startBgSnow() {
  resizeBg();
  bgFlakes = Array.from({ length: 60 }, mkBgFlake);
  window.addEventListener('resize', resizeBg);
  animateBg();
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  bgFlakes.forEach(f => {
    bgCtx.beginPath();
    bgCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255,255,255,${f.alpha})`;
    bgCtx.fill();

    f.y += f.speed;
    f.x += f.drift;

    if (f.y > bgCanvas.height + 10) {
      f.y = -10;
      f.x = Math.random() * bgCanvas.width;
    }
  });

  bgRAF = requestAnimationFrame(animateBg);
}


/* ─────────────────────────────────────────
   TYPEWRITER – bio text effect
───────────────────────────────────────── */
const WORDS = ['SOFTWARE DEVELOPER', 'ENGINEER', 'STUDENT'];

let currentWordIndex = 0;
function startTypewriter() {
  const el = document.getElementById('typewriter');
  let i = 0;
  let going = true;
  let isDeleting = false;

  function type() {
    if (!going) return;

    const currentWord = WORDS[currentWordIndex];
    
    if (!isDeleting) {
      if (i <= currentWord.length) {
        el.textContent = currentWord.slice(0, i);
        i++;
        setTimeout(type, 100); // Speed of typing
      } else {
        // Once the word is fully typed, start deleting
        isDeleting = true;
        setTimeout(type, 2000); // Delay before deleting starts
      }
    } else {
      if (i > 0) {
        el.textContent = currentWord.slice(0, i - 1);
        i--;
        setTimeout(type, 100); // Speed of deleting
      } else {
        // Once the word is fully deleted, move to the next word
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % WORDS.length; // Loop through the words
        setTimeout(type, 900); // Delay before starting the next word
      }
    }
  }

  setTimeout(type, 600); // Start typing after a small delay
}


/* ─────────────────────────────────────────
   COPY TO CLIPBOARD
───────────────────────────────────────── */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg = '📋 Copied!') {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Copied to clipboard!');
    if (btn) {
      const action = btn.querySelector('.lb-action');
      if (action) {
        const orig = action.textContent;
        action.textContent = '✓ Copied';
        action.style.color = '#4ade80';
        setTimeout(() => {
          action.textContent = orig;
          action.style.color = '';
        }, 1800);
      }
    }
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); showToast('📋 Copied!'); }
    catch {}
    document.body.removeChild(ta);
  });
}

// Wire up data-copy buttons
document.querySelectorAll('.link-btn[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    copyToClipboard(btn.dataset.copy, btn);
  });
});


/* ─────────────────────────────────────────
   VIEW COUNTER – animated count-up
───────────────────────────────────────── */
function animateViewCount(target, duration = 1200) {
  const el    = document.getElementById('viewCount');
  const start = performance.now();

  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - p) * (1 - p);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Kick off when profile becomes visible
const profileObserver = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    if (m.target.classList.contains('visible')) {
      setTimeout(() => animateViewCount(46), 600);
      profileObserver.disconnect();
    }
  });
});
profileObserver.observe(profilePage, { attributes: true, attributeFilter: ['class'] });


/* ─────────────────────────────────────────
   LINK RIPPLE EFFECT
───────────────────────────────────────── */
document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const ripple = document.createElement('span');

    ripple.style.cssText = `
      position:absolute;
      width:1px;height:1px;
      background:rgba(255,255,255,0.25);
      border-radius:50%;
      transform:scale(0);
      left:${x}px;top:${y}px;
      animation:ripple 0.55s ease-out forwards;
      pointer-events:none;
    `;

    if (!document.querySelector('#rippleStyle')) {
      const s = document.createElement('style');
      s.id = 'rippleStyle';
      s.textContent = `@keyframes ripple{to{transform:scale(${Math.max(rect.width, rect.height) * 4});opacity:0;}}`;
      document.head.appendChild(s);
    }

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Audio control elements
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');

// Function to play or pause the audio
function toggleAudio() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.textContent = '❚❚'; // Change to a pause icon when playing
  } else {
    audioPlayer.pause();
    playBtn.textContent = '▶️'; // Change to a play icon when paused
  }
}

// Set the initial volume
audioPlayer.volume = volumeSlider.value;

// Update the volume when the slider is changed
volumeSlider.addEventListener('input', (e) => {
  audioPlayer.volume = e.target.value;
});

// Play the audio when the play button is clicked
playBtn.addEventListener('click', toggleAudio);

// Optionally, autoplay after user interaction (to avoid autoplay block)
window.addEventListener('load', () => {
  // You could call toggleAudio() here, depending on user interaction preferences
});