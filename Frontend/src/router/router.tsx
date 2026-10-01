import { createBrowserRouter } from "react-router-dom"
import Layout from "../components/Layout"
import PatientLayout from "../pages/Patient/PatientLayout"

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                lazy: async () => ({
                    Component: (await import('../pages/Landing/LandingPage')).default
                })
            },
            {
                path: '/signUp',
                lazy: async () => ({
                    Component: (await import('../pages/SignUp/SignUpPage')).default
                })
            },
            {
                path: '/completeProfile',
                lazy: async () => ({
                    Component: (await import('../pages/CompleteProfile/CompleteProfilePage')).default
                })
            },
            {
                path: '/signIn',
                lazy: async () => ({
                    Component: (await import('../pages/SignIn/SignInPage')).default
                })
            }
        ]
    },

    {
        path: '/patient',
        element: <PatientLayout />,
        children: [
            {
                index: true,
                lazy: async () => ({
                    Component: (await import('../pages/Patient/Home/HomePage')).default
                })
            },
            {
                path: 'find-doctor',
                lazy: async () => ({
                    Component: (await import('../pages/Patient/FindDoctor/FindDoctorPage')).default
                })
            },
            {
                path: 'appointments',
                lazy: async () => ({
                    Component: (await import('../pages/Patient/MyAppointments/MyAppointmentsPage')).default
                })
            },
            {
                path: 'transactions',
                lazy: async () => ({
                    Component: (await import('../pages/Patient/Transactions/TransactionsPage')).default
                })
            },
            {
                path: 'profile',
                lazy: async () => ({
                    Component: (await import('../pages/Patient/Profile/ProfilePage')).default
                })
            }
        ]
    },
])

export default router