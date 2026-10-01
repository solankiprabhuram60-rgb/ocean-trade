import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";
import { NextResponse } from "next/server";

const ALLOWED_CONTENT_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",

  // 3D
  "model/stl",
  "model/obj",
  "model/gltf-binary",
  "model/gltf+json",

  // 3D files that browsers may report as octet-stream
  "application/octet-stream",

  // ZIP / Blender
  "application/zip",
  "application/x-zip-compressed",
  "application/x-blender",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload,
        multipart
      ) => {
        console.log("Generating Blob upload token:", {
          pathname,
          clientPayload,
          multipart,
        });

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,

          maximumSizeInBytes: MAX_FILE_SIZE,

          // Important for product uploads
          addRandomSuffix: true,

          // Vercel automatically determines callback URL
          // in Preview and Production.
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Blob upload completed:", {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
          tokenPayload,
        });
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
        status: 400,
      }
    );
  }
}