/*
  Every interface text in both languages. The project and stack texts live
  in content.ts, and the diagram labels next to each diagram.
  `es` is typed as `typeof en`, so a missing translation breaks the build.
*/

export const langs = ["en", "es"] as const;
export type Lang = (typeof langs)[number];

/* Where each language lives: English at the root, Spanish under /es. */
export const home: Record<Lang, string> = { en: "/", es: "/es" };

/* A path of the site in the given language: "/work/x" → "/es/work/x". */
export const localePath = (lang: Lang, path: string) => (lang === "en" ? path : path === "/" ? home.es : `${home.es}${path}`);

const en = {
  meta: {
    title: "Naim El Haddadi — Backend Developer",
    description:
      "Backend developer in Madrid working with Java, Spring Boot and SQL. A SQL Server database for a sports agency, a WhatsApp automation running with real patients, Spring Boot APIs and a Python market simulator.",
    locale: "en_GB",
    ogRole: "Backend Developer · Madrid",
  },
  skip: "Skip to content",
  cursor: { view: "View", open: "Open", write: "Write", case: "Case", next: "Next" },
  nav: {
    home: "back to top",
    homeLink: "home",
    tag: "Backend",
    primary: "Primary",
    mobile: "Mobile",
    menu: "Menu",
    close: "Close",
    links: { about: "About", how: "How I work", work: "Work", projects: "Projects", stack: "Stack", contact: "Contact" },
    switchLabel: "Ver la web en español",
  },
  hero: {
    role: "Backend Developer",
    motto: ["I think", "I build", "I solve"],
    photo: "Naim El Haddadi, arms crossed",
    viewWork: "View work",
  },
  about: {
    label: "About",
    headline: { first: "Curious by nature.", before: "Built to ", accent: "solve." },
    curiosity: {
      text: "Computers have always been something I liked to experiment with — opening things up to see how they work.",
      strong: "Programming became the natural extension of that curiosity.",
    },
    quote: "I enjoy the part of software development where a vague problem becomes a system you can actually reason about.",
    focus: {
      before: "Today I focus on backend development: ",
      highlights: ["Java", "Spring Boot", "databases"],
      after: " and the systems that connect them.",
    },
    cv: "View CV",
  },
  how: {
    label: "How I work",
    title: "How I work: I don't start with code. I start with the problem.",
    code: { first: "I don't start", before: "with ", word: "code." },
    problem: { first: "I start with", before: "the ", word: "problem." },
    intro:
      "Before building something, I want to understand why it needs to exist, how people are solving it today and where the real friction is.",
    handoff: "Here's what that looks like in practice.",
    theProblem: "the problem",
    again: "and again",
  },
  realWorld: {
    label: "Real-world work",
    title: ["Real-world", "work."],
    subtitle: "Software built for problems outside the classroom.",
    technologies: "Technologies",
    viewCase: "View case",
    hint: "hover a node to inspect it",
    diagram: "system diagram",
  },
  case: {
    back: "Back to work",
    next: "Next case",
    projects: "Personal projects",
    contact: "Contact",
  },
  projects: {
    label: "Personal projects",
    title: "Personal projects.",
    subtitle: "Projects built while learning, experimenting and going deeper into software development.",
    allRepos: "All repositories",
    details: "Details",
  },
  overlay: { close: "Close", technology: "Technology", status: "Status" },
  tracer: { endpoints: "Endpoints", path: "Request path", client: "Client", request: "HTTP request" },
  stack: {
    label: "Stack",
    title: ["Java is my core,", "not my limit."],
    aside: "One request through the stack I know best, and the languages I also work with.",
    oneRequest: "one request, four layers",
    shownIn: "Shown in",
    also: "I also work with",
    sameWay: "Same way of working, different syntax. My",
    tools: "Tools",
  },
  contact: {
    label: "Contact",
    title: ["Let's build", "something", "useful."],
    role: "Junior Backend Developer",
    place: "Madrid, Spain",
    talk: "Let's talk",
    subject: "Hi Naim",
    cv: "PDF",
  },
  copy: { idle: "Copy", done: "Copied", aria: "Copy the email address", announce: "Email copied" },
  footer: { built: "Designed and built by me", source: "source", top: "Back to top ↑" },
};

