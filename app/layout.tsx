import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Club Vivo",
  description: "Club Vivo brings Sports and Business Intelligence together, starting with TIE's practical coaching workflows."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
