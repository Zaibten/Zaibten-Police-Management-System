import React, { useState, useEffect } from 'react'

const ranksList = [
  'Constable',
  'Head Constable',
  'Assistant Sub-Inspector',
  'Sub-Inspector',
  'Inspector',
  'Assistant Superintendent',
  'Superintendent',
]

const genders = ['Male', 'Female', 'Other']

const statusList = ['Active', 'On Leave', 'Suspended', 'Retired']

// Example weapons and vehicles, replace with real-time fetch if available
const weaponsList = ['Pistol', 'Rifle', 'Taser', 'Baton', 'Shotgun']
const vehiclesList = ['Motorcycle', 'Patrol Car', 'Van', 'Bicycle']

const AddConstablePage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
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
    imageFile: null as File | null, // Add this field for image
  })

  const [policeStationsList, setPoliceStationsList] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  


  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(
          'https://zaibtenpoliceserver.vercel.app/api/police-stationsfordropdown'
        )
        const data = await response.json()
        setPoliceStationsList(
          data.map((station: { name: string }) => station.name)
        )
      } catch (error) {
        console.error('Failed to fetch police stations:', error)
      }
    }

    fetchStations()
  }, [])

  const [errors, setErrors] = useState<Record<string, string>>({})
  //   const mapRef = useRef<HTMLDivElement>(null); // for map if needed

  // Generic input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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

  const handleWeaponsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      weapons: checked
        ? [...prev.weapons, value]
        : prev.weapons.filter((item) => item !== value),
    }))
  }

  const handleVehiclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      vehicles: checked
        ? [...prev.vehicles, value]
        : prev.vehicles.filter((item) => item !== value),
    }))
  }

  // Submit handler (validation example)
  const handleSubmit = async () => {
    let validationErrors: Record<string, string> = {}

    if (!formData.fullName.trim())
      validationErrors.fullName = 'Full Name is required'
    if (!formData.rank) validationErrors.rank = 'Rank is required'
    if (!formData.badgeNumber.trim())
      validationErrors.badgeNumber = 'Badge Number is required'
    if (!formData.dob) validationErrors.dob = 'Date of Birth is required'
    if (!formData.gender) validationErrors.gender = 'Gender is required'
    if (!formData.contactNumber.trim())
      validationErrors.contactNumber = 'Contact Number is required'
    if (!formData.policeStation)
      validationErrors.policeStation = 'Police Station is required'
    if (!formData.joiningDate)
      validationErrors.joiningDate = 'Joining Date is required'
    
    if (!formData.qualification.trim())
      validationErrors.qualification = 'Qualification is required'

    if (!formData.status) validationErrors.status = 'Status is required'
    if (formData.weapons.length === 0)
      validationErrors.weapons = 'At least one weapon must be assigned'
    if (formData.vehicles.length === 0)
      validationErrors.vehicles = 'At least one vehicle must be assigned'
if (!formData.imageFile) {
  validationErrors.imageFile = 'Station image is required.'
}


    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    try {
      const form = new FormData()

      form.append('fullName', formData.fullName)
      form.append('rank', formData.rank)
      form.append('badgeNumber', formData.badgeNumber)
      form.append('dob', formData.dob)
      form.append('gender', formData.gender)
      form.append('contactNumber', formData.contactNumber)
      form.append('email', formData.email || '')
      form.append('address', formData.address || '')
      form.append('policeStation', formData.policeStation)
      form.append('joiningDate', formData.joiningDate)
      form.append('status', formData.status)
      form.append('qualification', formData.qualification || '')
      form.append('remarks', formData.remarks || '')

      // Append image file if available
      if (formData.imageFile) {
        form.append('image', formData.imageFile)
      }

      // Convert arrays to JSON strings
      form.append('weapons', JSON.stringify(formData.weapons))
      form.append('vehicles', JSON.stringify(formData.vehicles))

      const response = await fetch('https://zaibtenpoliceserver.vercel.app/api/constables/', {
        method: 'POST',
        body: form, // No need to set Content-Type
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server validation errors:', errorData)
        setErrors((prev) => ({
          ...prev,
          server: errorData.message || 'Failed to add constable',
        }))
        return
      }

      const result = await response.json()
      console.log('Constable added successfully:', result)
      setModalVisible(true)
      setFormData({
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
        weapons: [],
        vehicles: [],
        remarks: '',
        imageFile: null,
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred while submitting the form.')
    }
  }

  return (
    <div className='h-screen overflow-y-auto bg-gray-50 p-6'>
      <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
        Add Constable
      </h2>

      <div className='space-y-6'>
        {/* Form Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Full Name */}
            <div className='flex flex-col'>
              <label
                htmlFor='fullName'
                className='mb-1 font-semibold text-gray-700'
              >
                Full Name <span className='text-red-600'>*</span>
              </label>
              <input
                id='fullName'
                name='fullName'
                type='text'
                placeholder='Enter full name'
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {/* Rank Dropdown */}
            <div className='flex flex-col'>
              <label
                htmlFor='rank'
                className='mb-1 font-semibold text-gray-700'
              >
                Rank <span className='text-red-600'>*</span>
              </label>
              <select
                id='rank'
                name='rank'
                value={formData.rank}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.rank ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>Select Rank</option>
                {ranksList.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
              {errors.rank && (
                <p className='mt-1 text-sm text-red-600'>{errors.rank}</p>
              )}
            </div>

            {/* Badge Number */}
            <div className='flex flex-col'>
              <label
                htmlFor='badgeNumber'
                className='mb-1 font-semibold text-gray-700'
              >
                Badge Number <span className='text-red-600'>*</span>
              </label>
              <input
                id='badgeNumber'
                name='badgeNumber'
                type='text'
                placeholder='Enter badge number'
                value={formData.badgeNumber}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.badgeNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.badgeNumber && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.badgeNumber}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className='flex flex-col'>
              <label htmlFor='dob' className='mb-1 font-semibold text-gray-700'>
                Date of Birth <span className='text-red-600'>*</span>
              </label>
              <input
                id='dob'
                name='dob'
                type='date'
                value={formData.dob}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && (
                <p className='mt-1 text-sm text-red-600'>{errors.dob}</p>
              )}
            </div>

            {/* Gender */}
            <div className='flex flex-col'>
              <label
                htmlFor='gender'
                className='mb-1 font-semibold text-gray-700'
              >
                Gender <span className='text-red-600'>*</span>
              </label>
              <select
                id='gender'
                name='gender'
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>Select Gender</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className='mt-1 text-sm text-red-600'>{errors.gender}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className='flex flex-col'>
              <label
                htmlFor='contactNumber'
                className='mb-1 font-semibold text-gray-700'
              >
                Contact Number <span className='text-red-600'>*</span>
              </label>
              <input
                id='contactNumber'
                name='contactNumber'
                type='text'
                placeholder='03XXXXXXXXX'
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contactNumber && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div className='flex flex-col'>
              <label
                htmlFor='email'
                className='mb-1 font-semibold text-gray-700'
              >
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder='Enter email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
              />
            </div>

            {/* Address */}
            <div className='flex flex-col'>
              <label
                htmlFor='address'
                className='mb-1 font-semibold text-gray-700'
              >
                Address
              </label>
              <textarea
                id='address'
                name='address'
                placeholder='Enter full address'
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
              ></textarea>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Police Station Dropdown */}
            <div className='flex flex-col'>
              <label
                htmlFor='policeStation'
                className='mb-1 font-semibold text-gray-700'
              >
                Police Station <span className='text-red-600'>*</span>
              </label>
              <select
                id='policeStation'
                name='policeStation'
                value={formData.policeStation}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.policeStation ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>Select Police Station</option>
                {policeStationsList.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
              {errors.policeStation && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.policeStation}
                </p>
              )}
            </div>

            {/* Date of Joining */}
            <div className='flex flex-col'>
              <label
                htmlFor='joiningDate'
                className='mb-1 font-semibold text-gray-700'
              >
                Date of Joining <span className='text-red-600'>*</span>
              </label>
              <input
                id='joiningDate'
                name='joiningDate'
                type='date'
                value={formData.joiningDate}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.joiningDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.joiningDate && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.joiningDate}
                </p>
              )}
            </div>

            {/* Status Dropdown */}
            <div className='flex flex-col'>
              <label
                htmlFor='status'
                className='mb-1 font-semibold text-gray-700'
              >
                Status <span className='text-red-600'>*</span>
              </label>
              <select
                id='status'
                name='status'
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>Select Status</option>
                {statusList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className='mt-1 text-sm text-red-600'>{errors.status}</p>
              )}
            </div>

            {/* Qualification */}
            <div className='flex flex-col'>
              <label
                htmlFor='qualification'
                className='mb-1 font-semibold text-gray-700'
              >
                Qualification
              </label>
              <input
                id='qualification'
                name='qualification'
                type='text'
                placeholder='Enter qualification'
                value={formData.qualification}
                onChange={handleInputChange}
                className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
              />
              {errors.qualification && (
                <p className='mt-1 text-sm text-red-600'>{errors.qualification}</p>
              )}
            </div>

            {/* Weapons Assigned */}
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold text-gray-700'>
                Weapons Assigned <span className='text-red-600'>*</span>
              </label>
              <div className='flex flex-wrap gap-4'>
                {weaponsList.map((weapon) => (
                  <label key={weapon} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      value={weapon}
                      checked={formData.weapons.includes(weapon)}
                      onChange={handleWeaponsChange}
                    />
                    {weapon}
                  </label>
                ))}
              </div>
              {errors.weapons && (
                <p className='mt-1 text-sm text-red-600'>{errors.weapons}</p>
              )}
            </div>

            {/* Vehicles Assigned */}
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold text-gray-700'>
                Vehicles Assigned <span className='text-red-600'>*</span>
              </label>
              <div className='flex flex-wrap gap-4'>
                {vehiclesList.map((vehicle) => (
                  <label key={vehicle} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      value={vehicle}
                      checked={formData.vehicles.includes(vehicle)}
                      onChange={handleVehiclesChange}
                    />
                    {vehicle}
                  </label>
                ))}
              </div>
              {errors.vehicles && (
                <p className='mt-1 text-sm text-red-600'>{errors.vehicles}</p>
              )}
            </div>

            {/* Remarks */}
            <div className='flex flex-col'>
              <label
                htmlFor='remarks'
                className='mb-1 font-semibold text-gray-700'
              >
                Remarks
              </label>
              <textarea
                id='remarks'
                name='remarks'
                placeholder='Additional remarks'
                rows={3}
                value={formData.remarks}
                onChange={handleInputChange}
                className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
              ></textarea>
            </div>

           {/* Image Upload */}
