import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Mic, MicOff, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import { getPersonaResponses } from './gemini';
import type { PersonaResponses, TranscriptSegment } from './types';

type Props = { onBack: () => void };

type SpeechRecognitionResultItem = { transcript: string };
type SpeechRecognitionResultLike = { isFinal: boolean; 0: SpeechRecognitionResultItem };
type SpeechRecognitionEventLike = { resultIndex: number; results: ArrayLike<SpeechRecognitionResultLike> };

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionCtor;
    SpeechRecognition?: SpeechRecognitionCtor;
  }
}

const personaMeta: { key: keyof PersonaResponses; label: string; color: string }[] = [
  { key: 'factChecker', label: 'Fact-checker', color: 'var(--color-tag-fact)' },
  { key: 'contextProvider', label: 'Context Provider', color: 'var(--color-tag-context)' },
  { key: 'comedyWriter', label: 'Comedy Writer', color: 'var(--color-tag-joke)' },
  { key: 'newsAnchor', label: 'News Anchor', color: 'var(--color-tag-news)' },
];

export default function DemoApp({ onBack }: Props) {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [fallbackText, setFallbackText] = useState('');
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const latestSegment = useMemo(() => segments[segments.length - 1], [segments]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportsSpeech(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript.trim();

        if (event.results[i].isFinal) {
          void pushFinalSegment(transcript);
        } else {
          interim += `${transcript} `;
        }
      }
      setInterimText(interim.trim());
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => {
      if (isRecording) recognition.start();
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [isRecording]);

  const pushFinalSegment = async (text: string) => {
    if (!text.trim()) return;

    const id = crypto.randomUUID();
    setSegments((prev) => [...prev, { id, text }]);
    setInterimText('');

    const personaResponses = await getPersonaResponses(text);
    setSegments((prev) => prev.map((seg) => (seg.id === id ? { ...seg, personaResponses } : seg)));
  };

  const toggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-md border border-white/20 p-2 hover:bg-white/10">
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-serif)' }}>
            Cue<span style={{ color: 'var(--color-accent-gold)' }}>crew</span>.ai
          </h1>
          <span className="ml-2 flex items-center gap-2 text-sm text-red-400">
            <motion.span
              className="h-2 w-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            Live Studio
          </span>
        </div>
        <button
          onClick={toggleRecording}
          disabled={!supportsSpeech}
          className="rounded-full bg-[var(--color-accent-blue)] px-4 py-2 text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </header>

      <main className="flex h-[calc(100vh-73px)] min-h-0 pb-[80px]">
        <section className="relative flex min-h-0 flex-1 flex-col border-r border-white/10">
          <div className="border-b border-white/10 px-5 py-4 text-sm text-[var(--color-text-dim)]">Current Episode: Live Transcript</div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 pb-24">
            {segments.length === 0 && (
              <article className="rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-[var(--color-text-dim)]">
                Start recording or type below to begin your live transcript.
              </article>
            )}
            {segments.map((segment) => (
              <article key={segment.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {segment.text}
              </article>
            ))}
            {interimText && (
              <article className="rounded-xl border border-dashed border-[var(--color-accent-blue)] px-4 py-3 text-sm text-[var(--color-text-dim)]">
                {interimText}
              </article>
            )}
          </div>

          <form
            className="absolute bottom-0 left-0 right-0 flex gap-2 border-t border-white/10 bg-[var(--color-card-bg)] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void pushFinalSegment(fallbackText);
              setFallbackText('');
            }}
          >
            <input
              value={fallbackText}
              onChange={(e) => setFallbackText(e.target.value)}
              placeholder={supportsSpeech ? 'Fallback text input...' : 'Speech unsupported; type your transcript...'}
              className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button disabled={!fallbackText.trim()} className="rounded-lg border border-white/20 px-3 py-2 text-sm disabled:opacity-50">
              Submit
            </button>
          </form>
        </section>

        <aside className="w-[340px] border-l border-white/10 bg-[var(--color-card-bg)]">
          <div className="border-b border-white/10 px-5 py-4 text-sm text-[var(--color-text-dim)]">Live Crew Intelligence</div>
          <div className="space-y-3 p-4">
            {personaMeta.map((persona) => {
              const response = latestSegment?.personaResponses?.[persona.key];
              const active = Boolean(response);
              return (
                <div
                  key={persona.key}
                  className={`rounded-xl border p-3 transition ${active ? 'border-white/30 bg-white/10' : 'border-white/10 opacity-45 grayscale'}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: persona.color }} />
                      {persona.label}
                    </div>
                    {active && (
                      <div className="flex items-end gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1 rounded bg-[var(--color-accent-blue)]"
                            animate={{ height: [4, 14, 6] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-dim)]">{response || 'Standing by.'}</p>
                </div>
              );
            })}
          </div>
        </aside>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 flex h-[80px] items-center gap-3 border-t border-white/10 bg-[var(--color-bg-dark)] px-6">
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm">
          {isRecording ? <MicOff className="inline" size={14} /> : <Mic className="inline" size={14} />} Mute Host
        </button>
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm">AI Sensitivity: High</button>
        <button className="rounded-full bg-red-500/90 px-4 py-2 text-sm">End Session</button>
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm">
          <Radio className="mr-1 inline" size={14} />
          Invite Crew Member
        </button>
      </footer>
    </div>
  );
}
