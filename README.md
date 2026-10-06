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
│   ├── sections/             # Hero, About, RealWorld, Projects, Stack, Contact
│   ├── case/CaseStudy.tsx    # la página de cada caso real (/work/lh-management y /work/dental-clinic)
│   ├── work/                 # los diagramas que se construyen con el scroll, sus versiones para móvil,
│   │                         # las tarjetas de proyectos personales, el panel de detalles y el trazador de peticiones
│   ├── diagrams/primitives.tsx  # piezas compartidas de los diagramas (paquetes que viajan, tipos)
│   ├── layout/               # Nav, Footer, cursor, scroll suave
│   └── ui/                   # piezas reutilizables: botón magnético, textos con máscara, texto que se enciende con el scroll...
├── lib/
│   ├── content.ts            # TODO el contenido: proyectos, stack y cómo se conectan las tecnologías
│   ├── site.ts               # enlaces y datos de contacto
│   ├── scroll.ts             # la instancia de Lenis, para pararla cuando se abre un caso
│   ├── useCalm.ts            # "reducir movimiento" sin errores de hidratación
│   └── motion.ts             # curvas y duraciones de animación
├── assets/photos/            # fotos (se importan y Next las optimiza)
└── public/assets/            # CV y carta de recomendación
```

## El hero

- La foto es un recorte de la foto de noche (sin fondo). Detrás hay una "pantalla" de la que sobresalen la cabeza y los hombros.
- Las órbitas se dibujan en dos `<canvas>` que comparten la misma simulación: la mitad lejana de cada órbita va en el canvas de detrás de la foto y la mitad cercana en el de delante. Por eso los puntos pasan por detrás y por delante de mí.
- Entrada: los puntos aparecen dispersos, se juntan en sus órbitas, sale la foto, se dibujan las órbitas y luego el nombre y el lema. No bloquea nada: se puede hacer scroll desde el principio.
- Solo hay siete etiquetas y todas son tecnologías que uso (Java, Spring Boot, JPA, SQL, Python, Docker, n8n). El resto del stack está en su sección.
- Tres profundidades con parallax distinto: el polvo del fondo casi no se mueve, las órbitas y las etiquetas algo más, y la foto es la que más se mueve (y gira un poco en perspectiva).
- Se apartan un poco del ratón y la animación se para cuando el hero no está en pantalla.

## Trabajo real: scroll vertical normal

- LH Management y la clínica dental son trabajo real (unas prácticas y un cliente freelance), así que van separados de los proyectos personales.
- Todo es scroll vertical. Cada proyecto es una historia a la izquierda y, en pantallas grandes, un diagrama `sticky` a la derecha que se construye con el scroll: cada elemento tiene un rango dentro del progreso (0 → 1), así que al bajar se monta y al subir se desmonta (`components/work/stage.tsx`).
- Continuidad entre proyectos: el diagrama de LH se pliega en un punto, sale un hilo hacia abajo, cruza el hueco entre los dos proyectos y el diagrama de la clínica nace de ese mismo hilo.
- "View case" abre la página del caso (`/work/...`), con capítulos que se leen hacia abajo y el mismo diagrama construyéndose capítulo a capítulo.
- En móvil los diagramas son una columna legible (`MobileFlow`) que se construye al pasar. Con "reducir movimiento" se ven completos y quietos.

## El stack

- Están las 34 tecnologías del CV. En escritorio es un ecosistema: el núcleo (Java, Spring Boot, JPA / Hibernate, SQL) en el centro y dos anillos alrededor. Al pasar el ratón por una se dibujan las líneas a las tecnologías con las que trabaja (`relations` en `lib/content.ts`) y abajo se dice dónde la he usado.
- En móvil y tablet son listas por categoría; al tocar una se resaltan sus relaciones.

## Sistema visual

- **Color:** casi negro (`ink`), blanco cálido (`fg`), y dos acentos sacados de la foto de noche:
  `sodium` (la farola, para lo humano) y `signal` (las ventanas de las oficinas, para los datos que se mueven en un sistema).
- **Tipografía:** títulos grandes y apretados en Archivo, etiquetas técnicas en mono, y una palabra en cursiva serif cuando hay que subrayar una idea ("problem").
- **Movimiento:** una sola curva (`ease.out`), textos que suben desde una máscara, parallax suave. Todo respeta `prefers-reduced-motion`.
- **Jerarquía de movimiento:** hero y trabajo real son lo más animado; about, proyectos y stack, a medio gas; el contacto, quieto.
- **Salida del hero:** al bajar, la foto sube y se aleja, las órbitas se abren y sus nodos salen del encuadre, el texto se reduce y la página se oscurece hacia el About.

## Cambiar contenido

Casi todo está en `lib/content.ts`. Para añadir una tecnología al stack basta con añadirla a su grupo; cada proyecto tiene sus textos (problema, enfoque, sistema) y sus tecnologías en el mismo archivo.

## Probarla en local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```
