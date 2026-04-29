import { useMemo, useState } from 'react';
import {
  Activity,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Command,
  Gauge,
  LayoutGrid,
  Menu,
  MessageSquare,
  PanelLeft,
  ShieldCheck,
  TriangleAlert,
  UserCircle2,
  Workflow,
} from 'lucide-react';

type View = 'overview' | 'comms' | 'orchestration' | 'fleet';
type AgentStatus = 'idle' | 'busy' | 'error';

type Message = {
  id: string;
  channel: string;
  agent: string;
  type: 'text' | 'code' | 'system';
  content: string;
  timestamp: string;
};

type Task = {
  id: string;
  title: string;
  agent: string;
  state: 'Pending' | 'In Progress' | 'Completed' | 'Needs Consensus';
  votes?: { current: number; target: number };
};

const featureCards = [
  {
    title: 'Semantic Bus',
    description: 'Low-latency event mesh for agent-to-agent context handoffs and memory routing.',
    icon: MessageSquare,
  },
  {
    title: 'Consensus Engine',
    description: 'Policy-aware voting, tie-breakers, and quorum guarantees for critical decisions.',
    icon: Workflow,
  },
  {
    title: 'Guardian Rails',
    description: 'Runtime safety checks with escalation paths and immutable audit trails.',
    icon: ShieldCheck,
  },
];

const stats = [
  { label: 'Active Agents', value: '42', icon: Bot, tone: 'text-emerald-300' },
  { label: 'Messages/min', value: '1,284', icon: MessageSquare, tone: 'text-indigo-300' },
  { label: 'Consensus Rate', value: '97.3%', icon: CheckCircle2, tone: 'text-emerald-300' },
  { label: 'Token Usage', value: '12.6M', icon: Gauge, tone: 'text-amber-300' },
];

const loadSeries = [
  { time: '00:00', systemLoad: 35, tokenConsumption: 22 },
  { time: '02:00', systemLoad: 40, tokenConsumption: 28 },
  { time: '04:00', systemLoad: 46, tokenConsumption: 31 },
  { time: '06:00', systemLoad: 53, tokenConsumption: 35 },
  { time: '08:00', systemLoad: 64, tokenConsumption: 44 },
  { time: '10:00', systemLoad: 72, tokenConsumption: 52 },
  { time: '12:00', systemLoad: 67, tokenConsumption: 49 },
  { time: '14:00', systemLoad: 61, tokenConsumption: 43 },
  { time: '16:00', systemLoad: 58, tokenConsumption: 40 },
  { time: '18:00', systemLoad: 63, tokenConsumption: 45 },
  { time: '20:00', systemLoad: 74, tokenConsumption: 54 },
  { time: '22:00', systemLoad: 69, tokenConsumption: 50 },
];

const systemEvents = [
  '[INFO] Atlas-Orchestrator connected to semantic bus.',
  '[INFO] Codex-Dev pulled migration schema diff.',
  '[WARN] Elevated latency detected in #migration-api-v2.',
  '[INFO] Sentry-Sec validated guardrail policy checksum.',
  '[ACTION] Consensus vote opened for task ORCH-214.',
  '[INFO] Quorum achieved. Execution plan promoted to active.',
];

const channels = ['#migration-api-v2', '#security-audit', '#token-optimizer', '#incident-warroom'];

const initialMessages: Message[] = [
  {
    id: 'm1',
    channel: '#migration-api-v2',
    agent: 'Atlas-Orchestrator',
    type: 'text',
    content: 'Starting API v2 migration swarm. Delegating schema checks to Codex-Dev.',
    timestamp: '09:12',
  },
  {
    id: 'm2',
    channel: '#migration-api-v2',
    agent: 'Codex-Dev',
    type: 'code',
    content:
      '```ts\nconst plan = await swarm.dispatch({\n  objective: "migrate-v2",\n  constraints: ["zero-downtime", "p95<250ms"],\n});\n```',
    timestamp: '09:13',
  },
  {
    id: 'm3',
    channel: '#migration-api-v2',
    agent: 'Sentry-Sec',
    type: 'system',
    content: 'Policy alert: missing scope claim in 2 endpoint manifests. Blocking promotion.',
    timestamp: '09:14',
  },
];

