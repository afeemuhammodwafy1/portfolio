/* ============================================================
   Afee Muhammod Wafy — Master Script
   Home + Projects Hub + Case Studies
   ============================================================ */
(function(){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- current year (multiple spots) ---------- */
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* ---------- header scroll state + back to top ---------- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');

  function onScroll(){
    if(header) header.classList.toggle('is-scrolled', window.scrollY > 12);
    if(toTop) toTop.classList.toggle('is-visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  if(toTop){
    toTop.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById('nav-toggle');
  var mobile = document.getElementById('nav-links');

  function setMenuState(open){
    if(!menuBtn || !mobile) return;
    menuBtn.classList.toggle('active', open);
    mobile.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobile.setAttribute('aria-hidden', String(!open));
  }

  function closeMenu(){ setMenuState(false); }

  if(menuBtn && mobile){
    menuBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      setMenuState(!mobile.classList.contains('open'));
    });
    mobile.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function(e){
      if(!mobile.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.12, rootMargin:'0px 0px -35px 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- hero typing sequence (home) ---------- */
  var role = document.getElementById('hero-typing-text');
  if(role && !reduceMotion){
    var roles = ['Web Developer', 'Science Student', 'Self-Taught Learner'];
    var ri = 0, pos = 0, del = false;

    function type(){
      var s = roles[ri];
      if(del){
        role.textContent = s.substring(0, pos - 1);
        pos--;
      } else {
        role.textContent = s.substring(0, pos + 1);
        pos++;
      }
      var speed = del ? 45 : 90;
      if(!del && pos === s.length){ speed = 1700; del = true; }
      else if(del && pos === 0){ del = false; ri = (ri + 1) % roles.length; speed = 400; }
      setTimeout(type, speed);
    }
    type();
  }

  /* ---------- contact form (Formspree) ---------- */
  var form = document.getElementById('contact-form');
  if(form){
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(form.company && form.company.value) return;

      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : '';
      if(btn){ btn.disabled = true; btn.textContent = 'Sending...'; }
      if(status){ status.textContent = ''; status.className = 'form-status'; }

      fetch(form.action, {
        method:'POST',
        body: new FormData(form),
        headers: { 'Accept':'application/json' }
      }).then(function(res){
        if(!res.ok) throw new Error('Request failed');
        if(status){
          status.textContent = "Message sent — thanks for reaching out. I'll reply soon.";
          status.className = 'form-status ok';
        }
        form.reset();
      }).catch(function(){
        if(status){
          status.textContent = 'Something went wrong. Please email me directly instead.';
          status.className = 'form-status err';
        }
      }).finally(function(){
        if(btn){ btn.disabled = false; btn.textContent = original; }
      });
    });
  }

  /* ---------- cursor + spotlight (desktop only) ---------- */
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  var spot = document.querySelector('.spotlight');
  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  var rx = mx, ry = my;
  var isFinePointer = window.matchMedia('(pointer:fine)').matches;
  var isMobile = window.matchMedia('(max-width:600px)').matches;

  if(!reduceMotion && isFinePointer && !isMobile && (dot || ring || spot)){
    window.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      if(dot){ dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
      if(spot){ spot.style.left = mx + 'px'; spot.style.top = my + 'px'; }
    }, { passive:true });

    function cursorLoop(){
      rx += (mx - rx) * .14;
      ry += (my - ry) * .14;
      if(ring){ ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      requestAnimationFrame(cursorLoop);
    }
    if(ring) cursorLoop();
  } else {
    if(dot) dot.style.display = 'none';
    if(ring) ring.style.display = 'none';
  }

  /* cursor grow on interactive elements */
  if(ring){
    var hoverTargets = 'a,button,.focus-card,.project-card,.p-card,.cs-feature-card';
    document.querySelectorAll(hoverTargets).forEach(function(el){
      el.addEventListener('mouseenter', function(){
        ring.style.width = '46px';
        ring.style.height = '46px';
        ring.style.opacity = '.7';
      });
      el.addEventListener('mouseleave', function(){
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.opacity = '1';
      });
    });
  }

  /* ============================================================
     PICTURE PAGE — lightbox
     ============================================================ */
  var photoCards = Array.prototype.slice.call(document.querySelectorAll('.photo-card'));
  var lightbox = document.getElementById('lightbox');
  var lbImage = document.getElementById('lb-image');
  var lbTitle = document.getElementById('lb-title');
  var lbDesc = document.getElementById('lb-desc');
  var lbIndex = document.getElementById('lb-index');
  var lbClose = document.getElementById('lb-close');
  var lbPrev = document.getElementById('lb-prev');
  var lbNext = document.getElementById('lb-next');
  var currentPhoto = 0;

  function openPhoto(index){
    if(!lightbox || !photoCards.length) return;
    currentPhoto = (index + photoCards.length) % photoCards.length;
    var card = photoCards[currentPhoto];
    var img = card.querySelector('img');
    if(!img) return;

    lbImage.src = img.currentSrc || img.src;
    lbImage.alt = img.alt || card.dataset.title || '';
    if(lbTitle) lbTitle.textContent = card.dataset.title || '';
    if(lbDesc) lbDesc.textContent = card.dataset.desc || '';
    if(lbIndex) lbIndex.textContent = String(currentPhoto + 1).padStart(2,'0') + ' / ' + String(photoCards.length).padStart(2,'0');

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('lb-open');
    if(lbClose) lbClose.focus();
  }

  function closePhoto(){
    if(!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lb-open');
    if(lbImage) lbImage.src = '';
  }

  if(photoCards.length && lightbox){
    photoCards.forEach(function(card){
      card.addEventListener('click', function(){ openPhoto(Number(card.dataset.index) || 0); });
      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openPhoto(Number(card.dataset.index) || 0);
        }
      });
    });

    if(lbClose) lbClose.addEventListener('click', closePhoto);
    if(lbPrev) lbPrev.addEventListener('click', function(){ openPhoto(currentPhoto - 1); });
    if(lbNext) lbNext.addEventListener('click', function(){ openPhoto(currentPhoto + 1); });
    lightbox.addEventListener('click', function(e){
      if(e.target === lightbox) closePhoto();
    });
  }

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      closeMenu();
      closePhoto();
      return;
    }
    if(!lightbox || !lightbox.classList.contains('open')) return;
    if(e.key === 'ArrowLeft') openPhoto(currentPhoto - 1);
    if(e.key === 'ArrowRight') openPhoto(currentPhoto + 1);
  });

  /* ============================================================
     PROJECTS HUB — filter
     ============================================================ */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var pCards = document.querySelectorAll('.p-card');
  var emptyState = document.getElementById('empty-state');

  if(filterBtns.length && pCards.length){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        var visible = 0;
        pCards.forEach(function(card){
          var cats = (card.getAttribute('data-categories') || '').split(' ');
          var show = filter === 'all' || cats.indexOf(filter) !== -1;
          card.style.display = show ? '' : 'none';
          if(show) visible++;
        });
        if(emptyState) emptyState.style.display = visible === 0 ? '' : 'none';
      });
    });
  }

  /* ============================================================
     CASE STUDY — smooth scroll for TOC + active link
     ============================================================ */
  var csNavLinks = document.querySelectorAll('.cs-nav-list a');
  if(csNavLinks.length){
    csNavLinks.forEach(function(link){
      link.addEventListener('click', function(e){
        var href = link.getAttribute('href');
        if(!href || href.charAt(0) !== '#') return;
        var target = document.querySelector(href);
        if(!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', href);
      });
    });

    var csSections = document.querySelectorAll('.cs-section');
    if('IntersectionObserver' in window && csSections.length){
      var csIo = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var id = '#' + entry.target.id;
            csNavLinks.forEach(function(link){
              link.classList.toggle('active', link.getAttribute('href') === id);
            });
          }
        });
      }, { threshold:.25, rootMargin:'-100px 0px -60% 0px' });
      csSections.forEach(function(s){ if(s.id) csIo.observe(s); });
    }
  }

})();