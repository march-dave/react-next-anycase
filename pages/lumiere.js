import Head from 'next/head'
import { useMemo, useState } from 'react'

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
    text: "Welcome back, Alexander. I am Lumi, your concierge. Shall I arrange tonight's turndown with lavender and soft jazz?",
    timestamp: 'Now'
  }
]

const SparklesIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.46 3.54L17 8l-3.54 1.46L12 13l-1.46-3.54L7 8l3.54-1.46L12 3z" />
    <path d="M5 17l.75 1.5L7 19l-1.25.5L5 21l-.75-1.5L3 19l1.25-.5z" />
    <path d="M17 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
  </svg>
)

const MessageCircleIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5z" />
  </svg>
)

const UserIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
    <path d="M4 21v-1a7 7 0 0 1 14 0v1" />
  </svg>
)

const SendIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22 11 13 2 9z" />
  </svg>
)

const WifiIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.55a11 11 0 0 1 14 0" />
    <path d="M8.5 16a6 6 0 0 1 7 0" />
    <path d="M12 20h.01" />
  </svg>
)

const CheckCircleIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m22 4-10 10-3-3" />
  </svg>
)

const KeyIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2l-2 2" />
    <path d="M15 8l-2 2" />
    <path d="M18 5l-7.5 7.5a4.5 4.5 0 1 1-2-2L16 3" />
    <path d="m16 3 5 5" />
  </svg>
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
        <span className="mt-2 block text-[11px] uppercase tracking-widest text-onyx/50">
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

  const filteredExperiences = useMemo(() => {
    if (filter === 'All') return experiences
    return experiences.filter((item) => item.category === filter)
  }, [filter])

  const handleSend = () => {
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

    setTimeout(() => {
      const reply = simulateGeminiResponse(userMessage.text)
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
    }, 650)
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

  const handleReserve = (id) => {
    setBookings((prev) => ({
      ...prev,
      [id]: prev[id] === 'confirmed' ? 'confirmed' : 'confirmed'
    }))
  }

  const activeNavIcon = {
    concierge: MessageCircleIcon,
    curated: SparklesIcon,
    account: UserIcon
  }

  return (
    <div className="min-h-screen bg-stone-100 text-onyx">
      <Head>
        <title>The Lumiere | AI Concierge</title>
        <meta name="description" content="Lumi, your personal concierge at The Lumiere, San Francisco" />
      </Head>

      {!hasAccess ? (
        <section
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-onyx text-white"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient( rgba(12,12,12,0.55), rgba(12,12,12,0.65)), url(https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10 flex max-w-xl flex-col gap-10 px-6 text-center">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">The Lumiere, San Francisco</p>
              <h1 className="text-4xl font-semibold sm:text-5xl">Welcome to your private residence</h1>
              <p className="text-lg text-white/80">
                Crafted for discerning travelers. An AI concierge to curate every detail with grace.
              </p>
            </div>

            <div className="rounded-[2px] border border-white/20 bg-white/10 p-5 text-left shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-sm uppercase tracking-widest text-white/70">
                <span>Suite</span>
                <span className="flex items-center gap-2">
                  <WifiIcon className="h-4 w-4" /> Connected
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Guest</p>
                  <p className="text-2xl font-semibold">Alexander Mercer</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Room</p>
                  <p className="text-3xl font-semibold text-gold">402</p>
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
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
            {activeTab === 'concierge' && (
              <section className="flex h-full flex-col">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200/70 bg-white/70 px-5 py-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-gold/60 bg-white text-xl font-semibold text-onyx shadow-sm">
                      L
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-onyx/50">Concierge</p>
                      <p className="font-serif text-xl font-semibold">Lumi at The Lumiere</p>
                    </div>
                  </div>
                  <div className="text-right text-xs uppercase tracking-[0.3em] text-gold">Platinum</div>
                </header>

                <div className="flex-1 space-y-4 px-5 py-6">
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

                <div className="sticky bottom-16 z-20 border-t border-stone-200/60 bg-white/80 px-5 py-4 backdrop-blur-md">
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
                      <SendIcon className="h-5 w-5" />
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
                  <SparklesIcon className="h-7 w-7 text-gold" />
                </div>

                <div className="mb-6 flex gap-3 overflow-x-auto no-scrollbar">
                  {['All', 'Experience', 'Service', 'Dining'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-[2px] border px-4 py-2 text-sm uppercase tracking-[0.2em] transition duration-300 ease-out ${
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
                <div className="rounded-[2px] border border-gold/60 bg-onyx text-white shadow-card">
                  <div className="flex items-start justify-between px-5 pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gold">The Lumiere</p>
                      <h2 className="font-serif text-3xl font-semibold">Alexander Mercer</h2>
                      <p className="text-sm text-white/70">Platinum Guest</p>
                    </div>
                    <SparklesIcon className="h-8 w-8 text-gold" />
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
                      <KeyIcon className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/60">Mobile Key</p>
                        <p className="text-sm font-semibold">Active for Suite 402</p>
                      </div>
                    </div>
                    <CheckCircleIcon className="h-6 w-6 text-gold" />
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

          <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200/70 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center justify-around px-4 py-3">
              {navItems.map((item) => {
                const Icon = activeNavIcon[item.id]
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 rounded-[2px] px-3 py-1 text-xs uppercase tracking-[0.2em] transition duration-300 ease-out ${
                      isActive ? 'text-gold' : 'text-onyx/60 hover:text-onyx'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
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
