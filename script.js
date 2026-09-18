const glow = document.getElementById('glow');

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

let isSnapped = false;
let activeTarget = null;

const radius = 250;
const ease = 0.065;

function updateSnapPosition(el) {
  const rect = el.getBoundingClientRect();
  targetX = rect.left + rect.width / 2;
  targetY = rect.top + rect.height / 2;
}

const targets = document.querySelectorAll('.title, .subtitle, .icon-btn');

targets.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    isSnapped = true;
    activeTarget = el;
    updateSnapPosition(el);
  });

  el.addEventListener('mouseleave', (e) => {
    isSnapped = false;
    activeTarget = null;
    targetX = e.clientX;
    targetY = e.clientY;
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
  }
});

window.addEventListener('resize', () => {
  if (isSnapped && activeTarget) {
    updateSnapPosition(activeTarget);
  } else {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  }
});

function animate() {
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;

  const x = currentX - radius;
  const y = currentY - radius;

  glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;

  requestAnimationFrame(animate);
}

animate();