// Mobile navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function setMenuOpen(isOpen) {
  navMenu.classList.toggle('open', isOpen);
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

navToggle.addEventListener('click', () => {
  setMenuOpen(!navMenu.classList.contains('open'));
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 992 && navMenu.classList.contains('open')) {
    setMenuOpen(false);
  }
});

// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 50);
}, { passive: true });

// Scroll reveal
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -24px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.timeline__item, .repertoire__card').forEach(el => {
  observer.observe(el);
});

// Stagger repertoire cards
document.querySelectorAll('.repertoire__card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});

// Stagger timeline items
document.querySelectorAll('.timeline__item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.1}s`;
});

// Contact form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const FORM_EMAIL = 'angelinasidorenko.spb@gmail.com';

function setFormStatus(message, type = '') {
  formStatus.textContent = message;
  formStatus.className = type ? `form__status form__status--${type}` : 'form__status';
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const botcheck = contactForm.querySelector('[name="botcheck"]');
  if (botcheck instanceof HTMLInputElement && botcheck.checked) {
    return;
  }

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  const formData = new FormData(contactForm);
  const topic = formData.get('topic');

  btn.textContent = 'Отправка…';
  setFormStatus('');

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${FORM_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        topic,
        message: formData.get('message'),
        _subject: `Сайт: ${topic}`,
        _template: 'table',
        _captcha: 'false'
      })
    });

    const result = await response.json();

    if (!response.ok || result.success !== 'true') {
      throw new Error(result.message || 'send failed');
    }

    contactForm.reset();
    btn.textContent = 'Отправлено ✓';
    setFormStatus('Спасибо! Сообщение отправлено.', 'success');

    setTimeout(() => {
      btn.textContent = originalText;
      setFormStatus('');
    }, 4000);
  } catch (error) {
    btn.textContent = originalText;
    setFormStatus(
      error.message === 'send failed'
        ? 'Не удалось отправить. Напишите на angelinasidorenko.spb@gmail.com'
        : `Ошибка: ${error.message}`,
      'error'
    );
  }
});
