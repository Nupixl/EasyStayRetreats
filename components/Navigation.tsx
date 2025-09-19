'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const locations = [
    { name: 'New Mexico', count: 'Properties' },
    { name: 'New York', count: '6 Properties' },
    { name: 'Virginia', count: 'Properties' },
    { name: 'Massachusetts', count: 'Properties' },
    { name: 'Florida', count: '6 Properties' }
  ]

  return (
    <nav className="bg-white border-b border-outline sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-black hover:bg-grey-background focus:outline-none focus:ring-2 focus:ring-dodger-blue"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-black">
              EASY STAY RETREATS
            </Link>
          </div>

          {/* Main Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('travel')}
                onMouseLeave={() => setActiveDropdown(null)}
                className="text-black hover:text-dodger-blue font-medium text-sm transition-colors"
              >
                Travel
              </button>
              {activeDropdown === 'travel' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg py-2">
                  {locations.map((location, index) => (
                    <Link
                      key={index}
                      href={`/search-properties?location=${location.name}`}
                      className="block px-4 py-2 text-sm text-black hover:bg-grey-background"
                    >
                      {location.name} {location.count}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/our-stays" className="text-black hover:text-dodger-blue font-medium text-sm transition-colors">
              Our Stays
            </Link>

            <Link href="/search-properties" className="text-black hover:text-dodger-blue font-medium text-sm transition-colors">
              Search Stays
            </Link>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-6">
            {/* Accounts Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('accounts')}
                onMouseLeave={() => setActiveDropdown(null)}
                className="text-black hover:text-dodger-blue font-medium text-sm transition-colors"
              >
                Accounts
              </button>
              {activeDropdown === 'accounts' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg py-2">
                  <Link href="/login" className="block px-4 py-2 text-sm text-black hover:bg-grey-background">
                    Log-in/Sign-Up
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 text-sm text-black hover:bg-grey-background">
                    Contact us
                  </Link>
                  <Link href="/host" className="block px-4 py-2 text-sm text-black hover:bg-grey-background">
                    Host Your Property
                  </Link>
                  <Link href="/affiliate" className="block px-4 py-2 text-sm text-black hover:bg-grey-background">
                    Become a Affiliate
                  </Link>
                  <Link href="/email" className="block px-4 py-2 text-sm text-black hover:bg-grey-background">
                    Email Us
                  </Link>
                  <Link href="/call" className="block px-4 py-2 text-sm text-black hover:bg-grey-background">
                    Call Us
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="text-black hover:text-dodger-blue font-medium text-sm transition-colors"
            >
              Log-in
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-outline bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/travel" className="block px-3 py-2 text-sm text-black hover:bg-grey-background">
                Travel
              </Link>
              <Link href="/our-stays" className="block px-3 py-2 text-sm text-black hover:bg-grey-background">
                Our Stays
              </Link>
              <Link href="/search-properties" className="block px-3 py-2 text-sm text-black hover:bg-grey-background">
                Search Stays
              </Link>
              <div className="border-t border-outline my-2"></div>
              {locations.map((location, index) => (
                <Link
                  key={index}
                  href={`/search-properties?location=${location.name}`}
                  className="block px-3 py-2 text-sm text-black hover:bg-grey-background"
                >
                  {location.name} {location.count}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
