import { Home, CalendarClock, User } from 'lucide-react'
import Sidebar, { type SidebarNavItem } from '../../../components/Sidebar'

const navItems: SidebarNavItem[] = [
    { to: '/doctor', label: 'Home', end: true, icon: Home },
    { to: '/doctor/availability', label: 'Availability', end: false, icon: CalendarClock },
    { to: '/doctor/profile', label: 'Profile', end: false, icon: User },
]

const DoctorSidebar = () => <Sidebar navItems={navItems} homePath="/doctor" />

export default DoctorSidebar
