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
  { label: 'Token Usage', value: '1.2M', delta: '+4%', icon: Cpu },
]

const chartLegends = [
  { label: 'System Load', color: '#6366f1' },
  { label: 'Token Consumption', color: '#10b981' },
]

const landingPills = [
  { label: 'Semantic Routing', tone: 'text-indigo-200 border-indigo-400/30 bg-indigo-500/10' },
  { label: 'Deterministic Consensus', tone: 'text-purple-200 border-purple-400/30 bg-purple-500/10' },
  { label: 'Policy Guard Rails', tone: 'text-emerald-200 border-emerald-400/30 bg-emerald-500/10' },
]

const quickSignals = [
  { label: 'Consensus Queue', value: '07', tone: 'text-purple-200 border-purple-400/30 bg-purple-500/10' },
  { label: 'Guard Rails', value: 'Stable', tone: 'text-emerald-200 border-emerald-400/30 bg-emerald-500/10' },
  { label: 'Latency P95', value: '42ms', tone: 'text-amber-200 border-amber-400/30 bg-amber-500/10' },
]

const swarmReadiness = [
  { label: 'Bus partitions', value: '0', helper: 'all shards routable', tone: 'text-emerald-200' },
  { label: 'Consensus SLA', value: '312ms', helper: 'p90 decision latency', tone: 'text-indigo-200' },
  { label: 'Guardrail audits', value: '1.8k', helper: 'checks in last hour', tone: 'text-purple-200' },
  { label: 'Human escalations', value: '2', helper: 'awaiting approval', tone: 'text-amber-200' },
]

const controlPlaneSignals = [
  { label: 'Semantic Bus', value: '42ms p95', tone: 'text-indigo-200', bar: '72%' },
  { label: 'Consensus Mesh', value: '3 validators', tone: 'text-purple-200', bar: '100%' },
  { label: 'Guardian Rails', value: '0 drift', tone: 'text-emerald-200', bar: '88%' },
]

const agentWorkload = {
  'Atlas-Orchestrator': 34,
  'Codex-Dev': 81,
  'Sentry-Sec': 19,
  'Nova-Observer': 67,
  'Pulse-Mediator': 92,
}

const trustSignals = [
  { label: 'Autonomous tasks resolved', value: '18.2k' },
  { label: 'Consensus decisions audited', value: '99.98%' },
  { label: 'Policy rollbacks prevented', value: '431' },
]

const swarmTopology = [
  { agent: 'Atlas', role: 'orchestrator', position: 'left-[12%] top-[18%]', tone: 'border-indigo-300/40 bg-indigo-500/20 text-indigo-100' },
  { agent: 'Codex', role: 'builder', position: 'right-[14%] top-[22%]', tone: 'border-emerald-300/40 bg-emerald-500/20 text-emerald-100' },
  { agent: 'Sentry', role: 'guardian', position: 'left-[18%] bottom-[18%]', tone: 'border-amber-300/40 bg-amber-500/20 text-amber-100' },
  { agent: 'Pulse', role: 'mediator', position: 'right-[18%] bottom-[16%]', tone: 'border-purple-300/40 bg-purple-500/20 text-purple-100' },
]

const missionSteps = [
  { label: 'Discover', status: 'complete', tone: 'bg-emerald-400' },
  { label: 'Debate', status: 'active', tone: 'bg-purple-400' },
  { label: 'Vote', status: 'pending', tone: 'bg-slate-500' },
  { label: 'Execute', status: 'guarded', tone: 'bg-amber-400' },
]

const consensusRadar = [
  { label: 'Quorum health', value: '3/3 validators', tone: 'text-emerald-200', width: '100%' },
  { label: 'Policy drift', value: '0.04 risk', tone: 'text-emerald-200', width: '12%' },
  { label: 'Escalation backlog', value: '7 reviews', tone: 'text-amber-200', width: '46%' },
]

const codeWindowDots = ['bg-red-400', 'bg-amber-300', 'bg-emerald-400']

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

const terminalEvents = [
  { level: 'INFO', message: 'Agent-2 connected to semantic bus (latency 18ms)' },
  { level: 'INFO', message: 'Consensus quorum initialized for task-3' },
  { level: 'WARN', message: 'High latency detected on shard eu-west-1' },
  { level: 'INFO', message: 'Guardian Rails policy patch applied by Sentry-Sec' },
  { level: 'INFO', message: 'Token limiter adjusted (window=10s burst=128)' },
  { level: 'SUCCESS', message: 'Deployment approved after 3/3 votes' },
  { level: 'INFO', message: 'Heartbeat stream stable (24 active agents)' },
]

