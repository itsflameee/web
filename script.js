const glow = document.getElementById('glow');

const DEFAULT_SIZE = 500;
const ease = 0.065;

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

let targetW = DEFAULT_SIZE;
let targetH = DEFAULT_SIZE;
let currentW = DEFAULT_SIZE;
let currentH = DEFAULT_SIZE;

let targetRadius = 50;
let currentRadius = 50;

let isSnapped = false;
let activeTarget = null;

function applySnap(el) {
  const rect = el.getBoundingClientRect();
  targetX = rect.left + rect.width / 2;
  targetY = rect.top + rect.height / 2;

  if (el.classList.contains('title') || el.classList.contains('subtitle')) {
    targetW = Math.max(rect.width * 1.5, 420);
    targetH = Math.max(rect.height * 2.8, 220);
    targetRadius = 35;
  } else {
    targetW = 620;
    targetH = 620;
    targetRadius = 50;
  }
}

function resetSnap(e) {
  isSnapped = false;
  activeTarget = null;
  targetW = DEFAULT_SIZE;
  targetH = DEFAULT_SIZE;
  targetRadius = 50;
  if (e) {
    targetX = e.clientX;
    targetY = e.clientY;
  }
}

const targets = document.querySelectorAll('.title, .subtitle, .icon-btn');

targets.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    isSnapped = true;
    activeTarget = el;
    applySnap(el);
  });

  el.addEventListener('mouseleave', (e) => {
    resetSnap(e);
  });
});

window.addEventListener('mousemove', (e) => {
  if (!isSnapped) {
    targetX = e.clientX;
    targetY = e.clientY;
  }
});

window.addEventListener('mouseleave', () => {
  if (!isSnapped) {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    resetSnap();
  }
});

window.addEventListener('resize', () => {
  if (isSnapped && activeTarget) {
    applySnap(activeTarget);
  } else {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  }
});

function animate() {
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;
  currentW += (targetW - currentW) * ease;
  currentH += (targetH - currentH) * ease;
  currentRadius += (targetRadius - currentRadius) * ease;

  const x = currentX - currentW / 2;
  const y = currentY - currentH / 2;

  glow.style.width = `${currentW}px`;
  glow.style.height = `${currentH}px`;
  glow.style.borderRadius = `${currentRadius}%`;
  glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;

  requestAnimationFrame(animate);
}

animate();