import { useMemo, useState } from 'react'
import {
  Activity,
  Atom,
  Bell,
  Bot,
  Boxes,
  Cable,
  ChevronDown,
  Cpu,
  Gauge,
  Layers,
  MessageSquare,
  Network,
  Settings,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Layers },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const stats = [
  { label: 'Active Agents', value: '42', trend: '+6', icon: Bot },
  { label: 'Messages/min', value: '1.8k', trend: '+14%', icon: MessageSquare },
  { label: 'Consensus Rate', value: '93%', trend: '+2%', icon: Sparkles },
  { label: 'Token Usage', value: '4.2M', trend: '+8%', icon: Cpu },
]

const channels = [
  { name: '#migration-api-v2', unread: 3 },
  { name: '#security-audit', unread: 1 },
  { name: '#swarm-playbooks', unread: 0 },
  { name: '#incident-war-room', unread: 6 },
]

const initialMessages = [
  {
    id: 1,
    agent: 'Atlas-Orchestrator',
    type: 'text',
    content: 'Consensus cycle 14 initiated. Awaiting quorum from Codex and Sentry.',
    time: '09:41',
  },
  {
    id: 2,
    agent: 'Codex-Dev',
    type: 'code',
    content: `// Agent proposal\nconst plan = {\n  migration: 'rolling',\n  risk: 'low',\n  rollback: true,\n}\n\nconsensus.vote(plan)`,
    time: '09:42',
  },
  {
    id: 3,
    agent: 'Sentry-Sec',
    type: 'alert',
    content: '[WARN] Elevated latency detected on edge cluster 2. Initiating guard rails.',
    time: '09:42',
  },
]

const simulatedMessages = [
  {
    agent: 'Echo-Analyst',
    type: 'text',
    content: 'Telemetry spike isolated to region us-east-1b. Auto-mitigation in progress.',
  },
  {
    agent: 'Atlas-Orchestrator',
    type: 'text',
    content: 'Routing failover complete. Consensus vote pending from three agents.',
  },
  {
    agent: 'Codex-Dev',
    type: 'code',
    content: `// Patch rollout\nawait swarm.deploy({\n  scope: 'hotfix',\n  confidence: 0.91,\n})`,
  },
]

const tasks = {
  pending: [
    { title: 'Route optimizer v3 rollout', agent: 'Atlas-Orchestrator' },
    { title: 'Checksum validation update', agent: 'Codex-Dev' },
  ],
  inProgress: [
    { title: 'Edge traffic rebalance', agent: 'Sentry-Sec' },
    { title: 'Training signal analysis', agent: 'Echo-Analyst' },
  ],
  consensus: [
    { title: 'Migration API approval', agent: 'Council', votes: '1/3' },
    { title: 'Guardian rule update', agent: 'Council', votes: '2/3' },
  ],
  completed: [
    { title: 'Audit trail sync', agent: 'Lumen-Trace' },
    { title: 'Backfill incident log', agent: 'Nimbus-Doc' },
  ],
}

const agentFleet = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    specialization: 'Multi-agent planning',
    uptime: '99.98%',
    status: 'idle',
  },
  {
    name: 'Codex-Dev',
    role: 'Engineer',
    specialization: 'Code synthesis',
    uptime: '98.41%',
    status: 'busy',
  },
  {
    name: 'Sentry-Sec',
    role: 'Guardian',
    specialization: 'Threat modeling',
    uptime: '97.11%',
    status: 'error',
  },
  {
    name: 'Echo-Analyst',
    role: 'Analyst',
    specialization: 'Telemetry & insights',
    uptime: '99.2%',
    status: 'idle',
  },
]

const terminalEvents = [
  '[INFO] Agent-2 connected to semantic bus.',
  '[INFO] Consensus cycle 13 completed in 2.4s.',
  '[WARN] High latency detected on vector store.',
  '[INFO] Guardian rail patch applied to swarm.',
  '[INFO] Agent-7 promoted to orchestrator role.',
  '[WARN] Token throttle engaged for Agent-9.',
]

