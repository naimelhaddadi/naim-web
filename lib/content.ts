/*
  All copy and data for the site lives here, so sections stay presentational
  and facts are edited in one place. Nothing in this file is invented:
  it mirrors the CV, the recommendation letter and the public repositories.
*/

export const loop = [
  { word: "Think", line: "What is really going on here, and for whom?" },
  { word: "Build", line: "Turn the idea into something that runs." },
  { word: "Solve", line: "Done means the problem is gone, not that the code compiles." },
  { word: "Learn", line: "Every problem leaves something behind." },
  { word: "Repeat", line: "Then on to the next one." },
] as const;

export type StoryStep = { label: string; title: string; body: string };

export type CaseStudy = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  meta: { label: string; value: string }[];
  status: { label: string; live?: boolean };
  story: StoryStep[];
  stack: string[];
  link?: { href: string; label: string };
};

export const lhSport: CaseStudy = {
  id: "lh-sport",
  index: "01",
  title: "LH Sport & Entertainment Management",
  kicker: "One place for everything a scouting team knows.",
  meta: [
    { label: "Context", value: "Internship · Feb – Apr 2026" },
    { label: "Role", value: "Database design · Web interface" },
    { label: "Engine", value: "SQL Server · T-SQL" },
  ],
  status: { label: "Built for the agency's daily work" },
  story: [
    {
      label: "Problem",
      title: "Player data everywhere, system nowhere.",
      body: "Several scouts were tracking a large amount of player information with no central system. Finding anything took time, and nothing was organised the same way twice.",
    },
    {
      label: "Thinking",
      title: "Model the domain before the screens.",
      body: "Before writing a single form I mapped what the business actually deals with — players, clubs, leagues, contracts, agents, transfers — and how each one relates to the rest.",
    },
    {
      label: "System",
      title: "A relational core with the rules built in.",
      body: "A SQL Server schema of 10+ interconnected entities. Business logic lives in T-SQL stored procedures and triggers, so referential integrity is enforced by the database itself. On top, a web interface with forms: registering a player writes straight into the model.",
    },
    {
      label: "Result",
      title: "One structure the whole team shares.",
      body: "A scout registers a player once and the data lands where it belongs, consistent and connected. The manual work the team repeated every week went away — and the internship ended with an official recommendation letter.",
    },
  ],
  stack: ["SQL Server", "T-SQL", "Stored procedures", "Triggers", "Referential integrity", "Web forms"],
  link: { href: "/assets/recomendacion-lh.pdf", label: "Read the recommendation letter" },
};

export const dental: CaseStudy = {
  id: "dental",
  index: "02",
  title: "Dental Clinic Automation",
  kicker: "Appointments that confirm themselves.",
  meta: [
    { label: "Context", value: "Freelance · 2026 – present" },
    { label: "Role", value: "Design · Build · Operations" },
    { label: "Runs on", value: "Linux VPS I administer" },
  ],
  status: { label: "In production · real patients", live: true },
  story: [
    {
      label: "Manual process",
      title: "Reception, one message at a time.",
      body: "The clinic was losing real time messaging patients by hand — every appointment, every confirmation, every reminder.",
    },
    {
      label: "Repetitive communication",
      title: "The same conversation, every day.",
      body: "Patients forgot to reply or didn't show up. The work was repetitive and predictable — exactly the kind of work a system should be doing.",
    },
    {
      label: "Automation",
      title: "Webhooks in, n8n in the middle, WhatsApp out.",
      body: "Webhooks trigger n8n workflows that handle appointments, confirmations and reminders through the WhatsApp Business API, with an LLM integrated into the conversation flow.",
    },
    {
      label: "Real patients",
      title: "Live, and mine to keep running.",
      body: "The system is in production, talking to real patients. It runs on a Linux VPS that I administer myself — keeping it healthy is part of the job.",
    },
  ],
  stack: ["n8n", "WhatsApp Business API", "Webhooks", "LLM integration", "Linux VPS"],
};

export type Endpoint = { method: "GET" | "POST" | "PUT" | "DELETE"; path: string };

export type ApiProject = {
  id: string;
  index: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
  repo: string;
  resource: string;
  layers: { name: string; detail: string }[];
  endpoints: Endpoint[];
};

