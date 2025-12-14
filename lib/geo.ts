import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { defaultLocale, locales, Locale } from "./i18n";

export const localeCookie = "locale";
const localeMaxAge = 60 * 60 * 24 * 180; // ~6 months

const isLocale = (value: string | undefined): value is Locale =>
  locales.includes(value as Locale);

export const getPreferredLocale = (req: NextRequest): Locale => {
  const cookieLocale = req.cookies.get(localeCookie)?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const geo = geolocation(req);
  if (geo?.country === "PL") {
    return "pl";
  }

  const acceptLanguage = req.headers.get("accept-language");
  if (acceptLanguage?.toLowerCase().includes("pl")) {
    return "pl";
  }

  return defaultLocale;
};

export const applyLocaleCookie = (res: NextResponse, locale: Locale) => {
  res.cookies.set(localeCookie, locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: localeMaxAge
  });
};
