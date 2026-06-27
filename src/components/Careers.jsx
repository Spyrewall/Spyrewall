import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Briefcase, Building2, ArrowLeft, Send, CheckCircle2,
  MapPin, Mail, Inbox, IndianRupee, Calendar, Users, Clock, Info,
} from 'lucide-react'
import { CURATED_POSTINGS } from '../data/postings'

const STORAGE_KEY = 'spyder_sec_postings'
const ADMIN_EMAIL = 'Spyrewall@gmail.com'
const ADMIN_WHATSAPP = '917665140660'

const OPTIONS = [
  {
    id: 'internship',
    title: 'Internship',
    icon: GraduationCap,
    description: 'Browse internship openings posted by recruiters.',
  },
  {
    id: 'job',
    title: 'Jobs',
    icon: Briefcase,
    description: 'Browse full-time job openings posted by recruiters.',
  },
  {
    id: 'recruiter',
    title: 'Register as a Recruiter',
    icon: Building2,
    description: 'Hiring cybersecurity talent? Post an internship or job opening.',
  },
]

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

const initialFormState = {
  postingType: '',
  role: '',
  company: '',
  vacancies: '',
  compensation: 'unpaid',
  amountPerMonth: '',
  duration: '',
  experienceType: 'freshers',
  minExperience: '',
  aboutJob: '',
  requirements: '',
  aboutCompany: '',
  hasAdditionalInfo: 'no',
  additionalInfo: '',
  recruiterName: '',
  email: '',
  phone: '',
  location: '',
}

