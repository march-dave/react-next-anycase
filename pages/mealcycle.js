import { useMemo, useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import {
  Activity,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  LogOut,
  Menu,
  Sparkles,
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

const LandingPage = ({ onStart }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <p className="text-xl font-semibold tracking-tight">Mealcycle.co</p>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#science">Science</a>
            <button
              onClick={onStart}
              className="rounded-full bg-gradient-to-r from-teal-100 to-teal-700 px-5 py-2 font-medium text-white shadow-lg shadow-teal-900/20"
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
    }, 1800)
  }

  useEffect(() => {
    if (!analyzing || onboardingStep !== 3) return;
    const timer = setTimeout(() => {
      setAnalyzing(false);
      setProfile((prev) => ({
        ...prev,
        proteinTarget: generateProteinTarget(prev.dosageStage),
      }));
    }, 1700);

    return () => clearTimeout(timer);
  }, [analyzing, onboardingStep]);

        {step === 2 && (
          <div className="mt-8">
            <p className="text-sm text-slate-500">Step 2</p>
            <h3 className="mt-1 text-xl font-semibold">Select your dosage stage</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {DOSAGE_STAGES.map((item) => (
                <button
                  key={item}
                  onClick={() => setProfile((prev) => ({ ...prev, dosageStage: item }))}
                  className={`rounded-2xl border p-4 text-left ${
                    profile.dosageStage === item
                      ? 'border-teal-600 bg-teal-50 text-teal-900'
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
              <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-6 text-teal-800">
                Calculating optimal macros, symptom strategy, and portion cadence...
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
          text: 'Gemini API key is missing. Add NEXT_PUBLIC_GEMINI_API_KEY in .env.local to enable AI guidance.',
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

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response?.text || 'I could not generate a response right now. Please try again.',
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach Gemini right now. Please retry in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {stage === APP_STAGES.LANDING && (
        <Landing
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onBuildPlan={() => setStage(APP_STAGES.ONBOARDING)}
        />
      )}

      {stage === APP_STAGES.ONBOARDING && (
        <Onboarding
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          profile={profile}
          setProfile={setProfile}
          analyzing={analyzing}
          setAnalyzing={setAnalyzing}
          onRevealPlan={() => setStage(APP_STAGES.DASHBOARD)}
        />
      )}

      {stage === APP_STAGES.DASHBOARD && (
        <Dashboard
          profile={profile}
          view={view}
          setView={setView}
          proteinAverage={proteinAverage}
          symptomFreeDays={symptomFreeDays}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatMessages={chatMessages}
          chatLoading={chatLoading}
          onChatSubmit={handleChatSubmit}
          onLogout={() => {
            setStage(APP_STAGES.LANDING);
            setOnboardingStep(1);
            setView('weekly');
            setAnalyzing(false);
          }}
        />
      )}
    </main>
  );
}

function Landing({ onBuildPlan, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-12">
      <header className="sticky top-4 z-20 mb-12 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-lg shadow-teal-900/5 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Mealcycle.co</p>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-600">Features</a>
            <a href="#how" className="text-sm text-slate-600">How it works</a>
            <button onClick={onBuildPlan} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Get Started</button>
          </nav>
          <button className="md:hidden" onClick={() => setMobileMenuOpen((prev) => !prev)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 md:hidden">
            <a href="#features" className="block text-sm text-slate-600">Features</a>
            <a href="#how" className="block text-sm text-slate-600">How it works</a>
            <button onClick={onBuildPlan} className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Build My Plan</button>
          </div>
        ))}
        {loading && <p className="text-xs text-slate-500">Assistant is thinking...</p>}
      </div>
      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="I feel nauseous, what should I eat?"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <button className="rounded-xl bg-slate-900 px-4 text-sm text-white">Send</button>
      </form>
    </div>
  )
}

const Dashboard = ({ profile, onLogout }) => {
  const [activeView, setActiveView] = useState('weekly')

  const proteinAverage = useMemo(
    () => Math.round(MOCK_LOGS.reduce((sum, day) => sum + day.protein, 0) / MOCK_LOGS.length),
    []
  )

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-300/30">
          <div className="rounded-2xl bg-gradient-to-r from-teal-100 to-teal-700 p-4 text-white">
            <p className="text-xs uppercase tracking-wider text-teal-50">Profile</p>
            <h3 className="mt-1 text-xl font-semibold">Jordan Lee</h3>
            <p className="text-sm text-teal-50">
              {profile.medication} · {profile.dosageStage}
            </p>
            <p className="mt-3 text-sm">Target Protein: {profile.proteinTarget}g/day</p>
          </div>

        {onboardingStep === 2 && (
          <div>
            <h2 className="text-3xl font-semibold">Where are you in your dosage journey?</h2>
            <p className="mt-2 text-slate-600">Targets shift as your dosage and appetite adapt.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {DOSAGE_STAGES.map((stage) => (
                <button key={stage} onClick={() => setProfile((prev) => ({ ...prev, dosageStage: stage }))} className={`rounded-2xl border p-4 ${profile.dosageStage === stage ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}>
                  {stage}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setOnboardingStep(3);
                setAnalyzing(true);
              }}
              className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-white"
            >
              Run Analysis
            </button>
          </div>
        )}

          <button
            onClick={onLogout}
            className="mt-6 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-slate-600"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="space-y-4">
          {activeView === 'weekly' && (
            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/30">
                <h2 className="text-2xl font-semibold">Weekly Plan</h2>
                <p className="mt-1 text-slate-600">High-protein meals tuned for GLP-1 tolerance.</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {MOCK_MEALS.map((meal) => (
                    <article
                      key={meal.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <img src={meal.image} alt={meal.title} className="h-32 w-full object-cover" />
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
                  <p className="mt-1 text-2xl font-semibold">5 / 7</p>
                </div>
              </div>

              <div className="mt-8 h-80 rounded-2xl bg-slate-50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MOCK_LOGS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#0f766e" />
                    <YAxis yAxisId="right" orientation="right" stroke="#0f172a" domain={[194, 202]} />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#f8fafc',
                      }}
                    />
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
    return <OnboardingFlow profile={profile} setProfile={setProfile} onFinish={() => setView('dashboard')} />
  }
  return <Dashboard profile={profile} onLogout={() => setView('landing')} />
}
