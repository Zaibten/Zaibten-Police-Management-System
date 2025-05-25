import React, { useEffect, useState} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleMap, Marker, useLoadScript, InfoWindow  } from '@react-google-maps/api';


export default function Stations() {
  const [modalVisible, setModalVisible] = React.useState(false);
  
 

const [stations, setStations] = useState([
  { id: 1, name: 'Central Police Station', location: 'House #12, Abdullah Haroon Rd, Saddar, Karachi', incharge: 'SP Muhammad Ali', contact: '021-34561234', jailCapacity: 50, firsRegistered: 120, cctvCameras: 20 },
  { id: 2, name: 'North Police Station', location: 'Building #45, Hashim Raza Rd, Model Colony, Karachi', incharge: 'SP Ayesha Khan', contact: '021-34567890', jailCapacity: 30, firsRegistered: 80, cctvCameras: 10 },
  { id: 3, name: 'East Police Station', location: 'Plot #23, University Rd, Gulshan-e-Iqbal, Karachi', incharge: 'SP Tariq Javed', contact: '021-34987654', jailCapacity: 40, firsRegistered: 100, cctvCameras: 15 },
  { id: 4, name: 'West Police Station', location: 'House #67, Orangi Town Sector 11, Karachi', incharge: 'SP Sana Mirza', contact: '021-34876543', jailCapacity: 35, firsRegistered: 90, cctvCameras: 18 },
  { id: 5, name: 'South Police Station', location: 'Building #9, Khayaban-e-Seher, Clifton, Karachi', incharge: 'SP Imran Shah', contact: '021-34445566', jailCapacity: 45, firsRegistered: 110, cctvCameras: 22 },
  { id: 6, name: 'Defence Police Station', location: 'Plot #88, DHA Phase 5, Karachi', incharge: 'SP Faiza Malik', contact: '021-34771222', jailCapacity: 50, firsRegistered: 95, cctvCameras: 25 },
  { id: 7, name: 'Malir Police Station', location: 'House #101, Malir Cantt, Karachi', incharge: 'SP Zahid Hussain', contact: '021-34889900', jailCapacity: 40, firsRegistered: 85, cctvCameras: 17 },
  { id: 8, name: 'Korangi Police Station', location: 'Plot #55, Korangi Industrial Area, Karachi', incharge: 'SP Nadia Qureshi', contact: '021-34998877', jailCapacity: 38, firsRegistered: 78, cctvCameras: 14 },
  { id: 9, name: 'Landhi Police Station', location: 'House #33, Landhi No. 3, Karachi', incharge: 'SP Arif Malik', contact: '021-34112233', jailCapacity: 33, firsRegistered: 70, cctvCameras: 12 },
  { id: 10, name: 'Gulberg Police Station', location: 'Plot #12, Gulberg Town, Karachi', incharge: 'SP Saira Jamil', contact: '021-34223344', jailCapacity: 37, firsRegistered: 73, cctvCameras: 16 },
  { id: 11, name: 'Nazimabad Police Station', location: 'House #20, Nazimabad Sector 5, Karachi', incharge: 'SP Hassan Raza', contact: '021-34334455', jailCapacity: 44, firsRegistered: 88, cctvCameras: 19 },
  { id: 12, name: 'Liaquatabad Police Station', location: 'Building #15, Liaquatabad Town, Karachi', incharge: 'SP Maria Farooq', contact: '021-34445566', jailCapacity: 36, firsRegistered: 77, cctvCameras: 13 },
  { id: 13, name: 'Shah Faisal Police Station', location: 'Plot #70, Shah Faisal Colony, Karachi', incharge: 'SP Kamran Ali', contact: '021-34556677', jailCapacity: 42, firsRegistered: 90, cctvCameras: 21 },
  { id: 14, name: 'SITE Police Station', location: 'House #44, SITE Area, Karachi', incharge: 'SP Amna Siddiqui', contact: '021-34667788', jailCapacity: 48, firsRegistered: 105, cctvCameras: 23 },
  { id: 15, name: 'Airport Police Station', location: 'Building #2, Near Jinnah Airport, Karachi', incharge: 'SP Imran Khan', contact: '021-34778899', jailCapacity: 30, firsRegistered: 65, cctvCameras: 10 },
  { id: 16, name: 'Lyari Police Station', location: 'Plot #60, Lyari, Karachi', incharge: 'SP Asma Iqbal', contact: '021-34889900', jailCapacity: 50, firsRegistered: 95, cctvCameras: 18 },
  { id: 17, name: 'Garden Police Station', location: 'House #11, Garden East, Karachi', incharge: 'SP Bilal Ahmed', contact: '021-34990011', jailCapacity: 39, firsRegistered: 79, cctvCameras: 15 },
  { id: 18, name: 'Gulistan Police Station', location: 'Building #5, Gulistan-e-Johar, Karachi', incharge: 'SP Nadia Hussain', contact: '021-34001122', jailCapacity: 43, firsRegistered: 82, cctvCameras: 20 },
  { id: 19, name: 'New Karachi Police Station', location: 'Plot #78, New Karachi Town, Karachi', incharge: 'SP Raza Ali', contact: '021-34112233', jailCapacity: 34, firsRegistered: 68, cctvCameras: 11 },
  { id: 20, name: 'Manzoor Colony Police Station', location: 'House #22, Manzoor Colony, Karachi', incharge: 'SP Saima Bano', contact: '021-34223344', jailCapacity: 29, firsRegistered: 60, cctvCameras: 9 },
  { id: 21, name: 'PECHS Police Station', location: 'Building #10, PECHS Block 6, Karachi', incharge: 'SP Tariq Mahmood', contact: '021-34334455', jailCapacity: 37, firsRegistered: 72, cctvCameras: 13 },
  { id: 22, name: 'Shahrah-e-Faisal Police Station', location: 'Plot #36, Shahrah-e-Faisal, Karachi', incharge: 'SP Kiran Fatima', contact: '021-34445566', jailCapacity: 41, firsRegistered: 86, cctvCameras: 19 },
  { id: 23, name: 'Mehmoodabad Police Station', location: 'House #29, Mehmoodabad, Karachi', incharge: 'SP Zain Ul Abidin', contact: '021-34556677', jailCapacity: 32, firsRegistered: 69, cctvCameras: 11 },
  { id: 24, name: 'Faisal Cantonment Police Station', location: 'Plot #80, Faisal Base, Karachi', incharge: 'SP Sanaullah Khan', contact: '021-34667788', jailCapacity: 49, firsRegistered: 108, cctvCameras: 22 },
  { id: 25, name: 'Shah Latif Police Station', location: 'House #17, Shah Latif Town, Karachi', incharge: 'SP Shazia Malik', contact: '021-34778899', jailCapacity: 28, firsRegistered: 55, cctvCameras: 8 },
  { id: 26, name: 'Bin Qasim Police Station', location: 'Building #66, Bin Qasim Town, Karachi', incharge: 'SP Faisal Qureshi', contact: '021-34889900', jailCapacity: 46, firsRegistered: 97, cctvCameras: 18 },
  { id: 27, name: 'Model Colony Police Station', location: 'Plot #21, Model Colony, Karachi', incharge: 'SP Maryam Zahid', contact: '021-34990011', jailCapacity: 40, firsRegistered: 84, cctvCameras: 14 },
  { id: 28, name: 'Safoora Police Station', location: 'House #14, Safoora Goth, Karachi', incharge: 'SP Kamal Ahmed', contact: '021-34001122', jailCapacity: 35, firsRegistered: 74, cctvCameras: 16 },
  { id: 29, name: 'University Road Police Station', location: 'Building #9, University Road, Karachi', incharge: 'SP Adeel Riaz', contact: '021-34112233', jailCapacity: 44, firsRegistered: 91, cctvCameras: 20 },
  { id: 30, name: 'Ancholi Police Station', location: 'Plot #50, Ancholi, Karachi', incharge: 'SP Saba Qureshi', contact: '021-34223344', jailCapacity: 31, firsRegistered: 66, cctvCameras: 12 },
]);


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
const [, setMap] = useState<google.maps.Map | null>(null);



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
  if (editStation) {
    if (!editStation.location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setCurrentCoords({ lat: latitude, lng: longitude });
            const locName = await reverseGeocode(latitude, longitude);
            setEditStation((prev: any) => ({ ...prev, location: locName || '' }));
            setMapLocation(locName || `${latitude},${longitude}`);
          },
          () => {
            setMapLocation(editStation.location || '');
          }
        );
      } else {
        setMapLocation(editStation.location || '');
      }
    } else {
      setMapLocation(editStation.location);
    }
  }
}, [editStation]);

  // Reverse geocode function to get location name from lat/lng
  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.error('Reverse geocode failed:', error);
    }
    return null;
  }

  // Geocode function to get lat/lng from location name (used to generate map link)
  async function geocode(location: string) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].geometry.location;
      }
    } catch (error) {
      console.error('Geocode failed:', error);
    }
    return null;
  }
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
  const geocodeStations = async () => {
    if (!isLoaded) return;

    const newMarkers = await Promise.all(
      stations.map(async (station) => {
        const coords = await geocode(station.location);
        if (coords) {
          return {
            id: station.id,
            name: station.name,
            position: coords,
          };
        }
        return null;
      })
    );

    setMarkers(newMarkers.filter((m) => m !== null) as any[]);
  };

  geocodeStations();
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

    alert(
      'Map clicks are not supported on the embedded map due to iframe limitations. Please type the location in the textbox.'
    );
  };

  const handleEdit = (station: any) => {
    setEditStation({ ...station });
    setMapLocation(station.location);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this station?');
    if (confirmDelete) {
      setStations((prev) => prev.filter((station) => station.id !== id));
    }
  };

