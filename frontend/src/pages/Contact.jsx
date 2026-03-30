import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Contact = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Send via WhatsApp since we have no email server
    const msg = `Hi RS Path Lab, I have a query.%0A%0A*Name*: ${form.name}%0A*Phone*: ${form.phone}%0A*Email*: ${form.email}%0A%0A*Message*:%0A${form.message}`
    const url = `https://wa.me/918210236683?text=${msg}`
    window.open(url, '_blank')
    toast.success('Opening WhatsApp to send your message!')
    setForm({ name: '', phone: '', email: '', message: '' })
    setSubmitting(false)
  }

  return (
    <div className='bg-gray-50 min-h-screen'>

      {/* Header */}
      <div className='bg-gradient-to-r from-blue-900 to-blue-700 text-white py-14 px-4 text-center'>
        <h1 className='text-4xl font-extrabold mb-3'>Contact Us</h1>
        <p className='text-blue-100 text-lg max-w-xl mx-auto'>
          We are here to help. Reach out for bookings, queries, or any assistance.
        </p>
      </div>

      <div className='max-w-5xl mx-auto px-4 py-12 space-y-8'>

        {/* Info Cards Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[
            { icon: '📍', title: 'Our Address', lines: ['Harharguttu Shiv Mandir Chowk,', 'Jamshedpur, Jharkhand – 831002'] },
            { icon: '📞', title: 'Call / WhatsApp', lines: ['+91 82102 36683', '+91 90979 56657', 'Mon–Sat: 7:00 AM – 7:00 PM'] },
            { icon: '📧', title: 'Email', lines: ['support@rspathlab.com', 'We reply within 24 hours'] },
          ].map((card, i) => (
            <div key={i} className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow'>
              <div className='text-4xl mb-3'>{card.icon}</div>
              <h3 className='font-bold text-gray-800 mb-2'>{card.title}</h3>
              {card.lines.map((l, j) => <p key={j} className='text-gray-500 text-sm'>{l}</p>)}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

          {/* Contact Form */}
          <div className='bg-white rounded-2xl shadow-md border border-gray-100 p-8'>
            <h2 className='text-xl font-bold text-gray-900 mb-6'>✉️ Send Us a Message</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>Your Name *</label>
                <input required type='text' className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-base'
                  placeholder='e.g. Ramesh Kumar'
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>Mobile Number *</label>
                <input required type='tel' className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-base'
                  placeholder='10-digit mobile number'
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>Email (optional)</label>
                <input type='email' className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-base'
                  placeholder='your@email.com'
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>Your Message *</label>
                <textarea required rows={4} className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none'
                  placeholder='How can we help you?'
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type='submit' disabled={submitting}
                className='w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-all shadow-lg text-base disabled:opacity-60'>
                {submitting ? '⏳ Sending...' : '💬 Send via WhatsApp'}
              </button>
              <p className='text-xs text-gray-400 text-center'>This will open WhatsApp to send your message directly.</p>
            </form>
          </div>

          {/* Map + Opening Hours */}
          <div className='space-y-6'>
            {/* Map Placeholder */}
            <div className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden'>
              <div className='h-56 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center gap-3 border-b border-gray-100'>
                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-4xl'>
                  📍
                </div>
                <div className='text-center'>
                  <p className='font-bold text-blue-900 text-base'>Find Us on the Map</p>
                  <p className='text-gray-500 text-sm mt-1'>LBSM Road, Harharguttu, Jamshedpur</p>
                </div>
              </div>
              <div className='p-4 flex gap-3'>
                <a
                  href='https://maps.google.com/?q=Harharguttu+Shiv+Mandir+Chowk+Jamshedpur'
                  target='_blank'
                  rel='noreferrer'
                  className='flex-1 border-2 border-blue-900 text-blue-900 font-bold py-2.5 rounded-xl text-sm text-center hover:bg-blue-50 transition-all'
                >
                  📍 Get Directions
                </a>
                <a
                  href='tel:918210236683'
                  className='flex-1 bg-blue-900 text-white font-bold py-2.5 rounded-xl text-sm text-center hover:bg-blue-800 transition-all'
                >
                  📞 Call Now
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className='bg-white rounded-2xl shadow-md border border-gray-100 p-6'>
              <h3 className='font-bold text-gray-800 mb-4'>🕐 Opening Hours</h3>
              <div className='space-y-3'>
                {[
                  { day: 'Monday – Saturday', time: '7:00 AM – 7:00 PM', open: true },
                  { day: 'Sunday', time: '7:00 AM – 12:00 PM', open: true },
                  { day: 'Public Holidays', time: 'Please Call First', open: null },
                ].map((h, i) => (
                  <div key={i} className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
                    <span className='text-gray-700 font-medium text-sm'>{h.day}</span>
                    <span className={`text-sm font-semibold ${h.open === true ? 'text-green-600' : h.open === false ? 'text-red-500' : 'text-gray-500'}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className='mt-4 bg-green-50 rounded-xl p-3 text-center border border-green-100'>
                <p className='text-green-700 text-sm font-semibold'>🚶 Walk-ins Welcome!</p>
                <p className='text-green-600 text-xs mt-0.5'>No appointment needed for lab visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact