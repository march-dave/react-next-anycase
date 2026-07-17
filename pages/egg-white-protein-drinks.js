import Head from 'next/head'
import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  Dumbbell,
  Egg,
  Flame,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'

const stats = [
  { value: '50g+', label: 'protein per carton', detail: 'A single clean-label Tetra Pak built around pasteurised egg white.' },
  { value: '2.5g', label: 'carbs target', detail: 'Macro-efficient enough for protein-maxxers and GLP-1 users.' },
  { value: '$4.20', label: 'Greek benchmark', detail: 'A proven shelf price for the product this concept geo-arbitrages.' },
  { value: '70%', label: 'US adults chasing protein', detail: 'A mainstream demand wave layered on top of fitness buyers.' },
  { value: '~12%', label: 'Americans on GLP-1s', detail: 'A new medicalised cohort being coached to protect lean mass.' },
]

const solutionPillars = [
  {
    title: 'One clean carton',
    body: 'Roughly 94% pasteurised egg white, cocoa, and not much else: 50g+ protein with a simpler label than most chilled shakes.',
  },
  {
    title: 'Egg supply, not whey supply',
    body: 'Partner with a major egg producer for supply and co-manufacturing so the product is insulated from whey trader volatility.',
  },
  {
    title: 'Narrow launch, wider market',
    body: 'Start with premium DTC and gym buyers, then expand into lactose-intolerant shoppers, GLP-1 users, and grocery velocity.',
  },
]

const marketNumbers = [
  {
    title: 'Multi-billion-dollar pool',
    body: 'Protein supplements and RTD shakes are already huge; the first wedge only needs a defensible niche inside existing demand.',
    icon: BarChart3,
  },
  {
    title: '$29M subscription math',
    body: '50,000 subscribers buying a monthly 12-pack at roughly $4 per carton implies about $2.4M monthly revenue, or roughly $29M ARR before grocery.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Egg protein tailwind',
    body: 'Egg white powder alone is estimated around $1.7B in 2025 and heading toward $2.4B by 2030, before finished RTD formats are counted.',
    icon: Egg,
  },
  {
    title: 'Nine-figure upside',
    body: 'Capturing even 1% of US RTD protein shake spend can become a nine-figure line; the first goal is a defensible $20M-$40M DTC-plus-gym wedge.',
    icon: TrendingUp,
  },
]

const modelCards = [
  {
    title: 'DTC subscription',
    body: 'Monthly 12 or 24 carton packs create the recurring-revenue engine, flavour data, and premium-margin launch base.',
    icon: PackageCheck,
  },
  {
    title: 'Gym fridge wholesale',
    body: 'Put the 55g-for-2.5g-carbs stat sheet exactly where macro-trackers discover and evangelise new protein formats.',
    icon: Dumbbell,
  },
  {
    title: 'Phase-two grocery',
    body: 'Scale into lactose-intolerant and GLP-1 shoppers once taste, reorder, and supply economics are proven.',
    icon: ShoppingCart,
  },
]

const whyNow = [
  'Standard whey powder is up more than 50% since January, concentrate has roughly tripled from pre-shortage ranges, and isolate has moved beyond $11/lb.',
  'GLP-1 weight-loss users are being told to protein-load to protect lean mass, adding medical demand to the existing fitness base.',
  'Clean-label positioning favours a five-ingredient egg white drink over complex shake formulas.',
  'The product has already been de-risked in Greece; the US, UK, and Australia gap is distribution, taste localisation, and brand.',
]

const risks = [
  'Taste and texture must beat the eggy, chalky reputation of older egg protein formats.',
  'Avian flu can still shock egg supply, so contracts and redundancy matter.',
  'Large whey RTD brands or egg producers can copy once the wedge is visible.',
  'Egg allergen labelling, pasteurisation, and cold-chain compliance add operational complexity.',
  'If new whey capacity normalises prices, the brand must stand on taste and utility rather than arbitrage alone.',
]

