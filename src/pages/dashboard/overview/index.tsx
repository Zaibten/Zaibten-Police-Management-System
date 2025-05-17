'use client'

import { useEffect, useRef, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader } from '@googlemaps/js-api-loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const defaultCenter = { lat: 24.8607, lng: 67.0011 }
  const defaultZoom = 13
  const targetZoom = 19
const [searchTerm, setSearchTerm] = useState('')

const policeLocations = [
  {
    lat: 24.8615,
    lng: 67.0099,
    name: 'Officer Ahmed',
    status: 'On Patrol',
    lastUpdated: 'Just now',
  },
  {
    lat: 24.8672,
    lng: 67.0221,
    name: 'Officer Ayesha',
    status: 'Responding to Incident',
    lastUpdated: '1 min ago',
  },
  {
    lat: 24.8743,
    lng: 67.0453,
    name: 'Officer Bilal',
    status: 'Stationary Checkpoint',
    lastUpdated: '3 mins ago',
  },
  {
    lat: 24.8593,
    lng: 67.0388,
    name: 'Officer Zara',
    status: 'Traffic Control',
    lastUpdated: '2 mins ago',
  },
  {
    lat: 24.8701,
    lng: 67.0259,
    name: 'Officer Usman',
    status: 'On Patrol',
    lastUpdated: 'Just now',
  },
  {
    lat: 24.8765,
    lng: 67.0185,
    name: 'Officer Fatima',
    status: 'Assisting Civilians',
    lastUpdated: '30 secs ago',
  },
  {
    lat: 24.8572,
    lng: 67.0123,
    name: 'Officer Daniyal',
    status: 'Investigating Report',
    lastUpdated: '4 mins ago',
  },
];


  const smoothPanAndZoom = (
    map: google.maps.Map,
    latLng: google.maps.LatLngLiteral,
    zoom: number
  ) => {
    map.panTo(latLng)
    let currentZoom = map.getZoom() || defaultZoom

    const zoomIn = () => {
      if (currentZoom < zoom) {
        currentZoom += 1
        map.setZoom(currentZoom)
        setTimeout(zoomIn, 100)
      }
    }

    zoomIn()
  }

  const goToLocation = (index: number) => {
    if (!mapInstanceRef.current) return
    const officer = policeLocations[index]
    const latLng = { lat: officer.lat, lng: officer.lng }

    smoothPanAndZoom(mapInstanceRef.current, latLng, targetZoom)

    // Close all open info windows first
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())

    // Open selected info window
    const marker = markersRef.current[index]
    const infoWindow = infoWindowsRef.current[index]
    infoWindow.open(mapInstanceRef.current, marker)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % policeLocations.length
    setCurrentIndex(nextIndex)
    goToLocation(nextIndex)
  }

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + policeLocations.length) % policeLocations.length
    setCurrentIndex(prevIndex)
    goToLocation(prevIndex)
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyDYNJVSQHG-_I6eC6VXqhSrcpYmXTKWtU8',
      version: 'weekly',
    })

    loader.load().then(() => {
      if (mapRef.current && !mapLoaded) {
        const map = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          gestureHandling: 'greedy',
        })

        mapInstanceRef.current = map

        policeLocations.forEach((officer, index) => {
          const position = { lat: officer.lat, lng: officer.lng }

          const marker = new google.maps.Marker({
            position,
            map,
            animation: google.maps.Animation.DROP,
            title: officer.name,
          })

          const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${officer.name}</strong><br/>Status: ${officer.status}</div>`,
          })

          marker.addListener('click', () => {
            infoWindowsRef.current.forEach((iw) => iw.close())
            infoWindow.open(map, marker)
            smoothPanAndZoom(map, position, targetZoom)
            setCurrentIndex(index)
          })

          markersRef.current.push(marker)
          infoWindowsRef.current.push(infoWindow)
        })

        const resetControlDiv = document.createElement('div')
        resetControlDiv.style.margin = '10px'

        const resetButton = document.createElement('button')
        resetButton.textContent = '📍 Reset Map'
        resetButton.style.backgroundColor = '#fff'
        resetButton.style.border = '1px solid #ccc'
        resetButton.style.padding = '8px 12px'
        resetButton.style.borderRadius = '4px'
        resetButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
        resetButton.style.cursor = 'pointer'
        resetButton.style.fontSize = '14px'

        resetButton.addEventListener('click', () => {
          map.panTo(defaultCenter)
          map.setZoom(defaultZoom)
        })

        resetControlDiv.appendChild(resetButton)
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(resetControlDiv)

        setMapLoaded(true)
      }
    })
  }, [mapLoaded])

  return (
    <Layout>
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
   <Tabs defaultValue='overview'>
  <TabsList>
    <TabsTrigger value='overview'>Show Police Patrol</TabsTrigger>
    <TabsTrigger value='analytics'>Show Police Station</TabsTrigger>
  </TabsList>
  <TabsContent value='overview'>This is the Overview</TabsContent>
  <TabsContent value='analytics'>This is Analytics</TabsContent>
</Tabs>

        <Tabs orientation='vertical' defaultValue='analytics' className='space-y-4'>
          <TabsContent value='analytics' className='space-y-4'>
            <div className="mb-4">
  <input
    type="text"
    placeholder="Search Officer by Name..."
    value={searchTerm}
    onChange={(e) => {
      const term = e.target.value
      setSearchTerm(term)

      const index = policeLocations.findIndex((officer) =>
        officer.name.toLowerCase().includes(term.toLowerCase())
      )

      if (index !== -1) {
        setCurrentIndex(index)
        goToLocation(index)
      }
    }}
    className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
  />
</div>

            <Card>
              <CardHeader>
                <CardTitle>Live Police Patrol Locations</CardTitle>
                <CardDescription>
                  Animated markers always visible with reset map control. Click on markers or use navigation buttons to zoom and view status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  ref={mapRef}
                  style={{
                    width: '100%',
                    height: '500px',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                  }}
                />
              <div className="flex justify-center gap-6">
  <button
    onClick={handlePrev}
    className="
      relative
      inline-flex
      items-center
      gap-2
      rounded-md
      bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600
      px-6 py-3
      font-semibold
      text-white
      shadow-lg
      ring-1 ring-indigo-700/30
      transition
      duration-300
      ease-in-out
      hover:scale-105
      hover:shadow-xl
      hover:ring-indigo-700/60
      focus:outline-none
      focus-visible:ring-4
      focus-visible:ring-indigo-400
      select-none
      cursor-pointer
    "
    aria-label="Previous Location"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    Previous
  </button>

  <button
    onClick={handleNext}
    className="
      relative
      inline-flex
      items-center
      gap-2
      rounded-md
      bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600
      px-6 py-3
      font-semibold
      text-white
      shadow-lg
      ring-1 ring-indigo-700/30
      transition
      duration-300
      ease-in-out
      hover:scale-105
      hover:shadow-xl
      hover:ring-indigo-700/60
      focus:outline-none
      focus-visible:ring-4
      focus-visible:ring-indigo-400
      select-none
      cursor-pointer
    "
    aria-label="Next Location"
  >
    Next
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}
