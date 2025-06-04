import { IconBrandProducthunt, IconCalendarBolt, IconChecklist, IconHexagonNumber1, IconHome, IconLiveView, IconMan, IconSettings, IconUser,} from "@tabler/icons-react"
import {UserCircle2Icon } from "lucide-react"


export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Home',
    label: '',
    href: '/',
    icon: <IconHome size={18} />,
  },
  // {
  //   title: 'Dashboard',
  //   label: '',
  //   href: '/dashboard',
  //   icon: <IconLayoutDashboard size={18} />,
  // },
// {
//   title: 'Live Alerts',
//   label: '',
//   href: '/alerts',   // matches the new router path
//   icon: <IconLayoutKanban size={18} />,
// },

  {
  title: 'Stations',
  label: '',
  href: '/Stations',
  icon: <IconChecklist size={18} />,
  sub: [
    {
      title: 'View All',
      label: '',
      href: '/Stations',
      icon: <IconBrandProducthunt size={18} />,
    },
    {
      title: 'Add New',
      label: '',
      href: '/Stations/add-Stations',
      icon: <IconHexagonNumber1 size={18} />,
    },
  ],
},

  {
  title: 'Policeman',
  label: '',
  href: '/constable',
  icon: <IconMan size={18} />,
  sub: [
    {
      title: 'View All',
      label: '',
      href: '/constable',
      icon: <IconBrandProducthunt size={18} />,
    },
    {
      title: 'Add New',
      label: '',
      href: '/constable/add-constable',
      icon: <IconHexagonNumber1 size={18} />,
    },
  ],
},

{
    title: 'Add Duty',
    label: '',
    href: '/duty',
    icon: <IconCalendarBolt size={18} />,
  },
  {
    title: 'Duties',
    label: '',
    href: '/dutydetail',
    icon: <IconUser size={18} />,
  },

  
  // {
  //   title: 'Live Chats',
  //   label: '',
  //   href: '/livechats',
  //   icon: <IconMessages size={18} />,
  // },
  {
    title: 'Generate Users',
    label: '',
    href: '/adminusers',
    icon: <UserCircle2Icon size={18} />,
  },
    {
    title: 'View Users',
    label: '',
    href: '/viewusers',
    icon: <IconLiveView size={18} />,
  },
      {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
  // {
  //   title: 'Logout',
  //   label: '',
  //   href: '/logout',
  //   icon: <IconLogout size={18} />,
  // },
]
