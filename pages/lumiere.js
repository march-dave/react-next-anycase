import Head from 'next/head'
import { useMemo, useState } from 'react'
import { GoogleGenerativeAI } from '@google/genai'
import {
  CheckCircle2,
  KeyRound,
  MessageCircle,
  Send,
  Sparkles,
  User,
  Wifi
} from 'lucide-react'

const navItems = [
  { id: 'concierge', label: 'Concierge' },
  { id: 'curated', label: 'Curated' },
  { id: 'account', label: 'Account' }
]

const experiences = [
  {
    id: 1,
    title: 'Sunset Bay Charter',
    price: '$125',
    category: 'Experience',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80',
    description: 'Private yacht charter with champagne and curated bites.'
  },
  {
    id: 2,
    title: 'Extended Sanctuary',
    price: '$45',
    category: 'Service',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    description: 'Late checkout to linger a little longer in comfort.'
  },
  {
    id: 3,
    title: 'In-Suite Couples Massage',
    price: '$280',
    category: 'Experience',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
    description: 'Therapists arrive to your suite for a 90-minute ritual.'
  },
  {
    id: 4,
    title: 'The Pinnacle Tasting Menu',
    price: '$180',
    category: 'Dining',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
    description: 'Seven-course seasonal tasting paired with sommelier wines.'
  }
]

const initialMessages = [
  {
    id: 'intro',
    sender: 'lumi',
    text: "Welcome back, Alexander. I am Lumi, your private concierge. Shall I arrange tonight's turndown with lavender and soft jazz?",
    timestamp: 'Now'
  }
]

const SYSTEM_INSTRUCTION =
  'You are Lumi, a sophisticated concierge. Use elevated vocabulary (e.g., Certainly, Splendid). You can book services and provide local recommendations.'

const requestHotelService = async (request) =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          status: 'confirmed',
          eta: '10 minutes',
          request
        }),
      550
    )
  )

function TypingLoader() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-2 w-2 rounded-full bg-gold"
          style={{
            animation: 'bounce 1.2s ease-in-out infinite',
            animationDelay: `${dot * 120}ms`
          }}
        />
      ))}
    </div>
  )
}

function MessageBubble({ sender, text, timestamp }) {
  const isGuest = sender === 'guest'
  const segments = text.split(/(https?:\/\/\S+)/g)

  return (
    <div className={`flex ${isGuest ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-[2px] px-4 py-3 text-sm leading-relaxed shadow-sm transition duration-300 ease-out ${
          isGuest
            ? 'bg-onyx text-white'
            : 'bg-white/90 text-onyx border border-stone-200 shadow-card'
        }`}
      >
        <p className="whitespace-pre-line">
          {segments.map((segment, index) =>
            segment.startsWith('http') ? (
              <a
                key={index}
                href={segment}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-gold decoration-2 underline-offset-4"
              >
                {segment}
              </a>
            ) : (
              <span key={index}>{segment}</span>
            )
          )}
        </p>
        <span className="mt-2 block text-[11px] uppercase tracking-[0.25em] text-onyx/50">
          {timestamp}
        </span>
      </div>
    </div>
  )
}

