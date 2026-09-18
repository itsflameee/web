const glow = document.getElementById('glow');
const subtitle = document.getElementById('main-subtitle');
const triggers = document.querySelectorAll('.corner-trigger');
const panels = document.querySelectorAll('.corner-panel');

const viewer = document.getElementById('image-viewer');
const viewerImg = document.getElementById('image-viewer-img');

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
let activeMode = null;
let leaveTimeout = null;
let isViewerOpen = false;

const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function applySnap(el) {
  if (isViewerOpen) return;

  if (el.classList.contains('corner-trigger') || el.closest('.corner-panel')) {
    const trigger = el.classList.contains('corner-trigger') ? el : document.querySelector(`.corner-trigger[data-target="${activeMode}"]`);
    if (trigger.classList.contains('top-left')) {
      targetX = 100;
      targetY = 100;
    } else if (trigger.classList.contains('top-right')) {
      targetX = window.innerWidth - 100;
      targetY = 100;
    } else if (trigger.classList.contains('bottom-left')) {
      targetX = 100;
      targetY = window.innerHeight - 100;
    } else if (trigger.classList.contains('bottom-right')) {
      targetX = window.innerWidth - 100;
      targetY = window.innerHeight - 100;
    }
    targetScaleX = 2.4;
    targetScaleY = 2.4;
    return;
  }

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
  if (e && e.clientX !== undefined) {
    targetX = e.clientX;
    targetY = e.clientY;
  }
}

function switchSubtitle(nextText) {
  if (subtitle.textContent === nextText) return;
  subtitle.classList.add('fade-out');
  setTimeout(() => {
    subtitle.textContent = nextText;
    subtitle.classList.remove('fade-out');
    if (isSnapped && activeTarget === subtitle) {
      applySnap(subtitle);
    }
  }, 200);
}

const interactiveTargets = document.querySelectorAll('.title, .subtitle, .icon-btn');

interactiveTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    if (isViewerOpen || isTouchDevice()) return;
    isSnapped = true;
    activeTarget = el;
    applySnap(el);
  });

  el.addEventListener('mouseleave', (e) => {
    if (isTouchDevice()) return;
    resetSnap(e);
  });
});

function activatePanel(trig) {
  if (isViewerOpen) return;
  clearTimeout(leaveTimeout);
  const targetName = trig.dataset.target;
  const subText = trig.dataset.subtitle;

  if (activeMode && activeMode !== targetName) {
    document.body.classList.remove(`panel-open-${activeMode}`);
  }
  activeMode = targetName;
  document.body.classList.add(`panel-open-${targetName}`);
  switchSubtitle(subText);

  isSnapped = true;
  activeTarget = trig;
  applySnap(trig);
}

function closeCurrentPanel(e) {
  if (activeMode) {
    document.body.classList.remove(`panel-open-${activeMode}`);
    activeMode = null;
    switchSubtitle(subtitle.dataset.default);
    resetSnap(e);
  }
}

function scheduleDeactivate(e) {
  if (isViewerOpen || isTouchDevice()) return;
  clearTimeout(leaveTimeout);
  leaveTimeout = setTimeout(() => {
    closeCurrentPanel(e);
  }, 90);
}

triggers.forEach((trig) => {
  trig.addEventListener('mouseenter', () => {
    if (!isTouchDevice()) activatePanel(trig);
  });
  trig.addEventListener('mouseleave', (e) => {
    if (!isTouchDevice()) scheduleDeactivate(e);
  });

  trig.addEventListener('click', (e) => {
    const targetName = trig.dataset.target;
    if (activeMode === targetName) {
      closeCurrentPanel(e);
    } else {
      activatePanel(trig);
    }
  });
});

panels.forEach((panel) => {
  panel.addEventListener('mouseenter', () => {
    if (isViewerOpen || isTouchDevice()) return;
    clearTimeout(leaveTimeout);
    isSnapped = true;
    activeTarget = panel;
    applySnap(panel);
  });
  panel.addEventListener('mouseleave', (e) => {
    if (!isTouchDevice()) scheduleDeactivate(e);
  });
});

function openViewer(src) {
  isViewerOpen = true;
  viewerImg.src = src;
  document.body.classList.add('viewer-open');
}

function closeViewer() {
  isViewerOpen = false;
  document.body.classList.remove('viewer-open');
  viewerImg.src = '';
  closeCurrentPanel();
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('zoomable-img')) {
    openViewer(e.target.src);
    return;
  }
  if (isViewerOpen) {
    closeViewer();
    return;
  }
  if (isTouchDevice() && activeMode) {
    const isClickInsideTrigger = e.target.closest('.corner-trigger');
    const isClickInsidePanel = e.target.closest('.corner-panel');
    if (!isClickInsideTrigger && !isClickInsidePanel) {
      closeCurrentPanel(e);
    }
  }
});

function handleTouchMove(e) {
  if (isViewerOpen || !e.touches || e.touches.length === 0) return;
  isSnapped = false;
  activeTarget = null;
  targetScaleX = 1.1;
  targetScaleY = 1.1;
  targetX = e.touches[0].clientX;
  targetY = e.touches[0].clientY;
}

window.addEventListener('touchstart', handleTouchMove, { passive: true });
window.addEventListener('touchmove', handleTouchMove, { passive: true });

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isViewerOpen) {
    closeViewer();
  }
});

window.addEventListener('mousemove', (e) => {
  if (!isSnapped && !isViewerOpen && !isTouchDevice()) {
    targetX = e.clientX;
    targetY = e.clientY;
  }
});

window.addEventListener('mouseleave', () => {
  if (!isSnapped && !isViewerOpen && !isTouchDevice()) {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    resetSnap();
  }
});

window.addEventListener('resize', () => {
  if (isSnapped && activeTarget && !isViewerOpen) {
    applySnap(activeTarget);
  } else if (!isViewerOpen) {
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