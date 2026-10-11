import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { dictionary, langs, type Lang } from "@/lib/dictionary";

export const alt = "Naim El Haddadi — Backend Developer. I think. I build. I solve. / Desarrollador Backend. Pienso. Construyo. Resuelvo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* one image per language, generated at build time */
export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = dictionary[(await params).lang as Lang];
  const photo = await readFile(join(process.cwd(), "assets/photos/naim-night-og.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#07080a", color: "#ecebe7", position: "relative" }}>
        <img src={src} alt="" width={720} height={630} style={{ position: "absolute", right: 0, top: 0, width: 720, height: 630, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, #07080a 40%, rgba(7,8,10,0.6) 62%, rgba(7,8,10,0.05) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1.5 }}>Naim El Haddadi</div>
            <div style={{ fontSize: 24, color: "#9aa0a8", marginTop: 8 }}>{t.meta.ogRole}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 0.92 }}>
            {t.hero.motto.map((line, i) => (
              <div key={line} style={{ display: "flex", marginLeft: i * 56 }}>
                {line}
                <span style={{ color: "#f2a15a" }}>.</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#9aa0a8", letterSpacing: 3 }}>
            JAVA · SPRING BOOT · SQL · PYTHON — NAIMELHADDADI.COM
          </div>
        </div>
      </div>
    ),
    size,
  );
}
