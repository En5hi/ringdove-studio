import type { Metadata } from "next";
import { cookies } from "next/headers";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { UnicornSdk } from "../components/unicorn/UnicornSdk";

const body = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Ringdove Studio - Design-forward agency",
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
      <body className={`${body.variable} bg-background text-white`}>
        <UnicornSdk />
        {children}
      </body>
    </html>
  );
}
