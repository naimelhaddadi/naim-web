import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case/CaseStudy";
import { realWorld } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return realWorld.map((w) => ({ slug: w.id }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = realWorld.find((w) => w.id === slug);
  if (!work) return {};
  const title = `${work.title} — ${site.name}`;
  return {
    title,
    description: work.intro,
    alternates: { canonical: `/work/${work.id}` },
    openGraph: { title, description: work.intro, url: `/work/${work.id}` },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const i = realWorld.findIndex((w) => w.id === slug);
  if (i < 0) notFound();
  return <CaseStudy work={realWorld[i]} next={realWorld[(i + 1) % realWorld.length]} />;
}
