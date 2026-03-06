"use client";

import { FormEvent, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import {
  useLanguages,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

export default function AdminLanguagesPage() {
  const languages = useLanguages(true);
  const { createLanguage, updateLanguage, deleteLanguage } = useStoryDoctorMutations();

  const [code, setCode] = useState("pt");
  const [name, setName] = useState("Portuguese");
  const [sortOrder, setSortOrder] = useState(7);
  const [active, setActive] = useState(true);
  const [status, setStatus] = useState<string>("");

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    try {
      await createLanguage({
        code,
        name,
        sortOrder,
        active,
      });
      setStatus("Language created");
    } catch (error) {
      setStatus((error as Error).message);
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
          onSubmit={handleCreate}
        >
          <input
            className="rounded border border-slate-300 px-2 py-1"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="code"
          />
          <input
            className="rounded border border-slate-300 px-2 py-1"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="name"
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
          <button className="rounded bg-blue-700 px-3 py-2 text-sm font-medium text-white" type="submit">
            Create
          </button>
        </form>

        {status && <p className="mb-4 text-sm text-slate-700">{status}</p>}

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
                    <div className="flex gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        onClick={async () => {
                          const nextName = window.prompt("Name", language.name) ?? language.name;
                          const nextCode = window.prompt("Code", language.code) ?? language.code;
                          const nextSortOrder = Number(
                            window.prompt("Sort order", String(language.sortOrder)) ??
                              String(language.sortOrder),
                          );
                          const nextActive =
                            (window.prompt("Active? true/false", String(language.active)) ?? "true") ===
                            "true";

                          try {
                            await updateLanguage({
                              languageId: language._id,
                              name: nextName,
                              code: nextCode,
                              sortOrder: nextSortOrder,
                              active: nextActive,
                            });
                            setStatus(`Updated ${language.code}`);
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
                          if (!window.confirm(`Delete language ${language.code}?`)) {
                            return;
                          }

                          try {
                            await deleteLanguage({ languageId: language._id });
                            setStatus(`Deleted ${language.code}`);
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
