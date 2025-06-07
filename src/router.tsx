import { createBrowserRouter, redirect } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const checkUserEmailLoader = () => {
  // localStorage is only available in browser
  if (typeof window !== 'undefined') {
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      // Redirect to /pmslogin if no userEmail found
      return redirect('/pmslogin')
    }
  }
  // proceed normally
  return null
}

const router = createBrowserRouter([
  {
    // root route - no path
    loader: checkUserEmailLoader,
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
        path: 'alerts',
        lazy: async () => ({
          Component: (await import('./pages/alerts')).default,
        }),
      },
      {
        path: 'Stations',
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
  path: 'email',
  lazy: async () => ({
    Component: (await import('./pages/email')).default,
  }),
}
,
      {
        path: 'constable/add-constable',
        lazy: async () => ({
          Component: (await import('./pages/constable/add-constable')).default,
        }),
      },
      {
        path: 'duty',
        lazy: async () => ({
          Component: (await import('./pages/duty')).default,
        }),
      },
      {
        path: 'dutydetail',
        lazy: async () => ({
          Component: (await import('./pages/dutydetail')).default,
        }),
      },
      {
        path: 'adminusers',
        lazy: async () => ({
          Component: (await import('./pages/adminusers')).default,
        }),
      },
      {
        path: 'viewusers',
        lazy: async () => ({
          Component: (await import('./pages/viewusers')).default,
        }),
      },
      {
        path: 'settings',
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
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'about',
            lazy: async () => ({
              Component: (await import('./pages/settings/about')).default,
            }),
          },
        ],
      },
    ],
  },
  {
    path: 'pmslogin',
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
