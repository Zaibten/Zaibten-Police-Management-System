import React, { useState } from 'react'

interface Policeman {
  badgeNumber: string
  name: string
  rank: string
  status: string
  contact: string
  policeStation: string
  image?: string // Add optional image field
}

const Duty: React.FC = () => {
  const [badgeNumber, setBadgeNumber] = useState('')
  const [policeman, setPoliceman] = useState<Policeman | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const today = new Date().toISOString().split('T')[0]
  const [dateError, setDateError] = useState('')
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  const [formData, setFormData] = useState({
    location: '',
    xCoord: '',
    yCoord: '',
    shift: '',
    dutyType: 'single', // "single" or "multiple"
    dutyDate: '',
    fromDate: '',
    toDate: '',
    dutyCategory: '', // New field
  })

  const handleSearch = async () => {
    if (!badgeNumber.trim()) {
      alert('Please enter a badge number')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/constable/${badgeNumber.trim()}`
      )
      if (!response.ok) throw new Error('Policeman not found')
      const data = await response.json()
      setPoliceman({
        badgeNumber: data.badgeNumber,
        name: data.fullName,
        rank: data.rank,
        status: data.status, // replace with real field if you have it
        contact: data.contactNumber,
        policeStation: data.policeStation,
        image: data.image, // base64 string like "iVBORw0KGgoAAAANSUhEUgA..."
      })
    } catch (err) {
      alert('This Badge no not exist in our record !!')
      // setModalVisible(true);  // Show modal instead of alert
      // setPoliceman(null);
      // setPoliceman(null);
    } finally {
      setLoading(false)
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500 text-white'
      case 'onleave':
        return 'bg-yellow-400 text-black'
      case 'suspended':
        return 'bg-red-600 text-white'
      case 'retired':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-300 text-black' // fallback color
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!policeman) return alert('Please search and select a policeman first.')

    // 🚫 Date validation for "multiple" dutyType
    if (formData.dutyType === 'multiple') {
      const from = new Date(formData.fromDate)
      const to = new Date(formData.toDate)

      if (!formData.fromDate || !formData.toDate) {
        setDateError('Both From Date and To Date are required.')
        return
      }

      if (from > to) {
        setDateError('From Date cannot be greater than To Date.')
        return
      }

      setDateError('') // ✅ Clear error if valid
    }

    // Prepare data for API
const payload = {
  badgeNumber: policeman.badgeNumber,
  name: policeman.name,
  rank: policeman.rank,
  status: policeman.status,
  contact: policeman.contact,
  policeStation: policeman.policeStation,
  location: formData.location,
  xCoord: Number(formData.xCoord),
  yCoord: Number(formData.yCoord),
  shift: formData.shift,
  dutyType: formData.dutyType,
  dutyDate:
    formData.dutyType === 'single' ? formData.dutyDate : formData.fromDate,
  fromDate:
    formData.dutyType === 'multiple' ? formData.fromDate : undefined,
  toDate: formData.dutyType === 'multiple' ? formData.toDate : undefined,
  batchNumber: 'Batch1',
  remarks: '',
  dutyCategory: formData.dutyCategory, // ✅ Added
}


    try {
      const res = await fetch('http://localhost:5000/api/assign-duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to assign duty')

      setModalMessage(data.message)
      setIsErrorMessage(false)
      setModalVisible(true)

      setFormData({
        location: '',
        xCoord: '',
        yCoord: '',
        shift: '',
        dutyType: 'single',
        dutyDate: '',
        fromDate: '',
        toDate: '',
        dutyCategory: '', // New field
      })
      setBadgeNumber('')
      setPoliceman(null)
    } catch (error: any) {
      setModalMessage(error.message)
      setIsErrorMessage(true)
      setModalVisible(true)
    }
  }

  return (
    <div className='flex min-h-screen items-start justify-center bg-gray-100 p-6 dark:bg-[#0b1120]'>
      {/* Full width container */}
      <div
        className='max-h-[90vh] w-full max-w-full overflow-auto rounded-xl bg-white p-6
                      shadow-md dark:bg-gray-900'
        style={{ maxWidth: '100%' }}
      >
        <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
          Assign Duty to Policeman
        </h2>

        {/* Badge Number Search */}
        <div className='mx-auto mb-6 flex max-w-md flex-col items-center gap-3 sm:flex-row'>
          <input
            type='text'
            placeholder='Enter Badge Number'
            required
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white sm:flex-1'
          />
          <button
            onClick={handleSearch}
            type='button'
            disabled={loading}
            className={`mt-2 w-full rounded-lg p-3 text-white transition sm:mt-0 sm:w-auto ${
              loading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title='Search Policeman'
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Policeman Info */}
        {policeman && (
          <div className='mx-auto mb-6 max-w-3xl rounded-xl bg-gray-50 p-6 shadow-inner dark:bg-gray-800'>
            <h3 className='mb-6 border-b border-gray-300 pb-2 text-center text-2xl font-semibold tracking-wide text-gray-800 dark:border-gray-600 dark:text-gray-200'>
              Policeman Details
            </h3>
            {policeman.image && (
              <div className='my-4 flex justify-center'>
                <img
                  src={`data:image/jpeg;base64,${policeman.image}`}
                  alt='Policeman'
                  className='border-black-500 h-40 w-40 rounded-full border-4 object-cover shadow-md'
                />
              </div>
            )}

            <div className='grid grid-cols-1 gap-4 text-lg text-gray-800 dark:text-gray-300 sm:grid-cols-2'>
              <div>
                <strong>Name:</strong> {policeman.name}
              </div>
              <div>
                <strong>Rank:</strong> {policeman.rank}
              </div>
              <div>
                <strong>Badge No:</strong> {policeman.badgeNumber}
              </div>
              <div>
                <strong>Police Station:</strong> {policeman.policeStation}
              </div>
              <div>
                <strong>Contact Number:</strong> {policeman.contact}
              </div>
              <div>
                <strong>Status:</strong>
                <span
                  className={`ml-2 rounded-md px-2 py-1 ${getStatusBgColor(policeman.status)}`}
                >
                  {policeman.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Form */}
        {policeman && (
          <form
            onSubmit={handleSubmit}
            className='mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2'
          >
            <div>
              <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                Duty Location
              </label>
              <input
                type='text'
                name='location'
                value={formData.location}
                onChange={handleChange}
                required
                className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                             text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
              />
            </div>

            <div>
              <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                X Coordinate
              </label>
              <input
                type='number'
                name='xCoord'
                value={formData.xCoord}
                onChange={handleChange}
                required
                step='any'
                className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                             text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
              />
            </div>

            <div>
              <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                Y Coordinate
              </label>
              <input
                type='number'
                name='yCoord'
                value={formData.yCoord}
                onChange={handleChange}
                required
                step='any'
                className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                             text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
              />
            </div>

            <div>
  <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
    Duty Type
  </label>
  <select
  name='dutyCategory'
  value={formData.dutyCategory}
  onChange={handleChange}
  required
  className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
             text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
>
  <option value=''>Select Type</option>
  <option value='Patrol'>Patrol</option>
  <option value='Security'>Security</option>
  <option value='VIP Escort'>VIP Escort</option>
  <option value='VIP Security'>VIP Security</option>
  <option value='Investigation'>Investigation</option>
  <option value='Checkpoint'>Checkpoint</option>
  <option value='Court Duty'>Court Duty</option>
  <option value='Traffic Control'>Traffic Control</option>
  <option value='Other'>Other</option>
</select>

</div>


            <div>
              <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                Shift Time
              </label>
              <input
                type='text'
                name='shift'
                placeholder='e.g., 9:00 AM - 5:00 PM'
                value={formData.shift}
                onChange={handleChange}
                required
                className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                             text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
              />
            </div>

            {/* Duty Type Select */}
            <div>
              <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                Duty Type
              </label>
              <select
                name='dutyType'
                value={formData.dutyType}
                onChange={handleChange}
                className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                           text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
              >
                <option value='single'>Single Day</option>
                <option value='multiple'>Multiple Days</option>
              </select>
            </div>

            {/* Date Inputs */}
            {formData.dutyType === 'single' ? (
              <div>
                <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                  Duty Date
                </label>
                <input
                  type='date'
                  name='dutyDate'
                  value={formData.dutyDate}
                  onChange={handleChange}
                  min={today}
                  required
                  className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                               text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
                />
              </div>
            ) : (
              <>
                <div>
                  <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                    From Date
                  </label>
                  <input
                    type='date'
                    name='fromDate'
                    value={formData.fromDate}
                    onChange={handleChange}
                    min={today}
                    required
                    className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                                 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-lg font-medium text-gray-700 dark:text-gray-300'>
                    To Date
                  </label>
                  <input
                    type='date'
                    name='toDate'
                    value={formData.toDate}
                    onChange={handleChange}
                    min={today}
                    required
                    className='w-full rounded-lg border bg-gray-100 px-4 py-3 text-lg
                                 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white'
                  />
                </div>
              </>
            )}

            <br></br>
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

            {dateError && (
              <div className='error-message mx-auto mb-4 max-w-2xl'>
                {dateError}
              </div>
            )}

            <div className='mt-4 flex justify-center sm:col-span-2'>
              <button
                type='submit'
                className='w-full rounded-lg bg-blue-600 px-8 py-3 text-lg
                           font-semibold text-white transition hover:bg-blue-700 sm:w-auto'
              >
                Assign Duty
              </button>
            </div>
          </form>
        )}
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
                opacity: 1,
              }}
            >
              Zaibten Police Management System
            </h1>

            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#dc2626', // red color for error
                marginBottom: '2rem',
                animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
                opacity: 1,
              }}
            >
              Police Record Not Found!
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
      {/* Modal */}
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
                opacity: 1,
              }}
            >
              Zaibten Police Management System
            </h1>

            <p
              className={`mb-4 text-lg font-semibold ${isErrorMessage ? 'text-red-600' : 'text-green-600'}`}
            >
              {modalMessage}
            </p>
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
    </div>
  )
}

export default Duty
