/* ============================================================
   SCRIPT.JS — Vignesh Kumar Portfolio
   Vanilla JS — no frameworks, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ===========================
     1. PAGE LOADER
     =========================== */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1200);
  });

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';

  /* ===========================
     2. DARK / LIGHT THEME TOGGLE
     =========================== */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Restore preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ===========================
     3. CUSTOM CURSOR
     =========================== */
  const cursorOuter = document.querySelector('.cursor--outer');
  const cursorInner = document.querySelector('.cursor--inner');

  if (window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Inner cursor follows immediately
      cursorInner.style.left = mouseX + 'px';
      cursorInner.style.top = mouseY + 'px';
    });

    // Smooth outer cursor with requestAnimationFrame
    function animateCursor() {
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;
      cursorOuter.style.left = outerX + 'px';
      cursorOuter.style.top = outerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .cert-card, .project-card, input, textarea, .skill-card'
    );

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorOuter.classList.add('hovering');
        cursorInner.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorOuter.classList.remove('hovering');
        cursorInner.classList.remove('hovering');
      });
    });
  }

  /* ===========================
     4. NAVBAR — SCROLL EFFECTS
     =========================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky navbar background on scroll
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active section highlighting
  function highlightActiveSection() {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  /* ===========================
     5. SCROLL PROGRESS BAR
     =========================== */
  const scrollProgress = document.querySelector('.scroll-progress');

  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const percent = (scrolled / scrollable) * 100;
    scrollProgress.style.width = percent + '%';
  }

  /* ===========================
     6. BACK TO TOP BUTTON
     =========================== */
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===========================
     COMBINED SCROLL HANDLER
     =========================== */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        highlightActiveSection();
        updateScrollProgress();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run once on load
  handleNavScroll();
  highlightActiveSection();
  updateScrollProgress();

  /* ===========================
     7. MOBILE MENU
     =========================== */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
    hamburger.setAttribute(
      'aria-expanded',
      hamburger.classList.contains('open')
    );
  });

  // Close mobile menu on link click
  navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ===========================
     8. TYPING ANIMATION
     =========================== */
  const typedTextEl = document.getElementById('typedText');
  const phrases = ['Software Developer', 'AI Enthusiast', 'Problem Solver'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseEnd = 2000;
  const pauseStart = 500;

  function typeEffect() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typedTextEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = pauseStart;
    }

    setTimeout(typeEffect, delay);
  }

  // Start typing after loader fades
  setTimeout(typeEffect, 1400);

  /* ===========================
     9. INTERSECTION OBSERVER — REVEAL ON SCROLL
     =========================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ===========================
     10. SKILL BARS — ANIMATE ON SCROLL
     =========================== */
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          entry.target.style.width = width + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ===========================
     11. STAT COUNTER ANIMATION
     =========================== */
  const statNumbers = document.querySelectorAll('.stat-number');

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const increment = Math.ceil(target / 40);
    const duration = 1200;
    const stepTime = duration / (target / increment);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, stepTime);
  }

  statNumbers.forEach((num) => statObserver.observe(num));

  /* ===========================
     12. 3D TILT EFFECT — PROJECT CARDS
     =========================== */
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    const inner = card.querySelector('.project-card__inner');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  /* ===========================
     13. MAGNETIC BUTTONS
     =========================== */
  const magneticEls = document.querySelectorAll('.magnetic');

  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  /* ===========================
     14. CERTIFICATE MODAL
     =========================== */
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalClose = document.getElementById('certModalClose');
  const certCards = document.querySelectorAll('.cert-card');

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-cert');
      certModalImg.src = imgSrc;
      certModalImg.alt = card.querySelector('.cert-card__title').textContent;
      certModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    certModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  certModalClose.addEventListener('click', closeModal);

  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('open')) {
      closeModal();
    }
  });

  /* ===========================
     15. CONTACT FORM (Frontend Only)
     =========================== */
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const subject = document.getElementById('formSubject').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showFormFeedback('Please fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      showFormFeedback('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      btn.innerHTML = `Send Message <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      btn.disabled = false;
    }, 1500);
  });

  function showFormFeedback(msg, type) {
    // Remove existing feedback
    const existing = contactForm.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('p');
    feedback.className = 'form-feedback';
    feedback.textContent = msg;
    feedback.style.cssText = `
      margin-top: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 500;
      animation: fadeIn 0.35s ease;
      ${
        type === 'success'
          ? 'background: rgba(0,229,168,0.12); color: #00E5A8; border: 1px solid rgba(0,229,168,0.3);'
          : 'background: rgba(255,107,107,0.12); color: #FF6B6B; border: 1px solid rgba(255,107,107,0.3);'
      }
    `;

    contactForm.appendChild(feedback);

    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transition = 'opacity 0.3s';
      setTimeout(() => feedback.remove(), 300);
    }, 4000);
  }

  /* ===========================
     16. PARALLAX — HERO SHAPES
     =========================== */
  const heroShapes = document.querySelector('.hero__shapes');

  if (heroShapes && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      heroShapes.querySelectorAll('.shape').forEach((shape, i) => {
        const speed = (i + 1) * 8;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  /* ===========================
     17. SMOOTH SCROLL FOR NAV LINKS
     =========================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===========================
     18. FORM INPUT ANIMATION HELPER
     =========================== */
  // Add placeholder attribute to inputs/textareas for :placeholder-shown CSS
  document.querySelectorAll('.form-group input, .form-group textarea').forEach((input) => {
    if (!input.getAttribute('placeholder')) {
      input.setAttribute('placeholder', ' ');
    }
  });

  /* ===========================
     19. INJECT KEYFRAME FOR FORM FEEDBACK
     =========================== */
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`;
  document.head.appendChild(style);

})();
