import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageReady } from "@/components/PageReady";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.description,
  description: "",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.title,
    title: site.description,
    type: "website",
    url: "/",
    locale: site.locale.replace("-", "_"),
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale}>
      <body className="is-loading">
        {/* Without JavaScript the fade-in never runs, so show the page anyway. */}
        <noscript>
          <style>{`body.is-loading{opacity:1}`}</style>
        </noscript>
        <PageReady />
        <div className="site">
          <Header />
          <main className="site-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
