"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANGUAGE_CODE } from "@packages/backend/convex/storyDoctorShared";

export function useLanguageParam() {
  const [languageCode, setLanguageCodeState] = useState(DEFAULT_LANGUAGE_CODE);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromSearch = params.get("lang")?.trim().toLowerCase();
    if (fromSearch) {
      setLanguageCodeState(fromSearch);
    }
  }, []);

  function setLanguageCode(nextLanguageCode: string) {
    const normalized = nextLanguageCode.trim().toLowerCase();
    setLanguageCodeState(normalized);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", normalized);
    window.history.replaceState({}, "", url.toString());
  }

  return {
    languageCode,
    setLanguageCode,
  };
}

export function withLanguage(path: string, languageCode: string): string {
  const encoded = encodeURIComponent(languageCode);
  return `${path}?lang=${encoded}`;
}
