import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ConstablePage() {


  const ranksList = [
  'Constable', 'Head Constable', 'Assistant Sub-Inspector',
  'Sub-Inspector', 'Inspector', 'Assistant Superintendent', 'Superintendent',
];

const genders = ['Male', 'Female', 'Other'];
const statusList = ['Active', 'On Leave', 'Suspended', 'Retired'];
const weaponsList = ['Pistol', 'Rifle', 'Taser', 'Baton', 'Shotgun'];
const vehiclesList = ['Motorcycle', 'Patrol Car', 'Van', 'Bicycle'];


  const [constables, setConstables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedConstable, setSelectedConstable] = useState<any | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
const [deleteConstableId, setDeleteConstableId] = React.useState<string | null>(null);
const [showSuccessModal, setShowSuccessModal] = React.useState(false);





  const handleEditClick = (constable: any) => {
  setSelectedConstable(constable);
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
  setSelectedConstable(null);
};

 const [itemsPerPage, setItemsPerPage] = React.useState(20);
  // const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
    async function fetchConstables() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/constablesdata');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConstables(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch constables');
      } finally {
        setLoading(false);
      }
    }

    fetchConstables();
  }, []);


const deleteConstable = (id: string) => {
  setDeleteConstableId(id);
  setShowDeleteModal(true);
};

