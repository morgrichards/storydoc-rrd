"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import MainNav from "@/components/story-doctor/MainNav";
import LanguageSelector from "@/components/story-doctor/LanguageSelector";
import {
  useLanguages,
  useVideosByCategory,
} from "@/features/story-doctor/apiHooks";
import {
  useLanguageParam,
  withLanguage,
} from "@/features/story-doctor/languageParam";
import { formatDuration } from "@/features/story-doctor/format";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const categorySlug = params.slug;

  const payload = useVideosByCategory(categorySlug);
  const languages = useLanguages();
  const { languageCode, setLanguageCode } = useLanguageParam();

  const category = payload?.category;
  const videos = payload?.videos ?? [];

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href={withLanguage("/", languageCode)} className="text-sm text-blue-700">
              Back to categories
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {category?.title ?? "Category"}
            </h1>
            <p className="text-sm text-slate-600">{category?.description}</p>
          </div>
          {languages.length > 0 && (
            <LanguageSelector
              languages={languages}
              value={languageCode}
              onChange={setLanguageCode}
            />
          )}
        </div>

        {videos.length === 0 ? (
          <p className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No active videos are available for this category yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Link
                key={video._id}
                href={withLanguage(`/video/${video.slug}`, languageCode)}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="mb-3 aspect-video rounded bg-slate-200" />
                <h2 className="text-base font-semibold text-slate-900">{video.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{video.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Duration: {formatDuration(video.durationSeconds)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Languages: {video.availableLanguageCodes.join(", ") || "none"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
