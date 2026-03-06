"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import MainNav from "@/components/story-doctor/MainNav";
import LanguageSelector from "@/components/story-doctor/LanguageSelector";
import {
  useLanguages,
  useVideoWithVariants,
} from "@/features/story-doctor/apiHooks";
import {
  useLanguageParam,
  withLanguage,
} from "@/features/story-doctor/languageParam";
import { formatDuration } from "@/features/story-doctor/format";
import { pickVariantForLanguage } from "@packages/backend/convex/storyDoctorShared";

export default function VideoPage() {
  const params = useParams<{ slug: string }>();
  const videoSlug = params.slug;

  const video = useVideoWithVariants(videoSlug);
  const languages = useLanguages();
  const { languageCode, setLanguageCode } = useLanguageParam();

  const selectedVariant = video
    ? pickVariantForLanguage(video.variants, languageCode)
    : null;

  const activeVariants = video?.variants.filter((variant) => variant.active) ?? [];

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            {video?.category?.slug && (
              <Link
                href={withLanguage(`/category/${video.category.slug}`, languageCode)}
                className="text-sm text-blue-700"
              >
                Back to {video.category.title}
              </Link>
            )}
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {video?.title ?? "Video"}
            </h1>
            <p className="text-sm text-slate-600">{video?.description}</p>
          </div>
          {languages.length > 0 && (
            <LanguageSelector
              languages={languages}
              value={languageCode}
              onChange={setLanguageCode}
            />
          )}
        </div>

        <div className="mb-6 rounded-lg border border-dashed border-slate-300 bg-slate-100 p-6">
          <div className="mb-2 text-sm font-medium text-slate-700">Player Placeholder</div>
          <div className="aspect-video rounded bg-slate-300" />
          <p className="mt-3 text-sm text-slate-700">
            Selected language: {selectedVariant?.languageCode ?? "none"}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Video URL: {selectedVariant?.videoUrl ?? "No dedicated file (shared animation mode)"}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Audio URL: {selectedVariant?.audioUrl ?? "None"}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Subtitle URL: {selectedVariant?.subtitleUrl ?? "None"}
          </p>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-slate-900">Metadata</h2>
          <p className="mt-2 text-sm text-slate-600">Slug: {video?.slug}</p>
          <p className="text-sm text-slate-600">
            Duration: {video ? formatDuration(video.durationSeconds) : "-"}
          </p>
          <p className="text-sm text-slate-600">
            Available language variants: {activeVariants.map((variant) => variant.languageCode).join(", ")}
          </p>
        </div>
      </section>
    </main>
  );
}
