import Link from "next/link";

export default function MainNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 text-sm font-medium text-slate-700 md:px-6">
        <Link href="/" className="text-slate-900">
          Story Doctor
        </Link>
        <Link href="/">Browse</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  );
}
