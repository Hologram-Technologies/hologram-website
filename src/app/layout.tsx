import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { MathJaxProvider } from "@/components/mathjax-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"], // Removed 300 for smaller bundle
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Hologram - Geometric computation",
  description:
    "A shared language for universal data. Building open source, community-led infrastructure.",
  // Performance optimizations
  other: {
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance: Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://embed.typeform.com" />
        <link rel="dns-prefetch" href="https://gethologram.ai" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen gradient-background`}
      >
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <Navigation />
            <main className="relative z-10 min-h-screen bg-transparent" style={{ contentVisibility: 'auto' }}>{children}</main>
            <Footer />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
