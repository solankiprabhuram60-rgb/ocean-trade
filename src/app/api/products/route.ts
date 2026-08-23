import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";
import { resolveProductOrder } from "@/lib/home";
import { computeImageHashFromFile, hammingDistance } from "@/lib/imageHash";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category")?.trim() || "";
  const author = searchParams.get("author")?.trim() || "";
  const sort = searchParams.get("sort")?.trim() || "newest";
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  const andFilters: any[] = [];

  if (q) {
    andFilters.push({
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { tags: { contains: q } },
        { author: { contains: q } },
      ],
    });
  } else {
    andFilters.push({});
  }

  if (category) andFilters.push({ category: { equals: category } });
  if (author) andFilters.push({ author: { equals: author } });

  const products = await prisma.product.findMany({
    where: {
      AND: andFilters,
    },
    orderBy: resolveProductOrder(sort),
    ...(limit ? { take: limit } : {}),
  });

  return NextResponse.json({
    products: products.map(serializeProduct),
    count: products.length,
    query: q,
    sort,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const searchHash = await computeImageHashFromFile(imageFile);
    const allProducts = await prisma.product.findMany({
      where: { imageHash: { not: "" } },
    });

    const scored = allProducts
      .map((p) => ({
        product: p,
        distance: hammingDistance(searchHash, p.imageHash),
      }))
      .filter((s) => s.distance <= 20)
      .sort((a, b) => a.distance - b.distance);

    const products = scored.map((s) => serializeProduct(s.product));

    return NextResponse.json({
      products,
      count: products.length,
      mode: "visual",
      message:
        products.length > 0
          ? `Found ${products.length} similar design(s)`
          : "No similar designs found. Try a clearer product image.",
    });
  } catch (error) {
    console.error("Visual search error:", error);
    return NextResponse.json({ error: "Visual search failed" }, { status: 500 });
  }
}
