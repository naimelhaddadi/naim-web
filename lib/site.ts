export const site = {
  name: "Naim El Haddadi",
  role: "Backend Developer",
  location: "Madrid, Spain",
  url: "https://naimelhaddadi.com",
  email: "naimhaddadi15@gmail.com",
  github: "https://github.com/naimelhaddadi",
  linkedin: "https://www.linkedin.com/in/naimelhaddadi",
  cv: "/assets/CV_Naim_El_Haddadi.pdf",
  source: "https://github.com/naimelhaddadi/naim-web",
} as const;

/* The menu: section anchors, labelled from the dictionary (nav.links). */
export const nav = [
  { href: "#about", key: "about" },
  { href: "#how", key: "how" },
  { href: "#work", key: "work" },
  { href: "#projects", key: "projects" },
  { href: "#stack", key: "stack" },
  { href: "#contact", key: "contact" },
] as const;
