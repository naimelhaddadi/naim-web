/*
  All copy and data for the site lives here, so sections stay presentational
  and facts are edited in one place. Nothing in this file is invented: no
  metrics, and every claim is backed by the CV or the public repositories.
*/

export type Endpoint = { method: "GET" | "POST" | "PUT" | "DELETE"; path: string };

export type CaseSection = {
  label: string;
  body: string;
  /** Which state of the case diagram this section points at. */
  step: number;
};

export type ProjectId = "lh-sport" | "dental" | "gamestore" | "market" | "academia";

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

const GITHUB = "https://github.com/naimelhaddadi";

/* Real-world work: an internship and a freelance client. Shown in the pinned horizontal section. */
export const realWorld: Project[] = [
  {
    id: "lh-sport",
    index: "01",
    title: "LH Sport & Entertainment Management",
    headline: "From scattered information to a structured operational system.",
    summary: "The relational SQL Server database the agency works on, and the web interface that feeds it.",
    kind: "Internship · Feb – Apr 2026",
    meta: [
      { label: "Context", value: "Internship · Feb – Apr 2026" },
      { label: "Role", value: "Database design · Web interface" },
    ],
    sections: [
      {
        label: "The problem",
        body: "Several scouts were managing a lot of player information with no central system behind it. Finding things took time, and nothing was organised the same way twice.",
        step: 0,
      },
      {
        label: "The approach",
        body: "Model the domain before building any screen: more than 10 entities — players, clubs, leagues, contracts, transfers, agents — and how each one relates to the rest.",
        step: 1,
      },
      {
        label: "The system",
        body: "Built from scratch in SQL Server: business logic in T-SQL stored procedures and triggers, referential integrity enforced by the database, and a web data-entry interface on top. The agency uses it, and I left with an official recommendation letter.",
        step: 3,
      },
    ],
    stack: ["SQL Server", "T-SQL", "Relational model", "Stored procedures", "Triggers", "Referential integrity"],
    links: [{ href: "/assets/recomendacion-lh.pdf", label: "Recommendation letter" }],
  },
  {
    id: "dental",
    index: "02",
    title: "Dental Clinic Automation",
    headline: "From manual follow-ups to automated patient communication.",
    summary: "The website of a private dental clinic, then the system that handles its appointment messages on WhatsApp.",
    kind: "Freelance · 2026 – present",
    status: { label: "In production · real patients", live: true },
    meta: [
      { label: "Context", value: "Freelance · 2026 – present" },
      { label: "Runs on", value: "Linux VPS I administer" },
    ],
    sections: [
      {
        label: "The problem",
        body: "A private dental clinic: first it needed a website, then a way out of messaging every patient by hand to confirm and remind appointments.",
        step: 1,
      },
      {
        label: "The approach",
        body: "I built the corporate website first. Then I treated the messages for what they were — repetitive and predictable — and let the appointment start the conversation instead of a person.",
        step: 2,
      },
      {
        label: "The system",
        body: "n8n workflows handle appointments, confirmations and reminders through the WhatsApp Business API, with an LLM in the conversation. It runs in production with real patients, on a Linux VPS I administer.",
        step: 3,
      },
    ],
    stack: ["n8n", "WhatsApp Business API", "Webhooks", "LLM integration", "Linux VPS", "HTML5", "CSS3"],
    links: [],
  },
];

/* Personal and academic projects: built to learn, not for a client. */
export const personal: Project[] = [
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
      {
        label: "The goal",
        body: "Not just endpoints that work — a backend whose structure still holds when it grows.",
        step: 0,
      },
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
    links: [{ href: `${GITHUB}/GameStore_SpringBoot`, label: "Source on GitHub" }],
    layers: [
      { name: "GameController", detail: "@RestController · @Valid" },
      { name: "GameService", detail: "@Service · business rules" },
      { name: "GameRepository", detail: "Spring Data JPA" },
      { name: "Database", detail: "H2" },
    ],
    endpoints: [
      { method: "GET", path: "/games" },
      { method: "GET", path: "/games/genre/{genre}" },
      { method: "GET", path: "/games/top/{n}" },
      { method: "GET", path: "/games/stats" },
      { method: "POST", path: "/games" },
      { method: "PUT", path: "/games/{title}/price" },
      { method: "DELETE", path: "/games/{title}" },
    ],
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
      {
        label: "The project",
        body: "Student management for a programming academy, as a REST API.",
        step: 0,
      },
      {
        label: "Features",
        body: "Filtering by course, ranking by grade and endpoints for aggregated statistics.",
        step: 0,
      },
      {
        label: "The system",
        body: "Java and Spring Boot with Spring Data JPA. Pick an endpoint to follow a request through the layers.",
        step: 0,
      },
    ],
    stack: ["Java", "Spring Boot", "Spring Data JPA", "REST API"],
    links: [{ href: `${GITHUB}/Spring-Boot-Academy-Project`, label: "Source on GitHub" }],
    layers: [
      { name: "StudentController", detail: "@RestController" },
      { name: "StudentService", detail: "@Service · rankings, stats" },
      { name: "StudentRepository", detail: "Spring Data JPA" },
      { name: "Database", detail: "H2" },
    ],
    endpoints: [
      { method: "GET", path: "/students" },
      { method: "GET", path: "/students/course/{course}" },
      { method: "GET", path: "/students/top/{n}" },
      { method: "GET", path: "/students/stats" },
      { method: "POST", path: "/students" },
      { method: "PUT", path: "/students/{email}/grade" },
      { method: "DELETE", path: "/students/{email}" },
    ],
  },
  {
    id: "market",
    index: "05",
    title: "Financial Market Simulator",
    headline: "Prices that react to events, one turn at a time.",
    summary: "A turn-based market simulator in Python. Final project for Code in Place 2026, Stanford University.",
    kind: "Stanford · Personal project",
    meta: [
      { label: "Context", value: "Code in Place 2026 · Stanford" },
      { label: "Language", value: "Python" },
    ],
    sections: [
      {
        label: "The project",
        body: "A turn-based financial market simulator: each turn, events alter the prices.",
        step: 0,
      },
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
    links: [{ href: `${GITHUB}/financial-market-simulator`, label: "Source on GitHub" }],
  },
];

