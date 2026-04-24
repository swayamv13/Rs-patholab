import React, { useState, useEffect } from 'react'

/**
 * PWAInstallPrompt
 * Shows a stylish "Add to Home Screen" banner when the browser
 * fires the `beforeinstallprompt` event (Chrome / Edge on Android / desktop).
 * On iOS Safari, shows a manual instruction banner instead.
 */
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('pwa-dismissed')) return

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (standalone) return // Already installed

    if (ios) {
      setIsIOS(true)
      // Show iOS instructions after 3s
      const t = setTimeout(() => setShowBanner(true), 3000)
      return () => clearTimeout(t)
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  if (!showBanner || dismissed) return null

  return (
    <div className='fixed bottom-4 left-4 right-4 z-[200] md:left-auto md:right-6 md:max-w-sm'>
      <div className='bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden'>
        {/* Accent bar */}
        <div className='h-1 bg-gradient-to-r from-blue-900 to-blue-500' />
        <div className='p-4 flex gap-3 items-start'>
          <div className='w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0'>
            <span className='text-2xl'>🧪</span>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-bold text-gray-900 text-sm'>Install RS Path Lab</p>
            {isIOS ? (
              <p className='text-xs text-gray-500 mt-0.5 leading-relaxed'>
                Tap <span className='font-bold text-blue-600'>Share ↑</span> then{' '}
                <span className='font-bold text-blue-600'>Add to Home Screen</span> to install this app.
              </p>
            ) : (
              <p className='text-xs text-gray-500 mt-0.5'>Add to your home screen for quick access to appointments & reports.</p>
            )}
          </div>
          <button onClick={handleDismiss} className='text-gray-400 hover:text-gray-600 text-xl flex-shrink-0 -mt-0.5'>×</button>
        </div>
        {!isIOS && (
          <div className='px-4 pb-4 flex gap-2'>
            <button onClick={handleDismiss}
              className='flex-1 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors'>
              Not now
            </button>
            <button onClick={handleInstall}
              className='flex-1 py-2 rounded-xl text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors'>
              Install App
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PWAInstallPrompt
