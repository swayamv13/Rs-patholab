import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/$/, '')

const ROLE_LABELS = {
  superadmin:   { icon: '👑', label: 'Super Admin',  color: 'text-purple-600' },
  receptionist: { icon: '📋', label: 'Receptionist', color: 'text-blue-600'   },
  technician:   { icon: '🔬', label: 'Lab Technician', color: 'text-green-600'  }
}

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Try backend staff login first
      const { data } = await axios.post(BACKEND_URL + '/api/admin/staff-login', { username, password })
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminRole', data.role)
        localStorage.setItem('adminName', data.name)
        const rInfo = ROLE_LABELS[data.role] || { icon: '👤', label: data.role }
        toast.success(`Welcome, ${data.name}! ${rInfo.icon}`)
        setTimeout(() => navigate('/admin/dashboard'), 700)
      } else {
        toast.error(data.message || 'Invalid credentials.')
        setLoading(false)
      }
    } catch {
      // Fallback: offline mode — check hardcoded credentials
      if (username === 'admin' && password === 'rs_admin_authenticated') {
        localStorage.setItem('adminToken', 'rs_admin_authenticated')
        localStorage.setItem('adminRole', 'superadmin')
        localStorage.setItem('adminName', 'Admin')
        toast.success('Welcome, Admin! 👋')
        setTimeout(() => navigate('/admin/dashboard'), 700)
      } else {
        toast.error('Invalid credentials.')
        setLoading(false)
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4'>
      <ToastContainer position='top-right' autoClose={2000} />
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden'>

        {/* Header */}
        <div className='bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-center'>
          <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3'>🧪</div>
          <h1 className='text-2xl font-extrabold text-white'>RS Path Lab</h1>
          <p className='text-blue-200 text-sm mt-1'>Staff Control Panel</p>
        </div>

        {/* Form */}
        <div className='p-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-6 text-center'>Sign In</h2>
          <form onSubmit={handleLogin} className='space-y-5'>
            <div>
              <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Username</label>
              <input
                type='text' required autoComplete='username'
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50'
                placeholder='Your username'
                value={username} onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Password</label>
              <div className='relative'>
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete='current-password'
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-base focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50'
                  placeholder='Enter password'
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type='button' onClick={() => setShowPass(!showPass)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl p-1'>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type='submit' disabled={loading}
              className='w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-800 transition-all shadow-lg disabled:opacity-60 active:scale-95'>
              {loading ? '⏳ Signing in...' : '🔑 Sign In'}
            </button>
          </form>

          {/* Role legend */}
          <div className='mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1'>
            <p className='text-xs font-bold text-gray-500 mb-2 text-center'>Staff Roles</p>
            {Object.entries(ROLE_LABELS).map(([, { icon, label, color }]) => (
              <p key={label} className={`text-xs text-center ${color} font-semibold`}>{icon} {label}</p>
            ))}
          </div>

          <p className='text-center text-xs text-gray-400 mt-4'>
            <a href='/' className='hover:underline text-blue-500'>← Back to main site</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