const launchSteps = [
  { step: '01', title: 'Lock the egg partner', body: 'The supply agreement is the moat: co-manufacturing, pricing, volume priority, and whey-independent input costs.' },
  { step: '02', title: 'Win the obsessive buyer', body: 'Seed DTC drops with gym-bro, r/protein, and macro-tracking communities who care about grams, carbs, and reorder value.' },
  { step: '03', title: 'Turn the whey crisis into media', body: 'Every whey price hike becomes a campaign for a shake that does not care about the whey curve.' },
  { step: '04', title: 'Prove taste in public', body: 'Run blind taste tests against Premier Protein, Fairlife-style shakes, and plant-based RTDs before grocery meetings.' },
]

const marketSignals = [
  { value: '$1.7B', label: 'egg white powder market in 2025', detail: 'A growing input market projected toward $2.4B by 2030 before counting finished RTD cartons.' },
  { value: '$8B+', label: 'broader egg protein market', detail: 'A mid-single-digit growth category with egg white as the largest, fastest-growing type.' },
  { value: '$29M', label: 'DTC run-rate scenario', detail: '50,000 subscribers buying a 12-pack monthly at roughly $4 per carton.' },
]

const competitors = [
  {
    title: 'Whey RTD incumbents',
    body: 'Premier Protein, Fairlife-style shakes, and other leaders own shelf space, but their input curve is exposed while whey prices remain elevated.',
  },
  {
    title: 'Plant-based RTDs',
    body: 'Pea, soy, and Ripple-style alternatives avoid dairy but still fight taste perception and amino-acid skepticism that egg white can sidestep.',
  },
  {
    title: 'Egg producers and powders',
    body: 'The Greek original, large egg companies, and powder tubs prove supply and demand exist, but nobody has made the mainstream English-market carton yet.',
  },
]

