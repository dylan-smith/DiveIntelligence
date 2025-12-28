import type { Metadata } from "next";
import { MUIProvider } from "@/components/MUIProvider";
import { DivePlannerProvider } from "@/lib/dive-planner-context";

export const metadata: Metadata = {
  title: "DiveIntelligence",
  description: "Dive planning and decompression calculator",
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
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body>
        <MUIProvider>
          <DivePlannerProvider>
            {children}
          </DivePlannerProvider>
        </MUIProvider>
      </body>
    </html>
  );
}
