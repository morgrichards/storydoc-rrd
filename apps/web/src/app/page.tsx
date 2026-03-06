"use client";

import Link from "next/link";
import MainNav from "@/components/story-doctor/MainNav";
import LanguageSelector from "@/components/story-doctor/LanguageSelector";
import {
  useActiveCategories,
  useLanguages,
} from "@/features/story-doctor/apiHooks";
import {
  useLanguageParam,
  withLanguage,
} from "@/features/story-doctor/languageParam";

export default function HomePage() {
  const categories = useActiveCategories();
  const languages = useLanguages();
  const { languageCode, setLanguageCode } = useLanguageParam();

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Story Doctor</h1>
            <p className="text-sm text-slate-600">
              Prototype: browse educational content by category and language.
            </p>
          </div>
          {languages.length > 0 && (
            <LanguageSelector
              languages={languages}
              value={languageCode}
              onChange={setLanguageCode}
            />
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={withLanguage(`/category/${category.slug}`, languageCode)}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-300"
            >
              <div className="mb-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {category.iconKey}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{category.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
