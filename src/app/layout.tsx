"use client";

import "@/app/globals.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import AppWalletProvider from "../context/AppWalletProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          <header className="p-4 bg-gray-800 text-white">
            <nav className="flex justify-end items-center space-x-4">
              <div className="ml-4">
                <WalletMultiButton style={{}} />
              </div>
            </nav>
          </header>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
