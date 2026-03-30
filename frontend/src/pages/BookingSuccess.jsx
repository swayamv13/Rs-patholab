import React from 'react'
import { useNavigate } from 'react-router-dom'

const BookingSuccess = () => {
  const navigate = useNavigate()
  // Read booking info passed via navigation state
  const booking = JSON.parse(sessionStorage.getItem('lastBooking') || '{}')

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 text-center border border-green-100'>

        {/* Success Icon */}
        <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-bounce'>
          ✅
        </div>

        <h1 className='text-3xl font-extrabold text-gray-900 mb-2'>Booking Confirmed!</h1>
        <p className='text-gray-500 mb-8 text-base'>
          Your appointment has been successfully booked. Our team will contact you shortly.
        </p>

        {/* Booking Details Card */}
        {booking.items && (
          <div className='bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100 space-y-3'>
            <h2 className='font-bold text-gray-800 text-lg mb-4 text-center'>📋 Booking Summary</h2>

            <div className='flex justify-between items-start'>
              <span className='text-gray-500 text-sm'>Test(s) Booked</span>
              <span className='font-semibold text-gray-800 text-sm text-right max-w-[55%]'>
                {booking.items?.map(i => i.name).join(', ')}
              </span>
            </div>
            <hr className='border-gray-200' />
            <div className='flex justify-between'>
              <span className='text-gray-500 text-sm'>📅 Date</span>
              <span className='font-semibold text-gray-800 text-sm'>{booking.date}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500 text-sm'>⏰ Time Slot</span>
              <span className='font-semibold text-gray-800 text-sm'>{booking.time}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500 text-sm'>🏠 Collection</span>
              <span className='font-semibold text-gray-800 text-sm'>{booking.type === 'home' ? 'Home Collection' : 'Visit Lab'}</span>
            </div>
            {booking.address && (
              <div className='flex justify-between items-start'>
                <span className='text-gray-500 text-sm'>📍 Address</span>
                <span className='font-semibold text-gray-800 text-sm text-right max-w-[55%]'>{booking.address}</span>
              </div>
            )}
            <hr className='border-gray-200' />
            <div className='flex justify-between'>
              <span className='text-gray-800 font-bold text-base'>
                {booking.payment ? '💰 Amount Paid' : '🧾 Amount Payable at Counter'}
              </span>
              <span className='font-extrabold text-blue-900 text-lg'>₹{booking.amount}</span>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div className='bg-blue-50 rounded-xl p-5 text-left mb-8 border border-blue-100'>
          <h3 className='font-bold text-blue-900 mb-3'>📌 What happens next?</h3>
          <ul className='space-y-2 text-sm text-blue-800'>
            <li className='flex items-start gap-2'><span>1️⃣</span> Our team will call you to confirm the booking.</li>
            <li className='flex items-start gap-2'><span>2️⃣</span> A sample collector will arrive at your scheduled time.</li>
            <li className='flex items-start gap-2'>
              <span>3️⃣</span> After payment confirmation, you can download your reports from <b>My Appointments</b>.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3'>
          <button
            onClick={() => navigate('/my-appointments')}
            className='flex-1 bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-all shadow-lg'
          >
            📅 View My Appointments
          </button>
          <button
            onClick={() => navigate('/')}
            className='flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-all'
          >
            🏠 Go to Home
          </button>
        </div>

        {/* Help */}
        <p className='text-xs text-gray-400 mt-6'>
          Need help? Call us at{' '}
          <a href='tel:919508383139' className='text-blue-600 font-bold hover:underline'>+91 95083 83139</a>
        </p>
      </div>
    </div>
  )
}

export default BookingSuccess
