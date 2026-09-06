import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
            "model/stl",
            "model/obj",
            "model/gltf-binary",
            "model/gltf+json",
            "application/zip",
            "application/octet-stream",
          ],

          maximumSizeInBytes: 100 * 1024 * 1024,
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("Blob upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Blob upload failed",
      },
      {
        status: 500,
      }
    );
  }
}