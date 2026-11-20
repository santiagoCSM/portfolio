/* =========================================================
   Portafolio personal · JavaScript
   Vanilla JS, cero dependencias. Animación mínima y sobria.
   ========================================================= */

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const header = document.querySelector(".site-header");
const mobileQuery = window.matchMedia("(max-width: 800px)");
const navLinks = [...nav.querySelectorAll("a")];

const syncNav = () => {
  const isOpen = mobileQuery.matches && nav.classList.contains("open");
  nav.inert = mobileQuery.matches && !isOpen;
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  header.style.setProperty("--header-height", header.offsetHeight + "px");
};

const closeNav = () => {
  nav.classList.remove("open");
  syncNav();
};

navToggle.addEventListener("click", () => {
  if (!mobileQuery.matches) return;
  nav.classList.toggle("open");
  syncNav();
  if (nav.classList.contains("open")) navLinks[0]?.focus();
});

navLinks.forEach((link) => link.addEventListener("click", closeNav));

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
  if (!mobileQuery.matches) nav.classList.remove("open");
  syncNav();
});

syncNav();

/* ---------- Header hairline on scroll ---------- */
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Scroll reveal (fade-up sobrio) ---------- */
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  // Solo ocultar elementos cuando el observador esté listo.
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  document.documentElement.classList.add("js");
}
