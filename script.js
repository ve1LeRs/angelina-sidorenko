// Mobile navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 50);
});

// Scroll reveal
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
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

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Отправлено ✓';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
    contactForm.reset();
  }, 3000);
});
