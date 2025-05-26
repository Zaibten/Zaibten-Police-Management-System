import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const weaponsList = [
  'Pistols', 'Rifles', 'Shotguns', 'Submachine Guns', 'Machine Guns',
  'Sniper Rifles', 'Tasers', 'Baton', 'Grenades',
];

const vehiclesList = [
  'Patrol Cars', 'Motorcycles', 'Armored Vehicles', 'Vans', 'Helicopters',
  'Boats', 'Bicycles', 'Trucks',
];

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
  });

  const [initialLocation, setInitialLocation] = useState('');
  const [weapons, setWeapons] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const GOOGLE_API_KEY = 'AIzaSyDYNJVSQHG-_I6eC6VXqhSrcpYmXTKWtU8';

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const defaultPos = { lat: 24.8607, lng: 67.0011 };
    const gMap = new window.google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 15,
    });

    const gMarker = new window.google.maps.Marker({
      position: defaultPos,
      map: gMap,
      draggable: true,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          gMap.setCenter(userPos);
          gMarker.setPosition(userPos);
          reverseGeocode(userPos.lat, userPos.lng, true);
        },
        () => reverseGeocode(defaultPos.lat, defaultPos.lng, true),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      reverseGeocode(defaultPos.lat, defaultPos.lng, true);
    }

    gMarker.addListener('dragend', () => {
      const pos = gMarker.getPosition();
      if (pos) reverseGeocode(pos.lat(), pos.lng());
    });

    gMap.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      gMarker.setPosition(e.latLng);
      gMap.panTo(e.latLng);
      reverseGeocode(e.latLng.lat(), e.latLng.lng());
    });

    setMap(gMap);
    setMarker(gMarker);
  };

