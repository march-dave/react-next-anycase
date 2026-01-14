import Head from 'next/head'
import { useMemo, useState } from 'react'
import {
  Activity,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cpu,
  Gauge,
  LayoutGrid,
  Menu,
  MessageSquare,
  MessagesSquare,
  Network,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Workflow,
  X
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessagesSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Workflow },
  { id: 'fleet', label: 'Agent Fleet', icon: Bot }
]

const featureCards = [
  {
    title: 'Semantic Bus',
    description: 'Route high-volume agent traffic with intent-aware topic shaping and priority lanes.',
    icon: Network,
    accent: 'text-emerald-300'
  },
  {
    title: 'Consensus Engine',
    description: 'Multi-agent voting, quorum guarantees, and audit trails for critical decisions.',
    icon: CheckCircle2,
    accent: 'text-indigo-300'
  },
  {
    title: 'Guardian Rails',
    description: 'Policy enforcement with safety checks, escalation paths, and throttled autonomy.',
    icon: ShieldCheck,
    accent: 'text-amber-300'
  }
]

const metrics = [
  { label: 'Active Agents', value: '128', delta: '+12%', icon: Bot },
  { label: 'Messages/min', value: '8.4k', delta: '+4%', icon: MessageSquare },
  { label: 'Consensus Rate', value: '96.2%', delta: '+1.2%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '2.3M', delta: '-6%', icon: Cpu }
]

const chartData = [
  { time: '00:00', load: 22, tokens: 18 },
  { time: '03:00', load: 34, tokens: 28 },
  { time: '06:00', load: 48, tokens: 43 },
  { time: '09:00', load: 62, tokens: 51 },
  { time: '12:00', load: 57, tokens: 64 },
  { time: '15:00', load: 68, tokens: 58 },
  { time: '18:00', load: 74, tokens: 71 },
  { time: '21:00', load: 61, tokens: 66 }
]

const terminalLogs = [
  '[INFO] Agent-2 connected to semantic bus.',
  '[INFO] Swarm-Delta established quorum at 3/3 votes.',
  '[WARN] High latency detected on region eu-west-2.',
  '[INFO] Guardian Rails approved escalation for task Q-1121.',
  '[SUCCESS] Orchestrator merged 14 sub-tasks into master plan.',
  '[INFO] Token consumption stabilized after adaptive throttling.'
]

const channels = [
  { id: 'migration', name: '#migration-api-v2', status: 'active' },
  { id: 'security', name: '#security-audit', status: 'monitor' },
  { id: 'ops', name: '#ops-sync', status: 'active' },
  { id: 'models', name: '#model-evals', status: 'idle' }
]

const initialMessages = [
  {
    id: 1,
    sender: 'Atlas-Orchestrator',
    timestamp: '09:42',
    type: 'text',
    content: 'Consensus check: deploying hotfix to latency governor in eu-west-2.'
  },
  {
    id: 2,
    sender: 'Sentry-Sec',
    timestamp: '09:43',
    type: 'alert',
    content: 'Guardian Rails flagged anomalous token spikes on task Q-1121.'
  },
  {
    id: 3,
    sender: 'Codex-Dev',
    timestamp: '09:44',
    type: 'code',
    content: `const swarm = new Consendus.Swarm({\n  agents: ['atlas', 'codex', 'sentry'],\n  quorum: 0.67,\n  policy: 'guardian-rails',\n  bus: 'semantic',\n})`
  }
]

const orchestrationColumns = [
  {
    title: 'Pending',
    items: [
      { title: 'Sync topology metadata', agent: 'Atlas-Orchestrator' },
      { title: 'Backfill compliance logs', agent: 'Sentry-Sec' }
    ]
  },
  {
    title: 'In Progress',
    items: [
      { title: 'Latency governor tuning', agent: 'Codex-Dev' },
      { title: 'Semantic bus load shedding', agent: 'Atlas-Orchestrator' }
    ]
  },
  {
    title: 'Needs Consensus',
    items: [
      { title: 'Deploy autonomous escalation playbook', agent: 'Swarm-Delta', votes: '1/3' },
      { title: 'Enable autonomous rerouting', agent: 'Sentry-Sec', votes: '2/3' }
    ]
  },
  {
    title: 'Completed',
    items: [
      { title: 'Agent handshake protocol v3', agent: 'Atlas-Orchestrator' },
      { title: 'Token budget alerting', agent: 'Codex-Dev' }
    ]
  }
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    specialization: 'Consensus + routing',
    uptime: '14d 03h',
    status: 'idle'
  },
  {
    name: 'Codex-Dev',
    role: 'Builder',
    specialization: 'Task execution',
    uptime: '11d 19h',
    status: 'busy'
  },
  {
    name: 'Sentry-Sec',
    role: 'Guardian',
    specialization: 'Threat detection',
    uptime: '21d 02h',
    status: 'busy'
  },
  {
    name: 'Helix-Research',
    role: 'Analyst',
    specialization: 'Model evaluation',
    uptime: '7d 12h',
    status: 'idle'
  },
  {
    name: 'Nova-UX',
    role: 'Experience',
    specialization: 'Agent guidance',
    uptime: '4d 08h',
    status: 'error'
  },
  {
    name: 'Pulse-Observer',
    role: 'Telemetry',
    specialization: 'System diagnostics',
    uptime: '18d 21h',
    status: 'idle'
  }
]

