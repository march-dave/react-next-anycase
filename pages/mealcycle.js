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
    text: 'Hi! I can help you adjust meals for nausea, protein goals, and appetite changes while on GLP-1 medication.',
  },
];

const generateProteinTarget = (dosageStage) => {
  if (dosageStage === 'Initiation') return 120;
  if (dosageStage === 'Titration') return 140;
  return 150;
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

  const symptomFreeDays = useMemo(
    () => MOCK_LOGS.filter((day) => day.symptomFree).length,
    []
  );

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
          text: 'Add NEXT_PUBLIC_GEMINI_API_KEY to enable live guidance. For now: sip ginger tea, choose soft high-protein foods (Greek yogurt, eggs, tofu), and use smaller portions every 2-3 hours.',
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

      const text = response?.text || 'I can help with that. Try 25-35g protein per meal and prioritize low-fat, gentle foods when symptoms flare.';
      setChatMessages((prev) => [...prev, { role: 'assistant', text }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not reach Gemini right now. Fallback tip: pair each mini-meal with 20g+ protein and 8-12 oz fluid to protect muscle and reduce nausea.',
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
        )}
      </header>

      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">Trusted by 12,000+ GLP-1 users</span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">Nutrition designed for your biological breakthrough</h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">Mealcycle combines clinician-backed meal prep and smart symptom tracking to protect lean muscle, calm nausea, and keep your progress sustainable.</p>
          <button onClick={onBuildPlan} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-200 to-teal-700 px-6 py-3 font-semibold text-slate-900 shadow-xl shadow-teal-900/20">Build My Plan <ArrowRight className="h-4 w-4" /></button>
        </div>
        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80" alt="healthy meal prep" className="h-[420px] w-full rounded-3xl object-cover shadow-2xl shadow-slate-900/20" />
      </section>

      <section id="features" className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          { title: 'Prevent Muscle Loss', icon: Activity, text: 'Protein-forward meal architecture with leucine-rich ingredients in every tray.' },
          { title: 'Stop the Nausea', icon: HeartPulse, text: 'Gentle textures, anti-nausea pairings, and hydration nudges timed to dosing days.' },
          { title: 'Nutrient Density', icon: Sparkles, text: 'Micronutrient-dense foods in lower volume portions to match appetite suppression.' },
        ].map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5">
            <feature.icon className="h-8 w-8 text-teal-700" />
            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-slate-600">{feature.text}</p>
          </article>
        ))}
      </section>

      <section id="how" className="mt-20 grid gap-6 md:grid-cols-2">
        <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80" alt="mealcycle dashboard" className="h-72 w-full rounded-3xl object-cover shadow-lg" />
        <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/10">
          <h2 className="text-2xl font-semibold">Built for weekly confidence</h2>
          <p className="mt-3 text-slate-600">Answer a few onboarding questions and Mealcycle calibrates meals, protein targets, and tracking views for your medication stage.</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-700" />Clinician-informed recommendations</li>
            <li className="flex items-center gap-2"><Target className="h-4 w-4 text-teal-700" />Adaptive protein target planning</li>
            <li className="flex items-center gap-2"><ChefHat className="h-4 w-4 text-teal-700" />Ready-to-heat meals matched to tolerance</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Onboarding({ onboardingStep, setOnboardingStep, profile, setProfile, analyzing, setAnalyzing, onRevealPlan }) {
  const progress = (onboardingStep / 3) * 100;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
      <div className="mb-8 h-2 w-full rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-teal-200 to-teal-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10">
        {onboardingStep === 1 && (
          <div>
            <h2 className="text-3xl font-semibold">Which GLP-1 medication are you on?</h2>
            <p className="mt-2 text-slate-600">This helps us tune satiety and side-effect support.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {MEDICATIONS.map((med) => (
                <button key={med} onClick={() => setProfile((prev) => ({ ...prev, medication: med }))} className={`rounded-2xl border p-4 text-left ${profile.medication === med ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}>
                  <p className="font-semibold">{med}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setOnboardingStep(2)} className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-white">Continue</button>
          </div>
        )}

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

        {onboardingStep === 3 && (
          <div>
            <h2 className="text-3xl font-semibold">Your nutrition blueprint is ready</h2>
            <div className="mt-6 rounded-2xl bg-slate-50 p-6">
              {analyzing ? (
                <p className="animate-pulse text-slate-600">Calculating your GLP-1 protein and symptom strategy...</p>
              ) : (
                <>
                  <p className="text-sm uppercase tracking-wide text-slate-500">Calculated daily protein target</p>
                  <p className="mt-2 text-4xl font-bold text-teal-700">{profile.proteinTarget}g</p>
                  <p className="mt-3 text-slate-600">Aligned for {profile.medication} ({profile.dosageStage}) to support lean mass and appetite changes.</p>
                </>
              )}
            </div>
            <button disabled={analyzing} onClick={onRevealPlan} className="mt-8 rounded-xl bg-gradient-to-r from-teal-200 to-teal-700 px-5 py-3 font-semibold text-slate-900 disabled:opacity-50">Reveal My Plan</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ profile, view, setView, proteinAverage, symptomFreeDays, chatInput, setChatInput, chatMessages, chatLoading, onChatSubmit, onLogout }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-6">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Welcome back,</p>
          <p className="text-xl font-semibold">{profile.name}</p>
          <p className="mt-2 text-sm text-slate-600">{profile.medication} • {profile.dosageStage}</p>
          <p className="text-sm text-teal-700">Protein target: {profile.proteinTarget}g</p>
        </div>
        <nav className="mt-8 space-y-2">
          <button onClick={() => setView('weekly')} className={`w-full rounded-xl px-4 py-3 text-left ${view === 'weekly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Weekly Plan</button>
          <button onClick={() => setView('progress')} className={`w-full rounded-xl px-4 py-3 text-left ${view === 'progress' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Progress & Vitals</button>
        </nav>
        <button onClick={onLogout} className="mt-10 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"><LogOut className="h-4 w-4" />Logout</button>
      </aside>

      <section className="grid gap-6 p-6 xl:grid-cols-[1fr_340px]">
        <div>
          {view === 'weekly' ? <WeeklyPlan /> : <ProgressView proteinAverage={proteinAverage} symptomFreeDays={symptomFreeDays} currentWeight={profile.currentWeight} />}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5">
          <h3 className="text-lg font-semibold">AI Nutrition Assistant</h3>
          <p className="text-sm text-slate-500">Ask about nausea, protein timing, and meal swaps.</p>
          <div className="mt-4 h-[380px] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
            {chatMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`rounded-xl px-3 py-2 text-sm ${message.role === 'assistant' ? 'bg-white text-slate-700' : 'ml-auto max-w-[85%] bg-teal-600 text-white'}`}>
                {message.text}
              </div>
            ))}
            {chatLoading && <p className="text-sm text-slate-500">Thinking...</p>}
          </div>
          <form onSubmit={onChatSubmit} className="mt-3 flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="I feel nauseous, what should I eat?" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Send</button>
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
      <p className="mt-2 text-slate-600">Protein-first meals curated for appetite suppression and symptom control.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MOCK_MEALS.map((meal) => (
          <article key={meal.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
            <img src={meal.image} alt={meal.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{meal.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{meal.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {meal.tags.map((tag) => <span key={tag} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">{tag}</span>)}
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
            <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#cbd5e1' }} />
            <Area yAxisId="left" type="monotone" dataKey="protein" fill="#99f6e4" stroke="#0f766e" fillOpacity={0.5} />
            <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
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
