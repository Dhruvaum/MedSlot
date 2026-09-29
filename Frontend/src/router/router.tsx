import { createBrowserRouter } from "react-router-dom"
import Layout from "../components/Layout"

const router = createBrowserRouter([
    {
        element: <Layout/>,
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
            },
            {
                path: '/patient',
                lazy: async () => ({
                    Component: (await import('../pages/Patient/PatientDashboardPage')).default
                })
            },

        ]
    },
])

export default router