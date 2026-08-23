import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminToken } from "@/lib/utils";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  const authenticated = session?.value === getAdminToken();

  return NextResponse.json({ authenticated });
}
