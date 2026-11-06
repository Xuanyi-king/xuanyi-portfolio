import type { Metadata, Viewport } from "next";
import { Navigation } from "@/components/nav";
import { Footer } from "@/components/footer";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/data/site";
import "./globals.css";
import "./motion.css";
import "./identity.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "XUANYI 玄屹 — 好奇的形状", template: "%s · XUANYI" },
  description: site.description,
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: {
    title: "XUANYI — Curiosity Takes Shape.",
    description: site.description,
    locale: "zh_CN",
    type: "website",
    siteName: "XUANYI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "XUANYI 玄屹 · 好奇的形状",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#fafaf6",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('xuanyi-2-1-seen'))document.documentElement.setAttribute('data-xuanyi-returning','true');if(location.pathname==='/')sessionStorage.setItem('xuanyi-2-1-seen','true')}catch{}`,
          }}
        />
        <link
          rel="preload"
          href="/fonts/xuanyi-editorial-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/manrope-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body id="top">
        <a href="#main-content" className="skip-link">
          跳转到主要内容
        </a>
        <Navigation />
        <noscript>
          <nav className="no-js-nav" aria-label="主导航（无 JavaScript）">
            <a href="/work/">Work</a>
            <a href="/notes/">Notes</a>
            <a href="/about/">About</a>
          </nav>
        </noscript>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MotionProvider />
      </body>
    </html>
  );
}