const inputStyle = {
  backgroundColor: 'hsl(0 0% 12%)',
  color: 'hsl(0 0% 92%)',
  border: '1px solid hsl(0 0% 20%)',
  fontFamily: 'inherit',
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'hsl(0 0% 65%)' }}>
        {label} {required && <span style={{ color: 'hsl(217 91% 60%)' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function Radio({ name, value, current, onChange, children }) {
  const active = current === value
  return (
    <label
      className="flex-1 cursor-pointer px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-center transition-all"
      style={{
        backgroundColor: active ? 'hsl(217 91% 60% / 0.15)' : 'hsl(0 0% 12%)',
        color: active ? 'hsl(217 91% 70%)' : 'hsl(0 0% 70%)',
        border: active ? '1px solid hsl(217 91% 60%)' : '1px solid hsl(0 0% 20%)',
      }}
    >
      <input type="radio" name={name} value={value} checked={active} onChange={onChange} className="sr-only" />
      {children}
    </label>
  )
}

function buildSummary(p) {
  const lines = [
    `New ${p.type === 'internship' ? 'Internship' : 'Job'} Posting Request`,
    `==============================`,
    `Role: ${p.role}`,
    `Company: ${p.company}`,
    `Location: ${p.location}`,
    `Vacancies: ${p.vacancies}`,
    `Compensation: ${p.paid ? `Paid - ${p.amountPerMonth}/month` : 'Unpaid'}`,
  ]
  if (p.type === 'internship') lines.push(`Duration: ${p.duration}`)
  if (p.type === 'job') lines.push(`Experience: ${p.experienceType === 'freshers' ? 'Freshers' : `${p.minExperience}+ years`}`)
  lines.push('', `About the ${p.type === 'internship' ? 'Internship' : 'Job'}:`, p.aboutJob)
  lines.push('', 'Requirements:', p.requirements)
  lines.push('', `About ${p.company}:`, p.aboutCompany)
  if (p.additionalInfo) lines.push('', 'Additional Info:', p.additionalInfo)
  lines.push('', '— Recruiter Contact —')
  lines.push(`Name: ${p.recruiterName}`)
  lines.push(`Email: ${p.email}`)
  if (p.phone) lines.push(`Phone: ${p.phone}`)
  lines.push('', `Submitted: ${new Date(p.postedAt).toLocaleString()}`)
  return lines.join('\n')
}

export default function Careers() {
  const [view, setView] = useState('home')
  const [postings, setPostings] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submittedPosting, setSubmittedPosting] = useState(null)
  const [emailStatus, setEmailStatus] = useState('idle')
  const [v, setV] = useState(initialFormState)

  useEffect(() => {
    setPostings(loadPostings())
  }, [view])

  const goHome = () => {
    setView('home')
    setSubmitted(false)
    setSubmittedPosting(null)
    setEmailStatus('idle')
    setV(initialFormState)
  }

  const set = (key) => (e) => setV(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newPosting = {
      id: Date.now().toString(),
      type: v.postingType,
      role: v.role.trim(),
      company: v.company.trim(),
      vacancies: v.vacancies,
      location: v.location.trim(),
      paid: v.compensation === 'paid',
      amountPerMonth: v.compensation === 'paid' ? v.amountPerMonth.trim() : '',
      duration: v.postingType === 'internship' ? v.duration.trim() : '',
      experienceType: v.postingType === 'job' ? v.experienceType : '',
      minExperience: v.postingType === 'job' && v.experienceType === 'experienced' ? v.minExperience.trim() : '',
      aboutJob: v.aboutJob.trim(),
      requirements: v.requirements.trim(),
      aboutCompany: v.aboutCompany.trim(),
      additionalInfo: v.hasAdditionalInfo === 'yes' ? v.additionalInfo.trim() : '',
      recruiterName: v.recruiterName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      postedAt: new Date().toISOString(),
      status: 'pending',
    }
    const updated = [newPosting, ...loadPostings()]
    savePostings(updated)
    setPostings(updated)
    setSubmittedPosting(newPosting)
    setSubmitted(true)
    setEmailStatus('sending')

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New ${newPosting.type} posting: ${newPosting.role} @ ${newPosting.company}`,
          _template: 'box',
          'Posting Type': newPosting.type,
          Role: newPosting.role,
          Company: newPosting.company,
          Location: newPosting.location,
          Vacancies: newPosting.vacancies,
          Compensation: newPosting.paid ? `Paid - ${newPosting.amountPerMonth}/month` : 'Unpaid',
          ...(newPosting.type === 'internship' ? { Duration: newPosting.duration } : {}),
          ...(newPosting.type === 'job' ? { Experience: newPosting.experienceType === 'freshers' ? 'Freshers' : `${newPosting.minExperience}+ years` } : {}),
          [`About the ${newPosting.type === 'internship' ? 'Internship' : 'Job'}`]: newPosting.aboutJob,
          Requirements: newPosting.requirements,
          [`About ${newPosting.company}`]: newPosting.aboutCompany,
          ...(newPosting.additionalInfo ? { 'Additional Info': newPosting.additionalInfo } : {}),
          'Recruiter Name': newPosting.recruiterName,
          'Recruiter Email': newPosting.email,
          ...(newPosting.phone ? { 'Recruiter Phone': newPosting.phone } : {}),
          'Submitted At': new Date(newPosting.postedAt).toLocaleString(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      setEmailStatus(data.success === 'true' || data.success === true || res.ok ? 'sent' : 'error')
    } catch {
      setEmailStatus('error')
    }
  }

  const buildWhatsAppLink = (p) => {
    if (!p) return `https://wa.me/${ADMIN_WHATSAPP}`
    const text = encodeURIComponent(buildSummary(p))
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`
  }

  const filteredPostings = (type) => {
    const MAX_AGE_MS = 31 * 24 * 60 * 60 * 1000 // auto-expire after 31 days
    const now = Date.now()
    const isFresh = (p) => {
      const t = new Date(p.postedAt).getTime()
      return Number.isFinite(t) && (now - t) <= MAX_AGE_MS
    }
    const curated = CURATED_POSTINGS.filter(p => p.type === type && isFresh(p))
    const localApproved = postings.filter(p => p.type === type && p.status === 'approved' && isFresh(p))
    const seen = new Set(curated.map(p => p.id))
    const merged = [...curated, ...localApproved.filter(p => !seen.has(p.id))]
    return merged.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
  }

  const formatPosted = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  }

  return (
    <section className="py-20 relative overflow-hidden min-h-[80vh]" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
      <div className="absolute inset-0 cyber-grid pointer-events-none" style={{ opacity: 0.08 }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-mono uppercase tracking-widest mb-3" style={{ color: 'hsl(217 91% 60%)' }}>
            // Careers
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase mb-4">
            What are you <span style={{ color: 'hsl(217 91% 60%)' }}>looking for?</span>
          </h1>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {OPTIONS.map((opt, i) => {
                const Icon = opt.icon
                return (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setView(opt.id)}
                    className="text-left p-6 transition-all duration-300"
                    style={{
                      backgroundColor: 'hsl(0 0% 8%)',
                      border: '1px solid hsl(217 91% 60% / 0.2)',
                      clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(217 91% 60%)'; e.currentTarget.style.boxShadow = '0 0 24px hsl(217 91% 60% / 0.2)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.2)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div
                      className="flex items-center justify-center w-14 h-14 mb-5"
                      style={{
                        backgroundColor: 'hsl(217 91% 60% / 0.1)',
                        border: '1px solid hsl(217 91% 60% / 0.4)',
                        color: 'hsl(217 91% 60%)',
                      }}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display font-bold text-lg uppercase tracking-wider mb-3" style={{ color: 'hsl(0 0% 98%)' }}>
                      {opt.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 70%)' }}>
                      {opt.description}
                    </p>
                  </motion.button>
                )
              })}
            </motion.div>
          )}

          {(view === 'internship' || view === 'job') && (
            <motion.div
              key={`list-${view}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={goHome}
                className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest mb-6 transition-colors"
                style={{ color: 'hsl(0 0% 65%)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(217 91% 60%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsl(0 0% 65%)'}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="font-display font-bold text-2xl uppercase tracking-wider mb-6" style={{ color: 'hsl(0 0% 98%)' }}>
                {view === 'internship' ? 'Internship' : 'Job'} Openings
              </h2>

              {filteredPostings(view).length === 0 ? (
                <div
                  className="p-10 text-center"
                  style={{ backgroundColor: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}
                >
                  <Inbox className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(0 0% 30%)' }} />
                  <p className="text-base mb-2" style={{ color: 'hsl(0 0% 80%)' }}>
                    No {view === 'internship' ? 'internships' : 'jobs'} posted yet.
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(0 0% 55%)' }}>
                    Check back soon — recruiters post new openings regularly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPostings(view).map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6"
                      style={{
                        backgroundColor: 'hsl(0 0% 8%)',
                        border: '1px solid hsl(217 91% 60% / 0.2)',
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-display font-bold text-xl uppercase tracking-wider mb-1" style={{ color: 'hsl(0 0% 98%)' }}>
                            {p.role}
                          </h3>
                          <p className="text-sm flex items-center gap-1.5" style={{ color: 'hsl(217 91% 60%)' }}>
                            <Building2 className="w-4 h-4" />{p.company}
                          </p>
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'hsl(0 0% 55%)' }}>
                          Posted {formatPosted(p.postedAt)}
                        </span>
                      </div>

                      {/* Meta chips */}
                      <div className="flex flex-wrap gap-2 mb-5">
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
                        {p.type === 'job' && (
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

                      {/* Sections */}
                      {p.aboutJob && (
                        <div className="mb-4">
                          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'hsl(217 91% 60%)' }}>About the {p.type === 'internship' ? 'Internship' : 'Job'}</p>
                          <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>{p.aboutJob}</p>
                        </div>
                      )}
                      {p.requirements && (
                        <div className="mb-4">
                          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'hsl(217 91% 60%)' }}>Requirements</p>
                          <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>{p.requirements}</p>
                        </div>
                      )}
                      {p.aboutCompany && (
                        <div className="mb-4">
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

                      <a
                        href={`mailto:${p.email}?subject=${encodeURIComponent(`Application for ${p.role} at ${p.company}`)}`}
                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                        style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                      >
                        <Mail className="w-3.5 h-3.5" /> Apply Now
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'recruiter' && (
            <motion.div
              key="recruiter-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <button
                onClick={goHome}
                className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest mb-6 transition-colors"
                style={{ color: 'hsl(0 0% 65%)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(217 91% 60%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsl(0 0% 65%)'}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="p-8" style={{ backgroundColor: 'hsl(0 0% 8%)', border: '1px solid hsl(217 91% 60% / 0.25)' }}>
                <h2 className="font-display font-bold text-2xl uppercase tracking-wider mb-6" style={{ color: 'hsl(0 0% 98%)' }}>
                  Post an Opening
                </h2>

                {submitted ? (
                  <div className="flex flex-col items-center text-center py-6">
                    <CheckCircle2 className="w-14 h-14 mb-4" style={{ color: 'hsl(217 91% 60%)' }} />
                    <p className="text-lg font-display uppercase tracking-wider mb-2" style={{ color: 'hsl(0 0% 98%)' }}>
                      Request Submitted
                    </p>
                    <p className="text-sm mb-4 max-w-md" style={{ color: 'hsl(0 0% 70%)' }}>
                      {emailStatus === 'sending' && 'Sending your posting to the Spyrewall team…'}
                      {emailStatus === 'sent' && (
                        <>Your posting has been sent to our team for review. We'll reach out at <span style={{ color: 'hsl(217 91% 60%)' }}>{submittedPosting?.email}</span> shortly.</>
                      )}
                      {emailStatus === 'error' && (
                        <>We couldn't deliver your posting automatically. Please send it to us on WhatsApp using the button below — it's already pre-filled.</>
                      )}
                      {emailStatus === 'idle' && 'Your posting has been received.'}
                    </p>

                    <div
                      className="w-full max-w-md p-3 mb-5 text-xs font-mono text-left"
                      style={{ backgroundColor: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 18%)', color: 'hsl(0 0% 70%)' }}
                    >
                      <span style={{ color: emailStatus === 'sent' ? '#22c55e' : emailStatus === 'error' ? 'hsl(217 91% 70%)' : 'hsl(45 100% 60%)' }}>
                        {emailStatus === 'sent' && '● Email delivered'}
                        {emailStatus === 'sending' && '● Sending…'}
                        {emailStatus === 'error' && '● Email failed'}
                        {emailStatus === 'idle' && '● Submitted'}
                      </span>
                      <span className="ml-2" style={{ color: 'hsl(0 0% 50%)' }}>
                        Backup: also sent to your WhatsApp on click below.
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={buildWhatsAppLink(submittedPosting)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-clip-button inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold uppercase tracking-widest"
                        style={{ backgroundColor: '#25D366', color: 'hsl(0 0% 4%)' }}
                      >
                        <Send className="w-4 h-4" /> Also Send on WhatsApp
                      </a>
                      <button
                        onClick={goHome}
                        className="cyber-clip-button inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold uppercase tracking-widest"
                        style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                      >
                        Back to Careers
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Posting Type */}
                    <Field label="Posting Type" required>
                      <div className="flex gap-2">
                        <Radio name="postingType" value="internship" current={v.postingType} onChange={set('postingType')}>Internship</Radio>
                        <Radio name="postingType" value="job" current={v.postingType} onChange={set('postingType')}>Job</Radio>
                      </div>
                    </Field>

                    {v.postingType && (
                      <>
                        <Field label="Job Role" required>
                          <input type="text" required value={v.role} onChange={set('role')} placeholder="e.g., Penetration Tester" className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                        </Field>

                        <Field label="Company Name" required>
                          <input type="text" required value={v.company} onChange={set('company')} className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Location" required>
                            <input type="text" required value={v.location} onChange={set('location')} placeholder="Remote / Bangalore..." className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                          </Field>
                          <Field label="No. of Vacancies" required>
                            <input type="number" min="1" required value={v.vacancies} onChange={set('vacancies')} className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                          </Field>
                        </div>

                        {/* Compensation */}
                        <Field label="Compensation" required>
                          <div className="flex gap-2 mb-3">
                            <Radio name="compensation" value="paid" current={v.compensation} onChange={set('compensation')}>Paid</Radio>
                            <Radio name="compensation" value="unpaid" current={v.compensation} onChange={set('compensation')}>Unpaid</Radio>
                          </div>
                          {v.compensation === 'paid' && (
                            <input
                              type="text"
                              required
                              value={v.amountPerMonth}
                              onChange={set('amountPerMonth')}
                              placeholder="Amount per month (e.g., ₹15,000)"
                              className="w-full px-4 py-3 text-sm outline-none"
                              style={inputStyle}
                            />
                          )}
                        </Field>

                        {/* Internship: Duration */}
                        {v.postingType === 'internship' && (
                          <Field label="Duration" required>
                            <input type="text" required value={v.duration} onChange={set('duration')} placeholder="e.g., 3 months, 6 months" className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                          </Field>
                        )}

                        {/* Job: Experience */}
                        {v.postingType === 'job' && (
                          <Field label="Experience Level" required>
                            <div className="flex gap-2 mb-3">
                              <Radio name="experienceType" value="freshers" current={v.experienceType} onChange={set('experienceType')}>Freshers</Radio>
                              <Radio name="experienceType" value="experienced" current={v.experienceType} onChange={set('experienceType')}>Min. Experience</Radio>
                            </div>
                            {v.experienceType === 'experienced' && (
                              <input
                                type="text"
                                required
                                value={v.minExperience}
                                onChange={set('minExperience')}
                                placeholder="e.g., 2 years, 5 years"
                                className="w-full px-4 py-3 text-sm outline-none"
                                style={inputStyle}
                              />
                            )}
                          </Field>
                        )}

                        {/* Description sections */}
                        <Field label={`About the ${v.postingType === 'internship' ? 'Internship' : 'Job'}`} required>
                          <textarea required rows={4} value={v.aboutJob} onChange={set('aboutJob')} placeholder="Responsibilities, day-to-day work, what the role involves..." className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                        </Field>
                        <Field label="Requirements" required>
                          <textarea required rows={4} value={v.requirements} onChange={set('requirements')} placeholder="Skills, qualifications, certifications..." className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                        </Field>
                        <Field label={`About ${v.company || 'the Company'}`} required>
                          <textarea required rows={3} value={v.aboutCompany} onChange={set('aboutCompany')} placeholder="What your company does, size, industry..." className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                        </Field>

                        {/* Additional Info */}
                        <Field label="Do you want to add any additional info?">
                          <div className="flex gap-2 mb-3">
                            <Radio name="hasAdditionalInfo" value="yes" current={v.hasAdditionalInfo} onChange={set('hasAdditionalInfo')}>Yes</Radio>
                            <Radio name="hasAdditionalInfo" value="no" current={v.hasAdditionalInfo} onChange={set('hasAdditionalInfo')}>No</Radio>
                          </div>
                          {v.hasAdditionalInfo === 'yes' && (
                            <textarea
                              rows={3}
                              value={v.additionalInfo}
                              onChange={set('additionalInfo')}
                              placeholder="Anything else applicants should know — perks, work hours, application process, etc."
                              className="w-full px-4 py-3 text-sm outline-none"
                              style={inputStyle}
                            />
                          )}
                        </Field>

                        {/* Recruiter contact */}
                        <div className="pt-4" style={{ borderTop: '1px solid hsl(0 0% 18%)' }}>
                          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'hsl(217 91% 60%)' }}>// Your Contact Info</p>
                          <div className="space-y-4">
                            <Field label="Your Name" required>
                              <input type="text" required value={v.recruiterName} onChange={set('recruiterName')} className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                            </Field>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Work Email" required>
                                <input type="email" required value={v.email} onChange={set('email')} className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                              </Field>
                              <Field label="Phone">
                                <input type="tel" value={v.phone} onChange={set('phone')} className="w-full px-4 py-3 text-sm outline-none" style={inputStyle} />
                              </Field>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="cyber-clip-button inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-widest mt-2"
                          style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                        >
                          <Send className="w-4 h-4" /> Submit for Approval
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
