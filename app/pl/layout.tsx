import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ringdove Studio — Agencja kreatywna",
  description: "Nowoczesna agencja z odważną wizją i dopracowaną animacją."
};

export default function PolishLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
