export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function toBooleanInput(rawValue: string): boolean {
  return rawValue.trim().toLowerCase() === "true";
}
