import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const ADMIN_EMAIL = 'admin@rspathlab.com'
const ADMIN_PASSWORD = 'admin@rs2024'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminToken', 'rs_admin_authenticated')
        toast.success('Welcome, Admin! 👋')
        setTimeout(() => navigate('/admin/dashboard'), 800)
      } else {
        toast.error('Invalid credentials. Please try again.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4'>
      <ToastContainer position='top-right' autoClose={2000} />
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden'>

        {/* Header */}
        <div className='bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-center'>
          <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3'>🧪</div>
          <h1 className='text-2xl font-extrabold text-white'>RS Path Lab</h1>
          <p className='text-blue-200 text-sm mt-1'>Admin Control Panel</p>
        </div>

        {/* Form */}
        <div className='p-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-6 text-center'>Sign in to Admin</h2>
          <form onSubmit={handleLogin} className='space-y-5'>
            <div>
              <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Admin Email</label>
              <input
                type='email' required
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50'
                placeholder='admin@rspathlab.com'
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Password</label>
              <div className='relative'>
                <input
                  type={showPass ? 'text' : 'password'} required
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-base focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50'
                  placeholder='Enter admin password'
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

          <div className='mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
            <p className='text-xs text-gray-500 text-center'>
              Default: <span className='font-mono font-bold text-gray-600'>admin@rspathlab.com</span><br />
              Password: <span className='font-mono font-bold text-gray-600'>admin@rs2024</span>
            </p>
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
