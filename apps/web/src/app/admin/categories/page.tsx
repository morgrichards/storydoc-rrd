"use client";

import { FormEvent, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import StatusMessage from "@/components/story-doctor/StatusMessage";
import {
  type CategoryId,
  useAllCategories,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

type CategoryForm = {
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  sortOrder: number;
  active: boolean;
};

const initialForm: CategoryForm = {
  slug: "community",
  title: "Community",
  description: "Community support resources.",
  iconKey: "group",
  sortOrder: 7,
  active: true,
};

export default function AdminCategoriesPage() {
  const categories = useAllCategories();
  const { createCategory, updateCategory, deleteCategory } = useStoryDoctorMutations();

  const [form, setForm] = useState<CategoryForm>(initialForm);
  const [editingId, setEditingId] = useState<CategoryId | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<CategoryId | null>(null);
  const [status, setStatus] = useState<{ tone: "info" | "error"; message: string }>({
    tone: "info",
    message: "",
  });

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ tone: "info", message: "" });

    try {
      if (editingId) {
        await updateCategory({
          categoryId: editingId,
          slug: form.slug,
          title: form.title,
          description: form.description,
          iconKey: form.iconKey,
          sortOrder: form.sortOrder,
          active: form.active,
        });
        setStatus({ tone: "info", message: `Category updated: ${form.slug}` });
      } else {
        await createCategory({
          slug: form.slug,
          title: form.title,
          description: form.description,
          iconKey: form.iconKey,
          sortOrder: form.sortOrder,
          active: form.active,
        });
        setStatus({ tone: "info", message: `Category created: ${form.slug}` });
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
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Admin: Categories</h1>
        <AdminNav />

        <form className="mb-6 grid gap-2 rounded border border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
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
              value={form.iconKey}
              onChange={(event) => setForm((current) => ({ ...current, iconKey: event.target.value }))}
              placeholder="icon key"
            />
          </div>
          <textarea
            className="rounded border border-slate-300 px-2 py-1"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="description"
          />
          <div className="grid gap-2 md:grid-cols-4">
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
            />
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
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        type="button"
                        onClick={() => {
                          setPendingDeleteId(null);
                          setEditingId(category._id);
                          setForm({
                            slug: category.slug,
                            title: category.title,
                            description: category.description,
                            iconKey: category.iconKey,
                            sortOrder: category.sortOrder,
                            active: category.active,
                          });
                        }}
                      >
                        Edit
                      </button>

                      {pendingDeleteId === category._id ? (
                        <>
                          <button
                            className="rounded border border-red-300 px-2 py-1 text-red-700"
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteCategory({ categoryId: category._id });
                                setStatus({ tone: "info", message: `Category deleted: ${category.slug}` });
                              } catch (error) {
                                setStatus({ tone: "error", message: (error as Error).message });
                              } finally {
                                setPendingDeleteId(null);
                                if (editingId === category._id) {
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
                          onClick={() => setPendingDeleteId(category._id)}
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
