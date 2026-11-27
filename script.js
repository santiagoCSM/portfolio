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
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  document.documentElement.classList.add("js");
}


/* ---------- Notas que siguen las capas reales de la vista 3D ---------- */
/* Alineación de notas con las coordenadas proyectadas de las capas. */
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
    const desktopScreen = window.matchMedia("(min-width: 1161px)");
    let frame = 0;
    let isVisible = true;

    const alignNotes = () => {
      const sceneRect = archScene.getBoundingClientRect();
      if (!sceneRect.width || !sceneRect.height) return;

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
        note.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
        note.style.setProperty("--leader-length", `${leader.toFixed(2)}px`);
      });
    };

    const tick = () => {
      frame = 0;
      if (!isVisible || document.hidden || !desktopScreen.matches) return;
      alignNotes();
      if (!reducedMotion.matches) frame = requestAnimationFrame(tick);
    };

    const resume = () => {
      if (!isVisible || document.hidden || !desktopScreen.matches || frame) return;
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
    reducedMotion.addEventListener("change", () => {
      stop();
      resume();
    });
    desktopScreen.addEventListener("change", () => {
      stop();
      resume();
    });
    resume();
  }
}

/* ---------- Vistas previas de proyectos ---------- */
const previewMobile = window.matchMedia("(max-width: 800px), (pointer: coarse)");
const previewHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const previewReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".work-shot[data-video-preview]").forEach((shot) => {
  const video = shot.querySelector("video");
  const link = shot.closest("a");
  if (!video || !link) return;

  let visibleOnScreen = false;
  let hoverActive = false;
  let requestedByTap = false;

  // El video y su poster permanecen visibles aunque Safari bloquee el autoplay.
  const resetPreview = () => {
    requestedByTap = false;
    shot.classList.remove("is-video-playing", "needs-tap");
    video.pause();
    if (video.readyState > 0 && video.currentTime !== 0) video.currentTime = 0;
  };

  const playPreview = (fromGesture = false) => {
    if (document.hidden || shot.classList.contains("video-unavailable") ||
        (previewReducedMotion.matches && !fromGesture)) return;

    if (fromGesture) requestedByTap = true;
    video.muted = true;
    video.playsInline = true;
    video.loop = false;
    if (video.ended) video.currentTime = 0;

    try {
      const playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {
          // iOS puede requerir interacción: el poster y el indicador ▶ siguen visibles.
          shot.classList.remove("is-video-playing");
          shot.classList.add("needs-tap");
        });
      }
    } catch {
      shot.classList.add("video-unavailable");
      shot.classList.remove("is-video-playing");
    }
  };

  video.addEventListener("playing", () => {
    if (requestedByTap ||
        (previewMobile.matches && visibleOnScreen) ||
        (!previewMobile.matches && hoverActive)) {
      shot.classList.add("is-video-playing");
      shot.classList.remove("needs-tap");
    } else {
      video.pause();
    }
  });
  video.addEventListener("pause", () => shot.classList.remove("is-video-playing"));
  video.addEventListener("ended", () => shot.classList.remove("is-video-playing"));
  video.addEventListener("error", () => {
    resetPreview();
    shot.classList.add("video-unavailable");
  });

  const enterHover = () => {
    if (previewMobile.matches || !previewHover.matches || hoverActive) return;
    hoverActive = true;
    playPreview();
  };
  const leaveHover = () => {
    hoverActive = false;
    if (!previewMobile.matches) resetPreview();
  };

  link.addEventListener("mouseenter", enterHover);
  link.addEventListener("mouseleave", leaveHover);
  link.addEventListener("focusin", enterHover);
  link.addEventListener("focusout", (event) => {
    if (!link.contains(event.relatedTarget)) leaveHover();
  });

  link.addEventListener("click", (event) => {
    // Teclado y clics modificados abren el enlace de manera normal.
    if (event.defaultPrevented || event.detail === 0 || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    // Fuera del video (título, descripción, etiquetas), se abre la subpágina.
    if (!shot.contains(event.target) || shot.classList.contains("video-unavailable")) return;

    const playing = !video.paused && !video.ended && shot.classList.contains("is-video-playing");
    if (playing) return; // Con el video reproduciéndose, un toque abre la subpágina.

    // Video pausado o bloqueado en iOS: el primer toque solo intenta reproducir.
    // Se ejecuta directamente en el evento para conservar el gesto de usuario.
    event.preventDefault();
    playPreview(true);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (visible === visibleOnScreen) return;
      visibleOnScreen = visible;
      if (!previewMobile.matches) return;
      if (visible) playPreview();
      else resetPreview();
    }, { rootMargin: "-12% 0px -12% 0px", threshold: 0 });
    observer.observe(shot);
  }

  const syncPreview = () => {
    hoverActive = false;
    resetPreview();
    if (previewMobile.matches && visibleOnScreen) playPreview();
  };

  previewMobile.addEventListener("change", syncPreview);
  previewReducedMotion.addEventListener("change", syncPreview);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetPreview();
    else if (previewMobile.matches && visibleOnScreen) playPreview();
  });
});
