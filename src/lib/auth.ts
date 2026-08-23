import { prisma } from "./db";
import { NextRequest, NextResponse } from "next/server";

const USER_COOKIE = "ocean_user_session";

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function getCurrentUser(request: NextRequest) {
  try {
    const cookie = request.cookies.get(USER_COOKIE);
    const userId = cookie?.value;

    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user || null;
  } catch (err) {
    return null;
  }
}

export function setUserSession(
  response: NextResponse,
  userId: string
) {
  response.cookies.set({
    name: USER_COOKIE,
    value: userId,
    ...COOKIE_OPTIONS,
  });
}

export function clearUserSession(response: NextResponse) {
  response.cookies.set({
    name: USER_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
}