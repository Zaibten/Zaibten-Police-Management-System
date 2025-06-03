import { useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PoliceUser {
  _id: string
  batchNo: string
  password: string
  status: string
}

const ViewPoliceUser = () => {
  const [users, setUsers] = useState<PoliceUser[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  // For confirmation modal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [targetUser, setTargetUser] = useState<PoliceUser | null>(null)
  const [targetNewStatus, setTargetNewStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [deleteConstableId, setDeleteConstableId] = useState<string | null>(
    null
  )

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          'http://localhost:5000/api/police-users'
        )
        setUsers(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) =>
    user.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value >= 1 && value <= 50) {
      setItemsPerPage(value)
      setPage(1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < Math.ceil(users.length / itemsPerPage)) setPage(page + 1)
  }

  // Show confirmation modal before toggling status
  const confirmStatusToggle = (user: PoliceUser) => {
    const newStatus =
      user.status.toLowerCase() === 'active' ? 'Disabled' : 'Active'
    setTargetUser(user)
    setTargetNewStatus(newStatus)
    setConfirmModalVisible(true)
  }

  // Perform status toggle after confirmation
  const handleStatusToggle = async () => {
    if (!targetUser) return
    try {
      setUpdatingId(targetUser._id)
      setConfirmModalVisible(false) // Hide confirmation modal first

      await axios.patch(
        `http://localhost:5000/api/police-users/${targetUser._id}/status`,
        {
          status: targetNewStatus,
        }
      )

      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id ? { ...u, status: targetNewStatus } : u
        )
      )

      // Show success modal
      setSuccessModalVisible(true)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdatingId(null)
      setTargetUser(null)
      setTargetNewStatus('')
    }
  }

  // Cancel confirmation
  const cancelStatusToggle = () => {
    setConfirmModalVisible(false)
    setTargetUser(null)
    setTargetNewStatus('')
  }

  // Called when user clicks delete button/icon on a user row
  const handleDeleteClick = (id: string) => {
    setDeleteConstableId(id)
    setShowDeleteModal(true)
  }

  // Called when user confirms delete in the modal
  const confirmDeleteConstable = async () => {
    if (!deleteConstableId) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/police-users/${deleteConstableId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const errData = await response.json()
        alert(`Failed to delete: ${errData.error}`) // You can replace this alert with a better error handling/modal if you want
        return
      }

      // Remove the deleted user from state
      setUsers((prev) => prev.filter((user) => user._id !== deleteConstableId))

      setShowDeleteModal(false)
      setShowSuccessModal(true) // Show success modal after deletion
      setDeleteConstableId(null)
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the user') // Again, replace with better UI if desired
    }
  }

  return (
    <div className='h-[100vh] overflow-y-auto bg-white p-6 dark:bg-gray-900'>
      <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
        POLICEMAN DUTY DETAILS
      </h2>
      <div className='mb-4 flex justify-center'>
        <input
          type='text'
          placeholder='Search By Badge Number'
          className='w-full max-w-md rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(1) // Reset to first page on new search
          }}
        />
      </div>

      {/* Pagination UI */}
      <div className='mt-4 flex items-center justify-between px-4'>
        <div className='flex-1' />

        <div className='flex items-center space-x-2'>
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className='disabled:opacity-50'
            aria-label='Previous page'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <span className='text-sm font-medium text-gray-700'>
            Page {page} of {Math.max(1, totalPages)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className='disabled:opacity-50'
            aria-label='Next page'
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
            onChange={handleItemsPerPageChange}
            className='w-20 rounded border p-1 text-center'
          />
        </div>
      </div>

      <br />

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
      ) : users.length === 0 ? (
        <div className='mt-20 flex justify-center text-lg font-semibold text-gray-600 dark:text-gray-400'>
          No records yet.
        </div>
      ) : (
        <div className='scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 max-h-[80vh] overflow-x-auto overflow-y-auto rounded-lg border border-gray-300 shadow dark:border-gray-700'>
          <table className='w-full min-w-[600px] text-sm text-gray-800 dark:text-gray-200'>
            <thead className='sticky top-0 z-10 bg-gray-200 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <tr>
                <th className='border border-gray-300 px-4 py-3 text-left font-semibold dark:border-gray-700'>
                  S.no
                </th>
                {['Batch No', 'Password', 'Status', 'Action'].map(
                  (header, idx) => (
                    <th
                      key={idx}
                      className='border border-gray-300 px-4 py-3 text-left font-semibold dark:border-gray-700'
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className='hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {startIndex + index + 1} {/* Dynamic S.no */}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {user.batchNo}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    {user.password}
                  </td>
                  <td className='border px-4 py-2 dark:border-gray-700'>
                    <span
                      className={`inline-block rounded px-3 py-1 font-bold uppercase 
                        ${
                          user.status.toLowerCase() === 'disabled'
                            ? 'bg-gradient-to-tr from-red-600 via-red-500 to-red-400 text-white'
                            : user.status.toLowerCase() === 'active'
                              ? 'bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-black'
                              : ''
                        }`}
                      style={{ margin: '4px' }}
                    >
                      {user.status.toUpperCase()}
                    </span>
                  </td>

                  <td
                    className='flex flex-wrap items-center gap-2 px-4 py-2'
                    // style={{ minWidth: '315px' }}
                  >
                    <button
                      className='rounded bg-red-600 px-5 py-2 text-xs text-white hover:bg-red-700'
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      Delete
                    </button>

                    <button
                      disabled={updatingId === user._id}
                      onClick={() => confirmStatusToggle(user)}
                      className={`rounded px-5 py-2 text-xs text-white ${
                        updatingId === user._id
                          ? 'cursor-not-allowed bg-gray-400'
                          : user.status.toLowerCase() === 'active'
                            ? 'bg-pink-700 hover:bg-pink-800'
                            : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {updatingId === user._id
                        ? user.status.toLowerCase() === 'active'
                          ? 'Disabling...'
                          : 'Enabling...'
                        : user.status.toLowerCase() === 'active'
                          ? 'Disable'
                          : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              Are you sure you want to delete this user credentials? This action cannot
              be undone.
            </p>

            <div className='flex justify-center gap-4'>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConstableId(null)
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
                onClick={confirmDeleteConstable}
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

      {showSuccessModal && (
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
              ✅ User Credentials deleted successfully.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
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
      {/* Confirmation Modal */}
      {confirmModalVisible && (
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
                color: targetNewStatus === 'Enable' ? '#22c55e' : '#dc2626',
                marginBottom: '2rem',
                animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
                opacity: 0,
              }}
            >
              Are you sure you want to{' '}
              <span style={{ fontWeight: 'bold', textTransform: 'lowercase' }}>
                {targetNewStatus}
              </span>{' '}
              this police user with batch no{' '}
              <span style={{ fontWeight: 'bold' }}>{targetUser?.batchNo}</span>?
            </h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
                opacity: 0,
              }}
            >
              <button
                onClick={handleStatusToggle}
                style={{
                  backgroundColor: '#22c55e',
                  color: '#fff',
                  padding: '0.75rem 2rem',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#22c55e'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Yes
              </button>

              <button
                onClick={cancelStatusToggle}
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
                No
              </button>
            </div>
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

      {/* Success Modal */}
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
    </div>
  )
}

export default ViewPoliceUser
