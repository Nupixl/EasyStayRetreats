import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { DevLinkProvider } from '@/components/DevLinkProvider'
import './globals.css'
import '@/components/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Easy Stay Retreats - Luxury Wellness Retreats',
  description: 'Discover transformative wellness retreats in stunning locations. Reconnect with yourself through our carefully curated experiences.',
  keywords: 'wellness retreats, luxury retreats, meditation, yoga, mindfulness, travel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DevLinkProvider>
          <div className="page-wrapper">
            {children}
          </div>
        </DevLinkProvider>
      </body>
    </html>
  )
}