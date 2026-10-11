import type { FlowRow } from "@/components/work/MobileFlow";
import { localePath, type Lang } from "./dictionary";

/*
  All project and stack content lives here, in both languages, so sections
  stay presentational and facts are edited in one place. Nothing in this
  file is invented: no metrics, and every claim is backed by the CV or the
  public repositories.
*/

export type Endpoint = { method: "GET" | "POST" | "PUT" | "DELETE"; path: string };

export type CaseSection = {
  label: string;
  body: string;
  /** Which state of the case diagram this section points at. */
  step: number;
};

export type ProjectId = "gamestore" | "market" | "academia";

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  headline: string;
  summary: string;
  kind: string;
  status?: { label: string; live?: boolean };
  meta: { label: string; value: string }[];
  sections: CaseSection[];
  stack: string[];
  links: { href: string; label: string }[];
  /** The two Spring Boot APIs: their real routes, used by the request tracer. */
  endpoints?: Endpoint[];
  layers?: { name: string; detail: string }[];
};

/*
  Real-world work: an internship and a freelance client. Shown as two
  vertical stories on the home page, each with a diagram that builds with
  the scroll, and each with its own case-study page under /work.

  `story` is the short home-page version; `chapters` is the case study.
  `at` is where in the diagram's build (0 → 1) each part of the text lives.
  `flow` / `caseFlow` are the simple diagrams shown on phones.
*/
export type Chapter = { label: string; title: string; body: string; at: number };

export type WorkId = "lh-management" | "dental-clinic";

export type Work = {
  id: WorkId;
  index: string;
  label: string;
  title: string;
  fullTitle: string;
  intro: string;
  period: string;
  status?: { label: string; live?: boolean };
  story: Chapter[];
  chapters: Chapter[];
  stack: string[];
  links: { href: string; label: string }[];
  flow: FlowRow[];
  caseFlow: FlowRow[];
};

/* How I work: the four steps. */
export type Step = { title: string; line: string };

/*
  The stack: Java is the core, not the limit. One request followed through
  the four layers I know best, then the other languages I work with.
*/
export type Layer = { name: string; role: string; line: string; tools: string[] };

type Content = {
  realWorld: Work[];
  personal: Project[];
  process: Step[];
  layers: Layer[];
  stackProof: { label: string; href: string }[];
  alsoProof: { label: string; href: string; note: string };
  tools: string[];
};

/* ── Shared between languages ──────────────────────────────────────────── */

const GITHUB = "https://github.com/naimelhaddadi";
const LETTER = "/assets/recomendacion-lh.pdf";
const REPO = {
  gamestore: `${GITHUB}/GameStore_SpringBoot`,
  academia: `${GITHUB}/Spring-Boot-Academy-Project`,
  market: `${GITHUB}/financial-market-simulator`,
};

const gameEndpoints: Endpoint[] = [
  { method: "GET", path: "/games" },
  { method: "GET", path: "/games/genre/{genre}" },
  { method: "GET", path: "/games/top/{n}" },
  { method: "GET", path: "/games/stats" },
  { method: "POST", path: "/games" },
  { method: "PUT", path: "/games/{title}/price" },
  { method: "DELETE", path: "/games/{title}" },
];

const studentEndpoints: Endpoint[] = [
  { method: "GET", path: "/students" },
  { method: "GET", path: "/students/course/{course}" },
  { method: "GET", path: "/students/top/{n}" },
  { method: "GET", path: "/students/stats" },
  { method: "POST", path: "/students" },
  { method: "PUT", path: "/students/{email}/grade" },
  { method: "DELETE", path: "/students/{email}" },
];

export const request = "POST /games";

/* The other languages: clearly part of the picture, not a footnote. */
export const alsoLanguages = ["Python", "JavaScript", "PHP"];

/* ── English ───────────────────────────────────────────────────────────── */