const tasks: Task[] = [
  { id: 'ORCH-211', title: 'Generate API v2 compatibility matrix', agent: 'Codex-Dev', state: 'Completed' },
  { id: 'ORCH-212', title: 'Run load test replay against canary shard', agent: 'Atlas-Orchestrator', state: 'In Progress' },
  {
    id: 'ORCH-214',
    title: 'Approve production cutover window',
    agent: 'Consensus-Captain',
    state: 'Needs Consensus',
    votes: { current: 1, target: 3 },
  },
  { id: 'ORCH-215', title: 'Patch auth guard in edge worker', agent: 'Sentry-Sec', state: 'Pending' },
];

const fleet: Array<{ name: string; role: string; specialization: string; uptime: string; status: AgentStatus }> = [
  { name: 'Atlas-Orchestrator', role: 'Coordinator', specialization: 'Task scheduling', uptime: '13d 4h', status: 'idle' },
  { name: 'Codex-Dev', role: 'Builder', specialization: 'Code generation', uptime: '13d 4h', status: 'busy' },
  { name: 'Sentry-Sec', role: 'Defender', specialization: 'Policy enforcement', uptime: '13d 4h', status: 'error' },
  { name: 'Nimbus-Data', role: 'Analyst', specialization: 'Vector retrieval', uptime: '11d 9h', status: 'busy' },
];

const navItems: Array<{ id: View; label: string; icon: any }> = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Workflow },
  { id: 'fleet', label: 'Agent Fleet', icon: Bot },
];