const handleUpdate = () => {
  const {
    name,
    location,
    incharge,
    contact,
    jailCapacity,
    firsRegistered,
    cctvCameras,
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

  setStations((prev) =>
    prev.map((station) => (station.id === editStation.id ? editStation : station))
  );
  setEditStation(null);

  // Show success modal
  setModalVisible(true);
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
{/* Google Map */}
    {isLoaded && (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        onLoad={(mapInstance) => setMap(mapInstance)}
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
              <h4>{selectedStation.name}</h4>
              {/* You can add more info about the station here */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    )}
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
        <th className="px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentStations.map(station => (
        <tr key={station.id} className="border-t hover:bg-gray-50">
          <td className="px-4 py-2">{station.name}</td>
          <td className="px-4 py-2">{station.location}</td>
          <td className="px-4 py-2">{station.incharge}</td>
          <td className="px-4 py-2">{station.contact}</td>
          <td className="px-4 py-2">{station.jailCapacity}</td>
          <td className="px-4 py-2">{station.firsRegistered}</td>
          <td className="px-4 py-2">{station.cctvCameras}</td>
        <td className="px-4 py-2 flex flex-wrap items-center gap-2">
  <button
    onClick={() => handleEdit(station)}
    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(station.id)}
    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
  >
    Delete
  </button>
</td>

        </tr>
      ))}
      {stations.length === 0 && (
        <tr>
          <td colSpan={8} className="text-center p-4 text-gray-500">
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
              currentCoords
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

    </div>
  );
}