const en: Content = {
  realWorld: [
    {
      id: "lh-management",
      index: "01",
      label: "Real-world experience",
      title: "LH Management",
      fullTitle: "LH Sport & Entertainment Management",
      intro:
        "Designed and implemented from scratch the relational SQL Server database that supports the daily operations of an international sports agency — and the web interface that feeds it.",
      period: "Internship · Feb – Apr 2026",
      status: { label: "Left with an official recommendation letter" },
      story: [
        {
          label: "Understand",
          title: "The problem wasn't “build a database”.",
          body: "It was a large amount of player, club, league, contract and agent information that wasn't organised efficiently — and the repetitive manual work that came with it.",
          at: 0.08,
        },
        {
          label: "Design",
          title: "A model of how the agency actually works.",
          body: "More than 10 entities — players, contracts, transfers, agents, clubs, leagues — designed around the real operations, and how each one relates to the rest.",
          at: 0.3,
        },
        {
          label: "Build",
          title: "A relational system, from scratch.",
          body: "SQL Server with the business logic in T-SQL stored procedures and triggers, referential integrity enforced by the model, and a web data-entry interface on top.",
          at: 0.52,
        },
        {
          label: "In use",
          title: "The structure the agency works on.",
          body: "It supports the agency's daily operations, and I left the role with an official recommendation letter.",
          at: 0.75,
        },
      ],
      chapters: [
        {
          label: "Problem",
          title: "Information without a system.",
          body: "An international sports agency handles a lot of interconnected information — players, clubs, contracts, agents — and it needed one place where all of it fits together.",
          at: 0.07,
        },
        {
          label: "Data model",
          title: "The domain first, the screens later.",
          body: "More than 10 entities — players, contracts, transfers, agents, clubs and leagues among them — and, above all, how each one relates to the rest.",
          at: 0.3,
        },
        {
          label: "Database",
          title: "Built from scratch in SQL Server.",
          body: "A relational schema designed and implemented from zero, as the base the agency's daily operations run on.",
          at: 0.45,
        },
        {
          label: "Business logic",
          title: "Rules the data can't break.",
          body: "T-SQL stored procedures and triggers, with referential integrity enforced by the database itself rather than by whoever is typing.",
          at: 0.57,
        },
        {
          label: "Web interface",
          title: "Where the workflow meets the data.",
          body: "A web data-entry interface that connects the agency's operational workflow with the database.",
          at: 0.68,
        },
        {
          label: "Result",
          title: "In daily use. Recommended.",
          body: "The database supports the daily operations of the agency, and the internship ended with an official recommendation letter.",
          at: 0.8,
        },
      ],
      stack: ["SQL Server", "T-SQL", "Relational database", "Stored procedures", "Triggers", "Web interface"],
      links: [{ href: LETTER, label: "Recommendation letter" }],
      flow: [
        { kind: "node", label: "Web form", sub: "data entry" },
        { kind: "node", label: "SQL Server", sub: "T-SQL · procedures · triggers", accent: true },
        { kind: "grid", caption: "10+ entities", items: ["Players", "Clubs", "Leagues", "Contracts", "Agents", "Transfers"] },
      ],
      caseFlow: [
        { kind: "node", label: "Web form", sub: "data entry" },
        { kind: "node", label: "SQL Server", sub: "T-SQL · procedures · triggers", accent: true },
        { kind: "grid", caption: "10+ entities · referential integrity", items: ["Players", "Clubs", "Leagues", "Contracts", "Agents", "Transfers"] },
      ],
    },
    {
      id: "dental-clinic",
      index: "02",
      label: "Freelance · Real-world",
      title: "Dental Clinic",
      fullTitle: "Private dental clinic",
      intro:
        "Developed the corporate website for a newly opened private dental clinic, then designed and implemented the n8n system that handles its appointments, confirmations and reminders over WhatsApp.",
      period: "Freelance · 2026 – present",
      status: { label: "In production · real patients", live: true },
      story: [
        {
          label: "First",
          title: "A website for a clinic that had just opened.",
          body: "The corporate website for a newly opened private dental clinic.",
          at: 0.07,
        },
        {
          label: "Understand",
          title: "The problem wasn't “use n8n”.",
          body: "It was repetitive, manual communication with patients around appointments, confirmations and reminders.",
          at: 0.2,
        },
        {
          label: "Design & build",
          title: "An automation shaped around that process.",
          body: "Webhooks bring appointment events into n8n workflows; messages go through the WhatsApp Business API, with an LLM integrated into the conversation.",
          at: 0.45,
        },
        {
          label: "In production",
          title: "Running with real patients.",
          body: "The system is live today, on a Linux VPS that I administer.",
          at: 0.84,
        },
      ],
      chapters: [
        {
          label: "Problem",
          title: "A new clinic, and a lot of messages.",
          body: "A newly opened private dental clinic needed a website — and a way to handle appointment communication with its patients.",
          at: 0.07,
        },
        {
          label: "Manual process",
          title: "Appointments, confirmations, reminders.",
          body: "Every appointment means the same conversation: confirm it, remind the patient, handle the reply. Predictable, repetitive work.",
          at: 0.22,
        },
        {
          label: "Automation",
          title: "n8n at the centre.",
          body: "Webhooks bring appointment events into n8n, where the workflows for appointments, confirmations and reminders live.",
          at: 0.44,
        },
        {
          label: "Communication",
          title: "Through WhatsApp, with an LLM.",
          body: "Messages are sent and received through the WhatsApp Business API, with an LLM integrated into the conversation.",
          at: 0.64,
        },
        {
          label: "Production",
          title: "Live, on a server I run.",
          body: "The system is in production with real patients, on a Linux VPS that I administer.",
          at: 0.92,
        },
      ],
      stack: ["n8n", "WhatsApp Business API", "Webhooks", "LLM integration", "Linux VPS", "HTML5", "CSS3"],
      links: [],
      flow: [
        { kind: "node", label: "Appointment", sub: "booked" },
        { kind: "node", label: "Webhook", sub: "event in" },
        { kind: "pair", left: { label: "n8n", sub: "workflows" }, right: { label: "LLM", sub: "integration" } },
        { kind: "node", label: "WhatsApp Business API", sub: "messages" },
        { kind: "node", label: "Patient", sub: "in production", accent: true },
      ],
      caseFlow: [
        { kind: "node", label: "Clinic website", sub: "HTML5 · CSS3" },
        { kind: "node", label: "Appointment", sub: "booked" },
        { kind: "node", label: "Webhook", sub: "event in" },
        { kind: "pair", left: { label: "n8n", sub: "workflows" }, right: { label: "LLM", sub: "integration" } },
        { kind: "node", label: "WhatsApp Business API", sub: "messages" },
        { kind: "node", label: "Patient", sub: "in production · Linux VPS", accent: true },
      ],
    },
  ],

  /* Personal and academic projects: built to learn, not for a client. */
  personal: [
    {
      id: "gamestore",
      index: "03",
      title: "GameStore",
      headline: "A structured Java backend, layer by layer.",
      summary: "A REST API for a video game catalogue with a clean Controller → Service → Repository split.",
      kind: "Personal project",
      meta: [
        { label: "Type", value: "Java · Spring Boot REST API" },
        { label: "Architecture", value: "Controller · Service · Repository · DTO" },
      ],
      sections: [
        { label: "The goal", body: "Not just endpoints that work — a backend whose structure still holds when it grows.", step: 0 },
        {
          label: "The approach",
          body: "One job per layer: the controller speaks HTTP, the service holds the rules, the repository talks to the database, and DTOs shape what goes out.",
          step: 0,
        },
        {
          label: "The system",
          body: "Spring Boot with Spring Data JPA, Bean Validation on input and unit tests with JUnit 5 and Mockito. Pick an endpoint to follow a request through the layers.",
          step: 0,
        },
      ],
      stack: ["Java", "Spring Boot", "Spring Data JPA", "DTOs", "Bean Validation", "JUnit 5", "Mockito"],
      links: [{ href: REPO.gamestore, label: "Source on GitHub" }],
      layers: [
        { name: "GameController", detail: "@RestController · @Valid" },
        { name: "GameService", detail: "@Service · business rules" },
        { name: "GameRepository", detail: "Spring Data JPA" },
        { name: "Database", detail: "H2" },
      ],
      endpoints: gameEndpoints,
    },
    {
      id: "academia",
      index: "04",
      title: "Academia Programming API",
      headline: "Student management as a REST API.",
      summary: "A Java and Spring Boot API with course filtering, ranking by grade and aggregated statistics.",
      kind: "Personal project",
      meta: [
        { label: "Type", value: "Java · Spring Boot REST API" },
        { label: "Domain", value: "Student management" },
      ],
      sections: [
        { label: "The project", body: "Student management for a programming academy, as a REST API.", step: 0 },
        { label: "Features", body: "Filtering by course, ranking by grade and endpoints for aggregated statistics.", step: 0 },
        {
          label: "The system",
          body: "Java and Spring Boot with Spring Data JPA. Pick an endpoint to follow a request through the layers.",
          step: 0,
        },
      ],
      stack: ["Java", "Spring Boot", "Spring Data JPA", "REST API"],
      links: [{ href: REPO.academia, label: "Source on GitHub" }],
      layers: [
        { name: "StudentController", detail: "@RestController" },
        { name: "StudentService", detail: "@Service · rankings, stats" },
        { name: "StudentRepository", detail: "Spring Data JPA" },
        { name: "Database", detail: "H2" },
      ],
      endpoints: studentEndpoints,
    },
    {
      id: "market",
      index: "05",
      title: "Financial Market Simulator",
      headline: "Prices that react to events, one turn at a time.",
      summary: "A turn-based market simulator in Python. Final project for Code in Place 2026, Stanford University.",
      kind: "Academic project · Stanford Code in Place 2026",
      meta: [
        { label: "Context", value: "Code in Place 2026 · Stanford" },
        { label: "Language", value: "Python" },
      ],
      sections: [
        { label: "The project", body: "A turn-based financial market simulator: each turn, events alter the prices.", step: 0 },
        {
          label: "What it shows",
          body: "Program logic and state that changes turn after turn, with every input validated before it's used.",
          step: 0,
        },
        {
          label: "Why it matters",
          body: "My final project for Code in Place 2026 at Stanford — an independent project taken from idea to finished program.",
          step: 0,
        },
      ],
      stack: ["Python", "Turn-based logic", "State changes", "Input validation"],
      links: [{ href: REPO.market, label: "Source on GitHub" }],
    },
  ],

  process: [
    { title: "Understand", line: "First I try to understand the problem, the people involved and the way the process currently works." },
    { title: "Design", line: "Then I think about how the information, logic and systems should fit together." },
    { title: "Build", line: "Only then does the code become the solution." },
    { title: "Improve", line: "Once something works, there's always another layer to understand, simplify or improve." },
  ],

  layers: [
    {
      name: "Spring Boot",
      role: "The API",
      line: "REST endpoints with validation, split into controller, service and repository.",
      tools: ["Spring Web MVC", "Bean Validation", "Maven"],
    },
    { name: "Java", role: "The logic", line: "The business rules, in plain services that are easy to test.", tools: ["JUnit 5", "Mockito"] },
    {
      name: "JPA / Hibernate",
      role: "The mapping",
      line: "Objects in the code, tables in the database, and repositories in between.",
      tools: ["Spring Data JPA", "H2"],
    },
    { name: "SQL", role: "The data", line: "Relational models in SQL Server, with procedures and triggers.", tools: ["SQL Server", "T-SQL"] },
  ],

  stackProof: [
    { label: "GameStore", href: REPO.gamestore },
    { label: "Academia API", href: REPO.academia },
    { label: "LH Management", href: localePath("en", "/work/lh-management") },
  ],
  alsoProof: { label: "Financial Market Simulator", href: REPO.market, note: "is written in Python." },

  /* Tools around all of it: mentioned, not featured. */
  tools: ["Git & GitHub", "Docker", "Linux", "n8n", "Postman"],
};

