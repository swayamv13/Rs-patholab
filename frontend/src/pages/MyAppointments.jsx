import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { token, backendUrl } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId: id }, { headers: { token } })
      if (data.success) {
        toast.success('Appointment cancelled.')
        fetchAppointments()
      } else {
        toast.error(data.message || 'Could not cancel. Please call us.')
      }
    } catch (error) {
      // Fallback — direct call to lab
      toast.info('Please call +91 95083 83139 to cancel your appointment.')
    }
  }

  useEffect(() => {
    if (token) fetchAppointments()
  }, [token])

  const getStatusColor = (app) => {
    if (app.payment) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: '✅ Paid at lab', dot: 'bg-green-500' }
    if (app.status === 'Cancelled') return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', label: '❌ Cancelled', dot: 'bg-red-500' }
    return { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700', label: '⏳ Pay at counter', dot: 'bg-yellow-500' }
  }

  if (!token) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center bg-gray-50'>
        <div className='text-6xl mb-4'>🔒</div>
        <h2 className='text-2xl font-bold text-gray-700 mb-2'>Please Login to View Appointments</h2>
        <p className='text-gray-500 mb-6'>Your appointments are saved securely in your account.</p>
        <button onClick={() => navigate('/login')} className='bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg'>
          Login Now
        </button>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen py-10'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>My Appointments</h1>
            <p className='text-gray-500 text-sm mt-1'>Track and manage your booked tests</p>
          </div>
          <button
            onClick={() => navigate('/Packages')}
            className='bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-md'
          >
            + Book New Test
          </button>
        </div>

        {loading ? (
          <div className='space-y-4'>
            {[1, 2, 3].map(i => (
              <div key={i} className='bg-white rounded-xl p-6 border border-gray-100 animate-pulse'>
                <div className='h-5 bg-gray-200 rounded w-2/3 mb-3'></div>
                <div className='h-4 bg-gray-100 rounded w-1/3'></div>
              </div>
            ))}
          </div>
        ) : appointments.length > 0 ? (
          <div className='space-y-4'>
            {appointments.map(app => {
              const status = getStatusColor(app)
              const reportHref = (() => {
                const r = app?.reportUrl
                if (!r) return null
                const s = String(r)
                // If backend stores a relative URL like `/uploads/...`, prefix with backend origin.
                if (s.startsWith('http://') || s.startsWith('https://')) return s
                if (s.startsWith('/')) return backendUrl + s
                return `${backendUrl}/${s}`
              })()
              return (
                <div key={app._id} className={`bg-white rounded-2xl shadow-sm border-2 ${status.border} overflow-hidden`}>
                  {/* Status Bar */}
                  <div className={`${status.bg} px-6 py-3 flex items-center justify-between border-b ${status.border}`}>
                    <div className='flex items-center gap-2'>
                      <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`}></span>
                      <span className={`text-sm font-bold ${status.text}`}>{status.label}</span>
                    </div>
                    <span className='text-xs text-gray-400'>Booked on {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className='p-6 flex flex-col md:flex-row gap-4 justify-between'>
                    <div className='flex-1'>
                      <h3 className='font-bold text-lg text-gray-800 mb-3'>
                        {app.items?.map(i => i.name).join(', ')}
                      </h3>
                      <div className='grid grid-cols-2 gap-y-2 text-sm text-gray-600'>
                        <div className='flex items-center gap-2'>📅 <span>{new Date(app.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
                        <div className='flex items-center gap-2'>⏰ <span>{app.time}</span></div>
                        <div className='flex items-center gap-2'>
                          {app.address?.address ? '🏠' : '🏥'}
                          <span>{app.address?.address ? 'Home Collection' : 'Lab Visit'}</span>
                        </div>
                        <div className='flex items-center gap-2'>💰 <span className='font-semibold text-blue-900'>₹{app.amount}</span></div>
                      </div>
                      {app.address?.address && (
                        <p className='text-xs text-gray-400 mt-2 ml-5'>📍 {app.address.address}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-2 min-w-[160px]'>
                      {app.payment && (
                        app.reportUrl
                          ? (
                            <a
                              href={reportHref}
                              target='_blank'
                              rel='noreferrer'
                              className='w-full bg-blue-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-blue-800 transition-all flex items-center justify-center'
                            >
                              📄 Download Report
                            </a>
                          )
                          : (
                            <button
                              type='button'
                              disabled
                              className='w-full bg-gray-100 text-gray-400 text-sm font-bold py-2.5 rounded-xl cursor-not-allowed flex items-center justify-center'
                            >
                              📄 Report will be available soon
                            </button>
                          )
                      )}
                      {app.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancel(app._id)}
                          className='w-full border-2 border-red-200 text-red-600 text-sm font-bold py-2.5 rounded-xl hover:bg-red-50 transition-all'
                        >
                          ✕ Cancel
                        </button>
                      )}
                      <a
                        href='tel:919508383139'
                        className='w-full border-2 border-gray-200 text-gray-600 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-center'
                      >
                        📞 Call Us
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-xl p-12 text-center border border-dashed border-gray-300'>
            <div className='w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6'>📅</div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>No appointments yet</h2>
            <p className='text-gray-500 mb-8 max-w-md mx-auto'>
              You haven't booked any tests yet. It's easy — just browse our packages and book in 2 minutes!
            </p>
            <button
              onClick={() => navigate('/Packages')}
              className='bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-800 transition-all hover:-translate-y-1'
            >
              🧪 Browse Tests & Packages
            </button>
          </div>
        )}

        {/* Help Box */}
        <div className='mt-8 bg-blue-50 rounded-xl p-5 text-center border border-blue-100'>
          <p className='text-blue-800 font-semibold text-sm'>
            Need help with your appointment?{' '}
            <a href='tel:919508383139' className='text-blue-600 font-bold hover:underline'>
              📞 Call +91 95083 83139
            </a>
            {' '}or{' '}
            <a href='https://wa.me/919508383139' target='_blank' rel='noreferrer' className='text-green-600 font-bold hover:underline'>
              💬 WhatsApp Us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default MyAppointments