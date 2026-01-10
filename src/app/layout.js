'use client';

import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";
import { useState } from "react";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <Providers>
          <div className="layout-container">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="main-content">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
