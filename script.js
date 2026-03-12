document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 120;

    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  const interactives = document.querySelectorAll(
    "a, button, .btn-touch, .project-card, .skill",
  );

  if (window.innerWidth > 900) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

      setTimeout(() => {
        follower.style.left = e.clientX + "px";
        follower.style.top = e.clientY + "px";
      }, 50);
    });

    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("hovering"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("hovering"),
      );
    });
  }

  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const themeText = themeToggle.querySelector(".theme-text");
  const themeKanji = themeToggle.querySelector(".kanji-theme");

  const enableLightMode = () => {
    body.classList.add("light-mode");
    themeText.textContent = "DARK";
    themeKanji.textContent = "夜";
    localStorage.setItem("theme", "light");
  };

  const enableDarkMode = () => {
    body.classList.remove("light-mode");
    themeText.textContent = "LIGHT";
    themeKanji.textContent = "昼";
    localStorage.setItem("theme", "dark");
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    enableLightMode();
  }

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
      enableDarkMode();
    } else {
      enableLightMode();
    }
  });

  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");
  const navItems = navLinks.querySelectorAll("a");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("is-active");
    navLinks.classList.toggle("active");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuToggle.classList.remove("is-active");
      navLinks.classList.remove("active");
    });
  });
});
