import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Stack } from "@/components/sections/Stack";
import { Thinking } from "@/components/sections/Thinking";
import { Work } from "@/components/sections/Work";

/*
  Short on purpose: who I am → what I build → how I think → contact.
  The hero does the "wow", the work is interactive, the rest stays calm.
  Education, languages and the rest of the details live in the CV.
*/
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Thinking />
      <Stack />
      <Contact />
    </>
  );
}
