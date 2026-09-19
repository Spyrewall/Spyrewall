import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Lock, BookOpen, Award, ArrowLeft, ArrowRight, RotateCcw, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

const STORE_KEY = 'spyrewall-cpps:v1'
const LAST_LESSON = 13

export default function CPPSCourse() {
  const [data, setData] = useState(null)
  const [state, setState] = useState(() => {
    let s = {}
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)) || {} } catch {}
    return Object.assign({ learnerId: null, enrolled: true, done: {}, quiz: {}, xp: 0, cert: null, exam: null }, s)
  })

  const [activeModule, setActiveModule] = useState(0)
  const [view, setView] = useState('learn') // 'learn' | 'assessment' | 'certificate'
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState({})
  const [examStep, setExamStep] = useState(0) // 0: intro, 1..20: part A, 21..25: part B, 26: name, 27: result
  const [examState, setExamState] = useState({ a: Array(20).fill(null), b: Array(5).fill(null).map(() => ({ verdict: null, reasons: [] })), name: '' })
  const [certName, setCertName] = useState('')
  const [certNameConfirmed, setCertNameConfirmed] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Load CPPS course-data.js dynamically if not already on window
  useEffect(() => {
    if (window.CPPS) {
      setData(window.CPPS)
    } else {
      const script = document.createElement('script')
      script.src = '/course-data.js'
      script.onload = () => {
        if (window.CPPS) setData(window.CPPS)
      }
      document.body.appendChild(script)
    }
  }, [])

  // Save state updates
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

  if (!data) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-[hsl(0_0%_4%)] text-[hsl(0_0%_98%)]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest text-[hsl(0_0%_65%)] uppercase">Loading Course Data...</p>
      </div>
    )
  }

  const modules = data.modules
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
    }
  }

  const handleSelectQuizOpt = (modNum, qIdx, optIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [`${modNum}_${qIdx}`]: optIdx
    }))
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

  // Certificate PDF download
  const handleDownloadCertificate = async () => {
    if (!state.cert) return
    setIsGeneratingPdf(true)
    try {
      if (!window.PDFLib) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = '/vendor/pdf-lib.min.js'
          s.onload = res
          s.onerror = rej
          document.head.appendChild(s)
        })
      }
      if (!window.fontkit) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = '/vendor/fontkit.umd.min.js'
          s.onload = res
          s.onerror = rej
          document.head.appendChild(s)
        })
      }
      if (!window.CPPSCertificate) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = '/certificate.js'
          s.onload = res
          s.onerror = rej
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
        
        {/* Course Header Banner */}
        <div className="mb-8 p-6 bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] cyber-clip flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[hsl(217_91%_60%)] uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" /> Certified Phishing Prevention Specialist (CPPS)
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold uppercase text-[hsl(0_0%_98%)]">
              {currentMod.title}
            </h1>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="text-right">
              <span className="text-[hsl(0_0%_65%)] block">PROGRESS</span>
              <span className="font-bold text-[hsl(217_91%_60%)]">{Math.round((doneCount() / 14) * 100)}% ({doneCount()}/14 Done)</span>
            </div>
            <div className="text-right">
              <span className="text-[hsl(0_0%_65%)] block">EXPERIENCE</span>
              <span className="font-bold text-emerald-400">{state.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: Module Navigation */}
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

              {/* Final Certificate Action */}
              {state.cert && (
                <button
                  onClick={() => setView('certificate')}
                  className="w-full mt-4 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all"
                >
                  <Award className="w-4 h-4" /> VIEW CERTIFICATE
                </button>
              )}
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

              {/* Module Bottom Controls */}
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
      </div>
    </div>
  )
}
