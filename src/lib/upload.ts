import { put } from "@vercel/blob";

function getSafeExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot === -1) {
    return "";
  }

  return fileName.slice(lastDot).toLowerCase();
}

function getSafeBaseName(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");

  const baseName =
    lastDot === -1 ? fileName : fileName.slice(0, lastDot);

  return baseName
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function saveUploadedFile(
  file: File,
  prefix: string
): Promise<{
  url: string;
  fileName: string;
}> {
  if (!file || file.size === 0) {
    throw new Error("Empty file");
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const extension = getSafeExtension(file.name);
  const originalBaseName = getSafeBaseName(file.name);

  const safeName =
    `${prefix}-${originalBaseName}-${Date.now()}${extension}`;

  const blob = await put(
    `products/${safeName}`,
    file,
    {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    }
  );

  return {
    url: blob.url,
    fileName: file.name,
  };
}