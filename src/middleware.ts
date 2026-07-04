import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";

const PUBLIC_API_PREFIXES = ["/api/auth/login", "/api/auth/logout"];

const PUBLIC_POST_PREFIXES = ["/api/contacts", "/api/launches/inquiry"];

const PUBLIC_GET_PREFIXES = ["/api/properties", "/api/projects", "/api/launches"];

function isPublicApi(pathname: string, method: string) {
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (method === "POST" && PUBLIC_POST_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (method === "GET" && PUBLIC_GET_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // CRM pages
  if (pathname.startsWith("/crm")) {
    if (pathname.startsWith("/crm/login")) {
      if (session) return NextResponse.redirect(new URL("/crm", request.url));
      return NextResponse.next();
    }

    if (pathname.startsWith("/crm/messages")) {
      return NextResponse.redirect(new URL("/crm", request.url));
    }

    if (!session) {
      const loginUrl = new URL("/crm/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Protected API routes
  if (pathname.startsWith("/api/") && !isPublicApi(pathname, request.method)) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm/:path*", "/api/:path*"],
};
