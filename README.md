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
│   ├── [lang]/               # todo por idioma: /en (servido en /) y /es
│   │   ├── layout.tsx        # fuentes, metadatos SEO por idioma, JSON-LD, nav, footer
│   │   ├── page.tsx          # el orden de las secciones
│   │   ├── template.tsx      # la transición entre páginas
│   │   ├── work/[slug]/      # la página de cada caso real
│   │   └── opengraph-image.tsx  # imagen para compartir, una por idioma
│   ├── globals.css           # tokens: colores, tipografía, easing, grano
│   └── icon.svg, robots.ts, sitemap.ts
├── components/
│   ├── hero/OrbitField.tsx   # las órbitas del hero, en dos canvas (detrás y delante de la foto)
│   ├── sections/             # Hero, About, HowIWork, RealWorld, Projects, Stack, Contact
│   ├── case/CaseStudy.tsx    # la página de cada caso real (/work/lh-management y /work/dental-clinic)
│   ├── work/                 # los diagramas que se construyen con el scroll, sus versiones para móvil,
│   │                         # las tarjetas de proyectos personales, el panel de detalles y el trazador de peticiones
│   ├── diagrams/primitives.tsx  # piezas compartidas de los diagramas (paquetes que viajan, tipos)
│   ├── layout/               # Nav, Footer, interruptor EN / ES, cursor, scroll suave
│   └── ui/                   # piezas reutilizables: botón magnético, textos con máscara, texto que se enciende con el scroll...
├── lib/
│   ├── content.ts            # proyectos, proceso y stack, en inglés y en español
│   ├── dictionary.ts         # todos los textos de la interfaz, en inglés y en español
│   ├── lang.tsx              # el idioma actual (contexto de React) y los hooks useT() y useContent()
│   ├── site.ts               # enlaces y datos de contacto
│   ├── scroll.ts             # la instancia de Lenis, para pararla cuando se abre un caso
│   ├── useCalm.ts            # "reducir movimiento" sin errores de hidratación
│   └── motion.ts             # curvas y duraciones de animación
├── assets/photos/            # fotos (se importan y Next las optimiza)
└── public/assets/            # CV y carta de recomendación
```

## Idiomas (inglés / español)

- Cada idioma tiene sus propias páginas: `/` y `/work/…` en inglés, `/es` y `/es/work/…` en español. Se generan todas como HTML estático con `generateStaticParams`, así Google indexa ambas versiones y cada una carga ya en su idioma, sin parpadeos.
- En `next.config.ts`, un `rewrite` sirve las páginas `/en…` en `/` y `/work/…` sin cambiar la URL, y `/en…` redirige ahí, para que cada página tenga una sola dirección.
- El layout pone `<html lang>`, el título, la descripción y los enlaces `hreflang` de cada página, y pasa el idioma a todos los componentes con un contexto de React (`lib/lang.tsx`).
- Los componentes sacan los textos de la interfaz con `useT()` (de `lib/dictionary.ts`) y los proyectos y el stack con `useContent()` (de `lib/content.ts`). El español está tipado igual que el inglés, así que si falta una traducción el build falla. Las etiquetas de los diagramas están junto a cada diagrama, en un objeto `text` con `en` y `es`.
- El interruptor EN / ES del menú (`LangSwitch`) enlaza a la misma página en el otro idioma con `scroll={false}`, por eso al cambiar te quedas en el mismo punto.

## El hero

- La foto es un recorte sin fondo (brazos cruzados, jersey gris), en el centro de un sistema de órbitas.
- Las órbitas se dibujan en dos `<canvas>` que comparten la misma simulación: la mitad lejana de cada órbita va en el canvas de detrás de la foto y la mitad cercana en el de delante, así que todo pasa por detrás y por delante de mí.
- En el sistema solo hay órbitas finas, unos pocos átomos (esferas negras brillantes con un núcleo naranja), chispas con estela y unos anillos en el "suelo". Sin etiquetas: el stack tiene su propia sección.
- Entrada: se dibujan las órbitas, sube la foto, aparecen los átomos uno a uno y luego el nombre y el lema. No bloquea nada: se puede hacer scroll desde el principio.
- Parallax con el ratón a tres profundidades (polvo, órbitas, foto); los átomos se apartan un poco del puntero y la animación se para cuando el hero no está en pantalla.

## How I work

- Va entre el About y el trabajo real: primero dice cómo trabajo y justo después llegan las pruebas.
- Titular: "I don't start with code. I start with the problem." En escritorio la sección se queda en pantalla un tramo corto mientras el scroll la transforma: "code" se queda en contorno, "problem" se enciende, las dos frases se juntan y se dibuja el proceso (understand → design → build → improve) con una línea que sale enredada del problema y se endereza. Improve vuelve a understand.
- Termina con "Here's what that looks like in practice." y el hilo baja hasta "Real-world work". Las historias de LH y la clínica empiezan por el problema real, no por la tecnología.
- En móvil, pantallas bajas o "reducir movimiento" es una columna normal.

## Trabajo real: scroll vertical normal

- LH Management y la clínica dental son trabajo real (unas prácticas y un cliente freelance), así que van separados de los proyectos personales.
- Todo es scroll vertical. Cada proyecto es una historia a la izquierda y, en pantallas grandes, un diagrama `sticky` a la derecha que se construye con el scroll: cada elemento tiene un rango dentro del progreso (0 → 1), así que al bajar se monta y al subir se desmonta (`components/work/stage.tsx`).
- Continuidad entre proyectos: el diagrama de LH se pliega en un punto, sale un hilo hacia abajo, cruza el hueco entre los dos proyectos y el diagrama de la clínica nace de ese mismo hilo.
- "View case" abre la página del caso (`/work/...`), con capítulos que se leen hacia abajo y el mismo diagrama construyéndose capítulo a capítulo.
- En móvil los diagramas son una columna legible (`MobileFlow`) que se construye al pasar. Con "reducir movimiento" se ven completos y quietos.

## El stack

- "Java is my core, not my limit.": Java, Spring y SQL son lo que mejor sé, pero no lo único. La sección es corta a propósito.
- Una petición (`POST /games` de GameStore) cruza las cuatro capas: Spring Boot (la API), Java (la lógica), JPA / Hibernate (el mapeo) y SQL (los datos). En escritorio van en fila sobre un hilo y en móvil en columna. Al hacer scroll, un punto recorre el hilo y cada capa se enciende al llegar.
- Debajo, "I also work with": Python, JavaScript y PHP, visibles y no escondidos. Las herramientas (Git, Docker, Linux, n8n, Postman) van aparte, en pequeño.

## Sistema visual

- **Color:** casi negro (`ink`), blanco cálido (`fg`), y dos acentos sacados de la foto de noche:
  `sodium` (la farola, para lo humano) y `signal` (las ventanas de las oficinas, para los datos que se mueven en un sistema).
- **Tipografía:** títulos grandes y apretados en Archivo, etiquetas técnicas en mono, y una palabra en cursiva serif cuando hay que subrayar una idea ("problem").
- **Movimiento:** una sola curva (`ease.out`), textos que suben desde una máscara, parallax suave. Todo respeta `prefers-reduced-motion`.
- **Jerarquía de movimiento:** hero y trabajo real son lo más animado; about, proyectos y stack, a medio gas; el contacto, quieto.
- **Salida del hero:** al bajar, la foto sube y se aleja, las órbitas se abren y sus nodos salen del encuadre, el texto se reduce y la página se oscurece hacia el About.

## Cambiar contenido

Los textos de la interfaz están en `lib/dictionary.ts` y todo lo demás en `lib/content.ts`, cada uno en inglés y en español. Las capas del stack son `layers`, los otros lenguajes `alsoLanguages` y las herramientas `tools`; cada proyecto tiene sus textos (problema, enfoque, sistema) y sus tecnologías en el mismo archivo.

## Probarla en local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```
