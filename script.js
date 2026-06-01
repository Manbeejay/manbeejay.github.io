// ── Navigation ──────────────────────────────────
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Scroll Reveal ────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ── Contact Form ─────────────────────────────────
const form = document.querySelector('.contact-form');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const data = new FormData(form);

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });

    const json = await res.json();

    if (json.success) {
      btn.innerHTML = `✦ Sent`;
      form.reset();
      showToast('Message sent. I\'ll be in touch soon.');
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      }, 3000);
    } else {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      showToast('Something went wrong. Please try again.');
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Send Message';
    showToast('Could not send. Check your connection and try again.');
  }
});

// ── Toast ─────────────────────────────────────────
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">✦</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Hero subtle parallax ──────────────────────────
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

// ── Animate numbers (stats) ───────────────────────
function animateNumber(el, target, duration = 1600) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + '+';
    }
  }, 16);
}

const statNum = document.querySelector('.hero-stat-badge .num');
if (statNum) {
  const targetVal = parseInt(statNum.dataset.target || '50');
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateNumber(statNum, targetVal);
      observer.disconnect();
    }
  });
  observer.observe(statNum);
}
