import Head from 'next/head'
import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  LineChart,
  MessageCircle,
  PieChart as PieChartIcon,
  TrendingUp,
  UserPlus,
  Zap
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const netWorthData = [
  { month: 'Jan', value: 482000 },
  { month: 'Feb', value: 498000 },
  { month: 'Mar', value: 512500 },
  { month: 'Apr', value: 521200 },
  { month: 'May', value: 536800 },
  { month: 'Jun', value: 549600 },
  { month: 'Jul', value: 567300 },
  { month: 'Aug', value: 581000 },
  { month: 'Sep', value: 593400 },
  { month: 'Oct', value: 608900 },
  { month: 'Nov', value: 621700 },
  { month: 'Dec', value: 634300 }
]

const allocationData = [
  { name: 'VOO', value: 35, color: '#6366f1' },
  { name: 'QQQ', value: 20, color: '#4f46e5' },
  { name: 'Bonds', value: 15, color: '#a5b4fc' },
  { name: 'Crypto', value: 5, color: '#818cf8' },
  { name: 'Private Equity', value: 10, color: '#c7d2fe' },
  { name: 'Cash', value: 15, color: '#1f2937' }
]

const holdings = [
  { name: 'S&P 500 ETF (VOO)', value: '$221,905', allocation: '35%' },
  { name: 'Nasdaq 100 (QQQ)', value: '$126,860', allocation: '20%' },
  { name: 'Investment Grade Bonds', value: '$95,145', allocation: '15%' },
  { name: 'Private Credit', value: '$63,430', allocation: '10%' },
  { name: 'Bitcoin', value: '$31,715', allocation: '5%' },
  { name: 'Cash Management', value: '$95,145', allocation: '15%' }
]

const banks = ['Chase', 'Goldman Sachs', 'Morgan Stanley', 'Bank of America']

const chatResponses = [
  'Under current volatility, we should lean into quality beta and keep duration short. Your risk-adjusted return remains top quartile.',
  'I recommend harvesting losses in QQQ to offset private equity carry. We can redeploy into VOO with minimal tracking error.',
  'Crypto exposure drifted above target. I would rebalance 2% into Treasuries to stabilize drawdown risk.'
]

