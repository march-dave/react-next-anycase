import { useMemo, useState } from 'react'
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bot,
  MessageCircle,
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

const bankList = [
  'Aurora Private Bank',
  'Vanguard Wealth',
  'Citadel Credit',
  'Sequoia Trust',
]

const netWorthData = [
  { month: 'Jan', value: 420000 },
  { month: 'Feb', value: 448000 },
  { month: 'Mar', value: 472000 },
  { month: 'Apr', value: 495000 },
  { month: 'May', value: 522000 },
  { month: 'Jun', value: 548000 },
  { month: 'Jul', value: 563000 },
  { month: 'Aug', value: 579000 },
  { month: 'Sep', value: 600000 },
  { month: 'Oct', value: 612000 },
  { month: 'Nov', value: 625000 },
  { month: 'Dec', value: 634300 },
]

const allocationData = [
  { name: 'VOO', value: 35, color: '#6366f1' },
  { name: 'QQQ', value: 20, color: '#818cf8' },
  { name: 'Bonds', value: 15, color: '#a5b4fc' },
  { name: 'Crypto', value: 5, color: '#c7d2fe' },
  { name: 'Private Equity', value: 10, color: '#4f46e5' },
  { name: 'Cash', value: 15, color: '#312e81' },
]

const holdings = [
  { name: 'S&P 500 ETF', ticker: 'VOO', value: '$222,000', allocation: '35%' },
  { name: 'Nasdaq 100 ETF', ticker: 'QQQ', value: '$126,900', allocation: '20%' },
  { name: 'Core Bonds', ticker: 'AGG', value: '$95,000', allocation: '15%' },
  { name: 'Private Credit', ticker: 'PCR', value: '$63,400', allocation: '10%' },
  { name: 'Bitcoin', ticker: 'BTC', value: '$31,700', allocation: '5%' },
]

const initialChat = [
  {
    id: 1,
    sender: 'ai',
    content:
      "Hello. Markets have been choppy, but your Autonomous Index is up. I've analyzed your spending and have tax-loss harvesting ideas.",
  },
]

