import { ShieldCheck } from 'lucide-react'
import Sidebar, { type SidebarNavItem } from '../../../components/Sidebar'

const navItems: SidebarNavItem[] = [
    { to: '/support/pending-doctors', label: 'Pending Verifications', end: true, icon: ShieldCheck },
]

const SupportSidebar = () => <Sidebar navItems={navItems} homePath="/support/pending-doctors" />

export default SupportSidebar
