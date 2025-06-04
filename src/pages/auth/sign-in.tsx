import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (email) {
      navigate('/', { replace: true })
    } else {
      setCheckingAuth(false) // no email found, show login form
    }
  }, [navigate])

  if (checkingAuth) {
    // show nothing or a spinner while checking auth, so login page is not briefly shown
    return null
  }


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('https://zaibtenpoliceserver.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        localStorage.setItem('userEmail', email)

        setTimeout(() => {
          setLoading(false)
          navigate('/')  // redirect to homepage
        }, 3000)
      } else {
        setError(data.message)
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred')
      setLoading(false)
    }
  }


  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
<div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
  {/* Background video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className='absolute inset-0 w-full h-full object-cover opacity-40 z-0'
  >
    {/* <source src='/back.mp4' type='video/mp4' /> */}
    <source src='https://asset.cloudinary.com/dvqxt7y7h/2a378fd7832ca518f96f2f3b8cbbf6fe' type='video/mp4' />
    Your browser does not support the video tag.
  </video>

  {/* Overlay to dim the video a bit */}
  <div className='absolute inset-0 bg-zinc-900 opacity-60 z-10' />

  {/* Content with z-index above video and overlay */}
  <div className='relative z-20 flex items-center text-lg font-medium'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='mr-2 h-6 w-6'
    >
      <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
    </svg>
    PMS Admin
  </div>

  {/* If you want, you can remove the old Vite logo or replace it */}
  {/* <img src={ViteLogo} className='relative m-auto' width={301} height={60} alt='Vite' /> */}

  <div className='relative z-20 mt-auto'>
    <blockquote className='space-y-2'>
      <p className='text-lg'>
        “The Police Management System (PMS Admin) streamlines the allocation and
    management of police duties, ensuring efficient deployment of personnel
    across various tasks and locations. It enhances operational oversight,
    accountability, and resource management within police departments.”
      </p>
      <footer className='text-sm'>contact@zaibteninfo.com</footer>
    </blockquote>
  </div>
</div>

      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email and password below <br />
              to log into your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
{loading && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
      backdropFilter: 'blur(6px)',
      userSelect: 'none',
      padding: '20px',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        position: 'relative',
        width: '70px',
        height: '70px',
        marginBottom: '20px',
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          boxSizing: 'border-box',
          position: 'absolute',
          width: '70px',
          height: '70px',
          border: '6px solid #3B82F6',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite',
          top: 0,
          left: 0,
        }}
      />
      {/* Inner ring */}
      <div
        style={{
          boxSizing: 'border-box',
          position: 'absolute',
          width: '42px',
          height: '42px',
          border: '6px solid #60A5FA',
          borderBottomColor: 'transparent',
          borderRadius: '50%',
          animation: 'spinReverse 1s linear infinite',
          top: '14px',
          left: '14px',
        }}
      />
    </div>
    <div
      style={{
        fontSize: '20px',
        fontWeight: 700,
        letterSpacing: '0.7px',
        textShadow: '0 2px 5px rgba(0,0,0,0.4)',
        animation: 'fadeInUp 1.5s ease-in-out infinite',
      }}
    >
      Dashboard is loading...
    </div>
    <div
      style={{
        fontSize: '14px',
        fontWeight: 500,
        marginTop: '6px',
        color: '#A5B4FC', // subtle lighter blue
        fontStyle: 'italic',
        animation: 'fadeInUp 1.5s ease-in-out infinite',
        animationDelay: '0.3s',
      }}
    >
      Hang tight — magic is happening behind the scenes!
    </div>

    {/* Keyframe animations */}
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          50% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}
    </style>
  </div>
)}


            <div>
              <label className='block mb-1 text-sm font-medium'>Email</label>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>

            <div className='relative'>
              <label className='block mb-1 text-sm font-medium'>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute right-2 top-9 text-gray-500 hover:text-gray-700'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type='submit'
              className='w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition duration-200'
            >
              Login
            </button>

            {error && <p className='text-sm text-red-500'>{error}</p>}
            {success && <p className='text-sm text-green-500'>{success}</p>}
          </form>

          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking login, you agree to our{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
