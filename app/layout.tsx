import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Ringdove Studio — Design-forward agency",
  description: "Modern agency site with experimental visuals and crafted motion."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";

  return (
    <html lang={locale === "pl" ? "pl" : "en"} className="dark">
      <body
        className={`${display.variable} ${body.variable} bg-background text-white`}
      >
        {children}
      </body>
    </html>
  );
}
