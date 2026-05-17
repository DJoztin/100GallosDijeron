import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "100 Mexicanos Dijeron",
  description: "Family Feud — Edición Mexicana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#060b18] antialiased">{children}</body>
    </html>
  );
}
