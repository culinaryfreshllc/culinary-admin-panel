import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import { StoreProvider } from "../context/StoreContext";

export const metadata: Metadata = {
  title: "Culinary Fresh Admin",
  description: "Admin panel for Culinary Fresh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <StoreProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}