export default function Supernormal() {
  const [isConnected, setIsConnected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [connectionState, setConnectionState] = useState('idle')
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedBank, setSelectedBank] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 'intro',
      role: 'ai',
      text:
        "Hello. Markets have been choppy, but your Autonomous Index is up. I've analyzed your spending and have tax-loss harvesting ideas."
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const totalNetWorth = useMemo(() => {
    const last = netWorthData[netWorthData.length - 1]
    return last.value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
  }, [])

  const handleBankConnect = (bank) => {
    setSelectedBank(bank)
    setConnectionState('verifying')
    setTimeout(() => {
      setConnectionState('success')
      setTimeout(() => {
        setShowModal(false)
        setIsConnected(true)
        setActiveView('dashboard')
        setConnectionState('idle')
      }, 1200)
    }, 1500)
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return
    const newMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed
    }
    setMessages((prev) => [...prev, newMessage])
    setInput('')
    setIsTyping(true)
    const response = chatResponses[Math.floor(Math.random() * chatResponses.length)]
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: 'ai', text: response }
      ])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Head>
        <title>Supernormal — AI Wealth Strategist</title>
      </Head>

      {!isConnected ? (
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10">
            <Zap className="h-10 w-10 text-indigo-400" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Supernormal</h1>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Wealth strategy for the 1%. Now available to you.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30"
          >
            Get Started
            <ChevronRight className="h-4 w-4" />
          </button>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
              <div className="w-full max-w-sm rounded-2xl bg-[#131316] p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                      Secure Link
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">Connect your bank</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setConnectionState('idle')
                      setSelectedBank(null)
                    }}
                    className="rounded-full border border-white/10 p-2"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {banks.map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => handleBankConnect(bank)}
                      disabled={connectionState === 'verifying'}
                      className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3 text-left text-sm transition hover:border-indigo-500/40"
                    >
                      <span>{bank}</span>
                      <UserPlus className="h-4 w-4 text-white/60" />
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/70">
                  {connectionState === 'idle' && 'Select a bank to verify credentials.'}
                  {connectionState === 'verifying' && (
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                      Verifying credentials for {selectedBank}...
                    </div>
                  )}
                  {connectionState === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" /> Connected. Redirecting to dashboard.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      ) : (
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20">
                <Zap className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <p className="text-sm font-semibold">Supernormal</p>
                <p className="text-xs text-white/60">AI Wealth Strategist</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Live Sync
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-5 pb-28 pt-6">
            {activeView === 'dashboard' && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-[#131316] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Total Net Worth</p>
                      <p className="mt-3 text-3xl font-semibold text-white font-mono">
                        {totalNetWorth}
                      </p>
                    </div>
                    <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                      <TrendingUp className="mr-1 inline h-3 w-3" />+10.4% YTD
                    </div>
                  </div>
                  <div className="mt-6 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={netWorthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="netWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="month" stroke="#475569" fontSize={10} />
                        <YAxis
                          stroke="#475569"
                          fontSize={10}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#0a0a0c',
                            border: '1px solid #1f2937',
                            fontSize: '12px'
                          }}
                          labelStyle={{ color: '#e2e8f0' }}
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Net Worth']}
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
                  <div className="rounded-2xl border border-white/10 bg-[#131316] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Weekly Deposit</p>
                    <p className="mt-4 text-2xl font-mono text-white">$500</p>
                    <p className="mt-2 text-xs text-white/60">Auto-invest to Autonomous Index</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#131316] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Risk Level</p>
                    <p className="mt-4 text-2xl font-semibold">Aggressive</p>
                    <p className="mt-2 text-xs text-white/60">Optimized for long-term alpha</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm">
                  <p className="text-sm font-semibold">Insight</p>
                  <p className="mt-2 text-white/70">
                    Smart Cash Sweep: Move idle cash into short-duration Treasury ETFs to capture
                    5.1% yield.
                  </p>
                </div>
              </section>
            )}

            {activeView === 'portfolio' && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-[#131316] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Strategy</p>
                  <h2 className="mt-3 text-2xl font-semibold">Autonomous Index</h2>
                  <p className="mt-2 text-sm text-white/70">
                    Built on the Endowment Model with adaptive hedging and dynamic rebalancing.
                  </p>
                  <div className="mt-6 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {allocationData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: '#0a0a0c',
                            border: '1px solid #1f2937',
                            fontSize: '12px'
                          }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3">
                  {holdings.map((holding) => (
                    <div
                      key={holding.name}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#131316] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{holding.name}</p>
                        <p className="text-xs text-white/60">{holding.allocation}</p>
                      </div>
                      <p className="font-mono text-sm text-white">{holding.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm">
                  <p className="text-sm font-semibold text-amber-200">
                    Rebalancing needed: Crypto exposure drifted +2%.
                  </p>
                </div>
              </section>
            )}

            {activeView === 'chat' && (
              <section className="flex h-full flex-col">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-[#131316] text-white/80'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-[#131316] px-4 py-3 text-sm text-white/70">
                        <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                        Supernormal is typing...
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask for a portfolio insight"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold"
                  >
                    Send
                  </button>
                </div>
              </section>
            )}
          </main>

          <nav className="fixed bottom-6 left-1/2 z-40 w-[90%] max-w-sm -translate-x-1/2 rounded-full border border-white/10 bg-[#131316]/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between">
              {[
                { id: 'dashboard', icon: LineChart, label: 'Dashboard' },
                { id: 'chat', icon: MessageCircle, label: 'Chat' },
                { id: 'portfolio', icon: PieChartIcon, label: 'Portfolio' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`flex flex-1 flex-col items-center gap-1 text-[10px] ${
                    activeView === item.id ? 'text-indigo-300' : 'text-white/60'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
