import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const KINDS = [
  { value: 'pathology', label: 'Lab / Pathology' },
  { value: 'imaging', label: 'Scan / Imaging' },
  { value: 'package', label: 'Package' }
]

const CATEGORY_SLUGS = [
  { value: 'blood-tests', label: 'Blood Tests' },
  { value: 'urine-stool', label: 'Urine & Stool' },
  { value: 'thyroid-diabetes', label: 'Thyroid & Diabetes' },
  { value: 'liver-kidney', label: 'Liver & Kidney' },
  { value: 'infection', label: 'Infection & Dengue' },
  { value: 'heart', label: 'Heart' },
  { value: 'vitamin-d', label: 'Vitamin-D' },
  { value: 'high-fever', label: 'High Fever' },
  { value: 'x-ray', label: 'X-ray Services' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'mri-ct', label: 'MRI & CT Scan' },
  { value: 'womens-health', label: "Women's Health" },
  { value: 'mens-health', label: "Men's Health" },
  { value: 'preventive-packages', label: 'Preventive Packages' }
]

const emptyForm = {
  name: '',
  categorySlug: 'blood-tests',
  categoryLabel: 'Blood Tests',
  kind: 'pathology',
  originalPrice: '',
  discountedPrice: '',
  description: '',
  detail1: 'As per doctor advice',
  detail2: 'Fasting rules may apply',
  detail3: 'Report timing varies',
  active: true
}

