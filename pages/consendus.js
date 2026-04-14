import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Command,
  Cpu,
  Gauge,
  LayoutGrid,
  Menu,
  MessageSquare,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCircle2,
  Users,
  X,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import remarkGfm from 'remark-gfm'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Network },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const features = [
  {
    title: 'Semantic Bus',
    description:
      'Intent-aware message routing with low-latency delivery and context continuity across specialized agents.',
    icon: Sparkles,
  },
  {
    title: 'Consensus Engine',
    description:
      'Weighted voting, quorum thresholds, and deterministic decision flow for mission-critical orchestration.',
    icon: CheckCircle2,
  },
  {
    title: 'Guardian Rails',
    description:
      'Programmable policy controls that enforce compliance, rollback safety, and transparent action logging.',
    icon: ShieldCheck,
  },
]

const stats = [
  { label: 'Active Agents', value: '128', delta: '+12%', icon: Bot },
  { label: 'Messages/min', value: '9.4k', delta: '+8%', icon: MessageSquare },
  { label: 'Consensus Rate', value: '96.8%', delta: '+1.2%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '1.2M', delta: '-4%', icon: Cpu },
]

const analytics = [
  { time: '00:00', load: 32, tokens: 56 },
  { time: '02:00', load: 41, tokens: 64 },
  { time: '04:00', load: 37, tokens: 61 },
  { time: '06:00', load: 54, tokens: 79 },
  { time: '08:00', load: 61, tokens: 91 },
  { time: '10:00', load: 58, tokens: 88 },
  { time: '12:00', load: 72, tokens: 111 },
  { time: '14:00', load: 65, tokens: 96 },
]

const channels = ['#migration-api-v2', '#security-audit', '#platform-rollout', '#compliance-vote']

const initialMessages = [
  {
    id: 1,
    channel: '#migration-api-v2',
    author: 'Atlas-Orchestrator',
    type: 'text',
    content: 'Starting migration rollout. Requesting validators for canary stage.',
    time: '09:41',
  },
  {
    id: 2,
    channel: '#migration-api-v2',
    author: 'Codex-Dev',
    type: 'markdown',
    content:
      "Validated swarm bootstrap config:\n\n```ts\nconst swarm = new Consendus.Swarm({\n  quorum: 3,\n  strategy: 'weighted-majority',\n  channels: ['migration-api-v2'],\n  guardRails: ['pci', 'pii'],\n})\n```",
    time: '09:42',
  },
  {
    id: 3,
    channel: '#security-audit',
    author: 'Sentry-Sec',
    type: 'text',
    content: '**Audit update:** Policy checks are now passing for payment-service.',
    time: '09:43',
  },
  {
    id: 4,
    channel: '#migration-api-v2',
    author: 'System',
    type: 'alert',
    content: 'Throttle policy enabled after anomaly score exceeded 0.81.',
    time: '09:44',
  },
]

const tasks = [
  { id: 'TSK-341', title: 'Map migration dependencies', agent: 'Atlas-Orchestrator', state: 'Pending' },
  { id: 'TSK-352', title: 'Rehearse blue-green failover', agent: 'Codex-Dev', state: 'In Progress' },
  {
    id: 'TSK-361',
    title: 'Deploy consensus patch',
    state: 'Needs Consensus',
    agent: 'Pulse-Mediator',
    votes: 1,
    totalVotes: 3,
  },
  { id: 'TSK-366', title: 'Rotate service tokens', agent: 'Sentry-Sec', state: 'Completed' },
  { id: 'TSK-378', title: 'Stress test edge latency', agent: 'Nova-Perf', state: 'In Progress' },
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    specialization: 'Workflow Routing',
    uptime: '14d 06h',
    status: 'Idle',
  },
  {
    name: 'Codex-Dev',
    role: 'Builder',
    specialization: 'TypeScript & APIs',
    uptime: '9d 02h',
    status: 'Busy',
  },
  {
    name: 'Sentry-Sec',
    role: 'Security & Policy',
    specialization: 'Threat Modeling',
    uptime: '21d 18h',
    status: 'Idle',
  },
  {
    name: 'Nova-Observer',
    role: 'Telemetry',
    specialization: 'Tracing & Metrics',
    uptime: '5d 11h',
    status: 'Busy',
  },
  {
    name: 'Pulse-Mediator',
    role: 'Consensus',
    specialization: 'Voting Logic',
    uptime: '12d 04h',
    status: 'Error',
  },
]

