import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  PieChart,
  TrendingUp,
  Wallet,
  Wifi,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const bankList = ['Goldman Sachs', 'JPMorgan Chase', 'Morgan Stanley', 'Citibank']

const netWorthData = [
  { month: 'Jan', value: 520000 },
  { month: 'Feb', value: 532000 },
  { month: 'Mar', value: 548000 },
  { month: 'Apr', value: 563000 },
  { month: 'May', value: 576000 },
  { month: 'Jun', value: 592000 },
  { month: 'Jul', value: 601000 },
  { month: 'Aug', value: 612000 },
  { month: 'Sep', value: 620000 },
  { month: 'Oct', value: 628000 },
  { month: 'Nov', value: 633000 },
  { month: 'Dec', value: 634300 },
]

const allocationData = [
  { name: 'VOO', value: 35, color: '#6366f1' },
  { name: 'QQQ', value: 20, color: '#818cf8' },
  { name: 'Bonds', value: 15, color: '#a5b4fc' },
  { name: 'Crypto', value: 5, color: '#c7d2fe' },
  { name: 'Private Equity', value: 10, color: '#4338ca' },
]

const holdings = [
  { name: 'S&P 500 ETF (VOO)', allocation: '35%', value: '$221,000' },
  { name: 'NASDAQ 100 (QQQ)', allocation: '20%', value: '$126,800' },
  { name: 'Core Bonds', allocation: '15%', value: '$95,000' },
  { name: 'Private Credit', allocation: '10%', value: '$63,400' },
  { name: 'Bitcoin', allocation: '5%', value: '$31,700' },
]

const insightCards = [
  {
    title: 'Smart Cash Sweep',
    description: 'Move idle cash into short-duration Treasury ETFs for +4.9% yield.',
  },
]

const initialChat = [
  {
    id: 1,
    author: 'Supernormal',
    role: 'assistant',
    content:
      "Hello. Markets have been choppy, but your Autonomous Index is up. I've analyzed your spending and have tax-loss harvesting ideas.",
  },
]

const aiResponses = [
  'Your VOO and QQQ sleeve is carrying equity risk well. I would trim 2% from crypto and redirect to short-duration Treasuries until volatility normalizes.',
  'Cash drag is elevated. We can sweep idle balances into a laddered Treasury ETF mix without compromising liquidity.',
  'Private credit yields remain attractive. I recommend holding steady while we harvest losses in the growth sleeve for tax alpha.',
]

export default function Consendus() {
  const [view, setView] = useState('onboarding')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [connectionState, setConnectionState] = useState('select')
  const [selectedBank, setSelectedBank] = useState('')
  const [chatMessages, setChatMessages] = useState(initialChat)
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const allocationTotal = useMemo(
    () => allocationData.reduce((sum, entry) => sum + entry.value, 0),
    []
  )

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

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {view === 'onboarding' ? (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
            <Zap className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Supernormal</h1>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Wealth strategy for the 1%. Now available to you.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Get Started
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Supernormal</p>
                <p className="text-sm font-semibold">AI-native wealth strategist</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#131316] px-3 py-1 text-xs text-white/70">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              Live Sync
              <Wifi className="h-3 w-3 text-emerald-300" />
            </div>
          </header>

          <main className="flex-1 space-y-6 overflow-y-auto px-6 py-6 pb-28">
            {activeTab === 'dashboard' && (
              <section className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Total net worth</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      <span className="font-mono">$634,300.07</span>
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      <TrendingUp className="h-3 w-3" />
                      +10.4% YTD
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#131316] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-white/70">Net worth growth</p>
                    <span className="text-xs text-white/40">Last 12 months</span>
                  </div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={netWorthData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="netWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{
                            background: '#0a0a0c',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 12,
                            color: '#fff',
                          }}
                          labelStyle={{ color: '#94a3b8' }}
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Net worth']}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill="url(#netWorth)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#131316] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Weekly deposit</p>
                    <p className="mt-3 text-xl font-semibold">
                      <span className="font-mono">$500</span>
                    </p>
                    <p className="mt-2 text-xs text-white/50">Automated every Monday</p>
                  </div>
                  <div className="rounded-2xl bg-[#131316] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Risk level</p>
                    <p className="mt-3 text-xl font-semibold">Aggressive</p>
                    <p className="mt-2 text-xs text-white/50">Overweight growth & alternatives</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {insightCards.map((card) => (
                    <div key={card.title} className="rounded-2xl bg-[#131316] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{card.title}</p>
                          <p className="mt-1 text-xs text-white/60">{card.description}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-indigo-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

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

                <div className="rounded-2xl bg-[#131316] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">Asset allocation</p>
                    <span className="text-xs text-white/40">Total {allocationTotal}%</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="h-40 w-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={allocationData}
                            dataKey="value"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                          >
                            {allocationData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
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
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Holdings</p>
                  {holdings.map((asset) => (
                    <div key={asset.name} className="rounded-2xl bg-[#131316] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{asset.name}</p>
                          <p className="mt-1 text-xs text-white/50">Allocation {asset.allocation}</p>
                        </div>
                        <p className="font-mono text-sm text-white">{asset.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                  <p className="text-sm font-semibold text-rose-200">Rebalancing needed</p>
                  <p className="mt-1 text-xs text-rose-200/70">
                    Crypto exposure drifted +2%. Recommended trim to policy target.
                  </p>
                </div>
              </section>
            )}

            {activeTab === 'chat' && (
              <section className="flex h-full flex-col gap-4">
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-2xl p-4 text-sm ${
                        message.role === 'assistant'
                          ? 'bg-[#131316] text-white/80'
                          : 'bg-indigo-500/10 text-white'
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                        {message.author}
                      </p>
                      <p className="mt-2 leading-relaxed">{message.content}</p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="rounded-2xl bg-[#131316] p-4 text-sm text-white/60">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Supernormal</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-150" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-300" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto rounded-2xl border border-white/10 bg-[#131316] p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Ask about risk, yield, or rebalancing"
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                    />
                    <button
                      onClick={handleSend}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Send
                      <MessageCircle className="h-3 w-3" />
                    </button>
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
    </div>
  )
}