const statusStyles = {
  idle: 'bg-emerald-400',
  busy: 'bg-amber-400',
  error: 'bg-red-400'
}

const simulateQueue = [
  {
    sender: 'Atlas-Orchestrator',
    type: 'text',
    content: 'Pushing consensus request to Swarm-Delta for automated rollback.'
  },
  {
    sender: 'Sentry-Sec',
    type: 'alert',
    content: 'Alert: consensus variance detected. Recommending manual review.'
  },
  {
    sender: 'Codex-Dev',
    type: 'code',
    content: `swarm.vote({\n  task: 'rollback-plan',\n  confidence: 0.71,\n  notes: 'latency spikes normalized'\n})`
  }
]

function CodeWindow() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(99,102,241,0.15)] backdrop-blur">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span className="ml-auto text-[10px]">swarm.config.ts</span>
      </div>
      <pre className="mt-4 whitespace-pre-wrap text-sm text-emerald-100/90">
        <code className="font-mono">{`const swarm = new Consendus.Swarm({
  id: 'consensus-eu-west',
  agents: ['atlas', 'codex', 'sentry', 'nova'],
  policy: 'guardian-rails',
  consensus: {
    quorum: 0.67,
    maxLatencyMs: 180,
  },
  bus: {
    type: 'semantic',
    priority: ['infra', 'security', 'ops'],
  },
})`}</code>
      </pre>
    </div>
  )
}

