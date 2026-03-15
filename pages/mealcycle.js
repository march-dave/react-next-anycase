import { useEffect, useMemo, useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import {
  Activity,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Loader2,
  LogOut,
  Menu,
  Sparkles,
  User,
  Utensils,
  User,
  X,
} from 'lucide-react'
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DOSAGE_STAGES, MEDICATIONS, MOCK_LOGS, MOCK_MEALS } from '../mealcycle/constants'

const APP_STAGE = {
  LANDING: 'landing',
  ONBOARDING: 'onboarding',
  DASHBOARD: 'dashboard',
}

const MEDICATIONS = ['Ozempic', 'Mounjaro', 'Wegovy', 'Zepbound', 'Other']
const DOSAGE_STAGES = ['Initiation', 'Titration', 'Maintenance']

const STARTING_PROFILE = {
  name: 'Taylor M.',
  medication: 'Ozempic',
  dosageStage: 'Initiation',
  proteinTarget: 120,
}

const BASE_CHAT = [
  {
    role: 'assistant',
    text: 'Hi, I am your GLP-1 nutrition assistant. Ask about nausea-safe foods, protein goals, or meal timing.',
  },
]

const stepMeta = ['Medication', 'Dosage Stage', 'Analysis']

const landingFeatures = [
  {
    title: 'Prevent Muscle Loss',
    desc: 'Hit therapeutic protein targets with smaller-volume meals designed for suppressed appetite.',
    icon: Dumbbell,
  },
  {
    title: 'Stop the Nausea',
    desc: 'Gentle textures, low-grease prep, and anti-nausea ingredients help minimize digestive distress.',
    icon: HeartPulse,
  },
  {
    title: 'Nutrient Density',
    desc: 'Every plate is optimized for micronutrients, hydration support, and blood sugar stability.',
    icon: Sparkles,
  },
]

const heroImages = [
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
]

