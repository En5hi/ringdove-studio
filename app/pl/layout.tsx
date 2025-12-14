import type { Metadata } from "next";
import RootLayout from "../layout";

export const metadata: Metadata = {
  title: "Ringdove Studio — Agencja kreatywna",
  description: "Nowoczesna agencja z odważną wizją i dopracowaną animacją."
};

export default function PolishLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