export default function App() {
  const [isConsole, setIsConsole] = useState(false);
  const [activeView, setActiveView] = useState<View>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [simulating, setSimulating] = useState(false);

  const filteredMessages = useMemo(() => messages.filter((msg) => msg.channel === activeChannel), [activeChannel, messages]);

  const simulateActivity = () => {
    if (simulating) return;

    const generated: Message[] = [
      {
        id: crypto.randomUUID(),
        channel: activeChannel,
        agent: 'Nimbus-Data',
        type: 'text',
        content: 'Cross-check complete. 3 services still reference deprecated serializer.',
        timestamp: '09:16',
      },
      {
        id: crypto.randomUUID(),
        channel: activeChannel,
        agent: 'Consensus-Captain',
        type: 'code',
        content:
          '```md\n### Consensus Proposal\n- Shift canary to 25%\n- Keep rollback threshold at 2%\n- Require Sentry-Sec sign-off\n```',
        timestamp: '09:17',
      },
      {
        id: crypto.randomUUID(),
        channel: activeChannel,
        agent: 'System',
        type: 'system',
        content: 'Quorum monitor engaged: waiting on 2 additional votes.',
        timestamp: '09:17',
      },
    ];

    setSimulating(true);
    generated.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        if (index === generated.length - 1) setSimulating(false);
      }, 400 * (index + 1));
    });
  };

  if (!isConsole) {
    return (
      <div className="min-h-screen bg-slate-900 px-6 py-8 text-slate-100">
        <div className="mx-auto max-w-6xl">
          <header className="mb-20 flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/70 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <Command className="text-indigo-400" />
              Consendus<span className="text-indigo-400">.ai</span>
            </div>
            <button
              onClick={() => setIsConsole(true)}
              className="rounded-lg border border-indigo-400/40 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/35"
            >
              Access Console
            </button>
          </header>

          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                <Activity size={14} className="text-purple-400" />
                Autonomous Infrastructure
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Orchestrate Your Agent Swarm</h1>
              <p className="mt-6 max-w-xl text-lg text-slate-300">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-800/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                <PanelLeft size={16} className="text-emerald-400" />
                swarm.config.ts
              </div>
              <pre className="overflow-auto rounded-lg bg-slate-900/80 p-4 font-mono text-sm text-emerald-300">
{`const swarm = new Consendus.Swarm({
  workspace: "prod-core",
  bus: "semantic://mesh/us-east-1",
  consensus: {
    quorum: 3,
    mode: "weighted-majority",
  },
  guardians: [
    "policy-sentry",
    "latency-shield",
  ],
});`}
              </pre>
            </div>
          </section>

          <section className="mt-14 grid gap-5 md:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-xl border border-white/10 bg-slate-800/70 p-5 backdrop-blur">
                  <Icon className="mb-4 text-indigo-300" />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                </article>
              );
            })}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 z-30 border-r border-white/10 bg-slate-800/95 p-3 backdrop-blur transition-all md:static md:translate-x-0 ${collapsed ? 'w-[84px]' : 'w-64'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
            <div className={`items-center gap-2 ${collapsed ? 'hidden' : 'flex'}`}>
              <Command className="text-indigo-400" size={18} />
              <span className="font-semibold">Consendus.ai</span>
            </div>
            <button onClick={() => setCollapsed((prev) => !prev)} className="rounded-md p-1.5 hover:bg-white/10">
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveView(id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  activeView === id ? 'bg-indigo-500/25 text-indigo-100' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                {!collapsed && label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 md:ml-0">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
            <button onClick={() => setSidebarOpen((prev) => !prev)} className="rounded-md p-2 hover:bg-white/10 md:hidden">
              <Menu size={18} />
            </button>
            <h2 className="text-lg font-semibold capitalize">{activeView}</h2>
            <button className="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10">
              <UserCircle2 />
            </button>
          </header>

          <main className="view-fade p-4 md:p-6">
            {activeView === 'overview' && <OverviewView />}
            {activeView === 'comms' && (
              <CommsView
                channels={channels}
                activeChannel={activeChannel}
                setActiveChannel={setActiveChannel}
                messages={filteredMessages}
                onSimulate={simulateActivity}
                simulating={simulating}
              />
            )}
            {activeView === 'orchestration' && <OrchestrationView />}
            {activeView === 'fleet' && <FleetView />}
          </main>
        </div>
      </div>
    </div>
  );
}

function OverviewView() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-xl border border-white/10 bg-slate-800/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">{stat.label}</p>
                <Icon size={16} className={stat.tone} />
              </div>
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
            </article>
          );
        })}
      </div>

      <article className="rounded-xl border border-white/10 bg-slate-800/80 p-4">
        <h3 className="mb-4 font-semibold">System Load vs Token Consumption</h3>
        <SimpleAreaChart />
      </article>

      <article className="rounded-xl border border-white/10 bg-slate-800/80 p-4">
        <h3 className="mb-3 font-semibold">Terminal Log</h3>
        <div className="max-h-52 space-y-2 overflow-y-auto rounded-lg bg-slate-900/80 p-3 font-mono text-sm">
          {systemEvents.map((event) => {
            const tone = event.includes('[WARN]') ? 'text-amber-300' : event.includes('[ACTION]') ? 'text-purple-300' : 'text-emerald-300';
            return (
              <p key={event} className={tone}>
                {event}
              </p>
            );
          })}
        </div>
      </article>
    </section>
  );
}


function buildPath(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function SimpleAreaChart() {
  const width = 920;
  const height = 230;
  const system = loadSeries.map((item) => item.systemLoad);
  const tokens = loadSeries.map((item) => item.tokenConsumption);
  const systemPath = buildPath(system, width, height);
  const tokenPath = buildPath(tokens, width, height);

  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
      <svg viewBox={`0 0 ${width} ${height + 30}`} className="h-[300px] w-full">
        <path d={`${systemPath} L ${width} ${height} L 0 ${height} Z`} fill="rgba(99,102,241,0.22)" />
        <path d={`${tokenPath} L ${width} ${height} L 0 ${height} Z`} fill="rgba(16,185,129,0.2)" />
        <path d={systemPath} fill="none" stroke="#818cf8" strokeWidth={3} />
        <path d={tokenPath} fill="none" stroke="#34d399" strokeWidth={3} />

        {loadSeries.map((point, index) => {
          const x = (index / (loadSeries.length - 1)) * width;
          return (
            <text key={point.time} x={x} y={height + 18} textAnchor="middle" fill="#94a3b8" fontSize="12">
              {point.time}
            </text>
          );
        })}
      </svg>
      <div className="mt-2 flex gap-5 text-xs text-slate-300">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-indigo-400" />System Load</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Token Consumption</span>
      </div>
    </div>
  );
}

