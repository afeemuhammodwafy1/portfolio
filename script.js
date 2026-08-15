// ============================================================
// PROJECT FILTER - Smooth Animation with Event Listeners
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  var filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var filterType = this.getAttribute('data-filter');
      var grid = this.closest('.section').querySelector('.projects-grid');
      
      if (!grid) return;
      
      var cards = grid.querySelectorAll('.project-card');
      
      // Update active button
      var siblings = this.closest('.filter-bar').querySelectorAll('.filter-btn');
      siblings.forEach(function(sib) {
        sib.classList.remove('active');
      });
      this.classList.add('active');
      
      // Filter cards with smooth animation
      cards.forEach(function(card, index) {
        var tags = card.getAttribute('data-tags') || '';
        var show = false;
        
        if (filterType === 'all') {
          show = true;
        } else if (filterType === 'python') {
          show = tags.includes('python') || tags.includes('flask');
        } else if (filterType === 'html-css-js') {
          show = tags.includes('html') || tags.includes('css') || tags.includes('js');
        } else if (filterType === 'api') {
          show = tags.includes('api');
        }
        
        // Hide animation
        if (!show) {
          card.classList.remove('filtering-in', 'show');
          card.classList.add('filtering-out');
          
          setTimeout(function() {
            if (!card.classList.contains('show')) {
              card.style.display = 'none';
            }
          }, 400);
        } else {
          // Show animation with stagger effect
          card.style.display = 'flex';
          card.classList.remove('filtering-out');
          card.classList.add('filtering-in');
          
          var delay = index * 80;
          setTimeout(function() {
            card.classList.add('show');
          }, delay);
          
          setTimeout(function() {
            card.classList.remove('filtering-in');
          }, delay + 400);
        }
      });
    });
  });
});

// ============================================================
// MOBILE MENU
// ============================================================
var menuBtn = document.getElementById('menuBtn');
var mobileNav = document.getElementById('mobileNav');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', function() {
    var expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
    this.setAttribute('aria-expanded', expanded);
    this.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ============================================================
// TYPING EFFECT
// ============================================================
var roles = ["Science Student", "AI & Tech Explorer"];
var roleIndex = 0;
var charIndex = 0;
var isDeleting = false;
var roleEl = document.getElementById('roleText');

if (roleEl) {
  function typeRole() {
    var current = roles[roleIndex];
    if (isDeleting) {
      roleEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      roleEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 1500);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 300);
      return;
    }
    setTimeout(typeRole, isDeleting ? 25 : 45);
  }
  typeRole();
}

// ============================================================
// ACTIVE NAV - Handles both index.html and subpages
// ============================================================
var sections = document.querySelectorAll('.section');
var navLinks = document.querySelectorAll('.nav-link');
var mobileLinks = document.querySelectorAll('.mobile-nav-link');

function setActive(id) {
  var isProjectsPage = window.location.pathname.includes('/projects/');
  var isCertPage = window.location.pathname.includes('/certifications/');
  
  navLinks.forEach(function(link) {
    var linkSection = link.getAttribute('data-section');
    
    // On projects page, keep Projects active
    if (isProjectsPage && linkSection === 'projects') {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      return;
    }
    
    // On certifications page, keep Education active
    if (isCertPage && linkSection === 'education') {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      return;
    }
    
    link.classList.toggle('active', linkSection === id);
    if (linkSection === id) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  
  mobileLinks.forEach(function(link) {
    var linkSection = link.getAttribute('data-section');
    
    if (isProjectsPage && linkSection === 'projects') {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      return;
    }
    
    if (isCertPage && linkSection === 'education') {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      return;
    }
    
    link.classList.toggle('active', linkSection === id);
    if (linkSection === id) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

window.addEventListener('scroll', function() {
  var current = '';
  sections.forEach(function(section) {
    var top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.id;
    }
  });
  if (current) {
    setActive(current);
  }
});

// ============================================================
// BACK TO TOP
// ============================================================
var backTop = document.getElementById('backTop');

if (backTop) {
  window.addEventListener('scroll', function() {
    backTop.classList.toggle('visible', window.scrollY > 200);
  });

  backTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function smoothScroll(target, duration) {
  duration = duration || 400;
  var start = window.scrollY;
  var end = target.getBoundingClientRect().top + start;
  var startTime = performance.now();

  function animateScroll(currentTime) {
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    window.scrollTo(0, start + (end - start) * ease);
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  requestAnimationFrame(animateScroll);
}

document.querySelectorAll('.nav-link, .mobile-nav-link, .btn-primary, .btn-secondary').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href && href.startsWith('#') && !this.hasAttribute('download')) {
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        requestAnimationFrame(function() {
          smoothScroll(target, 400);
        });
      }
    }
  });
});

