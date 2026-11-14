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
  title: "AffinityAIIMS | Annual Inter-Collegiate Cultural Fest - AIIMS Raebareli",
  description:
    "Official portal for AffinityAIIMS 2026: The premier inter-collegiate cultural fest organized by SWAR & Student Body at AIIMS Raebareli, celebrating arts, music, dance, dramatics, literature, and sports championships.",
  keywords: [
    "AffinityAIIMS",
    "AIIMS Raebareli",
    "SWAR",
    "College Fest",
    "Cultural Clubs",
    "Inter-Collegiate Fest",
    "Dance Club",
    "Dramatics Club",
    "Music Society",
    "Sports Arena",
  ],
  authors: [{ name: "SWAR - AIIMS Raebareli Student Council" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden max-w-full" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-fest-sunset selection:text-white overflow-x-hidden max-w-full">
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="affinity-aiims-theme">
            <CustomCursor />
            <Navbar />
            <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