function CommsView({
  channels,
  activeChannel,
  setActiveChannel,
  messages,
  onSimulate,
  simulating,
}: {
  channels: string[];
  activeChannel: string;
  setActiveChannel: (channel: string) => void;
  messages: Message[];
  onSimulate: () => void;
  simulating: boolean;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[220px,1fr]">
      <aside className="rounded-xl border border-white/10 bg-slate-800/80 p-3">
        <h3 className="mb-3 text-sm font-semibold text-slate-300">Channels</h3>
        <div className="space-y-1">
          {channels.map((channel) => (
            <button
              key={channel}
              onClick={() => setActiveChannel(channel)}
              className={`w-full rounded-lg px-2 py-2 text-left text-sm ${
                channel === activeChannel ? 'bg-indigo-500/25 text-indigo-100' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </aside>

      <article className="rounded-xl border border-white/10 bg-slate-800/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{activeChannel}</h3>
          <button
            onClick={onSimulate}
            disabled={simulating}
            className="rounded-lg border border-purple-400/40 bg-purple-500/20 px-3 py-2 text-sm text-purple-100 transition hover:bg-purple-500/35 disabled:opacity-50"
          >
            {simulating ? 'Simulating...' : 'Simulate Activity'}
          </button>
        </div>

        <div className="max-h-[62vh] space-y-3 overflow-y-auto pr-1">
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>{message.agent}</span>
                <span>{message.timestamp}</span>
              </div>
              {message.type === 'code' ? (
                <pre className="rounded-md bg-slate-950 p-3 font-mono text-sm text-emerald-300">{message.content}</pre>
              ) : (
                <p className={message.type === 'system' ? 'text-amber-200' : 'text-slate-100'}>{message.content}</p>
              )}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function OrchestrationView() {
  const columns: Task['state'][] = ['Pending', 'In Progress', 'Needs Consensus', 'Completed'];

  return (
    <section className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <article key={column} className="rounded-xl border border-white/10 bg-slate-800/80 p-3">
          <h3 className="mb-3 font-semibold">{column}</h3>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.state === column)
              .map((task) => (
                <div key={task.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">{task.id}</p>
                  <p className="mt-1 text-sm font-medium">{task.title}</p>
                  <p className="mt-1 text-xs text-slate-300">Assigned: {task.agent}</p>
                  {task.state === 'Needs Consensus' && task.votes && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                        <span>Votes</span>
                        <span>
                          {task.votes.current}/{task.votes.target} Votes
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-700">
                        <div
                          className="h-full rounded-full bg-purple-400"
                          style={{ width: `${(task.votes.current / task.votes.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </article>
      ))}
    </section>
  );
}

function FleetView() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {fleet.map((agent) => (
        <article key={agent.name} className="rounded-xl border border-white/10 bg-slate-800/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">{agent.name}</h3>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                agent.status === 'idle' ? 'bg-emerald-400' : agent.status === 'busy' ? 'bg-amber-400' : 'bg-rose-400'
              }`}
            />
          </div>
          <p className="text-sm text-slate-300">Role: {agent.role}</p>
          <p className="text-sm text-slate-300">Specialization: {agent.specialization}</p>
          <p className="mt-2 font-mono text-xs text-emerald-300">Uptime: {agent.uptime}</p>
        </article>
      ))}
      <article className="rounded-xl border border-dashed border-white/20 bg-slate-800/40 p-4 text-sm text-slate-300">
        <TriangleAlert className="mb-2 text-amber-300" size={16} />
        Agent enrollment is mock-only in this prototype build.
      </article>
    </section>
  );
}
