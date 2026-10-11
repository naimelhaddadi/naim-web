"use client";

import { createContext, useContext, type ReactNode } from "react";
import { content } from "./content";
import { dictionary, localePath, type Lang } from "./dictionary";

/*
  The language of the page, decided by the URL (/ = English, /es = Spanish)
  and handed down to every component through context.
*/
const LangContext = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext value={lang}>{children}</LangContext>;
}

export const useLang = () => useContext(LangContext);

/* The interface texts in the current language. */
export const useT = () => dictionary[useLang()];

/* The projects, the process and the stack in the current language. */
export const useContent = () => content[useLang()];

/* A path of the site in the current language: "/work/x" → "/es/work/x" in Spanish. */
export function useLocalePath() {
  const lang = useLang();
  return (path: string) => localePath(lang, path);
}
