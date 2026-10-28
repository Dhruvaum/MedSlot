import { Home, Stethoscope, CalendarCheck, Receipt, User } from 'lucide-react'
import Sidebar, { type SidebarNavItem } from '../../../components/Sidebar'

const navItems: SidebarNavItem[] = [
    { to: '/patient', label: 'Home', end: true, icon: Home },
    { to: '/patient/book-doctor', label: 'Book a Doctor', end: false, icon: Stethoscope },
    { to: '/patient/appointments', label: 'My Appointments', end: false, icon: CalendarCheck },
    { to: '/patient/transactions', label: 'Transactions', end: false, icon: Receipt },
    { to: '/patient/profile', label: 'Profile', end: false, icon: User },
]

const PatientSidebar = () => <Sidebar navItems={navItems} homePath="/patient" />

export default PatientSidebar
