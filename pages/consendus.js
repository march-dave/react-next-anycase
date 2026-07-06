import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Command,
  Cpu,
  Gauge,
  GitBranch,
  LayoutGrid,
  Lock,
  Menu,
  MessageSquare,
  Network,
  Play,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCircle2,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: GitBranch },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const features = [
  {
    title: 'Semantic Bus',
    description: 'Typed channels, vector-aware routing, and durable memory streams let agents exchange intent instead of raw noise.',
    icon: RadioTower,
  },
  {
    title: 'Consensus Engine',
    description: 'Quorum policies, vote weighting, and conflict resolution primitives help autonomous swarms converge safely.',
    icon: CheckCircle2,
  },
  {
    title: 'Guardian Rails',
    description: 'Policy gates, tool permissions, audit logs, and human escalation paths wrap every agent action.',
    icon: ShieldCheck,
  },
]

const stats = [
  { label: 'Active Agents', value: '128', delta: '+12', icon: Bot },
  { label: 'Messages/min', value: '4.8k', delta: '+18%', icon: MessageSquare },
  { label: 'Consensus Rate', value: '97.4%', delta: '+2.1%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '12.7M', delta: '-6%', icon: Cpu },
]

const analytics = [
  { time: '00:00', load: 31, tokens: 48 },
  { time: '02:00', load: 42, tokens: 61 },
  { time: '04:00', load: 37, tokens: 57 },
  { time: '06:00', load: 58, tokens: 81 },
  { time: '08:00', load: 71, tokens: 104 },
  { time: '10:00', load: 64, tokens: 96 },
  { time: '12:00', load: 79, tokens: 126 },
  { time: '14:00', load: 68, tokens: 111 },
]

const terminalEvents = [
  { level: 'INFO', message: 'Agent-2 connected to semantic bus (latency 18ms)' },
  { level: 'INFO', message: 'Swarm migration-api-v2 acquired quorum policy qrm_9fd2' },
  { level: 'WARN', message: 'High latency detected on shard us-east-2.semantic.events' },
  { level: 'SUCCESS', message: 'Consensus reached for deploy plan after 3/3 votes' },
  { level: 'INFO', message: 'Guardian rail blocked external write: missing canary approval' },
  { level: 'INFO', message: 'Codex-Dev emitted patch proposal prp_81aa' },
  { level: 'SUCCESS', message: 'Sentry-Sec verified policy bundle pol_443a' },
]

const channels = [
  { name: '#migration-api-v2', members: 12, unread: 4 },
  { name: '#security-audit', members: 6, unread: 2 },
  { name: '#release-consensus', members: 9, unread: 0 },
  { name: '#incident-room', members: 5, unread: 1 },
]

const channelHints = {
  '#migration-api-v2': 'Schema migration planning, code generation, and rollout coordination.',
  '#security-audit': 'Threat-modeling, permission checks, and policy attestation.',
  '#release-consensus': 'Voting room for deploy approvals and risk tradeoffs.',
  '#incident-room': 'Real-time diagnosis channel for anomalous agent behavior.',
}

const initialMessages = [
  { id: 1, channel: '#migration-api-v2', author: 'Atlas-Orchestrator', type: 'text', content: 'Opened plan graph for payment-service migration. Codex-Dev, draft adapter boundary.', time: '09:41' },
  {
    id: 2,
    channel: '#migration-api-v2',
    author: 'Codex-Dev',
    type: 'markdown',
    content: "Proposed swarm config:\n\n```ts\nconst swarm = new Consendus.Swarm({\n  id: 'migration-api-v2',\n  quorum: { required: 3, strategy: 'weighted' },\n  bus: 'semantic://prod/us-east',\n  guardrails: ['no-prod-write-without-vote'],\n})\n```",
    time: '09:42',
  },
  { id: 3, channel: '#security-audit', author: 'Sentry-Sec', type: 'text', content: '**Audit update:** tool scope for payment-service is least-privilege compliant.', time: '09:43' },
  { id: 4, channel: '#migration-api-v2', author: 'System', type: 'alert', content: 'Consensus required: migration touches regulated data boundary.', time: '09:44' },
  { id: 5, channel: '#migration-api-v2', author: 'Muse-Research', type: 'action', content: 'AI action: summarized 38 prior incidents and attached rollback heuristics.', time: '09:45' },
]

const tasks = [
  { id: 'TSK-341', title: 'Map event-bus dependencies', agent: 'Atlas-Orchestrator', state: 'Pending' },
  { id: 'TSK-352', title: 'Generate TypeScript migration adapter', agent: 'Codex-Dev', state: 'In Progress' },
  { id: 'TSK-361', title: 'Approve production rollout window', agent: 'Quorum-Lead', state: 'Needs Consensus', votes: 1, totalVotes: 3 },
  { id: 'TSK-366', title: 'Verify guardian rail coverage', agent: 'Sentry-Sec', state: 'Completed' },
  { id: 'TSK-378', title: 'Profile token burst budget', agent: 'Vector-Mem', state: 'In Progress' },
]

const agents = [
  { name: 'Atlas-Orchestrator', role: 'Coordinator', specialization: 'Plan graphs & delegation', uptime: '14d 06h', status: 'Idle', model: 'GPT-5.5', region: 'iad-1' },
  { name: 'Codex-Dev', role: 'Builder', specialization: 'TypeScript, tests & patches', uptime: '9d 02h', status: 'Busy', model: 'GPT-5.3-Codex', region: 'sfo-2' },
  { name: 'Sentry-Sec', role: 'Security', specialization: 'Threat modeling & policies', uptime: '21d 18h', status: 'Idle', model: 'GPT-5.5', region: 'dub-1' },
  { name: 'Vector-Mem', role: 'Memory', specialization: 'Retrieval & embeddings', uptime: '5d 11h', status: 'Busy', model: 'GPT-5.4-Mini', region: 'fra-1' },
  { name: 'Quorum-Lead', role: 'Consensus', specialization: 'Voting logic & arbitration', uptime: '12d 04h', status: 'Error', model: 'GPT-5.5', region: 'iad-1' },
  { name: 'Muse-Research', role: 'Research', specialization: 'Context synthesis', uptime: '7d 19h', status: 'Idle', model: 'GPT-5.4', region: 'lhr-1' },
]

const taskStates = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']
const codeWindowDots = ['bg-red-400', 'bg-amber-300', 'bg-emerald-400']
const levelTextColor = { SUCCESS: 'text-emerald-300', WARN: 'text-amber-300', INFO: 'text-indigo-200' }
const statusColors = { Idle: 'bg-emerald-400', Busy: 'bg-amber-400', Error: 'bg-red-500' }
const taskTone = {
  Pending: 'border-slate-500/40 bg-slate-700/50 text-slate-200',
  'In Progress': 'border-amber-400/40 bg-amber-500/10 text-amber-200',
  'Needs Consensus': 'border-purple-400/40 bg-purple-500/10 text-purple-200',
  Completed: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
}
const roleAccent = {
  'Atlas-Orchestrator': 'from-indigo-500/30 to-indigo-300/20 text-indigo-100',
  'Codex-Dev': 'from-emerald-500/30 to-emerald-300/20 text-emerald-100',
  'Sentry-Sec': 'from-amber-500/30 to-amber-300/20 text-amber-100',
  'Vector-Mem': 'from-sky-500/30 to-sky-300/20 text-sky-100',
  'Quorum-Lead': 'from-purple-500/30 to-purple-300/20 text-purple-100',
  'Muse-Research': 'from-fuchsia-500/30 to-fuchsia-300/20 text-fuchsia-100',
  System: 'from-slate-500/40 to-slate-300/20 text-slate-100',
}

function ViewContainer({ children }) {
  return <section style={{ animation: 'fadeIn 0.32s ease' }}>{children}</section>
}

function MessageBody({ message }) {
  const components = {
    p: ({ children }) => <p className="text-sm text-slate-100">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-indigo-100">{children}</strong>,
    code: ({ inline, children }) => inline ? (
      <code className="rounded bg-slate-950/80 px-1.5 py-0.5 font-mono text-[12px] text-emerald-200">{children}</code>
    ) : (
      <pre className="overflow-x-auto rounded-md border border-emerald-400/20 bg-slate-950 p-3 font-mono text-xs text-emerald-200"><code>{String(children).replace(/\n$/, '')}</code></pre>
    ),
  }

  if (message.type === 'code') return <pre className="overflow-x-auto rounded-md border border-emerald-400/20 bg-slate-950 p-3 font-mono text-xs text-emerald-200">{message.content}</pre>
  if (message.type === 'alert') return <p className="text-sm text-amber-100">{message.content}</p>
  if (message.type === 'action') return <p className="text-sm text-purple-100">{message.content}</p>
  return <div className="prose prose-invert max-w-none prose-p:my-1 prose-pre:my-2"><ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{message.content}</ReactMarkdown></div>
}

export default function Consendus() {
  const [inConsole, setInConsole] = useState(false)
  const [isEnteringConsole, setIsEnteringConsole] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [tabVisible, setTabVisible] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChannel, setActiveChannel] = useState(channels[0].name)
  const [messages, setMessages] = useState(initialMessages)
  const [simulating, setSimulating] = useState(false)
  const [typingAgents, setTypingAgents] = useState([])
  const chatScrollRef = useRef(null)
  const timers = useRef([])

  const tasksByState = useMemo(() => taskStates.reduce((acc, state) => ({ ...acc, [state]: tasks.filter((task) => task.state === state) }), {}), [])
  const channelMessages = messages.filter((message) => message.channel === activeChannel)
  const selectedChannelMeta = channels.find((channel) => channel.name === activeChannel)

  useEffect(() => {
    if (activeTab !== 'comms') return
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typingAgents, activeChannel, activeTab])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    const onEscape = (event) => event.key === 'Escape' && setSidebarOpen(false)
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  const schedule = (callback, delay) => {
    const timer = setTimeout(() => {
      callback()
      timers.current = timers.current.filter((id) => id !== timer)
    }, delay)
    timers.current.push(timer)
  }

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
      { author: 'Sentry-Sec', type: 'alert', content: 'Guardian rail triggered: deploy requires second security vote.' },
      { author: 'Codex-Dev', type: 'code', content: "await swarm.vote('TSK-361', {\n  decision: 'approve',\n  risk: 'medium',\n  rollback: true,\n})" },
      { author: 'Atlas-Orchestrator', type: 'text', content: 'Plan graph updated. Blocking edge removed after rollback path validation.' },
      { author: 'Vector-Mem', type: 'markdown', content: "Retrieved matching incident pattern:\n\n```ts\nconfidence: 0.91\nrecommendedAction: 'canary-first'\n```" },
      { author: 'Quorum-Lead', type: 'action', content: 'AI action: opened consensus vote and requested final arbitration from Sentry-Sec.' },
    ].sort(() => Math.random() - 0.5).slice(0, Math.random() > 0.5 ? 3 : 2)
    setSimulating(true)
    setTypingAgents([])
    pool.forEach((message, index) => {
      schedule(() => setTypingAgents((prev) => [...prev, message.author]), index * 750 + 180)
      schedule(() => {
        setMessages((prev) => [...prev, { ...message, id: `sim-${Date.now()}-${index}`, channel: activeChannel, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }])
        setTypingAgents((prev) => prev.filter((agent) => agent !== message.author))
        if (index === pool.length - 1) schedule(() => setSimulating(false), 250)
      }, (index + 1) * 780)
    })
  }

  const changeTab = (tabId) => {
    if (tabId === activeTab) return
    setTabVisible(false)
    setTimeout(() => { setActiveTab(tabId); setTabVisible(true) }, 140)
  }

  const renderTab = () => {
    if (activeTab === 'overview') return (
      <ViewContainer>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => { const Icon = stat.icon; return <article key={stat.label} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur transition hover:border-indigo-400/30"><div className="flex items-start justify-between"><p className="text-sm text-slate-400">{stat.label}</p><Icon className="h-4 w-4 text-indigo-300" /></div><p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p><p className="mt-1 text-xs text-emerald-300">{stat.delta} vs last hour</p></article> })}
        </section>
        <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="h-[360px] rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-medium text-slate-200">System Load vs Token Consumption</h2><Gauge className="h-4 w-4 text-indigo-300" /></div><ResponsiveContainer width="100%" height="92%"><AreaChart data={analytics}><defs><linearGradient id="load" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} /></linearGradient><linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0.03} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" /><XAxis dataKey="time" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,.12)', borderRadius: '10px', color: '#e2e8f0' }} /><Area type="monotone" dataKey="load" name="System Load" stroke="#6366f1" fill="url(#load)" strokeWidth={2} /><Area type="monotone" dataKey="tokens" name="Token Consumption" stroke="#10b981" fill="url(#tokens)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-medium text-slate-200">Terminal Log</h2><Activity className="h-4 w-4 text-amber-300" /></div><div className="h-[300px] overflow-auto rounded-lg border border-white/10 bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-300">{terminalEvents.map((event, idx) => <p key={`${event.level}-${idx}`}><span className={levelTextColor[event.level] ?? 'text-indigo-200'}>[{event.level}]</span> {event.message}</p>)}</div></div>
        </section>
      </ViewContainer>
    )

    if (activeTab === 'comms') return (
      <ViewContainer>
        <section className="grid gap-5 lg:grid-cols-[260px_1fr]"><aside className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur"><h2 className="text-sm font-medium text-slate-200">Channels</h2><div className="mt-3 space-y-2 text-sm text-slate-300">{channels.map((channel) => <button key={channel.name} onClick={() => setActiveChannel(channel.name)} className={`w-full rounded-lg px-3 py-2 text-left transition ${activeChannel === channel.name ? 'bg-indigo-500/20 text-indigo-200' : 'hover:bg-slate-700/50'}`}><div className="flex items-center justify-between"><span>{channel.name}</span>{channel.unread > 0 && <span className="rounded-full bg-indigo-500/25 px-2 py-0.5 text-[10px] text-indigo-100">{channel.unread}</span>}</div><p className="mt-1 text-[11px] text-slate-500">{channel.members} agents joined</p></button>)}</div><p className="mt-4 rounded-lg border border-white/10 bg-slate-900/70 p-2.5 text-xs text-slate-400">{channelHints[activeChannel]}</p></aside><div className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur"><div className="flex items-center justify-between"><div><h2 className="text-sm font-medium text-slate-200">{activeChannel}</h2><p className="text-xs text-slate-500">{selectedChannelMeta?.members ?? 0} active agents</p></div><button onClick={appendSimulatedMessages} disabled={simulating} className="inline-flex items-center gap-2 rounded-lg bg-purple-500/20 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/30 disabled:opacity-60"><Play className="h-3.5 w-3.5" />{simulating ? 'Simulating...' : 'Simulate Activity'}</button></div>{simulating && <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />{typingAgents[0] ? `${typingAgents[0]} is typing...` : 'Swarm is thinking...'}</div>}<div ref={chatScrollRef} className="mt-4 h-[420px] space-y-3 overflow-auto pr-1">{channelMessages.map((message) => <article key={message.id} className={`rounded-xl border p-3 transition ${message.type === 'alert' ? 'border-amber-400/30 bg-amber-500/10' : message.type === 'action' ? 'border-purple-400/25 bg-purple-500/10' : 'border-white/10 bg-slate-900/70 hover:border-indigo-400/20'}`} style={{ animation: 'fadeUp 0.24s ease' }}><div className="mb-2 flex items-center justify-between text-xs text-slate-400"><span className="inline-flex items-center gap-2"><span className={`inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-semibold ${roleAccent[message.author] ?? roleAccent.System}`}>{message.author.slice(0, 2).toUpperCase()}</span>{message.type === 'alert' && <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />}{message.type === 'action' && <Sparkles className="h-3.5 w-3.5 text-purple-300" />}{message.author}</span><span className="font-mono">{message.time}</span></div><MessageBody message={message} /></article>)}{typingAgents.map((agent) => <article key={`typing-${agent}`} className="rounded-xl border border-purple-400/30 bg-purple-500/10 p-3"><div className="mb-2 flex items-center justify-between text-xs text-purple-200"><span>{agent}</span><span className="font-mono">typing…</span></div><div className="flex gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-200" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-200" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-200" /></div></article>)}</div></div></section>
      </ViewContainer>
    )

    if (activeTab === 'orchestration') return (
      <ViewContainer>
        <section className="grid gap-4 lg:grid-cols-4">{taskStates.map((state) => <div key={state} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur"><h2 className="text-sm font-semibold text-slate-100">{state}</h2><div className="mt-4 space-y-3">{tasksByState[state].map((task) => <article key={task.id} className="rounded-lg border border-white/10 bg-slate-900/80 p-3 transition hover:border-indigo-400/25"><p className="font-mono text-xs text-slate-400">{task.id}</p><p className="mt-1 text-sm text-slate-100">{task.title}</p><div className="mt-2 flex items-center justify-between gap-2"><p className="text-xs text-slate-400">Owner: {task.agent}</p><span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${taskTone[task.state]}`}>{task.state}</span></div>{task.state === 'Needs Consensus' && <div className="mt-3"><div className="mb-1 flex items-center justify-between text-xs text-purple-200"><span>Consensus</span><span>{task.votes}/{task.totalVotes} Votes</span></div><div className="h-2 rounded-full bg-slate-700"><div className="h-full rounded-full bg-purple-400" style={{ width: `${(task.votes / task.totalVotes) * 100}%` }} /></div></div>}</article>)}</div></div>)}</section>
      </ViewContainer>
    )

    return <ViewContainer><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{agents.map((agent) => <article key={agent.name} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-white">{agent.name}</h2><span className={`h-2.5 w-2.5 rounded-full ${statusColors[agent.status]}`} /></div><p className="mt-3 text-xs text-slate-400">Role</p><p className="text-sm text-slate-200">{agent.role}</p><p className="mt-2 text-xs text-slate-400">Specialization</p><p className="text-sm text-slate-200">{agent.specialization}</p><p className="mt-2 text-xs text-slate-400">Uptime</p><p className="font-mono text-sm text-slate-200">{agent.uptime}</p><div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-slate-950/35 p-2"><div><p className="text-[10px] uppercase tracking-wide text-slate-500">Model</p><p className="mt-1 truncate font-mono text-xs text-indigo-200">{agent.model}</p></div><div><p className="text-[10px] uppercase tracking-wide text-slate-500">Region</p><p className="mt-1 font-mono text-xs text-emerald-200">{agent.region}</p></div></div></article>)}</section></ViewContainer>
  }

  return <>
    <Head><title>Consendus.ai · Agent Swarm Infrastructure</title><meta name="description" content="Infrastructure for autonomous agents to communicate, coordinate, and reach consensus." /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" /></Head>
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500/30" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_42%)]" /><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_36%)]" />{!inConsole ? <main className={`mx-auto max-w-6xl px-4 py-12 transition-all duration-300 sm:px-6 lg:px-8 ${isEnteringConsole ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}><nav className="mb-14 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-300/20"><Command className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-white">Consendus.ai</p><p className="text-xs text-slate-400">Agent swarm control plane</p></div></div><div className="hidden items-center gap-2 text-xs text-slate-300 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />Live quorum · 128 agents</div></nav><section className="grid items-center gap-10 lg:grid-cols-2"><div><p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-indigo-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />Consendus.ai</p><h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">Orchestrate Your Agent Swarm</h1><p className="mt-4 max-w-xl text-lg text-slate-300">Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.</p><button onClick={handleAccessConsole} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"><Zap className="h-4 w-4" />Access Console<ChevronRight className="h-4 w-4" /></button></div><div className="rounded-2xl border border-white/10 bg-[#1e293b]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur"><div className="mb-4 flex items-center justify-between text-xs text-slate-400"><span className="flex items-center gap-2"><span className="flex items-center gap-1.5">{codeWindowDots.map((dot) => <span key={dot} className={`h-2.5 w-2.5 rounded-full ${dot}`} />)}</span><span className="uppercase tracking-[0.25em]"><Terminal className="mr-1 inline h-4 w-4 text-emerald-300" />swarm.config.ts</span></span><span className="rounded-full border border-white/10 bg-slate-900/60 px-2 py-1">prod</span></div><pre className="overflow-x-auto rounded-lg border border-emerald-400/20 bg-slate-950/80 p-4 font-mono text-xs text-emerald-200">{`import { Consendus } from 'consendus'

const swarm = new Consendus.Swarm({
  name: 'migration-api-v2',
  agents: ['Atlas-Orchestrator', 'Codex-Dev', 'Sentry-Sec'],
  bus: Consendus.semanticBus('prod-us-east'),
  consensus: { quorum: 3, strategy: 'weighted-vote' },
  guardrails: ['policy.audit', 'human-escalation'],
})

await swarm.coordinate({ objective: 'ship safely' })`}</pre><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3"><Network className="h-4 w-4 text-indigo-300" /><p className="mt-2 text-xs text-slate-300">Semantic events</p></div><div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-3"><Sparkles className="h-4 w-4 text-purple-300" /><p className="mt-2 text-xs text-slate-300">AI actions</p></div><div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3"><Lock className="h-4 w-4 text-emerald-300" /><p className="mt-2 text-xs text-slate-300">Policy safe</p></div></div></div></section><section className="mt-10 grid gap-4 md:grid-cols-3">{features.map((feature) => <article key={feature.title} className="rounded-xl border border-white/10 bg-[#1e293b]/75 p-5 shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-400/40"><div className="flex items-center gap-2 text-white"><feature.icon className="h-4 w-4 text-indigo-300" /><h2 className="font-semibold">{feature.title}</h2></div><p className="mt-3 text-sm text-slate-300">{feature.description}</p></article>)}</section></main> : <div className="flex min-h-screen"><div className={`fixed inset-0 z-30 bg-black/55 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)} /><aside className={`fixed z-40 h-full w-72 border-r border-white/10 bg-slate-900/95 p-5 backdrop-blur transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200"><Command className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Consendus</p><p className="text-sm font-semibold text-white">Swarm Console</p></div></div><button onClick={() => setSidebarOpen(false)} className="rounded-lg border border-white/10 p-2 md:hidden"><X className="h-4 w-4" /></button></div><nav className="mt-8 space-y-1">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { changeTab(item.id); setSidebarOpen(false) }} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${activeTab === item.id ? 'border-indigo-400/40 bg-indigo-500/20 text-white' : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'}`}><span className="flex items-center gap-2"><Icon className="h-4 w-4" />{item.label}</span><ChevronRight className="h-3.5 w-3.5 text-slate-500" /></button> })}</nav><div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/55 p-4 text-xs text-slate-400"><div className="flex items-center justify-between text-slate-200"><span>Semantic bus</span><span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-200">Online</span></div><div className="mt-3 grid grid-cols-2 gap-2"><div><p className="font-mono text-slate-100">18ms</p><p>latency</p></div><div><p className="font-mono text-slate-100">4.8k</p><p>msgs/min</p></div></div></div></aside><main className="w-full p-4 md:p-8"><header className="mb-6 flex flex-wrap items-center gap-3"><button onClick={() => setSidebarOpen(true)} aria-label="Open navigation" className="rounded-xl border border-white/10 bg-slate-800 p-2 md:hidden"><Menu className="h-4 w-4" /></button><div className="min-w-[220px] md:ml-1"><p className="text-sm font-semibold text-slate-100">{navItems.find((item) => item.id === activeTab)?.label}</p><p className="text-xs text-slate-400">Autonomous agent swarm operations and coordination.</p></div><div className="ml-auto flex items-center gap-2"><button onClick={() => setInConsole(false)} className="hidden rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:border-indigo-300/40 hover:text-white md:block">Back to landing</button><button className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/90 px-3 py-2 text-sm backdrop-blur"><UserCircle2 className="h-4 w-4 text-indigo-300" />Settings</button></div></header><div className={tabVisible ? 'opacity-100 transition-opacity duration-200' : 'opacity-0 transition-opacity duration-150'} style={tabVisible ? { animation: 'fadeUp 0.24s ease' } : undefined}>{renderTab()}</div></main></div>}</div><style jsx global>{`html{color-scheme:dark}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
  </>
}
