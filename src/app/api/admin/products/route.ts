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
    console.error("GET /api/admin/products ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load products",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
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
    console.log("========== CREATE PRODUCT START ==========");

    const formData = await request.formData();

    const title = String(
      formData.get("title") ?? ""
    ).trim();

    const description = String(
      formData.get("description") ?? ""
    ).trim();

    const category = String(
      formData.get("category") ?? ""
    ).trim();

    const author =
      String(formData.get("author") ?? "").trim() ||
      "Ocean Trade";

    const tags = String(
      formData.get("tags") ?? ""
    ).trim();

    const priceRaw = String(
      formData.get("price") ?? "0"
    ).trim();

    const price = Number(priceRaw);

    const isFree =
      String(formData.get("isFree")) === "true";

    const isPremium =
      String(formData.get("isPremium")) === "true";

    const imageValue = formData.get("image");
    const modelValue = formData.get("modelFile");

    const imageFile =
      imageValue instanceof File
        ? imageValue
        : null;

    const modelFile =
      modelValue instanceof File
        ? modelValue
        : null;

    console.log("Product data:", {
      title,
      category,
      author,
      tags,
      price,
      isFree,
      isPremium,
      imageName: imageFile?.name,
      imageSize: imageFile?.size,
      modelName: modelFile?.name,
      modelSize: modelFile?.size,
    });

    // --------------------------------
    // VALIDATION
    // --------------------------------

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Product image is required" },
        { status: 400 }
      );
    }

    if (!modelFile || modelFile.size === 0) {
      return NextResponse.json(
        { error: "3D model file is required" },
        { status: 400 }
      );
    }

    if (!isFree && (!Number.isFinite(price) || price < 0)) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    // --------------------------------
    // SLUG
    // --------------------------------

    let slug = slugify(title);

    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    console.log("Slug:", slug);

    // --------------------------------
    // IMAGE UPLOAD
    // --------------------------------

    let image;

    try {
      console.log("Uploading image...");

      image = await saveUploadedFile(
        imageFile,
        "img"
      );

      console.log(
        "IMAGE UPLOAD SUCCESS:",
        image.url
      );
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: "Failed to upload product image",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // MODEL UPLOAD
    // --------------------------------

    let model;

    try {
      console.log("Uploading 3D model...");

      model = await saveUploadedFile(
        modelFile,
        "model"
      );

      console.log(
        "MODEL UPLOAD SUCCESS:",
        model.url
      );
    } catch (error) {
      console.error(
        "MODEL UPLOAD ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: "Failed to upload 3D model",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // IMAGE HASH
    // --------------------------------

    let imageHash = "";

    try {
      console.log("Creating image hash...");

      imageHash =
        await computeImageHashFromFile(
          imageFile
        );

      console.log(
        "IMAGE HASH SUCCESS:",
        imageHash
      );
    } catch (error) {
      console.error(
        "IMAGE HASH ERROR:",
        error
      );

      // Hash should not stop product creation.
      imageHash = "";
    }

    // --------------------------------
    // DATABASE
    // --------------------------------

    try {
      console.log(
        "Creating product in database..."
      );

      const product =
        await prisma.product.create({
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

      console.log(
        "DATABASE CREATE SUCCESS:",
        product.id
      );

      console.log(
        "========== CREATE PRODUCT END =========="
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
        "DATABASE CREATE ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: "Database failed to create product",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      "CREATE PRODUCT UNKNOWN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create product",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
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
    const body = await request.json();

    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        {
          error: "Product ID required",
        },
        { status: 400 }
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
      "DELETE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete product",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}