(function () {
  "use strict";

  function setViewportHeightUnit() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
  }

  setViewportHeightUnit();
  var resizeTimer;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        setViewportHeightUnit();
        closeMenuIfDesktop();
      }, 120);
    },
    { passive: true }
  );
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      setViewportHeightUnit();
      closeMenuIfDesktop();
    }, 200);
  });

  function closeMenuIfDesktop() {
    if (window.innerWidth > 900 && document.body.classList.contains("menu-is-open")) {
      document.body.classList.remove("menu-is-open");
      var t = document.querySelector(".s-header__menu-toggle");
      if (t) {
        t.setAttribute("aria-expanded", "false");
        t.setAttribute("aria-label", "Open menu");
      }
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var toggle = document.querySelector(".s-header__menu-toggle");
  var nav = document.querySelector(".s-header__nav");

  function setMenuOpen(open) {
    document.body.classList.toggle("menu-is-open", open);
    if (nav) {
      nav.classList.toggle("is-open", open);
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenuOpen(!document.body.classList.contains("menu-is-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
  }

  var filterButtons = document.querySelectorAll(".works-filter__btn");
  var folioItems = document.querySelectorAll(".folio-item");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterButtons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });

      folioItems.forEach(function (item) {
        var cat = item.getAttribute("data-category");
        var show = filter === "all" || cat === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  function animateCount(el, target, duration) {
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = String(target);
      }
    }

    requestAnimationFrame(step);
  }

  var countEls = document.querySelectorAll(".js-count[data-count]");
  if (countEls.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          if (!isNaN(target)) {
            animateCount(el, target, 1000);
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );
    countEls.forEach(function (el) {
      obs.observe(el);
    });
  }

  var resumeModal = document.getElementById("resume-modal");
  var resumeOpenBtn = document.querySelector(".js-resume-modal-open");
  var resumeIframe = document.getElementById("resume-modal-iframe");
  var resumePdfSrc = "assets/Resume/Arangulavan_Rajendran.pdf";

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add("is-open");
    resumeModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("resume-modal-is-open");
    if (resumeIframe) {
      var src = resumeIframe.getAttribute("src") || "";
      if (!src || src === "about:blank") {
        resumeIframe.setAttribute("src", resumePdfSrc);
      }
    }
    var closeBtn = resumeModal.querySelector(".js-resume-modal-close-btn");
    if (closeBtn) closeBtn.focus();
  }

  function closeResumeModal() {
    if (!resumeModal || !resumeModal.classList.contains("is-open")) return;
    resumeModal.classList.remove("is-open");
    resumeModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("resume-modal-is-open");
    if (resumeOpenBtn) resumeOpenBtn.focus();
  }

  if (resumeModal && resumeOpenBtn) {
    resumeOpenBtn.addEventListener("click", openResumeModal);
    resumeModal.querySelectorAll(".js-resume-modal-close").forEach(function (el) {
      el.addEventListener("click", closeResumeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && resumeModal.classList.contains("is-open")) {
        closeResumeModal();
      }
    });
  }

  var eduSection = document.querySelector(".s-edu");
  if (eduSection) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      eduSection.classList.add("is-visible");
    } else if ("IntersectionObserver" in window) {
      var eduObs = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              eduSection.classList.add("is-visible");
              observer.unobserve(eduSection);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
      );
      eduObs.observe(eduSection);
    } else {
      eduSection.classList.add("is-visible");
    }
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var headerEl = document.querySelector(".s-header");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section.section-pad"));
  var navLinks = document.querySelectorAll('.s-header__menu-links a[href^="#"]');

  function setActiveNav(targetId) {
    if (!targetId) return;
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + targetId;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window && sections.length) {
    sections.forEach(function (section) {
      if (!section.classList.contains("s-edu")) {
        section.classList.add("is-reveal-ready");
      }
    });

    var sectionRevealObs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    sections.forEach(function (section) {
      if (!section.classList.contains("s-edu")) {
        sectionRevealObs.observe(section);
      }
    });
  } else {
    sections.forEach(function (section) {
      section.classList.add("is-visible");
    });
  }

  if ("IntersectionObserver" in window) {
    var allSections = document.querySelectorAll("main section[id]");
    if (allSections.length) {
      var activeSectionObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActiveNav(entry.target.id);
            }
          });
        },
        { threshold: 0.45, rootMargin: "-30% 0px -45% 0px" }
      );

      allSections.forEach(function (section) {
        activeSectionObs.observe(section);
      });
    }
  }

  var lastY = window.scrollY;
  var ticking = false;
  var animatedSections = document.querySelectorAll("main section[id]");
  function applyScrollEffects() {
    var currentY = window.scrollY;

    if (headerEl) {
      document.body.classList.toggle("is-scrolled", currentY > 10);
      if (!document.body.classList.contains("menu-is-open")) {
        if (currentY > lastY + 10 && currentY > 130) {
          document.body.classList.add("header-is-hidden");
        } else if (currentY < lastY - 10) {
          document.body.classList.remove("header-is-hidden");
        }
      }
    }

    animatedSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var triggerTop = window.innerHeight * 0.85;
      var isInView = rect.top < triggerTop && rect.bottom > 0;
      section.classList.toggle("show-animate", isInView);
    });

    lastY = currentY;
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyScrollEffects);
  }

  applyScrollEffects();
  window.addEventListener("scroll", onScroll, { passive: true });

  function initIntroNetworkBackground() {
    var section = document.querySelector(".s-intro");
    var canvas = document.getElementById("intro-network-canvas");
    if (!section || !canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var points = [];
    var spacing = 110;
    var range = 26;
    var target = { x: 0, y: 0 };
    var sectionVisible = true;

    function createPoints() {
      points = [];
      var cols = Math.ceil(width / spacing);
      var rows = Math.ceil(height / spacing);
      for (var cx = 0; cx <= cols; cx++) {
        for (var cy = 0; cy <= rows; cy++) {
          var ox = cx * spacing + Math.random() * spacing * 0.45;
          var oy = cy * spacing + Math.random() * spacing * 0.45;
          points.push({
            x: ox,
            y: oy,
            ox: ox,
            oy: oy,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            active: 0
          });
        }
      }
    }

    function resizeCanvas() {
      var rect = section.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = width;
      canvas.height = height;
      target.x = width / 2;
      target.y = height / 2;
      createPoints();
    }

    function updateVisibility() {
      var rect = section.getBoundingClientRect();
      sectionVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    }

    function onMove(e) {
      var rect = canvas.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    }

    function animateNetwork() {
      requestAnimationFrame(animateNetwork);
      if (!sectionVisible) return;

      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < p.ox - range || p.x > p.ox + range) p.vx *= -1;
        if (p.y < p.oy - range || p.y > p.oy + range) p.vy *= -1;

        var dx = target.x - p.x;
        var dy = target.y - p.y;
        var d = dx * dx + dy * dy;
        if (d < 6000) p.active = 0.28;
        else if (d < 18000) p.active = 0.13;
        else if (d < 36000) p.active = 0.05;
        else p.active = 0;
      }

      for (var a = 0; a < points.length; a++) {
        var p1 = points[a];
        if (!p1.active) continue;

        for (var b = a + 1; b < points.length; b++) {
          var p2 = points[b];
          var pdx = p1.x - p2.x;
          var pdy = p1.y - p2.y;
          var pd = pdx * pdx + pdy * pdy;
          if (pd < 9000) {
            var alpha = Math.min(p1.active, p2.active) * 0.9;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(156,217,249," + alpha + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(156,217,249," + Math.max(0.12, p1.active + 0.1) + ")";
        ctx.fill();
      }
    }

    resizeCanvas();
    updateVisibility();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    animateNetwork();
  }

  initIntroNetworkBackground();

})();
