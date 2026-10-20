# naimelhaddadi.com

Mi web personal: quién soy, cómo trabajo, lo que he construido y cómo contactarme. La idea de fondo es **I think. I build. I solve.**

Está hecha con HTML, CSS y JavaScript, sin frameworks ni paso de build. Vercel sirve los archivos tal cual.

## Estructura

```
index.html                  portada en inglés
es/index.html               portada en español
work/*.html                 páginas de caso (LH Management y la clínica dental)
es/work/*.html              las mismas, en español
css/styles.css              todos los estilos
js/main.js                  scroll, navegación, menú, fichas de proyecto, copiar email
js/orbits.js                las órbitas del hero (canvas)
js/diagrams.js              los diagramas de LH, de la clínica y de las tarjetas
img/                        foto, iconos e imágenes para compartir
fonts/                      fuentes (Archivo, Geist, Geist Mono, Instrument Serif)
assets/                     CV y carta de recomendación en PDF
vercel.json                 URLs limpias y cabeceras de seguridad
```

## Cómo funciona

- `main.js` calcula cuánto ha avanzado cada elemento con `data-progress` por la pantalla (de 0 a 1) y lo guarda en la variable CSS `--p`. El CSS convierte ese número en opacidades, escalas o líneas que se dibujan, así que casi toda la animación del scroll está en `styles.css`.
- Cada diagrama es una lista de piezas (cajas, líneas, etiquetas) y cada pieza tiene el tramo del scroll en el que aparece. Se crean con `createElementNS` y `textContent`, sin `innerHTML`.
- El hero son dos canvas con la misma simulación: lo que está detrás de la foto va en uno y lo que está delante en el otro, así los átomos pasan por detrás y por delante.
- Cada idioma tiene sus propias páginas. El botón EN/ES lleva a la misma sección en la otra versión.
- Con "reducir movimiento" no hay animaciones y todo se ve completo. Sin JavaScript también se puede leer toda la web.

## Seguridad

- Sin dependencias, sin scripts externos y sin `innerHTML`.
- Las fuentes se sirven desde la propia web (nada de Google Fonts).
- `vercel.json` añade una Content Security Policy que solo permite recursos de la propia web, además de HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`.
- Los enlaces externos llevan `rel="noopener noreferrer"`.

## Probarla en local

Cualquier servidor estático vale, por ejemplo:

```bash
npx serve .
```

Con `npx vercel dev` también se aplican las cabeceras y las URLs sin `.html`.
