import { useState, FormEvent } from 'react'

const AddPoliceUser = () => {
  const [batchNo, setBatchNo] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation: password must be exactly 8 characters and batchNo max 20 chars
    if (password.length !== 8) {
      setMessage('❌ Password must be exactly 8 characters.')
      setIsErrorMessage(true)
      //   setModalMessage('Password must be exactly 8 characters.')
      //   setModalVisible(true)
      return
    }

    if (batchNo.length > 20) {
      setMessage('❌ Batch No must be 20 characters or less.')
      setIsErrorMessage(true)
      //   setModalMessage('Batch No must be 20 characters or less.')
      //   setModalVisible(true)
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const res = await fetch('https://zaibtenpoliceserver.vercel.app/api/police-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchNo, password }),
      })

      const data = await res.json()
      if (res.ok) {
        // setMessage('✅ User added successfully!')
        setIsErrorMessage(false)
        setModalMessage('User added successfully!')
        setModalVisible(true)
        setBatchNo('')
        setPassword('')
      } else {
        setMessage(`❌ ${data.error || 'Failed to add user'}`)
        setIsErrorMessage(true)
        // setModalMessage(data.error || 'Failed to add user')
        // setModalVisible(true)
      }
    } catch (error) {
      setMessage('❌ Network error')
      setIsErrorMessage(true)
      //   setModalMessage('Network error')
      //   setModalVisible(true)
    }
    setIsLoading(false)
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-50 px-6 py-12'>
      <div className='w-full max-w-4xl rounded-lg bg-white p-10 shadow-xl'>
        <h2 className='mb-8 text-center text-3xl font-bold text-blue-700'>
          ADD POLICE USER LOGIN
        </h2>

        <form onSubmit={handleSubmit} className='space-y-8' noValidate>
          <div>
            <label
              htmlFor='batchNo'
              className='block text-lg font-medium text-gray-700'
            >
              Batch No
            </label>
            <input
              id='batchNo'
              name='batchNo'
              type='text'
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
              required
              placeholder='Enter Batch Number'
              maxLength={20}
              className='mt-2 block w-full rounded-md border border-gray-300 px-5 py-4 text-lg placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              autoComplete='off'
            />
          </div>

          <div className='relative'>
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter Password (8 characters)'
              maxLength={8}
              className='mt-2 block w-full rounded-md border border-gray-300 px-5 py-4 pr-14 text-lg placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              autoComplete='new-password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Improved Eye Open Icon
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z'
                  />
                  <circle
                    cx='12'
                    cy='12'
                    r='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                // Improved Eye Closed Icon
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17.94 17.94A9.969 9.969 0 0112 19.5c-5.523 0-10-7.5-10-7.5a19.212 19.212 0 015.243-5.774M3 3l18 18'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9.88 9.88a3 3 0 014.24 4.24'
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className={`flex w-full items-center justify-center rounded-md bg-indigo-600 px-6 py-4 text-xl font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isLoading && (
              <svg
                className='mr-3 h-6 w-6 animate-spin text-white'
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
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v8H4z'
                ></path>
              </svg>
            )}
            Add Login Credentials
          </button>
        </form>

        <style>{`
          .error-message {
            color: #e74c3c;
            background-color: #fdecea;
            border: 1px solid #e74c3c;
            padding: 12px 20px;
            margin-top: 32px;
            border-radius: 5px;
            font-weight: 600;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            animation: shake 0.5s ease-in-out;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
          .success-message {
            color: #2f855a;
            background-color: #d1fae5;
            border: 1px solid #2f855a;
            padding: 12px 20px;
            margin-top: 32px;
            border-radius: 5px;
            font-weight: 600;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
        `}</style>

        {message && (
          <div
            className={
              message.startsWith('✅') ? 'success-message' : 'error-message'
            }
            role='alert'
          >
            {message.slice(2).trim()}
          </div>
        )}
      </div>

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
              className={`mb-4 text-lg font-semibold ${
                isErrorMessage ? 'text-red-600' : 'text-green-600'
              }`}
              style={{ animation: 'fadeInText 0.6s ease-in-out 0.5s forwards' }}
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
                opacity: 1,
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

export default AddPoliceUser
