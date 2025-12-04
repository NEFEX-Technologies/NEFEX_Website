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

// ===== Contact Form Handling with FormSubmit (AJAX) =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    // Validate reCAPTCHA (only if it exists on the page)
    if (typeof grecaptcha !== 'undefined') {
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        alert('Please complete the CAPTCHA verification.');
        return;
      }
    }

    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(this);

    const object = Object.fromEntries(formData);

    // Add reCAPTCHA for validation but exclude it from email (only if reCAPTCHA exists)
    if (typeof grecaptcha !== 'undefined') {
      const recaptchaResponse = grecaptcha.getResponse();
      if (recaptchaResponse) {
        object['g-recaptcha-response'] = recaptchaResponse;
      }
    }

    // Create clean object for email (without CAPTCHA response)
    const emailData = { ...object };
    delete emailData['g-recaptcha-response'];

    const json = JSON.stringify(emailData);

    fetch("https://formsubmit.co/ajax/admin@nefex.co.in", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(data => {
        console.log('SUCCESS!', data);
        alert('Message sent successfully!');
        contactForm.reset();
        if (typeof grecaptcha !== 'undefined') {
          grecaptcha.reset(); // Reset reCAPTCHA
        }
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      })
      .catch(error => {
        console.log('FAILED...', error);
        alert('Failed to send message. Please try again.');
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      });
  });
}


// ===== Careers Application Form Handling =====
const careersForm = document.querySelector('#apply form.contact-form');

if (careersForm) {
  careersForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    const formData = new FormData(this);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch("https://formsubmit.co/ajax/admin@nefex.co.in", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(data => {
        console.log('SUCCESS!', data);
        alert('Application submitted successfully! We will get back to you soon.');
        careersForm.reset();
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      })
      .catch(error => {
        console.log('FAILED...', error);
        alert('Failed to submit application. Please try again or email us directly at admin@nefex.co.in');
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      });
  });
}

