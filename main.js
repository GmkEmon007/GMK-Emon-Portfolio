/* =============================================
   GMK Emon Portfolio — main.js
   ============================================= */

/* ---------- CUSTOM CURSOR + MOUSE TRACKING ---------- */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
const mouseGlow   = document.getElementById('mouse-glow');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows immediately
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  // Glow orb follows slightly delayed (set via CSS transition)
  mouseGlow.style.left = mouseX + 'px';
  mouseGlow.style.top  = mouseY + 'px';
});

// Trail ring follows with smooth lag via rAF lerp
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor scale on hover over interactive elements
document.querySelectorAll('a, button, .service-card, .project-card, .blog-card, .skill-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '22px';
    cursor.style.height = '22px';
    cursor.style.background = 'var(--g3)';
    cursorTrail.style.width  = '54px';
    cursorTrail.style.height = '54px';
    cursorTrail.style.opacity = '0.35';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '14px';
    cursor.style.height = '14px';
    cursor.style.background = 'var(--g1)';
    cursorTrail.style.width  = '36px';
    cursorTrail.style.height = '36px';
    cursorTrail.style.opacity = '0.7';
  });
});

// Hide/show cursor when leaving/entering window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '0.7';
});

/* ---------- PARTICLE CANVAS ---------- */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function Particle() {
  this.x  = Math.random() * W;
  this.y  = Math.random() * H;
  this.vx = (Math.random() - 0.5) * 0.4;
  this.vy = (Math.random() - 0.5) * 0.4;
  this.r  = Math.random() * 1.5 + 0.5;
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

// Mouse repulsion for particles
let pmx = -9999, pmy = -9999;
document.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; });

function draw() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Gentle repulsion from cursor
    const dx = p.x - pmx, dy = p.y - pmy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100 * 0.6;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // Speed cap
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > 1.8) { p.vx *= 0.95; p.vy *= 0.95; }

    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,230,118,0.5)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const cx = p.x - q.x, cy = p.y - q.y;
      const d = Math.sqrt(cx * cx + cy * cy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = 'rgba(0,230,118,' + (0.12 * (1 - d / 120)) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();

/* ---------- COUNT-UP ---------- */
function countUp(el, target) {
  let start = 0;
  const step = target / 1800 * 16;
  const t = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(t); }
    el.textContent = Math.floor(start) + '+';
  }, 16);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => countUp(el, +el.dataset.count));
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

const aboutSec = document.getElementById('about');
if (aboutSec) observer.observe(aboutSec);

/* ---------- SCROLL FADE REVEAL ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'none';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card,.project-card,.skill-group,.blog-card,.testi-card,.community-card,.journey-content,.timeline-item'
).forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObs.observe(el);
});
