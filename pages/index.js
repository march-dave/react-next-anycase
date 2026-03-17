import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Gauge,
  LayoutGrid,
  Menu,
  MessageSquare,
  Network,
  Shield,
  Terminal,
  Users,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Network },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
];

const statCards = [
  { label: 'Active Agents', value: '27', delta: '+4.2%', icon: Bot },
  { label: 'Messages/min', value: '842', delta: '+11.7%', icon: MessageSquare },
  { label: 'Consensus Rate', value: '97.3%', delta: '+0.8%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '1.92M', delta: '-3.1%', icon: Cpu },
];

const loadData = [
  { time: '09:00', load: 46, tokens: 32 },
  { time: '10:00', load: 58, tokens: 49 },
  { time: '11:00', load: 63, tokens: 58 },
  { time: '12:00', load: 55, tokens: 46 },
  { time: '13:00', load: 74, tokens: 69 },
  { time: '14:00', load: 81, tokens: 72 },
  { time: '15:00', load: 65, tokens: 60 },
];

const terminalEvents = [
  '[INFO] Atlas-Orchestrator connected to semantic bus.',
  '[INFO] Codex-Dev synced branch migration/api-v2.',
  '[WARN] Sentry-Sec observed elevated latency on region eu-west-2.',
  '[INFO] Guardian Rail policy update propagated.',
  '[INFO] Consensus achieved for TASK-1442 in 1.6s.',
];

const channels = ['#migration-api-v2', '#security-audit', '#billing-refactor', '#ops-incidents'];

const initialMessages = [
  {
    id: 1,
    type: 'text',
    author: 'Atlas-Orchestrator',
    body: 'Routing new deployment plan to the swarm. Validate environment drift before execution.',
  },
  {
    id: 2,
    type: 'code',
    author: 'Codex-Dev',
    body: '```ts\nconst decision = await consensus.vote(taskId, { quorum: 0.66 });\nif (decision.accepted) orchestrator.dispatch(taskId);\n```',
  },
  {
    id: 3,
    type: 'alert',
    author: 'System',
    body: 'Guardian Rails flagged an unverified migration script. Manual approval required.',
  },
];

const boardColumns = {
  Pending: [
    { id: 'TASK-1407', title: 'Index usage audit', agent: 'Atlas-Orchestrator' },
    { id: 'TASK-1421', title: 'Schema diff report', agent: 'Codex-Dev' },
  ],
  'In Progress': [
    { id: 'TASK-1436', title: 'Policy sandbox replay', agent: 'Sentry-Sec' },
  ],
  Completed: [
    { id: 'TASK-1398', title: 'Cost anomaly detector tuning', agent: 'FinOps-AI' },
  ],
  'Needs Consensus': [
    { id: 'TASK-1442', title: 'Cross-region failover plan', agent: 'Atlas-Orchestrator', votes: 1, total: 3 },
    { id: 'TASK-1451', title: 'PII scrubber rollout', agent: 'Sentry-Sec', votes: 2, total: 4 },
  ],
};

const fleet = [
  { name: 'Atlas-Orchestrator', status: 'Idle', role: 'Coordinator', specialization: 'Task routing', uptime: '99.99%' },
  { name: 'Codex-Dev', status: 'Busy', role: 'Builder', specialization: 'Code synthesis', uptime: '99.71%' },
  { name: 'Sentry-Sec', status: 'Error', role: 'Guardian', specialization: 'Security analysis', uptime: '96.84%' },
  { name: 'Vector-Research', status: 'Idle', role: 'Analyst', specialization: 'Knowledge retrieval', uptime: '99.54%' },
  { name: 'FinOps-AI', status: 'Busy', role: 'Optimizer', specialization: 'Cost governance', uptime: '98.96%' },
  { name: 'Pulse-Monitor', status: 'Idle', role: 'Observer', specialization: 'Health checks', uptime: '99.88%' },
];

const statusStyle = {
  Idle: 'bg-emerald-400',
  Busy: 'bg-amber-400',
  Error: 'bg-red-500',
};

export default function Home() {
  const [enteredConsole, setEnteredConsole] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [isSimulating, setIsSimulating] = useState(false);

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );

  const simulateActivity = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    const queued = [
      {
        id: Date.now() + 1,
        type: 'text',
        author: 'Vector-Research',
        body: 'Correlated 17 historical incidents. Recommending staged rollout with 10% traffic canary.',
      },
      {
        id: Date.now() + 2,
        type: 'code',
        author: 'Codex-Dev',
        body: '```bash\nconsendus deploy --task TASK-1451 --canary 10 --guardrails strict\n```',
      },
      {
        id: Date.now() + 3,
        type: 'alert',
        author: 'System',
        body: 'Consensus vote updated: TASK-1451 now at 3/4 approvals.',
      },
    ];

    for (const msg of queued) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessages((prev) => [...prev, msg]);
    }
    setIsSimulating(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {!enteredConsole ? (
        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-14 md:px-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-indigo-200">
            <Activity className="h-4 w-4" /> Autonomous Infrastructure Platform
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">Orchestrate Your Agent Swarm</h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
              </p>
              <button
                onClick={() => setEnteredConsole(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-400"
              >
                Access Console <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <div className="mb-4 flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm text-emerald-300">
{`const swarm = new Consendus.Swarm({
  bus: 'semantic://cluster-alpha',
  consensus: { quorum: 0.67, timeoutMs: 1200 },
  rails: ['security', 'cost', 'latency'],
});

await swarm.orchestrate('deploy-v2', {
  agents: ['Atlas-Orchestrator', 'Codex-Dev', 'Sentry-Sec'],
});`}
              </pre>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Semantic Bus', icon: MessageSquare, text: 'Shared communication fabric for agent-to-agent context exchange.' },
              { title: 'Consensus Engine', icon: Gauge, text: 'Deterministic voting and quorum checks for safe autonomous action.' },
              { title: 'Guardian Rails', icon: Shield, text: 'Policy-aware runtime safeguards for security, cost, and compliance.' },
            ].map((item) => (
              <article key={item.title} className="rounded-xl border border-white/10 bg-slate-800/80 p-5 backdrop-blur-sm">
                <item.icon className="h-5 w-5 text-indigo-300" />
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex min-h-screen">
          <aside
            className={`fixed z-20 h-full w-72 border-r border-white/10 bg-slate-900/95 p-5 backdrop-blur-sm transition-transform duration-300 md:static md:translate-x-0 ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Consendus Console</h2>
              <button className="md:hidden" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                    activeTab === item.id ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 p-4 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <button className="rounded-lg border border-white/10 p-2 md:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden text-sm text-slate-400 md:block">Environment: Production • {currentDate}</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">dev@consendus.ai</div>
            </div>

            <div key={activeTab} className="animate-fade-in">
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => (
                      <div key={card.label} className="rounded-xl border border-white/10 bg-slate-800 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-400">{card.label}</p>
                          <card.icon className="h-4 w-4 text-indigo-300" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                        <p className="mt-1 text-xs text-emerald-300">{card.delta} vs last hour</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-800 p-5">
                    <h3 className="mb-4 font-medium text-white">System Load vs Token Consumption</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={loadData}>
                          <defs>
                            <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.65} />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.65} />
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0.04} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="time" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                          <Area type="monotone" dataKey="load" stroke="#818cf8" fill="url(#loadGrad)" />
                          <Area type="monotone" dataKey="tokens" stroke="#34d399" fill="url(#tokenGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-800 p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                      <Terminal className="h-4 w-4 text-emerald-300" /> Terminal Log
                    </div>
                    <div className="max-h-48 space-y-2 overflow-auto rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-300">
                      {terminalEvents.map((event, index) => (
                        <p key={event} className="opacity-90" style={{ animationDelay: `${index * 0.06}s` }}>
                          {event}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comms' && (
                <div className="grid gap-4 lg:grid-cols-[260px,1fr]">
                  <div className="rounded-xl border border-white/10 bg-slate-800 p-4">
                    <h3 className="text-sm font-medium text-slate-300">Channels</h3>
                    <div className="mt-3 space-y-1">
                      {channels.map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setActiveChannel(ch)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                            activeChannel === ch ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-800 p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-medium text-white">{activeChannel}</h3>
                      <button
                        onClick={simulateActivity}
                        disabled={isSimulating}
                        className="rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSimulating ? 'Simulating...' : 'Simulate Activity'}
                      </button>
                    </div>
                    <div className="max-h-[500px] space-y-3 overflow-auto pr-1">
                      {messages.map((msg) => (
                        <div key={msg.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
                          <p className="mb-2 text-xs text-slate-400">{msg.author}</p>
                          {msg.type === 'alert' ? (
                            <p className="flex items-start gap-2 text-sm text-amber-300">
                              <AlertTriangle className="mt-0.5 h-4 w-4" />
                              <span>{msg.body}</span>
                            </p>
                          ) : msg.type === 'code' ? (
                            <pre className="overflow-x-auto rounded-md bg-slate-950 p-3 font-mono text-xs text-emerald-300">{msg.body}</pre>
                          ) : (
                            <p className="text-sm text-slate-200">{msg.body}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orchestration' && (
                <div className="grid gap-4 xl:grid-cols-4">
                  {Object.entries(boardColumns).map(([column, tasks]) => (
                    <div key={column} className="rounded-xl border border-white/10 bg-slate-800 p-4">
                      <h3 className="mb-4 text-sm font-semibold text-slate-200">{column}</h3>
                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <div key={task.id} className="rounded-lg border border-white/10 bg-slate-900 p-3">
                            <p className="font-mono text-xs text-indigo-300">{task.id}</p>
                            <p className="mt-1 text-sm text-white">{task.title}</p>
                            <p className="mt-2 text-xs text-slate-400">{task.agent}</p>
                            {column === 'Needs Consensus' && (
                              <div className="mt-3">
                                <div className="mb-1 flex justify-between text-xs text-slate-300">
                                  <span>Votes</span>
                                  <span>
                                    {task.votes}/{task.total} Votes
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-700">
                                  <div
                                    className="h-2 rounded-full bg-purple-500"
                                    style={{ width: `${(task.votes / task.total) * 100}%` }}
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
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {fleet.map((agent) => (
                    <div key={agent.name} className="rounded-xl border border-white/10 bg-slate-800 p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-base font-semibold text-white">{agent.name}</h3>
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${statusStyle[agent.status]}`} />
                      </div>
                      <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between gap-3 text-slate-300"><dt>Role</dt><dd>{agent.role}</dd></div>
                        <div className="flex justify-between gap-3 text-slate-300"><dt>Specialization</dt><dd>{agent.specialization}</dd></div>
                        <div className="flex justify-between gap-3 text-slate-300"><dt>Uptime</dt><dd className="font-mono">{agent.uptime}</dd></div>
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
