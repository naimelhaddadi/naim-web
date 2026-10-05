import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Providers } from "@/components/layout/Providers";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: ["Naim El Haddadi", "backend developer", "Java", "Spring Boot", "SQL Server", "Madrid", "junior developer", "n8n"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_GB",
    firstName: "Naim",
    lastName: "El Haddadi",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

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
  knowsAbout: ["Java", "Spring Boot", "Spring Data JPA", "SQL Server", "T-SQL", "REST APIs", "n8n", "Python"],
  knowsLanguage: ["es", "en", "ar"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-fg px-5 py-3 text-sm font-medium text-ink"
        >
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Cursor />
        </Providers>
        <SmoothScroll />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
