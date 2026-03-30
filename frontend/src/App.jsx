import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './pages/Home'
import Packages from './pages/Packages'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import BookingSuccess from './pages/BookingSuccess'
import Navbar from './components/Navbar'
import PackageDetails from './pages/PackageDetails'
import Cart from './pages/Cart'
import Footer from './components/Footer'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

const App = () => {
  return (
    <div className='min-h-screen'>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        {/* Admin Routes - no Navbar/Footer */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/*' element={<AdminDashboard />} />

        {/* Main App Routes - with Navbar + Footer */}
        <Route path='*' element={
          <>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='Packages' element={<Packages />} />
              <Route path='Packages/:speciality' element={<Packages />} />
              <Route path='login' element={<Login />} />
              <Route path='about' element={<About />} />
              <Route path='contact' element={<Contact />} />
              <Route path='my-profile' element={<MyProfile />} />
              <Route path='my-appointments' element={<MyAppointments />} />
              <Route path='book/:testId' element={<PackageDetails />} />
              <Route path='cart' element={<Cart />} />
              <Route path='appointment' element={<Appointment />} />
              <Route path='booking-success' element={<BookingSuccess />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App