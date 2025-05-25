'use client'

import dynamic from 'next/dynamic'

// Create a client-side only Map component
const Map = dynamic(
  () => import('./map-component'),
  { ssr: false }
)

export default function MapPage() {
  return <Map />
}
