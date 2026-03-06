"use client";

import { FormEvent, useMemo, useState } from "react";
import MainNav from "@/components/story-doctor/MainNav";
import AdminNav from "@/components/story-doctor/AdminNav";
import {
  type VideoId,
  useAllVideoVariants,
  useAllVideos,
  useLanguages,
  useStoryDoctorMutations,
} from "@/features/story-doctor/apiHooks";

export default function AdminVideoVariantsPage() {
  const variants = useAllVideoVariants(true);
  const videos = useAllVideos();
  const languages = useLanguages(true);
  const { createVideoVariant, updateVideoVariant, deleteVideoVariant } =
    useStoryDoctorMutations();

  const [videoId, setVideoId] = useState<VideoId | "">("");
  const [languageCode, setLanguageCode] = useState("en");
  const [videoUrl, setVideoUrl] = useState("https://cdn.storydoctor.example/video/new-video-en.mp4");
  const [audioUrl, setAudioUrl] = useState("");
  const [subtitleUrl, setSubtitleUrl] = useState("");
  const [version, setVersion] = useState("v1");
  const [active, setActive] = useState(true);
  const [status, setStatus] = useState("");

  const effectiveVideoId = useMemo(() => {
    if (videoId) {
      return videoId;
    }
    return videos[0]?._id ?? "";
  }, [videoId, videos]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!effectiveVideoId) {
      setStatus("Create at least one video first.");
      return;
    }

    try {
      await createVideoVariant({
        videoId: effectiveVideoId,
        languageCode,
        videoUrl: videoUrl.trim() || null,
        audioUrl: audioUrl.trim() || null,
        subtitleUrl: subtitleUrl.trim() || null,
        version,
        active,
      });
      setStatus("Video variant created");
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  return (
    <main>
      <MainNav />
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Admin: Video Variants</h1>
        <AdminNav />

        <form className="mb-6 rounded border border-slate-200 bg-white p-4" onSubmit={handleCreate}>
          <div className="grid gap-2 md:grid-cols-3">
            <select
              className="rounded border border-slate-300 px-2 py-1"
              value={effectiveVideoId}
              onChange={(event) => setVideoId(event.target.value as VideoId)}
            >
              {videos.map((video) => (
                <option key={video._id} value={video._id}>
                  {video.title}
                </option>
              ))}
            </select>
            <select
              className="rounded border border-slate-300 px-2 py-1"
              value={languageCode}
              onChange={(event) => setLanguageCode(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language._id} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={version}
              onChange={(event) => setVersion(event.target.value)}
              placeholder="version"
            />
          </div>

          <div className="mt-2 grid gap-2 md:grid-cols-3">
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="video URL (optional)"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={audioUrl}
              onChange={(event) => setAudioUrl(event.target.value)}
              placeholder="audio URL (optional)"
            />
            <input
              className="rounded border border-slate-300 px-2 py-1"
              value={subtitleUrl}
              onChange={(event) => setSubtitleUrl(event.target.value)}
              placeholder="subtitle URL (optional)"
            />
          </div>

          <div className="mt-2 flex items-center gap-3">
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
                    <div className="flex gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        onClick={async () => {
                          const nextVersion = window.prompt("Version", variant.version) ?? variant.version;
                          const nextVideoUrl = window.prompt("Video URL", variant.videoUrl ?? "") ?? "";
                          const nextAudioUrl = window.prompt("Audio URL", variant.audioUrl ?? "") ?? "";
                          const nextSubtitleUrl =
                            window.prompt("Subtitle URL", variant.subtitleUrl ?? "") ?? "";
                          const nextActive =
                            (window.prompt("Active? true/false", String(variant.active)) ?? "true") ===
                            "true";

                          try {
                            await updateVideoVariant({
                              variantId: variant._id,
                              version: nextVersion,
                              videoUrl: nextVideoUrl.trim() || null,
                              audioUrl: nextAudioUrl.trim() || null,
                              subtitleUrl: nextSubtitleUrl.trim() || null,
                              active: nextActive,
                            });
                            setStatus(`Updated ${variant.videoSlug}:${variant.languageCode}`);
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
                          if (
                            !window.confirm(
                              `Delete variant ${variant.videoSlug}:${variant.languageCode}?`,
                            )
                          ) {
                            return;
                          }

                          try {
                            await deleteVideoVariant({ variantId: variant._id });
                            setStatus(`Deleted ${variant.videoSlug}:${variant.languageCode}`);
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
