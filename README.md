# Naim El Haddadi — Portfolio

Portfolio personal desplegado en **[naimelhaddadi.com](https://naimelhaddadi.com)**.
Web minimalista en blanco y negro, estética developer, con foco en proyectos reales en producción.

## Stack

- **Frontend:** HTML5 + Tailwind (CDN) + CSS3 + JavaScript vanilla
- **Animación:** GSAP 3.12 + ScrollTrigger, Three.js r128, Vanilla Tilt
- **Backend:** Node.js sobre Vercel Edge Functions (`/api/chat.js`)
- **Deploy:** Vercel con CI/CD automático desde `main`

## Secciones

- **Hero** — presentación con foto orbital y tagline técnico
- **Stack** — tecnologías dominadas (Java, Python, SQL Server, n8n, Docker, AWS…)
- **Experiencia & Educación** — trayectoria profesional y formación
- **Proyectos** — infraestructura autónoma desplegada en producción
- **Roadmap** — próximos hitos técnicos
- **Contacto** — email directo

## Detalles de diseño

- Paleta monocroma: negro puro `#000000` + blanco con variantes de opacidad
- Fondo animado: cuadrícula de puntos en Three.js con animación de oleaje suave
- Tipografía mono para títulos (estética developer)
- Mobile-first: configuración Three.js más ligera en móvil para FPS y batería estables
- Respeta `prefers-reduced-motion`

## Estructura

```
├── index.html          # Estructura y contenido
├── style.css           # Estilos custom (más allá de Tailwind)
├── script.js           # GSAP, Three.js, interacciones
├── api/
│   └── chat.js         # Endpoint serverless
└── assets/             # Imágenes, PDFs (CV, recomendaciones)
```

## Desarrollo local

Al ser HTML estático, basta con abrir `index.html` o servir la carpeta:

```bash
npx serve .
```

---
*Naim El Haddadi · 2026*
