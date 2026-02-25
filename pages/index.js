import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ChevronRight,
  HeartPulse,
  LogOut,
  Menu,
  MessageCircle,
  Pill,
  Scale,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GoogleGenAI } from '@google/genai';
import { MOCK_LOGS, MOCK_MEALS } from '../constants';

const medications = ['Ozempic', 'Mounjaro', 'Wegovy', 'Zepbound', 'Other'];
const dosageStages = ['Initiation', 'Titration', 'Maintenance'];

export default function MealcycleApp() {
  const [view, setView] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedMedication, setSelectedMedication] = useState('Ozempic');
  const [selectedStage, setSelectedStage] = useState('Initiation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('weekly');

  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi, I am your GLP-1 nutrition assistant. Ask me about protein targets, nausea-friendly meals, or appetite changes.',
    },
  ]);

  useEffect(() => {
    if (onboardingStep === 3) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 1800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onboardingStep]);

  const proteinAverage = useMemo(
    () => Math.round(MOCK_LOGS.reduce((sum, day) => sum + day.protein, 0) / MOCK_LOGS.length),
    []
  );

  const symptomFreeDays = useMemo(() => MOCK_LOGS.filter((day) => day.symptomFree).length, []);

  const currentWeight = MOCK_LOGS[MOCK_LOGS.length - 1]?.weight ?? 0;
  const proteinTarget = selectedStage === 'Initiation' ? 120 : selectedStage === 'Titration' ? 140 : 150;

  const sendChatMessage = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    setChatMessages((prev) => [...prev, { role: 'user', content: message }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Missing API key');
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction:
            'You are an expert nutritionist for GLP-1 patients. Keep answers under 100 words. Focus on protein and symptom management.',
        },
      });

      const text = response.text || 'I can help with protein planning, nausea-safe meals, and hydration pacing.';
      setChatMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I cannot reach the AI service right now. For nausea, try small protein-forward meals like yogurt, eggs, or broth with shredded chicken every 2-3 hours.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const startOnboarding = () => {
    setView('onboarding');
    setMobileMenuOpen(false);
  };

  const revealPlan = () => {
    setIsLoggedIn(true);
    setView('dashboard');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setView('landing');
    setOnboardingStep(1);
    setDashboardTab('weekly');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {view === 'landing' && (
        <div>
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-teal-100 to-teal-700 p-2 text-white shadow-card">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">Mealcycle.co</span>
              </div>
              <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
                <a href="#features">Features</a>
                <a href="#how-it-works">How it works</a>
                <button
                  className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white"
                  onClick={startOnboarding}
                >
                  Build My Plan
                </button>
              </nav>
              <button className="md:hidden" onClick={() => setMobileMenuOpen((open) => !open)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="space-y-3 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
                <a href="#features" className="block text-sm text-slate-700">
                  Features
                </a>
                <a href="#how-it-works" className="block text-sm text-slate-700">
                  How it works
                </a>
                <button
                  className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                  onClick={startOnboarding}
                >
                  Get Started
                </button>
              </div>
            )}
          </header>

          <main className="mx-auto max-w-7xl px-6 pb-20 pt-16">
            <section className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <span className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
                  Trusted by 20,000+ GLP-1 users
                </span>
                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
                  Nutrition designed for your biological breakthrough.
                </h1>
                <p className="max-w-xl text-lg text-slate-600">
                  Precision meals and adaptive guidance for Ozempic, Mounjaro, and Wegovy users to
                  protect muscle mass, reduce nausea, and hit consistent protein goals.
                </p>
                <button
                  onClick={startOnboarding}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-200 to-teal-700 px-6 py-3 font-semibold text-white shadow-card"
                >
                  Build My Plan
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <img
                  className="h-[460px] w-full rounded-3xl object-cover shadow-card"
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1300&q=80"
                  alt="Prepared meal"
                />
                <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 p-4 backdrop-blur">
                  <p className="text-sm font-medium text-slate-700">Today&apos;s macro compliance</p>
                  <p className="text-2xl font-semibold text-teal-700">94%</p>
                </div>
              </div>
            </section>

            <section id="features" className="mt-24 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Target,
                  title: 'Prevent Muscle Loss',
                  text: 'Protein-forward planning optimized around appetite suppression windows.',
                },
                {
                  icon: Sparkles,
                  title: 'Stop the Nausea',
                  text: 'Gentle texture profiles and anti-nausea pairings built into each delivery.',
                },
                {
                  icon: Activity,
                  title: 'Nutrient Density',
                  text: 'Micronutrient-rich menus to prevent fatigue and support long-term adherence.',
                },
              ].map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                  <feature.icon className="mb-4 h-6 w-6 text-teal-700" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.text}</p>
                </div>
              ))}
            </section>
          </main>
        </div>
      )}

      {view === 'onboarding' && (
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-14">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Onboarding</span>
              <span>Step {onboardingStep} of 3</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-200 to-teal-700 transition-all"
                style={{ width: `${(onboardingStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            {onboardingStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold">Which medication are you on?</h2>
                <p className="mt-2 text-slate-600">We tailor portioning and protein pacing by medication.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {medications.map((med) => (
                    <button
                      key={med}
                      onClick={() => setSelectedMedication(med)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        selectedMedication === med
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {med}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold">What dosage stage are you in?</h2>
                <p className="mt-2 text-slate-600">Your stage affects appetite variability and meal density.</p>
                <div className="mt-6 space-y-3">
                  {dosageStages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setSelectedStage(stage)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        selectedStage === stage
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="text-center">
                {isAnalyzing ? (
                  <div className="space-y-4 py-8">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" />
                    <h2 className="text-2xl font-semibold">Calculating your metabolic profile...</h2>
                    <p className="text-slate-600">Analyzing medication and stage data for meal timing.</p>
                  </div>
                ) : (
                  <div className="space-y-5 py-4">
                    <h2 className="text-2xl font-semibold">Your plan is ready.</h2>
                    <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 text-left">
                      <p className="text-sm text-teal-800">Calculated daily protein target</p>
                      <p className="text-3xl font-semibold text-teal-900">{proteinTarget}g</p>
                      <p className="mt-2 text-sm text-teal-800">
                        Based on {selectedMedication} and {selectedStage.toLowerCase()} stage.
                      </p>
                    </div>
                    <button
                      className="rounded-2xl bg-gradient-to-r from-teal-200 to-teal-700 px-6 py-3 font-semibold text-white"
                      onClick={revealPlan}
                    >
                      Reveal My Plan
                    </button>
                  </div>
                )}
              </div>
            )}

            {onboardingStep < 3 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setOnboardingStep((step) => Math.min(step + 1, 3))}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'dashboard' && isLoggedIn && (
        <div className="flex min-h-screen flex-col md:flex-row">
          <aside className="w-full border-b border-slate-200 bg-white p-6 md:w-72 md:border-b-0 md:border-r">
            <div className="rounded-2xl bg-gradient-to-r from-teal-100 to-teal-700 p-4 text-white shadow-card">
              <p className="text-sm opacity-80">Welcome back</p>
              <h2 className="text-xl font-semibold">Avery Patel</h2>
              <p className="mt-2 text-sm">{selectedMedication} • {selectedStage}</p>
            </div>

            <nav className="mt-8 space-y-2">
              <button
                onClick={() => setDashboardTab('weekly')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                  dashboardTab === 'weekly' ? 'bg-teal-50 text-teal-800' : 'text-slate-700'
                }`}
              >
                <Pill className="h-4 w-4" /> Weekly Plan
              </button>
              <button
                onClick={() => setDashboardTab('progress')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                  dashboardTab === 'progress' ? 'bg-teal-50 text-teal-800' : 'text-slate-700'
                }`}
              >
                <Scale className="h-4 w-4" /> Progress & Vitals
              </button>
            </nav>

            <button
              onClick={logout}
              className="mt-10 flex items-center gap-2 rounded-xl text-sm font-medium text-slate-500"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </aside>

          <main className="flex-1 bg-slate-50 p-6 lg:p-10">
            {dashboardTab === 'weekly' && (
              <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
                <section>
                  <h1 className="text-3xl font-semibold">Weekly Meal Plan</h1>
                  <p className="mt-2 text-slate-600">High protein, low-GI meals curated for symptom stability.</p>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {MOCK_MEALS.map((meal) => (
                      <article key={meal.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
                        <img src={meal.image} alt={meal.title} className="h-40 w-full object-cover" />
                        <div className="space-y-3 p-4">
                          <h3 className="text-lg font-semibold">{meal.title}</h3>
                          <p className="text-sm text-slate-600">{meal.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {meal.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>Protein {meal.protein}g</span>
                            <span>{meal.calories} kcal</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                  <div className="mb-4 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-teal-700" />
                    <h2 className="font-semibold">AI Nutrition Assistant</h2>
                  </div>
                  <div className="no-scrollbar mb-4 h-80 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
                    {chatMessages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                          message.role === 'user'
                            ? 'ml-auto bg-slate-900 text-white'
                            : 'bg-white text-slate-700 shadow-sm'
                        }`}
                      >
                        {message.content}
                      </div>
                    ))}
                    {chatLoading && <p className="text-sm text-slate-500">Assistant is thinking...</p>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && sendChatMessage()}
                      placeholder="I feel nauseous, what should I eat?"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                    />
                    <button
                      onClick={sendChatMessage}
                      className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white"
                    >
                      Send
                    </button>
                  </div>
                </section>
              </div>
            )}

            {dashboardTab === 'progress' && (
              <div>
                <h1 className="text-3xl font-semibold">Progress & Vitals</h1>
                <p className="mt-2 text-slate-600">Track protein adherence and body-weight trend over time.</p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <StatCard label="Current Weight" value={`${currentWeight} lb`} />
                  <StatCard label="Daily Protein Avg" value={`${proteinAverage} g`} />
                  <StatCard label="Symptom-Free Days" value={`${symptomFreeDays} / 7`} />
                </div>

                <div className="mt-6 h-[360px] rounded-2xl bg-white p-4 shadow-card">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={MOCK_LOGS}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fill: '#475569' }} />
                      <YAxis yAxisId="left" tick={{ fill: '#0f766e' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: '#1e293b' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', borderColor: '#cbd5e1', background: '#f8fafc' }}
                      />
                      <Area yAxisId="left" dataKey="protein" fill="#99f6e4" stroke="#0f766e" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="weight"
                        stroke="#1e293b"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
