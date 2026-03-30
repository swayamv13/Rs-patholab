import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth'
import { auth as firebaseAuth, googleProvider, isFirebaseConfigured } from '../firebase'

const Login = () => {
  const [state, setState] = useState('Sign In') // 'Sign In' or 'Sign Up'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return
    const next = sessionStorage.getItem('rs_after_login')
    if (next) {
      sessionStorage.removeItem('rs_after_login')
      navigate(next, { replace: true })
      return
    }
    navigate('/')
  }, [token, navigate])

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    if (state === 'Sign Up') {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.')
        return
      }
    }
    setLoading(true)
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully! Welcome 🎉')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Logged in successfully!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured() || !firebaseAuth) {
      toast.error('Google sign-in is not configured. Add Firebase env vars in `frontend/.env`.')
      return
    }

    setLoading(true)
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider)
      const idToken = await result.user.getIdToken()

      const { data } = await axios.post(backendUrl + '/api/auth/firebase', { idToken })
      if (!data.success) {
        toast.error(data.message || 'Google sign-in failed')
        return
      }
      localStorage.setItem('token', data.token)
      setToken(data.token)
      toast.success('Logged in successfully!')
    } catch (e) {
      toast.error(e?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center section-padding py-10 bg-gray-50'>
      <div className='bg-white rounded-2xl shadow-2xl flex overflow-hidden max-w-4xl w-full border border-gray-100'>

        {/* Left Side - Decorative */}
        <div className='hidden md:flex w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 p-10 flex-col justify-between relative overflow-hidden'>
          <div className='z-10'>
            <div className='w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6'>🧪</div>
            <h2 className='text-3xl font-bold text-white mb-3'>
              {state === 'Sign Up' ? 'Join Us Today' : 'Welcome Back'}
            </h2>
            <p className='text-blue-100 text-base leading-relaxed'>
              {state === 'Sign Up'
                ? 'Create your account and start booking diagnostic tests from the comfort of your home.'
                : 'Log in to view your appointments, test reports, and manage your health profile.'}
            </p>
          </div>
          <div>
            <div className='flex items-center gap-3 bg-white/10 rounded-xl p-4 mb-3'>
              <span className='text-2xl'>🏠</span>
              <p className='text-white text-sm font-medium'>Home Sample Collection Available</p>
            </div>
            <div className='flex items-center gap-3 bg-white/10 rounded-xl p-4'>
              <span className='text-2xl'>📋</span>
              <p className='text-white text-sm font-medium'>Reports Ready Within 24 Hours</p>
            </div>
          </div>
          <div className='absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl'></div>
        </div>

        {/* Right Side - Form */}
        <div className='w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>
              {state === 'Sign Up' ? 'Create your account' : 'Login to your account'}
            </h2>
            <p className='text-gray-500 text-sm'>
              {state === 'Sign Up' ? 'Fill in your details below' : 'Enter your email and password'}
            </p>
          </div>

          {/* Google sign-in */}
          <div className='space-y-3 mb-6'>
            <button
              type='button'
              disabled={loading}
              onClick={handleGoogleLogin}
              className='w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60'
            >
              Continue with Google
            </button>
            <div className='flex items-center gap-3'>
              <div className='h-px bg-gray-200 flex-1' />
              <span className='text-xs text-gray-400 font-semibold'>OR</span>
              <div className='h-px bg-gray-200 flex-1' />
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className='flex flex-col gap-5'>
            {state === 'Sign Up' && (
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Full Name</label>
                <input
                  required
                  type='text'
                  placeholder='e.g. Ramesh Kumar'
                  className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-base transition-all'
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Email Address</label>
              <input
                required
                type='email'
                placeholder='e.g. ramesh@gmail.com'
                className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-base transition-all'
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className='flex justify-between items-center mb-1.5'>
                <label className='block text-sm font-semibold text-gray-700'>Password</label>
                {state === 'Sign In' && (
                  <button
                    type='button'
                    onClick={() => toast.info('Please contact us at +91 95083 83139 to reset your password.')}
                    className='text-xs text-blue-600 font-semibold hover:underline'
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className='relative'>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  className='w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-base transition-all'
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl p-1'
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {state === 'Sign Up' && (
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Confirm Password</label>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Re-enter your password'
                  className='w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-base transition-all'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <p className='text-xs text-gray-400 mt-1'>Minimum 6 characters.</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1'
            >
              {loading ? '⏳ Please wait...' : (state === 'Sign Up' ? '✅ Create Account' : '🔑 Login')}
            </button>

            <p className='text-center text-sm text-gray-500'>
              {state === 'Sign Up' ? 'Already have an account? ' : "Don't have an account? "}
              <span
                onClick={() => setState(state === 'Sign Up' ? 'Sign In' : 'Sign Up')}
                className='text-blue-700 font-bold cursor-pointer hover:underline'
              >
                {state === 'Sign Up' ? 'Login here' : 'Sign up for free'}
              </span>
            </p>
          </form>

          <div className='mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100'>
            <p className='text-xs text-blue-800 text-center font-medium'>
              📞 Need help? Call us at <a href='tel:919508383139' className='font-bold hover:underline'>+91 95083 83139</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login