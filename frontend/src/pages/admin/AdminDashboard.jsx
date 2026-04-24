import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import AdminCatalog from './AdminCatalog'

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/$/, '')

// ============================================================
// ROLE HELPERS
// ============================================================
const getRole = () => localStorage.getItem('adminRole') || 'superadmin'
const isSuperAdmin = () => getRole() === 'superadmin'
const canManageReports = () => ['superadmin', 'technician'].includes(getRole())
const canMarkPaid = () => ['superadmin', 'receptionist'].includes(getRole())

// ============================================================
// CONFIRMATION MODAL
// ============================================================
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) => {
  if (!isOpen) return null
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6'>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-red-100' : 'bg-blue-100'}`}>
          <span className='text-2xl'>{danger ? '⚠️' : '✅'}</span>
        </div>
        <h3 className='text-lg font-extrabold text-gray-900 mb-1'>{title}</h3>
        <p className='text-gray-500 text-sm mb-6'>{message}</p>
        <div className='flex gap-3'>
          <button onClick={onCancel} className='flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors'>
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SKELETON LOADER
// ============================================================
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
)

const DashboardSkeleton = () => (
  <div className='space-y-8'>
    <div className='space-y-2'><Skeleton className='h-8 w-72' /><Skeleton className='h-4 w-52' /></div>
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
      {[...Array(4)].map((_, i) => <Skeleton key={i} className='h-28 w-full' />)}
    </div>
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <Skeleton className='h-64 w-full' /><Skeleton className='h-64 w-full' />
    </div>
    <Skeleton className='h-72 w-full' />
  </div>
)

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ onLogout, isMobileOpen, setMobileOpen }) => {
  const location = useLocation()
  const role = getRole()
  const links = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard', roles: ['superadmin', 'receptionist', 'technician'] },
    { to: '/admin/catalog', icon: '🧾', label: 'Tests & rates', roles: ['superadmin'] },
    { to: '/admin/appointments', icon: '📅', label: 'Appointments', roles: ['superadmin', 'receptionist', 'technician'] },
    { to: '/admin/home-visits', icon: '🏠', label: 'Home Visit Requests', roles: ['superadmin', 'receptionist'] },
    { to: '/admin/chatbot-leads', icon: '🤖', label: 'Chatbot Leads', roles: ['superadmin', 'receptionist'] },
    { to: '/admin/patients', icon: '👥', label: 'Patients', roles: ['superadmin'] },
  ].filter(l => l.roles.includes(role))

  const roleBadge = { superadmin: '👑 Super Admin', receptionist: '📋 Receptionist', technician: '🔬 Technician' }[role] || role

  return (
    <>
      {isMobileOpen && (
        <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-900 min-h-screen flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className='p-6 border-b border-blue-800 flex justify-between items-start'>
          <div className='flex items-center gap-3'>
            <span className='text-3xl'>🧪</span>
            <div>
              <p className='text-white font-extrabold text-lg leading-tight'>RS Path Lab</p>
              <p className='text-blue-300 text-xs'>{roleBadge}</p>
            </div>
          </div>
          <button className='lg:hidden text-white/70 hover:text-white' onClick={() => setMobileOpen(false)}>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all
                ${location.pathname === l.to ? 'bg-white text-blue-900 shadow-md' : 'text-blue-100 hover:bg-blue-800'}`}>
              <span className='text-xl'>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className='p-4 border-t border-blue-800'>
          <a href='/' className='block text-center text-blue-300 hover:text-white text-sm mb-2'>← Main Website</a>
          <button onClick={onLogout} className='w-full text-red-300 hover:text-white hover:bg-red-600/30 py-2 rounded-xl text-sm font-bold transition-all'>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  )
}