const aiResponses = [
  'Your liquidity buffer is strong. We can redeploy idle cash into short-duration Treasuries while keeping optionality for private deals.',
  'Equity beta remains efficient. I suggest trimming QQQ by 2% and reallocating to private credit for convexity.',
  'We can harvest losses in crypto to offset gains while maintaining exposure through a correlated proxy.',
]

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState('banks')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [messages, setMessages] = useState(initialChat)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const chartGradientId = useMemo(() => 'supernormal-gradient', [])

  const handleBankSelect = () => {
    setModalStep('verifying')
    setTimeout(() => {
      setModalStep('success')
    }, 1400)
    setTimeout(() => {
      setModalOpen(false)
      setView('app')
      setModalStep('banks')
    }, 2600)
  }

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      }
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans">
      {view === 'landing' ? (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#131316]">
              <Zap className="h-8 w-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Supernormal</h1>
            <p className="mt-3 text-sm text-slate-400">
              Wealth strategy for the 1%. Now available to you.
            </p>
            <button
              className="mt-8 w-full rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              onClick={() => setModalOpen(true)}
            >
              Get Started
            </button>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
              <div className="w-full max-w-sm rounded-3xl bg-[#131316] p-6 text-left shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Secure connection
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">Connect your bank</h2>
                  </div>
                  <BadgeCheck className="h-6 w-6 text-indigo-400" />
                </div>
                {modalStep === 'banks' && (
                  <div className="mt-6 space-y-3">
                    {bankList.map((bank) => (
                      <button
                        key={bank}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-slate-200 transition hover:border-indigo-500/50"
                        onClick={handleBankSelect}
                      >
                        {bank}
                        <span className="text-xs text-slate-500">Select</span>
                      </button>
                    ))}
                  </div>
                )}
                {modalStep === 'verifying' && (
                  <div className="mt-8 space-y-4 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                    <p className="text-sm text-slate-300">Verifying credentials...</p>
                  </div>
                )}
                {modalStep === 'success' && (
                  <div className="mt-6 space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                      <BadgeCheck className="h-6 w-6 text-indigo-400" />
                    </div>
                    <p className="text-sm text-slate-200">Bank connection successful.</p>
                    <p className="text-xs text-slate-500">Redirecting to your dashboard...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#131316]">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Supernormal</p>
                <p className="text-xs text-slate-500">AI Wealth Strategist</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#131316] px-3 py-1 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live Sync
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 pb-28 pt-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Total Net Worth
                  </p>
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-semibold text-white font-mono">
                      $634,300.07
                    </h2>
                    <div className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                      <TrendingUp className="h-4 w-4" />
                      +10.4% YTD
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl bg-[#131316] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Net worth growth</p>
                    <p className="text-xs text-slate-500">Last 12 months</p>
                  </div>
                  <div className="mt-4 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={netWorthData}>
                        <defs>
                          <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{
                            background: '#0a0a0c',
                            border: '1px solid #1f1f24',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                          labelStyle={{ color: '#9ca3af' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill={`url(#${chartGradientId})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-[#131316] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Weekly Deposit
                    </p>
                    <p className="mt-3 text-lg font-semibold font-mono">$500</p>
                    <p className="text-xs text-slate-500">Auto-invest every Monday</p>
                  </div>
                  <div className="rounded-3xl bg-[#131316] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Risk Level</p>
                    <p className="mt-3 text-lg font-semibold">Aggressive</p>
                    <p className="text-xs text-slate-500">Volatility target 16%</p>
                  </div>
                </section>

                <section className="rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-indigo-500/20 p-2">
                      <Activity className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Smart Cash Sweep</p>
                      <p className="mt-1 text-xs text-slate-300">
                        Move idle cash into Treasury ETFs to earn 4.8% without sacrificing
                        liquidity.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <section className="rounded-3xl bg-[#131316] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Strategy</p>
                  <h2 className="mt-2 text-xl font-semibold">Autonomous Index</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Built on the Endowment Model with diversified, low-correlation assets.
                  </p>
                </section>

                <section className="rounded-3xl bg-[#131316] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Asset allocation</p>
                    <p className="text-xs text-slate-500">Target mix</p>
                  </div>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="h-40 w-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={allocationData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={50}
                            outerRadius={70}
                          >
                            {allocationData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: '#0a0a0c',
                              border: '1px solid #1f1f24',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '12px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 text-sm">
                      {allocationData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-slate-300">{entry.name}</span>
                          <span className="ml-auto font-mono text-slate-100">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Holdings</h3>
                  {holdings.map((holding) => (
                    <div
                      key={holding.ticker}
                      className="flex items-center justify-between rounded-2xl bg-[#131316] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{holding.name}</p>
                        <p className="text-xs text-slate-500">{holding.ticker}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">{holding.value}</p>
                        <p className="text-xs text-slate-500">{holding.allocation}</p>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-rose-500/20 p-2">
                      <BarChart3 className="h-5 w-5 text-rose-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Rebalancing needed</p>
                      <p className="mt-1 text-xs text-slate-300">
                        Crypto exposure drifted +2% from target allocation.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col gap-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          message.sender === 'user'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-[#131316] text-slate-200'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1 rounded-full bg-[#131316] px-3 py-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:240ms]" />
                      </div>
                      Supernormal is thinking...
                    </div>
                  )}
                </div>
                <div className="mt-auto flex items-center gap-3 rounded-full border border-white/10 bg-[#131316] px-4 py-2">
                  <input
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="Ask your strategist..."
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSend()
                    }}
                  />
                  <button
                    className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </main>

          <nav className="fixed bottom-6 left-1/2 z-40 w-[90%] max-w-sm -translate-x-1/2 rounded-full border border-white/10 bg-[#131316]/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <button
                className={`flex flex-1 flex-col items-center gap-1 text-xs ${
                  activeTab === 'dashboard' ? 'text-white' : 'text-slate-500'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Activity className="h-5 w-5" />
                Dashboard
              </button>
              <button
                className={`flex flex-1 flex-col items-center gap-1 text-xs ${
                  activeTab === 'chat' ? 'text-white' : 'text-slate-500'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <MessageCircle className="h-5 w-5" />
                Chat
              </button>
              <button
                className={`flex flex-1 flex-col items-center gap-1 text-xs ${
                  activeTab === 'portfolio' ? 'text-white' : 'text-slate-500'
                }`}
                onClick={() => setActiveTab('portfolio')}
              >
                <Bot className="h-5 w-5" />
                Portfolio
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
