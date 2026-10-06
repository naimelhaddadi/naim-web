import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { RealWorld } from "@/components/sections/RealWorld";
import { Stack } from "@/components/sections/Stack";

/*
  Short on purpose, and always plain vertical scroll: who I am → what I've
  built for real people → what I've built to learn → what I build it with →
  contact. Motion follows a hierarchy: the hero and the real-world work do
  the most, about / projects / stack are calmer, contact is still.
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
