"use client";

import Link from "next/link";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import { useStoryDoctorMutations } from "@/features/story-doctor/apiHooks";

export default function AdminHomePage() {
  const { seedStoryDoctorData } = useStoryDoctorMutations();

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Admin</h1>
        <p className="mb-6 text-sm text-slate-600">
          Basic CRUD pages for Story Doctor content management.
        </p>
        <AdminNav />
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white"
            onClick={() => seedStoryDoctorData({ resetExisting: true })}
          >
            Reseed Demo Data
          </button>
          <Link
            href="/"
            className="rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
          >
            Back to Browse
          </Link>
        </div>
      </section>
    </main>
  );
}
