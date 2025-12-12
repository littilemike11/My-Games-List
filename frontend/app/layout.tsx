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
    <html lang="en" data-theme="night">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <AuthProvider>
          <Navbar />

          {/* Make the layout stretch */}
          <DrawerLayout>
            {/* Make content expand to fill space */}
            <div className="flex flex-col items-stretch flex-1 h-full ">
              <div className="mx-auto w-full sm:max-w-5/6 overflow-x-hidden  flex flex-col flex-1 ">
                {children}
              </div>
              <Footer />
            </div>
          </DrawerLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
/*
dark
bumblebee
emerald
corporate*

fantasy

dracula
acid

night

winter
dim

caramellatte

silk
*/
