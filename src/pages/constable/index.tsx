import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ConstablePage() {
  const [modalVisible, setModalVisible] = React.useState(false);

  // Hardcoded constable data with given fields
  const [constables, setConstables] = useState([
    { id: 1, firstName: 'Ali', lastName: 'Khan', dob: '1990-05-15', gender: 'Male', contact: '03001234567', cnic: '42101-1234567-1', religion: 'Islam', nationality: 'Pakistani', domicile: 'Sindh', rank: 'Constable', station: 'Central Police Station', dateOfJoining: '2015-08-01', address: '123 Street, Karachi', status: 'Active' },
    { id: 2, firstName: 'Sara', lastName: 'Ahmed', dob: '1987-11-22', gender: 'Female', contact: '03007654321', cnic: '42101-7654321-2', religion: 'Islam', nationality: 'Pakistani', domicile: 'Punjab', rank: 'Head Constable', station: 'North Police Station', dateOfJoining: '2012-04-15', address: '456 Avenue, Lahore', status: 'Active' },
    { id: 3, firstName: 'Faisal', lastName: 'Raza', dob: '1992-01-10', gender: 'Male', contact: '03009871234', cnic: '42101-9871234-3', religion: 'Islam', nationality: 'Pakistani', domicile: 'KPK', rank: 'Assistant Sub-Inspector', station: 'East Police Station', dateOfJoining: '2017-01-10', address: '789 Road, Peshawar', status: 'Active' },
    { id: 4, firstName: 'Hina', lastName: 'Malik', dob: '1995-07-08', gender: 'Female', contact: '03004561234', cnic: '42101-4561234-4', religion: 'Islam', nationality: 'Pakistani', domicile: 'Balochistan', rank: 'Constable', station: 'West Police Station', dateOfJoining: '2018-06-20', address: '321 Lane, Quetta', status: 'Inactive' },
    { id: 5, firstName: 'Ahmed', lastName: 'Shah', dob: '1989-09-25', gender: 'Male', contact: '03006543210', cnic: '42101-6543210-5', religion: 'Islam', nationality: 'Pakistani', domicile: 'Sindh', rank: 'Sub-Inspector', station: 'South Police Station', dateOfJoining: '2014-03-05', address: '654 Street, Karachi', status: 'Active' },
  ]);

  const [editConstable, setEditConstable] = useState<any>(null);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(constables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentConstables = constables.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleEdit = (constable: any) => {
    setEditConstable({ ...constable });
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this constable?');
    if (confirmDelete) {
      setConstables((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleUpdate = () => {
    // Basic validation for required fields - you can expand as needed
    if (
      !editConstable.firstName?.trim() ||
      !editConstable.lastName?.trim() ||
      !editConstable.contact?.trim() ||
      !editConstable.cnic?.trim() ||
      !editConstable.rank?.trim() ||
      !editConstable.station?.trim()
    ) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    setConstables((prev) =>
      prev.map((c) => (c.id === editConstable.id ? editConstable : c))
    );
    setEditConstable(null);
    setModalVisible(true);
  };

  return (
    <div style={{
    height: '100vh',         // full viewport height
    overflowY: 'auto',       // vertical scroll if content overflows
    padding: '20px',         // add padding around content (adjust as needed)
    boxSizing: 'border-box', // include padding in the height calculation
    backgroundColor: '#f9f9f9' // optional: a light background for better spacing feel
  }}>
<h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Constables</h2>

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
           <tr>
              {/* <th scope="col" className="px-4 py-2">
                #
              </th> */}
              <th scope="col" className="px-4 py-2">
                First Name
              </th>
              <th scope="col" className="px-4 py-2">
                Last Name
              </th>
              <th scope="col" className="px-4 py-2">
                DOB
              </th>
              <th scope="col" className="px-4 py-2">
                Gender
              </th>
              <th scope="col" className="px-4 py-2">
                Contact
              </th>
              <th scope="col" className="px-4 py-2">
                CNIC
              </th>
              <th scope="col" className="px-4 py-2">
                Religion
              </th>
              <th scope="col" className="px-4 py-2">
                Nationality
              </th>
              <th scope="col" className="px-4 py-2">
                Domicile
              </th>
              <th scope="col" className="px-4 py-2">
                Rank
              </th>
              <th scope="col" className="px-4 py-2">
                Station
              </th>
              <th scope="col" className="px-4 py-2">
                Date Of Joining
              </th>
              <th scope="col" className="px-4 py-2">
                Address
              </th>
              <th scope="col" className="px-4 py-2">
                Status
              </th>
              <th scope="col" className="px-4 py-2">
                Actions
              </th>
            </tr>
        <th className="px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
      {currentConstables.map((constable) => (
        <tr key={constable.id} className="hover:bg-gray-50">
           <tr key={constable.id} className="hover:bg-gray-50">
                {/* <td className="px-4 py-3 font-medium text-gray-900">{constable.id}</td> */}
                <td className="px-4 py-3">{constable.firstName}</td>
                <td className="px-4 py-3">{constable.lastName}</td>
                <td className="px-4 py-3">{constable.dob}</td>
                <td className="px-4 py-3">{constable.gender}</td>
                <td className="px-4 py-3">{constable.contact}</td>
                <td className="px-4 py-3">{constable.cnic}</td>
                <td className="px-4 py-3">{constable.religion}</td>
                <td className="px-4 py-3">{constable.nationality}</td>
                <td className="px-4 py-3">{constable.domicile}</td>
                <td className="px-4 py-3">{constable.rank}</td>
                <td className="px-4 py-3">{constable.station}</td>
                <td className="px-4 py-3">{constable.dateOfJoining}</td>
                <td className="px-4 py-3">{constable.address}</td>
                <td className="px-4 py-3">{constable.status}</td>
                <td className="px-4 py-3 space-x-2">
                  
                  
                </td>
              </tr>
          <td className="px-4 py-3">
            {/* Responsive flex container for buttons */}
            <div className="flex flex-wrap gap-2 justify-start sm:justify-center">
              <button
                onClick={() => handleEdit(constable)}
                className="flex-1 min-w-[80px] rounded bg-yellow-400 px-3 py-1 text-sm font-semibold text-black shadow-sm hover:bg-yellow-500
                  sm:flex-none sm:px-4 sm:py-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(constable.id)}
                className="flex-1 min-w-[80px] rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-700
                  sm:flex-none sm:px-4 sm:py-2"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Edit Modal */}
      {editConstable && (
        <dialog open className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Constable</h3>
      <form
  onSubmit={(e) => {
    e.preventDefault();
    handleUpdate();
  }}
>
  <div className="grid grid-cols-2 gap-4">
    <input
      type="text"
      placeholder="First Name"
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.firstName}
      onChange={(e) => setEditConstable({ ...editConstable, firstName: e.target.value })}
      required
    />
    <input
      type="text"
      placeholder="Last Name"
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.lastName}
      onChange={(e) => setEditConstable({ ...editConstable, lastName: e.target.value })}
      required
    />
    <input
      type="date"
      placeholder="DOB"
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.dob}
      onChange={(e) => setEditConstable({ ...editConstable, dob: e.target.value })}
    />

    {/* Gender LOV */}
    <select
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.gender}
      onChange={(e) => setEditConstable({ ...editConstable, gender: e.target.value })}
      required
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      {/* Add more if needed */}
    </select>

    <input
      type="text"
      placeholder="Contact"
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.contact}
      onChange={(e) => setEditConstable({ ...editConstable, contact: e.target.value })}
      required
    />
    <input
      type="text"
      placeholder="CNIC"
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.cnic}
      onChange={(e) => setEditConstable({ ...editConstable, cnic: e.target.value })}
      required
    />

    {/* Religion LOV example */}
    <select
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.religion}
      onChange={(e) => setEditConstable({ ...editConstable, religion: e.target.value })}
    >
      <option value="">Select Religion</option>
      <option value="Islam">Islam</option>
      <option value="Christianity">Christianity</option>
      <option value="Hinduism">Hinduism</option>
      <option value="Other">Other</option>
    </select>

    {/* Nationality LOV example */}
    <select
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.nationality}
      onChange={(e) => setEditConstable({ ...editConstable, nationality: e.target.value })}
    >
      <option value="">Select Nationality</option>
      <option value="Pakistani">Pakistani</option>
      <option value="Indian">Indian</option>
      <option value="Other">Other</option>
    </select>

    {/* Domicile LOV example */}
    <select
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.domicile}
      onChange={(e) => setEditConstable({ ...editConstable, domicile: e.target.value })}
    >
      <option value="">Select Domicile</option>
      <option value="Punjab">Punjab</option>
      <option value="Sindh">Sindh</option>
      <option value="KPK">KPK</option>
      <option value="Balochistan">Balochistan</option>
      <option value="Gilgit Baltistan">Gilgit Baltistan</option>
    </select>

    {/* Rank LOV - replace options with your actual ranks */}
    <select
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.rank}
      onChange={(e) => setEditConstable({ ...editConstable, rank: e.target.value })}
      required
    >
      <option value="">Select Rank</option>
      <option value="Constable">Constable</option>
      <option value="Head Constable">Head Constable</option>
      <option value="Assistant Sub-Inspector">Assistant Sub-Inspector</option>
      <option value="Sub-Inspector">Sub-Inspector</option>
      <option value="Inspector">Inspector</option>
      <option value="Sub-Divisional Officer">Sub-Divisional Officer</option>
      {/* add more if needed */}
    </select>

    {/* Station LOV - replace with actual stations */}
    <select
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.station}
      onChange={(e) => setEditConstable({ ...editConstable, station: e.target.value })}
      required
    >
      <option value="">Select Station</option>
      <option value="Station A">Station A</option>
      <option value="Station B">Station B</option>
      <option value="Station C">Station C</option>
      {/* add your stations here */}
    </select>

    <input
      type="date"
      placeholder="Date Of Joining"
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.dateOfJoining}
      onChange={(e) => setEditConstable({ ...editConstable, dateOfJoining: e.target.value })}
    />
    <input
      type="text"
      placeholder="Address"
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.address}
      onChange={(e) => setEditConstable({ ...editConstable, address: e.target.value })}
    />

    {/* Status LOV */}
    <select
      className="w-full rounded border border-gray-300 px-3 py-2"
      value={editConstable.status}
      onChange={(e) => setEditConstable({ ...editConstable, status: e.target.value })}
      required
    >
      <option value="">Select Status</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>

  <div className="mt-6 flex justify-end space-x-3">
    <button
      type="button"
      className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
      onClick={() => setEditConstable(null)}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Update
    </button>
  </div>
</form>

          </div>
        </dialog>
      )}

      {/* Modal confirmation */}
      {modalVisible && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setModalVisible(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded bg-white p-6 shadow-lg"
          >
            <p className="mb-4 text-center text-green-600">Constable updated successfully!</p>
            <button
              onClick={() => setModalVisible(false)}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