/* ── Stack ─────────────────────────────────────────────────────────────── */

/** `sub` items are parts of the item before them (Spring Boot → Web MVC…). */
export type Tech = { name: string; sub?: boolean };
export type StackGroup = { id: string; title: string; items: Tech[] };

export const stack: StackGroup[] = [
  {
    id: "languages",
    title: "Languages",
    items: [
      { name: "Java" },
      { name: "Python" },
      { name: "SQL / T-SQL" },
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "JavaScript" },
      { name: "PHP" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    items: [
      { name: "Spring Boot" },
      { name: "Web MVC", sub: true },
      { name: "Data JPA", sub: true },
      { name: "Bean Validation", sub: true },
      { name: "REST APIs" },
      { name: "JPA / Hibernate" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    items: [
      { name: "SQL Server" },
      { name: "Relational modelling", sub: true },
      { name: "Stored procedures", sub: true },
      { name: "Triggers", sub: true },
      { name: "H2" },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    items: [{ name: "JUnit 5" }, { name: "Mockito" }],
  },
  {
    id: "automation",
    title: "Automation",
    items: [{ name: "n8n" }, { name: "WhatsApp Business API" }, { name: "Webhooks" }, { name: "LLM integrations" }],
  },
  {
    id: "tools",
    title: "Tools & environment",
    items: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Maven" },
      { name: "IntelliJ IDEA" },
      { name: "Eclipse" },
      { name: "Docker" },
      { name: "Postman" },
      { name: "SSMS" },
      { name: "Linux" },
      { name: "VPS" },
    ],
  },
];

/*
  How the pieces connect. Hovering a technology lights up the first flow
  it appears in (so the order below matters) and draws the path between
  its steps.
*/
export type Flow = { id: string; label: string; steps: string[]; note: string };

export const flows: Flow[] = [
  {
    id: "java",
    label: "Java backend",
    steps: ["Java", "Spring Boot", "Data JPA", "JPA / Hibernate", "JUnit 5"],
    note: "The core of GameStore and Academia API: Spring Boot on top of Java, JPA for the data, JUnit for the logic.",
  },
  {
    id: "data",
    label: "SQL Server",
    steps: ["SQL Server", "SQL / T-SQL", "Stored procedures", "Triggers", "Relational modelling", "SSMS"],
    note: "The LH Sport database: the model and its business rules, living inside SQL Server.",
  },
  {
    id: "automation",
    label: "Automation",
    steps: ["n8n", "Webhooks", "WhatsApp Business API", "LLM integrations", "VPS"],
    note: "The dental clinic system, running in production on a server I administer.",
  },
  {
    id: "api",
    label: "REST APIs",
    steps: ["Web MVC", "REST APIs", "Bean Validation", "H2"],
    note: "How the Spring Boot APIs take a request: an endpoint, validated input, an in-memory database for development.",
  },
  {
    id: "testing",
    label: "Testing",
    steps: ["Mockito", "Postman"],
    note: "Mocked dependencies in unit tests, and endpoints exercised by hand.",
  },
  {
    id: "delivery",
    label: "Build & ship",
    steps: ["IntelliJ IDEA", "Maven", "Git", "GitHub", "Docker", "Linux"],
    note: "From the editor to version control to a running environment.",
  },
  {
    id: "web",
    label: "Web",
    steps: ["HTML5", "CSS3", "JavaScript", "PHP"],
    note: "The front side of things — the clinic's website is HTML5 and CSS3.",
  },
  {
    id: "python",
    label: "Python",
    steps: ["Python"],
    note: "The Financial Market Simulator, my final project for Code in Place 2026 at Stanford.",
  },
  {
    id: "eclipse",
    label: "Eclipse",
    steps: ["Eclipse"],
    note: "The other Java IDE I've worked with, next to IntelliJ IDEA.",
  },
];
