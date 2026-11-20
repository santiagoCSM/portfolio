/* =========================================================
   Portafolio personal · JavaScript
   Vanilla JS, cero dependencias. Animación mínima y sobria.
   ========================================================= */

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

const closeNav = () => {
  nav.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", closeNav)
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeNav();
    navToggle.focus();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !navToggle.contains(event.target)) {
    closeNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 800) closeNav();
});

/* ---------- Header hairline on scroll ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Scroll reveal (fade-up sobrio) ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
