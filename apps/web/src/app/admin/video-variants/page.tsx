"use client";

import { FormEvent, useEffect, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import StatusMessage from "@/components/story-doctor/StatusMessage";
import {
  type VideoId,
  type VideoVariantId,
  useAllVideoVariants,
  useAllVideos,
  useLanguages,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

type VariantForm = {
  videoId: VideoId | "";
  languageCode: string;
  videoUrl: string;
  audioUrl: string;
  subtitleUrl: string;
  version: string;
  active: boolean;
};

const initialForm: VariantForm = {
  videoId: "",
  languageCode: "en",
  videoUrl: "https://cdn.storydoctor.example/video/new-video-en.mp4",
  audioUrl: "",
  subtitleUrl: "",
  version: "v1",
  active: true,
};

export default function AdminVideoVariantsPage() {
  const variants = useAllVideoVariants(true);
  const videos = useAllVideos();
  const languages = useLanguages(true);
  const { createVideoVariant, updateVideoVariant, deleteVideoVariant } =
    useStoryDoctorMutations();

  const [form, setForm] = useState<VariantForm>(initialForm);
  const [editingId, setEditingId] = useState<VideoVariantId | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<VideoVariantId | null>(null);
  const [status, setStatus] = useState<{ tone: "info" | "error"; message: string }>({
    tone: "info",
    message: "",
  });

  useEffect(() => {
    setForm((current) => {
      const nextVideoId = current.videoId || videos[0]?._id || "";
      const nextLanguageCode =
        current.languageCode || languages[0]?.code || initialForm.languageCode;

      if (
        nextVideoId === current.videoId &&
        nextLanguageCode === current.languageCode
      ) {
        return current;
      }

      return {
        ...current,
        videoId: nextVideoId,
        languageCode: nextLanguageCode,
      };
    });
  }, [videos, languages]);

  function resetForm() {
    setForm({
      ...initialForm,
      videoId: videos[0]?._id ?? "",
      languageCode: languages[0]?.code ?? initialForm.languageCode,
    });
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ tone: "info", message: "" });

    if (!form.videoId) {
      setStatus({ tone: "error", message: "Create at least one video first." });
      return;
    }

    try {
      if (editingId) {
        await updateVideoVariant({
          variantId: editingId,
          videoId: form.videoId,
          languageCode: form.languageCode,
          videoUrl: form.videoUrl.trim() || null,
          audioUrl: form.audioUrl.trim() || null,
          subtitleUrl: form.subtitleUrl.trim() || null,
          version: form.version,
          active: form.active,
        });
        setStatus({
          tone: "info",
          message: `Video variant updated: ${form.languageCode}`,
        });
      } else {
        await createVideoVariant({
          videoId: form.videoId,
          languageCode: form.languageCode,
          videoUrl: form.videoUrl.trim() || null,
          audioUrl: form.audioUrl.trim() || null,
          subtitleUrl: form.subtitleUrl.trim() || null,
          version: form.version,
          active: form.active,
        });
        setStatus({
          tone: "info",
          message: `Video variant created: ${form.languageCode}`,
        });
      }

      resetForm();
    } catch (error) {
      setStatus({ tone: "error", message: (error as Error).message });
    }
  }

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Admin: Video Variants</h1>
        <AdminNav />

        <form className="mb-6 rounded border border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
          <div className="grid gap-2 md:grid-cols-3">
            <select
              className="rounded border border-slate-300 px-2 py-1"
              value={form.videoId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  videoId: event.target.value as VideoId,
                }))
              }
            >
              {videos.map((video) => (
                <option key={video._id} value={video._id}>
                  {video.title}
                </option>
              ))}
            </select>
            <select
              className="rounded border border-slate-300 px-2 py-1"
              value={form.languageCode}
              onChange={(event) =>
                setForm((current) => ({ ...current, languageCode: event.target.value }))
              }
            >
              {languages.map((language) => (
                <option key={language._id} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={form.version}
              onChange={(event) => setForm((current) => ({ ...current, version: event.target.value }))}
              placeholder="version"
            />
          </div>

          <div className="mt-2 grid gap-2 md:grid-cols-3">
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={form.videoUrl}
              onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))}
              placeholder="video URL (optional)"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={form.audioUrl}
              onChange={(event) => setForm((current) => ({ ...current, audioUrl: event.target.value }))}
              placeholder="audio URL (optional)"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={form.subtitleUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  subtitleUrl: event.target.value,
                }))
              }
              placeholder="subtitle URL (optional)"
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
              />
              Active
            </label>
            <button className="rounded bg-blue-700 px-3 py-2 text-sm font-medium text-white" type="submit">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <StatusMessage message={status.message} tone={status.tone} />

        <div className="overflow-x-auto rounded border border-slate-200 bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2">Video</th>
                <th className="px-3 py-2">Language</th>
                <th className="px-3 py-2">Version</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{variant.videoTitle}</td>
                  <td className="px-3 py-2">{variant.languageCode}</td>
                  <td className="px-3 py-2">{variant.version}</td>
                  <td className="px-3 py-2">{variant.active ? "yes" : "no"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        type="button"
                        onClick={() => {
                          setPendingDeleteId(null);
                          setEditingId(variant._id);
                          setForm({
                            videoId: variant.videoId,
                            languageCode: variant.languageCode,
                            videoUrl: variant.videoUrl ?? "",
                            audioUrl: variant.audioUrl ?? "",
                            subtitleUrl: variant.subtitleUrl ?? "",
                            version: variant.version,
                            active: variant.active,
                          });
                        }}
                      >
                        Edit
                      </button>

                      {pendingDeleteId === variant._id ? (
                        <>
                          <button
                            className="rounded border border-red-300 px-2 py-1 text-red-700"
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteVideoVariant({ variantId: variant._id });
                                setStatus({
                                  tone: "info",
                                  message: `Video variant deleted: ${variant.videoSlug}:${variant.languageCode}`,
                                });
                              } catch (error) {
                                setStatus({ tone: "error", message: (error as Error).message });
                              } finally {
                                setPendingDeleteId(null);
                                if (editingId === variant._id) {
                                  resetForm();
                                }
                              }
                            }}
                          >
                            Confirm Delete
                          </button>
                          <button
                            className="rounded border border-slate-300 px-2 py-1"
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="rounded border border-red-300 px-2 py-1 text-red-700"
                          type="button"
                          onClick={() => setPendingDeleteId(variant._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
