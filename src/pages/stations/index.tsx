import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api'

export default function Stations() {
  const [modalVisible, setModalVisible] = React.useState(false)

  const [stations, setStations] = useState<any[]>([])
  const [deleteStationId, setDeleteStationId] = React.useState<string | null>(
    null
  )
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const [itemsPerPage, setItemsPerPage] = React.useState(20)
  const [districtFilter, setDistrictFilter] = useState('')

  const weaponsList = [
    'Pistols',
    'Rifles',
    'Shotguns',
    'Submachine Guns',
    'Machine Guns',
    'Sniper Rifles',
    'Tasers',
    'Baton',
    'Grenades',
  ]

  const vehiclesList = [
    'Patrol Cars',
    'Motorcycles',
    'Armored Vehicles',
    'Vans',
    'Helicopters',
    'Boats',
    'Bicycles',
    'Trucks',
  ]

  interface PoliceStationType {
    weapons?: string[]
    vehicles?: string[]
    name?: string
    location?: string
    incharge?: string
    contact?: string
    jailCapacity?: number
    firsRegistered?: number
    cctvCameras?: number
    [key: string]: any
    district?: string
  }

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(
          'https://zaibtenpoliceserver.vercel.app/api/getpolice-stations'
        )
        const json = await response.json()
        if (json.success) {
          setStations(json.data)
        } else {
          console.error('Failed to load stations:', json.message)
        }
      } catch (err) {
        console.error('API fetch error:', err)
      }
    }
    fetchStations()
  }, [])

  const defaultCoords = { lat: 24.8607, lng: 67.0011 } // Karachi center coordinates
  const defaultLocationName = 'Karachi, Pakistan' // Default location name or empty string ''

  const [editStation, setEditStation] = useState<any>(null)
  // const mapRef = useRef<HTMLIFrameElement>(null);
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number
    lng: number
  } | null>(defaultCoords)
  const [mapLocation, setMapLocation] = useState(defaultLocationName)

  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Add this inside your component before pagination calculations
  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  //  const itemsPerPage = 20;
  const [markers, setMarkers] = useState<any[]>([])
  // const [searchTerm, setSearchTerm] = useState('');
  // const [map, setMap] = useState<google.maps.Map | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [, setMap] = useState<google.maps.Map | null>(null);

  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pages
  // Update pagination calculation to use filteredStations
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentStations = filteredStations.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Pagination Handlers
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }
  // Replace with your Google Maps Geocoding API Key (you can get one from Google Cloud Console)
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDYNJVSQHG-_I6eC6VXqhSrcpYmXTKWtU8'

  // On modal open, try to auto-fetch user's current location (geolocation)
  useEffect(() => {
    if (editStation && !editStation.location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords
            setCurrentCoords({ lat: latitude, lng: longitude })

            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const locationName =
              data.display_name || `${latitude}, ${longitude}`

            setEditStation((prev: any) => ({
              ...prev,
              location: locationName,
            }))

            setMapLocation(locationName)
          },
          () => {
            setMapLocation(editStation.location || '')
          }
        )
      } else {
        setMapLocation(editStation.location || '')
      }
    } else if (editStation?.location) {
      setMapLocation(editStation.location)
    }
  }, [editStation])

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  }

  const center = {
    lat: 24.8607,
    lng: 67.0011,
  }

  const libraries: any = ['places']

  // On location textbox change, update state and map location
  const handleLocationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value
    setEditStation((prev: any) => ({ ...prev, location: val }))
    setMapLocation(val)
  }
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  })

  useEffect(() => {
    if (!isLoaded) return

    const newMarkers = stations
      .filter((station) => station.latitude && station.longitude)
      .map((station) => ({
        id: station._id,
        name: station.name,
        position: {
          lat: parseFloat(station.latitude),
          lng: parseFloat(station.longitude),
        },
      }))

    setMarkers(newMarkers)
  }, [stations, isLoaded])

  // Map close info window handler
  const handleCloseInfoWindow = () => {
    setSelectedStation(null)
  }

  // Handle map click - get lat/lng from click, reverse geocode and update location textbox & map
  // const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
  const handleMapClick = async () => {
    // To get lat/lng from iframe click is not possible directly.
    // Instead, we will simulate by opening a small Google Maps in new tab to select location
    // But since direct click coordinates aren't accessible, we can add a workaround:
    // alert(
    //   'Map clicks are not supported on the embedded map due to iframe limitations. Please type the location in the textbox.'
    // );
  }

  const confirmDeleteStation = async () => {
    if (!deleteStationId) return

    try {
      const response = await fetch(
        `https://zaibtenpoliceserver.vercel.app/api/stations/${deleteStationId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete the station')
      }

      const result = await response.json()
      console.log('Deleted:', result)

      setStations((prev) =>
        prev.filter((station) => station._id !== deleteStationId)
      )
      setShowDeleteModal(false)
      setDeleteStationId(null)

      // Show success modal instead of alert
      setShowSuccessModal(true)
    } catch (error) {
      console.error('❌ Error deleting station:', error)
      alert('Failed to delete the station. Please try again.')
    }
  }

  const handleDelete = (_id: string) => {
    setDeleteStationId(_id)
    setShowDeleteModal(true)
  }

  const handleEdit = (station: any) => {
    setEditStation({ ...station })

    // Parse lat/lng as floats and update currentCoords state
    const lat = parseFloat(station.latitude)
    const lng = parseFloat(station.longitude)

    if (!isNaN(lat) && !isNaN(lng)) {
      setCurrentCoords({ lat, lng })
    } else {
      setCurrentCoords(defaultCoords) // fallback to default if invalid
    }
  }

  const handleUpdate = async () => {
    const {
      name,
      location,
      incharge,
      contact,
      jailCapacity,
      firsRegistered,
      cctvCameras,
      _id, // make sure _id is destructured here
    } = editStation

    // const contactRegex = /^[0-9-\s]{7,15}$/

    if (
      !name?.trim() ||
      !location?.trim() ||
      !incharge?.trim() ||
      !contact?.trim() ||
      // !contactRegex.test(contact) ||
      !jailCapacity ||
      isNaN(Number(jailCapacity)) ||
      !firsRegistered ||
      isNaN(Number(firsRegistered)) ||
      !cctvCameras ||
      isNaN(Number(cctvCameras))
    ) {
      alert(
        'Please fill in all fields correctly.\n' +
          '- Contact must be a valid phone number (digits, spaces, dashes allowed).\n' +
          '- Jail Capacity, FIRs Registered, and CCTV Cameras must be numeric.'
      )
      return
    }

    try {
      // ✅ API call to update the station in the backend using _id
      const response = await fetch(
        `https://zaibtenpoliceserver.vercel.app/api/stations/${_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editStation),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update the station')
      }

      const updatedStation = await response.json()

      // ✅ Update the local state with updated data
      setStations((prev) =>
        prev.map((station) =>
          station._id === updatedStation._id ? updatedStation : station
        )
      )

      setEditStation(null)
      setModalVisible(true)
    } catch (error) {
      console.error('❌ Error updating station:', error)
      alert('Failed to update the station. Please try again.')
    }
  }

  // When map loads, keep reference
  // const onMapLoad = (mapInstance: google.maps.Map) => {
  //   setMap(mapInstance);
  // };

  return (
    <div
      style={{
        height: '100vh', // full viewport height
        overflowY: 'auto', // vertical scroll if content overflows
        padding: '20px', // add padding around content (adjust as needed)
        boxSizing: 'border-box', // include padding in the height calculation
        backgroundColor: '#f9f9f9', // optional: a light background for better spacing feel
      }}
    >
      <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
        POLICE STATION
      </h2>
      {/* Reset button */}
      <style>
        {`
  @keyframes shine {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`}
      </style>

      <button
        onClick={() => {
          setCurrentCoords(defaultCoords)
          setMapLocation(defaultLocationName)
          setSelectedStation(null)
        }}
        style={{
          background: 'linear-gradient(90deg, #0056b3, #007BFF, #3399FF)',
          color: '#fff',
          marginBottom: '5px',
          border: 'none',
          padding: '14px 28px',
          fontSize: '17px',
          fontWeight: '700',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 6px 15px rgba(0, 123, 255, 0.5)',
          transition: 'all 0.3s ease',
          outline: 'none',
          position: 'relative',
          overflow: 'hidden',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 123, 255, 0.8)'
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.animation = 'shine 1.5s linear infinite'
          e.currentTarget.style.backgroundSize = '200% 100%'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 123, 255, 0.5)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.animation = 'none'
          e.currentTarget.style.backgroundSize = '100% 100%'
        }}
      >
        Reset Location
      </button>

      {isLoaded && (
        <>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onClick={handleMapClick}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => setSelectedStation(marker)}
                icon={{
                  url: '/policemarker.png', // Use relative path from `public/`
                  scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
                }}
              />
            ))}

            {selectedStation && (
              <InfoWindow
                position={selectedStation.position}
                onCloseClick={handleCloseInfoWindow}
              >
                <div>
                  <h4 className='font-bold'>{selectedStation.name}</h4>
                  <p>
                    Location: {selectedStation.position.lat},{' '}
                    {selectedStation.position.lng}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </>
      )}

      <br />
      <div className='mb-4 flex flex-wrap items-center justify-center gap-4'>
        {/* Search Input */}
        <input
          type='text'
          placeholder='Search by police station name'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1) // reset to first page on new search
          }}
          className='w-96 rounded border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        {/* District Filter */}
        <div className='flex items-center gap-2'>
          <label htmlFor='districtFilter' className='font-medium text-gray-700'>
            Filter by District:
          </label>
          <select
            id='districtFilter'
            name='districtFilter'
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className='rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'
          >
            <option value=''>All Districts</option>
            <option value='SOUTH DISTRICT'>SOUTH DISTRICT</option>
            <option value='EAST DISTRICT'>EAST DISTRICT</option>
            <option value='CENTRAL DISTRICT'>CENTRAL DISTRICT</option>
            <option value='WEST DISTRICT'>WEST DISTRICT</option>
            <option value='KORANGI DISTRICT'>KORANGI DISTRICT</option>
            <option value='MALIR DISTRICT'>MALIR DISTRICT</option>
          </select>
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between px-4'>
        {/* Left side empty or you can put something here */}
        <div></div>

        {/* Pagination controls centered */}
        <div className='flex items-center space-x-2'>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`rounded-full border p-2 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className='h-5 w-5' />
          </button>

          <span className='text-sm font-medium text-gray-700'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`rounded-full border p-2 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>

        {/* Right side: Items per page input */}
        <div className='flex items-center space-x-2'>
          <label
            htmlFor='itemsPerPage'
            className='text-sm font-medium text-gray-700'
          >
            Items per page:
          </label>
          <input
            id='itemsPerPage'
            type='number'
            min={1}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value) || 20)}
            className='w-20 rounded border p-1 text-center'
          />
        </div>
      </div>

      <br></br>
      <div className='max-h-[400px] overflow-x-auto overflow-y-auto rounded-lg border border-gray-200 shadow'>
        <table className='min-w-full text-left text-sm text-gray-700'>
          <thead className='bg-gray-100 text-xs font-medium uppercase'>
            <tr>
              <th className='px-4 py-2'>Name</th>
              <th className='px-4 py-2'>Incharge</th>
              <th className='px-4 py-2'>Contact</th>
              <th className='px-4 py-2'>District</th>
              <th className='px-4 py-2'>Location</th>
              <th className='px-4 py-2'>Jail Cap.</th>
              <th className='px-4 py-2'>FIRs</th>
              <th className='px-4 py-2'>CCTV</th>
              <th className='px-4 py-2'>Weapons</th>
              <th className='px-4 py-2'>Vehicles</th>
              <th className='px-4 py-2'>Station Image</th> {/* New header */}
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStations
              .filter((station) =>
                districtFilter ? station.district === districtFilter : true
              )
              .map((station) => (
                <tr key={station._id} className='border-t hover:bg-gray-50'>
                  <td className='px-4 py-2'>{station.name}</td>
                  <td className='px-4 py-2'>{station.incharge}</td>
                  <td className='px-4 py-2'>{station.contact}</td>
                  <td className='px-4 py-2'>{station.district}</td>
                  <td className='min-w-[200px] whitespace-normal px-4 py-2'>
                    {station.location}
                  </td>
                  <td className='px-4 py-2'>{station.jailCapacity}</td>
                  <td className='px-4 py-2'>{station.firsRegistered}</td>
                  <td className='px-4 py-2'>{station.cctvCameras}</td>
                  <td className='min-w-[200px] whitespace-normal px-4 py-2'>
                    {station.weapons && station.weapons.length > 0
                      ? station.weapons.join(', ')
                      : 'None'}
                  </td>
                  <td className='min-w-[200px] whitespace-normal px-4 py-2'>
                    {station.vehicles && station.vehicles.length > 0
                      ? station.vehicles.join(', ')
                      : 'None'}
                  </td>
                  <td className='min-w-[200px] whitespace-normal px-4 py-2'>
                    {station.image ? (
                      <img
                        src={station.image}
                        alt={`${station.name} station`}
                        className='h-16 w-16 rounded object-cover'
                      />
                    ) : (
                      // <span className="text-gray-400 text-xs">No Station Image</span>
                      <span className='text-xs text-gray-400'>-</span>
                    )}
                  </td>
                  <td className='flex flex-wrap items-center gap-2 px-4 py-2'>
                    <button
                      onClick={() => handleEdit(station)}
                      className='rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(station._id)}
                      className='rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            {currentStations.length === 0 && (
              <tr>
                <td colSpan={11} className='p-4 text-center text-gray-500'>
                  No stations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <br />
      <br />

      {/* Edit Modal */}
      {editStation && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-6 text-center text-2xl font-bold text-blue-700'>
              Edit Station
            </h3>{' '}
            {/* Image block */}
            {editStation.image && (
              <div className='mb-6 flex justify-center'>
                <img
                  src={editStation.image}
                  alt='Station'
                  className='h-40 w-40 rounded-full border-4 border-gray-300 object-cover shadow-md'
                />
              </div>
            )}
            <div className='mb-4 grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-1 block font-medium'>Station Name</label>
                <input
                  name='name'
                  placeholder='Station Name'
                  value={editStation.name}
                  readOnly
                  onChange={(e) =>
                    setEditStation((prev: any) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className='w-full cursor-not-allowed rounded border bg-gray-100 p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block font-medium'>Location</label>
                <input
                  name='location'
                  placeholder='Location'
                  value={editStation.location}
                  readOnly
                  onChange={handleLocationChange}
                  className='w-full cursor-not-allowed rounded border bg-gray-100 p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block font-medium'>Incharge</label>
                <input
                  name='incharge'
                  placeholder='Incharge'
                  value={editStation.incharge}
                  onChange={(e) =>
                    setEditStation((prev: any) => ({
                      ...prev,
                      incharge: e.target.value,
                    }))
                  }
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block font-medium'>Contact</label>
                <input
                  name='contact'
                  placeholder='Contact'
                  value={editStation.contact}
                  onChange={(e) =>
                    setEditStation((prev: any) => ({
                      ...prev,
                      contact: e.target.value,
                    }))
                  }
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block font-medium'>Jail Capacity</label>
                <input
                  name='jailCapacity'
                  placeholder='Jail Capacity'
                  value={editStation.jailCapacity}
                  onChange={(e) =>
                    setEditStation((prev: any) => ({
                      ...prev,
                      jailCapacity: e.target.value,
                    }))
                  }
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block font-medium'>
                  FIRs Registered
                </label>
                <input
                  name='firsRegistered'
                  placeholder='FIRs Registered'
                  value={editStation.firsRegistered}
                  onChange={(e) =>
                    setEditStation((prev: any) => ({
                      ...prev,
                      firsRegistered: e.target.value,
                    }))
                  }
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block font-medium'>CCTV Cameras</label>
                <input
                  name='cctvCameras'
                  placeholder='CCTV Cameras'
                  value={editStation.cctvCameras}
                  onChange={(e) =>
                    setEditStation((prev: any) => ({
                      ...prev,
                      cctvCameras: e.target.value,
                    }))
                  }
                  className='w-full rounded border p-2'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block font-medium'>District</label>
                <input
                  name='District'
                  placeholder='District'
                  value={editStation.district}
                  readOnly
                  className='w-full cursor-not-allowed rounded border bg-gray-100 p-2 text-gray-700'
                  required
                />
              </div>

              <div className='mb-4'>
                <label className='mb-2 block font-semibold'>Weapons</label>
                <div className='flex flex-wrap gap-3'>
                  {weaponsList.map((weapon) => (
                    <label
                      key={weapon}
                      className='inline-flex items-center space-x-2'
                    >
                      <input
                        type='checkbox'
                        value={weapon}
                        checked={
                          editStation?.weapons?.includes(weapon) || false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked
                          setEditStation((prev: PoliceStationType | null) => {
                            if (!prev) return prev
                            let newWeapons = prev.weapons
                              ? [...prev.weapons]
                              : []
                            if (checked) {
                              if (!newWeapons.includes(weapon))
                                newWeapons.push(weapon)
                            } else {
                              newWeapons = newWeapons.filter(
                                (w) => w !== weapon
                              )
                            }
                            return { ...prev, weapons: newWeapons }
                          })
                        }}
                        className='form-checkbox h-4 w-4 text-blue-600'
                      />
                      <span>{weapon}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className='mb-4'>
                <label className='mb-2 block font-semibold'>Vehicles</label>
                <div className='flex flex-wrap gap-3'>
                  {vehiclesList.map((vehicle) => (
                    <label
                      key={vehicle}
                      className='inline-flex items-center space-x-2'
                    >
                      <input
                        type='checkbox'
                        value={vehicle}
                        checked={
                          editStation?.vehicles?.includes(vehicle) || false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked
                          setEditStation((prev: PoliceStationType | null) => {
                            if (!prev) return prev
                            let newVehicles = prev.vehicles
                              ? [...prev.vehicles]
                              : []
                            if (checked) {
                              if (!newVehicles.includes(vehicle))
                                newVehicles.push(vehicle)
                            } else {
                              newVehicles = newVehicles.filter(
                                (v) => v !== vehicle
                              )
                            }
                            return { ...prev, vehicles: newVehicles }
                          })
                        }}
                        className='form-checkbox h-4 w-4 text-green-600'
                      />
                      <span>{vehicle}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className='mb-2 block font-semibold'>
                Google Map (Live)
              </label>
              <div
                onClick={handleMapClick}
                className='h-64 w-full cursor-pointer overflow-hidden rounded border'
              >
                <iframe
                  title='Google Map'
                  src={`https://maps.google.com/maps?q=${
                    currentCoords?.lat && currentCoords?.lng
                      ? `${currentCoords.lat},${currentCoords.lng}`
                      : encodeURIComponent(mapLocation || 'Pakistan')
                  }&t=&z=13&ie=UTF8&iwloc=A&output=embed`}
                  width='100%'
                  height='100%'
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  style={{ pointerEvents: 'auto' }}
                ></iframe>
              </div>
              <small className='mt-1 block text-gray-500'>
                * Click on the map is disabled due to iframe restrictions.
                Please change location manually.
              </small>
            </div>
            <div className='mt-4 flex justify-end gap-3'>
              <button
                onClick={() => setEditStation(null)}
                className='rounded border px-4 py-2 text-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className='rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'
              >
                Update Station
              </button>
            </div>
          </div>
        </div>
      )}

      {modalVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.4s ease-in-out',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '3rem 2.5rem',
              borderRadius: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
              animation: 'slideUpFade 0.5s ease-out forwards',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src='/logo.png'
              alt='Zaibten Logo'
              style={{
                width: '90px',
                height: '90px',
                margin: '0 auto 1.2rem auto',
                animation: 'bounceIn 0.8s ease',
                borderRadius: '50%',
                boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
              }}
            />

            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '0.75rem',
                animation: 'fadeInText 0.6s ease-in-out 0.4s forwards',
                opacity: 0,
              }}
            >
              Zaibten Police Management System
            </h1>

            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#22c55e',
                marginBottom: '2rem',
                animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
                opacity: 0,
              }}
            >
              Police Station Updated Successfully!
            </h2>

            <button
              onClick={() => setModalVisible(false)}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                padding: '0.75rem 2rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
                opacity: 0,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Close
            </button>
          </div>

          <style>
            {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUpFade {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
      `}
          </style>
        </div>
      )}

      {showDeleteModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2.5rem 2rem',
              borderRadius: '1.5rem',
              maxWidth: '450px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
              animation: 'slideUpFade 0.5s ease-out forwards',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src='/logo.png'
              alt='Zaibten Logo'
              style={{
                width: '90px',
                height: '90px',
                margin: '0 auto 1.2rem auto',
                animation: 'bounceIn 0.8s ease',
                borderRadius: '50%',
                boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
              }}
            />

            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '0.5rem',
                animation: 'fadeInText 0.6s ease-in-out 0.4s forwards',
                opacity: 0,
              }}
            >
              Confirm Delete
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#334155',
                marginBottom: '2rem',
                animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
                opacity: 0,
              }}
            >
              Are you sure you want to delete this station? This action cannot
              be undone.
            </p>

            <div className='flex justify-center gap-4'>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteStationId(null)
                }}
                className='rounded border px-4 py-2 text-gray-700'
                style={{
                  animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
                  opacity: 0,
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb' // gray-200
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteStation}
                className='rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
                style={{
                  animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
                  opacity: 0,
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Delete
              </button>
            </div>

            <style>
              {`
          @keyframes slideUpFade {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes fadeInText {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounceIn {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            70% {
              transform: scale(0.95);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
            </style>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2.5rem 2rem',
              borderRadius: '1.5rem',
              maxWidth: '450px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
              animation: 'slideUpFade 0.5s ease-out forwards',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src='/logo.png'
              alt='Zaibten Logo'
              style={{
                width: '90px',
                height: '90px',
                margin: '0 auto 1.2rem auto',
                animation: 'bounceIn 0.8s ease',
                borderRadius: '50%',
                boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
              }}
            />

            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#16a34a', // green
                marginBottom: '0.5rem',
                animation: 'fadeInText 0.6s ease-in-out 0.4s forwards',
                opacity: 0,
              }}
            >
              Success!
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#334155',
                marginBottom: '2rem',
                animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
                opacity: 0,
              }}
            >
              ✅ Station deleted successfully.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className='rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700'
              style={{
                animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
                opacity: 0,
                transition: 'background-color 0.3s ease, transform 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#15803d'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#16a34a'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Close
            </button>

            <style>
              {`
          @keyframes slideUpFade {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes fadeInText {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounceIn {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            70% {
              transform: scale(0.95);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
            </style>
          </div>
        </div>
      )}
    </div>
  )
}
