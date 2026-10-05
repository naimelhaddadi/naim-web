import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Record } from "@/components/sections/Record";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";

/*
  The page reads as one argument:
  who (hero) → how he thinks (philosophy, loop) → proof (work) →
  method (approach) → tools (stack) → the person (about, record) → next problem (contact).
*/
export default function Home() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Work />
      <Approach />
      <Stack />
      <About />
      <Record />
      <Contact />
    </>
  );
}