function LandingPage({ onStart }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold tracking-tight">Mealcycle.co</div>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <button onClick={onStart} className={`rounded-2xl px-5 py-2 font-medium ${gradientButton}`}>
              Build My Plan
            </button>
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen((prev) => !prev)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <div className="space-y-3 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <a href="#features" className="block text-slate-700">
              Features
            </a>
            <a href="#how" className="block text-slate-700">
              How it works
            </a>
            <button onClick={onStart} className={`w-full rounded-2xl px-5 py-2 font-medium ${gradientButton}`}>
              Get Started
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm text-teal-800">
              <Sparkles className="h-4 w-4" /> Trusted by 14,000+ GLP-1 users
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Nutrition designed for your biological breakthrough
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              A specialized meal prep protocol for Ozempic, Mounjaro, and Wegovy patients to support muscle
              retention, appetite shifts, and symptom relief.
            </p>
            <button
              onClick={onStart}
              className={`mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-medium ${gradientButton}`}
            >
              Build My Plan <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
            ].map((image) => (
              <img key={image} src={image} alt="Healthy meal" className="h-40 w-full rounded-2xl object-cover shadow-lg md:h-56" />
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Prevent Muscle Loss',
                desc: 'Protein-forward planning anchored to low appetite windows to protect lean mass.',
                icon: Dumbbell,
              },
              {
                title: 'Stop the Nausea',
                desc: 'Gentle textures and lower-fat pairings for injection-day symptom management.',
                icon: HeartPulse,
              },
              {
                title: 'Nutrient Density',
                desc: 'Micronutrient-rich meals with hydration cues and smart portion design.',
                icon: Sparkles,
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70"
              >
                <feature.icon className="h-7 w-7 text-teal-700" />
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-slate-600">{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="science" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold">Designed for GLP-1 physiology</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Mealcycle balances reduced appetite with elevated protein targets and symptom-aware foods, helping
              maintain lean mass while minimizing nausea and digestive discomfort.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

function Onboarding({ profile, setProfile, onFinish }) {
  const [step, setStep] = useState(1)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    if (!calculating) return
    const timer = setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        proteinTarget: proteinTargetFromStage(prev.dosageStage),
      }))
      setCalculating(false)
    }, 1600)

    return () => clearTimeout(timer)
  }, [calculating, setProfile])

  const startAnalysis = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, proteinTarget: 140 }))
      setIsCalculating(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/40">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-slate-500">
            <span>Step {step} of 3</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-gradient-to-r from-teal-300 to-teal-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold">Select your medication</h2>
            <p className="mt-2 text-slate-600">This personalizes nausea and protein guidance.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {MEDICATIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => setProfile((prev) => ({ ...prev, medication: item }))}
                  className={`rounded-2xl border p-4 text-left ${
                    profile.medication === item ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className={`mt-6 rounded-2xl px-5 py-2 font-medium ${gradientButton}`}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold">Choose dosage stage</h2>
            <p className="mt-2 text-slate-600">Your stage impacts protein targets and meal size planning.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {DOSAGE_STAGES.map((item) => (
                <button
                  key={item}
                  onClick={() => setProfile((prev) => ({ ...prev, dosageStage: item }))}
                  className={`rounded-2xl border p-4 text-left ${
                    profile.dosageStage === item ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button onClick={() => { setStep(3); setCalculating(true) }} className={`mt-6 rounded-2xl px-5 py-2 font-medium ${gradientButton}`}>
              Analyze
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold">Building your profile</h2>
            {calculating ? (
              <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" /> Calculating protein strategy...
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Summary</p>
                <p className="mt-2 text-lg font-semibold">Calculated daily protein target: {profile.proteinTarget}g</p>
                <p className="mt-2 text-slate-600">
                  Plan includes anti-nausea meals, smaller portions, and high-density proteins.
                </p>
                <button
                  onClick={onFinish}
                  className="mt-5 rounded-xl bg-gradient-to-r from-teal-300 to-teal-700 px-5 py-2 text-white"
                >
                  Reveal My Plan
                </button>
              </div>
            )}

            <button
              disabled={calculating}
              onClick={onFinish}
              className={`mt-6 rounded-2xl px-5 py-2 font-medium ${gradientButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Reveal My Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

async function askGemini(prompt) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    return 'No API key detected. I can still help: choose soft, protein-rich foods like Greek yogurt, eggs, or smoothies, and sip ginger tea for nausea.'
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction:
          'You are an expert nutritionist for GLP-1 patients. Keep answers under 100 words. Focus on protein and symptom management.',
      },
      contents: prompt,
    })

    return response.text || 'I could not generate a response. Please try again.'
  } catch (error) {
    return 'Gemini is temporarily unavailable. For now, prioritize gentle high-protein foods, hydration, and small frequent meals.'
  }
}

function AIChatWidget() {
  const [messages, setMessages] = useState(BASE_CHAT)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Gemini API key is missing. Fallback: try soft, low-fat proteins like Greek yogurt, eggs, tofu, and broth-based soups in small meals every 2-3 hours.',
        },
      ])
      return
    }

    setLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey })
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: {
          systemInstruction:
            'You are an expert nutritionist for GLP-1 patients. Keep answers under 100 words. Focus on protein and symptom management.',
        },
      })

      const text =
        response?.text ||
        'Prioritize 20-30g protein mini meals, hydrate steadily, and choose low-fat textures when nausea rises.'

      setMessages((prev) => [...prev, { role: 'assistant', text }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not reach Gemini. Fallback: split meals into small portions, add protein first, and use bland options like oats, yogurt, eggs, and bananas on rough days.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/70">
      <h3 className="text-base font-semibold">AI Nutrition Assistant</h3>
      <div className="mt-3 h-72 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
              message.role === 'assistant' ? 'bg-white text-slate-700' : 'ml-auto bg-teal-600 text-white'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="I feel nauseous, what should I eat?"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <button type="submit" className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  )
}

const ProgressTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-slate-900/95 px-3 py-2 text-xs text-slate-50 shadow-xl">
      <p className="font-semibold">{label}</p>
      <p>Protein: {payload[0]?.value}g</p>
      <p>Weight: {payload[1]?.value} lbs</p>
    </div>
  )
}

function WeeklyPlanView() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="grid gap-5 sm:grid-cols-2">
        {MOCK_MEALS.map((meal) => (
          <article key={meal.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <img src={meal.image} alt={meal.title} className="h-44 w-full rounded-xl object-cover" />
            <h3 className="mt-4 text-lg font-semibold">{meal.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{meal.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {meal.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-teal-200 bg-teal-50 px-2 py-1 text-xs text-teal-800">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-sm">
              <span>Protein: {meal.protein}g</span>
              <span>Calories: {meal.calories}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="xl:h-[640px]">
        <ChatWidget />
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function ProgressView() {
  const proteinAvg = useMemo(() => Math.round(MOCK_LOGS.reduce((sum, item) => sum + item.protein, 0) / MOCK_LOGS.length), [])
  const symptomFreeDays = useMemo(() => MOCK_LOGS.filter((item) => item.nausea === 0).length, [])
  const currentWeight = MOCK_LOGS[MOCK_LOGS.length - 1]?.weight || 0

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Current Weight" value={`${currentWeight} lbs`} />
        <StatCard label="Daily Protein Avg" value={`${proteinAvg} g`} />
        <StatCard label="Symptom-Free Days" value={`${symptomFreeDays} / 7`} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="text-lg font-semibold">Weekly trend</h3>
        <p className="mt-1 text-sm text-slate-500">Protein intake vs. body weight</p>
        <div className="mt-5 h-72 w-full md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={MOCK_LOGS}>
              <defs>
                <linearGradient id="proteinGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" stroke="#0f766e" />
              <YAxis yAxisId="right" orientation="right" stroke="#334155" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip content={<ProgressTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Area yAxisId="left" type="monotone" dataKey="protein" fill="url(#proteinGradient)" stroke="#0f766e" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ profile, onLogout }) {
  const [view, setView] = useState('weekly')

  const navItems = useMemo(
    () => [
      { id: 'weekly', label: 'Weekly Plan', icon: Utensils },
      { id: 'progress', label: 'Progress & Vitals', icon: Activity },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-2xl bg-gradient-to-r from-teal-200 to-teal-700 p-4 text-white shadow">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <p className="text-sm">{profile.name}</p>
            </div>
            <p className="mt-2 text-xs opacity-90">{profile.medication} • {profile.dosageStage}</p>
            <p className="mt-2 text-sm font-medium">Target: {profile.proteinTarget}g protein/day</p>
          </div>
        )}

          <nav className="mt-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  view === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={onLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm md:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {view === DASHBOARD_VIEWS.WEEKLY ? 'Weekly Plan' : 'Progress & Vitals'}
              </h2>
              <p className="text-sm text-slate-600">Personalized for your GLP-1 journey.</p>
            </div>
          ) : (
            <ProgressView />
          )}
        </section>
      </div>
    </div>

    <div className='mt-8 h-80 rounded-2xl bg-slate-50 p-4'>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart data={MOCK_LOGS}>
          <CartesianGrid strokeDasharray='3 3' stroke='#cbd5e1' />
          <XAxis dataKey='day' stroke='#64748b' />
          <YAxis yAxisId='left' stroke='#0f766e' />
          <YAxis yAxisId='right' orientation='right' stroke='#0f172a' domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip
            contentStyle={{ borderRadius: '14px', border: '1px solid #cbd5e1', background: '#ffffff' }}
          />
          <Legend />
          <Area
            yAxisId='left'
            type='monotone'
            dataKey='protein'
            fill='#99f6e4'
            stroke='#0f766e'
            name='Protein (g)'
          />
          <Line
            yAxisId='right'
            type='monotone'
            dataKey='weight'
            stroke='#0f172a'
            strokeWidth={2.4}
            dot={{ r: 3 }}
            name='Weight (lb)'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </section>
)

const Dashboard = ({ profile, onLogout }) => {
  const [view, setView] = useState('weekly')
  const navItems = [
    { id: 'weekly', label: 'Weekly Plan', icon: Utensils },
    { id: 'progress', label: 'Progress & Vitals', icon: Activity },
  ]

function ProgressView() {
  const proteinAvg = useMemo(
    () => Math.round(MOCK_LOGS.reduce((sum, item) => sum + item.protein, 0) / MOCK_LOGS.length),
    []
  )
  const symptomFreeDays = useMemo(() => MOCK_LOGS.filter((day) => day.nausea === 0).length, [])

export default function MealcyclePage() {
  const [stage, setStage] = useState(APP_STAGE.LANDING)
  const [profile, setProfile] = useState(STARTING_PROFILE)

  if (stage === APP_STAGE.LANDING) {
    return <LandingPage onStart={() => setStage(APP_STAGE.ONBOARDING)} />
  }

  if (stage === APP_STAGES.ONBOARDING) {
    return <OnboardingFlow profile={profile} setProfile={setProfile} onFinish={() => setStage(APP_STAGES.DASHBOARD)} />
  }

  return <Dashboard profile={profile} onLogout={() => {
    setProfile(STARTING_PROFILE)
    setStage(APP_STAGE.LANDING)
  }} />
}
