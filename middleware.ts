import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { localePaths } from "./lib/i18n";
import { applyLocaleCookie, getPreferredLocale } from "./lib/geo";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const preferred = getPreferredLocale(req);
  const isPLPath = pathname.startsWith("/pl");

  if (!isPLPath && pathname !== "/" && pathname !== "") {
    const res = NextResponse.next();
    applyLocaleCookie(res, preferred);
    return res;
  }

  // Redirect root to preferred locale, but never redirect away from /pl.
  if (!isPLPath && preferred === "pl") {
    const url = req.nextUrl.clone();
    url.pathname = localePaths.pl;
    const res = NextResponse.redirect(url);
    applyLocaleCookie(res, preferred);
    return res;
  }

  const res = NextResponse.next();
  applyLocaleCookie(res, isPLPath ? "pl" : preferred);
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|assets|.*\\..*).*)"]
};
