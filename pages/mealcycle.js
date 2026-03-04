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
  Salad,
  Sparkles,
  Stethoscope,
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

const navItems = [
  { id: 'weekly', label: 'Weekly Plan', icon: Utensils },
  { id: 'progress', label: 'Progress & Vitals', icon: Activity },
]

const landingFeatures = [
  {
    title: 'Prevent Muscle Loss',
    desc: 'Protein-forward meal architecture tuned for low-appetite windows after injections.',
    icon: Dumbbell,
  },
  {
    title: 'Stop the Nausea',
    desc: 'Comfort-first textures, anti-nausea pairings, and digestion-aware seasoning.',
    icon: HeartPulse,
  },
  {
    title: 'Nutrient Density',
    desc: 'Low-volume meals engineered for micronutrient richness and sustained energy.',
    icon: Sparkles,
  },
]

const heroImages = [
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
]

const LandingPage = ({ onStart }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <p className="text-xl font-semibold tracking-tight">Mealcycle.co</p>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#science">Science</a>
            <button
              onClick={onStart}
              className="rounded-full bg-gradient-to-r from-teal-300 to-teal-700 px-5 py-2 font-medium text-white shadow-lg shadow-teal-900/25"
            >
              Build My Plan
            </button>
          </nav>
          <button
            className="rounded-lg p-1 text-slate-700 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="space-y-2 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <a href="#features" className="block text-slate-600">
              Features
            </a>
            <a href="#science" className="block text-slate-600">
              Science
            </a>
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
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1 text-sm text-teal-800">
              <Stethoscope className="h-4 w-4" /> Trusted by 14,000+ GLP-1 members
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Nutrition designed for your biological breakthrough
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              A specialized meal prep protocol for Ozempic, Mounjaro, and Wegovy patients to
              support muscle retention, appetite shifts, and symptom relief.
            </p>
            <button
              onClick={onStart}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-300 to-teal-700 px-6 py-3 font-medium text-white shadow-xl shadow-teal-700/30"
            >
              Build My Plan <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {heroImages.map((image) => (
              <img
                key={image}
                src={image}
                alt="Healthy meal"
                className="h-40 w-full rounded-2xl object-cover shadow-xl shadow-slate-400/20 md:h-52"
              />
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {landingFeatures.map((feature) => (
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

        <section id="science" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/70">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Clinical focus</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
              Built for the realities of GLP-1 appetite suppression
            </h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              We help you reach therapeutic goals without sacrificing muscle, hydration, or recovery
              by sequencing high-protein meals around your lowest tolerance windows.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

const OnboardingFlow = ({ profile, setProfile, onFinish }) => {
  const [step, setStep] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)

  const startAnalysis = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, proteinTarget: 140 }))
      setIsCalculating(false)
    }, 1600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/50">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Onboarding</p>
        <h2 className="mt-2 text-3xl font-semibold">Build your GLP-1 protocol</h2>

        <div className="mt-6 h-2 rounded-full bg-slate-200">
          <div
            style={{ width: `${(step / 3) * 100}%` }}
            className="h-full rounded-full bg-gradient-to-r from-teal-300 to-teal-700 transition-all"
          />
        </div>

    const timer = setTimeout(() => {
      setAnalyzing(false);
      setProfile((prev) => ({
        ...prev,
        proteinTarget: generateProteinTarget(prev.dosageStage),
      }));
    }, 1700);

    return () => clearTimeout(timer);
  }, [analyzing]);

        {step === 3 && (
          <div className="mt-8">
            <p className="text-sm text-slate-500">Step 3</p>
            <h3 className="mt-1 text-xl font-semibold">Biometric analysis</h3>
            {isCalculating ? (
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50 p-6 text-teal-800">
                <Loader2 className="h-4 w-4 animate-spin" /> Calculating optimal macros, symptom
                strategy, and portion cadence...
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Summary</p>
                <p className="mt-2 text-lg font-semibold">
                  Calculated daily protein target: {profile.proteinTarget}g
                </p>
                <p className="mt-2 text-slate-600">
                  Your plan prioritizes easy-digest proteins, hydration timing, and low-volume,
                  high-nutrient meals.
                </p>
              </div>
            )}
            <button
              onClick={onFinish}
              disabled={isCalculating}
              className="mt-6 rounded-xl bg-gradient-to-r from-teal-300 to-teal-700 px-6 py-3 font-medium text-white disabled:opacity-50"
            >
              Reveal My Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I can help with GLP-1 nutrition and symptom management. Ask me anything.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (event) => {
    event.preventDefault()
    if (!input.trim()) return

    const question = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Gemini key missing. Add NEXT_PUBLIC_GEMINI_API_KEY to enable the nutrition assistant.',
        },
      ])
      return
    }

    setLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey });
      const transcript = nextMessages.map((message) => `${message.role}: ${message.text}`).join('\n');

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
        'Try 25-35g protein at each meal, keep portions small, and choose lower-fat foods when nausea is active.';

      setChatMessages((prev) => [...prev, { role: 'assistant', text }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not reach Gemini right now. Fallback tip: include at least 20g protein in each mini-meal and pair it with hydration to protect lean mass.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-300/30">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">AI Nutrition Assistant</h4>
      <div className="max-h-72 space-y-3 overflow-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-xl p-3 text-sm ${
              message.role === 'assistant' ? 'bg-slate-100 text-slate-700' : 'bg-teal-600 text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 md:hidden">
            <a href="#features" className="block text-sm text-slate-700">Features</a>
            <a href="#how" className="block text-sm text-slate-700">How it works</a>
            <button
              onClick={onBuildPlan}
              className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Build My Plan
            </button>
          </div>
        )}
      </header>

      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
            <ShieldCheck className="h-4 w-4" /> Trusted by 10,000+ GLP-1 members
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Nutrition designed for your biological breakthrough
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            High-protein, symptom-aware meal prep and daily tracking built specifically for Ozempic,
            Mounjaro, Wegovy, and related GLP-1 protocols.
          </p>
          <button
            onClick={onBuildPlan}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-200 to-teal-700 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-teal-900/20"
          >
            Build My Plan <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80"
            alt="High protein meal"
            className="h-[450px] w-full rounded-3xl object-cover shadow-2xl shadow-slate-900/20"
          />
          <div className="absolute bottom-4 left-4 rounded-2xl border border-white/40 bg-white/80 p-4 backdrop-blur">
            <p className="text-sm font-medium text-slate-700">Avg daily protein adherence</p>
            <p className="mt-1 text-2xl font-bold text-teal-700">92%</p>
          </div>
        </div>
      </section>

      <section id="features" className="mt-20">
        <h2 className="text-3xl font-semibold">Why Mealcycle works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={Activity}
            title="Prevent Muscle Loss"
            text="Protein-forward meal structures and auto-adjusted targets preserve lean mass during rapid appetite changes."
          />
          <FeatureCard
            icon={HeartPulse}
            title="Stop the Nausea"
            text="Low-fat, easy-digesting options with hydration prompts and anti-nausea ingredient logic."
          />
          <FeatureCard
            icon={Sparkles}
            title="Nutrient Density"
            text="Micronutrient-rich meals maximize intake in smaller portions without sacrificing satiety."
          />
        </div>
      </section>

      <section id="how" className="mt-20 grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 lg:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
          alt="Prepared healthy meals"
          className="h-full min-h-[260px] w-full rounded-2xl object-cover"
        />
        <button className="rounded-xl bg-slate-900 px-4 text-sm text-white">Send</button>
      </form>
    </aside>
  )
}

const ProgressTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-slate-900/95 px-3 py-2 text-xs text-slate-50 shadow-xl">
      <p className="font-semibold">{label}</p>
      <p>Protein: {payload[0]?.value}g</p>
      <p>Weight: {payload[1]?.value} lb</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5">
      <Icon className="h-6 w-6 text-teal-700" />
      <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{text}</p>
    </article>
  );
}

  const proteinAverage = useMemo(
    () => Math.round(MOCK_LOGS.reduce((sum, day) => sum + day.protein, 0) / MOCK_LOGS.length),
    []
  )
  const symptomFreeDays = useMemo(() => MOCK_LOGS.filter((day) => day.nausea === 0).length, [])

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-300/30 lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-2xl bg-gradient-to-r from-teal-300 to-teal-700 p-4 text-white">
            <p className="text-xs uppercase tracking-wider text-teal-50">Profile</p>
            <h3 className="mt-1 text-xl font-semibold">Jordan Lee</h3>
            <p className="text-sm text-teal-50">
              {profile.medication} · {profile.dosageStage}
            </p>
            <p className="mt-3 text-sm">Target Protein: {profile.proteinTarget}g/day</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({
  profile,
  view,
  setView,
  proteinAverage,
  symptomFreeDays,
  chatInput,
  setChatInput,
  chatMessages,
  chatLoading,
  onChatSubmit,
  onLogout,
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-200 bg-white p-6 lg:border-b-0 lg:border-r">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Welcome back,</p>
          <p className="text-xl font-semibold">{profile.name}</p>
          <p className="mt-2 text-sm text-slate-600">
            {profile.medication} • {profile.dosageStage}
          </p>
          <p className="text-sm text-teal-700">Protein target: {profile.proteinTarget}g</p>
        </div>

        <nav className="mt-8 space-y-2">
          <button
            onClick={() => setView('weekly')}
            className={`w-full rounded-xl px-4 py-3 text-left ${
              view === 'weekly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Weekly Plan
          </button>
          <button
            onClick={() => setView('progress')}
            className={`w-full rounded-xl px-4 py-3 text-left ${
              view === 'progress' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Progress & Vitals
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="mt-10 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      <section className="grid gap-6 p-6 xl:grid-cols-[1fr_340px]">
        <div>{view === 'weekly' ? <WeeklyPlan /> : <ProgressView proteinAverage={proteinAverage} symptomFreeDays={symptomFreeDays} currentWeight={profile.currentWeight} />}</div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
          <h3 className="text-lg font-semibold">AI Nutrition Assistant</h3>
          <p className="text-sm text-slate-500">Ask about nausea, protein timing, and meal swaps.</p>

          <div className="mt-4 h-[380px] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl px-3 py-2 text-sm ${
                  message.role === 'assistant'
                    ? 'max-w-[95%] bg-white text-slate-700'
                    : 'ml-auto max-w-[85%] bg-teal-600 text-white'
                }`}
              >
                {message.text}
              </div>
            ))}
            {chatLoading && <p className="text-sm text-slate-500">Thinking...</p>}
          </div>

          <form onSubmit={onChatSubmit} className="mt-3 flex gap-2">
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="I feel nauseous, what should I eat?"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function WeeklyPlan() {
  return (
    <div>
      <h2 className="text-3xl font-semibold">Your Weekly Plan</h2>
      <p className="mt-2 text-slate-600">
        Protein-first meals curated for appetite suppression and symptom control.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MOCK_MEALS.map((meal) => (
          <article
            key={meal.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="space-y-4">
          {activeView === 'weekly' && (
            <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Weekly Plan</h2>
                  <span className="hidden items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 sm:inline-flex">
                    <Salad className="h-3.5 w-3.5" /> GLP-1 Optimized Meals
                  </span>
                </div>
                <p className="mt-1 text-slate-600">High-protein meals tuned for GLP-1 tolerance.</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {MOCK_MEALS.map((meal) => (
                    <article
                      key={meal.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <img src={meal.image} alt={meal.title} className="h-36 w-full object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold">{meal.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{meal.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {meal.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-between text-sm font-medium text-slate-700">
                          <span>Protein {meal.protein}g</span>
                          <span>{meal.calories} kcal</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <AIChat />
            </div>
          )}

          {activeView === 'progress' && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/30">
              <h2 className="text-2xl font-semibold">Progress & Vitals</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Current Weight</p>
                  <p className="mt-1 text-2xl font-semibold">196.9 lb</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Daily Protein Avg</p>
                  <p className="mt-1 text-2xl font-semibold">{proteinAverage} g</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Symptom-Free Days</p>
                  <p className="mt-1 text-2xl font-semibold">{symptomFreeDays} / 7</p>
                </div>
              </div>

              <div className="mt-8 h-80 rounded-2xl bg-slate-50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MOCK_LOGS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#0f766e" />
                    <YAxis yAxisId="right" orientation="right" stroke="#0f172a" domain={[194, 202]} />
                    <Tooltip content={<ProgressTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="protein"
                      name="Protein (g)"
                      fill="#99f6e4"
                      stroke="#0f766e"
                      fillOpacity={0.7}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="weight"
                      name="Weight (lb)"
                      stroke="#0f172a"
                      strokeWidth={3}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default function MealcyclePage() {
  const [view, setView] = useState('landing')
  const [profile, setProfile] = useState({
    medication: 'Ozempic',
    dosageStage: 'Initiation',
    proteinTarget: 0,
  })

  if (view === 'landing') return <LandingPage onStart={() => setView('onboarding')} />
  if (view === 'onboarding') {
    return (
      <OnboardingFlow profile={profile} setProfile={setProfile} onFinish={() => setView('dashboard')} />
    )
  }
  return <Dashboard profile={profile} onLogout={() => setView('landing')} />
}
