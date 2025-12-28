import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiveIntelligence",
  description: "Dive planning calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, fontFamily: 'Roboto, "Helvetica Neue", sans-serif', minHeight: '100vh' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
