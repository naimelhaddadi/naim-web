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

const GITHUB = "https://github.com/naimelhaddadi";

/*
  Real-world work: an internship and a freelance client. Shown as two
  vertical stories on the home page, each with a diagram that builds with
  the scroll, and each with its own case-study page under /work.

  `story` is the short home-page version; `chapters` is the case study.
  `at` is where in the diagram's build (0 → 1) each part of the text lives.
*/
export type Chapter = { label: string; title: string; body: string; at: number };

export type Work = {
  id: "lh-management" | "dental-clinic";
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
};

export const realWorld: Work[] = [
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
    links: [{ href: "/assets/recomendacion-lh.pdf", label: "Recommendation letter" }],
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
    kind: "Academic project · Stanford Code in Place 2026",
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

/* How I work: the four steps, in my words. */
export const process = [
  { title: "Understand", line: "First I try to understand the problem, the people involved and the way the process currently works." },
  { title: "Design", line: "Then I think about how the information, logic and systems should fit together." },
  { title: "Build", line: "Only then does the code become the solution." },
  { title: "Improve", line: "Once something works, there's always another layer to understand, simplify or improve." },
] as const;

/* ── Stack ─────────────────────────────────────────────────────────────── */

/* Every technology from the CV, grouped the same way. */
export type StackGroup = { id: string; title: string; items: string[] };

export const stack: StackGroup[] = [
  { id: "languages", title: "Languages", items: ["Java", "Python", "SQL / T-SQL", "HTML5", "CSS3", "JavaScript", "PHP"] },
  { id: "backend", title: "Backend", items: ["Spring Boot", "Spring Web MVC", "Spring Data JPA", "Bean Validation", "REST APIs", "JPA / Hibernate"] },
  { id: "databases", title: "Databases", items: ["SQL Server", "Relational modelling", "Stored procedures", "Triggers", "H2"] },
  { id: "testing", title: "Testing", items: ["JUnit 5", "Mockito"] },
  { id: "automation", title: "Automation", items: ["n8n", "WhatsApp Business API", "Webhooks", "LLM integration"] },
  {
    id: "environment",
    title: "Environment",
    items: ["Git", "GitHub", "Maven", "IntelliJ IDEA", "Eclipse", "Docker", "Postman", "SSMS", "Linux", "VPS"],
  },
];

/*
  The same stack as an ecosystem: a core, a ring of what the core works
  with every day, and an outer ring of everything around it. Each ring is
  listed in order around the circle, so related technologies sit near
  each other.
*/
export const core = ["Java", "Spring Boot", "JPA / Hibernate", "SQL / T-SQL"];

export const innerRing = [
  "Spring Web MVC",
  "Spring Data JPA",
  "Bean Validation",
  "REST APIs",
  "JUnit 5",
  "Mockito",
  "SQL Server",
  "H2",
  "n8n",
  "Docker",
  "Git",
  "Python",
];

export const outerRing = [
  "IntelliJ IDEA",
  "Eclipse",
  "Maven",
  "Postman",
  "Relational modelling",
  "Stored procedures",
  "Triggers",
  "SSMS",
  "Webhooks",
  "WhatsApp Business API",
  "LLM integration",
  "VPS",
  "Linux",
  "GitHub",
  "HTML5",
  "CSS3",
  "JavaScript",
  "PHP",
];

/* What works with what (undirected). */
export const relations: [string, string][] = [
  ["Java", "Spring Boot"],
  ["Java", "JPA / Hibernate"],
  ["Java", "JUnit 5"],
  ["Java", "Maven"],
  ["Java", "IntelliJ IDEA"],
  ["Java", "Eclipse"],
  ["Spring Boot", "Spring Web MVC"],
  ["Spring Boot", "Spring Data JPA"],
  ["Spring Boot", "Bean Validation"],
  ["Spring Boot", "REST APIs"],
  ["Spring Boot", "Maven"],
  ["JPA / Hibernate", "Spring Data JPA"],
  ["JPA / Hibernate", "H2"],
  ["JPA / Hibernate", "SQL / T-SQL"],
  ["SQL / T-SQL", "SQL Server"],
  ["SQL / T-SQL", "Stored procedures"],
  ["SQL / T-SQL", "Triggers"],
  ["SQL Server", "Relational modelling"],
  ["SQL Server", "Stored procedures"],
  ["SQL Server", "Triggers"],
  ["SQL Server", "SSMS"],
  ["REST APIs", "Postman"],
  ["REST APIs", "Spring Web MVC"],
  ["REST APIs", "Bean Validation"],
  ["JUnit 5", "Mockito"],
  ["n8n", "Webhooks"],
  ["n8n", "WhatsApp Business API"],
  ["n8n", "LLM integration"],
  ["n8n", "VPS"],
  ["Webhooks", "WhatsApp Business API"],
  ["VPS", "Linux"],
  ["Linux", "Docker"],
  ["Git", "GitHub"],
  ["HTML5", "CSS3"],
  ["HTML5", "JavaScript"],
  ["JavaScript", "PHP"],
];

/* Where a technology shows up in the work on this site (only where it's true). */
export const usedIn: Record<string, string> = {
  Java: "GameStore · Academia API",
  "Spring Boot": "GameStore · Academia API",
  "Spring Web MVC": "GameStore · Academia API",
  "Spring Data JPA": "GameStore · Academia API",
  "Bean Validation": "GameStore · Academia API",
  "REST APIs": "GameStore · Academia API",
  "JPA / Hibernate": "GameStore · Academia API",
  H2: "GameStore · Academia API",
  Maven: "GameStore · Academia API",
  "JUnit 5": "GameStore",
  Mockito: "GameStore",
  "SQL / T-SQL": "LH Management",
  "SQL Server": "LH Management",
  "Relational modelling": "LH Management",
  "Stored procedures": "LH Management",
  Triggers: "LH Management",
  n8n: "Dental clinic",
  "WhatsApp Business API": "Dental clinic",
  Webhooks: "Dental clinic",
  "LLM integration": "Dental clinic",
  VPS: "Dental clinic · Linux VPS I administer",
  Linux: "Dental clinic · Linux VPS I administer",
  HTML5: "Dental clinic website",
  CSS3: "Dental clinic website",
  Python: "Financial Market Simulator · Stanford Code in Place 2026",
};

export function relatedTo(name: string) {
  return relations.flatMap(([a, b]) => (a === name ? [b] : b === name ? [a] : []));
}
