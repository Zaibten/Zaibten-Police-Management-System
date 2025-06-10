import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

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

export default function AddStation() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    incharge: '',
    contact: '',
    jailCapacity: '0',
    cctvCameras: '0',
    firsRegistered: '0',
    latitude: '',
    longitude: '',
    district: '',
  })

  const [initialLocation, setInitialLocation] = useState('')
  const [weapons, setWeapons] = useState<string[]>([])
  const [vehicles, setVehicles] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [modalVisible, setModalVisible] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const GOOGLE_API_KEY = 'AIzaSyDYNJVSQHG-_I6eC6VXqhSrcpYmXTKWtU8'
  const [serverError, setServerError] = React.useState('')

  // Inside AddStation component, add:
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Add this handler for file input change:
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0])
    }
  }

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
      script.async = true
      script.onload = () => initializeMap()
      document.head.appendChild(script)
    } else {
      initializeMap()
    }
  }, [])

  const initializeMap = () => {
    if (!mapRef.current) return

    const defaultPos = { lat: 24.8607, lng: 67.0011 }
    const gMap = new window.google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 15,
    })

    const gMarker = new window.google.maps.Marker({
      position: defaultPos,
      map: gMap,
      draggable: true,
    })

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          gMap.setCenter(userPos)
          gMarker.setPosition(userPos)
          reverseGeocode(userPos.lat, userPos.lng, true)
        },
        () => reverseGeocode(defaultPos.lat, defaultPos.lng, true),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    } else {
      reverseGeocode(defaultPos.lat, defaultPos.lng, true)
    }

    gMarker.addListener('dragend', () => {
      const pos = gMarker.getPosition()
      if (pos) reverseGeocode(pos.lat(), pos.lng())
    })

    gMap.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return
      gMarker.setPosition(e.latLng)
      gMap.panTo(e.latLng)
      reverseGeocode(e.latLng.lat(), e.latLng.lng())
    })

    setMap(gMap)
    setMarker(gMarker)
  }

  const reverseGeocode = (lat: number, lng: number, setInitial = false) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address
        if (setInitial) {
          setInitialLocation(address)
        }
        setFormData((prev) => ({
          ...prev,
          location: address,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }))
        setErrors((prev) => ({ ...prev, location: '' }))
      }
    })
  }

  const geocodeLocation = (address: string) => {
    if (!window.google || !map || !marker) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const loc = results[0].geometry.location
        map.panTo(loc)
        marker.setPosition(loc)
      }
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (
      ['jailCapacity', 'cctvCameras', 'firsRegistered'].includes(name) &&
      !/^\d*$/.test(value)
    ) {
      return
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      if (name === 'location') geocodeLocation(value)
      return newData
    })

    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    stateArray: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const value = e.target.value
    if (e.target.checked) {
      setState([...stateArray, value])
    } else {
      setState(stateArray.filter((v) => v !== value))
    }
    setErrors((prev) => ({ ...prev, weapons: '', vehicles: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    // const contactRegex = /^(03\d{9}|0\d{2}-\d{7})$/;

    if (!formData.name.trim()) newErrors.name = 'Station Name is required.'
    if (!formData.location.trim()) newErrors.location = 'Location is required.'
    if (!formData.incharge.trim())
      newErrors.incharge = 'Officer Incharge is required.'
    if (!formData.contact.trim())
      newErrors.contact = 'Contact number is invalid. (e.g. 021-XXXXXXXXX)'
    if (formData.jailCapacity === '')
      newErrors.jailCapacity = 'Jail Capacity must be numeric.'
    if (formData.cctvCameras === '')
      newErrors.cctvCameras = 'CCTV Cameras must be numeric.'
    if (formData.firsRegistered === '')
      newErrors.firsRegistered = 'FIRs Registered must be numeric.'
    if (weapons.length === 0)
      newErrors.weapons = 'At least one weapon must be selected.'
    if (vehicles.length === 0)
      newErrors.vehicles = 'At least one vehicle must be selected.'
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required.'
    if (!formData.longitude.trim())
      newErrors.longitude = 'Longitude is required.'
    if (!formData.district.trim()) newErrors.district = 'District is required.'
    // Validate image required
    if (!imageFile) {
      newErrors.image = 'Station image is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    // Prepare form data for multipart/form-data
    const formPayload = new FormData()

    // Append all fields except arrays first
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value)
    })

    // Append arrays as JSON strings
    formPayload.append('weapons', JSON.stringify(weapons))
    formPayload.append('vehicles', JSON.stringify(vehicles))

    // Append the image file if any
    if (imageFile) {
      formPayload.append('image', imageFile)
    }

    axios
      .post('https://zaibtenpoliceserver.vercel.app/api/police-station', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log('Saved:', res.data)
        setModalVisible(true) // Show modal on success
        setServerError('') // Clear previous server errors

        // ✅ Reset form
        setFormData({
          name: '',
          location: initialLocation,
          incharge: '',
          contact: '',
          jailCapacity: '0',
          cctvCameras: '0',
          firsRegistered: '0',
          latitude: '',
          longitude: '',
          district: '',
        })
        setWeapons([])
        setVehicles([])
        setImageFile(null) // Clear image input

        if (marker && map) {
          const defaultPos = { lat: 24.8607, lng: 67.0011 }
          marker.setPosition(defaultPos)
          map.panTo(defaultPos)
        }
      })
      .catch((err) => {
        console.error(
          'Error saving station:',
          err.response?.data || err.message
        )
        if (err.response?.status === 409) {
          setServerError(err.response.data.message) // Duplicate error
        } else {
          alert('Failed to save police station.')
        }
      })
  }

  return (
    <div className='mx-auto h-screen max-w-6xl overflow-y-auto bg-gray-50 p-6 md:p-10'>
      <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
        ADD POLICE STATION
      </h2>

      <div className='space-y-6'>
        {/* Form inputs with map side by side */}
        <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-3'>
          {/* Left 2 columns: form inputs except location */}
          <div className='space-y-6 md:col-span-2'>
            {/* Station Name, Officer Incharge, Contact */}
            {[
              {
                label: 'Station Name',
                name: 'name',
                type: 'text',
                required: true,
                placeholder: 'Enter station name',
              },
              {
                label: 'Officer Incharge',
                name: 'incharge',
                type: 'text',
                required: true,
                placeholder: 'Enter officer incharge',
              },
              // { label: 'Contact Number', name: 'contact', type: 'text', placeholder: '021-XXXXXXXXX', required: true,},
            ].map(({ label, name, type, placeholder, required }) => (
              <div key={name} className='flex flex-col'>
                <label
                  htmlFor={name}
                  className='mb-1 font-semibold text-gray-700'
                >
                  {label} {required && <span className='text-red-600'>*</span>}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder || ''}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[name] && (
                  <p className='mt-1 text-sm text-red-600'>{errors[name]}</p>
                )}
              </div>
            ))}

            <div className='flex flex-col'>
              <label
                htmlFor='contact'
                className='mb-1 font-semibold text-gray-700'
              >
                Contact Number <span className='text-red-600'>*</span>
              </label>
              <input
                id='contact'
                name='contact'
                type='text'
                placeholder='Enter contact number'
                value={formData.contact}
                onChange={handleInputChange}
                className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                }`}
                // autoComplete="off"
              />
              {errors.contact && (
                <p className='mt-1 text-sm text-red-600'>{errors.contact}</p>
              )}
            </div>

            <div className='flex flex-col'>
              <label
                htmlFor='district'
                className='mb-1 font-medium text-gray-800'
              >
                District <span className='text-red-600'>*</span>
              </label>
              <div className='relative'>
                <select
                  id='district'
                  name='district'
                  required
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`w-full appearance-none rounded-md border px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.district ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value='' disabled>
                    Select a district
                  </option>
                  <option value='SOUTH DISTRICT'>SOUTH DISTRICT</option>
                  <option value='EAST DISTRICT'>EAST DISTRICT</option>
                  <option value='CENTRAL DISTRICT'>CENTRAL DISTRICT</option>
                  <option value='WEST DISTRICT'>WEST DISTRICT</option>
                  <option value='KORANGI DISTRICT'>KORANGI DISTRICT</option>
                  <option value='MALIR DISTRICT'>MALIR DISTRICT</option>
                </select>

                {/* Custom arrow icon */}
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400'>
                  <svg
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>

              {errors.district && (
                <p className='mt-1 text-sm text-red-600'>{errors.district}</p>
              )}
            </div>

            {/* Location */}
            <div className='flex flex-col'>
              <label
                htmlFor='location'
                className='mb-1 font-semibold text-gray-700'
              >
                Location <span className='text-red-600'>*</span>
              </label>
              <input
                id='location'
                name='location'
                type='text'
                placeholder='Enter location'
                value={formData.location}
                onChange={handleInputChange}
                className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                autoComplete='off'
              />
              {errors.location && (
                <p className='mt-1 text-sm text-red-600'>{errors.location}</p>
              )}
            </div>

            {/* Numeric fields: Jail Capacity, CCTV Cameras, FIRs Registered */}
            <div className='mt-4 grid grid-cols-3 gap-6'>
              {[
                { label: 'Jail Capacity', name: 'jailCapacity' },
                { label: 'CCTV Cameras', name: 'cctvCameras' },
                { label: 'FIRs Registered', name: 'firsRegistered' },
              ].map(({ label, name }) => (
                <div key={name} className='flex flex-col'>
                  <label
                    htmlFor={name}
                    className='mb-1 font-semibold text-gray-700'
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    placeholder='Enter value here'
                    value={formData[name as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[name] && (
                    <p className='mt-1 text-sm text-red-600'>{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 column: Google Map */}
          <div
            className='h-72 rounded-md border border-gray-300 shadow-md md:h-full'
            ref={mapRef}
          />
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-6'>
        <div className='flex flex-col'>
          <label
            htmlFor='latitude'
            className='mb-1 font-semibold text-gray-700'
          >
            Latitude <span className='text-red-600'>*</span>
          </label>
          <input
            id='latitude'
            name='latitude'
            type='text'
            required
            placeholder='Enter latitude'
            value={formData.latitude}
            onChange={handleInputChange}
            className={`rounded border px-3 py-2 ${
              errors.latitude ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.latitude && (
            <p className='text-sm text-red-500'>{errors.latitude}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='longitude'
            className='mb-1 font-semibold text-gray-700'
          >
            Longitude <span className='text-red-600'>*</span>
          </label>
          <input
            id='longitude'
            name='longitude'
            type='text'
            required
            placeholder='Enter longitude'
            value={formData.longitude}
            onChange={handleInputChange}
            className={`rounded border px-3 py-2 ${
              errors.longitude ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.longitude && (
            <p className='text-sm text-red-500'>{errors.longitude}</p>
          )}
        </div>
      </div>

      {/* Weapons Selection */}
      <div>
        <p className='mb-2 font-semibold'>
          Weapons <span className='text-red-600'>*</span>
        </p>
        <div className='grid max-h-40 grid-cols-3 gap-2 overflow-y-auto rounded border bg-white p-3 md:grid-cols-5'>
          {weaponsList.map((weapon) => (
            <label
              key={weapon}
              className='inline-flex cursor-pointer select-none items-center'
            >
              <input
                type='checkbox'
                className='form-checkbox'
                value={weapon}
                checked={weapons.includes(weapon)}
                onChange={(e) => handleCheckboxChange(e, weapons, setWeapons)}
              />
              <span className='ml-2'>{weapon}</span>
            </label>
          ))}
        </div>
        {errors.weapons && (
          <p className='mt-1 text-sm text-red-600'>{errors.weapons}</p>
        )}
      </div>

      {/* Vehicles Selection */}
      <div>
        <p className='mb-2 font-semibold'>
          Vehicles <span className='text-red-600'>*</span>
        </p>
        <div className='grid max-h-40 grid-cols-3 gap-2 overflow-y-auto rounded border bg-white p-3 md:grid-cols-5'>
          {vehiclesList.map((vehicle) => (
            <label
              key={vehicle}
              className='inline-flex cursor-pointer select-none items-center'
            >
              <input
                type='checkbox'
                className='form-checkbox'
                value={vehicle}
                checked={vehicles.includes(vehicle)}
                onChange={(e) => handleCheckboxChange(e, vehicles, setVehicles)}
              />
              <span className='ml-2'>{vehicle}</span>
            </label>
          ))}
        </div>
        {errors.vehicles && (
          <p className='mt-1 text-sm text-red-600'>{errors.vehicles}</p>
        )}
      </div>

      <div>
        <label htmlFor='image' className='mb-1 block font-semibold'>
          Upload Station Image <span className='text-red-600'>*</span>
        </label>
        <input
          type='file'
          id='image'
          accept='image/*'
          onChange={handleImageChange}
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            errors.image ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {/* Show image preview if imageFile is selected */}
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt='Uploaded Station'
            className='mt-2 max-h-48 rounded border'
          />
        )}
        {/* Show error message if image is missing */}
        {errors.image && (
          <p className='mt-1 text-sm text-red-600'>{errors.image}</p>
        )}
      </div>

      <style>{`
  .error-message {
    color: #e74c3c;
    background-color: #fdecea;
    border: 1px solid #e74c3c;
    padding: 12px 20px;
    margin-bottom: 15px;
    border-radius: 5px;
    font-weight: 600;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
  }
`}</style>
      <br></br>
      {serverError && <div className='error-message'>{serverError}</div>}

      {/* Submit Button */}
      <div className='mt-6 text-center'>
        <button
          onClick={handleSubmit}
          className='w-48 transform rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
        >
          Add Police Station
        </button>
      </div>

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
            {/* Logo */}
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

            {/* App Name */}
            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: '#1e293b', // slate-800
                marginBottom: '0.75rem',
                animation: 'fadeInText 0.6s ease-in-out 0.4s forwards',
                opacity: 0,
              }}
            >
              Police Management System
            </h1>

            {/* Success Message */}
            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#22c55e', // green-500
                marginBottom: '2rem',
                animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
                opacity: 0,
              }}
            >
              Police Station Added Successfully!
            </h2>

            {/* Close Button */}
            <button
              onClick={() => setModalVisible(false)}
              style={{
                backgroundColor: '#dc2626', // red-600
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
                e.currentTarget.style.backgroundColor = '#b91c1c' // red-700
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

          {/* Animations */}
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
    </div>
  )
}
