import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case/CaseStudy";
import { content } from "@/lib/content";
import { localePath, type Lang } from "@/lib/dictionary";
import { site } from "@/lib/site";

export const dynamicParams = false;

/* the [lang] layout already gives one set of params per language; here, one page per case */
export function generateStaticParams() {
  return content.en.realWorld.map((w) => ({ slug: w.id }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const work = content[lang as Lang].realWorld.find((w) => w.id === slug);
  if (!work) return {};
  const title = `${work.title} — ${site.name}`;
  const path = `/work/${work.id}`;
  return {
    title,
    description: work.intro,
    alternates: {
      canonical: localePath(lang as Lang, path),
      languages: { en: localePath("en", path), es: localePath("es", path), "x-default": localePath("en", path) },
    },
    openGraph: { title, description: work.intro, url: localePath(lang as Lang, path) },
  };
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  const { realWorld } = content[lang as Lang];
  const i = realWorld.findIndex((w) => w.id === slug);
  if (i < 0) notFound();
  return <CaseStudy work={realWorld[i]} next={realWorld[(i + 1) % realWorld.length]} />;
}
