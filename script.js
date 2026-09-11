/* =========================================================================
   PROSYS TEKNOLOJI A.Ş. — WEBSITE JAVASCRIPT
   Vanilla JS, no dependencies
   ========================================================================= */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  initHamburgerMenu();
  initFAQAccordion();
  initFilterButtons();
  initFormValidation();
  initSmoothScroll();
  initMediaQueries();

  console.log('✓ Prosys website initialized');
});

/* =========================================================================
   1. HERO SECTION (Static SVG Illustration)
   ========================================================================= */

function initHeroSection() {
  console.log('✓ Hero section loaded');
}

/* =========================================================================
   2. HAMBURGER MENU
   ========================================================================= */

function initHamburgerMenu() {
  const hamburger = document.querySelector('#hamburger');
  const navMobile = document.querySelector('#nav-mobile');
  const navLinks = document.querySelectorAll('#nav-mobile a');

  if (!hamburger || !navMobile) {
    console.warn('⚠ Hamburger menu elements not found');
    return;
  }

  console.log('✓ Hamburger menu active');

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', function(event) {
    event.stopPropagation();
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
    navMobile.classList.toggle('open');
  });

  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navMobile.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = navMobile.contains(event.target) || hamburger.contains(event.target);

    if (!isClickInside && navMobile.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navMobile.classList.remove('open');
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navMobile.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navMobile.classList.remove('open');
    }
  });
}

/* =========================================================================
   3. FAQ ACCORDION
   ========================================================================= */

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length === 0) {
    console.warn('⚠ FAQ items not found');
    return;
  }

  console.log('✓ FAQ accordion active');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open');
      question.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard support (Enter or Space to open/close)
    question.addEventListener('keypress', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open');
        question.setAttribute('aria-expanded', !isOpen);
      }
    });
  });
}

/* =========================================================================
   4. FILTER BUTTONS & COUNTER
   ========================================================================= */

function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const counterValue = document.querySelector('#counter-value');
  const counterSector = document.querySelector('#counter-sector');

  if (filterButtons.length === 0) {
    console.warn('⚠ Filter buttons not found');
    return;
  }

  console.log('✓ Filter buttons active');

  // Counter data
  const sectorData = {
    'tekstil': { count: 142, name: 'Tekstil' },
    'gida': { count: 89, name: 'Gıda' },
    'lojistik': { count: 156, name: 'Lojistik' },
    'finans': { count: 73, name: 'Finans' },
    'diger': { count: 40, name: 'Diğer' }
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sector = button.getAttribute('data-sector');

      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Update counter
      if (sectorData[sector]) {
        const data = sectorData[sector];

        // Animate counter change
        if (counterValue) {
          animateCounter(counterValue, parseInt(counterValue.textContent), data.count, 500);
        }

        // Update sector name
        if (counterSector) {
          counterSector.textContent = data.name;
        }
      }
    });
  });
}

// Helper function to animate counter
function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16); // ~60fps
  let current = start;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    current = Math.round(start + range * progress);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

/* =========================================================================
   5. FORM VALIDATION & SUBMISSION
   ========================================================================= */

