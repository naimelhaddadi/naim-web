# Naim El Haddadi — Portfolio

Mi web personal: **[naimelhaddadi.com](https://naimelhaddadi.com)**

La idea que guía toda la web: **I think. I build. I solve.**
Es un portfolio, no un CV: quién soy, qué he construido, cómo pienso y cómo contactarme, en menos de dos minutos. La formación, los idiomas y el resto de detalles están en el CV.

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
│   ├── hero/OrbitField.tsx   # las órbitas del hero, en dos canvas (detrás y delante de la foto)
│   ├── sections/             # Hero, About, Work, Thinking, Stack, Contact
│   ├── work/                 # tarjetas de proyecto, sus diagramas, el panel "View case" y el trazador de peticiones
│   ├── diagrams/             # diagramas SVG detallados de LH Sport y de la clínica dental
│   ├── layout/               # Nav, Footer, cursor, scroll suave
│   └── ui/                   # piezas reutilizables: botón magnético, textos con máscara...
├── lib/
│   ├── content.ts            # TODO el contenido (proyectos, stack). Se edita aquí.
│   ├── site.ts               # enlaces y datos de contacto
│   ├── scroll.ts             # la instancia de Lenis, para pararla cuando se abre un caso
│   └── motion.ts             # curvas y duraciones de animación
├── assets/photos/            # fotos (se importan y Next las optimiza)
└── public/assets/            # CV y carta de recomendación
```

## El hero

- La foto es un recorte de la foto de noche (sin fondo). Detrás hay una "pantalla" de la que sobresalen la cabeza y los hombros.
- Las órbitas se dibujan en dos `<canvas>` que comparten la misma simulación: la mitad lejana de cada órbita va en el canvas de detrás de la foto y la mitad cercana en el de delante. Por eso los puntos pasan por detrás y por delante de mí.
- Entrada: los puntos aparecen dispersos, se juntan en sus órbitas, sale la foto, se dibujan las órbitas y luego el nombre y el lema. No bloquea nada: se puede hacer scroll desde el principio.
- Se apartan un poco del ratón y la animación se para cuando el hero no está en pantalla.

## Sistema visual

- **Color:** casi negro (`ink`), blanco cálido (`fg`), y dos acentos sacados de la foto de noche:
  `sodium` (la farola, para lo humano) y `signal` (las ventanas de las oficinas, para los datos que se mueven en un sistema).
- **Tipografía:** títulos grandes y apretados en Archivo, etiquetas técnicas en mono, y una palabra en cursiva serif cuando hay que subrayar una idea ("problem").
- **Movimiento:** una sola curva (`ease.out`), textos que suben desde una máscara, parallax suave. Todo respeta `prefers-reduced-motion`.
- **Jerarquía de movimiento:** el hero es lo más animado, los proyectos son interactivos y el stack y el contacto se quedan tranquilos.

## Cambiar contenido

Casi todo está en `lib/content.ts`. Para añadir una tecnología al stack basta con añadirla a su grupo; cada proyecto tiene sus textos (problema, enfoque, sistema) y sus tecnologías en el mismo archivo.

## Probarla en local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```