// ============================================================
// STATS CARD
// ============================================================
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${color} flex items-start gap-4 hover:shadow-md transition-shadow`}>
    <div className='text-4xl'>{icon}</div>
    <div>
      <p className='text-3xl font-extrabold text-gray-900'>{value}</p>
      <p className='text-sm font-bold text-gray-700'>{label}</p>
      {sub && <p className='text-xs text-gray-400 mt-0.5'>{sub}</p>}
    </div>
  </div>
)

// ============================================================
// DASHBOARD HOME — fetches its own /stats endpoint
// ============================================================
const COLORS = ['#1e40af', '#16a34a', '#ca8a04', '#9333ea', '#dc2626']

const DashboardHome = ({ loading: parentLoading }) => {
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setStatsLoading(true)
      try {
        const { data } = await axios.get(BACKEND_URL + '/api/admin/stats', {
          headers: { admintoken: localStorage.getItem('adminToken') }
        })
        if (data.success) setStats(data)
      } catch { /* offline — stats stay null */ }
      finally { setStatsLoading(false) }
    }
    load()
  }, [])

  if (statsLoading || parentLoading) return <DashboardSkeleton />

  const today = new Date().toDateString()
  const todayBookings = (stats?.daily || []).find(d => {
    const parts = d.label.split(' ')
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) === d.label
  })?.bookings || 0

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, Admin 👋</h1>
        <p className='text-gray-500 text-sm'>Here's what's happening at RS Path Lab today.</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        <StatCard icon='📅' label='Total Bookings' value={stats?.total ?? '—'} sub='All time' color='border-blue-100' />
        <StatCard icon='✅' label='Confirmed (Paid)' value={stats?.paid ?? '—'} sub='Marked received at lab' color='border-green-100' />
        <StatCard icon='⏳' label='Pending payment' value={stats?.pending ?? '—'} sub='Pay at counter' color='border-yellow-100' />
        <StatCard icon='💰' label='Recorded revenue' value={stats ? `₹${stats.totalRevenue.toLocaleString()}` : '—'} sub='From completed payments' color='border-purple-100' />
      </div>

      {todayBookings > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3'>
          <span className='text-2xl'>🔔</span>
          <p className='font-semibold text-blue-800'>{todayBookings} new booking{todayBookings > 1 ? 's' : ''} today!</p>
        </div>
      )}

      {stats && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Revenue & Bookings Bar */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5'>
            <h2 className='font-bold text-gray-900 mb-4'>📈 Last 7 Days — Revenue & Bookings</h2>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart data={stats.daily} barSize={12}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis dataKey='label' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n) => n === 'revenue' ? `₹${v}` : v} />
                <Bar dataKey='revenue' name='Revenue (₹)' fill='#1e40af' radius={[4, 4, 0, 0]} />
                <Bar dataKey='bookings' name='Bookings' fill='#93c5fd' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Tests Pie */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5'>
            <h2 className='font-bold text-gray-900 mb-4'>🧪 Top Tests Booked</h2>
            {stats.topTests?.length > 0 ? (
              <ResponsiveContainer width='100%' height={220}>
                <PieChart>
                  <Pie data={stats.topTests} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={80}
                    label={({ name, percent }) => `${name.length > 12 ? name.slice(0,12)+'…' : name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}>
                    {stats.topTests.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className='text-gray-400 text-center py-16 text-sm'>No test data yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Link to='/admin/appointments' className='bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all flex items-center gap-4'>
          <span className='text-3xl'>📅</span>
          <div><p className='font-bold text-gray-800'>Appointments</p><p className='text-xs text-gray-400'>View & manage bookings</p></div>
        </Link>
        <Link to='/admin/home-visits' className='bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all flex items-center gap-4'>
          <span className='text-3xl'>🏠</span>
          <div><p className='font-bold text-gray-800'>Home Visits</p><p className='text-xs text-gray-400'>Pending visit requests</p></div>
        </Link>
        <Link to='/admin/patients' className='bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all flex items-center gap-4'>
          <span className='text-3xl'>👥</span>
          <div><p className='font-bold text-gray-800'>Patients</p><p className='text-xs text-gray-400'>Patient records</p></div>
        </Link>
      </div>
    </div>
  )
}

