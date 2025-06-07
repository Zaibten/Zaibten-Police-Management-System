import { useEffect, useState, useRef } from 'react'
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
  dutyCategory: string
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
  const tableRef = useRef<HTMLTableElement>(null)
  const stationOptions = [
    ...new Set(duties.map((d) => d.policeStation).filter(Boolean)),
  ] // Unique stations

  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

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

    // Compute status here as in the table
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const toDateObj = duty.toDate ? new Date(duty.toDate) : null
    const dutyDateObj = duty.dutyDate ? new Date(duty.dutyDate) : null

    if (toDateObj) toDateObj.setHours(0, 0, 0, 0)
    if (dutyDateObj) dutyDateObj.setHours(0, 0, 0, 0)

    const isCompleted =
      (toDateObj && toDateObj < today) ||
      (!toDateObj && dutyDateObj && dutyDateObj < today)
    const computedStatus = isCompleted ? 'Completed' : 'Pending'

    const matchesStatus = statusFilter
      ? computedStatus.toLowerCase() === statusFilter.toLowerCase()
      : true

    const matchesCategory = categoryFilter
      ? duty.dutyCategory === categoryFilter
      : true

    return (
      matchesSearch &&
      matchesFrom &&
      matchesTo &&
      matchesStation &&
      matchesStatus &&
      matchesCategory
    )
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

  const handleDownloadPDF = () => {
    if (!tableRef.current) return

    // Extract data from the original table rows (excluding header)
    const rows = Array.from(tableRef.current.querySelectorAll('tbody tr'))

    // Prepare an array of objects representing each record
    const records = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td'))
      return {
        badgeNo: cells[1]?.textContent || '',
        name: cells[2]?.textContent || '',
        rank: cells[3]?.textContent || '',
        contact: cells[4]?.textContent || '',
        station: cells[5]?.textContent || '',
        location: cells[6]?.textContent || '',
        xCoord: cells[7]?.textContent || '',
        yCoord: cells[8]?.textContent || '',
        shift: cells[9]?.textContent || '',
        dutyType: cells[10]?.textContent || '',
        dutyCategory: cells[11]?.textContent || '',
        date: cells[12]?.textContent || '',
        fromTime: cells[13]?.textContent || '',
        toTime: cells[14]?.textContent || '',
        totalDays: cells[15]?.textContent || '',
        remarks: cells[16]?.textContent || '',
        status2: cells[17]?.textContent || '',
        // skipping last cell (Action)
      }
    })

    const logoUrl = '/logo.png' // Your actual logo path

    const htmlContent = `
    <html>
      <head>
        <title>Policeman Duty Details Report</title>
        <style>
          @page {
            margin: 40px 40px 80px 40px;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            color: #1f2937;
            background: #fff;
            font-size: 14px;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
            padding: 30px 10px 100px 10px;
            box-sizing: border-box;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 20px;
          }
          img.logo {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 50%;
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1));
            display: inline-block;
          }
          h2 {
            text-align: center;
            color: #2563eb;
            font-weight: 700;
            font-size: 28px;
            margin: 10px 0 40px 0;
            letter-spacing: 3px;
            text-transform: uppercase;
            font-family: 'Montserrat', sans-serif;
          }
          .record {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 25px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            background: #f9fafb;
            page-break-inside: avoid;
          }
          .record-item {
            margin-bottom: 8px;
            font-size: 14px;
          }
          .record-item strong {
            color: #1e40af;
            width: 140px;
            display: inline-block;
          }
          .footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #fff;
          }
          .footer a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-container">
            <img class="logo" src="${logoUrl}" alt="App Logo" />
          </div>
          <h2>POLICEMAN DUTY DETAILS</h2>
          ${records
            .map(
              (record) => `
            <div class="record">
              <div class="record-item"><strong>Badge No:</strong> ${record.badgeNo}</div>
              <div class="record-item"><strong>Name:</strong> ${record.name}</div>
              <div class="record-item"><strong>Rank:</strong> ${record.rank}</div>
              <div class="record-item"><strong>Contact:</strong> ${record.contact}</div>
              <div class="record-item"><strong>Station:</strong> ${record.station}</div>
              <div class="record-item"><strong>Location:</strong> ${record.location}</div>
              <div class="record-item"><strong>X Coord:</strong> ${record.xCoord}</div>
              <div class="record-item"><strong>Y Coord:</strong> ${record.yCoord}</div>
              <div class="record-item"><strong>Shift:</strong> ${record.shift}</div>
              <div class="record-item"><strong>Days:</strong> ${record.dutyType}</div>
              <div class="record-item"><strong>Type:</strong> ${record.dutyCategory}</div>
              <div class="record-item"><strong>Date:</strong> ${record.date}</div>
              <div class="record-item"><strong>From:</strong> ${record.fromTime}</div>
              <div class="record-item"><strong>To:</strong> ${record.toTime}</div>
              <div class="record-item"><strong>Total Days:</strong> ${record.totalDays}</div>
              <div class="record-item"><strong>Remarks:</strong> ${record.remarks}</div>
              <div class="record-item"><strong>Status:</strong> ${record.status2}</div>
            </div>
          `
            )
            .join('')}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Zaibten Info &nbsp;&bull;&nbsp;
          <a href="https://zaibteninfo.com/" target="_blank" rel="noopener noreferrer">zaibteninfo.com</a> &nbsp;&bull;&nbsp;
          Phone: <a href="tel:+14244830630">(+1) 424-483-0630</a>
        </div>
      </body>
    </html>
  `

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
        // printWindow.close();
      }
    } else {
      alert('Please allow popups for this website to download the PDF.')
    }
  }

  return (
    <div className='h-[100vh] overflow-y-auto bg-white p-6 dark:bg-gray-900'>
      <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
        POLICEMAN DUTY DETAILS
      </h2>

      <div className='mb-4 flex flex-wrap justify-between gap-4 md:flex-nowrap'>
        {/* Search Box */}
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Badge Number'
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
              setStatusFilter('')
              setCategoryFilter('')
            }}
            className='rounded-md bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400'
          >
            Clear
          </button>
        </div>

        {/* Download PDF Button */}
        <div className='flex items-center'>
          <button
            onClick={handleDownloadPDF}
            className='rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400'
          >
            Download as PDF
          </button>
        </div>
      </div>

      <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-center md:space-x-6 md:space-y-0'>
        {/* Status Filter */}
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All</option>
            <option value='Completed'>Completed</option>
            <option value='Pending'>Pending</option>
          </select>
        </div>

        {/* Duty Category Filter */}
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All</option>
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
        <div className='scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 max-h-[100vh] overflow-x-auto overflow-y-auto rounded-lg border border-gray-300 shadow dark:border-gray-700'>
          <table
            ref={tableRef}
            className='w-full min-w-[1300px] text-sm text-gray-800 dark:text-gray-200'
          >
            <thead className='sticky top-0 z-10 bg-gray-200 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <tr>
                <th className='border border-gray-300 px-4 py-3 text-left font-semibold dark:border-gray-700'>
                  S.No
                </th>

                {[
                  'Badge No',
                  'Name',
                  'Rank',
                  'Contact',
                  'Station',
                  'Location',
                  'X Coord',
                  'Y Coord',
                  'Shift',
                  'Days',
                  'Type',
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
                    {idx + 1}
                  </td>{' '}
                  {/* S.No */}
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
                    {duty.dutyCategory}
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
  {duty.status && duty.status.includes('Active')
    ? 'Assigned but not started yet'
    : duty.status || 'No status till now'}
</td>

                  <td
                    className='border px-4 py-4 text-center dark:border-gray-700'
                    style={{ minWidth: '130px' }}
                  >
                    {(() => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0) // Remove time

                      const toDate = duty.toDate ? new Date(duty.toDate) : null
                      const dutyDate = duty.dutyDate
                        ? new Date(duty.dutyDate)
                        : null

                      if (toDate) toDate.setHours(0, 0, 0, 0)
                      if (dutyDate) dutyDate.setHours(0, 0, 0, 0)

                      const isCompleted =
                        (toDate && toDate < today) ||
                        (!toDate && dutyDate && dutyDate < today)

                      return (
                        <span
                          className={`inline-block rounded px-3 py-1 font-semibold ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-400 text-black'
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      )
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
                Update Cordinates
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
