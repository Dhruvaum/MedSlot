import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BackgroundDecoration from '../../components/BackgroundDecoration'

const PatientLayout = () => {
  return (
    <>
      <div className="flex min-h-screen overflow-hidden">
        <BackgroundDecoration />
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className='flex-1 p-6 overflow-y-auto'>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default PatientLayout