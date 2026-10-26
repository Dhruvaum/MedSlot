import { ShieldCheck } from 'lucide-react'
import Sidebar, { type SidebarNavItem } from '../../../components/Sidebar'

const navItems: SidebarNavItem[] = [
    { to: '/admin/pending-doctors', label: 'Pending Verifications', end: true, icon: ShieldCheck },
]

const AdminSidebar = () => <Sidebar navItems={navItems} homePath="/admin/pending-doctors" />

export default AdminSidebar
