"use client";

import { useState } from "react";
import Link from "next/link";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import StatusMessage from "@/components/story-doctor/StatusMessage";
import { useStoryDoctorMutations } from "@/features/story-doctor/apiHooks";

export default function AdminHomePage() {
  const { seedStoryDoctorData } = useStoryDoctorMutations();
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<{ tone: "info" | "error"; message: string }>({
    tone: "info",
    message: "",
  });

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Admin</h1>
        <p className="mb-6 text-sm text-slate-600">
          Basic CRUD pages for Story Doctor content management.
        </p>
        <AdminNav />
        <StatusMessage message={status.message} tone={status.tone} />
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white"
            disabled={isSeeding}
            onClick={async () => {
              setIsSeeding(true);
              setStatus({ tone: "info", message: "" });

              try {
                const result = await seedStoryDoctorData({ resetExisting: true });
                setStatus({
                  tone: "info",
                  message: `Reseeded: ${result.categories} categories, ${result.videosCreated} videos, ${result.videoVariantsCreated} variants.`,
                });
              } catch (error) {
                setStatus({ tone: "error", message: (error as Error).message });
              } finally {
                setIsSeeding(false);
              }
            }}
          >
            {isSeeding ? "Seeding..." : "Reseed Demo Data"}
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