export default function LumiereApp() {
  const [hasAccess, setHasAccess] = useState(false)
  const [activeTab, setActiveTab] = useState('concierge')
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [filter, setFilter] = useState('All')
  const [bookings, setBookings] = useState({})
  const apiKey = useMemo(() => process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || '', [])
  const genAiClient = useMemo(() => {
    if (!apiKey) return null
    return new GoogleGenerativeAI(apiKey)
  }, [apiKey])

  const filteredExperiences = useMemo(() => {
    if (filter === 'All') return experiences
    return experiences.filter((item) => item.category === filter)
  }, [filter])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      sender: 'guest',
      text: inputValue.trim(),
      timestamp: 'Just now'
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const reply = await generateLumiReply(userMessage.text)

    setMessages((prev) => [
      ...prev,
      {
        id: `${userMessage.id}-reply`,
        sender: 'lumi',
        text: reply,
        timestamp: 'Just now'
      }
    ])
    setIsTyping(false)
  }

  const simulateGeminiResponse = (prompt) => {
    const lower = prompt.toLowerCase()
    let response =
      'Certainly. I have noted your preference. Would you like me to pair it with a chilled Sancerre from the cellar?'

    if (lower.includes('towel') || lower.includes('pillows') || lower.includes('housekeeping')) {
      response =
        'Splendid. I have dispatched a request via requestHotelService — fresh Egyptian cotton towels and pillows will arrive within 10 minutes.'
    }

    if (lower.includes('dinner') || lower.includes('restaurant') || lower.includes('eat')) {
      response =
        'Absolutely. I recommend the seasonal omakase at “Nori”. Here is the location for your driver: https://maps.google.com/?q=Nori+San+Francisco. Shall I secure a table for two at 8 PM?'
    }

    if (lower.includes('spa') || lower.includes('massage')) {
      response =
        'Allow me to arrange a 90-minute aromatherapy massage in your suite. I will align it with your schedule and confirm discreetly.'
    }

    return response
  }

  const generateLumiReply = async (prompt) => {
    const lower = prompt.toLowerCase()
    if (!genAiClient) {
      if (lower.includes('towel') || lower.includes('pillows') || lower.includes('housekeeping')) {
        const service = await requestHotelService(prompt)
        return `Splendid. requestHotelService is confirmed for “${service.request}.” A runner will arrive within ${service.eta}.`
      }
      return simulateGeminiResponse(prompt)
    }

    try {
      const model = genAiClient.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [
          {
            functionDeclarations: [
              {
                name: 'requestHotelService',
                description: 'Place a request for hotel services such as towels, pillows, or housekeeping.',
                parameters: {
                  type: 'object',
                  properties: {
                    request: {
                      type: 'string',
                      description: 'Details of the service to be requested.'
                    }
                  },
                  required: ['request']
                }
              }
            ]
          }
        ]
      })

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })

      const text = result?.response?.text()
      if (lower.includes('towel') || lower.includes('pillows') || lower.includes('housekeeping')) {
        const service = await requestHotelService(prompt)
        return `${text}\n\nrequestHotelService • ${service.status} · ETA ${service.eta}`
      }
      return text || simulateGeminiResponse(prompt)
    } catch (error) {
      console.error('Gemini error', error)
      if (lower.includes('towel') || lower.includes('pillows') || lower.includes('housekeeping')) {
        const service = await requestHotelService(prompt)
        return `Certainly. requestHotelService is confirmed for “${service.request}.” A runner will arrive within ${service.eta}.`
      }
      return simulateGeminiResponse(prompt)
    }
  }

  const handleReserve = (id) => {
    setBookings((prev) => ({
      ...prev,
      [id]: prev[id] === 'confirmed' ? 'confirmed' : 'confirmed'
    }))
  }

  const activeNavIcon = {
    concierge: MessageCircle,
    curated: Sparkles,
    account: User
  }

  return (
    <div className="min-h-screen bg-stone-100 text-onyx">
      <Head>
        <title>The Lumiere | AI Concierge</title>
        <meta name="description" content="Lumi, your personal concierge at The Lumiere, San Francisco" />
      </Head>

      {!hasAccess ? (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-onyx text-white">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient( rgba(12,12,12,0.6), rgba(12,12,12,0.7)), url(https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 text-center sm:px-10">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-white/70">The Lumiere · San Francisco</p>
              <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Welcome to your private residence</h1>
              <p className="text-lg leading-relaxed text-white/80">
                Crafted for discerning travelers. An AI concierge to curate every detail with grace.
              </p>
            </div>

            <div className="rounded-[2px] border border-white/20 bg-white/10 p-5 text-left shadow-2xl backdrop-blur-md sm:p-6">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.28em] text-white/70">
                <span>Suite</span>
                <span className="flex items-center gap-2">
                  <Wifi strokeWidth={1.5} className="h-4 w-4" /> Connected
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-white/60">Guest</p>
                  <p className="text-2xl font-semibold">Alexander Mercer</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.32em] text-white/60">Room</p>
                  <p className="text-3xl font-semibold text-gold">402</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.28em] text-white/60">
                <div className="rounded-[2px] border border-white/10 bg-white/5 p-3">
                  <p className="text-white/80">Platinum Concierge</p>
                  <p className="mt-1 text-[11px] text-white/50">Priority response</p>
                </div>
                <div className="rounded-[2px] border border-white/10 bg-white/5 p-3 text-right">
                  <p className="text-white/80">Mobile Key</p>
                  <p className="mt-1 text-[11px] text-white/50">Active for 402</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setHasAccess(true)}
              className="mx-auto w-full max-w-sm rounded-[2px] border border-gold bg-gold px-6 py-4 text-lg font-semibold uppercase tracking-[0.25em] text-onyx shadow-lg transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl"
            >
              Access Concierge
            </button>
          </div>
        </section>
      ) : (
        <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col">
          <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
            {activeTab === 'concierge' && (
              <section className="flex h-full flex-col">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200/70 bg-white/80 px-5 py-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-gold/60 bg-white text-xl font-semibold text-onyx shadow-sm">
                      L
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-onyx/50">Concierge</p>
                      <p className="font-serif text-xl font-semibold">Lumi at The Lumiere</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-[2px] border border-stone-200 bg-white/70 px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-onyx/70 shadow-sm">
                    <Wifi className="h-4 w-4 text-gold" />
                      Connected
                    </div>
                    <div className="text-right text-xs uppercase tracking-[0.3em] text-gold">Platinum</div>
                  </div>
                </header>

                <div className="flex-1 space-y-4 bg-gradient-to-b from-stone-50/70 via-stone-50/40 to-stone-100 px-5 py-6">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} sender={message.sender} text={message.text} timestamp={message.timestamp} />
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-[2px] border border-stone-200 bg-white/90 text-onyx shadow-card">
                        <TypingLoader />
                      </div>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-16 z-20 border-t border-stone-200/60 bg-white/85 px-5 py-4 backdrop-blur-md">
                  <div className="flex items-center gap-3 rounded-[2px] border border-stone-200 bg-white px-3 py-2 shadow-sm">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Request anything – e.g., fresh towels or a dinner table"
                      className="flex-1 bg-transparent px-2 py-2 text-sm text-onyx placeholder:text-onyx/40 focus:outline-none"
                    />
                    <button
                      onClick={handleSend}
                      className="flex h-11 w-11 items-center justify-center rounded-[2px] bg-onyx text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-onyx/90"
                      aria-label="Send"
                    >
                      <Send strokeWidth={1.5} className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-onyx/50">
                    Gemini-secured · Grounded recommendations with Google Maps
                  </p>
                </div>
              </section>
            )}

            {activeTab === 'curated' && (
              <section className="px-5 py-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-onyx/50">Curated Exclusives</p>
                    <h2 className="font-serif text-3xl font-semibold">Made for Room 402</h2>
                  </div>
                  <Sparkles strokeWidth={1.5} className="h-7 w-7 text-gold" />
                </div>

                <div className="mb-6 flex gap-3 overflow-x-auto no-scrollbar">
                  {['All', 'Experience', 'Service', 'Dining'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-[2px] border px-4 py-2 text-sm uppercase tracking-[0.2em] transition duration-300 ease-out font-serif ${
                        filter === item
                          ? 'border-gold bg-gold text-onyx'
                          : 'border-stone-200 bg-white/70 text-onyx hover:border-gold hover:text-onyx'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {filteredExperiences.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-[2px] border border-stone-200 bg-white shadow-card">
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 ease-out hover:scale-105"
                        />
                        <div className="absolute right-3 top-3 rounded-[2px] border border-white/30 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-onyx">
                          {item.price}
                        </div>
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                          <span className="rounded-[2px] border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] uppercase tracking-[0.25em] text-onyx/70">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-onyx/70">{item.description}</p>
                        <button
                          onClick={() => handleReserve(item.id)}
                          className={`flex w-full items-center justify-center gap-2 rounded-[2px] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition duration-300 ease-out ${
                            bookings[item.id] === 'confirmed'
                              ? 'border border-gold bg-white text-gold'
                              : 'border border-onyx bg-onyx text-white hover:-translate-y-0.5'
                          }`}
                        >
                          {bookings[item.id] === 'confirmed' ? 'Confirmed' : 'Reserve'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'account' && (
              <section className="space-y-6 px-5 py-6">
                <div className="overflow-hidden rounded-[2px] border border-gold/60 bg-gradient-to-br from-onyx via-onyx to-[#0f0f0f] text-white shadow-card">
                  <div className="h-1 w-full bg-gradient-to-r from-gold/60 via-white/30 to-gold/60" />
                  <div className="flex items-start justify-between px-5 pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gold">The Lumiere</p>
                      <h2 className="font-serif text-3xl font-semibold">Alexander Mercer</h2>
                      <p className="text-sm text-white/70">Platinum Guest</p>
                    </div>
                    <div className="rounded-[2px] border border-gold/40 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.25em] text-gold">
                      Member ID · 402
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 px-5 py-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Room</p>
                      <p className="text-lg font-semibold text-gold">402</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Checkout</p>
                      <p className="text-lg font-semibold">Dec 12, 12:00</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Status</p>
                      <p className="text-lg font-semibold">Platinum</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Balance</p>
                      <p className="text-lg font-semibold">$0.00</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <KeyRound strokeWidth={1.5} className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/60">Mobile Key</p>
                        <p className="text-sm font-semibold">Active for Suite 402</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-[2px] border border-gold/40 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-gold">
                      <CheckCircle2 strokeWidth={1.5} className="h-4 w-4" /> Secure
                    </div>
                  </div>
                </div>

                <div className="rounded-[2px] border border-stone-200 bg-white/80 p-4 shadow-card">
                  <h3 className="font-serif text-xl font-semibold text-onyx">Stay preferences</h3>
                  <ul className="mt-3 space-y-2 text-sm text-onyx/70">
                    <li>• Turndown with lavender and soft jazz at 8:30 PM</li>
                    <li>• Feather pillows, hypoallergenic duvet</li>
                    <li>• Black car transfer on checkout morning</li>
                  </ul>
                </div>
              </section>
            )}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200/70 bg-white/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center justify-around px-4 py-3">
              {navItems.map((item) => {
                const Icon = activeNavIcon[item.id]
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 rounded-[2px] px-3 py-1 text-xs uppercase tracking-[0.2em] transition duration-300 ease-out ${
                      isActive
                        ? 'border border-gold/50 bg-white text-gold shadow-sm'
                        : 'border border-transparent text-onyx/60 hover:border-stone-200 hover:text-onyx'
                    }`}
                  >
                    <Icon strokeWidth={1.5} className="h-5 w-5" />
                    <span className={`font-serif text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
