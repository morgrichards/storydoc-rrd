"use client";

import { FormEvent, useMemo, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import {
  type CategoryId,
  useAllCategories,
  useAllVideos,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

export default function AdminVideosPage() {
  const categories = useAllCategories();
  const videos = useAllVideos();
  const { createVideo, updateVideo, deleteVideo } = useStoryDoctorMutations();

  const defaultCategoryId = categories[0]?._id;

  const [slug, setSlug] = useState("new-video");
  const [title, setTitle] = useState("New Video");
  const [description, setDescription] = useState("Short description");
  const [categoryId, setCategoryId] = useState<CategoryId | "">("");
  const [durationSeconds, setDurationSeconds] = useState(120);
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.co/640x360?text=Story+Doctor");
  const [sortOrder, setSortOrder] = useState(999);
  const [active, setActive] = useState(true);
  const [status, setStatus] = useState("");

  const effectiveCategoryId = useMemo(() => {
    if (categoryId) {
      return categoryId;
    }

    return defaultCategoryId ?? "";
  }, [categoryId, defaultCategoryId]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!effectiveCategoryId) {
      setStatus("Create at least one category first.");
      return;
    }

    try {
      await createVideo({
        slug,
        title,
        description,
        categoryId: effectiveCategoryId,
        durationSeconds,
        thumbnailUrl,
        sortOrder,
        active,
      });
      setStatus("Video created");
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Admin: Videos</h1>
        <AdminNav />

        <form className="mb-6 rounded border border-slate-200 bg-white p-4" onSubmit={handleCreate}>
          <div className="grid gap-2 md:grid-cols-3">
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="slug"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="title"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              type="number"
              value={durationSeconds}
              onChange={(event) => setDurationSeconds(Number(event.target.value))}
              placeholder="duration"
            />
          </div>
          <textarea
            className="mt-2 w-full rounded border border-slate-300 px-2 py-1"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="description"
          />
          <div className="mt-2 grid gap-2 md:grid-cols-4">
            <select
              className="rounded border border-slate-300 px-2 py-1"
              value={effectiveCategoryId}
              onChange={(event) => setCategoryId(event.target.value as CategoryId)}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={thumbnailUrl}
              onChange={(event) => setThumbnailUrl(event.target.value)}
              placeholder="thumbnail URL"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              type="number"
              value={sortOrder}
              onChange={(event) => setSortOrder(Number(event.target.value))}
              placeholder="sort order"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
              />
              Active
            </label>
          </div>
          <button className="mt-3 rounded bg-blue-700 px-3 py-2 text-sm font-medium text-white" type="submit">
            Create
          </button>
        </form>

        {status && <p className="mb-4 text-sm text-slate-700">{status}</p>}

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
                    <div className="flex gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        onClick={async () => {
                          const nextTitle = window.prompt("Title", video.title) ?? video.title;
                          const nextDescription =
                            window.prompt("Description", video.description) ?? video.description;
                          const nextDuration = Number(
                            window.prompt("Duration seconds", String(video.durationSeconds)) ??
                              String(video.durationSeconds),
                          );
                          const nextSortOrder = Number(
                            window.prompt("Sort order", String(video.sortOrder)) ??
                              String(video.sortOrder),
                          );
                          const nextActive =
                            (window.prompt("Active? true/false", String(video.active)) ?? "true") ===
                            "true";

                          try {
                            await updateVideo({
                              videoId: video._id,
                              title: nextTitle,
                              description: nextDescription,
                              durationSeconds: nextDuration,
                              sortOrder: nextSortOrder,
                              active: nextActive,
                            });
                            setStatus(`Updated ${video.slug}`);
                          } catch (error) {
                            setStatus((error as Error).message);
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border border-red-300 px-2 py-1 text-red-700"
                        onClick={async () => {
                          if (!window.confirm(`Delete video ${video.slug}?`)) {
                            return;
                          }

                          try {
                            await deleteVideo({ videoId: video._id });
                            setStatus(`Deleted ${video.slug}`);
                          } catch (error) {
                            setStatus((error as Error).message);
                          }
                        }}
                      >
                        Delete
                      </button>
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
