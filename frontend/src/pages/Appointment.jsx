import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const BOOKING_RESUME_KEY = 'rs_booking_resume'
const AFTER_LOGIN_PATH_KEY = 'rs_after_login'

const readBookingResume = () => {
  try {
    const raw = sessionStorage.getItem(BOOKING_RESUME_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeBookingResume = (payload) => {
  sessionStorage.setItem(BOOKING_RESUME_KEY, JSON.stringify(payload))
}

const clearBookingResume = () => sessionStorage.removeItem(BOOKING_RESUME_KEY)

const Appointment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartItems, clearCart } = useContext(CartContext)
  const { token, backendUrl } = useContext(AppContext)

  const [bookingType, setBookingType] = useState('home')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDate, setSelectedDate] = useState(0)
  const [itemsToBook, setItemsToBook] = useState([])
  const [bookingSource, setBookingSource] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    notes: ''
  })

  const { userData } = useContext(AppContext)
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address ? `${userData.address.line1 || ''} ${userData.address.line2 || ''}`.trim() : '',
      }))
    }
  }, [userData])

  useEffect(() => {
    window.scrollTo(0, 0)

    if (location.state?.type === 'cart') {
      if (!cartItems.length) return
      setItemsToBook(cartItems)
      setBookingType('home')
      setBookingSource('cart')
      writeBookingResume({ items: cartItems, bookingType: 'home', source: 'cart' })
      return
    }

    if (location.state?.type && location.state?.package) {
      setBookingType(location.state.type)
      setItemsToBook([location.state.package])
      setBookingSource('package')
      writeBookingResume({
        items: [location.state.package],
        bookingType: location.state.type,
        source: 'package'
      })
      return
    }

    const resume = readBookingResume()
    if (resume?.items?.length) {
      setItemsToBook(resume.items)
      setBookingSource(resume.source === 'cart' ? 'cart' : 'package')
      if (resume.bookingType === 'home' || resume.bookingType === 'lab') setBookingType(resume.bookingType)
      if (typeof resume.selectedDate === 'number') setSelectedDate(resume.selectedDate)
      if (resume.selectedSlot) setSelectedSlot(resume.selectedSlot)
      if (resume.formData && typeof resume.formData === 'object') {
        setFormData(prev => ({ ...prev, ...resume.formData }))
      }
      toast.info('Your booking was restored after sign-in. Please review and continue.')
      return
    }

    navigate('/')
  }, [location.state, cartItems, navigate])

  const calculateTotal = () =>
    itemsToBook.reduce((total, item) => total + (item.discountedPrice || 0), 0)

  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      day: d.toLocaleString('default', { weekday: 'short' }),
      date: d.getDate(),
      fullDate: d
    }
  })

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ]

  const handleBooking = async (e) => {
    e.preventDefault()

    if (!token) {
      writeBookingResume({
        items: itemsToBook,
        bookingType,
        selectedDate,
        selectedSlot,
        formData,
        source: bookingSource || (itemsToBook.length > 1 ? 'cart' : 'package')
      })
      sessionStorage.setItem(AFTER_LOGIN_PATH_KEY, '/appointment')
      toast.info('Please sign in to continue. Your selected tests and details will be kept.')
      navigate('/login')
      return
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot')
      return
    }
    if (bookingType === 'home' && !formData.address) {
      toast.error('Please provide an address for home collection')
      return
    }

    try {
      const { data } = await axios.post(
        backendUrl + '/api/payment/create-order',
        {
          items: itemsToBook,
          amount: calculateTotal(),
          address: formData,
          date: dates[selectedDate].fullDate.toISOString(),
          time: selectedSlot
        },
        { headers: { token } }
      )

      if (!data.success) {
        toast.error(data.message || 'Booking failed')
        return
      }

      toast.success('Booking confirmed! Pay at the lab counter when you visit.')
      clearBookingResume()
      if (bookingSource === 'cart') clearCart()
      sessionStorage.setItem('lastBooking', JSON.stringify({
        items: itemsToBook,
        amount: calculateTotal(),
        date: dates[selectedDate].fullDate.toLocaleDateString(),
        time: selectedSlot,
        type: bookingType,
        address: formData.address,
        paymentMethod: 'Cash',
        payment: false
      }))
      navigate('/booking-success')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Booking error')
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 pt-8 pb-20'>
      <div className='section-padding max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Book Appointment</h1>
          <p className='text-gray-500'>Complete your booking for <span className='font-semibold text-blue-900'>{itemsToBook.length} Test(s)</span>. Payment is <strong>at the counter</strong> only.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs'>1</span>
                Choose Booking Type
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <button
                  type='button'
                  onClick={() => setBookingType('home')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${bookingType === 'home' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <span className='text-2xl'>🏠</span>
                  <span className='font-bold'>Home Collection</span>
                  <span className='text-xs text-gray-500'>We come to you</span>
                </button>
                <button
                  type='button'
                  onClick={() => setBookingType('lab')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${bookingType === 'lab' ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-200 hover:border-emerald-200'}`}
                >
                  <span className='text-2xl'>🏥</span>
                  <span className='font-bold'>Visit Lab</span>
                  <span className='text-xs text-gray-500'>Nearest Center</span>
                </button>
              </div>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs'>2</span>
                Select Date & Time
              </h2>
              <div className='flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide'>
                {dates.map((item, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => setSelectedDate(index)}
                    className={`min-w-[70px] p-3 rounded-lg border text-center transition-all ${selectedDate === index ? 'border-blue-900 bg-blue-900 text-white' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <p className='text-xs opacity-75'>{item.day}</p>
                    <p className='font-bold text-lg'>{item.date}</p>
                  </button>
                ))}
              </div>
              <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => setSelectedSlot(time)}
                    className={`py-2 px-1 rounded-md text-sm font-medium border transition-all ${selectedSlot === time ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs'>3</span>
                Patient Details
              </h2>
              <form onSubmit={handleBooking} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                    <input
                      type='text'
                      required
                      className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                      placeholder='Patient Name'
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                    <input
                      type='tel'
                      required
                      className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                      placeholder='10-digit mobile'
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {bookingType === 'home' && (
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Full Address <span className='text-red-500'>*</span></label>
                      <textarea
                        required
                        rows='3'
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                        placeholder='House No, Street, Area, Landmark...'
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Pincode</label>
                      <input
                        type='text'
                        required
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                        placeholder='Area Pincode'
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {bookingType === 'lab' && (
                  <div className='bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-emerald-800 text-sm'>
                    <p><strong>Note:</strong> Please arrive 10 minutes before your slot at our centre.</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-xl shadow-lg border border-blue-100 sticky top-24'>
              <h3 className='font-bold text-gray-900 mb-4'>Order Summary</h3>
              <div className='mb-4 max-h-60 overflow-y-auto pr-1'>
                {itemsToBook.map((item) => (
                  <div key={item.id || item._id || item.name} className='flex justify-between items-start py-2 border-b border-gray-100 last:border-0'>
                    <div>
                      <p className='font-medium text-gray-800 text-sm'>{item.name}</p>
                      <p className='text-xs text-gray-500'>{bookingType === 'home' ? 'Home Collection' : 'Lab Visit'}</p>
                    </div>
                    <p className='font-bold text-gray-900 text-sm'>₹{item.discountedPrice}</p>
                  </div>
                ))}
              </div>
              <div className='bg-gray-50 p-3 rounded-lg mb-6'>
                <div className='flex justify-between text-sm mb-2'>
                  <span className='text-gray-500'>Date</span>
                  <span className='font-medium'>{dates[selectedDate].fullDate.toLocaleDateString()}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Time</span>
                  <span className='font-medium'>{selectedSlot || 'Select Slot'}</span>
                </div>
              </div>
              <div className='flex justify-between items-center mb-6 pt-2 border-t border-gray-100'>
                <span className='font-bold text-lg'>Total</span>
                <span className='font-black text-2xl text-blue-900'>₹{calculateTotal()}</span>
              </div>
              <p className='text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4'>Pay at the lab counter after your visit (or when the sample is collected). Admin will mark payment as received.</p>
              <button
                type='button'
                onClick={handleBooking}
                className='w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-colors shadow-lg'
              >
                Confirm Booking
              </button>
              <p className='text-center text-xs text-gray-400 mt-4'>By booking, you agree to our Terms & Conditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment
