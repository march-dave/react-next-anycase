import { useMemo, useState } from 'react'
import Head from 'next/head'
import {
  Activity,
  Camera,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  LineChart,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Terminal,
  User,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LineChart },
  { id: 'scans', label: 'Scan Feed', icon: Camera },
  { id: 'plan', label: 'Care Plan', icon: Activity },
  { id: 'specialists', label: 'Specialists', icon: Stethoscope },
]

const features = [
  {
    title: 'Weekly Scan Protocol',
    description:
      'Guided capture flows standardize lighting and angles for consistent, clinical-grade comparisons.',
    icon: Camera,
  },
  {
    title: 'Early Pattern Detection',
    description:
      'AI models track density, hairline recession, and crown thinning months before they are visible.',
    icon: LineChart,
  },
  {
    title: 'Personalized Prevention',
    description:
      'Actionable plans blend topical options, nutrition, and lifestyle habits based on your profile.',
    icon: HeartPulse,
  },
]

const stats = [
  { label: 'Weekly scans', value: '6/8', delta: '+12%' },
  { label: 'Density score', value: '84', delta: '+3' },
  { label: 'Hairline stability', value: 'Stable', delta: '0.2mm' },
  { label: 'Intervention readiness', value: '92%', delta: '+5%' },
]

const chartData = [
  { time: 'Week 1', density: 78, coverage: 82 },
  { time: 'Week 2', density: 80, coverage: 83 },
  { time: 'Week 3', density: 79, coverage: 82 },
  { time: 'Week 4', density: 81, coverage: 84 },
  { time: 'Week 5', density: 83, coverage: 85 },
  { time: 'Week 6', density: 84, coverage: 86 },
]

const logs = [
  '[INSIGHT] Crown density stabilized after week 3 routine update.',
  '[ALERT] Hairline shift detected: 0.2mm in right temple.',
  '[INFO] Scalp hydration score improved by 6%.',
  '[INFO] Lighting consistency now 94% across scans.',
  '[NEXT] Consider adding rosemary serum to nightly routine.',
]

const channels = ['#scan-review', '#care-plan', '#clinic-referrals', '#product-recs']

const initialMessages = [
  {
    id: 1,
    author: 'Manetain Analyst',
    type: 'standard',
    content: 'Baseline scan locked. Next scan reminder set for Sunday morning.',
  },
  {
    id: 2,
    author: 'AI Coach',
    type: 'alert',
    content: 'Crown density dipped 1.8%. Consider adding the booster routine this week.',
  },
  {
    id: 3,
    author: 'Clinic Liaison',
    type: 'code',
    content: `// referral packet created for Dr. Patel\nconst referral = createReferral({\n  specialist: 'Dermatology',\n  priority: 'routine',\n  scans: ['week4', 'week6'],\n})`,
  },
]

const simulateMessages = [
  {
    author: 'Manetain Analyst',
    type: 'standard',
    content: 'New scan received. Lighting score: 96%. Processing now.',
  },
  {
    author: 'AI Coach',
    type: 'standard',
    content: 'Density trend normalized. Keep the morning routine consistent this week.',
  },
  {
    author: 'Clinic Liaison',
    type: 'alert',
    content: 'Dermatology consult availability updated: next slot on Thursday.',
  },
]

const taskStates = ['Upcoming', 'In Review', 'Active', 'Completed']

const tasks = [
  {
    title: 'Capture baseline scan',
    agent: 'Manetain Analyst',
    state: 'Completed',
  },
  {
    title: 'Review crown density report',
    agent: 'AI Coach',
    state: 'In Review',
  },
  {
    title: 'Start nightly topical routine',
    agent: 'Care Plan',
    state: 'Active',
  },
  {
    title: 'Schedule specialist consult',
    agent: 'Clinic Liaison',
    state: 'Upcoming',
  },
]

const specialists = [
  {
    name: 'Dr. Maya Patel',
    role: 'Dermatologist',
    specialization: 'Hair restoration',
    availability: 'Thu, 2:30 PM',
    status: 'available',
  },
  {
    name: 'Dr. Ethan Brooks',
    role: 'Trichologist',
    specialization: 'Scalp health',
    availability: 'Fri, 11:00 AM',
    status: 'booked',
  },
  {
    name: 'Dr. Lena Ortiz',
    role: 'Nutritionist',
    specialization: 'Hair growth diet',
    availability: 'Mon, 9:00 AM',
    status: 'available',
  },
  {
    name: 'Dr. Noah Reeves',
    role: 'Telehealth Advisor',
    specialization: 'Lifestyle optimization',
    availability: 'Wed, 4:00 PM',
    status: 'offline',
  },
]