/* ── Español ───────────────────────────────────────────────────────────── */

const es: Content = {
  realWorld: [
    {
      id: "lh-management",
      index: "01",
      label: "Experiencia real",
      title: "LH Management",
      fullTitle: "LH Sport & Entertainment Management",
      intro:
        "Diseñé e implementé desde cero la base de datos relacional en SQL Server que sostiene el día a día de una agencia deportiva internacional, y la interfaz web que la alimenta.",
      period: "Prácticas · feb – abr 2026",
      status: { label: "Salí con una carta de recomendación oficial" },
      story: [
        {
          label: "Entender",
          title: "El problema no era «hacer una base de datos».",
          body: "Era mucha información de jugadores, clubes, ligas, contratos y agentes que no estaba bien organizada, y el trabajo manual repetitivo que venía con ella.",
          at: 0.08,
        },
        {
          label: "Diseñar",
          title: "Un modelo de cómo funciona de verdad la agencia.",
          body: "Más de 10 entidades —jugadores, contratos, traspasos, agentes, clubes, ligas— diseñadas alrededor de las operaciones reales, y cómo se relaciona cada una con las demás.",
          at: 0.3,
        },
        {
          label: "Construir",
          title: "Un sistema relacional, desde cero.",
          body: "SQL Server con la lógica de negocio en procedimientos almacenados y triggers de T-SQL, integridad referencial garantizada por el modelo y una interfaz web de captura de datos encima.",
          at: 0.52,
        },
        {
          label: "En uso",
          title: "La estructura sobre la que trabaja la agencia.",
          body: "Sostiene el día a día de la agencia, y salí del puesto con una carta de recomendación oficial.",
          at: 0.75,
        },
      ],
      chapters: [
        {
          label: "Problema",
          title: "Información sin un sistema.",
          body: "Una agencia deportiva internacional maneja mucha información conectada —jugadores, clubes, contratos, agentes— y necesitaba un único sitio donde todo encajara.",
          at: 0.07,
        },
        {
          label: "Modelo de datos",
          title: "Primero el dominio, después las pantallas.",
          body: "Más de 10 entidades —entre ellas jugadores, contratos, traspasos, agentes, clubes y ligas— y, sobre todo, cómo se relaciona cada una con las demás.",
          at: 0.3,
        },
        {
          label: "Base de datos",
          title: "Construida desde cero en SQL Server.",
          body: "Un esquema relacional diseñado e implementado desde cero, como la base sobre la que funciona el día a día de la agencia.",
          at: 0.45,
        },
        {
          label: "Lógica de negocio",
          title: "Reglas que los datos no pueden romper.",
          body: "Procedimientos almacenados y triggers de T-SQL, con la integridad referencial garantizada por la propia base de datos y no por quien esté escribiendo.",
          at: 0.57,
        },
        {
          label: "Interfaz web",
          title: "Donde el trabajo diario se encuentra con los datos.",
          body: "Una interfaz web de captura de datos que conecta el flujo de trabajo de la agencia con la base de datos.",
          at: 0.68,
        },
        {
          label: "Resultado",
          title: "En uso cada día. Con recomendación.",
          body: "La base de datos sostiene el día a día de la agencia, y las prácticas terminaron con una carta de recomendación oficial.",
          at: 0.8,
        },
      ],
      stack: ["SQL Server", "T-SQL", "Base de datos relacional", "Procedimientos almacenados", "Triggers", "Interfaz web"],
      links: [{ href: LETTER, label: "Carta de recomendación" }],
      flow: [
        { kind: "node", label: "Formulario web", sub: "captura de datos" },
        { kind: "node", label: "SQL Server", sub: "T-SQL · procedimientos · triggers", accent: true },
        { kind: "grid", caption: "10+ entidades", items: ["Jugadores", "Clubes", "Ligas", "Contratos", "Agentes", "Traspasos"] },
      ],
      caseFlow: [
        { kind: "node", label: "Formulario web", sub: "captura de datos" },
        { kind: "node", label: "SQL Server", sub: "T-SQL · procedimientos · triggers", accent: true },
        { kind: "grid", caption: "10+ entidades · integridad referencial", items: ["Jugadores", "Clubes", "Ligas", "Contratos", "Agentes", "Traspasos"] },
      ],
    },
    {
      id: "dental-clinic",
      index: "02",
      label: "Freelance · Trabajo real",
      title: "Clínica dental",
      fullTitle: "Clínica dental privada",
      intro:
        "Desarrollé la web corporativa de una clínica dental privada recién abierta y después diseñé e implementé el sistema en n8n que gestiona sus citas, confirmaciones y recordatorios por WhatsApp.",
      period: "Freelance · 2026 – actualidad",
      status: { label: "En producción · pacientes reales", live: true },
      story: [
        {
          label: "Primero",
          title: "Una web para una clínica recién abierta.",
          body: "La web corporativa de una clínica dental privada recién abierta.",
          at: 0.07,
        },
        {
          label: "Entender",
          title: "El problema no era «usar n8n».",
          body: "Era la comunicación manual y repetitiva con los pacientes alrededor de las citas, las confirmaciones y los recordatorios.",
          at: 0.2,
        },
        {
          label: "Diseñar y construir",
          title: "Una automatización con la forma de ese proceso.",
          body: "Los webhooks llevan los eventos de las citas a flujos de n8n; los mensajes van por la API de WhatsApp Business, con un LLM integrado en la conversación.",
          at: 0.45,
        },
        {
          label: "En producción",
          title: "Funcionando con pacientes reales.",
          body: "El sistema está en marcha hoy, en un VPS Linux que administro yo.",
          at: 0.84,
        },
      ],
      chapters: [
        {
          label: "Problema",
          title: "Una clínica nueva y muchos mensajes.",
          body: "Una clínica dental privada recién abierta necesitaba una web, y una forma de gestionar la comunicación de las citas con sus pacientes.",
          at: 0.07,
        },
        {
          label: "Proceso manual",
          title: "Citas, confirmaciones, recordatorios.",
          body: "Cada cita supone la misma conversación: confirmarla, recordársela al paciente y gestionar la respuesta. Trabajo predecible y repetitivo.",
          at: 0.22,
        },
        {
          label: "Automatización",
          title: "n8n en el centro.",
          body: "Los webhooks llevan los eventos de las citas a n8n, donde viven los flujos de citas, confirmaciones y recordatorios.",
          at: 0.44,
        },
        {
          label: "Comunicación",
          title: "Por WhatsApp, con un LLM.",
          body: "Los mensajes se envían y se reciben a través de la API de WhatsApp Business, con un LLM integrado en la conversación.",
          at: 0.64,
        },
        {
          label: "Producción",
          title: "En marcha, en un servidor que gestiono yo.",
          body: "El sistema está en producción con pacientes reales, en un VPS Linux que administro yo.",
          at: 0.92,
        },
      ],
      stack: ["n8n", "WhatsApp Business API", "Webhooks", "Integración con LLM", "VPS Linux", "HTML5", "CSS3"],
      links: [],
      flow: [
        { kind: "node", label: "Cita", sub: "reservada" },
        { kind: "node", label: "Webhook", sub: "entra el evento" },
        { kind: "pair", left: { label: "n8n", sub: "flujos" }, right: { label: "LLM", sub: "integración" } },
        { kind: "node", label: "WhatsApp Business API", sub: "mensajes" },
        { kind: "node", label: "Paciente", sub: "en producción", accent: true },
      ],
      caseFlow: [
        { kind: "node", label: "Web de la clínica", sub: "HTML5 · CSS3" },
        { kind: "node", label: "Cita", sub: "reservada" },
        { kind: "node", label: "Webhook", sub: "entra el evento" },
        { kind: "pair", left: { label: "n8n", sub: "flujos" }, right: { label: "LLM", sub: "integración" } },
        { kind: "node", label: "WhatsApp Business API", sub: "mensajes" },
        { kind: "node", label: "Paciente", sub: "en producción · VPS Linux", accent: true },
      ],
    },
  ],

  personal: [
    {
      id: "gamestore",
      index: "03",
      title: "GameStore",
      headline: "Un backend en Java bien estructurado, capa a capa.",
      summary: "Una API REST para un catálogo de videojuegos con una separación clara Controller → Service → Repository.",
      kind: "Proyecto personal",
      meta: [
        { label: "Tipo", value: "API REST · Java · Spring Boot" },
        { label: "Arquitectura", value: "Controller · Service · Repository · DTO" },
      ],
      sections: [
        { label: "El objetivo", body: "No solo endpoints que funcionen: un backend cuya estructura aguante cuando crece.", step: 0 },
        {
          label: "El enfoque",
          body: "Una responsabilidad por capa: el controller habla HTTP, el service guarda las reglas, el repository habla con la base de datos y los DTO dan forma a lo que sale.",
          step: 0,
        },
        {
          label: "El sistema",
          body: "Spring Boot con Spring Data JPA, Bean Validation en las entradas y tests unitarios con JUnit 5 y Mockito. Elige un endpoint para seguir una petición a través de las capas.",
          step: 0,
        },
      ],
      stack: ["Java", "Spring Boot", "Spring Data JPA", "DTOs", "Bean Validation", "JUnit 5", "Mockito"],
      links: [{ href: REPO.gamestore, label: "Código en GitHub" }],
      layers: [
        { name: "GameController", detail: "@RestController · @Valid" },
        { name: "GameService", detail: "@Service · reglas de negocio" },
        { name: "GameRepository", detail: "Spring Data JPA" },
        { name: "Base de datos", detail: "H2" },
      ],
      endpoints: gameEndpoints,
    },
    {
      id: "academia",
      index: "04",
      title: "API Academia de Programación",
      headline: "La gestión de alumnos, como API REST.",
      summary: "Una API con Java y Spring Boot con filtrado por curso, ranking por nota y estadísticas agregadas.",
      kind: "Proyecto personal",
      meta: [
        { label: "Tipo", value: "API REST · Java · Spring Boot" },
        { label: "Dominio", value: "Gestión de alumnos" },
      ],
      sections: [
        { label: "El proyecto", body: "La gestión de alumnos de una academia de programación, como API REST.", step: 0 },
        { label: "Funcionalidades", body: "Filtrado por curso, ranking por nota y endpoints de estadísticas agregadas.", step: 0 },
        {
          label: "El sistema",
          body: "Java y Spring Boot con Spring Data JPA. Elige un endpoint para seguir una petición a través de las capas.",
          step: 0,
        },
      ],
      stack: ["Java", "Spring Boot", "Spring Data JPA", "API REST"],
      links: [{ href: REPO.academia, label: "Código en GitHub" }],
      layers: [
        { name: "StudentController", detail: "@RestController" },
        { name: "StudentService", detail: "@Service · rankings, estadísticas" },
        { name: "StudentRepository", detail: "Spring Data JPA" },
        { name: "Base de datos", detail: "H2" },
      ],
      endpoints: studentEndpoints,
    },
    {
      id: "market",
      index: "05",
      title: "Simulador de mercado financiero",
      headline: "Precios que reaccionan a eventos, turno a turno.",
      summary: "Un simulador de mercado por turnos en Python. Proyecto final de Code in Place 2026, Stanford University.",
      kind: "Proyecto académico · Stanford Code in Place 2026",
      meta: [
        { label: "Contexto", value: "Code in Place 2026 · Stanford" },
        { label: "Lenguaje", value: "Python" },
      ],
      sections: [
        { label: "El proyecto", body: "Un simulador de mercado financiero por turnos: en cada turno, los eventos alteran los precios.", step: 0 },
        {
          label: "Qué demuestra",
          body: "Lógica de programa y un estado que cambia turno a turno, con cada entrada validada antes de usarla.",
          step: 0,
        },
        {
          label: "Por qué importa",
          body: "Mi proyecto final de Code in Place 2026 en Stanford: un proyecto independiente llevado de la idea al programa terminado.",
          step: 0,
        },
      ],
      stack: ["Python", "Lógica por turnos", "Cambios de estado", "Validación de entrada"],
      links: [{ href: REPO.market, label: "Código en GitHub" }],
    },
  ],

  process: [
    { title: "Entender", line: "Primero intento entender el problema, a las personas implicadas y cómo funciona el proceso hoy." },
    { title: "Diseñar", line: "Después pienso en cómo deberían encajar la información, la lógica y los sistemas." },
    { title: "Construir", line: "Solo entonces el código se convierte en la solución." },
    { title: "Mejorar", line: "Cuando algo funciona, siempre hay otra capa que entender, simplificar o mejorar." },
  ],

  layers: [
    {
      name: "Spring Boot",
      role: "La API",
      line: "Endpoints REST con validación, separados en controller, service y repository.",
      tools: ["Spring Web MVC", "Bean Validation", "Maven"],
    },
    { name: "Java", role: "La lógica", line: "Las reglas de negocio, en services sencillos y fáciles de testear.", tools: ["JUnit 5", "Mockito"] },
    {
      name: "JPA / Hibernate",
      role: "El mapeo",
      line: "Objetos en el código, tablas en la base de datos y repositorios entre medias.",
      tools: ["Spring Data JPA", "H2"],
    },
    { name: "SQL", role: "Los datos", line: "Modelos relacionales en SQL Server, con procedimientos y triggers.", tools: ["SQL Server", "T-SQL"] },
  ],

  stackProof: [
    { label: "GameStore", href: REPO.gamestore },
    { label: "Academia API", href: REPO.academia },
    { label: "LH Management", href: localePath("es", "/work/lh-management") },
  ],
  alsoProof: { label: "Simulador de mercado financiero", href: REPO.market, note: "está escrito en Python." },

  tools: ["Git y GitHub", "Docker", "Linux", "n8n", "Postman"],
};

export const content: Record<Lang, Content> = { en, es };
