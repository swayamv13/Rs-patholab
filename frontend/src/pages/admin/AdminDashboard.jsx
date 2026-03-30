import React, { useState, useEffect } from 'react'
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import AdminCatalog from './AdminCatalog'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ onLogout }) => {
  const location = useLocation()
  const links = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/catalog', icon: '🧾', label: 'Tests & rates' },
    { to: '/admin/appointments', icon: '📅', label: 'Appointments' },
    { to: '/admin/home-visits', icon: '🏠', label: 'Home Visit Requests' },
    { to: '/admin/patients', icon: '👥', label: 'Patients' },
  ]
  return (
    <aside className='w-64 bg-blue-900 min-h-screen flex flex-col flex-shrink-0'>
      <div className='p-6 border-b border-blue-800'>
        <div className='flex items-center gap-3'>
          <span className='text-3xl'>🧪</span>
          <div>
            <p className='text-white font-extrabold text-lg leading-tight'>RS Path Lab</p>
            <p className='text-blue-300 text-xs'>Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className='flex-1 p-4 space-y-1'>
        {links.map(l => (
          <Link key={l.to} to={l.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all
              ${location.pathname === l.to ? 'bg-white text-blue-900 shadow-md' : 'text-blue-100 hover:bg-blue-800'}`}>
            <span className='text-xl'>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className='p-4 border-t border-blue-800'>
        <a href='/' className='block text-center text-blue-300 hover:text-white text-sm mb-2'>← Main Website</a>
        <button onClick={onLogout}
          className='w-full text-red-300 hover:text-white hover:bg-red-600/30 py-2 rounded-xl text-sm font-bold transition-all'>
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}

// ============================================================
// STATS CARD
// ============================================================
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${color} flex items-start gap-4`}>
    <div className='text-4xl'>{icon}</div>
    <div>
      <p className='text-3xl font-extrabold text-gray-900'>{value}</p>
      <p className='text-sm font-bold text-gray-700'>{label}</p>
      {sub && <p className='text-xs text-gray-400 mt-0.5'>{sub}</p>}
    </div>
  </div>
)

// ============================================================
// DASHBOARD HOME
// ============================================================
const DashboardHome = ({ appointments, visits }) => {
  const totalRevenue = appointments.filter(a => a.payment).reduce((s, a) => s + a.amount, 0)
  const pending = appointments.filter(a => !a.payment && a.status !== 'Cancelled').length
  const confirmed = appointments.filter(a => a.payment).length
  const today = new Date().toDateString()
  const todayBookings = appointments.filter(a => new Date(a.createdAt).toDateString() === today).length

  const recent = [...appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, Admin 👋</h1>
        <p className='text-gray-500 text-sm'>Here's what's happening at RS Path Lab today.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
        <StatCard icon='📅' label='Total Bookings' value={appointments.length} sub='All time' color='border-blue-100' />
        <StatCard icon='✅' label='Confirmed (Paid)' value={confirmed} sub='Marked received at lab' color='border-green-100' />
        <StatCard icon='⏳' label='Pending payment' value={pending} sub='Pay at counter' color='border-yellow-100' />
        <StatCard icon='💰' label='Recorded revenue' value={`₹${totalRevenue.toLocaleString()}`} sub='From completed payments' color='border-purple-100' />
      </div>

      {todayBookings > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3'>
          <span className='text-2xl'>🔔</span>
          <p className='font-semibold text-blue-800'>{todayBookings} new booking{todayBookings > 1 ? 's' : ''} today!</p>
        </div>
      )}

      {/* Recent Appointments */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
          <h2 className='font-bold text-gray-900'>Recent Bookings</h2>
          <Link to='/admin/appointments' className='text-blue-600 text-sm font-semibold hover:underline'>View All →</Link>
        </div>
        <div className='divide-y divide-gray-50'>
          {recent.length === 0 && <p className='px-6 py-8 text-gray-400 text-center'>No bookings yet.</p>}
          {recent.map(app => (
            <div key={app._id} className='px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors'>
              <div>
                <p className='font-semibold text-gray-800 text-sm'>{app.items?.map(i => i.name).join(', ')}</p>
                <p className='text-xs text-gray-400'>{app.address?.name || ''} · {new Date(app.date).toLocaleDateString()} · {app.time}</p>
              </div>
              <div className='text-right'>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${app.payment ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {app.payment ? '✅ Paid' : '⏳ Pending'}
                </span>
                <p className='text-xs text-gray-500 mt-1'>₹{app.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// APPOINTMENTS PAGE
// ============================================================
const AppointmentsPage = ({ appointments, onRefresh }) => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [reportUrlDrafts, setReportUrlDrafts] = useState({})
  const [reportFileDrafts, setReportFileDrafts] = useState({})

  const filtered = appointments.filter(a => {
    const matchSearch = a.items?.some(i => i.name.toLowerCase().includes(search.toLowerCase())) ||
      a.address?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.address?.phone?.includes(search)
    const matchFilter = filter === 'all' || (filter === 'paid' && a.payment) || (filter === 'pending' && !a.payment && a.status !== 'Cancelled') || (filter === 'cancelled' && a.status === 'Cancelled')
    return (search === '' || matchSearch) && matchFilter
  })

  const handleMarkComplete = async (id) => {
    try {
      const { data } = await axios.post(BACKEND_URL + '/api/admin/mark-paid', { appointmentId: id }, {
        headers: { admintoken: localStorage.getItem('adminToken') }
      })
      if (data.success) { toast.success('Marked as paid!'); onRefresh() }
      else toast.error(data.message || 'Failed')
    } catch {
      toast.info('Backend not connected. Update will reflect when backend is running.')
    }
  }

  const handleSetReportUrl = async (appointmentId) => {
    try {
      const reportUrl = (reportUrlDrafts[appointmentId] ?? '').trim()
      if (!reportUrl) {
        toast.error('Please paste a valid report URL')
        return
      }

      const { data } = await axios.post(
        BACKEND_URL + '/api/admin/set-report-url',
        { appointmentId, reportUrl },
        { headers: { admintoken: localStorage.getItem('adminToken') } }
      )

      if (data.success) {
        toast.success('Report link saved.')
        onRefresh()
      } else {
        toast.error(data.message || 'Failed to save report link')
      }
    } catch (e) {
      toast.info('Backend not connected. Update will reflect when backend is running.')
    }
  }

  const handleUploadReport = async (appointmentId) => {
    try {
      const file = reportFileDrafts[appointmentId]
      if (!file) {
        toast.error('Please choose a report file first (PDF or image).')
        return
      }

      const formData = new FormData()
      formData.append('appointmentId', appointmentId)
      formData.append('reportFile', file)

      const { data } = await axios.post(
        BACKEND_URL + '/api/admin/upload-report',
        formData,
        { headers: { admintoken: localStorage.getItem('adminToken') } }
      )

      if (data.success) {
        toast.success('Report uploaded.')
        onRefresh()
        setReportFileDrafts(prev => ({ ...prev, [appointmentId]: null }))
      } else {
        toast.error(data.message || 'Upload failed')
      }
    } catch (e) {
      toast.info('Backend not connected. Update will reflect when backend is running.')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>📅 All Appointments</h1>
        <div className='flex gap-3 flex-wrap'>
          <input
            type='text' placeholder='🔍 Search patient / test...'
            className='border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-56'
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {['all', 'paid', 'pending', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all
                ${filter === f ? 'bg-blue-900 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50 border-b border-gray-100'>
              <tr>
                {['Patient / Test', 'Date & Time', 'Collection', 'Amount', 'Status', 'Action'].map(h => (
                  <th key={h} className='px-6 py-3 text-left font-bold text-gray-500 text-xs uppercase tracking-wider'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className='px-6 py-12 text-center text-gray-400'>No appointments found.</td></tr>
              ) : filtered.map(app => (
                <tr key={app._id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <p className='font-semibold text-gray-800'>{app.address?.name || 'Patient'}</p>
                    <p className='text-xs text-gray-400 mt-0.5 max-w-xs truncate'>{app.items?.map(i => i.name).join(', ')}</p>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <p className='font-medium text-gray-700'>{new Date(app.date).toLocaleDateString('en-IN')}</p>
                    <p className='text-xs text-gray-400'>{app.time}</p>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-xs font-semibold px-2 py-1 rounded-lg bg-blue-50 text-blue-700'>
                      {app.address?.address ? '🏠 Home' : '🏥 Lab'}
                    </span>
                  </td>
                  <td className='px-6 py-4 font-bold text-blue-900'>₹{app.amount}</td>
                  <td className='px-6 py-4'>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      app.payment ? 'bg-green-100 text-green-700' :
                      app.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.payment ? '✅ Paid' : app.status === 'Cancelled' ? '❌ Cancelled' : '⏳ Pending'}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    {!app.payment && app.status !== 'Cancelled' && (
                      <button onClick={() => handleMarkComplete(app._id)}
                        className='text-xs bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors'>
                        Mark Paid
                      </button>
                    )}

                    {app.payment && app.status !== 'Cancelled' && (
                      <div className='mt-3 space-y-2'>
                        <input
                          type='text'
                          placeholder='Paste report URL (PDF link)'
                          value={reportUrlDrafts[app._id] ?? app.reportUrl ?? ''}
                          onChange={(e) => setReportUrlDrafts(prev => ({ ...prev, [app._id]: e.target.value }))}
                          className='w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100'
                        />
                        <button
                          onClick={() => handleSetReportUrl(app._id)}
                          disabled={!(reportUrlDrafts[app._id] ?? app.reportUrl)}
                          className={`w-full text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                            (reportUrlDrafts[app._id] ?? app.reportUrl)
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Save Link
                        </button>

                        {app.reportUrl && (
                          <a
                            href={
                              (() => {
                                const r = app.reportUrl
                                if (!r) return ''
                                const s = String(r)
                                if (s.startsWith('http://') || s.startsWith('https://')) return s
                                if (s.startsWith('/')) return BACKEND_URL + s
                                return `${BACKEND_URL}/${s}`
                              })()
                            }
                            target='_blank'
                            rel='noreferrer'
                            className='block w-full text-center text-xs font-bold px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors'
                          >
                            📄 Download Current Report
                          </a>
                        )}

                        <div className='pt-3 space-y-2 border-t border-gray-100'>
                          <input
                            type='file'
                            accept='application/pdf,image/*'
                            onChange={(e) => {
                              const f = e.target.files && e.target.files.length ? e.target.files[0] : null
                              setReportFileDrafts(prev => ({ ...prev, [app._id]: f }))
                            }}
                            className='w-full text-xs'
                          />
                          <button
                            type='button'
                            onClick={() => handleUploadReport(app._id)}
                            disabled={!reportFileDrafts[app._id]}
                            className={`w-full text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                              reportFileDrafts[app._id]
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Upload Report File
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// HOME VISITS PAGE
// ============================================================
const HomeVisitsPage = ({ visits }) => (
  <div className='space-y-6'>
    <h1 className='text-2xl font-bold text-gray-900'>🏠 Home Visit Requests</h1>
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              {['Name', 'Phone', 'Area', 'Requested On', 'Action'].map(h => (
                <th key={h} className='px-6 py-3 text-left font-bold text-gray-500 text-xs uppercase tracking-wider'>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {visits.length === 0 ? (
              <tr><td colSpan={5} className='px-6 py-12 text-center text-gray-400'>No home visit requests yet.</td></tr>
            ) : visits.map(v => (
              <tr key={v._id} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 font-semibold text-gray-800'>{v.name}</td>
                <td className='px-6 py-4'>
                  <a href={`tel:${v.phone}`} className='text-blue-600 font-bold hover:underline'>{v.phone}</a>
                </td>
                <td className='px-6 py-4 text-gray-600'>{v.city}</td>
                <td className='px-6 py-4 text-gray-400 text-xs'>{new Date(v.createdAt).toLocaleString('en-IN')}</td>
                <td className='px-6 py-4 flex gap-2'>
                  <a href={`tel:${v.phone}`}
                    className='bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors'>
                    📞 Call
                  </a>
                  <a href={`https://wa.me/91${v.phone}?text=Hi ${v.name}, This is RS Path Lab. We received your home visit request for ${v.city}. Our team will visit you soon!`}
                    target='_blank' rel='noreferrer'
                    className='bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors'>
                    💬 WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// ============================================================
// PATIENTS PAGE
// ============================================================
const PatientsPage = ({ appointments }) => {
  // Derive unique patients from appointments
  const patients = Object.values(
    appointments.reduce((acc, app) => {
      const name = app.address?.name || 'Unknown'
      const phone = app.address?.phone || ''
      const key = phone || name
      if (!acc[key]) acc[key] = { name, phone, bookings: 0, spent: 0 }
      acc[key].bookings++
      acc[key].spent += app.amount || 0
      return acc
    }, {})
  ).sort((a, b) => b.bookings - a.bookings)

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>👥 Patients ({patients.length})</h1>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              {['Name', 'Phone', 'Total Bookings', 'Total Spent', 'Action'].map(h => (
                <th key={h} className='px-6 py-3 text-left font-bold text-gray-500 text-xs uppercase tracking-wider'>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {patients.length === 0 ? (
              <tr><td colSpan={5} className='px-6 py-12 text-center text-gray-400'>No patients yet.</td></tr>
            ) : patients.map((p, i) => (
              <tr key={i} className='hover:bg-gray-50'>
                <td className='px-6 py-4 font-semibold text-gray-800'>{p.name}</td>
                <td className='px-6 py-4'><a href={`tel:${p.phone}`} className='text-blue-600 font-bold hover:underline'>{p.phone || '—'}</a></td>
                <td className='px-6 py-4'><span className='bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs'>{p.bookings} bookings</span></td>
                <td className='px-6 py-4 font-bold text-green-700'>₹{p.spent.toLocaleString()}</td>
                <td className='px-6 py-4'>
                  {p.phone && <a href={`https://wa.me/91${p.phone}`} target='_blank' rel='noreferrer'
                    className='bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors'>
                    💬 WhatsApp
                  </a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// MAIN ADMIN DASHBOARD WRAPPER
// ============================================================
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [visits, setVisits] = useState([])
  // Auth guard
  useEffect(() => {
    if (localStorage.getItem('adminToken') !== 'rs_admin_authenticated') {
      navigate('/admin/login')
    }
  }, [navigate])

  const fetchData = async () => {
    try {
      const [appRes, visitRes] = await Promise.all([
        axios.get(BACKEND_URL + '/api/admin/appointments', {
          headers: { admintoken: localStorage.getItem('adminToken') }
        }).catch(() => ({ data: { success: true, appointments: [] } })),
        axios.get(BACKEND_URL + '/api/admin/visits', {
          headers: { admintoken: localStorage.getItem('adminToken') }
        }).catch(() => ({ data: { success: true, visits: [] } }))
      ])
      if (appRes.data.success) setAppointments(appRes.data.appointments || [])
      if (visitRes.data.success) setVisits(visitRes.data.visits || [])
    } catch (err) {
      console.log('Backend not connected — showing empty admin.')
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <ToastContainer position='top-right' autoClose={2500} />
      <Sidebar onLogout={handleLogout} />
      <main className='flex-1 p-8 overflow-auto'>
        <Routes>
          <Route path='dashboard' element={<DashboardHome appointments={appointments} visits={visits} />} />
          <Route path='catalog' element={<AdminCatalog />} />
          <Route path='appointments' element={<AppointmentsPage appointments={appointments} onRefresh={fetchData} />} />
          <Route path='home-visits' element={<HomeVisitsPage visits={visits} />} />
          <Route path='patients' element={<PatientsPage appointments={appointments} />} />
          <Route path='*' element={<DashboardHome appointments={appointments} visits={visits} />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminDashboard
