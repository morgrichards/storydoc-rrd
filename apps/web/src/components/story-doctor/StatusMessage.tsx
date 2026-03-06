export default function StatusMessage({
  message,
  tone = "info",
}: {
  message: string;
  tone?: "info" | "error";
}) {
  if (!message) {
    return null;
  }

  const classes =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-blue-200 bg-blue-50 text-blue-800";

  return <p className={`mb-4 rounded border px-3 py-2 text-sm ${classes}`}>{message}</p>;
}
