import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === process.env.DASHBOARD_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "dashboard-auth",
      value: "true",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });
    console.log("Cookie set:", res.cookies.get("dashboard-auth"));
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
