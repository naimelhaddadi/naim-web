import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Providers } from "@/components/layout/Providers";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { dictionary, home, langs, type Lang } from "@/lib/dictionary";
import { LangProvider } from "@/lib/lang";
import { site } from "@/lib/site";
import "../globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

/* Each language gets its own title, description and a pointer to the other version. */
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  const { meta } = dictionary[lang];
  return {
    metadataBase: new URL(site.url),
    title: meta.title,
    description: meta.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    keywords: ["Naim El Haddadi", "backend developer", "desarrollador backend", "Java", "Spring Boot", "SQL Server", "Madrid", "junior developer", "n8n"],
    alternates: { canonical: home[lang], languages: { en: home.en, es: home.es, "x-default": home.en } },
    openGraph: {
      type: "profile",
      url: home[lang],
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      locale: meta.locale,
      alternateLocale: lang === "en" ? dictionary.es.meta.locale : dictionary.en.meta.locale,
      firstName: "Naim",
      lastName: "El Haddadi",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" },
  sameAs: [site.github, site.linkedin],
  knowsAbout: ["Java", "Spring Boot", "JPA / Hibernate", "SQL", "SQL Server", "REST APIs", "Python", "JavaScript", "PHP"],
  knowsLanguage: ["es", "en", "ar"],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = (await params).lang as Lang;

  return (
    <html
      lang={lang}
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-fg px-5 py-3 text-sm font-medium text-ink"
        >
          {dictionary[lang].skip}
        </a>
        <LangProvider lang={lang}>
          <Providers>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <Cursor />
          </Providers>
        </LangProvider>
        <SmoothScroll />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
