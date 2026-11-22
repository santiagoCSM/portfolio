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


/* ---------- Notas que siguen las capas reales de la vista 3D ---------- */
/* Leemos la caja proyectada de cada capa: así la etiqueta conserva su
   altura correcta aunque la maqueta flote, gire o cambie de tamaño. */
const archScene = document.querySelector(".arch-scene");

if (archScene) {
  const pairs = [
    [".arch-plate--ui", ".arch-note--interface", "right"],
    [".arch-plate--layout", ".arch-note--components", "left"],
    [".arch-plate--logic", ".arch-note--logic", "right"],
    [".arch-plate--data", ".arch-note--data", "left"],
  ].map(([plateSelector, noteSelector, side]) => ({
    plate: archScene.querySelector(plateSelector),
    note: archScene.querySelector(noteSelector),
    side,
  })).filter(({ plate, note }) => plate && note);

  if (pairs.length === 4) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let isVisible = true;

    const alignNotes = () => {
      const sceneRect = archScene.getBoundingClientRect();
      if (!sceneRect.width || !sceneRect.height) return;

      // Primero medimos todo; después escribimos únicamente transformaciones.
      // Así no forzamos un recálculo del layout en cada fotograma.
      const positions = pairs.map(({ plate, note, side }) => {
        const plateRect = plate.getBoundingClientRect();
        const noteHeight = note.offsetHeight;
        const noteX = sceneRect.left + note.offsetLeft;
        const noteWidth = note.offsetWidth;
        const centerY = (plateRect.top + plateRect.bottom) / 2 - sceneRect.top;
        const y = Math.max(0, Math.min(sceneRect.height - noteHeight, centerY - noteHeight / 2));
        const gap = side === "left"
          ? plateRect.left - (noteX + noteWidth) - 7
          : noteX - plateRect.right - 7;
        return { note, translateY: y - note.offsetTop, leader: Math.max(8, Math.min(155, gap)) };
      });

      positions.forEach(({ note, translateY, leader }) => {
        // Las transformaciones son compositadas por el navegador y evitan
        // mover el elemento con 'top', que repinta/recalcula el diseño.
        note.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
        note.style.setProperty("--leader-length", `${leader.toFixed(2)}px`);
      });
    };

    const tick = () => {
      frame = 0;
      if (!isVisible || document.hidden) return;
      // Sin límite artificial de 33 ms: se sincroniza con cada repintado.
      alignNotes();
      if (!reducedMotion.matches) frame = requestAnimationFrame(tick);
    };

    const resume = () => {
      if (!isVisible || document.hidden || frame) return;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    if ("IntersectionObserver" in window) {
      const watcher = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) resume();
        else stop();
      }, { threshold: 0 });
      watcher.observe(archScene);
    }

    window.addEventListener("resize", resume, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else resume();
    });
    reducedMotion.addEventListener("change", resume);
    resume();
  }
}