export const apiProjects: ApiProject[] = [
  {
    id: "gamestore",
    index: "03",
    title: "GameStore",
    summary: "A layered REST API for a video game catalogue — where my backend direction is heading.",
    points: [
      "Controller → Service → Repository, with DTOs for aggregated stats",
      "Custom exceptions resolved by a global exception handler",
      "Bean Validation on input, unit tests with JUnit 5 and Mockito",
    ],
    stack: ["Java 21", "Spring Boot", "Spring Data JPA", "Bean Validation", "JUnit 5", "Mockito", "H2"],
    repo: "https://github.com/naimelhaddadi/GameStore_SpringBoot",
    resource: "games",
    layers: [
      { name: "GameController", detail: "@RestController · @Valid" },
      { name: "GameService", detail: "@Service · business rules" },
      { name: "GameRepository", detail: "Spring Data JPA" },
      { name: "H2", detail: "in-memory database" },
    ],
    endpoints: [
      { method: "GET", path: "/games" },
      { method: "GET", path: "/games/genre/{genre}" },
      { method: "GET", path: "/games/platform/{platform}" },
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
    title: "Academia API",
    summary: "A REST API for managing a programming academy's students.",
    points: [
      "Student management with validated input",
      "Filtering by course and ranking by grade",
      "Aggregated statistics per course",
    ],
    stack: ["Java 21", "Spring Boot", "Spring Data JPA", "Bean Validation", "H2"],
    repo: "https://github.com/naimelhaddadi/Spring-Boot-Academy-Project",
    resource: "students",
    layers: [
      { name: "StudentController", detail: "@RestController" },
      { name: "StudentService", detail: "@Service · rankings, stats" },
      { name: "StudentRepository", detail: "Spring Data JPA" },
      { name: "H2", detail: "in-memory database" },
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
];

export const approach = [
  {
    n: "01",
    title: "Understand",
    line: "I start with the problem, not the code.",
    detail: "Who has it, what it costs them, what “solved” looks like.",
  },
  {
    n: "02",
    title: "Break it down",
    line: "I turn a complex problem into smaller pieces I can reason about.",
    detail: "Entities, flows, edge cases — one at a time.",
  },
  {
    n: "03",
    title: "Build",
    line: "I implement, test and iterate.",
    detail: "Small steps that run, then the next one.",
  },
  {
    n: "04",
    title: "Improve",
    line: "Once it works, I look for ways to make it better.",
    detail: "Cleaner, faster, easier for the next person.",
  },
] as const;

export type StackItem = { name: string; usedIn?: string[]; now?: boolean };
export type StackGroup = { id: string; title: string; caption: string; items: StackItem[] };

const GS = "GameStore";
const AC = "Academia API";
const LH = "LH Sport";
const DC = "Dental automation";

export const stack: StackGroup[] = [
  {
    id: "languages",
    title: "Languages",
    caption: "Java is home. Python is the one I pick up for fun.",
    items: [
      { name: "Java", usedIn: [GS, AC], now: true },
      { name: "Python", usedIn: ["Code in Place"] },
      { name: "SQL / T-SQL", usedIn: [LH] },
      { name: "HTML5" },
      { name: "CSS3" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    caption: "Where I'm going deepest right now.",
    items: [
      { name: "Spring Boot", usedIn: [GS, AC], now: true },
      { name: "Spring Data JPA", usedIn: [GS, AC], now: true },
      { name: "Hibernate", usedIn: [GS, AC] },
      { name: "REST APIs", usedIn: [GS, AC] },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    caption: "I like starting from the data model.",
    items: [
      { name: "SQL Server", usedIn: [LH] },
      { name: "H2", usedIn: [GS, AC] },
      { name: "Relational modelling", usedIn: [LH] },
      { name: "Stored procedures", usedIn: [LH] },
      { name: "Triggers", usedIn: [LH] },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    caption: "Service logic gets tests; dependencies get mocked.",
    items: [
      { name: "JUnit 5", usedIn: [GS] },
      { name: "Mockito", usedIn: [GS] },
    ],
  },
  {
    id: "automation",
    title: "Automation",
    caption: "Glue between real tools — running in production.",
    items: [
      { name: "n8n", usedIn: [DC] },
      { name: "WhatsApp Business API", usedIn: [DC] },
      { name: "Webhooks", usedIn: [DC] },
      { name: "LLM integrations", usedIn: [DC] },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    caption: "The everyday kit, from editor to server.",
    items: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Maven", usedIn: [GS, AC] },
      { name: "Docker" },
      { name: "Linux", usedIn: [DC] },
      { name: "VPS", usedIn: [DC] },
      { name: "Postman" },
      { name: "IntelliJ IDEA" },
      { name: "Eclipse" },
    ],
  },
];

export const record = {
  education: [
    { title: "DAW · Higher Vocational Training", sub: "Web Application Development", date: "09/2025 — present", note: "Average 9.60" },
    { title: "Code in Place 2026", sub: "Stanford University · Python", date: "May 2026" },
    { title: "Specialist Jr. Cybersecurity OT", sub: "Cisco Networking Academy" },
  ],
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "B2–C1 · Cambridge" },
    { name: "Arabic", level: "B1" },
    { name: "Darija", level: "B1" },
  ],
};
