import { NavLink, useNavigate } from "react-router-dom"
import { Home, Stethoscope, CalendarCheck, Receipt, User } from 'lucide-react'
import Logo from '../../../assets/Logo.png'

const navItems = [
    { to: '/patient', label: 'Home', end: true, icon: Home },
    { to: '/patient/find-doctor', label: 'Find a Doctor', end: false, icon: Stethoscope },
    { to: '/patient/appointments', label: 'My Appointments', end: false, icon: CalendarCheck },
    { to: '/patient/transactions', label: 'Transactions', end: false, icon: Receipt },
    { to: '/patient/profile', label: 'Profile', end: false, icon: User },
]

const Sidebar = () => {

    const navigate = useNavigate();

    return (
        <aside className="flex w-64 flex-col gap-2 border-r border-slate-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-2 hover:cursor-pointer" onClick={() => navigate('/patient')}>
                <img src={Logo} alt="MedSlot logo" className="h-8 w-8" />
                <span className="text-lg font-bold text-slate-800">MedSlot</span>
            </div>
            {
                navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-slate-50'
                                }`
                            }
                        >
                            <Icon size={18}></Icon>
                            {item.label}
                        </NavLink>
                    )
                })
            }
        </aside>
    )
}

export default Sidebar