<div className="flex flex-col">
  <label htmlFor="image" className="mb-1 font-semibold text-gray-700">
    Upload Image <span className="text-red-600">*</span>
  </label>
  <input
    id="image"
    type="file"
    accept="image/*"
    required
    onChange={(e) => {
      const file = e.target.files && e.target.files[0]
      if (file) {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
        }))
        setImagePreview(URL.createObjectURL(file))
        setErrors((prev) => ({ ...prev, imageFile: '' })) // Clear error on valid input
      } else {
        setFormData((prev) => ({ ...prev, imageFile: null }))
        setImagePreview(null)
      }
    }}
    className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
      errors.imageFile ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {errors.imageFile && (
    <p className="mt-1 text-sm text-red-600">{errors.imageFile}</p>
  )}
  {/* Preview */}
  {imagePreview && (
    <img
      src={imagePreview}
      alt="Preview"
      className="mt-3 max-h-48 rounded border border-gray-300 object-contain"
    />
  )}
</div>

          </div>
        </div>

        {errors.fullName && (
          <p className='mt-1 text-sm text-red-600'>{errors.fullName}</p>
        )}

        <style>{`
        .error-message {
          color: #e74c3c; /* professional red */
          background-color: #fdecea; /* subtle light red background */
          border: 1px solid #e74c3c;
          padding: 12px 20px;
          margin-bottom: 15px;
          border-radius: 5px;
          font-weight: 600;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          transform: translateY(0);
          opacity: 1;
          animation: shake 0.5s ease-in-out;
        }

        /* Shake animation for subtle movement */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>

        {/* Your form and other UI elements */}
        {errors.server && <div className='error-message'>{errors.server}</div>}

        {/* Submit Button */}
        <div className='mt-8 flex justify-center'>
          <button
            onClick={handleSubmit}
            className='rounded bg-blue-700 px-8 py-3 font-semibold text-white shadow hover:bg-blue-800'
          >
            Add Constable
          </button>
        </div>
      </div>
      {/* Modal JSX */}
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
              Constable Added Successfully!
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

export default AddConstablePage
