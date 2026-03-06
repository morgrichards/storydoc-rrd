"use client";

import { ReactNode, useMemo } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";

function getConvexConfigError(url: string | undefined) {
  if (!url) {
    return "Missing NEXT_PUBLIC_CONVEX_URL.";
  }

  if (url.includes("placeholder.convex.cloud") || url.includes("placeholder.convex.site")) {
    return "NEXT_PUBLIC_CONVEX_URL is still set to a placeholder value.";
  }

  try {
    const parsed = new URL(url);
    const isConvexHost =
      parsed.hostname.endsWith(".convex.cloud") ||
      parsed.hostname.endsWith(".convex.site");

    if (!isConvexHost) {
      return "NEXT_PUBLIC_CONVEX_URL must point to your Convex deployment host.";
    }
  } catch {
    return "NEXT_PUBLIC_CONVEX_URL is not a valid URL.";
  }

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const configError = getConvexConfigError(convexUrl);

  const convex = useMemo(() => {
    if (configError || !convexUrl) {
      return null;
    }

    try {
      return new ConvexReactClient(convexUrl);
    } catch {
      return null;
    }
  }, [convexUrl, configError]);

  if (!convex) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 text-slate-900">
        <h1 className="text-xl font-semibold">Convex Configuration Required</h1>
        <p className="mt-2 text-sm text-slate-700">
          {configError ?? "Could not initialize Convex client."}
        </p>
        <p className="mt-3 text-sm text-slate-700">
          Create <code>apps/web/.env.local</code> with:
        </p>
        <pre className="mt-2 overflow-x-auto rounded bg-slate-100 p-3 text-sm text-slate-800">
{`NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud`}
        </pre>
        <p className="mt-3 text-sm text-slate-700">
          Then restart the Next.js dev server.
        </p>
      </main>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