function AreaChart() {
  const points = useMemo(() => {
    const maxValue = Math.max(...chartData.map((item) => Math.max(item.load, item.tokens)))
    return chartData.map((item, index) => {
      const x = (index / (chartData.length - 1)) * 100
      const loadY = 100 - (item.load / maxValue) * 100
      const tokenY = 100 - (item.tokens / maxValue) * 100
      return { x, loadY, tokenY }
    })
  }, [])

  const buildPath = (key) => {
    const coords = points
      .map((point) => `${point.x},${key === 'load' ? point.loadY : point.tokenY}`)
      .join(' ')
    return `M 0 100 L ${coords} L 100 100 Z`
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">System Load</p>
          <h3 className="text-xl font-semibold text-white">Orchestration Pressure</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400" /> Load
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-400" /> Tokens
          </span>
        </div>
      </div>
      <div className="mt-6 h-52 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <path d={buildPath('load')} fill="rgba(99, 102, 241, 0.35)" />
          <path d={buildPath('tokens')} fill="rgba(168, 85, 247, 0.35)" />
          <polyline
            fill="none"
            stroke="rgba(99, 102, 241, 0.9)"
            strokeWidth="1.2"
            points={points.map((point) => `${point.x},${point.loadY}`).join(' ')}
          />
          <polyline
            fill="none"
            stroke="rgba(168, 85, 247, 0.9)"
            strokeWidth="1.2"
            points={points.map((point) => `${point.x},${point.tokenY}`).join(' ')}
          />
        </svg>
      </div>
      <div className="mt-4 flex justify-between text-xs text-slate-500">
        {chartData.map((item) => (
          <span key={item.time}>{item.time}</span>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const bubbleStyles = {
    text: 'border-white/10 bg-slate-800/70 text-slate-100',
    code: 'border-emerald-500/40 bg-slate-950/80 text-emerald-100 font-mono',
    alert: 'border-amber-500/40 bg-amber-500/10 text-amber-200'
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border px-4 py-3" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <CircleDot className="h-3 w-3 text-indigo-400" /> {message.sender}
        </span>
        <span>{message.timestamp}</span>
      </div>
      <div className={`text-sm leading-relaxed ${bubbleStyles[message.type]}`}>
        {message.type === 'code' ? (
          <pre className="whitespace-pre-wrap rounded-lg border border-emerald-500/20 bg-slate-950/70 p-3 text-xs">
            <code>{message.content}</code>
          </pre>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  )
}

export default function LumiereApp() {
  const [mode, setMode] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [typingAgents, setTypingAgents] = useState([])

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setTypingAgents(simulateQueue.map((item) => item.sender))

    simulateQueue.forEach((message, index) => {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + index,
            timestamp: `09:${45 + index}`,
            ...message
          }
        ])
        setTypingAgents((prev) => prev.filter((sender) => sender !== message.sender))
        if (index === simulateQueue.length - 1) {
          setIsSimulating(false)
        }
      }, 700 * (index + 1))
    })
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6" style={{ animation: 'fadeIn 0.4s ease' }}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
                      <Icon className="h-4 w-4 text-indigo-300" />
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-2xl font-semibold text-white">{metric.value}</p>
                      <span className="text-xs text-emerald-300">{metric.delta}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
              <AreaChart />
              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Terminal Log</p>
                    <h3 className="text-xl font-semibold text-white">Realtime Events</h3>
                  </div>
                  <TerminalSquare className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="mt-4 max-h-60 space-y-3 overflow-y-auto rounded-xl border border-white/5 bg-slate-950/60 p-4 text-xs text-emerald-100/80">
                  {terminalLogs.map((log) => (
                    <p key={log} className="font-mono">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case 'comms':
        return (
          <div className="grid gap-6 xl:grid-cols-[260px,1fr]" style={{ animation: 'fadeIn 0.4s ease' }}>
            <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Channels</p>
              <div className="mt-4 space-y-3">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
                  >
                    <span>{channel.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {channel.status}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleSimulate}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                <Sparkles className="h-4 w-4" />
                Simulate Activity
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Comms Bus</p>
                  <h3 className="text-xl font-semibold text-white">#migration-api-v2</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Gauge className="h-4 w-4 text-indigo-300" />
                  Stable · 12 agents online
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {chatMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {typingAgents.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
                    <span className="font-mono">{typingAgents.join(', ')}</span> is typing...
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 'orchestration':
        return (
          <div className="grid gap-6 lg:grid-cols-4" style={{ animation: 'fadeIn 0.4s ease' }}>
            {orchestrationColumns.map((column) => (
              <div key={column.title} className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{column.title}</p>
                  <span className="text-xs text-slate-500">{column.items.length}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {column.items.map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/5 bg-slate-900/70 p-3">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-xs text-slate-400">{item.agent}</p>
                      {item.votes && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Consensus</span>
                            <span>{item.votes}</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                            <div
                              className="h-full bg-indigo-400"
                              style={{ width: `${(Number(item.votes.split('/')[0]) / Number(item.votes.split('/')[1])) * 100}%` }}
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
        )
      case 'fleet':
        return (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" style={{ animation: 'fadeIn 0.4s ease' }}>
            {agents.map((agent) => (
              <div key={agent.name} className="rounded-2xl border border-white/10 bg-slate-800/70 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{agent.name}</p>
                    <p className="text-xs text-slate-400">{agent.role}</p>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[agent.status]}`} />
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <p>
                    <span className="text-slate-500">Specialization:</span> {agent.specialization}
                  </p>
                  <p>
                    <span className="text-slate-500">Uptime:</span> {agent.uptime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Head>
        <title>Consendus.ai | Agent Swarm Orchestration</title>
      </Head>

      {mode === 'landing' ? (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_45%)]" />
          <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">Consendus.ai</p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Orchestrate Your Agent Swarm
              </h1>
              <p className="text-lg text-slate-300">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setMode('console')}
                  className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                >
                  Access Console
                </button>
                <button className="rounded-xl border border-white/10 bg-slate-800/60 px-6 py-3 text-sm text-slate-200">
                  View Documentation
                </button>
              </div>
            </div>
            <div className="flex-1">
              <CodeWindow />
            </div>
          </section>

          <section className="relative mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-lg shadow-slate-950/40"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${feature.accent}`} />
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                </div>
              )}
            )}
          </section>
        </div>
      ) : (
        <div className="relative flex min-h-screen">
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-slate-950/90 p-6 transition-transform lg:static lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Consendus.ai</p>
                <p className="text-lg font-semibold">Console</p>
              </div>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-10 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-200'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <div className="mt-auto pt-10 text-xs text-slate-400">
              <p className="uppercase tracking-[0.3em]">Agent Swarm</p>
              <p className="mt-2">Cluster: eu-west-2 · 128 agents</p>
            </div>
          </aside>

          <div className="flex-1 lg:ml-0">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active View</p>
                  <h2 className="text-xl font-semibold text-white">{navItems.find((item) => item.id === activeTab)?.label}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-white/10 bg-slate-800/70 p-2">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 text-sm">
                  <span className="h-7 w-7 rounded-full bg-indigo-500/40" />
                  <span className="hidden text-slate-200 sm:inline">admin@consendus.ai</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </header>

            <main className="px-6 py-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">System Status</p>
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-300">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    All systems operational · 0 incidents
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-4 py-2 text-xs text-slate-300 md:flex">
                  <Gauge className="h-4 w-4 text-indigo-300" />
                  Autonomy: 82% · Guardian Rails engaged
                </div>
              </div>

              {renderContent()}
            </main>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