const confirmDeleteConstable = async () => {
  if (!deleteConstableId) return;

  try {
    const response = await fetch(`http://localhost:5000/api/deleteconstables/${deleteConstableId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Delete failed');
    }

    // Remove from local state after successful deletion
    setConstables((prev) => prev.filter((c) => c._id !== deleteConstableId));
    setShowDeleteModal(false);
    setShowSuccessModal(true);
    setDeleteConstableId(null);
  } catch (err: any) {
    alert(err.message);
  }
};



  const [searchText, setSearchText] = useState('');
const filteredConstables = constables.filter((c) =>
  (c.fullName || '').toLowerCase().includes(searchText.toLowerCase())
);


const totalPages = Math.ceil(filteredConstables.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentConstables = filteredConstables.slice(startIndex, startIndex + itemsPerPage);





const updateConstable = async () => {
  if (!selectedConstable?._id) return;

  try {
    const response = await fetch(`http://localhost:5000/api/updateconstables/${selectedConstable._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedConstable),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update failed');
    }

    const updated = await response.json();

    // Update constables state to reflect the update
    setConstables((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );

    setShowModal(false);
    setSelectedConstable(null);
    setSuccessModalVisible(true);
  } catch (err: any) {
    alert(err.message);
  }
};





  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };







  return (
    <div style={{ height: '100vh', overflowY: 'auto', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Constables</h2>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by full name"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

<div className="flex items-center justify-between mt-4 px-4">
  {/* Left side empty or you can put something here */}
  <div></div>

  {/* Pagination controls centered */}
  <div className="flex items-center space-x-2">
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

  {/* Right side: Items per page input */}
  <div className="flex items-center space-x-2">
    <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">
      Items per page:
    </label>
    <input
      id="itemsPerPage"
      type="number"
      min={1}
      value={itemsPerPage}
      onChange={e => setItemsPerPage(Number(e.target.value) || 20)}
      className="w-20 p-1 border rounded text-center"
    />
  </div>
</div>

      <br />

      {loading ? (
        <p className="text-center text-gray-600">Loading constables...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto overflow-x-auto shadow border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 uppercase text-xs font-medium">
              <tr>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Badge Number</th>
                <th className="px-4 py-2">DOB</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Contact Number</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Police Station</th>
                <th className="px-4 py-2">Joining Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Qualification</th>
                <th className="px-4 py-2">Weapons</th>
                <th className="px-4 py-2">Vehicles</th>
                <th className="px-4 py-2">Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {currentConstables.map((constable) => (
                <tr key={constable._id || constable.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{constable.fullName}</td>
                  <td className="px-4 py-3">{constable.rank}</td>
                  <td className="px-4 py-3">{constable.badgeNumber}</td>
                  <td className="px-4 py-3">{constable.dob}</td>
                  <td className="px-4 py-3">{constable.gender}</td>
                  <td className="px-4 py-3">{constable.contactNumber}</td>
                  <td className="px-4 py-3">{constable.email || '-'}</td>
                  <td className="px-4 py-3">{constable.address || '-'}</td>
                  <td className="px-4 py-3">{constable.policeStation}</td>
                  <td className="px-4 py-3">{constable.joiningDate}</td>
                  <td className="px-4 py-3">{constable.status}</td>
                  <td className="px-4 py-3">{constable.qualification || '-'}</td>
                  <td className="px-4 py-3">{(constable.weapons || []).join(', ') || '-'}</td>
                  <td className="px-4 py-3">{(constable.vehicles || []).join(', ') || '-'}</td>
                  <td className="px-4 py-3">{constable.remarks || '-'}</td>
                  <td className="px-4 py-2 flex flex-wrap items-center gap-2">
 <button
  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
  onClick={() => handleEditClick(constable)}
>
  Edit
</button>

  <button
  onClick={() => deleteConstable(constable._id)}
  
    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
  >
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
{showModal && selectedConstable && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
      <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center">Edit Constable</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={selectedConstable.fullName}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, fullName: e.target.value })
            } readOnly
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
 />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rank</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedConstable.rank}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, rank: e.target.value })
            }
          >
            {ranksList.map((rank) => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Badge Number</label>
          <input
            type="text"
            value={selectedConstable.badgeNumber}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, badgeNumber: e.target.value })
            }
           readOnly
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
  
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
          <input
            type="date"
            value={selectedConstable.dob}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, dob: e.target.value })
            }
            readOnly
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
  />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedConstable.gender}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, gender: e.target.value })
            }
          >
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            value={selectedConstable.contactNumber}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, contactNumber: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={selectedConstable.email || ''}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={selectedConstable.address || ''}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, address: e.target.value })
            }
            className="w-full h-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Police Station</label>
          <input
            type="text"
            value={selectedConstable.policeStation}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, policeStation: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Joining Date</label>
          <input
            type="date"
            value={selectedConstable.joiningDate}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, joiningDate: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedConstable.status}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, status: e.target.value })
            }
          >
            {statusList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Qualification</label>
          <input
            type="text"
            value={selectedConstable.qualification || ''}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, qualification: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Weapons as checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Weapons</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
            {weaponsList.map((weapon) => (
              <label key={weapon} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={weapon}
                  checked={selectedConstable.weapons?.includes(weapon) || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newWeapons = selectedConstable.weapons ? [...selectedConstable.weapons] : [];
                    if (checked) {
                      if (!newWeapons.includes(weapon)) newWeapons.push(weapon);
                    } else {
                      newWeapons = newWeapons.filter(w => w !== weapon);
                    }
                    setSelectedConstable({ ...selectedConstable, weapons: newWeapons });
                  }}
                  className="form-checkbox"
                />
                <span>{weapon}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Vehicles as checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicles</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
            {vehiclesList.map((vehicle) => (
              <label key={vehicle} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={vehicle}
                  checked={selectedConstable.vehicles?.includes(vehicle) || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newVehicles = selectedConstable.vehicles ? [...selectedConstable.vehicles] : [];
                    if (checked) {
                      if (!newVehicles.includes(vehicle)) newVehicles.push(vehicle);
                    } else {
                      newVehicles = newVehicles.filter(v => v !== vehicle);
                    }
                    setSelectedConstable({ ...selectedConstable, vehicles: newVehicles });
                  }}
                  className="form-checkbox"
                />
                <span>{vehicle}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            value={selectedConstable.remarks || ''}
            onChange={(e) =>
              setSelectedConstable({ ...selectedConstable, remarks: e.target.value })
            }
            className="w-full h-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={closeModal}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // validation logic here (unchanged)
            const {
              rank,
              badgeNumber,
              dob,
              gender,
              contactNumber,
              email,
              policeStation,
              joiningDate,
              status,
              weapons,
              vehicles,
            } = selectedConstable;

            if (
              !rank ||
              !badgeNumber ||
              !dob ||
              !gender ||
              !contactNumber ||
              !email ||
              !policeStation ||
              !joiningDate ||
              !status
            ) {
              alert("Please fill in all required fields.");
              return;
            }

            if (
              (!weapons || weapons.length === 0) ||
              (!vehicles || vehicles.length === 0)
            ) {
              alert("Please select at least one weapon or vehicle.");
              return;
            }
            updateConstable(); // 🔴 CALL the function here!
            closeModal();
            setShowModal(false);
            setSuccessModalVisible(true);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Update Constable
        </button>
      </div>
    </div>
  </div>
)}


{successModalVisible && (
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
        Constable Updated Successfully!
      </h2>

      <button
        onClick={() => setSuccessModalVisible(false)}
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
        Are you sure you want to delete this constable? This action cannot be undone.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteConstableId(null);
          }}
          className="px-4 py-2 border rounded text-gray-700"
          style={{
            animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
            opacity: 0,
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
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
          onClick={confirmDeleteConstable}
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

      <style>{`
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
      `}</style>
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
        ✅ Constable deleted successfully.
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

      <style>{`
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
      `}</style>
    </div>
  </div>
)}

    </div>
  );
}
