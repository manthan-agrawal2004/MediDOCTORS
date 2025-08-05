import {  Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const inter=Inter({subsets:['latin']});

export const metadata = {
  title: "MediDOCTORS - Appointment App",
  description: "Connect with top doctors and book appointments hassle-free",
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header/>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
        <footer className="bg-muted/50 py-12">
            <div className="container mx-auto  px-4 text-gray-200 text-center">
              <p>Made with ❤️ by Manthan</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

