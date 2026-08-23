import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureHomeDefaults, tagHref } from "@/lib/home";

export async function GET() {
  await ensureHomeDefaults();

  const [tags, section] = await Promise.all([
    prisma.homeTag.findMany({
      where: { enabled: true },
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.homeSection.findUnique({ where: { key: "latest_uploads" } }),
  ]);

  return NextResponse.json({
    trendingTags: tags
      .filter((t) => t.type === "trending")
      .map((t) => ({ id: t.id, label: t.label, href: tagHref(t.query) })),
    quickTags: tags
      .filter((t) => t.type === "quick")
      .map((t) => ({ id: t.id, label: t.label, href: tagHref(t.query) })),
    latestUploads: section
      ? {
          title: section.title,
          subtitle: section.subtitle,
          limit: section.limit,
          sortBy: section.sortBy,
          enabled: section.enabled,
        }
      : null,
  });
}