// ============================================================
// PAGINATION CONTROLS
// ============================================================
const Pagination = ({ page, totalPages, onPage }) => {
  if (totalPages <= 1) return null
  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)
  // Show up to 5 page buttons around current
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
  return (
    <div className='flex items-center justify-center gap-2 pt-4 pb-2 flex-wrap'>
      <button disabled={page === 1} onClick={() => onPage(page - 1)}
        className='px-3 py-2 rounded-lg text-sm font-bold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
        ← Prev
      </button>
      {visible.map((p, idx) => {
        const prev = visible[idx - 1]
        return (
          <React.Fragment key={p}>
            {prev && p - prev > 1 && <span className='text-gray-400 text-sm'>…</span>}
            <button onClick={() => onPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${p === page ? 'bg-blue-900 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {p}
            </button>
          </React.Fragment>
        )
      })}
      <button disabled={page === totalPages} onClick={() => onPage(page + 1)}
        className='px-3 py-2 rounded-lg text-sm font-bold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
        Next →
      </button>
      <span className='text-xs text-gray-400 ml-2'>Page {page} of {totalPages}</span>
    </div>
  )
}

// ============================================================
// APPOINTMENTS PAGE — server-side paginated
// ============================================================
const AppointmentsPage = () => {
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('all')
  const [page, setPage]               = useState(1)
  const [loading, setLoading]         = useState(true)
  const [appointments, setAppts]      = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [total, setTotal]             = useState(0)
  const [reportUrlDrafts, setReportUrlDrafts] = useState({})
  const [reportFileDrafts, setReportFileDrafts] = useState({})
  const [modal, setModal]             = useState({ open: false, type: '', id: null, name: '', amount: 0 })
  const [debouncedSearch, setDS]      = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDS(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchPage = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 15, search: debouncedSearch, filter })
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/appointments?${params}`, {
        headers: { admintoken: localStorage.getItem('adminToken') }
      })
      if (data.success) {
        setAppts(data.appointments || [])
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      }
    } catch { toast.info('Backend not connected.') }
    finally { setLoading(false) }
  }, [page, debouncedSearch, filter])

  useEffect(() => { fetchPage() }, [fetchPage])

  const handleFilterChange = (f) => { setFilter(f); setPage(1) }

  const handleMarkPaid = async () => {
    try {
      const { data } = await axios.post(BACKEND_URL + '/api/admin/mark-paid', { appointmentId: modal.id }, {
        headers: { admintoken: localStorage.getItem('adminToken') }
      })
      if (data.success) { toast.success('Marked as paid!'); fetchPage() }
      else toast.error(data.message || 'Failed')
    } catch { toast.info('Backend not connected.') }
    setModal({ open: false })
  }

  const handleCancel = async () => {
    try {
      const { data } = await axios.post(BACKEND_URL + '/api/admin/cancel-appointment', { appointmentId: modal.id }, {
        headers: { admintoken: localStorage.getItem('adminToken') }
      })
      if (data.success) { toast.success('Appointment cancelled.'); fetchPage() }
      else toast.error(data.message || 'Failed')
    } catch { toast.info('Backend not connected.') }
    setModal({ open: false })
  }

  const handleSetReportUrl = async (appointmentId) => {
    const reportUrl = (reportUrlDrafts[appointmentId] ?? '').trim()
    if (!reportUrl) { toast.error('Please paste a valid report URL'); return }
    try {
      const { data } = await axios.post(BACKEND_URL + '/api/admin/set-report-url', { appointmentId, reportUrl }, {
        headers: { admintoken: localStorage.getItem('adminToken') }
      })
      if (data.success) { toast.success('Report link saved.'); fetchPage() }
      else toast.error(data.message)
    } catch { toast.info('Backend not connected.') }
  }

  const handleUploadReport = async (appointmentId) => {
    const file = reportFileDrafts[appointmentId]
    if (!file) { toast.error('Please choose a report file first (PDF or image).'); return }
    const formData = new FormData()
    formData.append('appointmentId', appointmentId)
    formData.append('reportFile', file)
    try {
      const { data } = await axios.post(BACKEND_URL + '/api/admin/upload-report', formData, {
        headers: { admintoken: localStorage.getItem('adminToken') }
      })
      if (data.success) { toast.success('Report uploaded.'); fetchPage(); setReportFileDrafts(p => ({ ...p, [appointmentId]: null })) }
      else toast.error(data.message)
    } catch { toast.info('Backend not connected.') }
  }

  const handleExportCSV = () => {
    const rows = [
      ['Patient Name', 'Phone', 'Tests', 'Date', 'Time', 'Collection', 'Amount', 'Status'],
      ...appointments.map(a => [
        a.address?.name || '', a.address?.phone || '',
        a.items?.map(i => i.name).join(' | ') || '',
        new Date(a.date).toLocaleDateString('en-IN'), a.time || '',
        a.address?.address ? 'Home' : 'Lab', a.amount || 0,
        a.payment ? 'Paid' : a.status === 'Cancelled' ? 'Cancelled' : 'Pending'
      ])
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported!')
  }

  return (
    <>
      <ConfirmModal
        isOpen={modal.open && modal.type === 'pay'}
        title='Mark as Paid?'
        message={`Confirm marking ${modal.name}'s payment of ₹${modal.amount} as received?`}
        confirmLabel='Yes, Mark Paid'
        onConfirm={handleMarkPaid}
        onCancel={() => setModal({ open: false })}
      />
      <ConfirmModal
        isOpen={modal.open && modal.type === 'cancel'}
        title='Cancel Appointment?'
        message={`Are you sure you want to cancel ${modal.name}'s appointment? This cannot be undone.`}
        confirmLabel='Yes, Cancel'
        danger
        onConfirm={handleCancel}
        onCancel={() => setModal({ open: false })}
      />

      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>📅 All Appointments</h1>
            {!loading && <p className='text-xs text-gray-400 mt-1'>{total} total appointments</p>}
          </div>
          <div className='flex gap-3 flex-wrap items-center'>
            <input
              type='text' placeholder='🔍 Search patient / test...'
              className='border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-52'
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {['all', 'paid', 'pending', 'cancelled'].map(f => (
              <button key={f} onClick={() => handleFilterChange(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all
                  ${filter === f ? 'bg-blue-900 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                {f}
              </button>
            ))}
            <button onClick={handleExportCSV}
              className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors'>
              ⬇️ Export CSV
            </button>
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
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}><td colSpan={6} className='px-6 py-3'><Skeleton className='h-10 w-full' /></td></tr>
                  ))
                ) : appointments.length === 0 ? (
                  <tr><td colSpan={6} className='px-6 py-12 text-center text-gray-400'>No appointments found.</td></tr>
                ) : appointments.map(app => (
                  <tr key={app._id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <p className='font-semibold text-gray-800'>{app.address?.name || 'Patient'}</p>
                      <p className='text-xs text-gray-400 mt-0.5 max-w-xs truncate'>{app.items?.map(i => i.name).join(', ')}</p>
                      {app.address?.phone && <p className='text-xs text-blue-500'>{app.address.phone}</p>}
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
                    <td className='px-6 py-4 min-w-[180px]'>
                      <div className='space-y-2'>
                        {/* Mark Paid */}
                        {!app.payment && app.status !== 'Cancelled' && canMarkPaid() && (
                          <button
                            onClick={() => setModal({ open: true, type: 'pay', id: app._id, name: app.address?.name || 'Patient', amount: app.amount })}
                            className='w-full text-xs bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors'>
                            ✅ Mark Paid
                          </button>
                        )}

                        {/* Cancel */}
                        {app.status !== 'Cancelled' && isSuperAdmin() && (
                          <button
                            onClick={() => setModal({ open: true, type: 'cancel', id: app._id, name: app.address?.name || 'Patient', amount: app.amount })}
                            className='w-full text-xs bg-red-50 text-red-600 border border-red-200 font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors'>
                            ❌ Cancel
                          </button>
                        )}

                        {/* WhatsApp notify patient */}
                        {app.address?.phone && (
                          <a
                            href={`https://wa.me/91${app.address.phone}?text=Dear ${app.address?.name || 'Patient'}, your appointment at RS Path Lab on ${new Date(app.date).toLocaleDateString('en-IN')} at ${app.time} is ${app.payment ? 'confirmed ✅' : 'pending payment ⏳'}. Contact us: 8210236683`}
                            target='_blank' rel='noreferrer'
                            className='block w-full text-center text-xs bg-green-50 text-green-700 border border-green-200 font-bold px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors'>
                            💬 Notify Patient
                          </a>
                        )}

                        {/* Report section */}
                        {app.payment && app.status !== 'Cancelled' && canManageReports() && (
                          <div className='space-y-2 pt-2 border-t border-gray-100'>
                            <input type='text' placeholder='Paste report URL'
                              value={reportUrlDrafts[app._id] ?? app.reportUrl ?? ''}
                              onChange={(e) => setReportUrlDrafts(prev => ({ ...prev, [app._id]: e.target.value }))}
                              className='w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-100'
                            />
                            <button onClick={() => handleSetReportUrl(app._id)}
                              disabled={!(reportUrlDrafts[app._id] ?? app.reportUrl)}
                              className={`w-full text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${(reportUrlDrafts[app._id] ?? app.reportUrl) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                              Save Link
                            </button>
                            {app.reportUrl && (
                              <a href={(() => { const r = app.reportUrl; if (!r) return ''; const s = String(r); return (s.startsWith('http') || s.startsWith('data:')) ? s : s.startsWith('/') ? BACKEND_URL + s : `${BACKEND_URL}/${s}` })()}
                                target='_blank' rel='noreferrer'
                                className='block w-full text-center text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors'>
                                📄 Download Report
                              </a>
                            )}
                            <input type='file' accept='application/pdf,image/*'
                              onChange={(e) => { const f = e.target.files?.[0] || null; setReportFileDrafts(p => ({ ...p, [app._id]: f })) }}
                              className='w-full text-xs'
                            />
                            <button type='button' onClick={() => handleUploadReport(app._id)} disabled={!reportFileDrafts[app._id]}
                              className={`w-full text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${reportFileDrafts[app._id] ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                              Upload Report
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>
    </>
  )
}

// ============================================================
// HOME VISITS PAGE
// ============================================================
const HomeVisitsPage = ({ visits, loading }) => {
  if (loading) return <Skeleton className='h-72 w-full' />
  return (
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
                  <td className='px-6 py-4'><a href={`tel:${v.phone}`} className='text-blue-600 font-bold hover:underline'>{v.phone}</a></td>
                  <td className='px-6 py-4 text-gray-600'>{v.city}</td>
                  <td className='px-6 py-4 text-gray-400 text-xs'>{new Date(v.createdAt).toLocaleString('en-IN')}</td>
                  <td className='px-6 py-4 flex gap-2 flex-wrap'>
                    <a href={`tel:${v.phone}`} className='bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors'>📞 Call</a>
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
}

// ============================================================
// PATIENTS PAGE
// ============================================================
const PatientsPage = ({ appointments, loading }) => {
  if (loading) return <Skeleton className='h-72 w-full' />

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
      <p className='text-yellow-600 text-xs bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2'>⚠️ Patient list is derived from current page of appointments. For full patient list, switch to "All" filter on Appointments.</p>
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
// CHATBOT LEADS PAGE
// ============================================================
const ChatbotLeadsPage = ({ leads, loading }) => {
  if (loading) return <Skeleton className='h-72 w-full' />
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>🤖 Chatbot Leads</h1>
      <p className='text-gray-500 text-sm'>Leads automatically captured by the AI Chatbot when patients ask to book a test.</p>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50 border-b border-gray-100'>
              <tr>
                {['Name', 'Phone', 'Test Name', 'Pref. Date', 'Captured On', 'Action'].map(h => (
                  <th key={h} className='px-6 py-3 text-left font-bold text-gray-500 text-xs uppercase tracking-wider'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {leads.length === 0 ? (
                <tr><td colSpan={6} className='px-6 py-12 text-center text-gray-400'>No chatbot leads yet.</td></tr>
              ) : leads.map(l => (
                <tr key={l._id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4 font-semibold text-gray-800'>{l.name}</td>
                  <td className='px-6 py-4'><a href={`tel:${l.phone}`} className='text-blue-600 font-bold hover:underline'>{l.phone}</a></td>
                  <td className='px-6 py-4 font-medium text-purple-700'>{l.testName}</td>
                  <td className='px-6 py-4 text-gray-700 font-medium'>{l.date}</td>
                  <td className='px-6 py-4 text-gray-400 text-xs'>{new Date(l.createdAt).toLocaleString('en-IN')}</td>
                  <td className='px-6 py-4 flex gap-2 flex-wrap'>
                    <a href={`tel:${l.phone}`} className='bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors'>📞 Call</a>
                    <a href={`https://wa.me/91${l.phone}?text=Hi ${l.name}, This is RS Path Lab. We received your request from our AI Assistant to book a test for ${l.testName} on ${l.date}. How can we assist you further?`}
                      target='_blank' rel='noreferrer'
                      className='bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors'>
                      💬 Confirm
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
}

// ============================================================
// MAIN ADMIN DASHBOARD WRAPPER
// ============================================================
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [visits, setVisits]           = useState([])
  const [chatbotLeads, setChatbotLeads] = useState([])
  const [allAppts, setAllAppts]       = useState([])   // for patients page (first page)
  const [loading, setLoading]         = useState(true)
  const [isMobileOpen, setMobileOpen] = useState(false)

  // Auth guard
  useEffect(() => {
    if (localStorage.getItem('adminToken') !== 'rs_admin_authenticated') {
      navigate('/admin/login')
    }
  }, [navigate])

  const fetchBase = useCallback(async () => {
    setLoading(true)
    try {
      const [appRes, visitRes, leadsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/appointments?page=1&limit=50`, {
          headers: { admintoken: localStorage.getItem('adminToken') }
        }).catch(() => ({ data: { success: true, appointments: [] } })),
        axios.get(BACKEND_URL + '/api/admin/visits', {
          headers: { admintoken: localStorage.getItem('adminToken') }
        }).catch(() => ({ data: { success: true, visits: [] } })),
        axios.get(BACKEND_URL + '/api/admin/chatbot-leads', {
          headers: { admintoken: localStorage.getItem('adminToken') }
        }).catch(() => ({ data: { success: true, leads: [] } }))
      ])
      if (appRes.data.success) setAllAppts(appRes.data.appointments || [])
      if (visitRes.data.success) setVisits(visitRes.data.visits || [])
      if (leadsRes.data.success) setChatbotLeads(leadsRes.data.leads || [])
    } catch { console.log('Backend offline.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchBase() }, [fetchBase])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')
    localStorage.removeItem('adminName')
    navigate('/admin/login')
  }

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden relative'>
      <ToastContainer position='top-right' autoClose={2500} />
      <Sidebar onLogout={handleLogout} isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      <main className='flex-1 flex flex-col w-full min-w-0 overflow-y-auto overflow-x-hidden'>
        {/* Mobile Header */}
        <div className='lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b border-gray-200'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>🧪</span>
            <span className='font-bold text-blue-900 text-lg'>RS Path Lab</span>
          </div>
          <button onClick={() => setMobileOpen(true)}
            className='p-2 rounded-lg bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
            </svg>
          </button>
        </div>
        <div className='p-4 lg:p-8 flex-1'>
          <Routes>
            <Route path='dashboard' element={<DashboardHome loading={loading} />} />
            <Route path='catalog' element={<AdminCatalog />} />
            <Route path='appointments' element={<AppointmentsPage />} />
            <Route path='home-visits' element={<HomeVisitsPage visits={visits} loading={loading} />} />
            <Route path='chatbot-leads' element={<ChatbotLeadsPage leads={chatbotLeads} loading={loading} />} />
            <Route path='patients' element={<PatientsPage appointments={allAppts} loading={loading} />} />
            <Route path='*' element={<DashboardHome loading={loading} />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
