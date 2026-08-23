import sharp from "sharp";
import path from "path";
import { readFile } from "fs/promises";

export async function computeImageHash(input: Buffer | string): Promise<string> {
  let buffer: Buffer;
  if (typeof input === "string") {
    const filePath = input.startsWith("/")
      ? path.join(process.cwd(), "public", input)
      : input;
    buffer = await readFile(filePath);
  } else {
    buffer = input;
  }

  const { data } = await sharp(buffer)
    .resize(8, 8, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  const avg = sum / data.length;

  let hash = "";
  for (let i = 0; i < data.length; i++) {
    hash += data[i] >= avg ? "1" : "0";
  }
  return hash;
}

export function hammingDistance(a: string, b: string): number {
  if (!a || !b || a.length !== b.length) return 64;
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) distance++;
  }
  return distance;
}

export async function computeImageHashFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return computeImageHash(buffer);
}