const es: typeof en = {
  meta: {
    title: "Naim El Haddadi — Desarrollador Backend",
    description:
      "Desarrollador backend en Madrid con Java, Spring Boot y SQL. Una base de datos SQL Server para una agencia deportiva, una automatización de WhatsApp en producción con pacientes reales, APIs con Spring Boot y un simulador de mercado en Python.",
    locale: "es_ES",
    ogRole: "Desarrollador Backend · Madrid",
  },
  skip: "Saltar al contenido",
  cursor: { view: "Ver", open: "Abrir", write: "Escribir", case: "Caso", next: "Siguiente" },
  nav: {
    home: "volver arriba",
    homeLink: "inicio",
    tag: "Backend",
    primary: "Principal",
    mobile: "Móvil",
    menu: "Menú",
    close: "Cerrar",
    links: { about: "Sobre mí", how: "Cómo trabajo", work: "Trabajo", projects: "Proyectos", stack: "Stack", contact: "Contacto" },
    switchLabel: "View the site in English",
  },
  hero: {
    role: "Desarrollador Backend",
    motto: ["Pienso", "Construyo", "Resuelvo"],
    photo: "Naim El Haddadi, con los brazos cruzados",
    viewWork: "Ver trabajo",
  },
  about: {
    label: "Sobre mí",
    headline: { first: "Curioso por naturaleza.", before: "Hecho para ", accent: "resolver." },
    curiosity: {
      text: "Los ordenadores siempre han sido algo con lo que me gustaba experimentar: abrirlos para ver cómo funcionan.",
      strong: "Programar fue la extensión natural de esa curiosidad.",
    },
    quote: "Disfruto la parte del desarrollo de software en la que un problema difuso se convierte en un sistema sobre el que de verdad se puede razonar.",
    focus: {
      before: "Hoy me centro en el desarrollo backend: ",
      highlights: ["Java", "Spring Boot", "bases de datos"],
      after: " y los sistemas que las conectan.",
    },
    cv: "Ver CV",
  },
  how: {
    label: "Cómo trabajo",
    title: "Cómo trabajo: no empiezo por el código. Empiezo por el problema.",
    code: { first: "No empiezo", before: "por el ", word: "código." },
    problem: { first: "Empiezo por", before: "el ", word: "problema." },
    intro:
      "Antes de construir algo, quiero entender por qué tiene que existir, cómo lo está resolviendo hoy la gente y dónde está la fricción de verdad.",
    handoff: "Así es como se ve en la práctica.",
    theProblem: "el problema",
    again: "y otra vez",
  },
  realWorld: {
    label: "Trabajo real",
    title: ["Trabajo", "real."],
    subtitle: "Software hecho para problemas fuera del aula.",
    technologies: "Tecnologías",
    viewCase: "Ver caso",
    hint: "pasa el ratón por un nodo para verlo",
    diagram: "diagrama del sistema",
  },
  case: {
    back: "Volver al trabajo",
    next: "Siguiente caso",
    projects: "Proyectos personales",
    contact: "Contacto",
  },
  projects: {
    label: "Proyectos personales",
    title: "Proyectos personales.",
    subtitle: "Proyectos hechos mientras aprendía, experimentaba y profundizaba en el desarrollo de software.",
    allRepos: "Todos los repositorios",
    details: "Detalles",
  },
  overlay: { close: "Cerrar", technology: "Tecnología", status: "Estado" },
  tracer: { endpoints: "Endpoints", path: "Recorrido de la petición", client: "Cliente", request: "Petición HTTP" },
  stack: {
    label: "Stack",
    title: ["Java es mi base,", "no mi límite."],
    aside: "Una petición a través del stack que mejor conozco, y los lenguajes con los que también trabajo.",
    oneRequest: "una petición, cuatro capas",
    shownIn: "Se ve en",
    also: "También trabajo con",
    sameWay: "La misma forma de trabajar, otra sintaxis. Mi",
    tools: "Herramientas",
  },
  contact: {
    label: "Contacto",
    title: ["Construyamos", "algo", "útil."],
    role: "Desarrollador Backend Junior",
    place: "Madrid, España",
    talk: "Hablemos",
    subject: "Hola Naim",
    cv: "PDF",
  },
  copy: { idle: "Copiar", done: "Copiado", aria: "Copiar la dirección de email", announce: "Email copiado" },
  footer: { built: "Diseñada y programada por mí", source: "código", top: "Volver arriba ↑" },
};

export const dictionary: Record<Lang, typeof en> = { en, es };