const AdminCatalog = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const headers = { admintoken: localStorage.getItem('adminToken') }

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(BACKEND_URL + '/api/admin/tests', { headers })
      if (data.success) setItems(data.items || [])
      else toast.error(data.message)
    } catch {
      toast.error('Could not load catalog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      categorySlug: item.categorySlug,
      categoryLabel: item.categoryLabel || item.categorySlug,
      kind: item.kind || 'pathology',
      originalPrice: String(item.originalPrice),
      discountedPrice: String(item.discountedPrice),
      description: item.description || '',
      detail1: item.details?.[0] || '',
      detail2: item.details?.[1] || '',
      detail3: item.details?.[2] || '',
      active: item.active !== false
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const buildPayload = () => {
    const o = Number(form.originalPrice)
    const d = Number(form.discountedPrice)
    if (!form.name.trim()) {
      toast.error('Name is required')
      return null
    }
    if (Number.isNaN(o) || Number.isNaN(d)) {
      toast.error('Valid prices required')
      return null
    }
    const cat = CATEGORY_SLUGS.find(c => c.value === form.categorySlug)
    return {
      name: form.name.trim(),
      categorySlug: form.categorySlug,
      categoryLabel: (form.categoryLabel || cat?.label || form.categorySlug).trim(),
      kind: form.kind,
      originalPrice: o,
      discountedPrice: d,
      description: form.description.trim(),
      details: [form.detail1, form.detail2, form.detail3].filter(Boolean),
      active: form.active
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = buildPayload()
    if (!payload) return
    try {
      if (editingId) {
        const { data } = await axios.put(BACKEND_URL + '/api/admin/tests/' + editingId, payload, { headers })
        if (data.success) {
          toast.success('Test updated')
          cancelEdit()
          load()
        } else toast.error(data.message)
      } else {
        const { data } = await axios.post(BACKEND_URL + '/api/admin/tests', payload, { headers })
        if (data.success) {
          toast.success('Test added')
          setForm(emptyForm)
          load()
        } else toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message || 'Save failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test from catalog?')) return
    try {
      const { data } = await axios.delete(BACKEND_URL + '/api/admin/tests/' + id, { headers })
      if (data.success) {
        toast.success('Deleted')
        if (editingId === id) cancelEdit()
        load()
      } else toast.error(data.message)
    } catch {
      toast.error('Delete failed')
    }
  }

  const seedDefaults = async () => {
    if (!window.confirm('Load default pathology + imaging list? Only works if catalog is empty (or confirm replace-all in console by sending replaceAll — use empty DB first).')) return
    try {
      const { data } = await axios.post(BACKEND_URL + '/api/admin/tests/seed-defaults', {}, { headers })
      if (data.success) {
        toast.success(data.message)
        load()
      } else {
        toast.info(data.message || 'Seed skipped')
      }
    } catch {
      toast.error('Seed request failed')
    }
  }

  const seedReplace = async () => {
    if (!window.confirm('Replace ALL catalog tests with the default list? This cannot be undone.')) return
    try {
      const { data } = await axios.post(BACKEND_URL + '/api/admin/tests/seed-defaults', { replaceAll: true }, { headers })
      if (data.success) {
        toast.success(data.message)
        load()
      } else toast.error(data.message)
    } catch {
      toast.error('Seed failed')
    }
  }

  const filtered = items.filter(t =>
    !search.trim() || t.name.toLowerCase().includes(search.toLowerCase()) || t.categorySlug?.includes(search.toLowerCase())
  )

  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Tests, scans & rates</h1>
          <p className='text-gray-500 text-sm'>Manage what appears on the main website. Patients pay at the counter only.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <button type='button' onClick={seedDefaults} className='bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-emerald-700'>Load default catalog</button>
          <button type='button' onClick={seedReplace} className='bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-orange-700'>Replace with defaults</button>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
        <h2 className='font-bold text-gray-900 mb-4'>{editingId ? 'Edit test' : 'Add new test / scan'}</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='md:col-span-2'>
            <label className='text-xs font-bold text-gray-500'>Name</label>
            <input className='w-full border rounded-xl px-3 py-2 mt-1' value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder='e.g. CBC, MRI Brain Plain' />
          </div>
          <div>
            <label className='text-xs font-bold text-gray-500'>Category</label>
            <select className='w-full border rounded-xl px-3 py-2 mt-1' value={form.categorySlug}
              onChange={e => {
                const slug = e.target.value
                const c = CATEGORY_SLUGS.find(x => x.value === slug)
                setForm(f => ({ ...f, categorySlug: slug, categoryLabel: c?.label || slug }))
              }}>
              {CATEGORY_SLUGS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className='text-xs font-bold text-gray-500'>Type</label>
            <select className='w-full border rounded-xl px-3 py-2 mt-1' value={form.kind} onChange={e => setForm(f => ({ ...f, kind: e.target.value }))}>
              {KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </div>
          <div>
            <label className='text-xs font-bold text-gray-500'>MRP / List price (₹)</label>
            <input type='number' min='0' className='w-full border rounded-xl px-3 py-2 mt-1' value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} required />
          </div>
          <div>
            <label className='text-xs font-bold text-gray-500'>Offer price (₹)</label>
            <input type='number' min='0' className='w-full border rounded-xl px-3 py-2 mt-1' value={form.discountedPrice} onChange={e => setForm(f => ({ ...f, discountedPrice: e.target.value }))} required />
          </div>
          <div className='md:col-span-2'>
            <label className='text-xs font-bold text-gray-500'>Description</label>
            <textarea className='w-full border rounded-xl px-3 py-2 mt-1' rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className='text-xs font-bold text-gray-500'>Detail line 1</label>
            <input className='w-full border rounded-xl px-3 py-2 mt-1' value={form.detail1} onChange={e => setForm(f => ({ ...f, detail1: e.target.value }))} />
          </div>
          <div>
            <label className='text-xs font-bold text-gray-500'>Detail line 2</label>
            <input className='w-full border rounded-xl px-3 py-2 mt-1' value={form.detail2} onChange={e => setForm(f => ({ ...f, detail2: e.target.value }))} />
          </div>
          <div className='md:col-span-2'>
            <label className='text-xs font-bold text-gray-500'>Detail line 3</label>
            <input className='w-full border rounded-xl px-3 py-2 mt-1' value={form.detail3} onChange={e => setForm(f => ({ ...f, detail3: e.target.value }))} />
          </div>
          <div className='md:col-span-2 flex items-center gap-2'>
            <input id='active' type='checkbox' checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
            <label htmlFor='active' className='text-sm font-medium text-gray-700'>Show on website</label>
          </div>
          <div className='md:col-span-2 flex gap-2'>
            <button type='submit' className='bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800'>{editingId ? 'Update' : 'Add test'}</button>
            {editingId && <button type='button' onClick={cancelEdit} className='border border-gray-300 font-bold px-6 py-3 rounded-xl'>Cancel edit</button>}
          </div>
        </form>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between'>
          <h2 className='font-bold text-gray-900'>All items ({items.length})</h2>
          <input type='search' placeholder='Search…' className='border rounded-xl px-4 py-2 text-sm max-w-xs' value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? (
          <p className='p-8 text-center text-gray-400'>Loading…</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase'>Name</th>
                  <th className='text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase'>Category</th>
                  <th className='text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase'>Type</th>
                  <th className='text-right px-4 py-3 font-bold text-gray-500 text-xs uppercase'>MRP</th>
                  <th className='text-right px-4 py-3 font-bold text-gray-500 text-xs uppercase'>Offer</th>
                  <th className='text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase'>Active</th>
                  <th className='text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className='px-4 py-12 text-center text-gray-400'>No tests. Click &quot;Load default catalog&quot; or add manually.</td></tr>
                ) : filtered.map(t => (
                  <tr key={t.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 font-medium text-gray-800 max-w-xs'>{t.name}</td>
                    <td className='px-4 py-3 text-gray-600'>{t.categorySlug}</td>
                    <td className='px-4 py-3'>{t.kind}</td>
                    <td className='px-4 py-3 text-right'>₹{t.originalPrice}</td>
                    <td className='px-4 py-3 text-right font-bold text-blue-900'>₹{t.discountedPrice}</td>
                    <td className='px-4 py-3'>{t.active !== false ? '✓' : '—'}</td>
                    <td className='px-4 py-3 flex gap-2 flex-wrap'>
                      <button type='button' onClick={() => startEdit(t)} className='text-blue-600 font-bold text-xs'>Edit</button>
                      <button type='button' onClick={() => handleDelete(t.id)} className='text-red-600 font-bold text-xs'>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCatalog
