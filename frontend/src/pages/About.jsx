import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className='bg-gray-50 min-h-screen'>

      {/* Hero Banner */}
      <div className='bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4'>
        <div className='max-w-5xl mx-auto text-center'>
          <div className='inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4'>
            🧪 Established in Jamshedpur
          </div>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>About RS Path Lab</h1>
          <p className='text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed'>
            Bringing accurate, affordable, and accessible diagnostic services to every home in Jamshedpur.
          </p>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 py-12 space-y-12'>

        {/* Who We Are */}
        <div className='bg-white rounded-2xl shadow-md p-8 md:p-10 border border-gray-100'>
          <div className='flex flex-col md:flex-row gap-8 items-start'>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>🏥 Who We Are</h2>
              <p className='text-gray-600 text-base leading-relaxed mb-4'>
                RS Path Lab is a trusted diagnostic center located at Harharguttu Shiv Mandir Chowk, Jamshedpur, Jharkhand.
                We are committed to providing high-quality, reliable, and affordable pathology and imaging services to individuals and families across the city.
              </p>
              <p className='text-gray-600 text-base leading-relaxed'>
                Our lab is equipped with modern diagnostic equipment and now features a state-of-the-art **Digital X-Ray** facility.
                Whether you need a simple blood test or a comprehensive body imaging, we make the process easy.
              </p>
            </div>
            <div className='w-full md:w-72 bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center flex-shrink-0'>
              <div className='text-5xl mb-3'>🔬</div>
              <p className='text-blue-900 text-lg font-bold'>RS Path Lab &amp; Digital X-Ray</p>
              <p className='text-blue-700 text-sm mt-1'>Diagnostic &amp; Imaging Centre</p>
              <hr className='my-4 border-blue-200' />
              <p className='text-gray-600 text-sm font-medium'>Shiv Mandir Chowk, Harharguttu</p>
              <p className='text-gray-600 text-sm'>Jamshedpur, 831002</p>
              <p className='text-gray-600 text-sm mt-2 font-bold text-blue-900'>📞 82102 36683</p>
              <p className='text-gray-600 text-sm font-bold text-blue-900'>📞 90979 56657</p>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { icon: '👨‍👩‍👧‍👦', value: '500+', label: 'Happy Patients' },
            { icon: '🧪', value: '100+', label: 'Tests Available' },
            { icon: '⏱️', value: '24 hrs', label: 'Report Turnaround' },
            { icon: '🏠', value: 'Free', label: 'Home Collection' },
          ].map((stat, i) => (
            <div key={i} className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow'>
              <div className='text-4xl mb-2'>{stat.icon}</div>
              <p className='text-2xl font-extrabold text-blue-900'>{stat.value}</p>
              <p className='text-sm text-gray-500 font-medium mt-1'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Our Services */}
        <div className='bg-white rounded-2xl shadow-md p-8 border border-gray-100'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>🔬 What We Offer</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              { icon: '🩸', title: 'Complete Blood Count (CBC)', desc: 'Detailed analysis of blood cells and components.' },
              { icon: '🩻', title: 'Digital X-Ray', desc: 'Modern digital imaging for fast and clear body scans.' },
              { icon: '🦋', title: 'Thyroid Profile', desc: 'T3, T4, TSH — full thyroid function assessment.' },
              { icon: '🍬', title: 'Diabetes Panel', desc: 'Fasting glucose, HbA1c, post-prandial sugar tests.' },
              { icon: '❤️', title: 'Cardiac & Lipid Profile', desc: 'Cholesterol, triglycerides, and heart risk markers.' },
              { icon: '📦', title: 'Health Checkup Packages', desc: 'Comprehensive full-body wellness packages at great value.' },
            ].map((service, i) => (
              <div key={i} className='flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all'>
                <div className='text-3xl mt-0.5'>{service.icon}</div>
                <div>
                  <h3 className='font-bold text-gray-800 mb-1'>{service.title}</h3>
                  <p className='text-sm text-gray-500'>{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className='bg-blue-900 text-white rounded-2xl p-8 md:p-10'>
          <h2 className='text-2xl font-bold mb-8 text-center'>📋 How to Book a Test</h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {[
              { step: '1', icon: '🛒', title: 'Choose Tests', desc: 'Browse our test catalog and add to cart.' },
              { step: '2', icon: '📅', title: 'Pick a Slot', desc: 'Select a date and time that suits you.' },
              { step: '3', icon: '🏠', title: 'We Come to You', desc: 'Our collector arrives at your doorstep.' },
              { step: '4', icon: '📲', title: 'Get Reports', desc: 'Reports shared within 24 hrs via WhatsApp.' },
            ].map((s) => (
              <div key={s.step} className='text-center'>
                <div className='w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3'>
                  {s.icon}
                </div>
                <span className='inline-block bg-yellow-400 text-blue-900 font-black text-xs px-2 py-0.5 rounded-full mb-2'>
                  Step {s.step}
                </span>
                <h3 className='font-bold text-white mb-1'>{s.title}</h3>
                <p className='text-blue-200 text-sm'>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className='bg-white rounded-2xl shadow-md p-8 border border-gray-100'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>⭐ Why Choose RS Path Lab?</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              'Trained phlebotomists and experienced staff',
              'Modern equipment for accurate results',
              'Home sample collection — no need to travel',
              'Reports delivered via WhatsApp within 24 hours',
              'Affordable pricing with no hidden charges',
              'Serving Jamshedpur families with dedication',
            ].map((point, i) => (
              <div key={i} className='flex items-center gap-3'>
                <span className='w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm flex-shrink-0'>✓</span>
                <p className='text-gray-700 text-sm'>{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='text-center pb-4'>
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>Ready to book your test?</h2>
          <p className='text-gray-500 mb-6'>It only takes 2 minutes. Book online or call us directly.</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={() => navigate('/Packages')}
              className='bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-800 transition-all hover:-translate-y-1'
            >
              🧪 Browse Tests & Packages
            </button>
            <a
              href='tel:918210236683'
              className='border-2 border-blue-900 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all text-center'
            >
              📞 Call 82102 36683
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default About