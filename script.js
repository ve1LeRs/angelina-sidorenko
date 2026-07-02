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
const SUBJECT_LABELS = {
  concert: 'Приглашение на концерт',
  interview: 'Интервью / СМИ',
  collab: 'Сотрудничество',
  other: 'Другое'
};

function setFormStatus(message, type = '') {
  formStatus.textContent = message;
  formStatus.className = type ? `form__status form__status--${type}` : 'form__status';
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (contactForm.querySelector('[name="_honey"]').value) {
    return;
  }

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  const formData = new FormData(contactForm);
  const subjectKey = formData.get('subject');
  const subjectLabel = SUBJECT_LABELS[subjectKey] || subjectKey;

  btn.disabled = true;
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
        subject: subjectLabel,
        message: formData.get('message'),
        _subject: `Сайт: ${subjectLabel}`,
        _template: 'table',
        _captcha: 'false'
      })
    });

    if (!response.ok) {
      throw new Error('send failed');
    }

    contactForm.reset();
    btn.textContent = 'Отправлено ✓';
    setFormStatus('Спасибо! Сообщение отправлено.', 'success');

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      setFormStatus('');
    }, 4000);
  } catch {
    btn.textContent = originalText;
    btn.disabled = false;
    setFormStatus('Не удалось отправить. Напишите на angelinasidorenko.spb@gmail.com', 'error');
  }
});
