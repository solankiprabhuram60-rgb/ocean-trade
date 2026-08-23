import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

export async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function saveUploadedFile(file: File, prefix: string): Promise<{ url: string; fileName: string }> {
  await ensureUploadDir();

  const ext = path.extname(file.name) || "";
  const safeName = `${prefix}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/products/${safeName}`,
    fileName: file.name,
  };
}

export function getUploadDir() {
  return UPLOAD_DIR;
}
