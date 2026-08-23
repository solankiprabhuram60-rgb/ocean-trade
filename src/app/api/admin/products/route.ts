import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated, serializeProduct, slugify } from "@/lib/utils";
import { saveUploadedFile } from "@/lib/upload";
import { computeImageHashFromFile } from "@/lib/imageHash";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    products: products.map(serializeProduct),
  });
}

export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const author = (formData.get("author") as string)?.trim() || "Ocean Trade";
    const tags = (formData.get("tags") as string)?.trim() || "";
    const price = parseFloat((formData.get("price") as string) || "0");
    const isFree = formData.get("isFree") === "true";
    const isPremium = formData.get("isPremium") === "true";
    const imageFile = formData.get("image") as File | null;
    const modelFile = formData.get("modelFile") as File | null;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Product image is required" }, { status: 400 });
    }

    if (!modelFile || modelFile.size === 0) {
      return NextResponse.json({ error: "3D model file is required" }, { status: 400 });
    }

    let slug = slugify(title);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const image = await saveUploadedFile(imageFile, "img");
    const model = await saveUploadedFile(modelFile, "model");
    const imageHash = await computeImageHashFromFile(imageFile);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        category,
        author,
        tags,
        price: isFree ? 0 : price,
        isFree,
        isPremium,
        imageUrl: image.url,
        fileUrl: model.url,
        fileName: model.fileName,
        imageHash,
      },
    });

    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
