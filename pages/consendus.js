import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  CheckCircle2,
  Landmark,
  MessageCircle,
  PieChart as PieChartIcon,
  TrendingUp,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const banks = [
  'JPMorgan Chase',
  'Goldman Sachs',
  'Morgan Stanley',
  'Citi Private Bank',
]

const netWorthData = [
  { month: 'Jan', value: 520000 },
  { month: 'Feb', value: 532000 },
  { month: 'Mar', value: 547500 },
  { month: 'Apr', value: 558100 },
  { month: 'May', value: 573200 },
  { month: 'Jun', value: 589900 },
  { month: 'Jul', value: 601300 },
  { month: 'Aug', value: 612800 },
  { month: 'Sep', value: 620500 },
  { month: 'Oct', value: 628400 },
  { month: 'Nov', value: 631900 },
  { month: 'Dec', value: 634300 },
]

const allocation = [
  { name: 'VOO', value: 35 },
  { name: 'QQQ', value: 20 },
  { name: 'Bonds', value: 15 },
  { name: 'Crypto', value: 5 },
  { name: 'Private Equity', value: 10 },
  { name: 'Cash', value: 15 },
]

const allocationColors = ['#6366f1', '#818cf8', '#a5b4fc', '#4f46e5', '#4338ca', '#312e81']

const holdings = [
  { name: 'S&P 500 ETF', symbol: 'VOO', value: '$221,920', percent: '35%' },
  { name: 'Nasdaq 100 ETF', symbol: 'QQQ', value: '$126,860', percent: '20%' },
  { name: 'Core Bonds', symbol: 'AGG', value: '$95,145', percent: '15%' },
  { name: 'Private Credit', symbol: 'PCRED', value: '$63,430', percent: '10%' },
  { name: 'Bitcoin', symbol: 'BTC', value: '$31,715', percent: '5%' },
]

const initialChat = [
  {
    id: 1,
    sender: 'supernormal',
    content:
      "Hello. Markets have been choppy, but your Autonomous Index is up. I've analyzed your spending and have tax-loss harvesting ideas.",
  },
]

