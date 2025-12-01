// ===================================
// NEFEX Website - Main JavaScript
// Intelligence Engineered
// ===================================

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ===== Header Scroll Effect =====
const header = document.getElementById('header');
const scrollIndicator = document.getElementById('scrollIndicator');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add('scrolled');
    if (scrollIndicator) scrollIndicator.classList.add('hidden');
  } else {
    header.classList.remove('scrolled');
    if (scrollIndicator) scrollIndicator.classList.remove('hidden');
  }
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ===== Intersection Observer =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .section').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== Counter Animation =====
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {
  const target = parseInt(counter.getAttribute('data-target'));
  const increment = target / 100;
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counter.textContent = Math.ceil(current) + (counter.textContent.includes('%') ? '%' : '+');
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target + (counter.textContent.includes('%') ? '%' : '+');
    }
  };

  updateCounter();
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));