const reverseGeocode = (lat: number, lng: number, setInitial = false) => {
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === 'OK' && results && results[0]) {
      const address = results[0].formatted_address;
      if (setInitial) {
        setInitialLocation(address);
      }
      setFormData((prev) => ({
        ...prev,
        location: address,
        latitude: lat.toString(),
        longitude: lng.toString(),
      }));
      setErrors((prev) => ({ ...prev, location: '' }));
    }
  });
};


  const geocodeLocation = (address: string) => {
    if (!window.google || !map || !marker) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const loc = results[0].geometry.location;
        map.panTo(loc);
        marker.setPosition(loc);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      ['jailCapacity', 'cctvCameras', 'firsRegistered'].includes(name) &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'location') geocodeLocation(value);
      return newData;
    });

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    stateArray: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const value = e.target.value;
    if (e.target.checked) {
      setState([...stateArray, value]);
    } else {
      setState(stateArray.filter((v) => v !== value));
    }
    setErrors((prev) => ({ ...prev, weapons: '', vehicles: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const contactRegex = /^03\d{9}$/;

    if (!formData.name.trim()) newErrors.name = 'Station Name is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.incharge.trim()) newErrors.incharge = 'Officer Incharge is required.';
    if (!contactRegex.test(formData.contact))
      newErrors.contact = 'Contact number is invalid. (e.g. 03XXXXXXXXX)';
    if (formData.jailCapacity === '') newErrors.jailCapacity = 'Jail Capacity must be numeric.';
    if (formData.cctvCameras === '') newErrors.cctvCameras = 'CCTV Cameras must be numeric.';
    if (formData.firsRegistered === '') newErrors.firsRegistered = 'FIRs Registered must be numeric.';
    if (weapons.length === 0) newErrors.weapons = 'At least one weapon must be selected.';
    if (vehicles.length === 0) newErrors.vehicles = 'At least one vehicle must be selected.';
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required.';
if (!formData.longitude.trim()) newErrors.longitude = 'Longitude is required.';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  const handleSubmit = () => {
  //   if (!validate()) return;

  //   setModalVisible(true);
  //   setFormData({
  //     name: '',
  //     location: initialLocation, // Restore fetched location instead of blank
  //     incharge: '',
  //     contact: '',
  //     jailCapacity: '0',
  //     cctvCameras: '0',
  //     firsRegistered: '0',
  //   latitude: '',
  // longitude: '',
  //   });
  //   setWeapons([]);
  //   setVehicles([]);
  //   if (marker && map) {
  //     const defaultPos = { lat: 24.8607, lng: 67.0011 };
  //     marker.setPosition(defaultPos);
  //     map.panTo(defaultPos);
  //   }
  // };

const handleSubmit = () => {
  if (!validate()) return;

  const completeData = {
    ...formData,
    weapons,
    vehicles,
  };

  axios.post('http://localhost:5000/api/police-station', completeData)
    .then(res => {
      console.log("Saved:", res.data);
      setModalVisible(true); // Show modal on success

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
      });
      setWeapons([]);
      setVehicles([]);

      if (marker && map) {
        const defaultPos = { lat: 24.8607, lng: 67.0011 };
        marker.setPosition(defaultPos);
        map.panTo(defaultPos);
      }
    })
    .catch(err => {
      console.error("Error saving station:", err.response?.data || err.message);
      alert("Failed to save police station.");
    });
};


return (
  <div className="p-6 md:p-10 max-w-6xl mx-auto h-screen overflow-y-auto bg-gray-50">
    <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Add Police Station</h2>

    <div className="space-y-6">
      {/* Form inputs with map side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left 2 columns: form inputs except location */}
        <div className="md:col-span-2 space-y-6">
          {/* Station Name, Officer Incharge, Contact */}
          {[
            { label: 'Station Name', name: 'name', type: 'text', required: true, placeholder: 'Enter station name' },
            { label: 'Officer Incharge', name: 'incharge', type: 'text', required: true, placeholder: 'Enter officer incharge' },
            { label: 'Contact Number', name: 'contact', type: 'text', placeholder: '03XXXXXXXXX', required: true },
          ].map(({ label, name, type, placeholder, required }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-1 font-semibold text-gray-700">
                {label} {required && <span className="text-red-600">*</span>}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder || ''}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[name] && (
                <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Location */}
          <div className="flex flex-col">
            <label htmlFor="location" className="mb-1 font-semibold text-gray-700">
              Location <span className="text-red-600">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleInputChange}
              className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="off"
            />
            {errors.location && (
              <p className="text-red-600 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Numeric fields: Jail Capacity, CCTV Cameras, FIRs Registered */}
          <div className="grid grid-cols-3 gap-6 mt-4">
            {[
              { label: 'Jail Capacity', name: 'jailCapacity' },
              { label: 'CCTV Cameras', name: 'cctvCameras' },
              { label: 'FIRs Registered', name: 'firsRegistered' },
            ].map(({ label, name }) => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="mb-1 font-semibold text-gray-700">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder='Enter value here'
                  value={formData[name as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[name] && (
                  <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 column: Google Map */}
        <div className="h-72 md:h-full rounded-md border border-gray-300 shadow-md" ref={mapRef} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6 mt-4">
<div className="flex flex-col">
  <label htmlFor="latitude" className="mb-1 font-semibold text-gray-700">
    Latitude <span className="text-red-600">*</span>
  </label>
  <input
    id="latitude"
    name="latitude"
    type="text"
    required
    placeholder="Enter latitude"
    value={formData.latitude}
    onChange={handleInputChange}
    className={`border rounded px-3 py-2 ${
      errors.latitude ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude}</p>}
</div>

<div className="flex flex-col">
  <label htmlFor="longitude" className="mb-1 font-semibold text-gray-700">
    Longitude <span className="text-red-600">*</span>
  </label>
  <input
    id="longitude"
    name="longitude"
    type="text"
    required
    placeholder="Enter longitude"
    value={formData.longitude}
    onChange={handleInputChange}
    className={`border rounded px-3 py-2 ${
      errors.longitude ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude}</p>}
</div>

</div>


    {/* Weapons Selection */}
    <div>
      <p className="font-semibold mb-2">
        Weapons <span className="text-red-600">*</span>
      </p>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto border p-3 rounded bg-white">
        {weaponsList.map((weapon) => (
          <label key={weapon} className="inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="form-checkbox"
              value={weapon}
              checked={weapons.includes(weapon)}
              onChange={(e) => handleCheckboxChange(e, weapons, setWeapons)}
            />
            <span className="ml-2">{weapon}</span>
          </label>
        ))}
      </div>
      {errors.weapons && (
        <p className="text-red-600 text-sm mt-1">{errors.weapons}</p>
      )}
    </div>

    {/* Vehicles Selection */}
    <div>
      <p className="font-semibold mb-2">
        Vehicles <span className="text-red-600">*</span>
      </p>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto border p-3 rounded bg-white">
        {vehiclesList.map((vehicle) => (
          <label key={vehicle} className="inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="form-checkbox"
              value={vehicle}
              checked={vehicles.includes(vehicle)}
              onChange={(e) => handleCheckboxChange(e, vehicles, setVehicles)}
            />
            <span className="ml-2">{vehicle}</span>
          </label>
        ))}
      </div>
      {errors.vehicles && (
        <p className="text-red-600 text-sm mt-1">{errors.vehicles}</p>
      )}
    </div>

    {/* Submit Button */}
    <div className="text-center mt-6">
  <button
    onClick={handleSubmit}
    className="w-48 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
  >
    Submit
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
        src="/logo.png"
        alt="Zaibten Logo"
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
        Zaibten Police Management System
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
          e.currentTarget.style.backgroundColor = '#b91c1c'; // red-700
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626';
          e.currentTarget.style.transform = 'scale(1)';
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
