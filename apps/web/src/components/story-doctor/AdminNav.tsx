import Link from "next/link";

const items = [
  { href: "/admin/languages", label: "Languages" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/video-variants", label: "Video Variants" },
];

export default function AdminNav() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
