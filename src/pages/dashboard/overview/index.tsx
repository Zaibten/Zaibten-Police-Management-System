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
import {
  MyBarChart,
  MyLineChart,
  MyPieChart,
  MyRadarChart,
  MyAreaBumpChart,
  MyHeatMapChart,
  // MyStreamChart,
  MyFunnelChart,
  MyScatterPlot,
  MySankeyChart,
  MyTreeMapChart,
  MyWaffleChart,
  MyChordChart,
  MyCalendarHeatmap,
  MyCirclePackingChart,
} from './Charts' // Adjust path if needed

export default function DashboardPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const defaultCenter = { lat: 24.8607, lng: 67.0011 }
  const defaultZoom = 13
  const targetZoom = 19
  const [searchTerm, setSearchTerm] = useState('')

  const [policeLocations, setPoliceLocations] = useState<any[]>([])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('https://zaibtenpoliceserver.vercel.app/api/duties')
        const data = await res.json()
        setPoliceLocations(
          data.map((item: any) => ({
            ...item,
            lat: item.xCoord,
            lng: item.yCoord,
          }))
        )
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchLocations()
  }, [])

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
    const prevIndex =
      (currentIndex - 1 + policeLocations.length) % policeLocations.length
    setCurrentIndex(prevIndex)
    goToLocation(prevIndex)
  }

  useEffect(() => {
    if (!mapInstanceRef.current || policeLocations.length === 0) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
    infoWindowsRef.current = []

    policeLocations.forEach((officer, index) => {
      const position = { lat: officer.lat, lng: officer.lng }

      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current!,
        animation: google.maps.Animation.DROP,
        title: officer.name,
        icon: {
          url: '/clipart843843.png',
          scaledSize: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(15, 15),
        },
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
      <div>
        <strong>${officer.name}</strong><br/>
        <b>Status:</b> ${officer.status}<br/>
        <b>Rank:</b> ${officer.rank || 'N/A'}<br/>
        <b>Badge #:</b> ${officer.badgeNumber || 'N/A'}<br/>
        <b>Duty:</b> ${officer.dutyCategory || 'N/A'}<br/>
        <b>Contact:</b> ${officer.contact || 'N/A'}
      </div>
    `,
      })

      marker.addListener('click', () => {
        infoWindowsRef.current.forEach((iw) => iw.close())
        infoWindow.open(mapInstanceRef.current!, marker)
        smoothPanAndZoom(mapInstanceRef.current!, position, targetZoom)
        setCurrentIndex(index)
      })

      markersRef.current.push(marker)
      infoWindowsRef.current.push(infoWindow)

      // 🔻 Move your custom overlay INSIDE the loop
      const markerDiv = document.createElement('div')
      markerDiv.className = 'pulse-marker'
      markerDiv.innerText = officer.name

      const overlay = new google.maps.OverlayView()
      overlay.onAdd = function () {
        const panes = this.getPanes()
        panes?.overlayMouseTarget.appendChild(markerDiv)
      }
      overlay.draw = function () {
        const projection = this.getProjection()
        if (!projection) return
        const pos = new google.maps.LatLng(officer.lat, officer.lng)
        const point = projection.fromLatLngToDivPixel(pos)
        if (point && markerDiv.style) {
          markerDiv.style.left = point.x + 'px'
          markerDiv.style.top = point.y + 'px'
        }
      }
      overlay.onRemove = function () {
        markerDiv.parentNode?.removeChild(markerDiv)
      }
      overlay.setMap(mapInstanceRef.current)
    })
  }, [policeLocations])

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
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          resetControlDiv
        )

        setMapLoaded(true)
      }
    })
  }, [mapLoaded])

  return (
    <Layout>
      <Layout.Body>
<div
  style={{
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    backgroundColor: '#f0f8ff',
    borderRadius: '5px',
    padding: '5px 10px',
    marginBottom: '10px',
  }}
>
  <div
    style={{
      display: 'inline-block',
      animation: 'scroll-left 15s linear infinite',
      fontWeight: 600,
      fontSize: '14px',
      color: '#0b5394',
    }}
  >
    Police Management System: Ensuring law and order, serving with honor, and protecting the community.
  </div>

  <style>
    {`
      @keyframes scroll-left {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `}
  </style>
</div>

        <div className='mb-4 flex items-center justify-between'>
  <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
  <div className='flex items-center gap-3'>
    <span className='text-sm font-semibold text-muted-foreground'>Welcome Admin</span>
    <img
      src='logo.png' // 🔄 Replace with your actual icon path
      alt='Admin Icon'
      className='h-10 w-10 rounded-full border border-gray-300 shadow'
    />
  </div>
</div>

        <Tabs defaultValue='overview'>
          <TabsList>
            <TabsTrigger value='overview'>Show Full Dashbaord</TabsTrigger>
            {/* <TabsTrigger value='analytics'>
              Show Duties Monthly Update
            </TabsTrigger> */}
            <TabsTrigger value='active'>Show Patroling Map</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            {/* Keyframe animations inside style tag for self-contained */}
            <style>
              {`
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}
            </style>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 24,
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              {/* Helper function to generate each chart block with heading */}
              {[
                {
                  id: 'bar',
                  title: 'PoliceStations per district',
                  component: <MyBarChart />,
                },
                {
                  id: 'line',
                  title: 'Duties count per month',
                  component: <MyLineChart />,
                },
                {
                  id: 'chord',
                  title: 'Weapons usage count among constables',
                  component: <MyChordChart />,
                },
                {
                  id: 'calendar',
                  title: 'Duties per day for last 30 days',
                  component: <MyCalendarHeatmap />,
                },
                {
                  id: 'circlePacking',
                  title: 'Count constables per police station',
                  component: <MyCirclePackingChart />,
                },
                {
                  id: 'pie',
                  title: 'Constables by gender',
                  component: <MyPieChart />,
                },
                {
                  id: 'radar',
                  title: 'Number of constables per rank',
                  component: <MyRadarChart />,
                },
                {
                  id: 'areaBump',
                  title: 'Duties count per duty Category',
                  component: <MyAreaBumpChart />,
                },
                {
                  id: 'heatMap',
                  title: 'duty Category per month',
                  component: <MyHeatMapChart />,
                },
                // { id: 'stream', title: 'Stream Chart', component: <MyStreamChart /> }, // commented out as in original
                {
                  id: 'funnel',
                  title: 'Number of stations by jail Capacity',
                  component: <MyFunnelChart />,
                },
                {
                  id: 'scatter',
                  title: 'Number of constables joining per month',
                  component: <MyScatterPlot />,
                },
                {
                  id: 'sankey',
                  title: 'duties between stations and categories',
                  component: <MySankeyChart />,
                },
                {
                  id: 'waffle',
                  title: 'constable count grouped by rank',
                  component: <MyWaffleChart />,
                },
                {
                  id: 'treeMap',
                  title: 'gender distribution of constables',
                  component: <MyTreeMapChart />,
                },
              ].map(({ id, title, component }) => (
                <div
                  key={id}
                  style={{
                    flex: '1 1 45%',
                    minWidth: 400,
                    height: 500,
                    animation: 'fadeIn 0.8s ease forwards',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    borderRadius: 12,
                    background: '#fff',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <h3
                    style={{
                      textAlign: 'center',
                      marginBottom: 16,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: '1.4rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background:
                        'linear-gradient(270deg, #6a11cb, #2575fc, #6a11cb, #f7971e, #f9d423)',
                      backgroundSize: '500% 500%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradientShift 5s ease infinite',
                      userSelect: 'none',
                    }}
                  >
                    {title}
                  </h3>

                  <div style={{ width: '100%', height: 350 }}>{component}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          {/* 
          <TabsContent value='analytics'>This is Analytics</TabsContent> */}
        </Tabs>

        <Tabs
          orientation='vertical'
          defaultValue='analytics'
          className='space-y-4'
        >
          <TabsContent value='analytics' className='space-y-4'>
            <div className='mb-4'>
              <input
                ref={searchInputRef} // <-- add this
                type='text'
                placeholder='Search Officer by Name...'
                value={searchTerm}
                onChange={(e) => {
                  const term = e.target.value
                  setSearchTerm(term)

                  if (term.trim() === '') {
                    // Reset map view if search box is empty
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.panTo(defaultCenter)
                      mapInstanceRef.current.setZoom(defaultZoom)
                      // Optionally, close all info windows too
                      infoWindowsRef.current.forEach((iw) => iw.close())
                    }
                    setCurrentIndex(0) // Optionally reset current index as well
                    return
                  }

                  const index = policeLocations.findIndex((officer) =>
                    officer.name.toLowerCase().includes(term.toLowerCase())
                  )

                  if (index !== -1) {
                    setCurrentIndex(index)
                    goToLocation(index)
                    // Refocus input after map moves
                    setTimeout(() => {
                      searchInputRef.current?.focus()
                    }, 100)
                  }
                }}
                className='w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200'
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Live Police Patrol Locations</CardTitle>
                <CardDescription>
                  Animated markers always visible with reset map control. Click
                  on markers or use navigation buttons to zoom and view status.
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
                <div className='flex justify-center gap-6'>
                  <button
                    onClick={handlePrev}
                    className='
      relative
      inline-flex
      cursor-pointer
      select-none
      items-center
      gap-2 rounded-md bg-gradient-to-r from-indigo-600
      via-blue-600 to-cyan-600
      px-6
      py-3
      font-semibold
      text-white shadow-lg
      ring-1
      ring-indigo-700/30
      transition
      duration-300
      ease-in-out
      hover:scale-105
      hover:shadow-xl
      hover:ring-indigo-700/60
      focus:outline-none
      focus-visible:ring-4
      focus-visible:ring-indigo-400
    '
                    aria-label='Previous Location'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                    Previous
                  </button>

                  <button
                    onClick={handleNext}
                    className='
      relative
      inline-flex
      cursor-pointer
      select-none
      items-center
      gap-2 rounded-md bg-gradient-to-r from-indigo-600
      via-blue-600 to-cyan-600
      px-6
      py-3
      font-semibold
      text-white shadow-lg
      ring-1
      ring-indigo-700/30
      transition
      duration-300
      ease-in-out
      hover:scale-105
      hover:shadow-xl
      hover:ring-indigo-700/60
      focus:outline-none
      focus-visible:ring-4
      focus-visible:ring-indigo-400
    '
                    aria-label='Next Location'
                  >
                    Next
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 5l7 7-7 7'
                      />
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
