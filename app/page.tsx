import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { RealWorld } from "@/components/sections/RealWorld";
import { Stack } from "@/components/sections/Stack";

/*
  Short on purpose: who I am → what I've built for real people → what I've
  built to learn → what I build it with → contact. The hero does the "wow",
  the real-world work is the pinned horizontal section, the rest is calmer.
  Education, languages and the rest of the details live in the CV.
*/
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <RealWorld />
      <Projects />
      <Stack />
      <Contact />
    </>
  );
}