const aiResponses = [
  'Current drawdowns in growth are manageable. I suggest trimming QQQ by 2% to fund Treasury ETFs and improve risk-adjusted yield.',
  'Your volatility is within our target band. We can harvest losses in small-cap exposures to offset 2024 gains.',
  'Cash drag is 1.1%. I recommend moving idle balances into a laddered T-bill sleeve for +4.8% annualized.',
]

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [connectStep, setConnectStep] = useState('list')
  const [selectedBank, setSelectedBank] = useState('')
  const [chatMessages, setChatMessages] = useState(initialChat)
  const [chatInput, setChatInput] = useState('')
  const [typing, setTyping] = useState(false)
  const timeoutsRef = useRef([])

  const chartTooltipStyle = useMemo(
    () => ({
      backgroundColor: '#131316',
      border: '1px solid rgba(99, 102, 241, 0.4)',
      borderRadius: '12px',
      color: '#f8fafc',
    }),
    []
  )

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  useEffect(() => {
    if (connectStep === 'loading') {
      const loadingTimeout = setTimeout(() => {
        setConnectStep('success')
      }, 1600)
      timeoutsRef.current.push(loadingTimeout)
    }

    if (connectStep === 'success') {
      const successTimeout = setTimeout(() => {
        setModalOpen(false)
        setView('app')
        setActiveTab('dashboard')
        setConnectStep('list')
      }, 1200)
      timeoutsRef.current.push(successTimeout)
    }
  }, [connectStep])

  const handleStart = () => {
    setModalOpen(true)
    setConnectStep('list')
  }

  const handleSelectBank = (bank) => {
    setSelectedBank(bank)
    setConnectStep('loading')
  }

  const handleSend = () => {
    if (!chatInput.trim()) return
    const nextId = chatMessages.length + 1
    const newMessage = { id: nextId, sender: 'user', content: chatInput.trim() }
    setChatMessages((prev) => [...prev, newMessage])
    setChatInput('')
    setTyping(true)

    const response = aiResponses[nextId % aiResponses.length]
    const responseTimeout = setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: 'supernormal', content: response },
      ])
      setTyping(false)
    }, 1400)
    timeoutsRef.current.push(responseTimeout)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {view === 'landing' && (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#131316] shadow-lg shadow-indigo-500/20">
            <Zap className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Supernormal</h1>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Wealth strategy for the 1%. Now available to you.
          </p>
          <button
            onClick={handleStart}
            className="mt-8 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400"
          >
            Get Started
          </button>
        </div>
      )}

      {view === 'app' && (
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#131316]">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Supernormal</p>
                <p className="text-xs text-white/50">AI Wealth Strategist</p>
              </div>
              <p className="mt-2">All systems operational. Latency steady at 120ms.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live Sync
            </div>
          </header>

          <main className="flex-1 space-y-6 overflow-y-auto px-5 pb-28">
            {activeTab === 'dashboard' && (
              <section className="space-y-6">
                <div className="rounded-3xl bg-[#131316] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/60">Total Net Worth</p>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      <TrendingUp className="h-3.5 w-3.5" />
                      +10.4% YTD
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-white font-mono">$634,300.07</p>
                  <div className="mt-4 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={netWorthData} margin={{ left: -10, right: 10 }}>
                        <defs>
                          <linearGradient id="networth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => `$${value.toLocaleString()}`} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill="url(#networth)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#131316] p-4">
                    <p className="text-xs text-white/50">Weekly Deposit</p>
                    <p className="mt-2 text-xl font-semibold font-mono">$500</p>
                    <p className="mt-1 text-xs text-white/50">Auto-investing every Friday</p>
                  </div>
                  <div className="rounded-2xl bg-[#131316] p-4">
                    <p className="text-xs text-white/50">Risk Level</p>
                    <p className="mt-2 text-xl font-semibold">Aggressive</p>
                    <p className="mt-1 text-xs text-white/50">Target volatility 12%</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-4">
                  <p className="text-sm font-semibold">Insight</p>
                  <p className="mt-2 text-sm text-white/70">
                    Smart Cash Sweep suggested: move idle cash into Treasury ETFs to lift yield by 3.6%.
                  </p>
                </div>
              </section>
            )}

            {activeTab === 'portfolio' && (
              <section className="space-y-6">
                <div className="rounded-3xl bg-[#131316] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Strategy</p>
                  <h2 className="mt-3 text-2xl font-semibold">Autonomous Index</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Built on the Endowment Model with diversified growth, alternatives, and defensive ballast.
                  </p>
                  <div className="mt-5 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocation}
                          dataKey="value"
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {allocation.map((entry, index) => (
                            <Cell
                              key={`slice-${entry.name}`}
                              fill={allocationColors[index % allocationColors.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                    {allocation.map((slice, index) => (
                      <span key={slice.name} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: allocationColors[index % allocationColors.length] }}
                        />
                        {slice.name} {slice.value}%
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#131316] p-4">
                  <p className="text-sm font-semibold">Holdings</p>
                  <div className="mt-4 space-y-3">
                    {holdings.map((holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{holding.name}</p>
                          <p className="text-xs text-white/50">{holding.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono">{holding.value}</p>
                          <p className="text-xs text-white/50">{holding.percent}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
                  <p className="text-sm font-semibold">Alert</p>
                  <p className="mt-2 text-sm text-white/70">
                    Rebalancing needed: Crypto exposure drifted +2% above target.
                  </p>
                </div>
              </section>
            )}

            {activeTab === 'chat' && (
              <section className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#131316] p-4">
                  <p className="text-sm font-semibold">Advisor Channel</p>
                  <p className="text-xs text-white/50">Supernormal • Hedge Fund Desk</p>
                </div>
                <div className="flex flex-col gap-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        message.sender === 'supernormal'
                          ? 'self-start bg-[#131316] text-white/80'
                          : 'self-end bg-indigo-500/20 text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                  {typing && (
                    <div className="self-start rounded-2xl bg-[#131316] px-4 py-3 text-sm text-white/60">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:240ms]" />
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-[#131316] px-4 py-2">
                  <input
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Ask about your portfolio..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold"
                  >
                    Send
                  </button>
                </div>
              </section>
            )}
          </main>

          <nav className="pointer-events-none fixed bottom-6 left-0 right-0 flex items-center justify-center">
            <div className="pointer-events-auto flex items-center gap-6 rounded-full bg-[#131316] px-6 py-3 shadow-lg shadow-black/40">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  activeTab === 'dashboard' ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/60'
                }`}
              >
                <Activity className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  activeTab === 'chat' ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/60'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  activeTab === 'portfolio' ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/60'
                }`}
              >
                <PieChartIcon className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#131316] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Connect your bank</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-white/10 p-2 text-white/70"
              >
                ✕
              </button>
            </div>

            {connectStep === 'list' && (
              <div className="mt-6 space-y-3">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => handleSelectBank(bank)}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:border-indigo-500/60"
                  >
                    <span className="flex items-center gap-3">
                      <Landmark className="h-4 w-4 text-indigo-400" />
                      {bank}
                    </span>
                    <span className="text-xs text-white/40">Connect</span>
                  </button>
                ))}
              </div>
            )}

            {connectStep === 'loading' && (
              <div className="mt-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
                  <Zap className="h-6 w-6 animate-pulse text-indigo-400" />
                </div>
                <p className="mt-4 text-sm text-white/70">Verifying credentials...</p>
                <p className="mt-1 text-xs text-white/40">{selectedBank}</p>
              </div>
            )}

            {connectStep === 'success' && (
              <div className="mt-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                <p className="mt-4 text-sm text-white/80">Connection secured.</p>
                <p className="mt-1 text-xs text-white/40">Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
