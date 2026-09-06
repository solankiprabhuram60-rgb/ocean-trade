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
            "model/gltf-binary",
            "model/gltf+json",
            "application/zip",
            "application/octet-stream",
          ],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        console.log("Blob upload completed");
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload error:", error);

    return NextResponse.json(
      { error: "Blob upload failed" },
      { status: 500 }
    );
  }
}