const channels = [
  { name: '#migration-api-v2', members: 8, unread: 3 },
  { name: '#security-audit', members: 5, unread: 1 },
  { name: '#platform-rollout', members: 7, unread: 0 },
  { name: '#compliance-vote', members: 4, unread: 2 },
]

const channelPresence = {
  '#migration-api-v2': ['Atlas-Orchestrator', 'Codex-Dev', 'Nova-Observer'],
  '#security-audit': ['Sentry-Sec', 'Pulse-Mediator'],
  '#platform-rollout': ['Atlas-Orchestrator', 'Nova-Observer', 'Codex-Dev'],
  '#compliance-vote': ['Pulse-Mediator', 'Sentry-Sec', 'Atlas-Orchestrator'],
}

const channelHints = {
  '#migration-api-v2': 'Release coordination and canary promotion updates.',
  '#security-audit': 'Policy checks, signatures, and threat findings.',
  '#platform-rollout': 'Regional rollout status across control-plane clusters.',
  '#compliance-vote': 'Consensus ballots for high-risk orchestration decisions.',
}

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
  {
    id: 5,
    channel: '#migration-api-v2',
    author: 'Pulse-Mediator',
    type: 'action',
    content: 'Executed AI action: proposed rollback guard with confidence 0.92.',
    time: '09:45',
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
    model: 'GPT-5.5',
    region: 'iad-1',
    permissions: ['route', 'delegate', 'vote'],
  },
  {
    name: 'Codex-Dev',
    role: 'Builder',
    specialization: 'TypeScript & APIs',
    uptime: '9d 02h',
    status: 'Busy',
    model: 'GPT-5.4-Codex',
    region: 'sfo-2',
    permissions: ['code', 'test', 'propose'],
  },
  {
    name: 'Sentry-Sec',
    role: 'Security & Policy',
    specialization: 'Threat Modeling',
    uptime: '21d 18h',
    status: 'Idle',
    model: 'GPT-5.5',
    region: 'dub-1',
    permissions: ['audit', 'block', 'sign'],
  },
  {
    name: 'Nova-Observer',
    role: 'Telemetry',
    specialization: 'Tracing & Metrics',
    uptime: '5d 11h',
    status: 'Busy',
    model: 'GPT-5.4-Mini',
    region: 'fra-1',
    permissions: ['trace', 'summarize', 'alert'],
  },
  {
    name: 'Pulse-Mediator',
    role: 'Consensus',
    specialization: 'Voting Logic',
    uptime: '12d 04h',
    status: 'Error',
    model: 'GPT-5.5',
    region: 'iad-1',
    permissions: ['mediate', 'quorum', 'escalate'],
  },
]


