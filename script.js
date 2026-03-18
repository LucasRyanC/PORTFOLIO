(() => {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  const navToggle = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-item");
  const themeBtn = document.getElementById("theme-toggle");
  const kanjiTheme = document.querySelector(".kanji-theme");
  const themeText = document.querySelector(".theme-text");

  let mouseX = 0,
    mouseY = 0,
    followerX = 0,
    followerY = 0;
  let isHovering = false,
    hoverDelay = null;
  let scrollTimeout = null;

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  let currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");

  const updateTheme = () => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "light") {
      document.body.classList.add("light-mode");
      kanjiTheme.textContent = "夜";
      themeText.textContent = "DARK";
    } else {
      document.body.classList.remove("light-mode");
      kanjiTheme.textContent = "昼";
      themeText.textContent = "LIGHT";
    }
  };

  updateTheme();

  themeBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    updateTheme();
    localStorage.setItem("theme", currentTheme);
  });

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("is-active");
    navLinks.classList.toggle("active");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navToggle.classList.remove("is-active");
      navLinks.classList.remove("active");
    });
  });

  const kanjiIcons = document.querySelectorAll(".kanji-theme");

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTimeout) {
        scrollTimeout = requestAnimationFrame(() => {
          scrollTimeout = null;
        });
      }
    },
    { passive: true },
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  if (!isTouchDevice && cursor && follower) {
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    const interactables = document.querySelectorAll(
      "a, button, .project-card, .skill",
    );

    interactables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        isHovering = true;
        document.body.classList.add("hovering");
      });
      el.addEventListener("mouseleave", () => {
        isHovering = false;
        document.body.classList.remove("hovering");
      });
    });

    const animateCursor = () => {
      if (!isHovering) {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        followerX += dx * 0.15;
        followerY += dy * 0.15;
      } else {
        followerX = mouseX;
        followerY = mouseY;
      }

      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }
})();
