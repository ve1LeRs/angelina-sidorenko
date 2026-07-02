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
const formSubject = document.getElementById('formSubject');

function setFormStatus(message, type = '') {
  formStatus.textContent = message;
  formStatus.className = type ? `form__status form__status--${type}` : 'form__status';
}

const params = new URLSearchParams(window.location.search);
if (params.get('sent') === '1') {
  setFormStatus('Спасибо! Сообщение отправлено. Письмо может прийти в течение нескольких минут.', 'success');
  history.replaceState(null, '', `${window.location.pathname}#contact`);
}

contactForm.addEventListener('submit', (e) => {
  if (contactForm.botcheck.checked) {
    e.preventDefault();
    return;
  }

  const topicField = contactForm.elements.namedItem('topic');
  const topic = topicField instanceof HTMLSelectElement ? topicField.value : 'Сообщение с сайта';
  formSubject.value = `Сайт: ${topic}`;
});
