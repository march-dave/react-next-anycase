import { useEffect, useMemo, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  Activity,
  ArrowRight,
  ChefHat,
  HeartPulse,
  LogOut,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MOCK_LOGS, MOCK_MEALS } from '../constants';

const APP_STAGES = {
  LANDING: 'landing',
  ONBOARDING: 'onboarding',
  DASHBOARD: 'dashboard',
};

const MEDICATIONS = ['Ozempic', 'Mounjaro', 'Wegovy', 'Zepbound', 'Saxenda'];
const DOSAGE_STAGES = ['Initiation', 'Titration', 'Maintenance'];

const BASE_CHAT = [
  {
    role: 'assistant',
    text: 'Hi! I can help with nausea-safe food choices, protein targets, and symptom-friendly meal swaps while on GLP-1 medication.',
  },
];

const generateProteinTarget = (dosageStage) => {
  if (dosageStage === 'Initiation') return 120;
  if (dosageStage === 'Titration') return 140;
  return 155;
};

export default function MealcyclePage() {
  const [stage, setStage] = useState(APP_STAGES.LANDING);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [view, setView] = useState('weekly');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState(BASE_CHAT);
  const [profile, setProfile] = useState({
    name: 'Avery',
    medication: 'Ozempic',
    dosageStage: 'Titration',
    proteinTarget: 140,
    currentWeight: 191.2,
  });

  const proteinAverage = useMemo(
    () => Math.round(MOCK_LOGS.reduce((sum, day) => sum + day.protein, 0) / MOCK_LOGS.length),
    []
  );

  const symptomFreeDays = useMemo(() => MOCK_LOGS.filter((day) => day.symptomFree).length, []);

  useEffect(() => {
    if (!analyzing) return;

    const timer = setTimeout(() => {
      setAnalyzing(false);
      setProfile((prev) => ({
        ...prev,
        proteinTarget: generateProteinTarget(prev.dosageStage),
      }));
    }, 1700);

    return () => clearTimeout(timer);
  }, [analyzing]);

  const handleAnalyze = () => {
    setOnboardingStep(3);
    setAnalyzing(true);
  };

  const resetApp = () => {
    setStage(APP_STAGES.LANDING);
    setOnboardingStep(1);
    setAnalyzing(false);
    setView('weekly');
    setChatInput('');
    setChatMessages(BASE_CHAT);
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const nextQuestion = { role: 'user', text: chatInput.trim() };
    const nextMessages = [...chatMessages, nextQuestion];

    setChatMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Gemini API key missing. Fallback: prioritize small meals every 2-3 hours, choose soft high-protein foods (Greek yogurt, eggs, tofu), and sip fluids steadily to reduce nausea.',
        },
      ]);
      setChatLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const transcript = nextMessages.map((message) => `${message.role}: ${message.text}`).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction:
            'You are an expert nutritionist for GLP-1 patients. Keep answers under 100 words. Focus on protein and symptom management.',
        },
        contents: transcript,
      });

      const text =
        response?.text ||
        'Try 25-35g protein at each meal, keep portions small, and choose lower-fat foods when nausea is active.';

      setChatMessages((prev) => [...prev, { role: 'assistant', text }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not reach Gemini right now. Fallback tip: include at least 20g protein in each mini-meal and pair it with hydration to protect lean mass.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

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
          onAnalyze={handleAnalyze}
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
          onLogout={resetApp}
        />
      )}
    </main>
  );
}

