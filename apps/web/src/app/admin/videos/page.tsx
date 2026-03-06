"use client";

import { FormEvent, useEffect, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import StatusMessage from "@/components/story-doctor/StatusMessage";
import {
  type CategoryId,
  type VideoId,
  useAllCategories,
  useAllVideos,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

type VideoForm = {
  slug: string;
  title: string;
  description: string;
  categoryId: CategoryId | "";
  durationSeconds: number;
  thumbnailUrl: string;
  sortOrder: number;
  active: boolean;
};

const initialForm: VideoForm = {
  slug: "new-video",
  title: "New Video",
  description: "Short description",
  categoryId: "",
  durationSeconds: 120,
  thumbnailUrl: "https://placehold.co/640x360?text=Story+Doctor",
  sortOrder: 999,
  active: true,
};

export default function AdminVideosPage() {
  const categories = useAllCategories();
  const videos = useAllVideos();
  const { createVideo, updateVideo, deleteVideo } = useStoryDoctorMutations();

  const [form, setForm] = useState<VideoForm>(initialForm);
  const [editingId, setEditingId] = useState<VideoId | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<VideoId | null>(null);
  const [status, setStatus] = useState<{ tone: "info" | "error"; message: string }>({
    tone: "info",
    message: "",
  });

  useEffect(() => {
    if (form.categoryId || categories.length === 0) {
      return;
    }

    setForm((current) => ({
      ...current,
      categoryId: categories[0]._id,
    }));
  }, [categories, form.categoryId]);

  function resetForm() {
    setForm((current) => ({
      ...initialForm,
      categoryId: categories[0]?._id ?? "",
    }));
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ tone: "info", message: "" });

    if (!form.categoryId) {
      setStatus({ tone: "error", message: "Create at least one category first." });
      return;
    }

    try {
      if (editingId) {
        await updateVideo({
          videoId: editingId,
          slug: form.slug,
          title: form.title,
          description: form.description,
          categoryId: form.categoryId,
          durationSeconds: form.durationSeconds,
          thumbnailUrl: form.thumbnailUrl,
          sortOrder: form.sortOrder,
          active: form.active,
        });
        setStatus({ tone: "info", message: `Video updated: ${form.slug}` });
      } else {
        await createVideo({
          slug: form.slug,
          title: form.title,
          description: form.description,
          categoryId: form.categoryId,
          durationSeconds: form.durationSeconds,
          thumbnailUrl: form.thumbnailUrl,
          sortOrder: form.sortOrder,
          active: form.active,
        });
        setStatus({ tone: "info", message: `Video created: ${form.slug}` });
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
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Admin: Videos</h1>
        <AdminNav />

        <form className="mb-6 rounded border border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
          <div className="grid gap-2 md:grid-cols-3">
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="slug"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="title"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              type="number"
              value={form.durationSeconds}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  durationSeconds: Number(event.target.value),
                }))
              }
              placeholder="duration"
            />
          </div>
          <textarea
            className="mt-2 w-full rounded border border-slate-300 px-2 py-1"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="description"
          />
          <div className="mt-2 grid gap-2 md:grid-cols-4">
            <select
              className="rounded border border-slate-300 px-2 py-1"
              value={form.categoryId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  categoryId: event.target.value as CategoryId,
                }))
              }
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={form.thumbnailUrl}
              onChange={(event) => setForm((current) => ({ ...current, thumbnailUrl: event.target.value }))}
              placeholder="thumbnail URL"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sortOrder: Number(event.target.value),
                }))
              }
              placeholder="sort order"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
              />
              Active
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
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
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Duration</th>
                <th className="px-3 py-2">Sort</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{video.slug}</td>
                  <td className="px-3 py-2">{video.title}</td>
                  <td className="px-3 py-2">{video.categoryTitle}</td>
                  <td className="px-3 py-2">{video.durationSeconds}s</td>
                  <td className="px-3 py-2">{video.sortOrder}</td>
                  <td className="px-3 py-2">{video.active ? "yes" : "no"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        type="button"
                        onClick={() => {
                          setPendingDeleteId(null);
                          setEditingId(video._id);
                          setForm({
                            slug: video.slug,
                            title: video.title,
                            description: video.description,
                            categoryId: video.categoryId,
                            durationSeconds: video.durationSeconds,
                            thumbnailUrl: video.thumbnailUrl,
                            sortOrder: video.sortOrder,
                            active: video.active,
                          });
                        }}
                      >
                        Edit
                      </button>

                      {pendingDeleteId === video._id ? (
                        <>
                          <button
                            className="rounded border border-red-300 px-2 py-1 text-red-700"
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteVideo({ videoId: video._id });
                                setStatus({ tone: "info", message: `Video deleted: ${video.slug}` });
                              } catch (error) {
                                setStatus({ tone: "error", message: (error as Error).message });
                              } finally {
                                setPendingDeleteId(null);
                                if (editingId === video._id) {
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
                          onClick={() => setPendingDeleteId(video._id)}
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
