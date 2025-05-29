import React, { useEffect, useState} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleMap, Marker, useLoadScript, InfoWindow  } from '@react-google-maps/api';


export default function Stations() {
  const [modalVisible, setModalVisible] = React.useState(false);
  
const [stations, setStations] = useState<any[]>([]);
const [deleteStationId, setDeleteStationId] = React.useState<string | null>(null);
const [showDeleteModal, setShowDeleteModal] = React.useState(false);
const [showSuccessModal, setShowSuccessModal] = React.useState(false);

const weaponsList = [
  'Pistols', 'Rifles', 'Shotguns', 'Submachine Guns', 'Machine Guns',
  'Sniper Rifles', 'Tasers', 'Baton', 'Grenades',
];

const vehiclesList = [
  'Patrol Cars', 'Motorcycles', 'Armored Vehicles', 'Vans', 'Helicopters',
  'Boats', 'Bicycles', 'Trucks',
];

interface PoliceStationType {
  weapons?: string[];
  vehicles?: string[];
  name?: string;
  location?: string;
  incharge?: string;
  contact?: string;
  jailCapacity?: number;
  firsRegistered?: number;
  cctvCameras?: number;
  [key: string]: any;
}






useEffect(() => {
  const fetchStations = async () => {
    try {
      const response = await fetch('https://zaibtenpoliceserver.vercel.app/api/getpolice-stations');
      const json = await response.json();
      if (json.success) {
        setStations(json.data);
      } else {
        console.error('Failed to load stations:', json.message);
      }
    } catch (err) {
      console.error('API fetch error:', err);
    }
  };
  fetchStations();
}, []);

const defaultCoords = { lat: 24.8607, lng: 67.0011 }; // Karachi center coordinates
const defaultLocationName = 'Karachi, Pakistan'; // Default location name or empty string ''

  const [editStation, setEditStation] = useState<any>(null);
  // const mapRef = useRef<HTMLIFrameElement>(null);
const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(defaultCoords);
const [mapLocation, setMapLocation] = useState(defaultLocationName);

  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add this inside your component before pagination calculations
const filteredStations = stations.filter(station =>
  station.name.toLowerCase().includes(searchTerm.toLowerCase())
);





 const itemsPerPage = 20;
 const [markers, setMarkers] = useState<any[]>([]);
// const [searchTerm, setSearchTerm] = useState('');
// const [map, setMap] = useState<google.maps.Map | null>(null);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [, setMap] = useState<google.maps.Map | null>(null);



const [currentPage, setCurrentPage] = useState(1);

// Calculate pages
// Update pagination calculation to use filteredStations
const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentStations = filteredStations.slice(startIndex, startIndex + itemsPerPage);


// Pagination Handlers
const goToNextPage = () => {
  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
};


const goToPrevPage = () => {
  setCurrentPage((prev) => Math.max(prev - 1, 1));
};
  // Replace with your Google Maps Geocoding API Key (you can get one from Google Cloud Console)
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDYNJVSQHG-_I6eC6VXqhSrcpYmXTKWtU8';

  // On modal open, try to auto-fetch user's current location (geolocation)
useEffect(() => {
  if (editStation && !editStation.location) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName = data.display_name || `${latitude}, ${longitude}`;

          setEditStation((prev: any) => ({
            ...prev,
            location: locationName,
          }));

          setMapLocation(locationName);
        },
        () => {
          setMapLocation(editStation.location || '');
        }
      );
    } else {
      setMapLocation(editStation.location || '');
    }
  } else if (editStation?.location) {
    setMapLocation(editStation.location);
  }
}, [editStation]);



  // Reverse geocode function to get location name from lat/lng
// const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
//   try {
//     const res = await fetch(
// `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`    );
//     const data = await res.json();
//     if (data.status === 'OK') {
//       return data.results[0]?.formatted_address || '';
//     } else {
//       console.error('Geocoding failed:', data.status);
//       return '';
//     }
//   } catch (error) {
//     console.error('Error in reverse geocoding:', error);
//     return '';
//   }
// };


  // Geocode function to get lat/lng from location name (used to generate map link)
  // async function geocode(location: string) {
  //   try {
  //     const res = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //         location
  //       )}&key=${GOOGLE_MAPS_API_KEY}`
  //     );
  //     const data = await res.json();
  //     if (data.status === 'OK' && data.results.length > 0) {
  //       return data.results[0].geometry.location;
  //     }
  //   } catch (error) {
  //     console.error('Geocode failed:', error);
  //   }
  //   return null;
  // }