function Landing({ onBuildPlan, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-12">
      <header className="sticky top-4 z-20 mb-12 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg shadow-teal-900/10 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Mealcycle.co</p>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-600 transition hover:text-slate-900">Features</a>
            <a href="#how" className="text-sm text-slate-600 transition hover:text-slate-900">How it works</a>
            <button
              onClick={onBuildPlan}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Get Started
            </button>
          </nav>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-xl border border-slate-200 p-2 md:hidden"
            aria-label="Toggle mobile menu"
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
        <div>
          <h3 className="text-2xl font-semibold">Personalized in under 2 minutes</h3>
          <p className="mt-3 text-slate-600">
            Answer a short onboarding flow and Mealcycle calibrates meals, protein targets, and progress
            analytics around your medication and dosage stage.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-700" /> Clinician-informed nutrition logic
            </li>
            <li className="flex items-center gap-2">
              <Target className="h-4 w-4 text-teal-700" /> Adaptive protein target planning
            </li>
            <li className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-teal-700" /> Ready-to-heat meals matched to tolerance
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
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

function Onboarding({
  onboardingStep,
  setOnboardingStep,
  profile,
  setProfile,
  analyzing,
  onAnalyze,
  onRevealPlan,
}) {
  const progress = (onboardingStep / 3) * 100;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
      <div className="mb-8 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-200 to-teal-700 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10">
        {onboardingStep === 1 && (
          <div>
            <h2 className="text-3xl font-semibold">Which GLP-1 medication are you on?</h2>
            <p className="mt-2 text-slate-600">This helps us tune satiety and side-effect support.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {MEDICATIONS.map((med) => (
                <button
                  key={med}
                  onClick={() => setProfile((prev) => ({ ...prev, medication: med }))}
                  className={`rounded-2xl border p-4 text-left transition ${
                    profile.medication === med
                      ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-semibold">{med}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setOnboardingStep(2)}
              className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-white"
            >
              Continue
            </button>
          </div>
        )}

        {onboardingStep === 2 && (
          <div>
            <h2 className="text-3xl font-semibold">Where are you in your dosage journey?</h2>
            <p className="mt-2 text-slate-600">Targets shift as your dosage and appetite adapt.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {DOSAGE_STAGES.map((doseStage) => (
                <button
                  key={doseStage}
                  onClick={() => setProfile((prev) => ({ ...prev, dosageStage: doseStage }))}
                  className={`rounded-2xl border p-4 transition ${
                    profile.dosageStage === doseStage
                      ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {doseStage}
                </button>
              ))}
            </div>
            <button onClick={onAnalyze} className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-white">
              Run Analysis
            </button>
          </div>
        )}

        {onboardingStep === 3 && (
          <div>
            <h2 className="text-3xl font-semibold">Your nutrition blueprint is ready</h2>
            <div className="mt-6 rounded-2xl bg-slate-50 p-6">
              {analyzing ? (
                <p className="animate-pulse text-slate-600">
                  Calculating your GLP-1 protein and symptom strategy...
                </p>
              ) : (
                <>
                  <p className="text-sm uppercase tracking-wide text-slate-500">
                    Calculated daily protein target
                  </p>
                  <p className="mt-2 text-4xl font-bold text-teal-700">{profile.proteinTarget}g</p>
                  <p className="mt-3 text-slate-600">
                    Aligned for {profile.medication} ({profile.dosageStage}) to support lean mass and
                    reduce side effects.
                  </p>
                </>
              )}
            </div>
            <button
              disabled={analyzing}
              onClick={onRevealPlan}
              className="mt-8 rounded-xl bg-gradient-to-r from-teal-200 to-teal-700 px-5 py-3 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reveal My Plan
            </button>
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
            <img src={meal.image} alt={meal.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{meal.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{meal.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {meal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Protein {meal.protein}g</span>
                <span>{meal.calories} kcal</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProgressView({ currentWeight, proteinAverage, symptomFreeDays }) {
  return (
    <div>
      <h2 className="text-3xl font-semibold">Progress & Vitals</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={Scale} title="Current Weight" value={`${currentWeight} lbs`} />
        <StatCard icon={ChefHat} title="Daily Protein Avg" value={`${proteinAverage}g`} />
        <StatCard icon={ShieldCheck} title="Symptom-Free Days" value={`${symptomFreeDays}/7`} />
      </div>

      <div className="mt-6 h-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={MOCK_LOGS}>
            <XAxis dataKey="day" stroke="#475569" />
            <YAxis yAxisId="left" stroke="#0f766e" />
            <YAxis yAxisId="right" orientation="right" stroke="#0f172a" domain={[188, 196]} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc',
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="protein"
              fill="#99f6e4"
              stroke="#0f766e"
              fillOpacity={0.5}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="weight"
              stroke="#0f172a"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
      <Icon className="h-5 w-5 text-teal-700" />
      <p className="mt-3 text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </article>
  );
}
