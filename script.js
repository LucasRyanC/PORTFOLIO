(() => {
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  const navToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const themeBtn = document.querySelector(".theme-btn");

  let mouseX = 0,
    mouseY = 0,
    followerX = 0,
    followerY = 0,
    hoverDelay = null,
    isHovering = false,
    lastScrollY = window.scrollY,
    scrollLockTimeout = null,
    lastKeyBoardAction = 0,
    currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
  let lastHoverElement = null;
  let hoverTimeout = null;

  const updateTheme = () => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  };
  updateTheme();

  const handleMouseMove = (e) => {
    if (!cursor || !follower) return;
    const rect = cursor.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  };
  const handleMouseEnter = () => {
    if (!follower) return;
    if (isHovering) {
      clearTimeout(hoverDelay);
    } else {
      isHovering = true;
      document.body.classList.add("hovering");
      hoverDelay = setTimeout(() => {
        isHovering = false;
        document.body.classList.remove("hovering");
      }, 150);
    }
  };
  const handleMouseLeave = () => {
    if (!follower) return;
    clearTimeout(hoverDelay);
    isHovering = false;
    document.body.classList.remove("hovering");
  };
  const handleTouchStart = () => {
    document.body.classList.remove("hovering");
    isHovering = false;
    clearTimeout(hoverDelay);
  };
  const handleScroll = () => {
    if (scrollLockTimeout) {
      clearTimeout(scrollLockTimeout);
      scrollLockTimeout = setTimeout(() => {
        lastScrollY = window.scrollY;
      }, 30);
      return;
    }
    const direction = window.scrollY > lastScrollY ? "down" : "up";
    const icons = document.querySelectorAll(".kanji-theme");
    if (direction === "down") {
      icons.forEach((icon) => icon.classList.add("fade-in"));
    } else {
      icons.forEach((icon) => icon.classList.remove("fade-in"));
    }
    lastScrollY = window.scrollY;
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseenter", handleMouseEnter);
  window.addEventListener("mouseleave", handleMouseLeave);
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });

  const animate = () => {
    if (!cursor || !follower) return;

    if (!isHovering) {
      followerX = mouseX;
      followerY = mouseY;
    }

    const dx = followerX - mouseX;
    const dy = mouseY - followerY;
    followerX += dx * 0.15;
    followerY += dy * 0.15;

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate3d(-50%, -50%, 0)`;

    const now = performance.now();
    if (now - lastKeyBoardAction < 50) return;
    lastKeyBoardAction = now;

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);

  const handleNavToggle = () => {
    if (!navToggle || !navLinks) return;
    navToggle.classList.toggle("is-active");
    navLinks.classList.toggle("active");
  };
  navToggle.addEventListener("click", handleNavToggle);

  const handleThemeToggle = () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    updateTheme();
    localStorage.setItem("theme", currentTheme);
  };
  themeBtn.addEventListener("click", handleThemeToggle);
  window.addEventListener("keydown", (e) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleThemeToggle();
    }
  });

  const observeElements = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 },
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => {
      if (!el.classList.contains("active")) {
        observer.observe(el);
      } else {
        observer.unobserve(el);
      }
    });
  };
  observeElements();

  window.addEventListener("load", () => {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((reveal) => {
      if (reveal.getBoundingClientRect().top < window.innerHeight * 0.9) {
        reveal.classList.add("active");
      }
    });
  });
})();
