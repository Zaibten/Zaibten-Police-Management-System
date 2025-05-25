import React, { useState} from 'react';

const ranksList = [
  'Constable',
  'Head Constable',
  'Assistant Sub-Inspector',
  'Sub-Inspector',
  'Inspector',
  'Assistant Superintendent',
  'Superintendent',
];

const genders = ['Male', 'Female', 'Other'];

const statusList = ['Active', 'On Leave', 'Suspended', 'Retired'];

// Example weapons and vehicles, replace with real-time fetch if available
const weaponsList = ['Pistol', 'Rifle', 'Taser', 'Baton', 'Shotgun'];
const vehiclesList = ['Motorcycle', 'Patrol Car', 'Van', 'Bicycle'];

const policeStationsList = [
  'Central Station',
  'North Station',
  'East Station',
  'South Station',
  'West Station',
]; // Ideally fetched from backend API

const AddConstablePage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    rank: '',
    badgeNumber: '',
    dob: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    policeStation: '',
    joiningDate: '',
    status: '',
    qualification: '',
    weapons: [] as string[],
    vehicles: [] as string[],
    remarks: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
//   const mapRef = useRef<HTMLDivElement>(null); // for map if needed

  // Generic input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Checkbox handler for weapons and vehicles
//   const handleCheckboxChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     list: string[],
//     setter: React.Dispatch<React.SetStateAction<string[]>>
//   ) => {
//     const { value, checked } = e.target;
//     if (checked) setter([...list, value]);
//     else setter(list.filter((item) => item !== value));
//   };

  // Submit handler (validation example)
  const handleSubmit = () => {
    let validationErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) validationErrors.fullName = 'Full Name is required';
    if (!formData.rank) validationErrors.rank = 'Rank is required';
    if (!formData.badgeNumber.trim()) validationErrors.badgeNumber = 'Badge Number is required';
    if (!formData.dob) validationErrors.dob = 'Date of Birth is required';
    if (!formData.gender) validationErrors.gender = 'Gender is required';
    if (!formData.contactNumber.trim()) validationErrors.contactNumber = 'Contact Number is required';
    if (!formData.policeStation) validationErrors.policeStation = 'Police Station is required';
    if (!formData.joiningDate) validationErrors.joiningDate = 'Joining Date is required';
    if (!formData.status) validationErrors.status = 'Status is required';
    if (formData.weapons.length === 0) validationErrors.weapons = 'At least one weapon must be assigned';
    if (formData.vehicles.length === 0) validationErrors.vehicles = 'At least one vehicle must be assigned';

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Submit form data to backend
      console.log('Submitting form:', formData);
      alert('Constable added successfully!');
      // reset or redirect here
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Add Constable</h2>

      <div className="space-y-6">
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="fullName" className="mb-1 font-semibold text-gray-700">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Rank Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="rank" className="mb-1 font-semibold text-gray-700">
                Rank <span className="text-red-600">*</span>
              </label>
              <select
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.rank ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Rank</option>
                {ranksList.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
              {errors.rank && <p className="text-red-600 text-sm mt-1">{errors.rank}</p>}
            </div>

            {/* Badge Number */}
            <div className="flex flex-col">
              <label htmlFor="badgeNumber" className="mb-1 font-semibold text-gray-700">
                Badge Number <span className="text-red-600">*</span>
              </label>
              <input
                id="badgeNumber"
                name="badgeNumber"
                type="text"
                placeholder="Enter badge number"
                value={formData.badgeNumber}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.badgeNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.badgeNumber && <p className="text-red-600 text-sm mt-1">{errors.badgeNumber}</p>}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label htmlFor="dob" className="mb-1 font-semibold text-gray-700">
                Date of Birth <span className="text-red-600">*</span>
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob}</p>}
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label htmlFor="gender" className="mb-1 font-semibold text-gray-700">
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
            </div>

            {/* Contact Number */}
            <div className="flex flex-col">
              <label htmlFor="contactNumber" className="mb-1 font-semibold text-gray-700">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                placeholder="03XXXXXXXXX"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contactNumber && <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-semibold text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 border-gray-300"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label htmlFor="address" className="mb-1 font-semibold text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Enter full address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 border-gray-300"
              ></textarea>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Police Station Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="policeStation" className="mb-1 font-semibold text-gray-700">
                Police Station <span className="text-red-600">*</span>
              </label>
              <select
                id="policeStation"
                name="policeStation"
                value={formData.policeStation}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.policeStation ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Police Station</option>
                {policeStationsList.map((ps) => (
                  <option key={ps} value={ps}>
                    {ps}
                  </option>
                ))}
              </select>
              {errors.policeStation && <p className="text-red-600 text-sm mt-1">{errors.policeStation}</p>}
            </div>

            {/* Date of Joining */}
            <div className="flex flex-col">
              <label htmlFor="joiningDate" className="mb-1 font-semibold text-gray-700">
                Date of Joining <span className="text-red-600">*</span>
              </label>
              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.joiningDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.joiningDate && <p className="text-red-600 text-sm mt-1">{errors.joiningDate}</p>}
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="status" className="mb-1 font-semibold text-gray-700">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Status</option>
                {statusList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* Qualification */}
            <div className="flex flex-col">
              <label htmlFor="qualification" className="mb-1 font-semibold text-gray-700">
                Qualification
              </label>
              <input
                id="qualification"
                name="qualification"
                type="text"
                placeholder="Enter qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 border-gray-300"
              />
            </div>

            {/* Weapons Assigned */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">
                Weapons Assigned <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {weaponsList.map((weapon) => (
                  <label key={weapon} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="weapons"
                      value={weapon}
                      checked={formData.weapons.includes(weapon)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => {
                          const currentWeapons = prev.weapons;
                          if (checked) return { ...prev, weapons: [...currentWeapons, weapon] };
                          else return { ...prev, weapons: currentWeapons.filter((w) => w !== weapon) };
                        });
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">{weapon}</span>
                  </label>
                ))}
              </div>
              {errors.weapons && <p className="text-red-600 text-sm mt-1">{errors.weapons}</p>}
            </div>

            {/* Vehicles Assigned */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">
                Vehicles Assigned <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {vehiclesList.map((vehicle) => (
                  <label key={vehicle} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="vehicles"
                      value={vehicle}
                      checked={formData.vehicles.includes(vehicle)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => {
                          const currentVehicles = prev.vehicles;
                          if (checked) return { ...prev, vehicles: [...currentVehicles, vehicle] };
                          else return { ...prev, vehicles: currentVehicles.filter((v) => v !== vehicle) };
                        });
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">{vehicle}</span>
                  </label>
                ))}
              </div>
              {errors.vehicles && <p className="text-red-600 text-sm mt-1">{errors.vehicles}</p>}
            </div>

            {/* Remarks */}
            <div className="flex flex-col">
              <label htmlFor="remarks" className="mb-1 font-semibold text-gray-700">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                placeholder="Additional remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 border-gray-300"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded shadow"
          >
            Add Constable
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddConstablePage;
