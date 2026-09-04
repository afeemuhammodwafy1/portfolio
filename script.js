// ============================================================
// Afee Muhammod Wafy — Portfolio interactions
// ============================================================
(function(){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* ---------- nav scroll state + mobile toggle ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  var scrollTicking = false;
  function onScroll(){
    if(!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
    toggleTop();
  }
  function onScrollRaf(){
    if(scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function(){
      onScroll();
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', onScrollRaf, { passive:true });
  onScroll();

  if(toggle && links){
    toggle.addEventListener('click', function(e){
      e.stopPropagation();
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded','false');
      });
    });

    document.addEventListener('click', function(e){
      if(!links.contains(e.target) && !toggle.contains(e.target)){
        links.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  /* ---------- back to top ---------- */
  var toTop = document.querySelector('.to-top');
  function toggleTop(){
    if(!toTop) return;
    toTop.classList.toggle('is-visible', window.scrollY > 500);
  }
  if(toTop){
    toTop.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.12, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- hero role typing sequence ---------- */
  var roleEl = document.getElementById('hero-typing-text');
  if(roleEl){
    var roles = [
      'Web Developer',
      'Science Student',
      'Self-Taught Learner'
    ];
    var rIndex = 0, charPos = 0, isDeleting = false;

    function typeRole(){
      if(reduceMotion){
        roleEl.textContent = roles[0];
        return;
      }
      var currentRole = roles[rIndex];
      
      if(isDeleting){
        roleEl.textContent = currentRole.substring(0, charPos - 1);
        charPos--;
      } else {
        roleEl.textContent = currentRole.substring(0, charPos + 1);
        charPos++;
      }

      var speed = isDeleting ? 45 : 90;

      if(!isDeleting && charPos === currentRole.length){
        speed = 1800;
        isDeleting = true;
      } else if(isDeleting && charPos === 0){
        isDeleting = false;
        rIndex = (rIndex + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeRole, speed);
    }

    typeRole();
  }

  /* ---------- project filters (projects/index page) ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  if(filterBtns.length && projectCards.length){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        projectCards.forEach(function(card){
          var cats = (card.getAttribute('data-categories') || '').split(' ');
          var show = filter === 'all' || cats.indexOf(filter) !== -1;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if(!q || !a) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function(other){
        if(other !== item){
          other.classList.remove('is-open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        }
      });
      if(isOpen){
        item.classList.remove('is-open');
        a.style.maxHeight = null;
        q.setAttribute('aria-expanded','false');
      } else {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded','true');
      }
    });
  });

  /* ---------- contact form (Formspree AJAX) ---------- */
  var form = document.getElementById('contact-form');
  if(form){
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(form.company && form.company.value){ return; }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      if(status){ status.textContent = ''; status.className = 'form-status'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function(res){
        if(res.ok){
          if(status){ status.textContent = 'Message sent — thanks for reaching out. I\'ll reply soon.'; status.className = 'form-status ok'; }
          form.reset();
        } else {
          throw new Error('Request failed');
        }
      }).catch(function(){
        if(status){ status.textContent = 'Something went wrong. Please email me directly instead.'; status.className = 'form-status err'; }
      }).finally(function(){
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      });
    });
  }

})();