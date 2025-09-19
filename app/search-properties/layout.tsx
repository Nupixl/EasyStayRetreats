import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Property Search | Find Your Perfect Stay | Easy Stay',
  description: 'Search and discover amazing vacation rentals with our interactive map. Find the perfect Easy Stay property for your next trip with detailed filters and real-time availability.',
}

export default function SearchPropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