// ============================================================
// SCROLL INDICATOR AUTO-HIDE
// ============================================================
var scrollIndicator = document.getElementById('scrollIndicator');

if (scrollIndicator) {
  setTimeout(function() {
    scrollIndicator.classList.add('fade-out');
  }, 4000);

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      scrollIndicator.classList.add('fade-out');
    }
  });
}

// ============================================================
// FAQ TOGGLE (Individual)
// ============================================================
document.querySelectorAll('.faq-question-btn').forEach(function(button) {
  button.addEventListener('click', function() {
    var expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
    this.setAttribute('aria-expanded', expanded);
    var answer = this.nextElementSibling;
    var icon = this.querySelector('.faq-icon svg');

    if (expanded === 'true') {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.opacity = '1';
      answer.style.padding = '0 22px 18px';
      if (icon) {
        icon.style.transform = 'rotate(180deg)';
      }
    } else {
      answer.style.maxHeight = '0';
      answer.style.opacity = '0';
      answer.style.padding = '0 22px';
      if (icon) {
        icon.style.transform = 'rotate(0deg)';
      }
    }
  });
});

document.querySelectorAll('.faq-answer').forEach(function(answer) {
  answer.style.maxHeight = '0';
  answer.style.opacity = '0';
  answer.style.padding = '0 22px';
  answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
  answer.style.overflow = 'hidden';
});

// ============================================================
// CONTACT FORM
// ============================================================
(function() {
  var contactForm = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var btnText = document.getElementById('btnText');
  var btnSpinner = document.getElementById('btnSpinner');
  var formStatus = document.getElementById('formStatus');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Honeypot check
    var honeypot = contactForm.querySelector('#company');
    if (honeypot && honeypot.value.trim() !== '') {
      return;
    }

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';
    formStatus.style.display = 'none';

    var formData = new FormData(this);

    try {
      var response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Your message has been sent successfully! I will get back to you soon.';
        formStatus.style.display = 'block';
        this.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Failed to send message. Please try again later.';
      formStatus.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
      setTimeout(function() {
        formStatus.style.display = 'none';
      }, 5000);
    }
  });
})();

// ============================================================
// FAQ SECTION - TOGGLE ALL FAQS WITH TITLE CLICK (NEW)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  var faqToggleBtn = document.getElementById('faqToggleBtn');
  var faqListWrapper = document.getElementById('faqListWrapper');
  var faqToggleIcon = document.getElementById('faqToggleIcon');

  if (faqToggleBtn && faqListWrapper) {
    faqToggleBtn.addEventListener('click', function() {
      var isHidden = faqListWrapper.style.display === 'none';
      
      if (isHidden) {
        faqListWrapper.style.display = 'block';
        faqToggleIcon.style.transform = 'rotate(180deg)';
      } else {
        faqListWrapper.style.display = 'none';
        faqToggleIcon.style.transform = 'rotate(0deg)';
      }
    });
  }
});

// ============================================================
// AUTO COPYRIGHT YEAR (Backup)
// ============================================================
// This is also handled in the HTML script block
