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

  /* ---------- terminal typing sequence (hero signature) ---------- */
  var typedEl = document.getElementById('typed-line');
  var termOut = document.getElementById('terminal-output');
  if(typedEl && termOut){
    var script = [
      { cmd: 'whoami', out: 'Afee Muhammod Wafy' },
      { cmd: 'cat role.txt', out: 'Science Student & Web Developer' },
      { cmd: 'ls focus/', out: 'python  flask  javascript  ai-exploration' },
      { cmd: 'status --current', out: 'available for collaborations ✓' }
    ];
    var lineIndex = 0, charIndex = 0, phase = 'type';

    function typeStep(){
      if(reduceMotion){
        renderAllStatic();
        return;
      }
      var current = script[lineIndex];
      if(phase === 'type'){
        typedEl.textContent = current.cmd.slice(0, charIndex);
        charIndex++;
        if(charIndex > current.cmd.length){
          phase = 'pause-before-out';
          setTimeout(typeStep, 320);
          return;
        }
        setTimeout(typeStep, 42 + Math.random()*40);
      } else if(phase === 'pause-before-out'){
        var outLine = document.createElement('div');
        outLine.className = 'line out';
        outLine.textContent = current.out;
        termOut.appendChild(outLine);
        phase = 'hold';
        setTimeout(typeStep, 900);
      } else if(phase === 'hold'){
        lineIndex++;
        charIndex = 0;
        typedEl.textContent = '';
        if(lineIndex >= script.length){
          phase = 'done';
          return;
        }
        var promptLine = document.createElement('div');
        promptLine.className = 'line';
        promptLine.innerHTML = '<span class="prompt">wafy@dev</span>:<span class="accent">~$</span> ';
        var span = document.createElement('span');
        span.id = 'typed-line-' + lineIndex;
        promptLine.appendChild(span);
        termOut.appendChild(promptLine);
        typedEl = span;
        phase = 'type';
        setTimeout(typeStep, 300);
      }
    }

    function renderAllStatic(){
      termOut.innerHTML = '';
      script.forEach(function(s){
        var p = document.createElement('div');
        p.className = 'line';
        p.innerHTML = '<span class="prompt">wafy@dev</span>:<span class="accent">~$</span> ' + s.cmd;
        var o = document.createElement('div');
        o.className = 'line out';
        o.textContent = s.out;
        termOut.appendChild(p);
        termOut.appendChild(o);
      });
    }

    setTimeout(typeStep, 500);
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