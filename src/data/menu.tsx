import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  LinkedIn as LinkedInIcon,
  Schedule as ScheduleIcon,
  Topic as TopicIcon,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';

export const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/user/dashboard' 
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: <PersonIcon />, 
    path: '/user/profile' 
  },
  { 
    id: 'social', 
    label: 'Social Accounts', 
    icon: <LinkedInIcon />, 
    path: '/user/social' 
  },
  { 
    id: 'schedule', 
    label: 'Schedule', 
    icon: <ScheduleIcon />, 
    path: '/user/schedule' 
  },
  {
    id: 'topics',
    label: 'Topics',
    icon: <TopicIcon />,
    path: '/user/topics'
  },
  {
    id: 'plans',
    label: 'Plans',
    icon: <CreditCardIcon />,
    path: '/user/plans'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/user/settings'
  },
];