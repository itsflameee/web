const glow = document.getElementById('glow');

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

const radius = 250;
const ease = 0.055;

window.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

window.addEventListener('mouseleave', () => {
  targetX = window.innerWidth / 2;
  targetY = window.innerHeight / 2;
});

window.addEventListener('resize', () => {
  targetX = window.innerWidth / 2;
  targetY = window.innerHeight / 2;
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