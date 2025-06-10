import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

export function UserNav() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setShowLogoutModal(false);
    navigate('/pmslogin'); // or wherever your logout route goes
  };

  return (
    <>
      <DropdownMenu>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-semibold text-muted-foreground'>
            Welcome Admin
          </span>
        </div>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src='/logo.png' alt='@shadcn' />
              <AvatarFallback>Admin</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>PMS</p>
              <p className='text-xs leading-none text-muted-foreground'>
                support@pms.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link to="/">
              <DropdownMenuItem>
                Home
                <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <Link to="/settings">
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowLogoutModal(true)}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
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

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '0.5rem',
              animation: 'fadeInText 0.6s ease-in-out 0.4s forwards',
              opacity: 0,
            }}>
              Confirm Logout
            </h2>

            <p style={{
              fontSize: '1rem',
              color: '#334155',
              marginBottom: '2rem',
              animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
              opacity: 0,
            }}>
              Are you sure you want to logout?
            </p>

            <div className='flex justify-center gap-4'>
              <button
                onClick={() => setShowLogoutModal(false)}
                className='rounded border px-4 py-2 text-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className='rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
              >
                Yes, Logout
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
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.1); opacity: 1; }
                70% { transform: scale(0.95); }
                100% { transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