const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 24.8607,
  lng: 67.0011,
};

const libraries: any = ['places'];

  // On location textbox change, update state and map location
  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditStation((prev: any) => ({ ...prev, location: val }));
    setMapLocation(val);
  };
const { isLoaded } = useLoadScript({
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  libraries,
});

useEffect(() => {
  if (!isLoaded) return;

  const newMarkers = stations
    .filter((station) => station.latitude && station.longitude)
    .map((station) => ({
      id: station._id,
      name: station.name,
      position: {
        lat: parseFloat(station.latitude),
        lng: parseFloat(station.longitude),
      },
    }));

  setMarkers(newMarkers);
}, [stations, isLoaded]);



// Map click handler for selecting a station marker
// const handleMarkerClick = (lat: number, lng: number) => {
//   if (map) {
//     map.panTo({ lat, lng });   // Center map on marker
//     map.setZoom(15);           // Zoom in (adjust zoom level as needed)
//   }
// };

// Map close info window handler
const handleCloseInfoWindow = () => {
  setSelectedStation(null);
};



  // Handle map click - get lat/lng from click, reverse geocode and update location textbox & map
  // const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const handleMapClick = async () => {
    // To get lat/lng from iframe click is not possible directly.
    // Instead, we will simulate by opening a small Google Maps in new tab to select location
    // But since direct click coordinates aren't accessible, we can add a workaround:

    // alert(
    //   'Map clicks are not supported on the embedded map due to iframe limitations. Please type the location in the textbox.'
    // );
  };

