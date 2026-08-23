import { cookies } from "next/headers";
import type { Product } from "@/lib/db";

const ADMIN_COOKIE = "ocean_admin_session";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTags(tags: string): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function serializeProduct(product: Product) {
  return {
    ...product,
    tags: parseTags(product.tags),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  return session?.value === getAdminToken();
}

export function getAdminToken(): string {
  const password = process.env.ADMIN_PASSWORD || "admin123";
  return Buffer.from(`ocean-admin:${password}`).toString("base64");
}

export { ADMIN_COOKIE };
