import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Russo_One } from "next/font/google"
import "./globals.css"
import { PageTransition } from "@/components/shared/PageTransition"
import { Analytics } from "@vercel/analytics/react"

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo-one",
})

export const metadata: Metadata = {
  title: "AMS2 Iconic Races",
  description: "Curated gallery of historical racing moments with exact AMS2 setup configurations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${russoOne.variable}`}>
      <body className="aurora-bg min-h-screen">
        <div className="noise-texture fixed inset-0 -z-5" />
        <PageTransition>{children}</PageTransition>
        <Analytics />
      </body>
    </html>
  )
}
