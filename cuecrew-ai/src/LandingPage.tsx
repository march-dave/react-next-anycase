import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const personas = [
  { name: 'Fact-checker', color: 'var(--color-tag-fact)', sample: 'Claim check ready' },
  { name: 'Context Provider', color: 'var(--color-tag-context)', sample: 'Timeline surfaced' },
  { name: 'Comedy Writer', color: 'var(--color-tag-joke)', sample: 'Punchline queued' },
  { name: 'News Anchor', color: 'var(--color-tag-news)', sample: 'Breaking update found' },
];

function SineBars() {
  return (
    <div className="flex items-end gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded bg-[var(--color-accent-blue)]"
          animate={{ height: [6, 18, 8, 14, 6] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

export default function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <nav className="mb-16 flex items-center justify-between">
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
          Cue<span style={{ color: 'var(--color-accent-gold)' }}>crew</span>.ai
        </h1>
        <button onClick={onLaunch} className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10">
          Try Demo
        </button>
      </nav>

      <div className="grid items-center gap-10 md:grid-cols-2">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-[var(--color-text-dim)]">
            <Sparkles size={14} />
            Your real-time AI production crew
          </span>
          <h2 className="mt-6 text-5xl leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            Never record <span style={{ color: 'var(--color-accent-gold)' }}>alone again</span>.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-[var(--color-text-dim)]">
            Cuecrew.ai listens to your live show and sends instant facts, context, punch-ups, and breaking updates while
            you stay focused on hosting.
          </p>
          <button
            onClick={onLaunch}
            className="mt-8 rounded-full bg-[var(--color-accent-blue)] px-6 py-3 font-medium text-black hover:opacity-90"
          >
            Launch Studio
          </button>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[var(--color-card-bg)] p-6 shadow-2xl shadow-black/30">
          <p className="mb-5 text-sm text-[var(--color-text-dim)]">Crew activity</p>
          <div className="grid grid-cols-2 gap-4">
            {personas.map((persona, index) => (
              <motion.div
                key={persona.name}
                className="flex min-h-[130px] flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                animate={{ y: [0, -3, 0], scale: [1, 1.01, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.12 }}
              >
                <div className="mb-2 h-11 w-11 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, ${persona.color}, #0a0a0c)` }} />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm">{persona.name}</p>
                    <p className="text-xs text-[var(--color-text-dim)]">{persona.sample}</p>
                  </div>
                  <SineBars />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
