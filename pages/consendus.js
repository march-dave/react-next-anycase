import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Command,
  LayoutGrid,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tasksByState = useMemo(() => {
    return taskStates.reduce((acc, state) => {
      acc[state] = tasks.filter((task) => task.state === state)
      return acc
    }, {})
  }, [])

  useEffect(() => {
    if (connectionState !== 'verifying') return

    const verifyTimer = setTimeout(() => {
      setConnectionState('success')
    }, 1400)

    const redirectTimer = setTimeout(() => {
      setShowModal(false)
      setView('app')
      setActiveTab('dashboard')
      setConnectionState('select')
      setSelectedBank('')
    }, 2400)

    return () => {
      clearTimeout(verifyTimer)
      clearTimeout(redirectTimer)
    }
  }, [connectionState])

  const handleGetStarted = () => {
    setShowModal(true)
    setConnectionState('select')
  }

  const handleSelectBank = (bank) => {
    setSelectedBank(bank)
    setConnectionState('verifying')
  }

  const handleSend = () => {
    if (!chatInput.trim() || isTyping) return
    const nextId = chatMessages.length + 1
    const userMessage = {
      id: nextId,
      author: 'You',
      role: 'user',
      content: chatInput.trim(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)

    const response = aiResponses[nextId % aiResponses.length]
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          author: 'Supernormal',
          role: 'assistant',
          content: response,
        },
      ])
      setIsTyping(false)
    }, 900)
  }

  const chartTooltipStyle = useMemo(
    () => ({
      backgroundColor: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '12px',
      color: '#e2e8f0',
    }),
    []
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {view === 'landing' ? (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6366f133,transparent_60%)]" />
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              Consendus.ai
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Orchestrate Your Agent Swarm
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <button
                onClick={() => setView('console')}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Access Console
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                <span className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5 text-indigo-200" />
                  Settings
                </span>
              </button>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-900/80 p-4 text-left text-xs text-emerald-200 sm:text-sm">
{`import { Consendus } from 'consendus'

const swarm = new Consendus.Swarm({
  quorum: 3,
  agents: ['Atlas', 'Codex', 'Sentry'],
  consensus: 'weighted',
  guardRails: true,
})

swarm.deploy('migration-api-v2')`}
              </pre>
            </div>

            <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'Semantic Bus',
                  copy: 'Real-time routing layer for agent-to-agent messaging.',
                },
                {
                  title: 'Consensus Engine',
                  copy: 'Multi-agent voting with quorum enforcement and audit trails.',
                },
                {
                  title: 'Guardian Rails',
                  copy: 'Policy guardrails that intercept unsafe actions automatically.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-white/10 bg-slate-800/60 p-4 text-left shadow-xl shadow-black/30"
                >
                  <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-xs text-slate-300">{feature.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen">
          <div
            className={`fixed inset-0 z-30 bg-black/60 transition-opacity sm:hidden ${
              sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-white/10 bg-slate-900/95 p-6 transition-transform sm:static sm:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consendus</p>
                  <p className="text-sm font-semibold text-white">Swarm Console</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg border border-white/10 p-2 text-slate-300 sm:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      activeTab === item.id
                        ? 'bg-indigo-500/20 text-indigo-200'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-10 rounded-xl border border-white/10 bg-slate-800/70 p-4 text-xs text-slate-300">
              <p className="text-slate-400">Swarm Health</p>
              <p className="mt-2 text-sm text-white">98.7% uptime</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg border border-white/10 p-2 text-slate-300 sm:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-white">{navigation.find((nav) => nav.id === activeTab)?.label}</p>
                  <p className="text-xs text-slate-400">Autonomous swarm orchestration</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
                  <Bot className="mr-2 inline-block h-3 w-3 text-indigo-300" />
                  Atlas-Orchestrator
                </span>
                <button className="rounded-full border border-white/10 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
                  Settings
                </button>
              </div>
            </header>

            <main className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {activeTab === 'overview' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-slate-800/70 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-2xl font-semibold text-white">{stat.value}</p>
                          <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-slate-200">System Load vs Token Consumption</p>
                        <span className="text-xs text-slate-400">Last 24h</span>
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Tooltip
                              contentStyle={{
                                background: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 12,
                                color: '#fff',
                              }}
                              labelStyle={{ color: '#94a3b8' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="load"
                              stroke="#6366f1"
                              strokeWidth={2}
                              fill="url(#load)"
                            />
                            <Area
                              type="monotone"
                              dataKey="tokens"
                              stroke="#10b981"
                              strokeWidth={2}
                              fill="url(#tokens)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

            {activeTab === 'portfolio' && (
              <section className="space-y-6">
                <div className="rounded-2xl bg-[#131316] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Strategy</p>
                  <h2 className="mt-3 text-2xl font-semibold">Autonomous Index</h2>
                  <p className="mt-2 text-sm text-white/60">
                    An endowment-model portfolio mixing public markets, private credit, and disciplined
                    rebalancing.
                  </p>
                </div>

              {activeTab === 'comms' && (
                <section className="grid gap-6 lg:grid-cols-[240px,1fr] animate-fade-in">
                  <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Channels</p>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      {channels.map((channel) => (
                        <div
                          key={channel}
                          className="rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2"
                        >
                          {channel}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">#migration-api-v2</p>
                        <p className="text-xs text-slate-400">Agents coordinating in real time.</p>
                      </div>
                      <button
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSimulating ? 'Simulating…' : 'Simulate Activity'}
                      </button>
                    </div>
                    <div className="flex-1 space-y-3 text-xs text-white/70">
                      {allocationData.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
                            <span>{entry.name}</span>
                          </div>
                          <span className="font-mono text-white">{entry.value}%</span>
                        </div>
                      ))}
                      {showTyping && (
                        <div className="rounded-lg border border-white/10 bg-slate-900/80 p-3 text-xs text-slate-300">
                          <span className="font-mono">[typing]</span>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-150" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-300" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'orchestration' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="grid gap-4 lg:grid-cols-4">
                    {taskStates.map((state) => (
                      <div
                        key={state}
                        className="rounded-xl border border-white/10 bg-slate-800/70 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{state}</p>
                        <div className="mt-4 space-y-3">
                          {tasksByState[state].map((task) => (
                            <div
                              key={task.title}
                              className="rounded-lg border border-white/10 bg-slate-900/70 p-3"
                            >
                              <p className="text-sm text-white">{task.title}</p>
                              <p className="mt-1 text-xs text-slate-400">{task.agent}</p>
                              {task.state === 'Needs Consensus' && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>Consensus</span>
                                    <span>
                                      {task.votes}/{task.totalVotes} Votes
                                    </span>
                                  </div>
                                  <div className="mt-2 h-2 rounded-full bg-white/10">
                                    <div
                                      className="h-full rounded-full bg-purple-400"
                                      style={{
                                        width: `${Math.round(
                                          (task.votes / task.totalVotes) * 100
                                        )}%`,
                                      }}
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
                </section>
              )}

              {activeTab === 'fleet' && (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 animate-fade-in">
                  {agents.map((agent) => (
                    <div
                      key={agent.name}
                      className="rounded-xl border border-white/10 bg-slate-800/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{agent.name}</p>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            agent.status === 'idle'
                              ? 'bg-emerald-400'
                              : agent.status === 'busy'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                          }`}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{agent.role}</p>
                      <div className="mt-4 grid gap-2 text-xs text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>Specialization</span>
                          <span className="text-white">{agent.specialization}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Uptime</span>
                          <span className="text-white">{agent.uptime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </main>

          <nav className="fixed bottom-6 left-1/2 z-10 w-[90%] max-w-sm -translate-x-1/2">
            <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#131316]/90 px-6 py-3 backdrop-blur">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 text-xs ${
                  activeTab === 'dashboard' ? 'text-white' : 'text-white/50'
                }`}
              >
                <Wallet className="h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center gap-1 text-xs ${
                  activeTab === 'chat' ? 'text-white' : 'text-white/50'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex flex-col items-center gap-1 text-xs ${
                  activeTab === 'portfolio' ? 'text-white' : 'text-white/50'
                }`}
              >
                <PieChart className="h-5 w-5" />
                Portfolio
              </button>
            </div>
          </nav>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#131316] p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Connect your bank</p>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                Close
              </button>
            </div>

            {connectionState === 'select' && (
              <div className="mt-4 space-y-3">
                {bankList.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => handleSelectBank(bank)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/80 transition hover:border-indigo-400/40"
                  >
                    {bank}
                    <ChevronRight className="h-4 w-4 text-white/50" />
                  </button>
                ))}
              </div>
            )}

            {connectionState === 'verifying' && (
              <div className="mt-6 space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                  <Zap className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Verifying credentials...</p>
                  <p className="mt-1 text-xs text-white/50">{selectedBank} linked securely.</p>
                </div>
              </div>
            )}

            {connectionState === 'success' && (
              <div className="mt-6 space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Connection secure</p>
                  <p className="mt-1 text-xs text-white/50">Redirecting to your dashboard.</p>
                </div>
              </div>
            )}
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
      `}</style>
    </div>
  )
}