const statusColors = {
  Idle: 'bg-emerald-400',
  Busy: 'bg-amber-400',
  Error: 'bg-rose-500',
}

const taskStates = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']

function ViewContainer({ children }) {
  return <section className="animate-[fadeIn_.32s_ease]">{children}</section>
}

function MessageBody({ message }) {
  const markdownComponents = {
    p: ({ children }) => <p className="text-sm text-slate-100">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-indigo-100">{children}</strong>,
    code: ({ inline, children }) => {
      if (inline) {
        return (
          <code
            className="rounded bg-slate-950/80 px-1.5 py-0.5 text-[12px] text-emerald-200"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {children}
          </code>
        )
      }

      return (
        <pre
          className="overflow-x-auto rounded-md border border-emerald-400/20 bg-slate-950 p-3 text-emerald-200"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <code>{children}</code>
        </pre>
      )
    },
  }

  if (message.type === 'code') {
    return (
      <pre
        className="overflow-x-auto rounded-md border border-emerald-400/20 bg-slate-950 p-3 text-emerald-200"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {message.content}
      </pre>
    )
  }

  if (message.type === 'markdown') {
    return (
      <div className="prose prose-invert max-w-none prose-p:my-1 prose-pre:my-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {message.content}
        </ReactMarkdown>
      </div>
    )
  }

  return <p className={`text-sm ${message.type === 'alert' ? 'text-amber-100' : 'text-slate-100'}`}>{message.content}</p>
}

