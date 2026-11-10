(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = root.classList.toggle("theme-dark");
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    });
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.querySelector(".site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* ---------- scroll progress + back to top ---------- */
  var bar = document.querySelector(".scroll-progress");
  var toTop = document.getElementById("back-to-top");
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  /* ---------- active nav link ---------- */
  var links = document.querySelectorAll(".site-nav a");
  var sections = [];
  links.forEach(function (a) {
    var s = document.querySelector(a.getAttribute("href"));
    if (s) sections.push({ link: a, el: s });
  });
  function updateActive() {
    var current = null;
    sections.forEach(function (s) {
      if (s.el.getBoundingClientRect().top < 140) current = s;
    });
    // at the very bottom the last section may never reach the top
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (a) { a.classList.remove("active"); });
    if (current) current.link.classList.add("active");
  }
  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  /* ---------- news show more / less ---------- */
  var newsBtn = document.getElementById("news-toggle");
  var newsList = document.querySelector(".news-list");
  if (newsBtn && newsList) {
    if (!newsList.querySelector(".extra")) newsBtn.hidden = true;
    newsBtn.addEventListener("click", function () {
      var open = newsList.classList.toggle("expanded");
      newsBtn.innerHTML = open
        ? 'Show less <i class="fa-solid fa-chevron-up"></i>'
        : 'Show more <i class="fa-solid fa-chevron-down"></i>';
    });
  }

  /* ---------- typing effect ---------- */
  var typed = document.querySelector(".typed");
  if (typed) {
    var words = (typed.getAttribute("data-words") || "").split("|").filter(Boolean);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (words.length && !reduce) {
      var wi = 0, ci = 0, deleting = false;
      (function tick() {
        var w = words[wi];
        ci += deleting ? -1 : 1;
        typed.textContent = w.slice(0, ci);
        var delay = deleting ? 40 : 80;
        if (!deleting && ci === w.length) { deleting = true; delay = 1600; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
        setTimeout(tick, delay);
      })();
    } else if (words.length) {
      typed.textContent = words[0];
    }
  }

  /* ---------- reveal on scroll ---------- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("rv-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("rv-in"); });
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
