const glow = document.getElementById('glow');

const BASE_RADIUS = 200;
const ease = 0.08;

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

let targetScaleX = 1;
let targetScaleY = 1;
let currentScaleX = 1;
let currentScaleY = 1;

let isSnapped = false;
let activeTarget = null;

function applySnap(el) {
  const rect = el.getBoundingClientRect();
  targetX = rect.left + rect.width / 2;
  targetY = rect.top + rect.height / 2;

  if (el.classList.contains('title')) {
    targetScaleX = (rect.width * 1.35) / 400;
    targetScaleY = 0.55;
  } else if (el.classList.contains('subtitle')) {
    targetScaleX = (rect.width * 1.6) / 400;
    targetScaleY = 0.45;
  } else {
    targetScaleX = 1.7;
    targetScaleY = 1.7;
  }
}

function resetSnap(e) {
  isSnapped = false;
  activeTarget = null;
  targetScaleX = 1;
  targetScaleY = 1;
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
  currentScaleX += (targetScaleX - currentScaleX) * ease;
  currentScaleY += (targetScaleY - currentScaleY) * ease;

  const x = currentX - BASE_RADIUS;
  const y = currentY - BASE_RADIUS;

  glow.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${currentScaleX}, ${currentScaleY})`;

  requestAnimationFrame(animate);
}

animate();