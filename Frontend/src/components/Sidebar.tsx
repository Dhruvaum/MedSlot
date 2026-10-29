import { NavLink, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { useState } from "react"
import Logo from '../assets/Logo.png'

export interface SidebarNavItem {
    to: string
    label: string
    end: boolean
    icon: LucideIcon
}

interface SidebarProps {
    navItems: SidebarNavItem[]
    homePath: string
}

const Sidebar = ({ navItems, homePath }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const navigate = useNavigate()

    const isExpandedView = !isCollapsed || isHovering

    return (
        <aside
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative flex flex-col gap-2 border-r border-slate-100 bg-white p-4 transition-all duration-300 ease-in-out ${isExpandedView ? 'w-64' : 'w-20'
                }`}
        >
            <button
                type="button"
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-brand hover:text-brand hover:cursor-pointer"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div
                className={`mb-6 flex items-center gap-2 px-2 hover:cursor-pointer ${isExpandedView ? '' : 'justify-center'}`}
                onClick={() => navigate(homePath)}
            >
                <img src={Logo} alt="MedSlot logo" className="h-8 w-8 shrink-0" />
                <span
                    className={`overflow-hidden whitespace-nowrap text-lg font-bold text-slate-800 transition-all duration-300 ${isExpandedView ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0'
                        }`}
                >
                    MedSlot
                </span>
            </div>

            {navItems.map((item) => {
                const Icon = item.icon

                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        title={isExpandedView ? undefined : item.label}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isExpandedView ? '' : 'justify-center'
                            } ${isActive ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-slate-50'
                            }`
                        }
                    >
                        <Icon size={18} className="shrink-0" />
                        <span
                            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isExpandedView ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0'
                                }`}
                        >
                            {item.label}
                        </span>
                    </NavLink>
                )
            })}
        </aside>
    )
}

export default Sidebar
