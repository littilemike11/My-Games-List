import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DrawerLayout from "./components/DrawerLayout";
import { AuthProvider } from "./auth/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Save Room",
  description: "A community hub for gamers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`} // ensures footer stays at the bottom of the page weven when the cntent is short
      >
        <AuthProvider>
          <Navbar />
          <DrawerLayout>
            <div className="mx-auto max-w-6xl overflow-x-hidden">
              {children}
            </div>
            <Footer />
          </DrawerLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
