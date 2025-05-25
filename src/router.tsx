import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const router = createBrowserRouter([
  {
    // root route - no path
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard/overview')).default,
        }),
      },
      
      {
  path: 'alerts',  // matches /alerts
  lazy: async () => ({
    Component: (await import('./pages/alerts')).default,
  }),
},
{
  path: 'Stations',  // matches /Stations
  lazy: async () => ({
    Component: (await import('./pages/stations')).default,
  }),
},
{
  path: 'Stations/add-Stations',
  lazy: async () => ({
    Component: (await import('./pages/stations/add-Stations')).default,
  }),
},
{
  path: 'constable',
  lazy: async () => ({
    Component: (await import('./pages/constable')).default,
  }),
},
{
  path: 'constable/add-constable',
  lazy: async () => ({
    Component: (await import('./pages/constable/add-constable')).default,
  }),
},
      {
        // no path
        lazy: async () => ({
          Component: (await import('@/pages/support')).default,
        }),
      },
      {
        // no path
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            // no path
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            // no path
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            // no path
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            // no path
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            // no path
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className="h-[50svh]" minimal />,
          },
        ],
      },
      {
        // no path
        lazy: async () => ({
          Component: (await import('./pages/auth/sign-in')).default,
        }),
      },
      {
        // no path
        lazy: async () => ({
          Component: (await import('./pages/auth/sign-in-2')).default,
        }),
      },
      {
        // no path
        lazy: async () => ({
          Component: (await import('./pages/auth/sign-up')).default,
        }),
      },
      {
        // no path
        lazy: async () => ({
          Component: (await import('./pages/auth/forgot-password')).default,
        }),
      },
      {
        // no path
        lazy: async () => ({
          Component: (await import('./pages/auth/otp')).default,
        }),
      },
    ],
  },
  {
    // no path
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    // no path
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },

  { Component: GeneralError },
  { Component: NotFoundError },
  { Component: MaintenanceError },
  { Component: UnauthorisedError },

  { Component: NotFoundError },
])

export default router
