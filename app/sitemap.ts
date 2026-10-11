import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { localePath, langs } from "@/lib/dictionary";
import { site } from "@/lib/site";

/* Every page in both languages, each entry pointing at its other-language twin. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    ...content.en.realWorld.map((w) => ({ path: `/work/${w.id}`, priority: 0.8 })),
  ];
  return pages.flatMap(({ path, priority }) => {
    const languages = { en: `${site.url}${localePath("en", path)}`, es: `${site.url}${localePath("es", path)}` };
    return langs.map((lang) => ({
      url: languages[lang],
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
