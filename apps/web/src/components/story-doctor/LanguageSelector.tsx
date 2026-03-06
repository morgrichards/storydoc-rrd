"use client";

type LanguageOption = {
  code: string;
  name: string;
};

export default function LanguageSelector({
  languages,
  value,
  onChange,
}: {
  languages: LanguageOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      Language
      <select
        className="rounded border border-slate-300 bg-white px-2 py-1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </label>
  );
}
