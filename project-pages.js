/* Subpáginas de proyectos: panel editorial, enlaces compartibles y navegación accesible. */
(() => {
  const projects = {
    "blife-mayoreo": {
      number: "01",
      title: "B Life Mayorista",
      category: "E-commerce / Mayoreo",
      image: "img/blife-mayoreo-new.png",
      imageAlt: "Portal de mayoreo de B Life",
      introduction: "Un espacio de compra diseñado para distribuidores, con registro, catálogo, precios exclusivos y carrito.",
      sections: [
        {
          title: "Mi participación",
          text: "Participé en el desarrollo web del portal de mayoreo de B Life, trabajando en la integración de funcionalidades de comercio electrónico y en una experiencia de navegación orientada a distribuidores."
        },
        {
          title: "El proyecto",
          text: "A diferencia de una tienda convencional, el portal reúne los pasos necesarios para que un distribuidor acceda a su catálogo, consulte condiciones de compra y avance hacia el carrito desde un mismo entorno."
        },
        {
          title: "Enfoque",
          text: "Desarrollo full-stack, integración de funcionalidades y atención a la continuidad del recorrido de compra. El objetivo fue que distintas piezas del sistema funcionaran como una experiencia coherente."
        }
      ],
      tags: ["E-commerce", "Mayoreo", "Integraciones", "Full-stack"],
      links: [
        { label: "Visitar sitio", href: "https://mayoreo.blife.mx/" }
      ]
    },
    "blife-supplements": {
      number: "02",
      title: "B Life Supplements",
      category: "E-commerce / Marca",
      image: "img/blife-supp.png",
      imageAlt: "Tienda B Life Supplements",
      introduction: "La tienda en línea de B Life, con catálogo, búsqueda de productos y un recorrido de compra pensado para el consumidor final.",
      sections: [
        {
          title: "Mi participación",
          text: "Colaboré en el desarrollo de funcionalidades web para la tienda, con especial atención a la presentación del catálogo, la navegación entre productos y la experiencia de compra."
        },
        {
          title: "El proyecto",
          text: "Una tienda necesita permitir que las personas encuentren productos, consulten información y lleguen al carrito sin perderse entre pasos. Esa continuidad fue parte del trabajo sobre la experiencia web."
        },
        {
          title: "Enfoque",
          text: "Desarrollo frontend, funcionalidades de e-commerce e integración de componentes orientados a una navegación clara y consistente."
        }
      ],
      tags: ["E-commerce", "Frontend", "Catálogo", "Experiencia web"],
      links: [
        { label: "Visitar sitio", href: "http://blifesupplements.com/" }
      ]
    },
    "cnc-maker": {
      number: "03",
      title: "CNC Maker Solutions",
      category: "Sitio corporativo / Manufactura",
      image: "img/cnc-maker-new.webp",
      imageAlt: "Sitio web de CNC Maker Solutions",
      introduction: "Una presencia digital para presentar servicios de maquinado CNC, láser e impresión 3D, y conectar esa información con el proceso de cotización.",
      sections: [
        {
          title: "Mi participación",
          text: "Trabajé en el desarrollo del sitio corporativo, desde la presentación web de los servicios hasta las animaciones y la organización del recorrido hacia la cotización."
        },
        {
          title: "El proyecto",
          text: "El reto de un sitio de manufactura es explicar servicios técnicos de forma accesible. La estructura debía ayudar a entender las capacidades del negocio sin perder claridad visual."
        },
        {
          title: "Enfoque",
          text: "Diseño de interfaces, animaciones y desarrollo web para comunicar los servicios y facilitar el siguiente paso de los visitantes interesados."
        }
      ],
      tags: ["Sitio corporativo", "Animaciones", "Servicios", "Cotización"],
      links: [
        { label: "Visitar sitio", href: "https://www.cncmakersolutions.com/" }
      ]
    },
    "priors": {
      number: "04",
      title: "Priors",
      category: "Proyecto personal / Investigación",
      image: "img/priors-new-back.webp",
      imageAlt: "Página del proyecto Priors",
      introduction: "Un índice abierto de investigación cuantitativa que reúne proyectos y muestra el estado de sus hipótesis y decisiones.",
      sections: [
        {
          title: "Mi participación",
          text: "Es un proyecto personal en el que diseñé la estructura para reunir investigaciones independientes y exponer sus hipótesis y criterios de evaluación de forma transparente."
        },
        {
          title: "Cómo funciona",
          text: "Cada investigación mantiene su propio repositorio y archivo board.md. Priors, construido con Astro, consulta esos tableros desde GitHub durante la compilación y reúne su estado en una sola vista, sin copiar los datos manualmente."
        },
        {
          title: "Enfoque técnico",
          text: "Separé el índice de los proyectos de investigación para mantenerlos independientes. GitHub Actions construye el sitio y actualiza los tableros conectados cada seis horas; si falta información, la compilación se detiene para evitar publicar un estado incompleto."
        }
      ],
      tags: ["Astro", "GitHub Actions", "Investigación", "Visualización"],
      links: [
        { label: "Abrir Priors", href: "https://santiagocsm.github.io/priors/" },
        { label: "Ver código", href: "https://github.com/santiagoCSM/priors" }
      ]
    }
  };

  const panel = document.getElementById("projectPage");
  const backdrop = document.getElementById("projectPageBackdrop");
  if (!panel || !backdrop) return;

  const pageScroll = document.getElementById("projectPageScroll");
  const backButton = panel.querySelector("[data-project-close]");
  const pageNumber = document.getElementById("projectPageNumber");
  const pageCategory = document.getElementById("projectPageCategory");
  const pageTitle = document.getElementById("projectPageTitle");
  const pageIntroduction = document.getElementById("projectPageIntroduction");
  const pageCover = document.getElementById("projectPageCover");
  const pageCoverFill = document.getElementById("projectPageCoverFill");
  const pageCoverLink = document.getElementById("projectPageCoverLink");
  const pageVisit = document.getElementById("projectPageVisit");
  const pageSections = document.getElementById("projectPageSections");
  const pageTags = document.getElementById("projectPageTags");
  const pageLinks = document.getElementById("projectPageLinks");
  const backgroundElements = [
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer")
  ].filter(Boolean);

  let activeProject = null;
  let returnFocus = null;
  const originalTitle = document.title;

  const textElement = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  };

  function populatePage(project) {
    pageNumber.textContent = project.number;
    pageCategory.textContent = project.category;
    pageTitle.textContent = project.title;
    pageIntroduction.textContent = project.introduction;
    pageCover.src = project.image;
    pageCover.alt = project.imageAlt;
    pageCoverFill.src = project.image;
    pageCoverFill.alt = "";
    // Ambas entradas llevan al destino principal del proyecto.
    const destination = project.links[0];
    pageVisit.href = destination.href;
    pageVisit.textContent = "Visitar sitio ↗";
    pageVisit.setAttribute("aria-label", "Visitar " + project.title + " (abre en una pestaña nueva)");
    pageCoverLink.href = destination.href;
    pageCoverLink.setAttribute("aria-label", "Visitar " + project.title + " (abre en una pestaña nueva)");

    const sections = document.createDocumentFragment();
    project.sections.forEach((item) => {
      const section = textElement("section", "project-page-section", "");
      section.append(
        textElement("h3", "project-page-section-title", item.title),
        textElement("p", "project-page-section-copy", item.text)
      );
      sections.append(section);
    });
    pageSections.replaceChildren(sections);

    const tags = document.createDocumentFragment();
    project.tags.forEach((tag) => tags.append(textElement("span", "project-page-tag", tag)));
    pageTags.replaceChildren(tags);

    const links = document.createDocumentFragment();
    // El enlace principal se muestra arriba; al final solo quedan enlaces secundarios.
    project.links.slice(1).forEach((item) => {
      const link = textElement("a", "project-page-link", item.label + " ↗");
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      links.append(link);
    });
    pageLinks.replaceChildren(links);
    pageLinks.hidden = project.links.length <= 1;
    document.title = project.title + " — Santiago Cortés";
  }

  function showProject(slug) {
    const project = projects[slug];
    if (!project) return;
    if (activeProject === slug) return;

    populatePage(project);
    activeProject = slug;
    pageScroll.scrollTop = 0;
    document.querySelectorAll(".work-shot video").forEach((video) => video.pause());
    document.querySelector("#nav")?.classList.remove("open");

    backgroundElements.forEach((element) => { element.inert = true; });
    document.body.classList.add("project-page-open");
    backdrop.classList.add("is-open");
    panel.classList.add("is-open");
    panel.inert = false;
    panel.setAttribute("aria-hidden", "false");
    backButton.focus({ preventScroll: true });
  }

  function hideProject() {
    if (!activeProject) return;
    activeProject = null;
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    panel.inert = true;
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("project-page-open");
    backgroundElements.forEach((element) => { element.inert = false; });
    document.title = originalTitle;
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }

  function slugFromHash() {
    const match = window.location.hash.match(/^#proyecto\/([a-z0-9-]+)$/);
    return match && projects[match[1]] ? match[1] : null;
  }

  function syncPageFromURL() {
    const slug = slugFromHash();
    if (slug) showProject(slug);
    else hideProject();
  }

  function closePage() {
    if (!activeProject) return;
    if (window.history.state?.portfolioProject === activeProject) {
      window.history.back();
    } else {
      window.history.replaceState(null, "", "#projects");
      hideProject();
    }
  }

  document.querySelectorAll(".work-card > a[data-project]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      // Preserve normal new-tab behavior and the existing video-playback fallback.
      if (event.defaultPrevented || event.button !== 0 ||
          event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const slug = anchor.dataset.project;
      if (!projects[slug]) return;
      event.preventDefault();
      returnFocus = anchor;
      const hash = "#proyecto/" + slug;
      if (window.location.hash !== hash) {
        window.history.pushState({ portfolioProject: slug }, "", hash);
      }
      showProject(slug);
    });
  });

  panel.querySelectorAll("[data-project-close]").forEach((button) => {
    button.addEventListener("click", closePage);
  });
  backdrop.addEventListener("click", closePage);

  document.addEventListener("keydown", (event) => {
    if (!activeProject) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePage();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = Array.from(panel.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      .filter((element) => element.getClientRects().length > 0);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("popstate", syncPageFromURL);
  window.addEventListener("hashchange", syncPageFromURL);
  syncPageFromURL();
})();
