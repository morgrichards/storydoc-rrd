"use client";

import { FormEvent, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import {
  useAllCategories,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

export default function AdminCategoriesPage() {
  const categories = useAllCategories();
  const { createCategory, updateCategory, deleteCategory } = useStoryDoctorMutations();

  const [slug, setSlug] = useState("community");
  const [title, setTitle] = useState("Community");
  const [description, setDescription] = useState("Community support resources.");
  const [iconKey, setIconKey] = useState("group");
  const [sortOrder, setSortOrder] = useState(7);
  const [active, setActive] = useState(true);
  const [status, setStatus] = useState("");

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    try {
      await createCategory({
        slug,
        title,
        description,
        iconKey,
        sortOrder,
        active,
      });
      setStatus("Category created");
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Admin: Categories</h1>
        <AdminNav />

        <form className="mb-6 grid gap-2 rounded border border-slate-200 bg-white p-4" onSubmit={handleCreate}>
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
              value={iconKey}
              onChange={(event) => setIconKey(event.target.value)}
              placeholder="icon key"
            />
          </div>
          <textarea
            className="rounded border border-slate-300 px-2 py-1"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="description"
          />
          <div className="grid gap-2 md:grid-cols-3">
            <input
              className="rounded border border-slate-300 px-2 py-1"
              type="number"
              value={sortOrder}
              onChange={(event) => setSortOrder(Number(event.target.value))}
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
              />
              Active
            </label>
            <button className="rounded bg-blue-700 px-3 py-2 text-sm font-medium text-white" type="submit">
              Create
            </button>
          </div>
        </form>

        {status && <p className="mb-4 text-sm text-slate-700">{status}</p>}

        <div className="overflow-x-auto rounded border border-slate-200 bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Icon</th>
                <th className="px-3 py-2">Sort</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{category.slug}</td>
                  <td className="px-3 py-2">{category.title}</td>
                  <td className="px-3 py-2">{category.iconKey}</td>
                  <td className="px-3 py-2">{category.sortOrder}</td>
                  <td className="px-3 py-2">{category.active ? "yes" : "no"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        onClick={async () => {
                          const nextTitle = window.prompt("Title", category.title) ?? category.title;
                          const nextDescription =
                            window.prompt("Description", category.description) ?? category.description;
                          const nextIconKey = window.prompt("Icon key", category.iconKey) ?? category.iconKey;
                          const nextSortOrder = Number(
                            window.prompt("Sort order", String(category.sortOrder)) ??
                              String(category.sortOrder),
                          );
                          const nextActive =
                            (window.prompt("Active? true/false", String(category.active)) ?? "true") ===
                            "true";

                          try {
                            await updateCategory({
                              categoryId: category._id,
                              title: nextTitle,
                              description: nextDescription,
                              iconKey: nextIconKey,
                              sortOrder: nextSortOrder,
                              active: nextActive,
                            });
                            setStatus(`Updated ${category.slug}`);
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
                          if (!window.confirm(`Delete category ${category.slug}?`)) {
                            return;
                          }

                          try {
                            await deleteCategory({ categoryId: category._id });
                            setStatus(`Deleted ${category.slug}`);
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
