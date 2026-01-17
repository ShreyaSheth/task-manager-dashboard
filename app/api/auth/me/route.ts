import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      const res = NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
      // Token can be "valid JWT" but user missing in our in-memory store (e.g. dev reload).
      // Clear cookie to avoid loops/blank dashboard.
      res.cookies.set("token", "", {
        httpOnly: true,
        secure: request.nextUrl.protocol === "https:",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return res;
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Auth verification error:", error);
    const res = NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  }
}
