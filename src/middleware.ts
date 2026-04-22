import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit } from "@/lib/rate-limit";

const publicPaths = ["/", "/makerspace-projects", "/auth/signin", "/api/auth"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const runRateLimit = async (request: NextRequest) => {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
    const bucket = `${ip}:${pathname}`;

    return checkRateLimit({
      key: bucket,
      limit: pathname.startsWith("/api/") ? 120 : 40,
      windowMs: 60_000,
    });
  };

  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/signin")) {
    const result = await runRateLimit(req);
    if (result.ok) {
      return NextResponse.next();
    }

    return new NextResponse("Too many requests", {
      status: 429,
      headers: {
        "Retry-After": Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)).toString(),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
      },
    });
  }

  // Allow public paths
  if (publicPaths.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Redirect unauthenticated users to sign-in
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(signInUrl);
  }

  // Role-based route protection
  const role = token.role as string | undefined;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/mentor") && role !== "MENTOR" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
