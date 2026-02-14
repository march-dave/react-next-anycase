import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CreditCard,
  Landmark,
  MessageCircle,
  PieChart,
  TrendingUp,
  Wallet,
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
  XAxis,
  YAxis,
} from 'recharts'

const banks = ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'Morgan Stanley']

const netWorthData = [
  { month: 'Jan', value: 482000 },
  { month: 'Feb', value: 498000 },
  { month: 'Mar', value: 506000 },
  { month: 'Apr', value: 520500 },
  { month: 'May', value: 535000 },
  { month: 'Jun', value: 552000 },
  { month: 'Jul', value: 566000 },
  { month: 'Aug', value: 580000 },
  { month: 'Sep', value: 595500 },
  { month: 'Oct', value: 610000 },
  { month: 'Nov', value: 622300 },
  { month: 'Dec', value: 634300 },
]

const allocationData = [
  { name: 'VOO', value: 35 },
  { name: 'QQQ', value: 20 },
  { name: 'Bonds', value: 15 },
  { name: 'Crypto', value: 5 },
  { name: 'Private Equity', value: 10 },
  { name: 'Cash', value: 15 },
]

const holdings = [
  { name: 'S&P 500 ETF (VOO)', value: '$221,050', allocation: '35%' },
  { name: 'Nasdaq 100 (QQQ)', value: '$126,860', allocation: '20%' },
  { name: 'Core Bonds', value: '$95,145', allocation: '15%' },
  { name: 'Private Equity', value: '$63,430', allocation: '10%' },
  { name: 'Bitcoin', value: '$31,715', allocation: '5%' },
  { name: 'Cash & Treasury', value: '$95,100', allocation: '15%' },
]

const initialMessages = [
  {
    id: 1,
    author: 'Supernormal',
    role: 'AI Strategist',
    content:
      "Hello. Markets have been choppy, but your Autonomous Index is up. I've analyzed your spending and have tax-loss harvesting ideas.",
    tone: 'ai',
  },
]

