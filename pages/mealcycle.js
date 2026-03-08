import { useMemo, useState } from 'react'
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
  Stethoscope,
  User,
  Utensils,
  X,
} from 'lucide-react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DOSAGE_STAGES, MEDICATIONS, MOCK_LOGS, MOCK_MEALS } from '../mealcycle/constants'

const APP_STAGES = {
  LANDING: 'landing',
  ONBOARDING: 'onboarding',
  DASHBOARD: 'dashboard',
}

const DASHBOARD_VIEWS = {
  WEEKLY: 'weekly',
  PROGRESS: 'progress',
}

const navItems = [
  { id: DASHBOARD_VIEWS.WEEKLY, label: 'Weekly Plan', icon: Utensils },
  { id: DASHBOARD_VIEWS.PROGRESS, label: 'Progress & Vitals', icon: Activity },
]

const stepMeta = [
  'Medication',
  'Dosage Stage',
  'Analysis',
]

function LandingPage({ onStart }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <p className="text-xl font-semibold tracking-tight">Mealcycle.co</p>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#science" className="hover:text-slate-900">Science</a>
            <button
              onClick={onStart}
              className="rounded-full bg-gradient-to-r from-teal-300 to-teal-700 px-5 py-2 font-medium text-white shadow-lg shadow-teal-900/20"
            >
              Build My Plan
            </button>
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen((prev) => !prev)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="space-y-2 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <a href="#features" className="block text-slate-600">Features</a>
            <a href="#science" className="block text-slate-600">Science</a>
            <button
              onClick={onStart}
              className="w-full rounded-xl bg-gradient-to-r from-teal-300 to-teal-700 px-4 py-2 text-white"
            >
              Build My Plan
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1 text-sm text-teal-800">
              <Sparkles className="h-4 w-4" /> Trusted by 14,000+ GLP-1 members
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Nutrition designed for your biological breakthrough
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Precision meal prep for appetite-suppressed weeks—protect lean muscle, calm nausea,
              and keep progress moving.
            </p>
            <button
              onClick={onStart}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-300 to-teal-700 px-6 py-3 font-medium text-white shadow-xl shadow-teal-700/30"
            >
              Build My Plan <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80',
            ].map((image) => (
              <img
                key={image}
                src={image}
                alt="Healthy meal"
                className="h-40 w-full rounded-2xl object-cover shadow-lg md:h-52"
              />
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Prevent Muscle Loss',
                desc: 'Protein-forward meal architecture timed to low-appetite windows.',
                icon: Dumbbell,
              },
              {
                title: 'Stop the Nausea',
                desc: 'Gentle textures and anti-nausea pairings for post-injection days.',
                icon: HeartPulse,
              },
              {
                title: 'Nutrient Density',
                desc: 'Every bite engineered with micronutrient richness and balanced energy.',
                icon: Sparkles,
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
              >
                <feature.icon className="h-7 w-7 text-teal-700" />
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-slate-600">{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="science" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold">Designed for GLP-1 physiology</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Mealcycle balances reduced appetite with elevated protein targets and symptom-aware
              foods, helping maintain lean mass while minimizing nausea and digestive discomfort.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

function OnboardingFlow({ profile, setProfile, onFinish }) {
  const [step, setStep] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)

  const progress = (step / stepMeta.length) * 100

  const startAnalysis = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, proteinTarget: 140 }))
      setIsCalculating(false)
    }, 1600)
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <p className="text-sm font-medium text-teal-700">Onboarding</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Build your precision plan</h2>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>{stepMeta[step - 1]}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-gradient-to-r from-teal-300 to-teal-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === 1 && (
          <div className="mt-8">
            <p className="text-sm text-slate-500">Step 1</p>
            <h3 className="mt-1 text-xl font-semibold">Which medication are you currently using?</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {MEDICATIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => setProfile((prev) => ({ ...prev, medication: item }))}
                  className={`rounded-2xl border p-4 text-left transition ${
                    profile.medication === item
                      ? 'border-teal-300 bg-teal-50 text-teal-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!profile.medication}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-2 text-white disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8">
            <p className="text-sm text-slate-500">Step 2</p>
            <h3 className="mt-1 text-xl font-semibold">What dosage phase are you in?</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {DOSAGE_STAGES.map((item) => (
                <button
                  key={item}
                  onClick={() => setProfile((prev) => ({ ...prev, dosageStage: item }))}
                  className={`rounded-2xl border p-4 text-left transition ${
                    profile.dosageStage === item
                      ? 'border-teal-300 bg-teal-50 text-teal-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setStep(1)} className="rounded-xl border px-5 py-2">
                Back
              </button>
              <button
                onClick={() => {
                  setStep(3)
                  startAnalysis()
                }}
                disabled={!profile.dosageStage}
                className="rounded-xl bg-slate-900 px-5 py-2 text-white disabled:opacity-40"
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8">
            <p className="text-sm text-slate-500">Step 3</p>
            <h3 className="mt-1 text-xl font-semibold">Biometric analysis</h3>
            {isCalculating ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-6 text-teal-800">
                <Loader2 className="h-5 w-5 animate-spin" />
                Calculating optimal macros, symptom strategy, and portion cadence...
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Summary</p>
                <p className="mt-2 text-lg font-semibold">
                  Calculated daily protein target: {profile.proteinTarget}g
                </p>
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
          </div>
        )}
      </div>
    </div>
  )
}

