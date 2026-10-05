# Naim El Haddadi — Portfolio

Mi web personal: **[naimelhaddadi.com](https://naimelhaddadi.com)**

La idea que guía toda la web: **I think. I build. I solve.**
La web no solo dice qué sé hacer: lo enseña con diagramas interactivos de los sistemas que he construido.

## Tecnologías

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript, exportado como página estática.
- Tailwind CSS 4: los tokens de diseño están en `app/globals.css`, dentro de `@theme`.
- [Motion](https://motion.dev) para las animaciones y [Lenis](https://lenis.darkroom.engineering) para el scroll suave.
- Fuentes con `next/font`: Archivo (títulos), Geist (texto), Geist Mono (etiquetas) e Instrument Serif (acentos en cursiva).
- Se despliega en Vercel con cada push a `main` (`vercel.json` fija el framework a Next.js).

## Estructura

```
├── app/
│   ├── layout.tsx            # fuentes, metadatos SEO, JSON-LD, nav, footer
│   ├── page.tsx              # el orden de las secciones
│   ├── globals.css           # tokens: colores, tipografía, easing, grano
│   ├── opengraph-image.tsx   # imagen para compartir (se genera en el build)
│   └── icon.svg, robots.ts, sitemap.ts
├── components/
│   ├── layout/               # Nav, Footer, cursor, scroll suave
│   ├── sections/             # Hero, Philosophy, Loop, Work, CaseStudy, ApiProject, Approach, Stack, About, Record, Contact
│   ├── diagrams/             # diagramas SVG de LH Sport y de la clínica dental
│   └── ui/                   # piezas reutilizables: botón magnético, textos con máscara, reloj de Madrid...
├── lib/
│   ├── content.ts            # TODO el contenido (proyectos, stack, formación). Se edita aquí.
│   ├── site.ts               # enlaces y datos de contacto
│   └── motion.ts             # curvas y duraciones de animación
├── assets/photos/            # fotos (se importan y Next las optimiza)
└── public/assets/            # CV y carta de recomendación (mismas URLs que antes)
```

## Sistema visual

- **Color:** casi negro (`ink`), blanco cálido (`fg`), y dos acentos sacados de la foto de noche:
  `sodium` (la farola, para lo humano) y `signal` (las ventanas de las oficinas, para los datos que se mueven en un sistema).
- **Tipografía:** títulos grandes y apretados en Archivo, etiquetas técnicas en mono, y una palabra en cursiva serif cuando hay que subrayar una idea ("problem").
- **Movimiento:** una sola curva (`ease.out`), textos que suben desde una máscara, parallax suave. Todo respeta `prefers-reduced-motion`.
- **Motivo:** el bucle THINK → BUILD → SOLVE → LEARN → REPEAT. La web empieza con él y termina volviendo a "Think".

## Cambiar contenido

Casi todo está en `lib/content.ts`. Por ejemplo, para añadir una tecnología al stack basta con añadirla al grupo correspondiente y, si quiero, decir en qué proyecto la he usado (`usedIn`).

## Probarla en local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```
