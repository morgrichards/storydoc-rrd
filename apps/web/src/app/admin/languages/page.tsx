"use client";

import { FormEvent, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import StatusMessage from "@/components/story-doctor/StatusMessage";
import {
  type LanguageId,
  useLanguages,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

type LanguageForm = {
  code: string;
  name: string;
  sortOrder: number;
  active: boolean;
};

const initialForm: LanguageForm = {
  code: "pt",
  name: "Portuguese",
  sortOrder: 7,
  active: true,
};

export default function AdminLanguagesPage() {
  const languages = useLanguages(true);
  const { createLanguage, updateLanguage, deleteLanguage } = useStoryDoctorMutations();

  const [form, setForm] = useState<LanguageForm>(initialForm);
  const [editingId, setEditingId] = useState<LanguageId | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<LanguageId | null>(null);
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
        await updateLanguage({
          languageId: editingId,
          code: form.code,
          name: form.name,
          sortOrder: form.sortOrder,
          active: form.active,
        });
        setStatus({ tone: "info", message: `Language updated: ${form.code}` });
      } else {
        await createLanguage({
          code: form.code,
          name: form.name,
          sortOrder: form.sortOrder,
          active: form.active,
        });
        setStatus({ tone: "info", message: `Language created: ${form.code}` });
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
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Admin: Languages</h1>
        <AdminNav />

        <form
          className="mb-6 grid gap-2 rounded border border-slate-200 bg-white p-4 md:grid-cols-5"
          onSubmit={handleSubmit}
        >
          <input
            className="rounded border border-slate-300 px-2 py-1"
            value={form.code}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
            placeholder="code"
          />
          <input
            className="rounded border border-slate-300 px-2 py-1"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="name"
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
          <div className="flex gap-2">
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
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Sort</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language) => (
                <tr key={language._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{language.code}</td>
                  <td className="px-3 py-2">{language.name}</td>
                  <td className="px-3 py-2">{language.sortOrder}</td>
                  <td className="px-3 py-2">{language.active ? "yes" : "no"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        type="button"
                        onClick={() => {
                          setPendingDeleteId(null);
                          setEditingId(language._id);
                          setForm({
                            code: language.code,
                            name: language.name,
                            sortOrder: language.sortOrder,
                            active: language.active,
                          });
                        }}
                      >
                        Edit
                      </button>

                      {pendingDeleteId === language._id ? (
                        <>
                          <button
                            className="rounded border border-red-300 px-2 py-1 text-red-700"
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteLanguage({ languageId: language._id });
                                setStatus({ tone: "info", message: `Language deleted: ${language.code}` });
                              } catch (error) {
                                setStatus({ tone: "error", message: (error as Error).message });
                              } finally {
                                setPendingDeleteId(null);
                                if (editingId === language._id) {
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
                          onClick={() => setPendingDeleteId(language._id)}
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
