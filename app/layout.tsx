import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Russo_One } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "@/components/AuthProvider"
import { Sidebar } from "@/components/Sidebar"
import { LayoutWrapper } from "@/components/LayoutWrapper"
import WhatsNewModal from "@/components/WhatsNewModal"

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
        <AuthProvider>
          <Sidebar />
          <LayoutWrapper>{children}</LayoutWrapper>
          <WhatsNewModal />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
