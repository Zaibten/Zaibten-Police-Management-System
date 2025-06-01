import { useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Duty = {
  _id: string
  badgeNumber: string
  name: string
  rank: string
  status: string
  contact: string
  policeStation: string
  location: string
  xCoord: number
  yCoord: number
  shift: string
  dutyType: string
  dutyDate: string
  fromDate?: string
  toDate?: string
  batchNumber: string
  remarks: string
}

export default function Home() {
  const [duties, setDuties] = useState<Duty[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteDutyId, setDeleteDutyId] = useState<string | null>(null)
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  // At the top of your component
  const [stationFilter, setStationFilter] = useState('')
  const stationOptions = [
    ...new Set(duties.map((d) => d.policeStation).filter(Boolean)),
  ] // Unique stations

  const filteredDuties = duties.filter((duty) => {
    const matchesSearch = duty.badgeNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const dutyDate = new Date(duty.dutyDate)

    const matchesFrom = fromDate ? new Date(fromDate) <= dutyDate : true
    const matchesTo = toDate ? dutyDate <= new Date(toDate) : true
    const matchesStation = stationFilter
      ? duty.policeStation === stationFilter
      : true

    return matchesSearch && matchesFrom && matchesTo && matchesStation
  })

  // Then paginate the filtered list instead of all duties
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDuties = filteredDuties.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDuties.length / itemsPerPage)

  // 🔥 Modal states
  const [showModal, setShowModal] = useState(false)
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null)

  useEffect(() => {
    setLoading(true)
    axios
      .get('https://zaibtenpoliceserver.vercel.app/api/duties')
      .then((response) => setDuties(response.data))
      .catch((error) => console.error('Error fetching duties:', error))
      .finally(() => setLoading(false))
  }, [])

  const getTotalDays = (duty: Duty) => {
    if (duty.fromDate && duty.toDate) {
      const from = new Date(duty.fromDate)
      const to = new Date(duty.toDate)
      const diffTime = Math.abs(to.getTime() - from.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 1
  }

  const [successModalVisible, setSuccessModalVisible] = useState(false)

  const goToPrevPage = () => setCurrentPage((page) => Math.max(page - 1, 1))
  const goToNextPage = () =>
    setCurrentPage((page) => Math.min(page + 1, totalPages))

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [itemsPerPage, totalPages, currentPage])

  // 🔥 Open modal and set selected duty
  const handleEdit = (duty: Duty) => {
    setSelectedDuty(duty)
    setShowModal(true)
  }

  // 🔥 Update form field value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDuty) return
    setSelectedDuty({ ...selectedDuty, [e.target.name]: e.target.value })
  }

  const openDeleteModal = (id: string) => {
    setDeleteDutyId(id)
    setShowDeleteModal(true)
  }

  const confirmDeleteDuty = async () => {
    if (!deleteDutyId) return

    try {
      const response = await axios.delete(
        `https://zaibtenpoliceserver.vercel.app/api/duties/${deleteDutyId}`
      )
      if (response.status === 200) {
        setDuties((prev) => prev.filter((duty) => duty._id !== deleteDutyId))
        setShowDeleteSuccessModal(true) // Show success modal here
      } else {
        alert('Failed to delete duty.')
      }
    } catch (error) {
      console.error('Error deleting duty:', error)
      alert('An error occurred while deleting the duty.')
    } finally {
      setShowDeleteModal(false)
      setDeleteDutyId(null)
    }
  }

  const handleSubmitUpdate = () => {
    if (!selectedDuty) return

    axios
      .put(`https://zaibtenpoliceserver.vercel.app/api/duties/${selectedDuty._id}`, selectedDuty)
      .then((res) => {
        if (res.status === 200) {
          setSuccessModalVisible(true) // ✅ Show success modal
          setShowModal(false) // ✅ Hide edit modal
          setDuties((prev) =>
            prev.map((duty) => (duty._id === res.data._id ? res.data : duty))
          )
        } else {
          alert('Something went wrong') // ❌ Show alert if update fails
        }
      })
      .catch((error) => {
        console.error('Error updating duty:', error)
        alert('Something went wrong') // ❌ Show alert on error
      })
  }

  return (
    <div className='min-h-screen bg-white p-6 dark:bg-gray-900'>
      <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
        POLICEMAN DUTY DETAILS
      </h2>

      <div className='mb-4 flex flex-wrap justify-between gap-4 md:flex-nowrap'>
        {/* Search Box */}
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Search by Badge Number'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* From Date */}
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <label
            htmlFor='fromDate'
            className='text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            From:
          </label>
          <input
            type='date'
            id='fromDate'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
          />
        </div>

        {/* To Date */}
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <label
            htmlFor='toDate'
            className='text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            To:
          </label>
          <input
            type='date'
            id='toDate'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
          />
        </div>

        {/* Station Dropdown */}
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <label
            htmlFor='station'
            className='text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Station:
          </label>
          <select
            id='station'
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All</option>
            {stationOptions.map((station, idx) => (
              <option key={idx} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className='flex items-center'>
          <button
            onClick={() => {
              setSearchQuery('')
              setFromDate('')
              setToDate('')
              setStationFilter('')
            }}
            className='rounded-md bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400'
          >
            Clear
          </button>
        </div>
      </div>

      {/* Pagination UI */}
      <div className='mt-4 flex items-center justify-between px-4'>
        <div className='flex-1' />
        <div className='flex items-center space-x-2'>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`rounded-full border p-2 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <span className='text-sm font-medium text-gray-700'>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`rounded-full border p-2 ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>

        <div className='flex flex-1 items-center justify-end space-x-2'>
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
            max={50}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value) || 20)}
            className='w-20 rounded border p-1 text-center'
          />
        </div>
      </div>

      <br />

      {/* Table */}
      {loading ? (
        <div className='mt-20 flex justify-center'>
          <svg
            className='h-8 w-8 animate-spin text-blue-600'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
            />
          </svg>
        </div>
      ) : duties.length === 0 ? (
        <div className='mt-20 flex justify-center text-lg font-semibold text-gray-600 dark:text-gray-400'>
          No records yet.
        </div>
      ) : (
        <div className='scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 max-h-[70vh] overflow-x-auto overflow-y-auto rounded-lg border border-gray-300 shadow dark:border-gray-700'>
          <table className='w-full min-w-[1300px] text-sm text-gray-800 dark:text-gray-200'>
            <thead className='sticky top-0 z-10 bg-gray-200 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <tr>
                {[
                  'Badge No',
                  'Name',
                  'Rank',
                  'Status',
                  'Contact',
                  'Station',
                  'Location',
                  'X Coord',
                  'Y Coord',
                  'Shift',
                  'Duty Type',
                  'Date',
                  'From',
                  'To',
                  'Total Days',
                  'Remarks',
                  'Status',
                  'Action',
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className='border border-gray-300 px-4 py-3 text-left font-semibold dark:border-gray-700'
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentDuties.map((duty, idx) => (
                <tr
                  key={duty._id}
                  className={
                    idx % 2 === 0
                      ? 'bg-white dark:bg-gray-900'
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }
                >
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.badgeNumber}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.name}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.rank}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.status}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.contact}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.policeStation}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.location}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.xCoord}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.yCoord}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.shift}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.dutyType}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {new Date(duty.dutyDate).toLocaleDateString()}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.fromDate
                      ? new Date(duty.fromDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.toDate
                      ? new Date(duty.toDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className='border px-4 py-2 font-medium dark:border-gray-700'>
                    {getTotalDays(duty)}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {duty.remarks ? duty.remarks : 'No remarks till now'}
                  </td>

<td
  className="border px-4 py-4 dark:border-gray-700 text-center"
  style={{ minWidth: '130px' }}
>
  {(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time

    const toDate = duty.toDate ? new Date(duty.toDate) : null;
    const dutyDate = duty.dutyDate ? new Date(duty.dutyDate) : null;

    if (toDate) toDate.setHours(0, 0, 0, 0);
    if (dutyDate) dutyDate.setHours(0, 0, 0, 0);

    const isCompleted =
      (toDate && toDate < today) ||
      (!toDate && dutyDate && dutyDate < today);

    return (
      <span
        className={`inline-block font-semibold px-3 py-1 rounded ${
          isCompleted
            ? 'bg-green-500 text-white'
            : 'bg-yellow-400 text-black'
        }`}
      >
        {isCompleted ? 'Completed' : 'In Progress'}
      </span>
    );
  })()}
</td>





                  

                  <td className='flex flex-wrap items-center gap-2 px-4 py-2'>
                    <button
                      onClick={() => handleEdit(duty)}
                      className='rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600'
                    >
                      Edit Cordinates
                    </button>
                    <button
                      onClick={() => openDeleteModal(duty._id)}
                      className='rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700'
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

      {/* 🔥 Modal for editing */}
      {showModal && selectedDuty && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900'>
            <h2 className='mb-6 text-center text-2xl font-bold text-blue-700 dark:text-blue-300'>
              Edit Duty Details
            </h2>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[
                // { label: 'Badge Number', name: 'badgeNumber' },
                // { label: 'Name', name: 'name' },
                // { label: 'Rank', name: 'rank' },
                // { label: 'Status', name: 'status' },
                // { label: 'Contact', name: 'contact' },
                // { label: 'Police Station', name: 'policeStation' },
                // { label: 'Location', name: 'location' },
                { label: 'X Coordinate', name: 'xCoord' },
                { label: 'Y Coordinate', name: 'yCoord' },
                // { label: 'Shift', name: 'shift' },
              ].map((field) => {
                const isEditable =
                  field.name === 'xCoord' || field.name === 'yCoord'
                return (
                  <div key={field.name} className='flex flex-col'>
                    <label
                      htmlFor={field.name}
                      className='mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      {field.label}
                    </label>
                    <input
                      type='text'
                      name={field.name}
                      id={field.name}
                      value={(selectedDuty as any)[field.name] || ''}
                      onChange={handleChange}
                      readOnly={!isEditable}
                      style={{
                        backgroundColor: !isEditable ? '#e5e7eb' : undefined, // Tailwind bg-gray-200 hex
                        color: !isEditable ? '#4b5563' : undefined, // Tailwind text-gray-600 hex
                        cursor: !isEditable ? 'not-allowed' : 'text',
                      }}
                      className={`rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none ${
                        isEditable
                          ? 'bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400'
                          : 'dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    />
                  </div>
                )
              })}
            </div>

            <div className='mt-6 flex justify-end gap-3'>
              <button
                onClick={() => setShowModal(false)}
                className='rounded-lg border border-gray-400 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                className='rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'
              >
                Update Duty
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
              Duty Updated Successfully!
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
              Are you sure you want to delete this duty? This action cannot be
              undone.
            </p>

            <div className='flex justify-center gap-4'>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteDutyId(null)
                }}
                className='rounded border px-4 py-2 text-gray-700'
                style={{
                  animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
                  opacity: 0,
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
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
                onClick={confirmDeleteDuty}
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
      {/* Delete Success Modal */}
      {showDeleteSuccessModal && (
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
              ✅ Duty deleted successfully.
            </p>

            <button
              onClick={() => setShowDeleteSuccessModal(false)}
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
  )
}
