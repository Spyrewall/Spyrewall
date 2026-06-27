import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ShieldCheck, Check, X, Trash2, Inbox, MapPin, Mail, Phone, Building2, IndianRupee, Users, Clock, Briefcase, Info } from 'lucide-react'

const STORAGE_KEY = 'spyder_sec_postings'
const ADMIN_AUTH_KEY = 'spyder_sec_admin_auth'
const ADMIN_PASSWORD = 'spyder@admin2026'

function loadPostings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function savePostings(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const TABS = [
  { id: 'pending', label: 'Pending Review' },
  { id: 'approved', label: 'Live' },
  { id: 'rejected', label: 'Rejected' },
]

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_AUTH_KEY) === '1')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [postings, setPostings] = useState([])
  const [tab, setTab] = useState('pending')

  useEffect(() => {
    if (authed) setPostings(loadPostings())
  }, [authed])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, '1')
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
    setAuthed(false)
    setPassword('')
  }

  const updateStatus = (id, status) => {
    const updated = loadPostings().map(p => p.id === id ? { ...p, status } : p)
    savePostings(updated)
    setPostings(updated)
  }

  const deletePosting = (id) => {
    if (!confirm('Delete this posting permanently?')) return
    const updated = loadPostings().filter(p => p.id !== id)
    savePostings(updated)
    setPostings(updated)
  }

  const counts = {
    pending: postings.filter(p => p.status === 'pending').length,
    approved: postings.filter(p => p.status === 'approved').length,
    rejected: postings.filter(p => p.status === 'rejected').length,
  }

  const visible = postings.filter(p => p.status === tab)

  if (!authed) {
    return (
      <section className="py-20 min-h-[80vh] flex items-center justify-center" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
        <div className="absolute inset-0 cyber-grid pointer-events-none" style={{ opacity: 0.08 }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md mx-4 p-8"
          style={{
            backgroundColor: 'hsl(0 0% 8%)',
            border: '1px solid hsl(217 91% 60% / 0.3)',
          }}
        >
          <div className="flex flex-col items-center mb-6">
            <div
              className="flex items-center justify-center w-14 h-14 mb-4"
              style={{
                backgroundColor: 'hsl(217 91% 60% / 0.1)',
                border: '1px solid hsl(217 91% 60% / 0.4)',
                color: 'hsl(217 91% 60%)',
              }}
            >
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-display font-bold text-2xl uppercase tracking-widest" style={{ color: 'hsl(0 0% 98%)' }}>
              Admin Access
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest mt-2" style={{ color: 'hsl(0 0% 60%)' }}>
              // restricted area
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'hsl(0 0% 65%)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                autoFocus
                className="w-full px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: 'hsl(0 0% 12%)',
                  color: 'hsl(0 0% 92%)',
                  border: error ? '1px solid hsl(217 91% 60%)' : '1px solid hsl(0 0% 20%)',
                }}
              />
              {error && <p className="text-xs mt-2 font-mono" style={{ color: 'hsl(217 91% 70%)' }}>{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full cyber-clip-button inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
            >
              <ShieldCheck className="w-4 h-4" /> Authenticate
            </button>
          </form>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="py-16 relative overflow-hidden min-h-[80vh]" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
      <div className="absolute inset-0 cyber-grid pointer-events-none" style={{ opacity: 0.08 }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-mono uppercase tracking-widest mb-2" style={{ color: 'hsl(217 91% 60%)' }}>
              // admin panel
            </p>
            <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-wider" style={{ color: 'hsl(0 0% 98%)' }}>
              Recruiter Posting Requests
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-mono uppercase tracking-widest px-4 py-2 transition-colors"
            style={{ color: 'hsl(0 0% 65%)', border: '1px solid hsl(0 0% 25%)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'hsl(217 91% 60%)'; e.currentTarget.style.borderColor = 'hsl(217 91% 60%)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'hsl(0 0% 65%)'; e.currentTarget.style.borderColor = 'hsl(0 0% 25%)' }}
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" style={{ borderBottom: '1px solid hsl(0 0% 18%)' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-5 py-3 text-sm font-mono uppercase tracking-widest transition-all"
              style={{
                color: tab === t.id ? 'hsl(217 91% 60%)' : 'hsl(0 0% 65%)',
                borderBottom: tab === t.id ? '2px solid hsl(217 91% 60%)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {t.label} <span className="ml-1 text-xs opacity-70">({counts[t.id]})</span>
            </button>
          ))}
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {visible.length === 0 ? (
              <div className="p-10 text-center" style={{ backgroundColor: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}>
                <Inbox className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(0 0% 30%)' }} />
                <p className="text-base" style={{ color: 'hsl(0 0% 70%)' }}>
                  No {tab} requests.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visible.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                    style={{
                      backgroundColor: 'hsl(0 0% 8%)',
                      border: '1px solid hsl(217 91% 60% / 0.2)',
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span
                            className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest"
                            style={{
                              backgroundColor: p.type === 'internship' ? 'hsl(200 100% 50% / 0.15)' : 'hsl(217 91% 60% / 0.15)',
                              color: p.type === 'internship' ? 'hsl(200 100% 65%)' : 'hsl(217 91% 70%)',
                              border: `1px solid ${p.type === 'internship' ? 'hsl(200 100% 50% / 0.4)' : 'hsl(217 91% 60% / 0.4)'}`,
                            }}
                          >
                            {p.type}
                          </span>
                          <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                            {new Date(p.postedAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg uppercase tracking-wider mb-1" style={{ color: 'hsl(0 0% 98%)' }}>
                          {p.role}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: 'hsl(217 91% 60%)' }}>
                          <Building2 className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                          {p.company}
                        </p>
                      </div>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid hsl(0 0% 18%)' }}>
                      {p.location && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono" style={{ backgroundColor: 'hsl(0 0% 12%)', color: 'hsl(0 0% 80%)', border: '1px solid hsl(0 0% 22%)' }}>
                          <MapPin className="w-3 h-3" /> {p.location}
                        </span>
                      )}
                      {p.vacancies && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono" style={{ backgroundColor: 'hsl(0 0% 12%)', color: 'hsl(0 0% 80%)', border: '1px solid hsl(0 0% 22%)' }}>
                          <Users className="w-3 h-3" /> {p.vacancies} vacanc{p.vacancies === '1' ? 'y' : 'ies'}
                        </span>
                      )}
                      {p.type === 'internship' && p.duration && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono" style={{ backgroundColor: 'hsl(0 0% 12%)', color: 'hsl(0 0% 80%)', border: '1px solid hsl(0 0% 22%)' }}>
                          <Clock className="w-3 h-3" /> {p.duration}
                        </span>
                      )}
                      {p.type === 'job' && p.experienceType && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono" style={{ backgroundColor: 'hsl(0 0% 12%)', color: 'hsl(0 0% 80%)', border: '1px solid hsl(0 0% 22%)' }}>
                          <Briefcase className="w-3 h-3" /> {p.experienceType === 'freshers' ? 'Freshers' : `${p.minExperience}+ exp`}
                        </span>
                      )}
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase"
                        style={{
                          backgroundColor: p.paid ? 'hsl(140 70% 40% / 0.12)' : 'hsl(0 0% 12%)',
                          color: p.paid ? '#22c55e' : 'hsl(0 0% 70%)',
                          border: p.paid ? '1px solid hsl(140 70% 40% / 0.5)' : '1px solid hsl(0 0% 22%)',
                        }}
                      >
                        <IndianRupee className="w-3 h-3" /> {p.paid ? `${p.amountPerMonth} / month` : 'Unpaid'}
                      </span>
                    </div>

                    {/* Recruiter contact */}
                    <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'hsl(0 0% 55%)' }}>Recruiter Contact</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm mb-4" style={{ color: 'hsl(0 0% 85%)' }}>
                      <span>{p.recruiterName}</span>
                      <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 hover:underline" style={{ color: 'hsl(217 91% 70%)' }}>
                        <Mail className="w-3.5 h-3.5" /> {p.email}
                      </a>
                      {p.phone && (
                        <span className="flex items-center gap-1.5" style={{ color: 'hsl(0 0% 75%)' }}>
                          <Phone className="w-3.5 h-3.5" /> {p.phone}
                        </span>
                      )}
                    </div>

                    {/* Sections */}
                    {p.aboutJob && (
                      <div className="mb-3">
                        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'hsl(217 91% 60%)' }}>About the {p.type === 'internship' ? 'Internship' : 'Job'}</p>
                        <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>{p.aboutJob}</p>
                      </div>
                    )}
                    {p.requirements && (
                      <div className="mb-3">
                        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'hsl(217 91% 60%)' }}>Requirements</p>
                        <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>{p.requirements}</p>
                      </div>
                    )}
                    {p.aboutCompany && (
                      <div className="mb-3">
                        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'hsl(217 91% 60%)' }}>About {p.company}</p>
                        <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>{p.aboutCompany}</p>
                      </div>
                    )}
                    {p.additionalInfo && (
                      <div className="mb-5">
                        <p className="text-xs font-mono uppercase tracking-widest mb-1 flex items-center gap-1.5" style={{ color: 'hsl(217 91% 60%)' }}>
                          <Info className="w-3.5 h-3.5" /> Additional Info
                        </p>
                        <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>{p.additionalInfo}</p>
                      </div>
                    )}
                    {!p.aboutJob && p.description && (
                      <div className="mb-5">
                        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'hsl(217 91% 60%)' }}>Description</p>
                        <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>{p.description}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {p.status !== 'approved' && (
                        <button
                          onClick={() => updateStatus(p.id, 'approved')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                          style={{ backgroundColor: '#22c55e', color: '#000' }}
                          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(p.id, 'rejected')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                          style={{ backgroundColor: 'hsl(0 0% 18%)', color: 'hsl(0 0% 90%)', border: '1px solid hsl(0 0% 30%)' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(217 91% 60%)'; e.currentTarget.style.color = 'hsl(217 91% 60%)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(0 0% 30%)'; e.currentTarget.style.color = 'hsl(0 0% 90%)' }}
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      )}
                      {p.status === 'pending' ? null : (
                        <button
                          onClick={() => updateStatus(p.id, 'pending')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                          style={{ backgroundColor: 'transparent', color: 'hsl(0 0% 70%)', border: '1px solid hsl(0 0% 25%)' }}
                        >
                          Move to Pending
                        </button>
                      )}
                      <button
                        onClick={() => deletePosting(p.id)}
                        className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-widest transition-all"
                        style={{ color: 'hsl(0 0% 50%)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'hsl(217 91% 60%)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'hsl(0 0% 50%)'}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
