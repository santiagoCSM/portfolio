# Nobodywhois0 — Portfolio

Portfolio for the Nobodywhois0 web studio. Warm dark theme, editorial serif typography, lime accent — built with plain HTML, CSS and JavaScript, with no frameworks and no build step.

**Live site:** https://nobodywhois0.github.io/portfolio/

Read this in [English](#english) or [Español](#español).

---

## English

### About

A single-page portfolio with four sections: Hero, Profile, Selected Work, and Contact. Includes a mobile nav menu, subtle scroll-reveal animations, and a project grid with real screenshots.

### Tech stack

- HTML5
- CSS3 (custom properties, no preprocessor)
- Vanilla JavaScript (no dependencies)
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Inter](https://fonts.google.com/specimen/Inter) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts

### Project structure

```
.
├── index.html    # Markup and content
├── styles.css    # Theme, layout, animations
├── script.js     # Mobile menu + scroll-reveal
└── img/          # Project screenshots
```

### Running locally

No build tools required. From the project root:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173` in your browser.

### Deployment

Deployed automatically via **GitHub Pages** from the `main` branch, root directory. Any push to `main` updates the live site.

### License

Personal project — feel free to browse the code for reference, but please don't republish it as your own.

---

## Español

### Sobre el proyecto

Un portafolio de una sola página con cuatro secciones: Hero, Perfil, Trabajo y Contacto. Incluye menú de navegación móvil, animaciones sutiles al hacer scroll y una galería de proyectos con capturas reales.

### Tecnologías

- HTML5
- CSS3 (variables personalizadas, sin preprocesador)
- JavaScript puro (sin dependencias)
- Fuentes: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Inter](https://fonts.google.com/specimen/Inter) y [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) vía Google Fonts

### Estructura del proyecto

```
.
├── index.html    # Estructura y contenido
├── styles.css    # Tema, layout y animaciones
├── script.js     # Menú móvil + animaciones al hacer scroll
└── img/          # Capturas de los proyectos
```

### Cómo correrlo localmente

No requiere herramientas de build. Desde la raíz del proyecto:

```bash
python3 -m http.server 4173
```

Luego abre `http://localhost:4173` en tu navegador.

### Despliegue

Se despliega automáticamente con **GitHub Pages** desde la rama `main`, directorio raíz. Cada push a `main` actualiza el sitio en producción.

### Licencia

Proyecto personal — siéntete libre de revisar el código como referencia, pero por favor no lo publiques como propio.