const statusStyles = {
  idle: 'bg-emerald-400',
  busy: 'bg-amber-400',
  error: 'bg-rose-500',
}

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  const chartPoints = useMemo(
    () => [
      { x: 0, load: 30, tokens: 20 },
      { x: 20, load: 45, tokens: 28 },
      { x: 40, load: 60, tokens: 38 },
      { x: 60, load: 72, tokens: 55 },
      { x: 80, load: 65, tokens: 63 },
      { x: 100, load: 80, tokens: 72 },
    ],
    []
  )

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setShowTyping(true)

    simulatedMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            id: prev.length + 1,
            time: `09:4${index + 3}`,
          },
        ])
        if (index === simulatedMessages.length - 1) {
          setShowTyping(false)
          setIsSimulating(false)
        }
      }, 600 + index * 450)
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {view === 'landing' ? (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />
          <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Atom className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Consendus.ai</p>
                <p className="text-lg font-semibold text-slate-100">Agent Swarm Infrastructure</p>
              </div>
            </div>
            <button
              onClick={() => setView('console')}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-800/60 px-5 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-indigo-500/10 transition hover:border-indigo-400/40 hover:bg-slate-800 md:flex"
            >
              Access Console
              <ChevronDown className="h-4 w-4" />
            </button>
          </header>

          <main className="relative z-10 px-6 pb-20 pt-8 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-indigo-200">
                  <Sparkles className="h-4 w-4" />
                  Swarm command center
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl font-sans">
                  Orchestrate Your Agent Swarm
                </h1>
                <p className="max-w-xl text-lg text-slate-300">
                  Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setView('console')}
                    className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                  >
                    Access Console
                  </button>
                  <button className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-indigo-400/40">
                    Request Demo
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: 'Semantic Bus',
                      description: 'Multimodal message routing with guaranteed ordering.',
                      icon: Cable,
                    },
                    {
                      title: 'Consensus Engine',
                      description: 'Low-latency voting and quorum enforcement.',
                      icon: Network,
                    },
                    {
                      title: 'Guardian Rails',
                      description: 'Policy gates that keep agents aligned and safe.',
                      icon: ShieldCheck,
                    },
                  ].map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-xl border border-white/10 bg-slate-800/60 p-4 backdrop-blur"
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100 font-sans">{feature.title}</h3>
                      <p className="mt-2 text-xs text-slate-400">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-2xl shadow-slate-900/60 backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <TerminalSquare className="h-4 w-4 text-emerald-400" />
                    swarm.config.ts
                  </div>
                  <div className="flex gap-1">
                    {['bg-rose-400', 'bg-amber-300', 'bg-emerald-400'].map((color) => (
                      <span key={color} className={`h-2 w-2 rounded-full ${color}`} />
                    ))}
                  </div>
                </div>
                <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-900/70 p-4 text-xs text-emerald-200 shadow-inner font-mono">
{`import { Consendus } from '@consendus/core'

const swarm = new Consendus.Swarm({
  name: 'atlas-prime',
  agents: ['Atlas', 'Codex', 'Sentry', 'Echo'],
  consensus: {
    quorum: 3,
    timeout: '8s',
  },
  guardianRails: ['policy/v1', 'policy/v2'],
})

await swarm.deploy()`}
                </pre>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
                  <div>
                    <p className="text-slate-200">Agents</p>
                    <p className="font-mono text-emerald-300">04</p>
                  </div>
                  <div>
                    <p className="text-slate-200">Consensus</p>
                    <p className="font-mono text-indigo-300">3/4</p>
                  </div>
                  <div>
                    <p className="text-slate-200">Latency</p>
                    <p className="font-mono text-amber-300">2.3s</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-950/70 backdrop-blur transition-transform duration-300 md:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex h-full flex-col px-5 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                    <Atom className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consendus</p>
                    <p className="text-sm font-semibold text-slate-100">Console</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-slate-300 hover:border-indigo-400/40 md:hidden"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
              </div>

              <nav className="mt-8 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                      activeTab === item.id
                        ? 'bg-indigo-500/20 text-indigo-200'
                        : 'text-slate-300 hover:bg-white/5 hover:text-slate-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                <p className="flex items-center gap-2 text-slate-200">
                  <Bell className="h-4 w-4 text-amber-400" />
                  Alerts synced: 4
                </p>
                <p className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-emerald-400" />
                  Swarm uptime: 99.92%
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-screen bg-slate-900/95 pb-16 pt-6 md:pl-64">
            <header className="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Consendus Console</p>
                <h2 className="text-2xl font-semibold text-slate-100 font-sans">Swarm Operations</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-full border border-white/10 p-2 text-slate-300 hover:border-indigo-400/40 md:hidden"
                >
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-800/70 px-4 py-2 text-sm text-slate-200">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  Nova Operator
                  <Settings className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </header>

            <section key={activeTab} className="mt-8 animate-fade-in px-6 md:px-10">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-slate-800/70 p-4 shadow-lg shadow-slate-950/40"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400">{stat.label}</p>
                          <stat.icon className="h-4 w-4 text-indigo-300" />
                        </div>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-2xl font-semibold text-slate-100">{stat.value}</p>
                          <span className="text-xs text-emerald-300">{stat.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-xl border border-white/10 bg-slate-800/70 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">System load</p>
                          <h3 className="text-lg font-semibold text-slate-100 font-sans">Load vs Token Consumption</h3>
                        </div>
                        <Activity className="h-5 w-5 text-indigo-300" />
                      </div>
                      <div className="mt-6 rounded-xl bg-slate-900/80 p-4">
                        <svg viewBox="0 0 200 120" className="h-48 w-full">
                          <defs>
                            <linearGradient id="load" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="tokens" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0 100 C20 90 40 80 60 70 C80 60 100 50 120 40 C140 30 160 40 200 28 L200 120 L0 120 Z"
                            fill="url(#load)"
                          />
                          <path
                            d="M0 110 C20 100 40 92 60 84 C80 70 100 60 120 58 C140 54 160 46 200 38 L200 120 L0 120 Z"
                            fill="url(#tokens)"
                          />
                          <polyline
                            fill="none"
                            stroke="#818cf8"
                            strokeWidth="2"
                            points={chartPoints.map((point) => `${point.x},${120 - point.load}`).join(' ')}
                          />
                          <polyline
                            fill="none"
                            stroke="#34d399"
                            strokeWidth="2"
                            points={chartPoints.map((point) => `${point.x},${120 - point.tokens}`).join(' ')}
                          />
                        </svg>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-indigo-400" />
                          System Load
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Token Consumption
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-800/70 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Terminal</p>
                          <h3 className="text-lg font-semibold text-slate-100 font-sans">System events</h3>
                        </div>
                        <TerminalSquare className="h-5 w-5 text-emerald-300" />
                      </div>
                      <div className="mt-4 h-48 space-y-3 overflow-y-auto rounded-xl bg-slate-900/80 p-4 text-xs font-mono text-emerald-200 no-scrollbar">
                        {terminalEvents.map((event) => (
                          <p key={event}>{event}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comms' && (
                <div className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
                  <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <p>Channels</p>
                      <MessageSquare className="h-4 w-4 text-indigo-300" />
                    </div>
                    <div className="mt-4 space-y-2">
                      {channels.map((channel) => (
                        <div
                          key={channel.name}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2 text-xs text-slate-300"
                        >
                          <span>{channel.name}</span>
                          {channel.unread > 0 && (
                            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-200">
                              {channel.unread}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-800/70 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Comms</p>
                        <h3 className="text-lg font-semibold text-slate-100 font-sans">Agent Collaboration</h3>
                      </div>
                      <button
                        onClick={handleSimulate}
                        className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isSimulating}
                      >
                        {isSimulating ? 'Simulating...' : 'Simulate Activity'}
                      </button>
                    </div>
                    <div className="mt-4 h-72 space-y-4 overflow-y-auto rounded-xl bg-slate-900/80 p-4 text-sm no-scrollbar">
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-2 animate-fade-in">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
                              {message.agent}
                            </span>
                            <span>{message.time}</span>
                          </div>
                          {message.type === 'code' ? (
                            <pre className="rounded-lg border border-emerald-400/20 bg-slate-950/80 p-3 text-xs text-emerald-200 font-mono">
                              {message.content}
                            </pre>
                          ) : message.type === 'alert' ? (
                            <div className="flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
                              <ShieldCheck className="h-4 w-4" />
                              {message.content}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-200">{message.content}</p>
                          )}
                        </div>
                      ))}
                      {showTyping && (
                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
                          Agents typing
                          <span className="flex items-center gap-1">
                            {[0, 1, 2].map((dot) => (
                              <span
                                key={dot}
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300/80"
                                style={{ animationDelay: `${dot * 0.12}s` }}
                              />
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orchestration' && (
                <div className="grid gap-6 lg:grid-cols-4">
                  {[
                    { key: 'pending', label: 'Pending', color: 'text-slate-300' },
                    { key: 'inProgress', label: 'In Progress', color: 'text-indigo-300' },
                    { key: 'consensus', label: 'Needs Consensus', color: 'text-amber-300' },
                    { key: 'completed', label: 'Completed', color: 'text-emerald-300' },
                  ].map((column) => (
                    <div key={column.key} className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className={`text-sm font-semibold ${column.color}`}>{column.label}</p>
                        <span className="text-xs text-slate-500">
                          {tasks[column.key].length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {tasks[column.key].map((task) => (
                          <div
                            key={task.title}
                            className="rounded-lg border border-white/10 bg-slate-900/70 p-3"
                          >
                            <p className="text-sm text-slate-100">{task.title}</p>
                            <p className="mt-1 text-xs text-slate-400">{task.agent}</p>
                            {task.votes && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                  <span>Consensus</span>
                                  <span>{task.votes} Votes</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-800">
                                  <div
                                    className="h-2 rounded-full bg-amber-400"
                                    style={{ width: `${parseInt(task.votes, 10) * 33}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'fleet' && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {agentFleet.map((agent) => (
                    <div
                      key={agent.name}
                      className="rounded-xl border border-white/10 bg-slate-800/70 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-100">{agent.name}</p>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${statusStyles[agent.status]}`} />
                      </div>
                      <div className="mt-4 space-y-2 text-xs text-slate-400">
                        <p>
                          Specialization:{' '}
                          <span className="text-slate-200">{agent.specialization}</span>
                        </p>
                        <p>
                          Uptime: <span className="text-emerald-300">{agent.uptime}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
