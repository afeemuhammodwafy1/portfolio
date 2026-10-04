/* Afee Muhammod Wafy — portfolio behaviour. Everything here is progressive
   enhancement: the pages are fully readable without JavaScript. */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;

  /* ---- Footer year ---- */
  var y = doc.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Hero role rotation ---- */
  var roleText = doc.getElementById("role-text");
  if (roleText) {
    var roles = ["Web Developer", "Science Student", "Self-Taught Learner"];
    var roleIndex = 0;
    setInterval(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.classList.add("is-changing");
      setTimeout(function () {
        roleText.textContent = roles[roleIndex];
        roleText.classList.remove("is-changing");
      }, 180);
    }, 2600);
  }

  /* ---- Header shadow + back to top ---- */
  var header = doc.querySelector(".site-header");
  var toTop = doc.getElementById("to-top");
  function onScroll() {
    var s = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", s > 8);
    if (toTop) toTop.classList.toggle("is-visible", s > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  /* ---- Mobile menu ---- */
  var menuBtn = doc.getElementById("menu-btn");
  var menu = doc.getElementById("mobile-menu");
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    doc.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    matchMedia("(min-width: 881px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });
  }

  /* ---- Active section in nav (home) ---- */
  var navLinks = doc.querySelectorAll(".primary a[data-section]");
  if (navLinks.length && "IntersectionObserver" in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.dataset.section] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
  }

  /* ---- Experience duration ---- */
  doc.querySelectorAll("[data-since]").forEach(function (el) {
    var p = el.dataset.since.split("-");
    var start = new Date(+p[0], +p[1] - 1, 1), now = new Date();
    var months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (months < 1) months = 1;
    var yrs = Math.floor(months / 12), mo = months % 12, out = [];
    if (yrs) out.push(yrs + (yrs === 1 ? " yr" : " yrs"));
    if (mo) out.push(mo + " mo");
    el.textContent = out.join(" ");
  });

  /* ---- Copy email ---- */
  var copyBtn = doc.getElementById("copy-email");
  if (copyBtn && navigator.clipboard) {
    var label = copyBtn.querySelector("span");
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(copyBtn.dataset.email).then(function () {
        label.textContent = "Email copied";
        setTimeout(function () { label.textContent = "Copy email"; }, 2000);
      });
    });
  } else if (copyBtn) {
    copyBtn.hidden = true;
  }

  /* ---- Formspree contact form ---- */
  var contactForm = doc.getElementById("contact-form");
  if (contactForm) {
    var formStatus = doc.getElementById("form-status");
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      var label = submitBtn && submitBtn.querySelector("span");
      if (submitBtn) submitBtn.disabled = true;
      if (label) label.textContent = "Sending…";
      if (formStatus) formStatus.textContent = "";
      fetch(contactForm.action, { method: "POST", body: new FormData(contactForm), headers: { "Accept": "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error("Request failed"); return r.json(); })
        .then(function () {
          contactForm.reset();
          if (formStatus) { formStatus.textContent = "Message sent successfully. Thank you."; formStatus.className = "form-status is-success"; }
        })
        .catch(function () {
          if (formStatus) { formStatus.textContent = "Something went wrong. Please try again or email me directly."; formStatus.className = "form-status is-error"; }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (label) label.textContent = "Send message";
        });
    });
  }

  /* ---- Project filters ---- */
  var filterBar = doc.querySelector("[data-filters]");
  if (filterBar) {
    var items = doc.querySelectorAll("[data-tags]");
    var status = doc.getElementById("filter-status");
    filterBar.hidden = false;
    filterBar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-filter]");
      if (!b) return;
      var f = b.dataset.filter, shown = 0;
      filterBar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      items.forEach(function (it) {
        var ok = f === "all" || it.dataset.tags.split(" ").indexOf(f) > -1;
        it.hidden = !ok;
        if (ok) shown++;
      });
      if (status) status.textContent = "Showing " + shown + (shown === 1 ? " project" : " projects") + (f === "all" ? "" : " for " + b.textContent.trim());
    });
  }

  /* ---- On-this-page highlight (case studies) ---- */
  var tocLinks = doc.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var tmap = {};
    tocLinks.forEach(function (a) { tmap[a.getAttribute("href").slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var a = tmap[en.target.id];
          if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-20% 0px -65% 0px" });
    Object.keys(tmap).forEach(function (id) { var s = doc.getElementById(id); if (s) tio.observe(s); });
  }

  /* ---- Lightbox (pictures) ---- */
  var lb = doc.getElementById("lightbox");
  var shots = doc.querySelectorAll(".shot button");
  if (lb && shots.length && typeof lb.showModal === "function") {
    var img = doc.getElementById("lb-img"), title = doc.getElementById("lb-title"),
        desc = doc.getElementById("lb-desc"), count = doc.getElementById("lb-count");
    var idx = 0, opener = null;
    function show(i) {
      idx = (i + shots.length) % shots.length;
      var b = shots[idx];
      img.src = b.dataset.full;
      img.alt = b.querySelector("img").alt;
      title.textContent = b.dataset.title;
      desc.textContent = b.dataset.desc;
      count.textContent = (idx + 1) + " of " + shots.length;
    }
    shots.forEach(function (b, i) {
      b.addEventListener("click", function () { opener = b; show(i); lb.showModal(); });
    });
    doc.getElementById("lb-close").addEventListener("click", function () { lb.close(); });
    doc.getElementById("lb-prev").addEventListener("click", function () { show(idx - 1); });
    doc.getElementById("lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", function () { img.removeAttribute("src"); if (opener) opener.focus(); });
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    }, { passive: true });
  }
})();