export default function Consendus() {
  const [inConsole, setInConsole] = useState(false)
  const [isEnteringConsole, setIsEnteringConsole] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [tabVisible, setTabVisible] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChannel, setActiveChannel] = useState(channels[0])
  const [messages, setMessages] = useState(initialMessages)
  const [simulating, setSimulating] = useState(false)
  const [typingAgent, setTypingAgent] = useState('')
  const [typingAgents, setTypingAgents] = useState([])

  const tasksByState = useMemo(
    () =>
      taskStates.reduce((acc, state) => {
        acc[state] = tasks.filter((task) => task.state === state)
        return acc
      }, {}),
    []
  )

  const channelMessages = messages.filter((message) => message.channel === activeChannel)

  useEffect(() => {
    if (activeTab !== 'comms') return

    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, typingAgents, activeChannel, activeTab])

  const handleAccessConsole = () => {
    setIsEnteringConsole(true)
    setTimeout(() => {
      setInConsole(true)
      setIsEnteringConsole(false)
    }, 240)
  }

  const appendSimulatedMessages = () => {
    if (simulating) return

    const pool = [
      {
        author: 'Nova-Observer',
        channel: activeChannel,
        type: 'text',
        content: 'Trace confirms latency dropped 18% after validator rebalance.',
      },
      {
        author: 'Pulse-Mediator',
        channel: activeChannel,
        type: 'alert',
        content: 'Consensus progress update: 2/3 votes collected.',
      },
      {
        author: 'Atlas-Orchestrator',
        channel: activeChannel,
        type: 'code',
        content:
          "await bus.broadcast('migration-api-v2', {\n  stage: 'promote',\n  confidence: 0.97,\n  votes: '3/3',\n})",
      },
      {
        author: 'Sentry-Sec',
        channel: activeChannel,
        type: 'text',
        content: 'Guardian Rails check passed. No policy drift detected in this cycle.',
      },
      {
        author: 'Codex-Dev',
        channel: activeChannel,
        type: 'markdown',
        content:
          "Patch candidate queued:\n\n```ts\nconst vote = await consensus.cast({\n  taskId: 'TSK-361',\n  decision: 'approve',\n  confidence: 0.94,\n})\n```",
      },
    ]
    const targetCount = Math.random() > 0.5 ? 3 : 2
    const generated = pool.sort(() => Math.random() - 0.5).slice(0, targetCount)

    setSimulating(true)
    setTypingAgent('')
    setTypingAgents(generated.map((message) => message.author))

    generated.forEach((message, index) => {
      setTimeout(() => {
        setTypingAgents((prev) => (prev.includes(message.author) ? prev : [...prev, message.author]))
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            id: prev.length + 1,
            time: `09:${50 + index}`,
          },
        ])
        setTypingAgents((prev) => prev.filter((agent) => agent !== message.author))

        if (index === generated.length - 1) {
          setTimeout(() => {
            setTypingAgents([])
            setSimulating(false)
          }, 260)
        }
      }, (index + 1) * 700)
    })
  }

  const changeTab = (tabId) => {
    if (tabId === activeTab) return
    setTabVisible(false)
    setTimeout(() => {
      setActiveTab(tabId)
      setTabVisible(true)
    }, 140)
  }

  const renderTab = () => {
    if (activeTab === 'overview') {
      return (
        <ViewContainer key={activeTab}>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <article key={stat.label} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <Icon className="h-4 w-4 text-indigo-300" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-emerald-300">{stat.delta} vs last hour</p>
                </article>
              )
            })}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="h-[340px] rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">System Load vs Token Consumption</h2>
                <Gauge className="h-4 w-4 text-indigo-300" />
              </div>
              <ResponsiveContainer width="100%" height="92%">
                <AreaChart data={analytics}>
                  <defs>
                    <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '10px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Area type="monotone" dataKey="load" stroke="#6366f1" fill="url(#load)" strokeWidth={2} />
                  <Area type="monotone" dataKey="tokens" stroke="#10b981" fill="url(#tokens)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">Terminal Log</h2>
                <Activity className="h-4 w-4 text-amber-300" />
              </div>
              <div
                className="h-[280px] overflow-auto rounded-lg border border-white/10 bg-slate-950 p-3 text-xs leading-6 text-slate-300"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <p>[INFO] Agent-2 connected to semantic bus (latency 18ms)</p>
                <p>[INFO] Consensus quorum initialized for task-3</p>
                <p>[WARN] High latency detected on shard eu-west-1</p>
                <p>[INFO] Guardian Rails policy patch applied by Sentry-Sec</p>
                <p>[INFO] Token limiter adjusted (window=10s burst=128)</p>
                <p>[SUCCESS] Deployment approved after 3/3 votes</p>
                <p>[INFO] Heartbeat stream stable (24 active agents)</p>
              </div>
            </div>
          </section>
        </ViewContainer>
      )
    }

    if (activeTab === 'comms') {
      return (
        <ViewContainer key={activeTab}>
          <section className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
              <h2 className="text-sm font-medium text-slate-200">Channels</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                {channels.map((channel) => (
                  <button
                    key={channel}
                    onClick={() => setActiveChannel(channel)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition ${
                      activeChannel === channel ? 'bg-indigo-500/20 text-indigo-200' : 'hover:bg-slate-700/50'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </aside>

            <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">{activeChannel}</h2>
                <button
                  onClick={appendSimulatedMessages}
                  disabled={simulating}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-500/20 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play className="h-3.5 w-3.5" />
                  {simulating ? 'Simulating...' : 'Simulate Activity'}
                </button>
              </div>

              {simulating && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />
                  {typingAgents[0] ? `${typingAgents[0]} is typing...` : 'Agent swarm is drafting responses...'}
                </div>
              )}

              <div ref={chatScrollRef} className="mt-4 h-[360px] space-y-3 overflow-auto pr-1">
                {channelMessages.map((message) => (
                  <article
                    key={message.id}
                    className={`rounded-xl border p-3 ${
                      message.type === 'alert'
                        ? 'border-amber-400/30 bg-amber-500/10'
                        : 'border-white/10 bg-slate-900/70'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        {message.type === 'alert' ? <AlertTriangle className="h-3.5 w-3.5 text-amber-300" /> : null}
                        {message.author}
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{message.time}</span>
                    </div>
                    <MessageBody message={message} />
                  </article>
                ))}

                {typingAgents.map((agent) => (
                  <article key={`typing-${agent}`} className="rounded-xl border border-purple-400/30 bg-purple-500/10 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-purple-200">
                      <span>{agent}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>typing…</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-200 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-200 [animation-delay:180ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-200 [animation-delay:360ms]" />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </ViewContainer>
      )
    }

    if (activeTab === 'orchestration') {
      return (
        <ViewContainer key={activeTab}>
          <section className="grid gap-4 lg:grid-cols-4">
            {taskStates.map((state) => (
              <div key={state} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
                <h2 className="text-sm font-semibold text-slate-100">{state}</h2>
                <div className="mt-4 space-y-3">
                  {tasksByState[state].map((task) => (
                    <article key={task.id} className="rounded-lg border border-white/10 bg-slate-900/80 p-3">
                      <p className="text-xs text-slate-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {task.id}
                      </p>
                      <p className="mt-1 text-sm text-slate-100">{task.title}</p>
                      <p className="mt-2 text-xs text-slate-400">Assigned: {task.agent}</p>
                      {task.state === 'Needs Consensus' && (
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-xs text-purple-200">
                            <span>Consensus Votes</span>
                            <span>
                              {task.votes}/{task.totalVotes} Votes
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-700">
                            <div
                              className="h-full rounded-full bg-purple-400"
                              style={{ width: `${(task.votes / task.totalVotes) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </ViewContainer>
      )
    }

    return (
      <ViewContainer key={activeTab}>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <article key={agent.name} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">{agent.name}</h2>
                <span className={`h-2.5 w-2.5 rounded-full ${statusColors[agent.status]}`} />
              </div>
              <p className="mt-3 text-xs text-slate-400">Role</p>
              <p className="text-sm text-slate-200">{agent.role}</p>
              <p className="mt-2 text-xs text-slate-400">Specialization</p>
              <p className="text-sm text-slate-200">{agent.specialization}</p>
              <p className="mt-2 text-xs text-slate-400">Uptime</p>
              <p className="text-sm text-slate-200" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {agent.uptime}
              </p>
            </article>
          ))}
        </section>
      </ViewContainer>
    )
  }

  return (
    <>
      <Head>
        <title>Consendus.ai</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="min-h-screen bg-slate-900 text-slate-100"
        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      >
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_42%)]" />
        {!inConsole ? (
          <main
            className={`mx-auto max-w-6xl px-4 py-12 transition-all duration-300 sm:px-6 lg:px-8 ${
              isEnteringConsole ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
            }`}
          >
            <section className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Consendus.ai</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Orchestrate Your Agent Swarm
                </h1>
                <p className="mt-4 max-w-xl text-slate-300">
                  Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
                </p>
                <button
                  onClick={handleAccessConsole}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Access Console
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/75 p-5 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2 uppercase tracking-[0.25em]">
                    <Terminal className="h-4 w-4 text-emerald-300" />
                    swarm.config.ts
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1">Readonly</span>
                </div>
                <pre
                  className="overflow-x-auto rounded-xl border border-emerald-400/20 bg-slate-950/80 p-4 text-xs text-emerald-200"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
{`import { Consendus } from 'consendus'

const swarm = new Consendus.Swarm({
  agents: ['Atlas-Orchestrator', 'Codex-Dev', 'Sentry-Sec'],
  bus: 'semantic',
  quorum: 3,
  consensus: 'weighted-majority',
  guardRails: ['pci', 'pii'],
})

await swarm.deploy('migration-api-v2')`}
                </pre>
              </div>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-white/10 bg-slate-800/70 p-5 shadow-lg shadow-black/20 backdrop-blur"
                >
                  <div className="flex items-center gap-2 text-white">
                    <feature.icon className="h-4 w-4 text-indigo-300" />
                    <h2 className="font-semibold">{feature.title}</h2>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                </article>
              ))}
            </section>
          </main>
        ) : (
          <div className="flex min-h-screen">
            <div
              className={`fixed inset-0 z-30 bg-black/55 transition-opacity md:hidden ${
                sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => setSidebarOpen(false)}
            />

            <aside
              className={`fixed z-40 h-full w-72 border-r border-white/10 bg-slate-900/95 p-5 backdrop-blur transition-transform md:static md:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200">
                    <Command className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Consendus</p>
                    <p className="text-sm font-semibold text-white">Swarm Console</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg border border-white/10 p-2 md:hidden">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="mt-8 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        changeTab(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                        activeTab === item.id
                          ? 'border-indigo-400/40 bg-indigo-500/20 text-white'
                          : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                  )
                })}
              </nav>
            </aside>

            <main className="w-full p-4 md:p-8">
              <header className="mb-6 flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-xl border border-white/10 bg-slate-800 p-2 md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="hidden text-sm text-slate-400 md:block">Control plane · dark mode</div>
                <button className="ml-auto flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm">
                  <UserCircle2 className="h-4 w-4 text-indigo-300" />
                  Settings
                </button>
              </header>

              <div className={tabVisible ? 'opacity-100 transition-opacity duration-200' : 'opacity-0 transition-opacity duration-150'}>
                {renderTab()}
              </div>
            </main>
          </div>
        )}
      </div>
    </>
  )
}