export default function Supernormal() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [connectionStep, setConnectionStep] = useState('list')
  const [selectedBank, setSelectedBank] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef([])

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const resetConnection = () => {
    setModalOpen(false)
    setConnectionStep('list')
    setSelectedBank('')
  }

  const handleConnect = (bank) => {
    setSelectedBank(bank)
    setConnectionStep('verifying')

    const verifyingTimeout = setTimeout(() => {
      setConnectionStep('success')
    }, 1400)

    const completeTimeout = setTimeout(() => {
      setView('app')
      resetConnection()
    }, 2600)

    timeoutRef.current.push(verifyingTimeout, completeTimeout)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage = {
      id: Date.now(),
      author: 'You',
      role: 'Client',
      content: inputValue.trim(),
      tone: 'user',
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    const responseTimeout = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          author: 'Supernormal',
          role: 'AI Strategist',
          content:
            'Given your current drawdowns, I recommend trimming excess cash into short-duration Treasuries while maintaining equity exposure. We can also harvest losses in QQQ to offset future gains.',
          tone: 'ai',
        },
      ])
      setIsTyping(false)
    }, 1400)

    timeoutRef.current.push(responseTimeout)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Head>
        <title>Supernormal</title>
      </Head>

      {view === 'landing' ? (
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#131316]">
            <Zap className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Supernormal</h1>
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Wealth strategy for the 1%. Now available to you.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-8 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40"
          >
            Get Started
          </button>
        </main>
      ) : (
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#131316]">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Supernormal</p>
                <p className="text-xs text-white/50">AI Wealth Strategist</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#131316] px-3 py-1 text-xs text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Live Sync
            </div>
          </header>

          <main className="flex-1 space-y-6 overflow-y-auto px-5 pb-28 pt-6">
            {activeTab === 'dashboard' && (
              <section className="space-y-6">
                <div className="rounded-3xl bg-[#131316] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Total Net Worth</p>
                      <p className="mt-2 font-mono text-3xl font-semibold">$634,300.07</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                      <TrendingUp className="h-4 w-4" />
                      +10.4% YTD
                    </div>
                  </div>
                  <div className="mt-6 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={netWorthData} margin={{ left: -20, right: 10 }}>
                        <defs>
                          <linearGradient id="netWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 11 }}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#131316',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                          labelStyle={{ color: '#9ca3af' }}
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
                  <div className="rounded-2xl bg-[#131316] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/70">Weekly Deposit</p>
                      <Wallet className="h-4 w-4 text-indigo-300" />
                    </div>
                    <p className="mt-3 font-mono text-2xl">$500</p>
                    <p className="mt-2 text-xs text-white/50">Auto-invest every Monday</p>
                  </div>
                  <div className="rounded-2xl bg-[#131316] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/70">Risk Level</p>
                      <Activity className="h-4 w-4 text-indigo-300" />
                    </div>
                    <p className="mt-3 font-mono text-2xl">Aggressive</p>
                    <p className="mt-2 text-xs text-white/50">Equity tilt: +12%</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                      <ArrowUpRight className="h-5 w-5 text-indigo-200" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Smart Cash Sweep</p>
                      <p className="text-xs text-white/60">
                        Move idle cash into Treasury ETFs to capture 5% yield.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'portfolio' && (
              <section className="space-y-6">
                <div className="rounded-3xl bg-[#131316] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Strategy</p>
                      <h2 className="mt-2 text-xl font-semibold">Autonomous Index</h2>
                      <p className="mt-2 text-sm text-white/60">
                        Endowment Model diversification with AI-driven tactical overlays.
                      </p>
                    </div>
                    <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">Model v2.4</div>
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <div className="h-52 w-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={allocationData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={65}
                            outerRadius={95}
                            paddingAngle={4}
                          >
                            {allocationData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={[
                                  '#6366f1',
                                  '#4338ca',
                                  '#1e40af',
                                  '#0ea5e9',
                                  '#7c3aed',
                                  '#14b8a6',
                                ][index % 6]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: '#131316',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                            formatter={(value) => [`${value}%`, 'Allocation']}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {holdings.map((holding) => (
                    <div key={holding.name} className="flex items-center justify-between rounded-2xl bg-[#131316] p-4">
                      <div>
                        <p className="text-sm font-semibold">{holding.name}</p>
                        <p className="text-xs text-white/50">Allocation {holding.allocation}</p>
                      </div>
                      <p className="font-mono text-sm">{holding.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                      <Bot className="h-5 w-5 text-amber-200" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Rebalancing needed</p>
                      <p className="text-xs text-white/60">Crypto exposure drifted +2% from target.</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'chat' && (
              <section className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl p-4 ${
                      message.tone === 'ai' ? 'bg-[#131316]' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{message.author}</span>
                      <span>{message.role}</span>
                    </div>
                    <p className="mt-3 text-sm text-white/80">{message.content}</p>
                  </div>
                ))}
                {isTyping && (
                  <div className="rounded-2xl bg-[#131316] p-4">
                    <p className="text-xs text-white/50">Supernormal is typing</p>
                    <div className="mt-2 flex gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400"></span>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-150"></span>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-300"></span>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-[#131316] px-4 py-3">
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Ask about your portfolio"
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

          <nav className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-6 rounded-full bg-[#131316] px-6 py-3 text-xs text-white/60 shadow-xl shadow-black/40">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'text-white' : 'text-white/50'
              }`}
            >
              <PieChart className="h-4 w-4" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 ${activeTab === 'chat' ? 'text-white' : 'text-white/50'}`}
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 ${
                activeTab === 'portfolio' ? 'text-white' : 'text-white/50'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Portfolio
            </button>
          </nav>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl bg-[#131316] p-6">
            {connectionStep === 'list' && (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Connect your bank</p>
                    <p className="text-xs text-white/50">Securely link your institution.</p>
                  </div>
                  <button type="button" onClick={resetConnection} className="text-xs text-white/50">
                    Close
                  </button>
                </div>
                <div className="mt-6 space-y-3">
                  {banks.map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => handleConnect(bank)}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
                    >
                      <span>{bank}</span>
                      <Landmark className="h-4 w-4 text-indigo-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {connectionStep === 'verifying' && (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20">
                  <Wallet className="h-6 w-6 text-indigo-300" />
                </div>
                <p className="mt-4 text-sm font-semibold">Verifying credentials...</p>
                <p className="mt-2 text-xs text-white/50">Connecting to {selectedBank}</p>
                <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-500"></div>
                </div>
              </div>
            )}

            {connectionStep === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                </div>
                <p className="mt-4 text-sm font-semibold">Connection secure</p>
                <p className="mt-2 text-xs text-white/50">Syncing accounts...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
