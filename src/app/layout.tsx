import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Rangmanch '26 | Annual Inter-Collegiate Cultural Fest",
  description:
    "Official portal for Rangmanch 2026: The premier college cultural fest organized by University Cultural Clubs celebrating Indian arts, music, dance, dramatics, and sports championships.",
  keywords: [
    "College Fest",
    "Cultural Clubs",
    "University Festival",
    "Rangmanch 2026",
    "Dance Club",
    "Dramatics Club",
    "Music Society",
    "Football Tournament",
    "Inter-Collegiate Fest",
  ],
  authors: [{ name: "University Cultural Council & Student Body" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-fest-sunset selection:text-white">
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="rangmanch-fest-theme">
            <CustomCursor />
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
