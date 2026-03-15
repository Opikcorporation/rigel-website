/* ============================================
   RIGEL — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navigation scroll effect ---------- */
  const nav = document.querySelector('.nav');
  const handleScroll = () => {
    if (window.scrollY > 10) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- Mobile Menu ---------- */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');

  const toggleMenu = () => {
    const isOpen = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    // Solid nav background when menu is open
    nav?.classList.toggle('menu-is-open', isOpen);
  };

  burger?.addEventListener('click', toggleMenu);

  // Close mobile menu on any link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.classList.remove('menu-open');
      nav?.classList.remove('menu-is-open');
    });
  });

  /* ---------- Active nav link ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll reveal (all animated classes) ---------- */
  const animatedEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .fade-in-blur, .stagger-children');
  if (animatedEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  }

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Counter animation for stats ---------- */
  const animateCounters = () => {
    document.querySelectorAll('[data-count]').forEach(counter => {
      if (counter.dataset.animated) return;
      const target = parseInt(counter.dataset.count, 10);
      if (isNaN(target)) return;
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = prefix + target.toLocaleString('en-US') + suffix;
          counter.dataset.animated = 'true';
        } else {
          counter.textContent = prefix + Math.floor(current).toLocaleString('en-US') + suffix;
          requestAnimationFrame(update);
        }
      };
      update();
    });
  };

  const statElements = document.querySelectorAll('[data-count]');
  if (statElements.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statElements.forEach(el => statObserver.observe(el));
  }

  /* ---------- Demo form handling ---------- */
  const demoForm = document.getElementById('demo-form');
  demoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = demoForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    // Simulate send (replace with real endpoint)
    setTimeout(() => {
      btn.textContent = 'Request sent ✓';
      btn.style.background = '#27272A';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        demoForm.reset();
      }, 3000);
    }, 1500);
  });

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Back-to-top button ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleBackToTop();
  }

  /* ---------- Keyboard: Escape closes mobile menu ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileMenu?.classList.contains('open')) {
        burger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
        document.body.classList.remove('menu-open');
        nav?.classList.remove('menu-is-open');
        burger?.focus();
      }
    }
  });

  /* ---------- Button mouse-tracking glow effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mouse-x', x + '%');
      btn.style.setProperty('--mouse-y', y + '%');
    });
  });

  /* ---------- Tilt effect on cards ---------- */
  const tiltCards = document.querySelectorAll('.card, .module-card, .ai-card, .roadmap-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && window.innerWidth >= 1024) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Hero parallax on mouse move ---------- */
  const heroVisual = document.querySelector('.hero__visual');
  if (heroVisual && !prefersReducedMotion && window.innerWidth >= 1024) {
    const hero = document.querySelector('.hero');
    hero?.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      heroVisual.style.transform = `translate(${x * -12}px, ${y * -8}px)`;
    });
    hero?.addEventListener('mouseleave', () => {
      heroVisual.style.transform = '';
      heroVisual.style.transition = 'transform 0.5s var(--ease-out-expo)';
      setTimeout(() => { heroVisual.style.transition = ''; }, 500);
    });
  }

  /* ---------- Parallax sections on scroll ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length > 0 && !prefersReducedMotion) {
    const handleParallax = () => {
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        if (visible) {
          const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
    };
    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
  }

  /* ---------- Smooth image loading ---------- */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

  /* ---------- Scroll-linked nav background opacity ---------- */
  const navEl = document.querySelector('.nav');
  if (navEl) {
    const updateNav = () => {
      const scroll = Math.min(window.scrollY / 200, 1);
      navEl.style.background = `rgba(255, 255, 255, ${0.65 + scroll * 0.3})`;
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

});