const chartTooltipStyle = {
  backgroundColor: '#0f172a',
  borderRadius: '12px',
  border: '1px solid rgba(148,163,184,0.25)',
  color: '#e2e8f0',
}

const statusStyles = {
  available: 'bg-emerald-400',
  booked: 'bg-amber-400',
  offline: 'bg-slate-500',
}

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  const tasksByState = useMemo(() => {
    return taskStates.reduce((acc, state) => {
      acc[state] = tasks.filter((task) => task.state === state)
      return acc
    }, {})
  }, [])

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setShowTyping(true)

    simulateMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            ...message,
          },
        ])
        if (index === simulateMessages.length - 1) {
          setShowTyping(false)
          setIsSimulating(false)
        }
      }, 700 * (index + 1))
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 [font-family:'Inter',sans-serif]">
      <Head>
        <title>Manetain — Hair Loss Prevention</title>
      </Head>

      {view === 'landing' ? (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Manetain</span>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <a className="transition hover:text-white" href="#features">
                Features
              </a>
              <a className="transition hover:text-white" href="#workflow">
                Workflow
              </a>
              <a className="transition hover:text-white" href="#privacy">
                Privacy
              </a>
            </nav>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5"
              onClick={() => setView('console')}
            >
              Open Tracker
              <ChevronRight className="h-4 w-4" />
            </button>
          </header>

          <main className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="flex flex-col gap-6">
              <p className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-emerald-300">
                AI Hair Loss Prevention
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Track hair loss before it becomes visible.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                Manetain turns weekly scalp photos into objective progress tracking. Detect thinning months
                earlier, get prevention plans tailored to your biology, and connect with specialists when it
                matters.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5"
                  onClick={() => setView('console')}
                >
                  Start Tracking
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white">
                  Request Demo
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] backdrop-blur">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span>scan-protocol.json</span>
              </div>
              <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-emerald-200 [font-family:'JetBrains_Mono',monospace]">
{`{
  "schedule": "weekly",
  "angles": ["front", "temples", "crown"],
  "lighting": "diffused-daylight",
  "aiChecks": [
    "density",
    "hairline",
    "crown-thinning"
  ],
  "alerts": {
    "densityDrop": "1.5%",
    "hairlineShift": "0.2mm"
  }
}`}
              </pre>
            </section>
          </main>

          <section id="features" className="mt-20">
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section
            id="workflow"
            className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-8"
          >
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">How it works</p>
                <h2 className="mt-3 text-2xl font-semibold">Measure, detect, prevent.</h2>
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  Manetain blends standardized scans, AI analysis, and tailored prevention plans into one
                  continuous loop. Stay ahead of hair loss with clear trends and proactive guidance.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Guided Scans', 'AI Benchmarks', 'Personalized Plans', 'Specialist Referrals'].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-slate-200"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          <section id="privacy" className="mt-16 text-center">
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Privacy built in</h2>
              <p className="mt-2 text-sm text-slate-300">
                Scans are encrypted, stored securely, and never shared without your consent. You control
                referrals, specialist access, and data export at every step.
              </p>
            </div>
          </section>

          <footer className="mt-20 text-center text-xs text-slate-500">
            © 2024 Manetain. All rights reserved.
          </footer>
        </div>
      ) : (
        <div className="flex min-h-screen bg-slate-950">
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-950/90 p-6 backdrop-blur transition-transform lg:relative lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Manetain</p>
                  <p className="text-xs text-slate-400">Progress Console</p>
                </div>
              </div>
              <button className="text-slate-400 lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-10 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      activeTab === item.id
                        ? 'bg-emerald-500/20 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-200">
                <CalendarDays className="h-4 w-4 text-emerald-300" />
                <span className="font-semibold">Next scan reminder</span>
              </div>
              <p className="mt-2">Sunday, 8:00 AM. Consistency score at 92%.</p>
            </div>
          </aside>

          <div className="flex-1 lg:ml-64">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <button className="text-slate-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {navItems.find((nav) => nav.id === activeTab)?.label}
                  </p>
                  <p className="text-xs text-slate-400">Hair loss prevention intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200 transition hover:bg-white/5 md:flex">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  AI Insights
                </button>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Jordan Lee
                </div>
              </div>
            </header>

            <main className="space-y-8 px-6 py-6">
              {activeTab === 'overview' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-2xl font-semibold text-white">{stat.value}</p>
                          <span className="text-xs text-emerald-300">{stat.delta}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-white">Density vs Coverage Trend</h2>
                        <span className="text-xs text-slate-400">Last 6 weeks</span>
                      </div>
                      <div className="mt-6 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="density" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
                              </linearGradient>
                              <linearGradient id="coverage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: '#94a3b8' }} />
                            <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                            <Area
                              type="monotone"
                              dataKey="density"
                              stroke="#34d399"
                              strokeWidth={2}
                              fill="url(#density)"
                            />
                            <Area
                              type="monotone"
                              dataKey="coverage"
                              stroke="#60a5fa"
                              strokeWidth={2}
                              fill="url(#coverage)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-slate-200">Insight log</p>
                        <span className="rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
                          live
                        </span>
                      </div>
                      <div className="space-y-3 overflow-y-auto text-xs text-emerald-200">
                        {logs.map((log) => (
                          <div key={log} className="flex items-start gap-2 font-mono">
                            <Terminal className="mt-0.5 h-3 w-3 text-emerald-300" />
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'scans' && (
                <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr] animate-fade-in">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-white">Channels</h2>
                      <button className="text-xs text-emerald-300">+ New</button>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      {channels.map((channel) => (
                        <button
                          key={channel}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
                        >
                          <span>{channel}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex h-full flex-col rounded-xl border border-white/10 bg-slate-900/70">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">#scan-review</p>
                        <p className="text-xs text-slate-400">Weekly scan analysis updates</p>
                      </div>
                      <button
                        onClick={handleSimulate}
                        className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-400"
                      >
                        {isSimulating ? 'Simulating...' : 'Simulate Activity'}
                      </button>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="rounded-full bg-slate-950/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                              Team
                            </span>
                            <span className="text-slate-200">{message.author}</span>
                          </div>
                          {message.type === 'code' ? (
                            <pre className="rounded-xl border border-white/10 bg-slate-950/80 p-3 text-xs text-emerald-200">
                              <code className="font-mono">{message.content}</code>
                            </pre>
                          ) : (
                            <div
                              className={`rounded-xl border p-3 text-sm text-slate-200 ${
                                message.type === 'alert'
                                  ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                                  : 'border-white/10 bg-slate-950/60'
                              }`}
                            >
                              {message.type === 'alert' && (
                                <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                                  <MessageCircle className="h-3 w-3" /> Priority alert
                                </div>
                              )}
                              {message.content}
                            </div>
                          )}
                        </div>
                      ))}
                      {showTyping && (
                        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-400">
                          <span className="font-mono">[simulating]</span>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 delay-150" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 delay-300" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'plan' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Care plan board</h2>
                      <p className="text-xs text-slate-400">Track prevention tasks and clinical follow-ups.</p>
                    </div>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200">
                      Add task
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-4">
                    {taskStates.map((status) => (
                      <div key={status} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{status}</p>
                        <div className="mt-4 space-y-3">
                          {tasksByState[status]?.map((task) => (
                            <div
                              key={task.title}
                              className="rounded-lg border border-white/10 bg-slate-950/70 p-3"
                            >
                              <p className="text-sm text-white">{task.title}</p>
                              <p className="mt-1 text-xs text-slate-400">{task.agent}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'specialists' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Specialist network</h2>
                      <p className="text-xs text-slate-400">Connect with vetted hair loss experts.</p>
                    </div>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200">
                      Book consult
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {specialists.map((specialist) => (
                      <div
                        key={specialist.name}
                        className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${statusStyles[specialist.status]}`} />
                            <p className="text-sm font-semibold text-white">{specialist.name}</p>
                          </div>
                          <User className="h-4 w-4 text-emerald-300" />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">{specialist.role}</p>
                        <div className="mt-4 space-y-2 text-xs text-slate-300">
                          <div className="flex items-center justify-between">
                            <span>Focus</span>
                            <span className="text-white">{specialist.specialization}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Next slot</span>
                            <span className="text-white">{specialist.availability}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease-out;
        }
      `}</style>
    </div>
  )
}