const confirmDeleteStation = async () => {
  if (!deleteStationId) return;

  try {
    const response = await fetch(`https://zaibtenpoliceserver.vercel.app/api/stations/${deleteStationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete the station');
    }

    const result = await response.json();
    console.log('Deleted:', result);

    setStations((prev) => prev.filter((station) => station._id !== deleteStationId));
    setShowDeleteModal(false);
    setDeleteStationId(null);

    // Show success modal instead of alert
    setShowSuccessModal(true);

  } catch (error) {
    console.error('❌ Error deleting station:', error);
    alert('Failed to delete the station. Please try again.');
  }
};


const handleDelete = (_id: string) => {
  setDeleteStationId(_id);
  setShowDeleteModal(true);
};


  const handleEdit = (station: any) => {
    setEditStation({ ...station });
    setMapLocation(station.location);
  };

// const handleDelete = async (_id) => {
//   const confirmDelete = window.confirm('Are you sure you want to delete this station?');
//   if (!confirmDelete) return;

//   try {
//     const response = await fetch(`https://zaibtenpoliceserver.vercel.app/api/stations/${_id}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       throw new Error('Failed to delete the station');
//     }

//     // Optionally get the response JSON
//     const result = await response.json();
//     console.log('Deleted:', result);

//     setStations((prev) => prev.filter((station) => station._id !== _id));
//     alert('✅ Station deleted successfully.');
//   } catch (error) {
//     console.error('❌ Error deleting station:', error);
//     alert('Failed to delete the station. Please try again.');
//   }
// };



const handleUpdate = async () => {
  const {
    name,
    location,
    incharge,
    contact,
    jailCapacity,
    firsRegistered,
    cctvCameras,
    _id // make sure _id is destructured here
  } = editStation;

  const contactRegex = /^[0-9-\s]{7,15}$/;

  if (
    !name?.trim() ||
    !location?.trim() ||
    !incharge?.trim() ||
    !contact?.trim() ||
    !contactRegex.test(contact) ||
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
    );
    return;
  }

  try {
    // ✅ API call to update the station in the backend using _id
    const response = await fetch(`https://zaibtenpoliceserver.vercel.app/api/stations/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editStation),
    });

    if (!response.ok) {
      throw new Error('Failed to update the station');
    }

    const updatedStation = await response.json();

    // ✅ Update the local state with updated data
    setStations((prev) =>
      prev.map((station) =>
        station._id === updatedStation._id ? updatedStation : station
      )
    );

    setEditStation(null);
    setModalVisible(true);
  } catch (error) {
    console.error('❌ Error updating station:', error);
    alert('Failed to update the station. Please try again.');
  }
};




// When map loads, keep reference
// const onMapLoad = (mapInstance: google.maps.Map) => {
//   setMap(mapInstance);
// };


  return (
    <div style={{
    height: '100vh',         // full viewport height
    overflowY: 'auto',       // vertical scroll if content overflows
    padding: '20px',         // add padding around content (adjust as needed)
    boxSizing: 'border-box', // include padding in the height calculation
    backgroundColor: '#f9f9f9' // optional: a light background for better spacing feel
  }}>
<h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Police Stations</h2>
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
    setCurrentCoords(defaultCoords);
    setMapLocation(defaultLocationName);
    setSelectedStation(null);
  }}
  style={{
    background: 'linear-gradient(90deg, #0056b3, #007BFF, #3399FF)',
    color: '#fff',
    marginBottom:'5px',
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
  onMouseEnter={e => {
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 123, 255, 0.8)';
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.animation = 'shine 1.5s linear infinite';
    e.currentTarget.style.backgroundSize = '200% 100%';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 123, 255, 0.5)';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.animation = 'none';
    e.currentTarget.style.backgroundSize = '100% 100%';
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
        />
      ))}
{selectedStation && (
  <InfoWindow
    position={selectedStation.position}
    onCloseClick={handleCloseInfoWindow}
  >
    <div>
      <h4 className="font-bold">{selectedStation.name}</h4>
      <p>Location: {selectedStation.position.lat}, {selectedStation.position.lng}</p>
    </div>
  </InfoWindow>
)}

    </GoogleMap>
  </>
)}


<br/>
<div className="mb-4 flex justify-center">
  <input
    type="text"
    placeholder="Search by police station name"
    value={searchTerm}
     onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page on new search
  }}
    className="border border-gray-300 rounded px-4 py-2 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div className="flex items-center justify-center mt-4 space-x-2">
  <button
    onClick={goToPrevPage}
    disabled={currentPage === 1}
    className={`p-2 rounded-full border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
  >
    <ChevronLeft className="w-5 h-5" />
  </button>

  <span className="text-sm font-medium text-gray-700">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={goToNextPage}
    disabled={currentPage === totalPages}
    className={`p-2 rounded-full border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
  >
    <ChevronRight className="w-5 h-5" />
  </button>
</div>
<br></br>
<div className="max-h-[400px] overflow-y-auto overflow-x-auto shadow border border-gray-200 rounded-lg">
  <table className="min-w-full text-sm text-left text-gray-700">
    <thead className="bg-gray-100 uppercase text-xs font-medium">
      <tr>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">Location</th>
        <th className="px-4 py-2">Incharge</th>
        <th className="px-4 py-2">Contact</th>
        <th className="px-4 py-2">Jail Cap.</th>
        <th className="px-4 py-2">FIRs</th>
        <th className="px-4 py-2">CCTV</th>
        <th className="px-4 py-2">Weapons</th>
        <th className="px-4 py-2">Vehicles</th>
        <th className="px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentStations.map(station => (
        <tr key={station._id} className="border-t hover:bg-gray-50">
          <td className="px-4 py-2">{station.name}</td>
          <td className="px-4 py-2">{station.location}</td>
          <td className="px-4 py-2">{station.incharge}</td>
          <td className="px-4 py-2">{station.contact}</td>
          <td className="px-4 py-2">{station.jailCapacity}</td>
          <td className="px-4 py-2">{station.firsRegistered}</td>
          <td className="px-4 py-2">{station.cctvCameras}</td>
          <td className="px-4 py-2">
            {station.weapons && station.weapons.length > 0
              ? station.weapons.join(", ")
              : "None"}
          </td>
          <td className="px-4 py-2">
            {station.vehicles && station.vehicles.length > 0
              ? station.vehicles.join(", ")
              : "None"}
          </td>
          <td className="px-4 py-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleEdit(station)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(station._id)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
      {currentStations.length === 0 && (
        <tr>
          <td colSpan={10} className="text-center p-4 text-gray-500">
            No stations found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


    <br/>
    <br/>

      {/* Edit Modal */}
{editStation && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Station</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">Station Name</label>
          <input
            name="name"
            placeholder="Station Name"
            value={editStation.name}
            readOnly
            onChange={(e) =>
              setEditStation((prev: any) => ({ ...prev, name: e.target.value }))
            }
            className="border p-2 rounded bg-gray-100 cursor-not-allowed w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            name="location"
            placeholder="Location"
            value={editStation.location}
            readOnly
            onChange={handleLocationChange}
            className="border p-2 rounded bg-gray-100 cursor-not-allowed w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Incharge</label>
          <input
            name="incharge"
            placeholder="Incharge"
            value={editStation.incharge}
            onChange={(e) =>
              setEditStation((prev: any) => ({ ...prev, incharge: e.target.value }))
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Contact</label>
          <input
            name="contact"
            placeholder="Contact"
            value={editStation.contact}
            onChange={(e) =>
              setEditStation((prev: any) => ({ ...prev, contact: e.target.value }))
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Jail Capacity</label>
          <input
            name="jailCapacity"
            placeholder="Jail Capacity"
            value={editStation.jailCapacity}
            onChange={(e) =>
              setEditStation((prev: any) => ({ ...prev, jailCapacity: e.target.value }))
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">FIRs Registered</label>
          <input
            name="firsRegistered"
            placeholder="FIRs Registered"
            value={editStation.firsRegistered}
            onChange={(e) =>
              setEditStation((prev: any) => ({ ...prev, firsRegistered: e.target.value }))
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">CCTV Cameras</label>
          <input
            name="cctvCameras"
            placeholder="CCTV Cameras"
            value={editStation.cctvCameras}
            onChange={(e) =>
              setEditStation((prev: any) => ({ ...prev, cctvCameras: e.target.value }))
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

<br></br>
<div className="mb-4">
  <label className="block font-semibold mb-2">Weapons</label>
  <div className="flex flex-wrap gap-3">
    {weaponsList.map((weapon) => (
      <label key={weapon} className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          value={weapon}
          checked={editStation?.weapons?.includes(weapon) || false}
          onChange={(e) => {
            const checked = e.target.checked;
            setEditStation((prev: PoliceStationType | null) => {
              if (!prev) return prev;
              let newWeapons = prev.weapons ? [...prev.weapons] : [];
              if (checked) {
                if (!newWeapons.includes(weapon)) newWeapons.push(weapon);
              } else {
                newWeapons = newWeapons.filter((w) => w !== weapon);
              }
              return { ...prev, weapons: newWeapons };
            });
          }}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
        <span>{weapon}</span>
      </label>
    ))}
  </div>
</div>
<div className="mb-4">
  <label className="block font-semibold mb-2">Vehicles</label>
  <div className="flex flex-wrap gap-3">
    {vehiclesList.map((vehicle) => (
      <label key={vehicle} className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          value={vehicle}
          checked={editStation?.vehicles?.includes(vehicle) || false}
          onChange={(e) => {
            const checked = e.target.checked;
            setEditStation((prev: PoliceStationType | null) => {
              if (!prev) return prev;
              let newVehicles = prev.vehicles ? [...prev.vehicles] : [];
              if (checked) {
                if (!newVehicles.includes(vehicle)) newVehicles.push(vehicle);
              } else {
                newVehicles = newVehicles.filter((v) => v !== vehicle);
              }
              return { ...prev, vehicles: newVehicles };
            });
          }}
          className="form-checkbox h-4 w-4 text-green-600"
        />
        <span>{vehicle}</span>
      </label>
    ))}
  </div>
</div>

      </div>

      <div>
        <label className="block font-semibold mb-2">Google Map (Live)</label>
        <div
          onClick={handleMapClick}
          className="w-full h-64 border rounded overflow-hidden cursor-pointer"
        >
          <iframe
  title="Google Map"
  src={`https://maps.google.com/maps?q=${
    currentCoords?.lat && currentCoords?.lng
      ? `${currentCoords.lat},${currentCoords.lng}`
      : encodeURIComponent(mapLocation || 'Pakistan')
  }&t=&z=13&ie=UTF8&iwloc=A&output=embed`}
  width="100%"
  height="100%"
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  style={{ pointerEvents: 'auto' }}
></iframe>

        </div>
        <small className="text-gray-500 mt-1 block">
          * Click on the map is disabled due to iframe restrictions. Please change location manually.
        </small>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setEditStation(null)}
          className="px-4 py-2 border rounded text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
          e.currentTarget.style.backgroundColor = '#b91c1c';
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
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
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
        Are you sure you want to delete this station? This action cannot be undone.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteStationId(null);
          }}
          className="px-4 py-2 border rounded text-gray-700"
          style={{
            animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
            opacity: 0,
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb'; // gray-200
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Cancel
        </button>

        <button
          onClick={confirmDeleteStation}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          style={{
            animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
            opacity: 0,
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#b91c1c';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.transform = 'scale(1)';
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
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
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
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        style={{
          animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
          opacity: 0,
          transition: 'background-color 0.3s ease, transform 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#15803d';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#16a34a';
          e.currentTarget.style.transform = 'scale(1)';
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
  );
}
