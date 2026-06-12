// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open', !isOpen);
    a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    q.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
  });
});

// Elevate the sticky nav once the page is scrolled
const navWrap = document.querySelector('.nav-wrap');
if (navWrap) {
  const elevate = () => navWrap.classList.toggle('scrolled', window.scrollY > 10);
  elevate();
  window.addEventListener('scroll', elevate, { passive: true });
}

// Scroll reveal with stagger.
// Containers that reveal as one block hand the reveal down to their children
// so grids, FAQ items, and the before/after columns cascade in.
document.querySelectorAll('.grid.reveal, .faq.reveal, .ba.reveal').forEach((box) => {
  box.classList.remove('reveal');
  Array.from(box.children).forEach((child) => child.classList.add('reveal'));
});

const reveals = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window && reveals.length) {
  // Siblings revealing together get incremental delays (capped) for a cascade.
  const byParent = new Map();
  reveals.forEach((el) => {
    const key = el.parentElement;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(el);
  });
  byParent.forEach((els) => {
    if (els.length < 2) return;
    els.forEach((el, i) => { el.style.transitionDelay = Math.min(i * 80, 480) + 'ms'; });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      // Once the reveal has played, hand transitions back to the base styles
      // so card/button hovers aren't stuck on the slow reveal timing.
      const delay = parseFloat(el.style.transitionDelay) || 0;
      setTimeout(() => {
        el.classList.remove('reveal', 'in');
        el.style.transitionDelay = '';
      }, 750 + delay);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// ---------- Contact form ----------
// SETUP: create a free form at https://formspree.io, then paste its endpoint
// into the <form action="..."> in contact.html (replace REPLACE_WITH_ID).
// Until that's done, the form gracefully falls back to the visitor's email app.
const form = document.querySelector('#audit-form');
if (form) {
  const endpoint = form.getAttribute('action') || '';
  const configured = /formspree\.io\/f\/\w+$/.test(endpoint) && !/REPLACE_WITH_ID/.test(endpoint);
  const success = document.querySelector('.form-success');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.innerHTML : '';

  const field = (name) => (form.elements[name] && form.elements[name].value || '').trim();

  const showSuccess = () => {
    if (success) {
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
  };

  // Fallback: open the visitor's email client with the form prefilled.
  const mailtoFallback = () => {
    const body = [
      'Name: ' + field('name'),
      'Business: ' + field('business'),
      'Email: ' + field('email'),
      'Website: ' + field('website'),
      'What they want: ' + field('goal'),
      '',
      field('message')
    ].join('\n');
    const url = 'mailto:vcannata24@bw.edu'
      + '?subject=' + encodeURIComponent('Free audit request — ' + (field('business') || field('name') || 'New lead'))
      + '&body=' + encodeURIComponent(body);
    window.location.href = url;
    showSuccess();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: if a bot filled the hidden field, silently drop it.
    if (form.elements['_gotcha'] && form.elements['_gotcha'].value) return;

    // Native validation (required, email format, etc.)
    if (!form.reportValidity()) return;

    if (!configured) { mailtoFallback(); return; }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Sending…'; }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) showSuccess();
      else mailtoFallback();
    } catch (err) {
      mailtoFallback();
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalLabel; }
    }
  });
}

// Lazy-load the Calendly inline embed as it approaches the viewport,
// so the third-party script never slows the initial page render.
const calBox = document.querySelector('#calendly-embed');
if (calBox) {
  const loadCal = () => {
    if (calBox.dataset.loaded) return;
    calBox.dataset.loaded = '1';
    calBox.innerHTML = '';
    const widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.setAttribute('data-url', calBox.dataset.calendly);
    widget.style.minWidth = '320px';
    widget.style.height = '680px';
    calBox.appendChild(widget);
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
  };
  if ('IntersectionObserver' in window) {
    const calIo = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { loadCal(); calIo.disconnect(); }
    }, { rootMargin: '600px 0px' });
    calIo.observe(calBox);
  } else {
    loadCal();
  }
}

// ---------- Showpieces ----------
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Scroll progress bar
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.appendChild(progress);
const setProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
};
setProgress();
window.addEventListener('scroll', setProgress, { passive: true });
window.addEventListener('resize', setProgress, { passive: true });

// Hero device: the URL types itself out, caret blinking, then CSS builds the mock site
const urlEl = document.querySelector('.hero-visual .device-url');
if (urlEl && !reduceMotion) {
  const full = urlEl.textContent.trim();
  urlEl.textContent = '';
  urlEl.classList.add('typing');
  let i = 0;
  const type = () => {
    urlEl.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(type, 45 + Math.random() * 70);
    else setTimeout(() => urlEl.classList.remove('typing'), 1100);
  };
  setTimeout(type, 450);
}

// Count-up stats inside the hero mock (e.g. "+38%" climbs from zero)
if (!reduceMotion) {
  document.querySelectorAll('.hero-visual .mock-card .k').forEach((el) => {
    const m = el.textContent.trim().match(/^([+\-]?)(\d+)(%?)$/);
    if (!m || +m[2] === 0) return;
    const sign = m[1], target = +m[2], suffix = m[3];
    const begin = performance.now() + 1350; // wait for the stat card to rise in
    const dur = 900;
    el.textContent = sign + '0' + suffix;
    const tick = (now) => {
      const t = Math.min((now - begin) / dur, 1);
      if (t >= 0) {
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = sign + Math.round(target * eased) + suffix;
      }
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// 3D tilt on the hero device, following the cursor
const tiltDevice = document.querySelector('.hero-visual .device');
if (tiltDevice && !reduceMotion && finePointer) {
  const zone = tiltDevice.parentElement;
  zone.addEventListener('mousemove', (e) => {
    const r = zone.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tiltDevice.style.transform =
      'perspective(900px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (y * -6).toFixed(2) + 'deg)';
  });
  zone.addEventListener('mouseleave', () => { tiltDevice.style.transform = ''; });
}

// Magnetic pull on primary buttons
if (!reduceMotion && finePointer) {
  document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.12;
      const y = (e.clientY - r.top - r.height / 2) * 0.18;
      btn.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + (y - 1).toFixed(1) + 'px)';
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// Cursor-tracked warm glow on dark surfaces
if (finePointer) {
  document.querySelectorAll('.cta-banner, .band-dark .card, .card.band-dark').forEach((el) => {
    el.classList.add('glow-track');
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}