async function askGemini(prompt) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    return 'I can still help: choose soft, protein-rich foods like Greek yogurt, eggs, or smoothies, and sip ginger tea for nausea. Add small meals every 2–3 hours.'
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
    return 'Gemini is temporarily unavailable. For now: prioritize gentle high-protein options, hydration, and small frequent meals.'
  }
}

function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I am your GLP-1 nutrition assistant. Ask me about nausea, protein, or meal timing.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setLoading(true)

    const answer = await askGemini(question)
    setMessages((prev) => [...prev, { role: 'assistant', text: answer }])
    setLoading(false)
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Stethoscope className="h-4 w-4 text-teal-700" />
        <p className="text-sm font-semibold">AI Nutrition Assistant</p>
      </div>

      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`rounded-xl px-3 py-2 text-sm ${
              msg.role === 'assistant' ? 'bg-slate-100 text-slate-700' : 'bg-teal-700 text-white'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="text-xs text-slate-500">Thinking...</p>}
      </div>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I feel nauseous, what should I eat?"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-400 focus:ring"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"
          disabled={loading}
        >
          Send
        </button>
      </form>
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
                <span
                  key={tag}
                  className="rounded-full border border-teal-200 bg-teal-50 px-2 py-1 text-xs text-teal-800"
                >
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

function ProgressView() {
  const proteinAvg = useMemo(
    () => Math.round(MOCK_LOGS.reduce((sum, item) => sum + item.protein, 0) / MOCK_LOGS.length),
    []
  )
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
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="protein"
                fill="url(#proteinGradient)"
                stroke="#0f766e"
                strokeWidth={2}
                name="Protein (g)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="weight"
                stroke="#0f172a"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Weight (lbs)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
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

function Dashboard({ profile, onLogout }) {
  const [view, setView] = useState(DASHBOARD_VIEWS.WEEKLY)

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-2xl bg-gradient-to-r from-teal-100 to-teal-700 p-4 text-white shadow">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <p className="text-sm">{profile.name}</p>
            </div>
            <p className="mt-2 text-xs opacity-90">{profile.medication} • {profile.dosageStage}</p>
            <p className="mt-2 text-sm font-medium">Target: {profile.proteinTarget}g protein/day</p>
          </div>

          <nav className="mt-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  view === item.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={onLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm md:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{view === DASHBOARD_VIEWS.WEEKLY ? 'Weekly Plan' : 'Progress & Vitals'}</h2>
              <p className="text-sm text-slate-600">Personalized for your GLP-1 journey.</p>
            </div>
          </header>
          {view === DASHBOARD_VIEWS.WEEKLY ? <WeeklyPlanView /> : <ProgressView />}
        </main>
      </div>
    </div>
  )
}

export default function MealcyclePage() {
  const [stage, setStage] = useState(APP_STAGES.LANDING)
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    medication: '',
    dosageStage: '',
    proteinTarget: 0,
    currentWeight: 196.9,
  })

  if (stage === APP_STAGES.LANDING) {
    return <LandingPage onStart={() => setStage(APP_STAGES.ONBOARDING)} />
  }

  if (stage === APP_STAGES.ONBOARDING) {
    return (
      <OnboardingFlow
        profile={profile}
        setProfile={setProfile}
        onFinish={() => setStage(APP_STAGES.DASHBOARD)}
      />
    )
  }

  return <Dashboard profile={profile} onLogout={() => setStage(APP_STAGES.LANDING)} />
}
