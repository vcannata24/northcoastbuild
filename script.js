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

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
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
