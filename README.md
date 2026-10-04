# Naim El Haddadi — Portfolio

Mi web personal: **[naimelhaddadi.com](https://naimelhaddadi.com)**

## Tecnologías

- HTML, CSS y JavaScript, sin frameworks.
- Fuentes de Google Fonts: Anton para los títulos grandes y Montserrat para el resto.
- Iconos en `assets/icons.svg`: solo los que uso, sacados de [Remix Icon](https://remixicon.com) (Apache 2.0) y [Devicon](https://devicon.dev) (MIT). Antes cargaba las librerías enteras por CDN y eran más de 1,5 MB.
- Se despliega en Vercel cada vez que subo cambios a `main`.

## Estructura

```
├── index.html     # el contenido, una sección detrás de otra
├── style.css      # los estilos, en el mismo orden que las secciones del html
├── script.js      # menú, animaciones al hacer scroll y copiar el email
├── api/chat.js    # función serverless antigua (la web ya no la usa)
└── assets/        # fotos, CV y carta de recomendación
```

## Cómo está organizado el código

- Arriba del `style.css` están las variables: colores, fuentes y medidas. Si quiero cambiar el azul, solo toco `--accent`.
- Cada sección tiene su bloque marcado con `/* ── nombre ── */` y el responsive va al final del archivo.
- En `script.js` hay una función para cada cosa: `toggleMenu`, `onScroll` y `showToast`.
- Las animaciones al bajar funcionan con la clase `.reveal`. El JS le pone `.visible` cuando el elemento entra en pantalla y el CSS hace la animación.
- Para usar un icono: `<svg class="icon"><use href="/assets/icons.svg#github"/></svg>`. Mide 1em, así que se le cambia el tamaño con `font-size`.

## Rendimiento

- Nada de `backdrop-filter` ni animaciones infinitas sobre textos grandes: hacían que el scroll fuera a tirones.
- Las fotos ya vienen preparadas: la de portada recortada (sin fondo) y la de "Sobre mí" en blanco y negro, con sombra y fundida con el fondo. Así no hace falta ningún filtro en el CSS.
- La foto de portada se pide con `fetchpriority="high"` porque es lo primero que se ve.

## Probarla en local

Es una web estática, así que basta con servir la carpeta:

```bash
npx serve .
```
