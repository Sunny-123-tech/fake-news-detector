import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FakeShield - Fake News Detector",
  description: "AI-powered fake news detection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}