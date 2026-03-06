export type Language = {
  code: string;
  name: string;
  active: boolean;
  sortOrder: number;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  active: boolean;
  sortOrder: number;
};

export type Video = {
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  durationSeconds: number;
  thumbnailUrl: string;
  active: boolean;
  sortOrder: number;
};

export type VideoVariant = {
  videoId: string;
  languageCode: string;
  videoUrl: string | null;
  audioUrl: string | null;
  subtitleUrl: string | null;
  version: string;
  active: boolean;
};

export type VideoWithVariants = Video & {
  variants: VideoVariant[];
};

export const DEFAULT_LANGUAGE_CODE = "en";

export function normalizeLanguageCode(code: string): string {
  return code.trim().toLowerCase();
}

export function getLanguageFallbackChain(
  preferredLanguageCode?: string,
  fallbackLanguageCode = DEFAULT_LANGUAGE_CODE,
): string[] {
  const preferred = preferredLanguageCode
    ? normalizeLanguageCode(preferredLanguageCode)
    : undefined;
  const fallback = normalizeLanguageCode(fallbackLanguageCode);

  if (!preferred || preferred === fallback) {
    return [fallback];
  }

  return [preferred, fallback];
}

export function pickVariantForLanguage<T extends { languageCode: string; active: boolean }>(
  variants: T[],
  preferredLanguageCode?: string,
  fallbackLanguageCode = DEFAULT_LANGUAGE_CODE,
): T | null {
  const fallbackChain = getLanguageFallbackChain(
    preferredLanguageCode,
    fallbackLanguageCode,
  );

  for (const code of fallbackChain) {
    const match = variants.find(
      (variant) => variant.active && normalizeLanguageCode(variant.languageCode) === code,
    );

    if (match) {
      return match;
    }
  }

  return variants.find((variant) => variant.active) ?? null;
}
