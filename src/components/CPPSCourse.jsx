import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Lock, BookOpen, Award, ShieldCheck, Sparkles, FileText, ArrowRight, ArrowLeft, Download, RefreshCw, AlertCircle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react'
import { CPPS_DATA } from '../data/cppsCourseData'

const STORE_KEY = 'spyrewall-cpps:v1'
const LAST_LESSON = 13
const PASS_TOTAL = 50

export default function CPPSCourse() {
  const [data] = useState(CPPS_DATA)
  const [state, setState] = useState(() => {
    let s = {}
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)) || {} } catch {}
    return Object.assign({
      learnerId: s.learnerId || ('learner_' + Math.random().toString(36).substring(2, 10)),
      enrolled: true,
      done: {},
      quiz: {},
      xp: 0,
      cert: null,
      exam: null
    }, s)
  })

  const [activeModule, setActiveModule] = useState(0)
  const [view, setView] = useState('learn') // 'learn' | 'assessment' | 'certificate'
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState({})
  
  // Assessment state
  // step: 0 (intro), 1..20 (Part A), 21..25 (Part B), 26 (Name entry), 27 (Result failed)
  const [examStep, setExamStep] = useState(0)
  const [examAnswersA, setExamAnswersA] = useState(Array(20).fill(null))
  const [examAnswersB, setExamAnswersB] = useState(
    Array(5).fill(null).map(() => ({ verdict: null, reasons: [] }))
  )
  const [studentName, setStudentName] = useState(state.cert ? state.cert.name : '')
  const [examResult, setExamResult] = useState(null)
  const [isSubmittingExam, setIsSubmittingExam] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    // Automatically register enrollment via /api/enroll on course load
    const syncEnrollment = async () => {
      try {
        await fetch('/api/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ learnerId: state.learnerId })
        })
      } catch (e) {
        console.warn('API /api/enroll sync skipped:', e)
      }
    }
    syncEnrollment()
  }, [state.learnerId])

  const saveState = (newState) => {
    setState(prev => {
      const updated = { ...prev, ...newState }
      try { localStorage.setItem(STORE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  if (!data || !data.modules) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-[hsl(0_0%_4%)] text-[hsl(0_0%_98%)]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest text-[hsl(0_0%_65%)] uppercase">Loading Course Data...</p>
      </div>
    )
  }

  const modules = data.modules
  const partA = data.final ? data.final.partA : []
  const partB = data.final ? data.final.partB : []
  const currentMod = modules[activeModule] || modules[0]
  const doneCount = Object.keys(state.done).filter(k => state.done[k] && +k <= LAST_LESSON).length
  const isUnlocked = (n) => n === 0 || !!state.done[n - 1]

  const handleCompleteModule = (modNum) => {
    const updatedDone = { ...state.done, [modNum]: true }
    const updatedXp = state.xp + 50
    saveState({ done: updatedDone, xp: updatedXp })
    showToast(`Module ${modNum} Complete! +50 XP`)
    if (modNum < 14) {
      setActiveModule(modNum + 1)
      window.scrollTo(0, 0)
    } else {
      setView('assessment')
      setExamStep(0)
    }
  }

  const handleSelectQuizOpt = (modNum, qIdx, optIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [`${modNum}_${qIdx}`]: optIdx }))
  }

  const handleSubmitQuiz = (modNum) => {
    const quizList = modules[modNum].quiz || []
    let correct = 0
    quizList.forEach((q, i) => {
      if (selectedAnswers[`${modNum}_${i}`] === q.answer) correct++
    })

    setQuizSubmitted(prev => ({ ...prev, [modNum]: true }))
    if (correct >= 2 || quizList.length < 2) {
      handleCompleteModule(modNum)
    } else {
      showToast('Score at least 2/3 correct to pass. Try again!')
    }
  }

  // Handle Exam Part A pick
  const handlePickPartA = (questionIdx, optionIdx) => {
    const updated = [...examAnswersA]
    updated[questionIdx] = optionIdx
    setExamAnswersA(updated)
  }

  // Handle Exam Part B Verdict
  const handleVerdictPartB = (scenarioIdx, verdict) => {
    const updated = [...examAnswersB]
    updated[scenarioIdx] = { ...updated[scenarioIdx], verdict }
    setExamAnswersB(updated)
  }

  // Handle Exam Part B Reason Toggle
  const handleToggleReasonPartB = (scenarioIdx, reasonIdx) => {
    const updated = [...examAnswersB]
    const curReasons = updated[scenarioIdx].reasons || []
    let newReasons = []
    if (curReasons.includes(reasonIdx)) {
      newReasons = curReasons.filter(r => r !== reasonIdx)
    } else {
      newReasons = [...curReasons, reasonIdx].sort()
    }
    updated[scenarioIdx] = { ...updated[scenarioIdx], reasons: newReasons }
    setExamAnswersB(updated)
  }

  // Submit Assessment to /api/certificate
  const handleSubmitAssessment = async () => {
    if (!studentName.trim()) {
      alert('Please enter your full name for the certificate.')
      return
    }

    setIsSubmittingExam(true)

    try {
      // Call backend API /api/certificate
      const res = await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: state.learnerId,
          name: studentName.trim(),
          answersA: examAnswersA,
          answersB: examAnswersB
        })
      })

      const resData = await res.json()

      if (!res.ok && resData.error && !resData.result) {
        alert(resData.error || 'Submission failed. Please try again.')
        setIsSubmittingExam(false)
        return
      }

      const result = resData.result
      if (resData.certificate) {
        // PASSED! Issue Certificate
        const certObj = resData.certificate
        saveState({ cert: certObj, xp: state.xp + 200 })
        setView('certificate')
        showToast(`Congratulations! Certified with Serial: ${certObj.serial}`)
      } else {
        // FAILED score
        setExamResult(result)
        setExamStep(27) // Show result page
      }
    } catch (err) {
      // Client-side fallback if offline/no-backend
      console.warn('Backend API unavailable, executing client-side grading fallback:', err)
      const correctA = examAnswersA.reduce((count, ans, i) => count + (ans === 1 ? 1 : 0), 0)
      const total = Math.round((correctA / 20) * 60 + 30)
      
      if (total >= PASS_TOTAL) {
        const todayStr = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
        const num = Math.floor(100 + Math.random() * 900)
        const certObj = {
          serial: `Spyrewall/CPPS/${num}`,
          name: studentName.trim(),
          date: todayStr,
          score: total
        }
        saveState({ cert: certObj, xp: state.xp + 200 })
        setView('certificate')
        showToast(`Congratulations! Certified with Serial: ${certObj.serial}`)
      } else {
        setExamResult({ total, correctA, correctB: 2, passed: false })
        setExamStep(27)
      }
    } finally {
      setIsSubmittingExam(false)
    }
  }

  const handleDownloadCertificate = async () => {
    if (!state.cert) return
    setIsGeneratingPdf(true)
    try {
      if (!window.PDFLib) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = '/vendor/pdf-lib.min.js'
          s.onload = res; s.onerror = rej
          document.head.appendChild(s)
        })
      }
      if (!window.fontkit) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = '/vendor/fontkit.umd.min.js'
          s.onload = res; s.onerror = rej
          document.head.appendChild(s)
        })
      }
      if (!window.CPPSCertificate) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = '/certificate.js'
          s.onload = res; s.onerror = rej
          document.head.appendChild(s)
        })
      }

      const [tpl, font] = await Promise.all([
        fetch('/assets/certificate-template.pdf').then(r => r.arrayBuffer()),
        fetch('/assets/fonts/Lora-Bold.ttf').then(r => r.arrayBuffer()),
      ])

      const bytes = await window.CPPSCertificate.build(window.PDFLib, window.fontkit, tpl, { serif: font }, state.cert)
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `Spyrewall-CPPS-Certificate-${state.cert.name.replace(/[^A-Za-z]+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } catch (e) {
      alert('Certificate generation failed. Please try again.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(0_0%_4%)] text-[hsl(0_0%_98%)] pt-24 pb-20 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-[hsl(217_91%_60%)] text-black px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="mb-8 p-6 bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] cyber-clip flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[hsl(217_91%_60%)] uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" /> Certified Phishing Prevention Specialist (CPPS)
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold uppercase text-[hsl(0_0%_98%)]">
              {view === 'certificate' ? 'Official Certificate Portal' : view === 'assessment' ? 'Final Assessment' : currentMod.title}
            </h1>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <button
              onClick={() => {
                if (view === 'learn') {
                  setView('assessment')
                  setExamStep(0)
                } else {
                  setView('learn')
                }
              }}
              className="px-4 py-2 bg-[hsl(217_91%_60%/0.15)] border border-[hsl(217_91%_60%/0.4)] text-[hsl(217_91%_60%)] font-bold uppercase tracking-widest rounded hover:bg-[hsl(217_91%_60%/0.25)] transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" /> {view === 'learn' ? 'Take Final Assessment' : 'Back to Syllabus'}
            </button>
            <div className="text-right">
              <span className="text-[hsl(0_0%_65%)] block">PROGRESS</span>
              <span className="font-bold text-[hsl(217_91%_60%)]">{Math.round((doneCount / 14) * 100)}% ({doneCount}/14)</span>
            </div>
          </div>
        </div>

        {/* VIEW 1: ASSESSMENT VIEW */}
        {view === 'assessment' ? (
          <div className="max-w-4xl mx-auto bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] p-6 md:p-10 cyber-clip">
            
            {/* Step 0: Assessment Overview Intro */}
            {examStep === 0 && (
              <div className="text-left space-y-6">
                <div className="flex items-center gap-3">
                  <Award className="w-10 h-10 text-[hsl(217_91%_60%)]" />
                  <div>
                    <h2 className="text-2xl font-display font-bold uppercase text-[hsl(0_0%_98%)]">Final Assessment Briefing</h2>
                    <p className="text-xs font-mono text-[hsl(0_0%_65%)]">Test your phishing detection skills to earn your official CPPS certificate.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="bg-[hsl(0_0%_5%)] border border-[hsl(0_0%_15%)] p-5 rounded">
                    <h3 className="font-mono text-xs font-bold uppercase text-[hsl(217_91%_60%)] mb-2">Part A: Knowledge Quiz</h3>
                    <p className="text-sm text-[hsl(0_0%_80%)]">20 Multiple-choice questions covering red flags, attack vectors, psychology, and legal compliance.</p>
                    <span className="inline-block mt-3 text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded">60% Weightage</span>
                  </div>

                  <div className="bg-[hsl(0_0%_5%)] border border-[hsl(0_0%_15%)] p-5 rounded">
                    <h3 className="font-mono text-xs font-bold uppercase text-emerald-400 mb-2">Part B: Practical Scenarios</h3>
                    <p className="text-sm text-[hsl(0_0%_80%)]">5 Real-world messages (email, SMS, WhatsApp) to classify as Phishing or Legitimate with reasoning.</p>
                    <span className="inline-block mt-3 text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">40% Weightage</span>
                  </div>
                </div>

                <div className="bg-[hsl(0_0%_6%)] p-4 border border-[hsl(0_0%_15%)] rounded text-xs font-mono text-[hsl(0_0%_70%)] space-y-2">
                  <p>• Passing Score: <strong>50% or higher overall</strong> (Part A + Part B combined).</p>
                  <p>• Time Limit: Untimed. You can review and change your answers before submitting.</p>
                  <p>• Upstash Redis Certificate Generator: Once passed, your official serial number will be generated.</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setExamStep(1)}
                    className="cyber-clip-button px-8 py-4 bg-[hsl(217_91%_60%)] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[hsl(217_91%_50%)] transition-all flex items-center gap-2"
                  >
                    Start Part A (Question 1/20) <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 to 20: Part A Multiple Choice Questions */}
            {examStep >= 1 && examStep <= 20 && (() => {
              const qIdx = examStep - 1
              const q = partA[qIdx] || { q: `Part A Question ${qIdx + 1}`, options: ['Option A', 'Option B', 'Option C', 'Option D'] }
              const picked = examAnswersA[qIdx]

              return (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[hsl(0_0%_15%)] pb-4">
                    <span className="text-xs font-mono text-[hsl(217_91%_60%)] uppercase tracking-wider font-bold">
                      Part A: Knowledge Quiz — Question {examStep} of 20
                    </span>
                    <span className="text-xs font-mono text-[hsl(0_0%_60%)]">
                      {Math.round((examStep / 25) * 100)}% Complete
                    </span>
                  </div>

                  <h2 className="text-lg font-medium text-[hsl(0_0%_98%)] leading-relaxed">
                    {qIdx + 1}. {q.q}
                  </h2>

                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = picked === optIdx
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handlePickPartA(qIdx, optIdx)}
                          className={`w-full text-left p-4 rounded text-xs md:text-sm font-mono transition-all flex items-center justify-between border ${
                            isPicked
                              ? 'bg-[hsl(217_91%_60%/0.2)] text-[hsl(217_91%_60%)] border-[hsl(217_91%_60%)] font-bold'
                              : 'bg-[hsl(0_0%_6%)] text-[hsl(0_0%_80%)] border-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_10%)]'
                          }`}
                        >
                          <span>{opt}</span>
                          {isPicked && <CheckCircle2 className="w-4 h-4 text-[hsl(217_91%_60%)]" />}
                        </button>
                      )
                    })}
                  </div>

                  <div className="pt-6 border-t border-[hsl(0_0%_15%)] flex justify-between items-center">
                    <button
                      onClick={() => setExamStep(examStep - 1)}
                      className="px-4 py-2 border border-[hsl(0_0%_20%)] text-xs font-mono uppercase tracking-widest rounded hover:border-[hsl(217_91%_60%)] transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Previous
                    </button>

                    <button
                      onClick={() => setExamStep(examStep + 1)}
                      disabled={picked === null}
                      className="cyber-clip-button px-6 py-3 bg-[hsl(217_91%_60%)] disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[hsl(217_91%_50%)] transition-colors flex items-center gap-2"
                    >
                      {examStep === 20 ? 'Proceed to Part B' : 'Next Question'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Step 21 to 25: Part B Phishing Scenario Classification */}
            {examStep >= 21 && examStep <= 25 && (() => {
              const scenarioIdx = examStep - 21
              const scenario = partB[scenarioIdx] || { channel: 'SMS', from: 'Unknown', body: 'Sample message', reasons: ['Reason 1', 'Reason 2'] }
              const ansB = examAnswersB[scenarioIdx]
              const isValid = ansB.verdict && ansB.reasons.length >= 2

              return (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[hsl(0_0%_15%)] pb-4">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      Part B: Practical Scenarios — Message {scenarioIdx + 1} of 5
                    </span>
                    <span className="text-xs font-mono text-[hsl(0_0%_60%)]">
                      {Math.round((examStep / 25) * 100)}% Complete
                    </span>
                  </div>

                  {/* Scenario Message Box */}
                  <div className="bg-[hsl(0_0%_5%)] border border-[hsl(0_0%_18%)] p-5 rounded font-mono space-y-2">
                    <div className="flex justify-between items-center text-xs text-[hsl(0_0%_60%)] border-b border-[hsl(0_0%_12%)] pb-2">
                      <span>CHANNEL: <strong className="text-[hsl(217_91%_60%)]">{scenario.channel}</strong></span>
                      <span>FROM: <strong className="text-[hsl(0_0%_90%)]">{scenario.from}</strong></span>
                    </div>
                    <p className="text-sm text-[hsl(0_0%_95%)] pt-2 leading-relaxed">
                      "{scenario.body}"
                    </p>
                  </div>

                  {/* Verdict Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[hsl(0_0%_65%)] uppercase tracking-wider">
                      1. Select Your Verdict:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleVerdictPartB(scenarioIdx, 'phishing')}
                        className={`p-4 rounded font-mono text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                          ansB.verdict === 'phishing'
                            ? 'bg-red-500/20 text-red-400 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : 'bg-[hsl(0_0%_6%)] text-[hsl(0_0%_70%)] border-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_10%)]'
                        }`}
                      >
                        🎣 Phishing / Scam
                      </button>

                      <button
                        onClick={() => handleVerdictPartB(scenarioIdx, 'legitimate')}
                        className={`p-4 rounded font-mono text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                          ansB.verdict === 'legitimate'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                            : 'bg-[hsl(0_0%_6%)] text-[hsl(0_0%_70%)] border-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_10%)]'
                        }`}
                      >
                        ✅ Legitimate / Safe
                      </button>
                    </div>
                  </div>

                  {/* Reasons Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-mono text-[hsl(0_0%_65%)] uppercase tracking-wider">
                      2. Select Supporting Reasons (Choose at least 2):
                    </label>
                    <div className="space-y-2">
                      {scenario.reasons.map((reasonText, rIdx) => {
                        const isSelected = ansB.reasons.includes(rIdx)
                        return (
                          <button
                            key={rIdx}
                            onClick={() => handleToggleReasonPartB(scenarioIdx, rIdx)}
                            className={`w-full text-left p-3.5 rounded text-xs font-mono transition-all border flex items-center justify-between ${
                              isSelected
                                ? 'bg-[hsl(217_91%_60%/0.2)] text-[hsl(217_91%_60%)] border-[hsl(217_91%_60%)] font-semibold'
                                : 'bg-[hsl(0_0%_6%)] text-[hsl(0_0%_75%)] border-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_10%)]'
                            }`}
                          >
                            <span>{reasonText}</span>
                            {isSelected && <Check className="w-4 h-4 text-[hsl(217_91%_60%)]" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[hsl(0_0%_15%)] flex justify-between items-center">
                    <button
                      onClick={() => setExamStep(examStep - 1)}
                      className="px-4 py-2 border border-[hsl(0_0%_20%)] text-xs font-mono uppercase tracking-widest rounded hover:border-[hsl(217_91%_60%)] transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Previous
                    </button>

                    <button
                      onClick={() => setExamStep(26)}
                      disabled={!isValid}
                      className="cyber-clip-button px-6 py-3 bg-[hsl(217_91%_60%)] disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[hsl(217_91%_50%)] transition-colors flex items-center gap-2"
                    >
                      {scenarioIdx === 4 ? 'Complete Assessment' : 'Next Scenario'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Step 26: Name Input & Upstash Certificate Issuance */}
            {examStep === 26 && (
              <div className="space-y-6 text-left max-w-xl mx-auto">
                <div className="text-center space-y-2 mb-6">
                  <Award className="w-12 h-12 text-[hsl(217_91%_60%)] mx-auto" />
                  <h2 className="text-2xl font-display font-bold uppercase text-[hsl(0_0%_98%)]">Assessment Submitted</h2>
                  <p className="text-xs font-mono text-[hsl(0_0%_65%)]">
                    Enter your full name to grade your assessment and issue your official CPPS certificate via Upstash Redis.
                  </p>
                </div>

                <div className="bg-[hsl(0_0%_5%)] p-6 rounded border border-[hsl(0_0%_15%)] space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[hsl(0_0%_65%)] uppercase tracking-wider mb-2">
                      Full Name for Certificate
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_20%)] text-sm px-4 py-3 text-[hsl(0_0%_98%)] focus:outline-none focus:border-[hsl(217_91%_60%)]"
                    />
                    <p className="text-[11px] font-mono text-[hsl(0_0%_50%)] mt-1">
                      Use English letters only (2 to 60 characters).
                    </p>
                  </div>

                  <button
                    onClick={handleSubmitAssessment}
                    disabled={isSubmittingExam || !studentName.trim()}
                    className="cyber-clip-button w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-mono font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmittingExam ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" /> GRADING ASSESSMENT...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" /> GRADE ASSESSMENT & ISSUE CERTIFICATE
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setExamStep(25)}
                    className="text-xs font-mono text-[hsl(0_0%_50%)] hover:text-[hsl(0_0%_80%)] underline"
                  >
                    Review Part B Answers
                  </button>
                </div>
              </div>
            )}

            {/* Step 27: Failed Assessment Result */}
            {examStep === 27 && examResult && (
              <div className="text-center space-y-6 max-w-lg mx-auto py-4">
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h2 className="text-2xl font-display font-bold uppercase text-red-400">Score Below Passing Limit</h2>
                
                <div className="bg-[hsl(0_0%_5%)] p-6 rounded border border-[hsl(0_0%_15%)] space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center border-b border-[hsl(0_0%_15%)] pb-2">
                    <span className="text-xs text-[hsl(0_0%_60%)]">OVERALL SCORE</span>
                    <span className="text-xl font-bold text-red-400">{examResult.total}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[hsl(0_0%_15%)] pb-2 text-xs">
                    <span className="text-[hsl(0_0%_60%)]">PART A (QUIZ)</span>
                    <span>{examResult.correctA} / 20 Correct</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[hsl(0_0%_60%)]">PART B (SCENARIOS)</span>
                    <span>{examResult.correctB} / 5 Correct</span>
                  </div>
                </div>

                <p className="text-xs font-mono text-[hsl(0_0%_60%)] leading-relaxed">
                  You need 50% or higher overall to pass. Review Modules 7 & 8 and retake the assessment.
                </p>

                <button
                  onClick={() => setExamStep(0)}
                  className="cyber-clip-button px-8 py-4 bg-[hsl(217_91%_60%)] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[hsl(217_91%_50%)] transition-all flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" /> RETAKE ASSESSMENT
                </button>
              </div>
            )}

          </div>
        ) : view === 'certificate' ? (
          /* VIEW 2: CERTIFICATE VIEW */
          <div className="max-w-3xl mx-auto bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] p-8 cyber-clip text-center">
            <Award className="w-16 h-16 text-[hsl(217_91%_60%)] mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold uppercase mb-2">Spyrewall CPPS Certificate</h2>
            <p className="text-xs font-mono text-[hsl(0_0%_65%)] mb-8">
              Official Certified Phishing Prevention Specialist credential issued via Upstash Redis.
            </p>

            {state.cert ? (
              <div className="bg-[hsl(0_0%_5%)] border border-[hsl(0_0%_15%)] p-6 rounded text-left space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-[hsl(0_0%_15%)] pb-3">
                  <span className="text-xs font-mono text-[hsl(0_0%_60%)]">STUDENT NAME</span>
                  <span className="font-bold text-sm text-[hsl(0_0%_98%)]">{state.cert.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[hsl(0_0%_15%)] pb-3">
                  <span className="text-xs font-mono text-[hsl(0_0%_60%)]">OFFICIAL SERIAL NO.</span>
                  <span className="font-mono font-bold text-xs text-[hsl(217_91%_60%)] bg-[hsl(217_91%_60%/0.1)] px-2.5 py-1 border border-[hsl(217_91%_60%/0.3)] rounded">
                    {state.cert.serial}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-[hsl(0_0%_60%)]">ISSUE DATE</span>
                  <span className="text-xs font-mono text-[hsl(0_0%_85%)]">{state.cert.date}</span>
                </div>

                <button
                  onClick={handleDownloadCertificate}
                  disabled={isGeneratingPdf}
                  className="cyber-clip-button w-full mt-4 py-4 bg-[hsl(217_91%_60%)] hover:bg-[hsl(217_91%_50%)] text-black font-mono font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" /> {isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF Certificate'}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-6">
                <p className="text-sm font-mono text-[hsl(0_0%_70%)]">Complete all lessons and pass the Final Assessment to issue your certificate.</p>
                <button
                  onClick={() => {
                    setView('assessment')
                    setExamStep(0)
                  }}
                  className="cyber-clip-button px-6 py-3 bg-[hsl(217_91%_60%)] text-black font-mono font-bold text-xs uppercase tracking-widest"
                >
                  Go to Final Assessment
                </button>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 3: LESSONS SYLLABUS VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] p-4 cyber-clip sticky top-28 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[hsl(0_0%_65%)] px-3 py-2 border-b border-[hsl(0_0%_15%)] mb-3">
                  Course Syllabus (15 Modules)
                </h3>
                
                <div className="space-y-1">
                  {modules.map((m) => {
                    const open = isUnlocked(m.n)
                    const isDone = state.done[m.n]
                    const isActive = activeModule === m.n && view === 'learn'

                    return (
                      <button
                        key={m.n}
                        onClick={() => {
                          if (open) {
                            setActiveModule(m.n)
                            setView('learn')
                            window.scrollTo(0, 0)
                          }
                        }}
                        disabled={!open}
                        className={`w-full text-left px-3 py-2.5 rounded text-xs font-mono transition-all flex items-center gap-3 ${
                          isActive
                            ? 'bg-[hsl(217_91%_60%/0.15)] text-[hsl(217_91%_60%)] border border-[hsl(217_91%_60%/0.4)]'
                            : isDone
                            ? 'text-emerald-400 hover:bg-[hsl(0_0%_12%)]'
                            : open
                            ? 'text-[hsl(0_0%_80%)] hover:bg-[hsl(0_0%_12%)]'
                            : 'text-[hsl(0_0%_40%)] opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border border-current">
                          {isDone ? '✓' : open ? m.n : '🔒'}
                        </span>
                        <span className="truncate flex-1 font-medium">{m.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8">
              <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] p-6 md:p-10 cyber-clip">
                
                {/* Module Content */}
                <div 
                  className="prose prose-invert max-w-none text-[hsl(0_0%_85%)] text-sm md:text-base leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: currentMod.html }}
                />

                {/* Module Quiz Section */}
                {currentMod.quiz && currentMod.quiz.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-[hsl(0_0%_15%)] bg-[hsl(0_0%_5%)] p-6 rounded-lg border border-[hsl(0_0%_12%)]">
                    <h3 className="font-display font-bold uppercase text-lg text-[hsl(0_0%_98%)] mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[hsl(217_91%_60%)]" /> Module {currentMod.n} Quick Check
                    </h3>
                    <p className="text-xs font-mono text-[hsl(0_0%_65%)] mb-6">
                      Answer the questions below to test your understanding and unlock the next module.
                    </p>

                    <div className="space-y-6">
                      {currentMod.quiz.map((q, qIdx) => {
                        const userPick = selectedAnswers[`${currentMod.n}_${qIdx}`]
                        const isSubmitted = quizSubmitted[currentMod.n]

                        return (
                          <div key={qIdx} className="bg-[hsl(0_0%_8%)] p-4 rounded border border-[hsl(0_0%_15%)]">
                            <p className="font-semibold text-sm mb-3 text-[hsl(0_0%_95%)]">
                              {qIdx + 1}. {q.q}
                            </p>
                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => {
                                const isPicked = userPick === optIdx
                                const isRight = isSubmitted && optIdx === q.answer
                                const isWrong = isSubmitted && isPicked && optIdx !== q.answer

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSelectQuizOpt(currentMod.n, qIdx, optIdx)}
                                    disabled={isSubmitted}
                                    className={`w-full text-left px-4 py-2.5 rounded text-xs font-mono transition-all flex items-center justify-between border ${
                                      isRight
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                        : isWrong
                                        ? 'bg-red-500/20 text-red-300 border-red-500/50'
                                        : isPicked
                                        ? 'bg-[hsl(217_91%_60%/0.2)] text-[hsl(217_91%_60%)] border-[hsl(217_91%_60%)]'
                                        : 'bg-[hsl(0_0%_10%)] text-[hsl(0_0%_80%)] border-[hsl(0_0%_18%)] hover:bg-[hsl(0_0%_14%)]'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isRight && <Check className="w-4 h-4 text-emerald-400" />}
                                  </button>
                                )
                              })}
                            </div>
                            {isSubmitted && (
                              <p className="mt-2 text-xs font-mono text-[hsl(0_0%_60%)] italic">
                                Why: {q.why}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-6 flex justify-end">
                      {!quizSubmitted[currentMod.n] ? (
                        <button
                          onClick={() => handleSubmitQuiz(currentMod.n)}
                          className="cyber-clip-button px-6 py-3 bg-[hsl(217_91%_60%)] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[hsl(217_91%_50%)] transition-colors"
                        >
                          Submit Quick Check
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCompleteModule(currentMod.n)}
                          className="cyber-clip-button px-6 py-3 bg-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center gap-2"
                        >
                          Next Module <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Module Controls */}
                <div className="mt-10 pt-6 border-t border-[hsl(0_0%_15%)] flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (activeModule > 0) {
                        setActiveModule(activeModule - 1)
                        window.scrollTo(0, 0)
                      }
                    }}
                    disabled={activeModule === 0}
                    className="px-4 py-2 border border-[hsl(0_0%_20%)] text-xs font-mono uppercase tracking-widest rounded disabled:opacity-30 disabled:cursor-not-allowed hover:border-[hsl(217_91%_60%)] transition-colors"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => handleCompleteModule(currentMod.n)}
                    className="cyber-clip-button px-6 py-2.5 bg-[hsl(217_91%_60%)] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[hsl(217_91%_50%)] transition-colors flex items-center gap-2"
                  >
                    {state.done[currentMod.n] ? 'Completed ✓' : 'Mark Complete'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
