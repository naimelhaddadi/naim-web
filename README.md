# Naim El Haddadi — Portfolio

Mi web personal: **[naimelhaddadi.com](https://naimelhaddadi.com)**

## Tecnologías

- HTML, CSS y JavaScript, sin frameworks.
- Fuentes de Google Fonts: Anton para los títulos grandes y Montserrat para el resto.
- Iconos de [Remix Icon](https://remixicon.com) y [Devicon](https://devicon.dev), cargados por CDN.
- Se despliega en Vercel cada vez que subo cambios a `main`.

## Estructura

```
├── index.html     # el contenido, una sección detrás de otra
├── style.css      # los estilos, en el mismo orden que las secciones del html
├── script.js      # menú, animaciones al hacer scroll, contadores y copiar el email
├── api/chat.js    # función serverless antigua (la web ya no la usa)
└── assets/        # fotos, CV y carta de recomendación
```

## Cómo está organizado el código

- Arriba del `style.css` están las variables: colores, fuentes y medidas. Si quiero cambiar el azul, solo toco `--accent`.
- Cada sección tiene su bloque marcado con `/* ── nombre ── */` y el responsive va al final del archivo.
- En `script.js` hay una función para cada cosa: `toggleMenu`, `onScroll`, `countUp` y `showToast`.
- Las animaciones al bajar funcionan con la clase `.reveal`. El JS le pone `.visible` cuando el elemento entra en pantalla y el CSS hace la animación.

## Probarla en local

Es una web estática, así que basta con servir la carpeta:

```bash
npx serve .
```
