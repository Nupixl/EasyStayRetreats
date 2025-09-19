import type { Metadata } from 'next'
import { Navigation } from '@/devlink/Navigation'
import { Footer } from '@/devlink/Footer'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Easy Stay Property Management | Stress-Free Hosting & More Bookings',
  description: 'Turn your home into a vacation rental with Easy Stay. We handle guest communication, 24/7 support, cleaning, and finances—so you earn more and stress less.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en">
          <head>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <link rel="stylesheet" href="/css/normalize.css" />
            <link rel="stylesheet" href="/css/components.css" />
            <link rel="stylesheet" href="/css/easystayretreasts.css" />
            <link rel="stylesheet" href="/css/fixes.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension attributes that cause hydration issues
              (function() {
                if (typeof window !== 'undefined') {
                  const removeExtensionAttributes = () => {
                    const body = document.body;
                    if (body) {
                      // Remove Grammarly and other extension attributes
                      const attributesToRemove = [
                        'data-new-gr-c-s-check-loaded',
                        'data-gr-ext-installed',
                        'data-grammarly-shadow-root',
                        'data-grammarly-ignore'
                      ];
                      attributesToRemove.forEach(attr => {
                        if (body.hasAttribute(attr)) {
                          body.removeAttribute(attr);
                        }
                      });
                    }
                  };
                  
                  // Run immediately and after DOM is ready
                  removeExtensionAttributes();
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}
