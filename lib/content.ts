/*
  All copy and data for the site lives here, so sections stay presentational
  and facts are edited in one place. Nothing in this file is invented: no
  metrics, no claims the CV and the repositories don't back up.
*/

export type Endpoint = { method: "GET" | "POST" | "PUT" | "DELETE"; path: string };

export type CaseSection = {
  label: string;
  body: string;
  /** Which state of the case diagram this section points at. */
  step: number;
};

export type Project = {
  id: "lh-sport" | "dental" | "gamestore";
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
  /** GameStore only: the real routes, used by the request tracer. */
  endpoints?: Endpoint[];
  layers?: { name: string; detail: string }[];
};

export const projects: Project[] = [
  {
    id: "lh-sport",
    index: "01",
    title: "LH Sport & Entertainment Management",
    headline: "From scattered information to a structured system.",
    summary: "A relational database and a web interface for a team of scouts who had no central place for player data.",
    kind: "Internship · Database design",
    meta: [
      { label: "Context", value: "Internship · Feb – Apr 2026" },
      { label: "Role", value: "Database design · Web interface" },
    ],
    sections: [
      {
        label: "The problem",
        body: "Several scouts were managing a lot of player information with no central system. Time went into finding things, and nothing was organised the same way twice.",
        step: 0,
      },
      {
        label: "The approach",
        body: "Before building any screen, I mapped the domain: players, clubs, leagues, contracts, agents — and how each one relates to the rest.",
        step: 1,
      },
      {
        label: "The system",
        body: "A relational database in SQL Server, with the business rules in T-SQL stored procedures and triggers so the data stays consistent. On top, a web interface with forms: registering a player writes it straight into the database.",
        step: 3,
      },
    ],
    stack: ["SQL Server", "T-SQL", "Relational design", "Stored procedures", "Triggers", "Web interface"],
    links: [{ href: "/assets/recomendacion-lh.pdf", label: "Recommendation letter" }],
  },
  {
    id: "dental",
    index: "02",
    title: "Dental Clinic Automation",
    headline: "Replacing repetitive follow-ups with automation.",
    summary: "Appointment confirmations and reminders over WhatsApp, handled by a system instead of by hand.",
    kind: "Freelance · Automation",
    status: { label: "In production · real patients", live: true },
    meta: [
      { label: "Context", value: "Freelance · 2026 – present" },
      { label: "Runs on", value: "Linux VPS I administer" },
    ],
    sections: [
      {
        label: "The problem",
        body: "The clinic spent a lot of time messaging patients by hand. Some forgot to reply, some didn't turn up — and the same messages went out again every day.",
        step: 1,
      },
      {
        label: "The approach",
        body: "Repetitive and predictable is exactly the kind of work a system should do. So the appointment starts the conversation, not a person.",
        step: 2,
      },
      {
        label: "The system",
        body: "Webhooks feed n8n workflows that send confirmations and reminders through the WhatsApp Business API, with an LLM in the conversation. It runs in production with real patients, on a Linux VPS I administer.",
        step: 3,
      },
    ],
    stack: ["n8n", "WhatsApp Business API", "Webhooks", "LLM integration", "Linux VPS"],
    links: [],
  },
  {
    id: "gamestore",
    index: "03",
    title: "GameStore",
    headline: "Building a structured Java backend.",
    summary: "A REST API for a video game catalogue, built layer by layer the way real backends are.",
    kind: "Personal project · REST API",
    meta: [
      { label: "Type", value: "REST API" },
      { label: "Architecture", value: "Controller → Service → Repository" },
    ],
    sections: [
      {
        label: "The goal",
        body: "Not just endpoints that work — a backend with a structure that holds up as it grows.",
        step: 0,
      },
      {
        label: "The approach",
        body: "Each layer has one job: the controller speaks HTTP, the service holds the rules, the repository talks to the database. DTOs shape the responses and a global handler turns exceptions into clean errors.",
        step: 0,
      },
      {
        label: "The system",
        body: "Spring Boot with Spring Data JPA, Bean Validation on every input and unit tests with JUnit 5 and Mockito. Pick an endpoint to follow a request through the layers.",
        step: 0,
      },
    ],
    stack: ["Java", "Spring Boot", "Spring Data JPA", "REST API", "DTOs", "Bean Validation", "JUnit 5", "Mockito"],
    links: [{ href: "https://github.com/naimelhaddadi/GameStore_SpringBoot", label: "Source on GitHub" }],
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
];

export const thinking = ["Think", "Build", "Solve", "Improve"] as const;

export type StackGroup = { title: string; items: string[] };

export const stack: StackGroup[] = [
  { title: "Backend", items: ["Java", "Spring Boot", "Spring Data JPA", "Hibernate", "REST APIs"] },
  { title: "Data", items: ["SQL", "T-SQL", "SQL Server", "H2"] },
  { title: "Other", items: ["Python", "n8n", "Docker", "Git", "Linux", "JUnit", "Mockito"] },
];