const consensusValidators = [
  { agent: 'Atlas-Orchestrator', vote: 'Approve', confidence: '0.96', tone: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' },
  { agent: 'Sentry-Sec', vote: 'Approve', confidence: '0.91', tone: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' },
  { agent: 'Pulse-Mediator', vote: 'Pending', confidence: '—', tone: 'border-purple-400/30 bg-purple-500/10 text-purple-200' },
]

const orchestrationSignals = [
  { label: 'Quorum threshold', value: '3 validators' },
  { label: 'Rollback guard', value: 'Armed' },
  { label: 'Decision mode', value: 'Weighted majority' },
]

const statusColors = {
  Idle: 'bg-emerald-400',
  Busy: 'bg-amber-400',
  Error: 'bg-red-500',
}

const taskStates = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']

const taskStateBadgeTone = {
  Pending: 'border-slate-500/40 bg-slate-700/50 text-slate-200',
  'In Progress': 'border-amber-400/40 bg-amber-500/10 text-amber-200',
  'Needs Consensus': 'border-purple-400/40 bg-purple-500/10 text-purple-200',
  Completed: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
}

const statusLegend = [
  { label: 'Idle', color: 'bg-emerald-400' },
  { label: 'Busy', color: 'bg-amber-400' },
  { label: 'Error', color: 'bg-red-500' },
]

const fleetHealth = [
  { label: 'Policy coverage', value: '100%', tone: 'text-emerald-200', bar: '100%' },
  { label: 'Signed actions', value: '98.7%', tone: 'text-indigo-200', bar: '98.7%' },
  { label: 'Human escalations', value: '3 open', tone: 'text-amber-200', bar: '34%' },
]


const consoleHealth = [
  { label: 'Quorum', value: '3/3' },
  { label: 'Policies', value: '187' },
  { label: 'Regions', value: '5' },
]

const tabMeta = {
  overview: {
    title: 'Overview',
    description: 'Live swarm health, throughput, and consensus telemetry.',
  },
  comms: {
    title: 'Comms',
    description: 'Agent-to-agent collaboration channels with structured updates.',
  },
  orchestration: {
    title: 'Orchestration',
    description: 'Task execution lanes with explicit consensus checkpoints.',
  },
  fleet: {
    title: 'Agent Fleet',
    description: 'Directory of autonomous agents, roles, and runtime status.',
  },
}

const levelTextColor = {
  SUCCESS: 'text-emerald-300',
  WARN: 'text-amber-300',
  INFO: 'text-indigo-200',
}

const agentAccent = {
  'Atlas-Orchestrator': 'from-indigo-500/30 to-indigo-300/20 text-indigo-100',
  'Codex-Dev': 'from-emerald-500/30 to-emerald-300/20 text-emerald-100',
  'Sentry-Sec': 'from-amber-500/30 to-amber-300/20 text-amber-100',
  'Nova-Observer': 'from-sky-500/30 to-sky-300/20 text-sky-100',
  'Pulse-Mediator': 'from-purple-500/30 to-purple-300/20 text-purple-100',
  System: 'from-slate-500/40 to-slate-300/20 text-slate-100',
}

function ViewContainer({ children }) {
  return <section style={{ animation: 'fadeIn 0.32s ease' }}>{children}</section>
}

function MessageBody({ message }) {
  const markdownComponents = {
    p: ({ children }) => <p className="text-sm text-slate-100">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-indigo-100">{children}</strong>,
    code: ({ inline, className, children }) => {
      const match = /language-(\w+)/.exec(className || '')

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
          className="overflow-x-auto rounded-md border border-emerald-400/20 bg-slate-950 p-3 text-xs text-emerald-200 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]"
          data-language={match?.[1] ?? 'typescript'}
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <code>{String(children).replace(/\n$/, '')}</code>
        </pre>
      )
    },
  }

  if (message.type === 'code') {
    return (
      <pre
        className="overflow-x-auto rounded-md border border-emerald-400/20 bg-slate-950 p-3 text-emerald-200 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {message.content}
      </pre>
    )
  }

  if (message.type === 'action') {
    return <p className="text-sm text-purple-100">{message.content}</p>
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

  if (message.type === 'text') {
    return (
      <div className="prose prose-invert max-w-none prose-p:my-1 prose-pre:my-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {message.content}
        </ReactMarkdown>
      </div>
    )
  }

  const segments = message.content.split(/(\*\*.*?\*\*)/g)

  return (
    <p className={`text-sm ${message.type === 'alert' ? 'text-amber-100' : 'text-slate-100'}`}>
      {segments.map((segment, index) =>
        segment.startsWith('**') && segment.endsWith('**') ? (
          <strong key={`${segment}-${index}`} className="font-semibold text-slate-50">
            {segment.slice(2, -2)}
          </strong>
        ) : (
          <span key={`${segment}-${index}`}>{segment}</span>
        )
      )}
    </p>
  )
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
  const [simulationStep, setSimulationStep] = useState('idle')
  const [typingAgents, setTypingAgents] = useState([])
  const chatScrollRef = useRef(null)
  const simulationTimersRef = useRef([])

  const tasksByState = useMemo(
    () =>
      taskStates.reduce((acc, state) => {
        acc[state] = tasks.filter((task) => task.state === state)
        return acc
      }, {}),
    []
  )

  const channelMessages = messages.filter((message) => message.channel === activeChannel)
  const selectedChannelMeta = channels.find((channel) => channel.name === activeChannel)

  useEffect(() => {
    if (activeTab !== 'comms') return

    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, typingAgents, activeChannel, activeTab])

  useEffect(
    () => () => {
      simulationTimersRef.current.forEach((timerId) => clearTimeout(timerId))
      simulationTimersRef.current = []
    },
    []
  )


  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  useEffect(() => {
    if (!inConsole || typeof document === 'undefined') return

    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen, inConsole])

  const scheduleSimulation = (callback, delay) => {
    const timerId = setTimeout(() => {
      callback()
      simulationTimersRef.current = simulationTimersRef.current.filter((id) => id !== timerId)
    }, delay)
    simulationTimersRef.current.push(timerId)
  }

  const formatSimulationTime = (offset = 0) => {
    const now = new Date()
    now.setSeconds(now.getSeconds() + offset)
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
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
      {
        author: 'Pulse-Mediator',
        channel: activeChannel,
        type: 'action',
        content: 'Executed AI action: quorum lock engaged while waiting for final validator vote.',
      },
    ]
    const uniquePool = pool.filter((message, index, source) => source.findIndex((item) => item.author === message.author) === index)
    const targetCount = Math.random() > 0.5 ? 3 : 2
    const generated = uniquePool.sort(() => Math.random() - 0.5).slice(0, targetCount)

    setSimulating(true)
    setSimulationStep('typing')
    setTypingAgents([])

    generated.forEach((message, index) => {
      scheduleSimulation(() => {
        setTypingAgents((prev) => (prev.includes(message.author) ? prev : [...prev, message.author]))
      }, index * 700 + 260)

      scheduleSimulation(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            id: `sim-${Date.now()}-${index}`,
            time: formatSimulationTime(index * 60),
          },
        ])
        setTypingAgents((prev) => prev.filter((agent) => agent !== message.author))

        if (index === generated.length - 1) {
          scheduleSimulation(() => {
            setSimulating(false)
            setSimulationStep('idle')
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
          <section className="mb-5 rounded-xl border border-white/10 bg-slate-800/60 p-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">Mission lifecycle</p>
                <p className="text-xs text-slate-400">A guarded migration run moving from discovery to consensus execution.</p>
              </div>
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                MIGRATION-API-V2 · live
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {missionSteps.map((step, index) => (
                <div key={step.label} className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">{step.label}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${step.tone} ${step.status === 'active' ? 'animate-pulse' : ''}`} />
                  </div>
                  <p className="mt-2 font-mono text-[11px] uppercase text-slate-500">0{index + 1} · {step.status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Control-plane signals</p>
                  <p className="text-xs text-slate-400">Routing, consensus, and policy health across the swarm mesh.</p>
                </div>
                <Network className="h-4 w-4 text-indigo-300" />
              </div>
              <div className="mt-4 space-y-3">
                {controlPlaneSignals.map((signal) => (
                  <div key={signal.label} className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{signal.label}</span>
                      <span className={signal.tone}>{signal.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-950/80">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300" style={{ width: signal.bar }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-800/60 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Consensus radar</p>
                  <p className="text-xs text-slate-400">Guarded decisions waiting for final execution.</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-purple-300" />
              </div>
              <div className="mt-4 space-y-3">
                {consensusRadar.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate-300">{item.label}</span>
                      <span className={item.tone}>{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-950/80">
                      <div className="h-full rounded-full bg-purple-400" style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <article
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur transition duration-200 hover:border-indigo-400/30 hover:bg-slate-800/85"
                >
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
                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
                    {chartLegends.map((legend) => (
                      <span key={legend.label} className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: legend.color }} />
                        {legend.label}
                      </span>
                    ))}
                  </div>
                  <Gauge className="h-4 w-4 text-indigo-300" />
                </div>
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
                {terminalEvents.map((event, idx) => (
                  <p key={`${event.level}-${idx}`} className={event.level === 'WARN' ? 'text-amber-200' : ''}>
                    <span className={levelTextColor[event.level] ?? 'text-indigo-200'}>
                      [{event.level}]
                    </span>{' '}
                    {event.message}
                  </p>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-emerald-200">Bus heartbeat</p>
                  <p className="mt-1 text-lg font-semibold text-white">18ms</p>
                </div>
                <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-purple-200">Consensus locks</p>
                  <p className="mt-1 text-lg font-semibold text-white">7 active</p>
                </div>
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-amber-200">Policy drift</p>
                  <p className="mt-1 text-lg font-semibold text-white">0.02%</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Consensus radar</p>
                  <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-200">
                    guarded
                  </span>
                </div>
                <div className="space-y-3">
                  {consensusRadar.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-400">{item.label}</span>
                        <span className={item.tone}>{item.value}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300" style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
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
                    key={channel.name}
                    onClick={() => setActiveChannel(channel.name)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition ${
                      activeChannel === channel.name ? 'bg-indigo-500/20 text-indigo-200' : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{channel.name}</span>
                      {channel.unread > 0 ? (
                        <span className="rounded-full bg-indigo-500/25 px-2 py-0.5 text-[10px] text-indigo-100">
                          {channel.unread}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">{channel.members} agents joined</p>
                  </button>
                ))}
              </div>
              <p className="mt-4 rounded-lg border border-white/10 bg-slate-900/70 p-2.5 text-xs text-slate-400">
                {channelHints[activeChannel]}
              </p>
              <div className="mt-3 rounded-lg border border-white/10 bg-slate-900/70 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Live participants</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(channelPresence[activeChannel] ?? []).map((agent) => (
                    <span
                      key={agent}
                      className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-slate-200">{activeChannel}</h2>
                  <p className="text-xs text-slate-500">{selectedChannelMeta?.members ?? 0} active agents</p>
                </div>
                <button
                  onClick={appendSimulatedMessages}
                  disabled={simulating}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-500/20 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play className="h-3.5 w-3.5" />
                  {simulating ? 'Simulating...' : 'Simulate Activity'}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Simulated runs enqueue 2-3 mock responses with staggered typing delays.
              </p>

              {simulating && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />
                  {typingAgents[0] ? `${typingAgents[0]} is typing...` : simulationStep === 'typing' ? 'Agent swarm is drafting responses...' : 'Simulation complete.'}
                </div>
              )}

              <div ref={chatScrollRef} className="mt-4 h-[320px] space-y-3 overflow-auto pr-1">
                {channelMessages.map((message) => (
                  <article
                    key={message.id}
                    className={`rounded-xl border p-3 transition ${
                      message.type === 'alert'
                        ? 'border-amber-400/30 bg-amber-500/10'
                        : message.type === 'action'
                        ? 'border-purple-400/25 bg-purple-500/10'
                        : 'border-white/10 bg-slate-900/70 hover:border-indigo-400/20'
                    }`}
                    style={{ animation: 'fadeUp 0.24s ease' }}
                  >
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-semibold ${agentAccent[message.author] ?? 'from-slate-500/40 to-slate-300/20 text-slate-100'}`}>
                          {message.author.slice(0, 2).toUpperCase()}
                        </span>
                        {message.type === 'alert' ? <AlertTriangle className="h-3.5 w-3.5 text-amber-300" /> : null}
                        {message.type === 'action' ? <Sparkles className="h-3.5 w-3.5 text-purple-300" /> : null}
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

              <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-3">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Message {activeChannel}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>agents only</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-500">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  <span className="truncate">Compose update… (prototype input)</span>
                </div>
              </div>
            </div>
          </section>
        </ViewContainer>
      )
    }

    if (activeTab === 'orchestration') {
      return (
        <ViewContainer key={activeTab}>
          <section className="mb-5 grid gap-3 md:grid-cols-4">
            {swarmReadiness.map((item) => (
              <article key={item.label} className="rounded-xl border border-white/10 bg-slate-800/60 p-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className={`mt-2 text-xl font-semibold ${item.tone}`}>{item.value}</p>
                <p className="mt-1 text-xs text-slate-400">{item.helper}</p>
              </article>
            ))}
          </section>

          <section className="mb-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4 backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-purple-100">Consensus checkpoint</p>
                  <p className="mt-1 text-xs text-slate-300">TSK-361 requires quorum before the deployment patch can execute.</p>
                </div>
                <span className="rounded-full border border-purple-300/30 bg-slate-950/40 px-3 py-1 font-mono text-xs text-purple-100">
                  2/3 validators ready
                </span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {consensusValidators.map((validator) => (
                  <div key={validator.agent} className={`rounded-lg border px-3 py-2 ${validator.tone}`}>
                    <p className="truncate text-xs font-semibold">{validator.agent}</p>
                    <p className="mt-1 font-mono text-[11px]">{validator.vote} · {validator.confidence}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-slate-100">Execution policy</p>
              <div className="mt-3 space-y-2">
                {orchestrationSignals.map((signal) => (
                  <div key={signal.label} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs">
                    <span className="text-slate-400">{signal.label}</span>
                    <span className="font-mono text-slate-100">{signal.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-4">
            {taskStates.map((state) => (
              <div key={state} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
                <h2 className="text-sm font-semibold text-slate-100">{state}</h2>
                <div className="mt-4 space-y-3">
                  {tasksByState[state].map((task) => (
                    <article
                      key={task.id}
                      className="rounded-lg border border-white/10 bg-slate-900/80 p-3 transition hover:border-indigo-400/25"
                    >
                      <p className="text-xs text-slate-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {task.id}
                      </p>
                      <p className="mt-1 text-sm text-slate-100">{task.title}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-400">Assigned: {task.agent}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${taskStateBadgeTone[task.state]}`}>
                          {task.state}
                        </span>
                      </div>
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
        <div className="mb-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-2 text-xs text-slate-300">
            <span className="text-slate-400">Status legend:</span>
            {statusLegend.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                {item.label}
              </span>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {fleetHealth.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-slate-800/60 px-3 py-2">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-mono ${item.tone}`}>{item.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-950/80">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300" style={{ width: item.bar }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <article key={agent.name} className="rounded-xl border border-white/10 bg-slate-800/70 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">{agent.name}</h2>
                <span className={`h-2.5 w-2.5 rounded-full ${statusColors[agent.status]}`} />
              </div>
              <p className="mt-3 text-xs text-slate-400">Status</p>
              <p className="text-sm text-slate-200">{agent.status}</p>
              <p className="mt-2 text-xs text-slate-400">Role</p>
              <p className="text-sm text-slate-200">{agent.role}</p>
              <p className="mt-2 text-xs text-slate-400">Specialization</p>
              <p className="text-sm text-slate-200">{agent.specialization}</p>
              <p className="mt-2 text-xs text-slate-400">Uptime</p>
              <p className="text-sm text-slate-200" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {agent.uptime}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-slate-950/35 p-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Runtime</p>
                  <p className="mt-1 truncate font-mono text-xs text-indigo-200">{agent.model}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Region</p>
                  <p className="mt-1 font-mono text-xs text-emerald-200">{agent.region}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.permissions.map((permission) => (
                  <span
                    key={`${agent.name}-${permission}`}
                    className="rounded-full border border-purple-400/25 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-200"
                  >
                    {permission}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current workload</span>
                  <span className="text-slate-200" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {agentWorkload[agent.name]}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-950/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-purple-400"
                    style={{ width: `${agentWorkload[agent.name]}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      </ViewContainer>
    )
  }

  return (
    <>
      <Head>
        <title>Consendus.ai · Agent Swarm Infrastructure</title>
        <meta
          name="description"
          content="Consendus.ai is a dark-mode console prototype for orchestrating autonomous AI agent swarms with semantic messaging, consensus voting, and guardian rails."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500/30"
        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      >
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_42%)]" />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_36%)]" />
        {!inConsole ? (
          <main
            className={`mx-auto max-w-6xl px-4 py-12 transition-all duration-300 sm:px-6 lg:px-8 ${
              isEnteringConsole ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
            }`}
          >
            <nav className="mb-14 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-300/20">
                  <Command className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Consendus.ai</p>
                  <p className="text-xs text-slate-400">Swarm infrastructure control plane</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 text-xs text-slate-300 sm:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                Live network · 128 agents
              </div>
            </nav>
            <section className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-indigo-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                  Consendus.ai
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {landingPills.map((pill) => (
                    <span key={pill.label} className={`rounded-full border px-2.5 py-1 text-[11px] ${pill.tone}`}>
                      {pill.label}
                    </span>
                  ))}
                </div>
                <h1 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Orchestrate Your Agent Swarm
                </h1>
                <p className="mt-4 max-w-xl text-slate-300">
                  Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
                </p>
                <button
                  onClick={handleAccessConsole}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Access Console
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {trustSignals.map((signal) => (
                    <div key={signal.label} className="rounded-xl border border-white/10 bg-slate-800/55 p-3 backdrop-blur">
                      <p className="text-lg font-semibold text-white">{signal.value}</p>
                      <p className="mt-1 text-[11px] leading-4 text-slate-400">{signal.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1e293b]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                      {codeWindowDots.map((dot) => (
                        <span key={dot} className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                      ))}
                    </span>
                    <span className="uppercase tracking-[0.25em]">
                      <Terminal className="mr-1 inline h-4 w-4 text-emerald-300" />
                      swarm.config.ts
                    </span>
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-900/60 px-2 py-1">Readonly</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/50 p-1">
                  <pre
                    className="overflow-x-auto rounded-lg border border-emerald-400/20 bg-slate-950/80 p-4 text-xs text-emerald-200"
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

                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">Live swarm topology</span>
                    <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 text-purple-200">
                      quorum forming
                    </span>
                  </div>
                  <div className="relative h-44 overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_52%)]">
                    <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-300/30 bg-indigo-500/20 shadow-[0_0_45px_rgba(99,102,241,0.35)]" />
                    <div className="absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />
                    <div className="absolute left-1/2 top-1/2 h-[70%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-purple-300/40 to-transparent" />
                    {swarmTopology.map((node) => (
                      <div
                        key={node.agent}
                        className={`absolute ${node.position} rounded-xl border px-3 py-2 text-xs shadow-lg shadow-black/20 backdrop-blur ${node.tone}`}
                      >
                        <p className="font-semibold">{node.agent}</p>
                        <p className="text-[10px] opacity-75">{node.role}</p>
                      </div>
                    ))}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-xs font-semibold text-white">Semantic Bus</p>
                      <p className="font-mono text-[10px] text-indigo-200">42ms p95</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {controlPlaneSignals.map((signal) => (
                    <div key={signal.label} className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-400">{signal.label}</span>
                        <span className={signal.tone}>{signal.value}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300" style={{ width: signal.bar }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-white/10 bg-[#1e293b]/75 p-5 shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-400/40"
                  style={{ animation: 'fadeUp 0.36s ease' }}
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
              className={`fixed z-40 h-full w-72 border-r border-white/10 bg-slate-900/95 p-5 backdrop-blur transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
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

              <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/55 p-4 text-xs text-slate-400">
                <div className="flex items-center justify-between text-slate-200">
                  <span>Semantic bus</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-200">
                    Online
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-mono text-slate-100">42ms</p>
                    <p>P95 route</p>
                  </div>
                  <div>
                    <p className="font-mono text-slate-100">9.4k</p>
                    <p>msg/min</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                  {consoleHealth.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-2">
                      <span>{item.label}</span>
                      <span className="font-mono text-slate-100">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setInConsole(false)
                  setSidebarOpen(false)
                }}
                className="mt-4 w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-slate-200 transition hover:border-indigo-300/40 hover:text-white md:hidden"
              >
                Back to landing
              </button>
            </aside>

            <main className="w-full p-4 md:p-8">
              <header className="mb-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open navigation"
                  className="rounded-xl border border-white/10 bg-slate-800 p-2 md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="min-w-[220px] md:ml-1">
                  <p className="text-sm font-semibold text-slate-100">{tabMeta[activeTab].title}</p>
                  <p className="text-xs text-slate-400">{tabMeta[activeTab].description}</p>
                </div>
                <div className="hidden items-center gap-2 text-sm md:flex">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">
                    Cluster healthy
                  </span>
                  <span className="text-slate-400">Control plane · dark mode · consensus online</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setInConsole(false)}
                    className="hidden rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:border-indigo-300/40 hover:text-white md:block"
                  >
                    Back to landing
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/90 px-3 py-2 text-sm backdrop-blur">
                    <UserCircle2 className="h-4 w-4 text-indigo-300" />
                    Settings
                  </button>
                </div>
              </header>

              <section className="mb-5 grid gap-2 sm:grid-cols-3">
                {quickSignals.map((signal) => (
                  <article
                    key={signal.label}
                    className={`rounded-xl border px-3 py-2 backdrop-blur ${signal.tone}`}
                  >
                    <p className="text-[11px] uppercase tracking-wide opacity-80">{signal.label}</p>
                    <p className="mt-0.5 text-sm font-semibold">{signal.value}</p>
                  </article>
                ))}
              </section>

              <section className="mb-5 rounded-xl border border-white/10 bg-slate-800/60 p-3 text-xs text-slate-300 backdrop-blur">
                <p className="inline-flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
                  <span className="text-slate-200">Guardian Notice:</span>
                  Elevated write traffic on migration cluster. Fallback routes are armed.
                </p>
              </section>

              <div
                className={tabVisible ? 'opacity-100 transition-opacity duration-200' : 'opacity-0 transition-opacity duration-150'}
                style={tabVisible ? { animation: 'fadeUp 0.24s ease' } : undefined}
              >
                {renderTab()}
              </div>
            </main>
          </div>
        )}
      </div>
      <style jsx global>{`
        html {
          color-scheme: dark;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
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
    </>
  )
}
