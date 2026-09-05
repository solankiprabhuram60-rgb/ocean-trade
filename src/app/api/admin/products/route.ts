import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import {
  isAdminAuthenticated,
  serializeProduct,
  slugify,
} from "@/lib/utils";
import { saveUploadedFile } from "@/lib/upload";
import { computeImageHashFromFile } from "@/lib/imageHash";

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      products: products.map(serializeProduct),
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const title =
      (formData.get("title") as string)?.trim() || "";

    const description =
      (formData.get("description") as string)?.trim() || "";

    const category =
      (formData.get("category") as string)?.trim() || "";

    const author =
      (formData.get("author") as string)?.trim() ||
      "Ocean Trade";

    const tags =
      (formData.get("tags") as string)?.trim() || "";

    const priceValue =
      (formData.get("price") as string) || "0";

    const price = Number.parseFloat(priceValue);

    const isFree =
      formData.get("isFree") === "true";

    const isPremium =
      formData.get("isPremium") === "true";

    const imageFile =
      formData.get("image") as File | null;

    const modelFile =
      formData.get("modelFile") as File | null;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          error:
            "Title, description, and category are required",
        },
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        {
          error: "Product image is required",
        },
        { status: 400 }
      );
    }

    if (!modelFile || modelFile.size === 0) {
      return NextResponse.json(
        {
          error: "3D model file is required",
        },
        { status: 400 }
      );
    }

    if (!isFree && Number.isNaN(price)) {
      return NextResponse.json(
        {
          error: "Invalid price",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Create unique slug
    // -----------------------------

    let slug = slugify(title);

    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const existing =
      await prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // -----------------------------
    // Upload files to Vercel Blob
    // -----------------------------

    console.log("Uploading product image...");

    const image = await saveUploadedFile(
      imageFile,
      "img"
    );

    console.log("Image uploaded:", image.url);

    console.log("Uploading 3D model...");

    const model = await saveUploadedFile(
      modelFile,
      "model"
    );

    console.log("3D model uploaded:", model.url);

    // -----------------------------
    // Image hash
    // -----------------------------

    const imageHash =
      await computeImageHashFromFile(imageFile);

    // -----------------------------
    // Save product in database
    // -----------------------------

    const product =
      await prisma.product.create({
        data: {
          title,
          slug,
          description,
          category,
          author,
          tags,

          price: isFree
            ? 0
            : Number.isFinite(price)
              ? price
              : 0,

          isFree,
          isPremium,

          imageUrl: image.url,

          fileUrl: model.url,

          fileName: model.fileName,

          imageHash,
        },
      });

    console.log(
      "Product created successfully:",
      product.id
    );

    return NextResponse.json(
      {
        product: serializeProduct(product),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Upload error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to create product",
        details: message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          error: "Product ID required",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}