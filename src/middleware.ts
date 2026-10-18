import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n/config";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return i18n.defaultLocale;

  if (acceptLanguage.includes("fa") || acceptLanguage.includes("ir")) {
    return "fa";
  }
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname=request.headers.get('host')?.split(':')[0];

  // Skip asset paths and system files
  if (
    [
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/manifest.webmanifest",
      "/sw.js",
      "/pwa-manifest.webmanifest",
      "/pwa-sw.js",
    ].includes(pathname) ||
    pathname.startsWith("/images/") || pathname.startsWith("/fonts/") || pathname.startsWith("/icons/")
  ) {
    return;
  }

  if(hostname==='pwa.krism-society.com'){
    if(pathname==='/'||pathname==='/en')return NextResponse.rewrite(new URL('/en/sleep-hygiene/app',request.url));
    if(pathname==='/fa')return NextResponse.rewrite(new URL('/fa/sleep-hygiene/app',request.url));
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|fonts).*)"],
};
