import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BackgroundDecoration from '../../components/BackgroundDecoration'

const SupportLayout = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <BackgroundDecoration />
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className='flex-1 overflow-y-auto bg-brand/10 p-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default SupportLayout