export default function EggWhiteProteinDrinks() {
  return (
    <div className="min-h-screen bg-[#fff8ec] text-stone-950">
      <Head>
        <title>Egg White Protein Drinks | Anycase</title>
        <meta
          name="description"
          content="A market map and launch plan for a clean-label egg white ready-to-drink protein brand in the US and UK."
        />
      </Head>

      <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#fff8ec]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-stone-950 text-amber-100">EW</span>
            Egg White Protein Drinks
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-stone-700 md:flex">
            <a href="#problem" className="hover:text-stone-950">Problem</a>
            <a href="#numbers" className="hover:text-stone-950">Numbers</a>
            <a href="#why-now" className="hover:text-stone-950">Why now</a>
            <a href="#market" className="hover:text-stone-950">Market</a>
            <a href="#model" className="hover:text-stone-950">Model</a>
            <a href="#launch" className="hover:text-stone-950">Launch</a>
            <a href="#risks" className="hover:text-stone-950">Risks</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden">
          <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-300/30 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/70 px-4 py-2 text-sm font-bold text-amber-900 shadow-sm">
                <Flame className="h-4 w-4" /> Whey-independent protein for a whey-constrained market
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                The clean carton hiding in the whey crisis.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 md:text-xl">
                Clone the proven Greek egg-white protein drink playbook for the US, UK, and Australia: one chilled Tetra Pak,
                50g+ complete protein, ultra-low carbs, and a supply chain built with egg producers instead of whey traders.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#launch" className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-bold text-white shadow-xl shadow-stone-900/20 hover:bg-stone-800">
                  Map the launch <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#model" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 font-bold text-stone-900 hover:border-stone-500">
                  See the business model
                </a>
              </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-md">
              <div className="rotate-2 rounded-[2.5rem] border-4 border-stone-950 bg-white p-6 shadow-2xl shadow-amber-900/20">
                <div className="rounded-[2rem] bg-gradient-to-br from-amber-100 via-white to-stone-100 p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">Chocolate</span>
                    <Sparkles className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="mt-10 text-center">
                    <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-800">Pasteurised egg white</p>
                    <p className="mt-3 text-8xl font-black tracking-tighter text-stone-950">55g</p>
                    <p className="text-2xl font-black text-stone-700">complete protein</p>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-2xl font-black">2.5g</p><p className="text-xs font-bold uppercase text-stone-500">carbs</p></div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-2xl font-black">5</p><p className="text-xs font-bold uppercase text-stone-500">ingredients</p></div>
                  </div>
                  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-950">
                    Not a whey shake. Not a powder tub. A ready-to-drink egg white carton for mainstream protein demand.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-4 md:grid-cols-5">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                <p className="text-4xl font-black tracking-tight text-stone-950">{stat.value}</p>
                <h2 className="mt-2 font-black text-stone-800">{stat.label}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{stat.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="problem" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-stone-950 p-8 text-white">
              <Users className="h-10 w-10 text-amber-300" />
              <h2 className="mt-5 text-4xl font-black tracking-tight">Protein demand has gone mainstream and medical.</h2>
              <p className="mt-5 text-lg leading-8 text-stone-300">
                Protein-maxxing is no longer just a gym behaviour. It now includes mainstream grocery shoppers, lactose-avoidant buyers,
                and a growing GLP-1 cohort that is being told to protect lean mass while losing weight.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {solutionPillars.map((pillar) => (
                <article key={pillar.title} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  <h3 className="mt-4 text-xl font-black">{pillar.title}</h3>
                  <p className="mt-3 leading-7 text-stone-600">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="numbers" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-[2rem] border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-900/5 md:p-10">
            <p className="font-black uppercase tracking-[0.25em] text-amber-700">Key numbers</p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {marketNumbers.map((item) => (
                <article key={item.title} className="rounded-3xl bg-amber-50 p-6">
                  <item.icon className="h-9 w-9 text-amber-700" />
                  <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
                  <p className="mt-3 leading-7 text-stone-700">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="why-now" className="bg-stone-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-stone-950"><TrendingUp className="h-4 w-4" /> Why now</div>
              <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">Demand is rising while whey supply is on fire.</h2>
              <p className="mt-5 text-lg leading-8 text-stone-300">Protein has gone mainstream, GLP-1 users need muscle-preserving nutrition, and whey brands are facing historic input pressure. Egg white protein creates a supply-chain arbitrage with real consumer utility.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {whyNow.map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                  <p className="mt-4 font-semibold leading-7 text-stone-100">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="market" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-black text-amber-900">
                <Users className="h-4 w-4" /> Market map
              </div>
              <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
                A big RTD protein pool with an empty egg-white lane.
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-600">
                The target is not to outspend every incumbent on day one. It is to own a defensible niche
                while whey-based shakes absorb historic input pressure and shoppers search for cleaner,
                lactose-free, complete-protein formats.
              </p>
              <div className="mt-8 rounded-3xl border border-stone-200 bg-stone-950 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">ARR potential</p>
                <p className="mt-3 text-2xl font-black">A $20M–$40M DTC-plus-gym brand is plausible before grocery unlocks the ceiling.</p>
                <p className="mt-3 leading-7 text-stone-300">
                  Capturing even a small share of RTD protein shake spend can create a nine-figure opportunity,
                  but the realistic first milestone is subscription retention, gym-fridge velocity, and proof that the hero SKU reorders.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              {marketSignals.map((signal) => (
                <article key={signal.label} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                  <p className="text-4xl font-black tracking-tight text-stone-950">{signal.value}</p>
                  <h3 className="mt-2 text-xl font-black text-stone-800">{signal.label}</h3>
                  <p className="mt-2 leading-7 text-stone-600">{signal.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="model" className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-black uppercase tracking-[0.25em] text-amber-700">Business model</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Start narrow. Own supply. Widen into grocery.</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-stone-600">The wedge is one great-tasting carton for obsessive buyers. The platform is a protein input curve that does not move with whey.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {modelCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-stone-200 bg-white p-7 shadow-lg shadow-amber-900/5">
                <card.icon className="h-9 w-9 text-amber-700" />
                <h3 className="mt-5 text-2xl font-black">{card.title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-amber-900/5 md:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900">
                  <Trophy className="h-4 w-4" /> Competition
                </div>
                <h2 className="mt-5 text-4xl font-black tracking-tight">The category leader slot is still empty.</h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-stone-600">
                The threat is not that egg white RTD fails. The threat is that a major egg producer or whey incumbent sees the same arbitrage and ships first.
              </p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {competitors.map((competitor) => (
                <article key={competitor.title} className="rounded-3xl bg-stone-50 p-6">
                  <h3 className="text-2xl font-black">{competitor.title}</h3>
                  <p className="mt-3 leading-7 text-stone-600">{competitor.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="launch" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-[2rem] bg-amber-300 p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                <Target className="h-10 w-10" />
                <h2 className="mt-5 text-4xl font-black tracking-tight">Go-to-market sequence</h2>
                <p className="mt-4 leading-7 text-stone-800">Validate taste and reorder before chasing broad retail. The fastest route is supply lock-in first, audience proof second, grocery leverage third.</p>
              </div>
              <div className="grid gap-4">
                {launchSteps.map((step) => (
                  <article key={step.step} className="rounded-3xl bg-white p-5 shadow-sm md:flex md:gap-5">
                    <span className="text-3xl font-black text-amber-700">{step.step}</span>
                    <div>
                      <h3 className="text-xl font-black">{step.title}</h3>
                      <p className="mt-2 leading-7 text-stone-600">{step.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-stone-200 bg-white p-7 shadow-lg shadow-amber-900/5">
              <Stethoscope className="h-9 w-9 text-amber-700" />
              <h3 className="mt-5 text-2xl font-black">Medicalised protein demand</h3>
              <p className="mt-3 leading-7 text-stone-600">The GLP-1 cohort changes the buyer map: protein is no longer only a performance goal, it is part of preserving lean mass during rapid weight loss.</p>
            </article>
            <article className="rounded-3xl border border-stone-200 bg-white p-7 shadow-lg shadow-amber-900/5">
              <Flame className="h-9 w-9 text-amber-700" />
              <h3 className="mt-5 text-2xl font-black">Whey crisis as marketing</h3>
              <p className="mt-3 leading-7 text-stone-600">The message is simple: the protein shake that does not care about the whey crisis. Every incumbent price hike makes the contrast easier to explain.</p>
            </article>
            <article className="rounded-3xl border border-stone-200 bg-white p-7 shadow-lg shadow-amber-900/5">
              <PackageCheck className="h-9 w-9 text-amber-700" />
              <h3 className="mt-5 text-2xl font-black">Cheap validation path</h3>
              <p className="mt-3 leading-7 text-stone-600">Source Greek cartons or a white-label pilot, put them in front of 100 protein-maxxers, and measure finish rate, taste feedback, and reorder intent.</p>
            </article>
          </div>
        </section>

        <section id="risks" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <AlertTriangle className="h-9 w-9 text-red-600" />
              <h2 className="mt-4 text-3xl font-black">Risks to underwrite</h2>
              <div className="mt-6 space-y-4">
                {risks.map((risk) => <p key={risk} className="font-semibold leading-7 text-red-950">• {risk}</p>)}
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <ShieldCheck className="h-9 w-9 text-emerald-700" />
              <h2 className="mt-4 text-3xl font-black">What makes it defensible</h2>
              <div className="mt-6 space-y-4 text-emerald-950">
                <p className="font-semibold leading-7">• Supply contracts with major egg producers before incumbents care.</p>
                <p className="font-semibold leading-7">• A hero chocolate SKU that publicly beats taste objections.</p>
                <p className="font-semibold leading-7">• DTC community proof and gym-fridge velocity before grocery expansion.</p>
                <p className="font-semibold leading-7">• A clean-label, lactose-free alternative that remains useful even if whey normalises.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-amber-900/10 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center">
            <p className="font-black uppercase tracking-[0.3em] text-amber-700">Validation sprint</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Source cartons, serve 100 protein obsessives, measure finish rate and reorder.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-600">
              The cheapest proof is not a national launch. It is the Greek carton, a white-label pilot, or a small co-manufactured batch in front of the buyers who already read nutrition labels like spec sheets.
              If they finish the drink, share the macro screenshot, and subscribe, the grocery story writes itself.
            </p>
            <a href="#top" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-bold text-white shadow-xl shadow-stone-900/20 hover:bg-stone-800">
              Crack on <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
