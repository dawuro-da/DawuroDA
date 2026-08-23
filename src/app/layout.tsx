import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { NextAuthAndStoreProvider } from "./NextAuthAndStoreProvider";
import Script from "next/script";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DawuroDA - Dawuro Development Association",
  description: "Official platform of the Dawuro Development Association (DawuroDA)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5V6GFCQB');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={lexend.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5V6GFCQB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <NextAuthAndStoreProvider font={lexend}>
          {children}
        </NextAuthAndStoreProvider>
      </body>
    </html>
  );
}
