import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { DevLinkProvider } from '@/components/DevLinkProvider'
import { NavbarWrapper, NavbarContainer, NavbarBrand, NavbarMenu, NavbarLink, NavbarButton } from '@/components/_Builtin/Navbar'
import './globals.css'

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
            <NavbarWrapper
              tag="nav"
              config={{
                animation: "default",
                collapse: "medium",
                docHeight: false,
                duration: 400,
                easing: "ease",
                easing2: "ease",
                noScroll: false,
              }}
              className="navbar-wrapper"
            >
              <NavbarContainer className="navbar-container">
                <NavbarBrand
                  options={{ href: "/" }}
                  className="navbar-brand"
                >
                  Easy Stay Retreats
                </NavbarBrand>
                <NavbarButton className="navbar-button">
                  <div className="w-icon-nav-menu"></div>
                </NavbarButton>
                <NavbarMenu className="navbar-menu">
                  <NavbarLink options={{ href: "/" }} className="nav-link">Home</NavbarLink>
                  <NavbarLink options={{ href: "/search-properties" }} className="nav-link">Retreats</NavbarLink>
                  <NavbarLink options={{ href: "/book" }} className="nav-link">Book</NavbarLink>
                </NavbarMenu>
              </NavbarContainer>
            </NavbarWrapper>
            <main className="main-wrapper">
              {children}
            </main>
          </div>
        </DevLinkProvider>
      </body>
    </html>
  )
}