function initFormValidation() {
  const form = document.querySelector('#contact-form');

  if (!form) {
    console.warn('⚠ Contact form not found');
    return;
  }

  console.log('✓ Form validation active');

  // Get form fields
  const firmaAdi = document.querySelector('#firma-adi');
  const sektor = document.querySelector('#sektor');
  const email = document.querySelector('#email');
  const telefon = document.querySelector('#telefon');
  const solutions = document.querySelectorAll('input[name="cozum"]');
  const submitButton = form.querySelector('.form-submit');
  const formStatus = document.querySelector('#form-status');

  // Validate email format
  function isValidEmail(emailValue) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  }

  // Validate phone format
  function isValidPhone(phoneValue) {
    const digitsOnly = phoneValue.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  }

  // Check if at least one solution is selected
  function hasSolutionSelected() {
    return Array.from(solutions).some(checkbox => checkbox.checked);
  }

  // Show error message
  function showError(field, message) {
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  // Clear error message
  function clearError(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  // Real-time validation on blur
  if (firmaAdi) {
    firmaAdi.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Firma adı gerekli');
      } else {
        clearError(this);
      }
    });
  }

  if (email) {
    email.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Email gerekli');
      } else if (!isValidEmail(this.value)) {
        showError(this, 'Geçerli bir email girin');
      } else {
        clearError(this);
      }
    });
  }

  if (telefon) {
    telefon.addEventListener('blur', function() {
      if (this.value.trim() && !isValidPhone(this.value)) {
        showError(this, 'Geçerli bir telefon numarası girin');
      } else {
        clearError(this);
      }
    });
  }

  if (sektor) {
    sektor.addEventListener('blur', function() {
      if (!this.value) {
        showError(this, 'Sektör seçin');
      } else {
        clearError(this);
      }
    });
  }

  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    let isValid = true;

    // Validate all fields
    if (!firmaAdi.value.trim()) {
      showError(firmaAdi, 'Firma adı gerekli');
      isValid = false;
    } else {
      clearError(firmaAdi);
    }

    if (!sektor.value) {
      showError(sektor, 'Sektör seçin');
      isValid = false;
    } else {
      clearError(sektor);
    }

    if (!email.value.trim()) {
      showError(email, 'Email gerekli');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Geçerli bir email girin');
      isValid = false;
    } else {
      clearError(email);
    }

    if (!telefon.value.trim()) {
      showError(telefon, 'Telefon gerekli');
      isValid = false;
    } else if (!isValidPhone(telefon.value)) {
      showError(telefon, 'Geçerli bir telefon numarası girin');
      isValid = false;
    } else {
      clearError(telefon);
    }

    // Check solutions
    const solutionsFieldset = document.querySelector('fieldset');
    const solutionError = solutionsFieldset ? solutionsFieldset.parentElement.querySelector('.error-message') : null;

    if (!hasSolutionSelected()) {
      if (solutionError) {
        solutionError.textContent = 'En az bir çözüm seçin';
      }
      isValid = false;
    } else {
      if (solutionError) {
        solutionError.textContent = '';
      }
    }

    if (isValid) {
      // Disable submit button while sending
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Gönderiliyor...';
      }

      // Show success message
      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✓ Teklif talebiniz başarıyla gönderildi. 2 iş günü içinde dönüş yapacağız.';
        formStatus.style.display = 'block';
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Reset form after 2 seconds
      setTimeout(function() {
        form.reset();

        // Re-enable submit button
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Gönder';
        }

        // Hide success message after 5 seconds
        setTimeout(function() {
          if (formStatus) {
            formStatus.style.display = 'none';
          }
        }, 5000);
      }, 2000);
    } else {
      // Show error message
      if (formStatus) {
        formStatus.className = 'form-status error';
        formStatus.textContent = '✗ Lütfen tüm gerekli alanları doldurun.';
        formStatus.style.display = 'block';
      }

      // Scroll to first error field
      const firstInvalidField = form.querySelector('[value=""], select:invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.focus();
      }
    }
  });
}

/* =========================================================================
   6. SMOOTH SCROLL
   ========================================================================= */

function initSmoothScroll() {
  // Handle all links with hash hrefs
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(event) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  console.log('✓ Smooth scroll active');
}

/* =========================================================================
   7. RESPONSIVE & MEDIA QUERIES
   ========================================================================= */

function initMediaQueries() {
  // Debounced resize handler
  const resizeHandler = debounce(function() {
    // Recalculate video progress on resize
    const video = document.querySelector('#hero-video');
    if (video) {
      window.dispatchEvent(new Event('scroll'));
    }
  }, 250);

  window.addEventListener('resize', resizeHandler, { passive: true });

  console.log('✓ Media queries initialized');
}

/* =========================================================================
   8. UTILITY FUNCTIONS
   ========================================================================= */

// Detect if device prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Debounce function for events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0
  );
}

/* =========================================================================
   9. ERROR HANDLING
   ========================================================================= */

// Global error handler
window.addEventListener('error', function(event) {
  console.error('✗ Error:', event.error);
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('✗ Unhandled promise rejection:', event.reason);
});

console.log('✓ Prosys website loaded and initialized');
