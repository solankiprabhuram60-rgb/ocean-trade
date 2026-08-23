import { prisma } from "@/lib/db";

const DEFAULT_TAGS = [
  { label: "Coral reef", query: "coral reef", type: "trending", sortOrder: 0 },
  { label: "Submarine", query: "submarine", type: "trending", sortOrder: 1 },
  { label: "Whale shark", query: "whale shark", type: "trending", sortOrder: 2 },
  { label: "Underwater city", query: "underwater city", type: "trending", sortOrder: 3 },
  { label: "Pirate ship", query: "pirate ship", type: "trending", sortOrder: 4 },
  { label: "Newest", query: "__sort:newest", type: "quick", sortOrder: 0 },
  { label: "Top Selling", query: "__sort:top-selling", type: "quick", sortOrder: 1 },
  { label: "Trending", query: "__sort:trending", type: "quick", sortOrder: 2 },
];

const DEFAULT_SECTION = {
  key: "latest_uploads",
  title: "Latest Uploads",
  subtitle: "Fresh 3D models uploaded by creators — updated in real time.",
  limit: 8,
  sortBy: "newest",
  enabled: true,
};

export async function ensureHomeDefaults() {
  const tagCount = await prisma.homeTag.count();
  if (tagCount === 0) {
    await prisma.homeTag.createMany({ data: DEFAULT_TAGS });
  }

  await prisma.homeSection.upsert({
    where: { key: DEFAULT_SECTION.key },
    update: {},
    create: DEFAULT_SECTION,
  });
}

export function tagHref(query: string): string {
  if (query.startsWith("__sort:")) {
    const sort = query.replace("__sort:", "");
    return `/models?sort=${encodeURIComponent(sort)}`;
  }
  return `/models?q=${encodeURIComponent(query)}`;
}

export type SortOption = "newest" | "top-selling" | "trending";

export function resolveProductOrder(sortBy: string) {
  switch (sortBy as SortOption) {
    case "top-selling":
      return [{ salesCount: "desc" as const }, { createdAt: "desc" as const }];
    case "trending":
      return [{ isPremium: "desc" as const }, { salesCount: "desc" as const }, { createdAt: "desc" as const }];
    case "newest":
    default:
      return [{ createdAt: "desc" as const }];
  }
}
