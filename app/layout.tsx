import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Aaron Freeman - Town Planner & Development Assessment",
  description: "Portfolio of Aaron Freeman, a Statutory Town Planner delivering practical planning advice, development assessment and environmental solutions across Queensland.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex flex-col min-h-screen">
          <Header />
            <main className="flex-grow relative">{children}</main>
          <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
