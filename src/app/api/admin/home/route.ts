import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/utils";
import { ensureHomeDefaults } from "@/lib/home";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureHomeDefaults();

  const [tags, section] = await Promise.all([
    prisma.homeTag.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }] }),
    prisma.homeSection.findUnique({ where: { key: "latest_uploads" } }),
  ]);

  return NextResponse.json({ tags, section });
}

export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "createTag") {
    const { label, query, type } = body;
    const maxOrder = await prisma.homeTag.aggregate({
      where: { type },
      _max: { sortOrder: true },
    });
    const tag = await prisma.homeTag.create({
      data: {
        label,
        query,
        type,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json({ tag });
  }

  if (action === "updateTag") {
    const { id, label, query, type, enabled, sortOrder } = body;
    const tag = await prisma.homeTag.update({
      where: { id },
      data: { label, query, type, enabled, sortOrder },
    });
    return NextResponse.json({ tag });
  }

  if (action === "deleteTag") {
    await prisma.homeTag.delete({ where: { id: body.id } });
    return NextResponse.json({ success: true });
  }

  if (action === "updateSection") {
    const { title, subtitle, limit, sortBy, enabled } = body;
    const section = await prisma.homeSection.update({
      where: { key: "latest_uploads" },
      data: { title, subtitle, limit, sortBy, enabled },
    });
    return NextResponse.json({ section });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
