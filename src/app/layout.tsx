import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codeshot — AI Code Generator",
  description: "Generate React, Vue, and HTML/CSS/JS code with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
