import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import ChatBubbleMarkdown from '@/components/ChatBubbleMarkdown';
import DarkModeToggle from '@/components/DarkModeToggle';
import ClearChatButton from '@/components/ClearChatButton';
import ExportChatButton from '@/components/ExportChatButton';
import DownloadChatButton from '@/components/DownloadChatButton';
import TypingIndicator from '@/components/TypingIndicator';

const STORAGE_KEY = 'chatgptMessages';
const SETTINGS_KEY = 'chatgptUiSettings';
const PR_TEMPLATE_STORAGE_KEY = 'chatgptUiPrTemplate';
const PROMPT_FAVORITES_STORAGE_KEY = 'chatgptUiFavoritePrompts';

const promptSuggestions = [
  {
    id: 'summarize-meeting',
    title: 'Summarize a meeting',
    description: 'Turn long notes into concise action items.',
    prompt:
      'Summarize the following meeting transcript into concise action items and key decisions:\n\n',
    tags: ['Meetings', 'Summaries'],
  },
  {
    id: 'draft-release-notes',
    title: 'Draft release notes',
    description: 'Highlight what changed in a friendly tone.',
    prompt:
      'Create release notes for the following list of updates. Include a short intro and grouped bullet points:\n\n',
    tags: ['Product', 'Announcements'],
  },
  {
    id: 'summarize-change-set',
    title: 'Summarize a change set',
    description: 'Surface the motivation, key commits, and follow-up actions.',
    prompt:
      'Write a reviewer-friendly summary for this list of changes. Call out the motivation, the high-level approach, key files to inspect, and any follow-up actions reviewers should know about.\n\n',
    tags: ['Collaboration', 'Summaries'],
  },
  {
    id: 'explain-concept',
    title: 'Explain a concept',
    description: 'Request an accessible explanation with examples.',
    prompt:
      'Explain the following concept to a new developer. Use a real-world analogy and list common pitfalls:\n\n',
    tags: ['Education', 'Guides'],
  },
  {
    id: 'draft-pr-summary',
    title: 'Draft a pull request summary',
    description: 'Capture key changes, test coverage, and where to cite supporting context or screenshots.',
    prompt:
      'Write a concise pull request summary for the following changes. Include the motivation, the key updates, tests that ran, and call out where the supporting files, logs, or screenshots should be cited:' +
      '\n\n',
    tags: ['Collaboration', 'Pull Request'],
  },
  {
    id: 'outline-verification',
    title: 'Outline verification steps',
    description: 'List the manual and automated checks to run before shipping.',
    prompt:
      'Given the following feature work, outline a test plan that lists the manual checks, automated suites, and any follow-up verification needed before release. Close with expected outcomes for each step.\n\n',
    tags: ['Quality', 'Pull Request'],
  },
  {
    id: 'plan-rollout',
    title: 'Plan rollout messaging',
    description: 'Draft changelog highlights, customer comms, and internal alerts.',
    prompt:
      'Create rollout messaging for the following update. Include a short changelog summary, internal enablement notes, customer-facing announcement copy, and any dashboards or alerts to monitor.\n\n',
    tags: ['Product', 'Announcements'],
  },
  {
    id: 'brainstorm-ideas',
    title: 'Brainstorm ideas',
    description: 'Generate creative approaches for a problem.',
    prompt:
      'Brainstorm five creative feature ideas for a productivity app that helps remote teams collaborate asynchronously.',
    tags: ['Productivity', 'Ideation'],
  },
];

const DEFAULT_PR_TEMPLATE = [
  '**Summary**',
  '* Motivation and background. 【F:path/to/file†L#-L#】',
  '* Key implementation changes. 【F:path/to/file†L#-L#】',
  '* Follow-up guardrails or next steps. 【F:path/to/file†L#-L#】',
  '',
  '**Impact & Risks**',
  '* Who is affected and what trade-offs or mitigations should reviewers note?',
  '',
  '**Regression risks**',
  '* Highlight the riskiest surfaces, mitigations, and fallback plans to monitor. 【F:path/to/file†L#-L#】',
  '',
  '**Security & Privacy**',
  '* Permissions, data retention, or threat model considerations. 【F:path/to/file†L#-L#】',
  '',
  '**Accessibility**',
  '* Screen reader / keyboard checks and any follow-up tasks. 【F:path/to/file†L#-L#】',
  '',
  '**User Experience**',
  '* UI states, content updates, or responsive nuances to highlight. 【F:path/to/file†L#-L#】',
  '',
  '**Performance**',
  '* Benchmarks, profiling output, or observed regressions. 【F:path/to/file†L#-L#】',
  '',
  '**Analytics & Monitoring**',
  '* Dashboards, alerts, or events to watch after release. 【F:path/to/file†L#-L#】',
  '',
  '**Screenshots / Recordings**',
  '* ![Screenshot description](artifacts/filename.png)',
  '',
  '**Artifacts & References**',
  '* Logs: 【chunk†L#-L#】 — call out the signal that confirms the change.',
  '* Docs: [Design doc](https://link) — note supporting context or tickets.',
  '',
  '**Testing**',
  '* ✅ `command or suite` — Passed locally. 【chunk†L#-L#】',
  '',
  '**Manual Verification**',
  '* Walk through manual checks or sign-offs completed before handoff. 【F:path/to/file†L#-L#】',
  '',
  '**Documentation & Support**',
  '* Release notes, runbooks, or help-center updates to keep in sync. 【F:path/to/file†L#-L#】',
  '',
  '**Dependencies**',
  '* New packages, version bumps, or migrations reviewers should flag. 【F:path/to/file†L#-L#】',
  '',
  '**Feature flags**',
  '* Flag defaults, rollout steps, and clean-up owners. 【F:path/to/file†L#-L#】',
  '',
  '**Rollout / Follow-up**',
  '* Launch steps, feature flags, or clean-up tasks.',
  '',
  '**Known issues**',
  '* Outstanding bugs, limitations, or tickets to monitor.',
].join('\n');
const DEFAULT_PR_TEMPLATE_TRIMMED = DEFAULT_PR_TEMPLATE.trim();

const PR_TEST_SNIPPETS = {
  pass: '* ✅ `command or suite` — Passed locally. 【chunk†L#-L#】',
  warn: '* ⚠️ `command or suite` — Needs follow-up or is flaky. 【chunk†L#-L#】',
  fail: '* ❌ `command or suite` — Failing and requires attention. 【chunk†L#-L#】',
};

const PR_SECTION_SNIPPETS = [
  {
    id: 'impact',
    label: 'Impact & Risks',
    heading: '**Impact & Risks**',
    helperText: 'Spell out user benefit, technical trade-offs, and mitigations.',
    snippet: ['**Impact & Risks**', '* Who is affected and what trade-offs or mitigations should reviewers note?'].join('\n'),
  },
  {
    id: 'regression-risks',
    label: 'Regression risks',
    heading: '**Regression risks**',
    helperText: 'Call out the riskiest areas, safeguards, and rollback plans.',
    snippet: [
      '**Regression risks**',
      '* Highlight the riskiest surfaces, mitigations, and fallback plans to monitor. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'security',
    label: 'Security & Privacy',
    heading: '**Security & Privacy**',
    helperText: 'Note auth changes, data handling, or privacy reviews.',
    snippet: [
      '**Security & Privacy**',
      '* Permissions, data retention, or threat model considerations. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    heading: '**Accessibility**',
    helperText: 'Capture screen reader notes, color contrast, or keyboard navigation results.',
    snippet: [
      '**Accessibility**',
      '* Screen reader / keyboard checks and any follow-up tasks. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'ux',
    label: 'User experience',
    heading: '**User Experience**',
    helperText: 'Call out UI states, edge cases, or responsive considerations.',
    snippet: [
      '**User Experience**',
      '* Detail UI flows, empty states, or responsive behavior updates. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'perf',
    label: 'Performance',
    heading: '**Performance**',
    helperText: 'Describe metrics, load-testing snapshots, or profiling takeaways.',
    snippet: [
      '**Performance**',
      '* Benchmarks, profiling output, or observed regressions. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'analytics',
    label: 'Analytics & Monitoring',
    heading: '**Analytics & Monitoring**',
    helperText: 'Call out dashboards, alerts, or events to watch after launch.',
    snippet: [
      '**Analytics & Monitoring**',
      '* Dashboards, alerts, or events to watch after release. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'rollout',
    label: 'Rollout plan',
    heading: '**Rollout / Follow-up**',
    helperText: 'List launch steps, flags, alerts, or communications to coordinate.',
    snippet: ['**Rollout / Follow-up**', '* Launch steps, feature flags, or clean-up tasks.'].join('\n'),
  },
  {
    id: 'docs',
    label: 'Documentation & Support',
    heading: '**Documentation & Support**',
    helperText: 'Call out docs, runbooks, or support updates that ship with the change.',
    snippet: [
      '**Documentation & Support**',
      '* Release notes, runbooks, or help-center updates to keep in sync. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'manual-verification',
    label: 'Manual verification',
    heading: '**Manual Verification**',
    helperText: 'Outline sign-off steps, QA flows, or reviewer walkthroughs.',
    snippet: [
      '**Manual Verification**',
      '* Walk through manual checks or sign-offs completed before handoff. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    heading: '**Dependencies**',
    helperText: 'Highlight package bumps, migrations, or new services reviewers should double-check.',
    snippet: [
      '**Dependencies**',
      '* New packages, version bumps, or migrations reviewers should flag. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
  {
    id: 'feature-flags',
    label: 'Feature flags',
    heading: '**Feature flags**',
    helperText: 'Document default states, rollout plans, and who owns cleanup.',
    snippet: [
      '**Feature flags**',
      '* Flag defaults, rollout steps, and clean-up owners. 【F:path/to/file†L#-L#】',
    ].join('\n'),
  },
];

const PR_REFERENCE_SNIPPETS = [
  {
    id: 'logs',
    label: 'Add log citation',
    helperText: 'Point reviewers to saved logs, traces, or analytics excerpts.',
    snippet: '* Logs: 【chunk†L#-L#】 — highlight the signal that verifies the change.',
  },
  {
    id: 'screenshot',
    label: 'Add screenshot placeholder',
    helperText: 'Remind yourself to attach updated UI proof with alt text.',
    snippet: '* ![Screenshot description](artifacts/filename.png) — note the flow that is covered.',
  },
  {
    id: 'metrics',
    label: 'Add metrics snapshot',
    helperText: 'Point reviewers to dashboards or quantitative proof.',
    snippet: '* Metrics: 【chunk†L#-L#】 — summarize the movement you expect to see.',
  },
  {
    id: 'docs',
    label: 'Link supporting docs',
    helperText: 'Reference design docs, tickets, or architectural discussions.',
    snippet: '* Docs: [Design doc](https://link) — explain what extra context it provides.',
  },
  {
    id: 'video',
    label: 'Add video placeholder',
    helperText: 'Drop a reminder for walkthrough GIFs or recordings.',
    snippet: '* 📹 Video: [Recording](https://link) — show the before/after flow.',
  },
  {
    id: 'dependency-diff',
    label: 'Add dependency diff',
    helperText: 'Call out package bumps, migrations, or infra updates reviewers should vet.',
    snippet: '* Dependencies: `package@version` — rationale, testing notes, and follow-up tasks.',
  },
  {
    id: 'feature-flag-tracker',
    label: 'Add feature flag tracker',
    helperText: 'Track default states, rollout checkpoints, or cleanup owners for toggles.',
    snippet: '* Feature flag: `flag_name` — default state, rollout milestones, and cleanup owner.',
  },
];

const MAX_SUMMARY_PREVIEW_LENGTH = 200;

function countWords(text) {
  if (typeof text !== 'string') {
    return 0;
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

function formatTimestampForDisplay(timestamp, fallback = '') {
  if (!timestamp) {
    return fallback || '';
  }
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return fallback || '';
  }
  return parsed.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

function formatTimeLabel(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '';
  }
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (totalMinutes < 60) {
    return seconds ? `${totalMinutes}m ${seconds}s` : `${totalMinutes}m`;
  }
  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (totalHours < 24) {
    return minutes ? `${totalHours}h ${minutes}m` : `${totalHours}h`;
  }
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return hours ? `${days}d ${hours}h` : `${days}d`;
}

function formatGapDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '';
  }
  if (ms < 1000) {
    return '<1s';
  }
  return formatDuration(ms);
}

function formatPercentage(value) {
  if (!Number.isFinite(value)) {
    return '0%';
  }
  const clamped = Math.max(0, Math.min(1, value));
  if (clamped === 0) {
    return '0%';
  }
  if (clamped === 1) {
    return '100%';
  }
  const percentage = clamped * 100;
  return percentage >= 10 ? `${Math.round(percentage)}%` : `${percentage.toFixed(1)}%`;
}

function formatAverageWords(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0';
  }
  return value >= 10 ? Math.round(value).toString() : value.toFixed(1);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return value.toLocaleString();
}

function formatWordAndCharLabel(words, characters) {
  if (!Number.isFinite(words) || words <= 0) {
    return '';
  }
  const wordLabel = `${formatNumber(words)} ${words === 1 ? 'word' : 'words'}`;
  if (!Number.isFinite(characters) || characters <= 0) {
    return wordLabel;
  }
  return `${wordLabel} (${formatNumber(characters)} ${characters === 1 ? 'char' : 'chars'})`;
}

export default function ChatGptUIPersist() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showPrHelper, setShowPrHelper] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [promptSearch, setPromptSearch] = useState('');
  const [promptTagFilter, setPromptTagFilter] = useState(null);
  const [favoritePromptIds, setFavoritePromptIds] = useState([]);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [prTemplateText, setPrTemplateText] = useState(DEFAULT_PR_TEMPLATE);
  const [prCopyStatus, setPrCopyStatus] = useState('');
  const [insightsCopyStatus, setInsightsCopyStatus] = useState('');
  const [quickInsightsCopyStatus, setQuickInsightsCopyStatus] = useState('');
  const [snapshotCopyStatus, setSnapshotCopyStatus] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const promptLibraryButtonRef = useRef(null);
  const promptLibrarySearchRef = useRef(null);
  const promptLibraryHasOpened = useRef(false);
  const prHelperButtonRef = useRef(null);
  const prHelperTextareaRef = useRef(null);
  const prHelperHasOpened = useRef(false);
  const prTemplateHydrated = useRef(false);
  const promptFavoritesHydrated = useRef(false);
  const insightsButtonRef = useRef(null);
  const insightsDialogRef = useRef(null);
  const insightsHasOpened = useRef(false);
  const [prInsightsAppendStatus, setPrInsightsAppendStatus] = useState('');
  const disableSend = loading || !input.trim();
  const draftWordCount = countWords(input);
  const draftCharacterCount = input.length;
  const draftStatsText = `Draft length: ${formatNumber(draftWordCount)} ${
    draftWordCount === 1 ? 'word' : 'words'
  } · ${formatNumber(draftCharacterCount)} ${draftCharacterCount === 1 ? 'char' : 'chars'}`;
  const modelName = process.env.NEXT_PUBLIC_OPENAI_MODEL;
  const messageCount = messages.length;
  const titleBase = `ChatGPT UI (Persistent)${modelName ? ` - ${modelName}` : ''}`;
  const title = `${titleBase}${messageCount ? ` - ${messageCount} message${messageCount > 1 ? 's' : ''}` : ''}`;
  const trimmedSystemPrompt = useMemo(() => systemPrompt.trim(), [systemPrompt]);
  const systemPromptPreview = useMemo(() => {
    if (!trimmedSystemPrompt) return '';
    return trimmedSystemPrompt.length > 80
      ? `${trimmedSystemPrompt.slice(0, 77)}...`
      : trimmedSystemPrompt;
  }, [trimmedSystemPrompt]);
  const conversationInsights = useMemo(() => {
    if (messages.length === 0) {
      return {
        total: 0,
        userCount: 0,
        assistantCount: 0,
        totalWords: 0,
        userWords: 0,
        assistantWords: 0,
        totalCharacters: 0,
        userCharacters: 0,
        assistantCharacters: 0,
        averageWordsPerMessage: 0,
        firstTimestamp: null,
        firstTimeLabel: '',
        lastTimestamp: null,
        lastTimeLabel: '',
        durationMs: 0,
        longestUserWords: 0,
        longestAssistantWords: 0,
        longestUserCharacters: 0,
        longestAssistantCharacters: 0,
        longestGapMs: 0,
      };
    }

    let userCount = 0;
    let assistantCount = 0;
    let totalWords = 0;
    let userWords = 0;
    let assistantWords = 0;
    let totalCharacters = 0;
    let userCharacters = 0;
    let assistantCharacters = 0;
    const orderedMessages = [];
    let longestUserWords = 0;
    let longestAssistantWords = 0;
    let longestUserCharacters = 0;
    let longestAssistantCharacters = 0;
    let previousTimestampMs = null;
    let longestGapMs = 0;

    for (const message of messages) {
      if (!message || typeof message !== 'object') {
        continue;
      }
      orderedMessages.push(message);
      const rawText =
        typeof message.text === 'string'
          ? message.text
          : message.text != null
          ? String(message.text)
          : '';
      const wordCount = countWords(rawText);
      const charCount = rawText.length;
      totalWords += wordCount;
      totalCharacters += charCount;
      if (message.role === 'user') {
        userCount += 1;
        userWords += wordCount;
        userCharacters += charCount;
        if (wordCount > longestUserWords) {
          longestUserWords = wordCount;
          longestUserCharacters = charCount;
        }
      } else if (message.role === 'assistant') {
        assistantCount += 1;
        assistantWords += wordCount;
        assistantCharacters += charCount;
        if (wordCount > longestAssistantWords) {
          longestAssistantWords = wordCount;
          longestAssistantCharacters = charCount;
        }
      }

      if (message.timestamp) {
        const timestampMs = new Date(message.timestamp).getTime();
        if (!Number.isNaN(timestampMs)) {
          if (previousTimestampMs != null) {
            const gap = timestampMs - previousTimestampMs;
            if (Number.isFinite(gap) && gap > longestGapMs) {
              longestGapMs = gap;
            }
          }
          previousTimestampMs = timestampMs;
        }
      }
    }

    if (orderedMessages.length === 0) {
      return {
        total: 0,
        userCount: 0,
        assistantCount: 0,
        totalWords: 0,
        userWords: 0,
        assistantWords: 0,
        totalCharacters: 0,
        userCharacters: 0,
        assistantCharacters: 0,
        averageWordsPerMessage: 0,
        firstTimestamp: null,
        firstTimeLabel: '',
        lastTimestamp: null,
        lastTimeLabel: '',
        durationMs: 0,
        longestUserWords: 0,
        longestAssistantWords: 0,
        longestUserCharacters: 0,
        longestAssistantCharacters: 0,
        longestGapMs: 0,
      };
    }

    const firstWithTimestamp = orderedMessages.find((msg) => msg.timestamp);
    const lastWithTimestamp = [...orderedMessages].reverse().find((msg) => msg.timestamp);
    const firstWithTime = orderedMessages.find((msg) => typeof msg.time === 'string' && msg.time);
    const lastWithTime = [...orderedMessages].reverse().find((msg) => typeof msg.time === 'string' && msg.time);

    const firstTimestamp = firstWithTimestamp?.timestamp ?? null;
    const lastTimestamp = lastWithTimestamp?.timestamp ?? null;
    const firstTimeLabel = firstWithTime?.time ?? '';
    const lastTimeLabel = lastWithTime?.time ?? '';

    let durationMs = 0;
    if (firstTimestamp && lastTimestamp) {
      const start = new Date(firstTimestamp).getTime();
      const end = new Date(lastTimestamp).getTime();
      if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
        durationMs = end - start;
      }
    }

    const totalMessages = orderedMessages.length;
    const averageWordsPerMessage = totalMessages ? totalWords / totalMessages : 0;

    return {
      total: totalMessages,
      userCount,
      assistantCount,
      totalWords,
      userWords,
      assistantWords,
      totalCharacters,
      userCharacters,
      assistantCharacters,
      averageWordsPerMessage,
      firstTimestamp,
      firstTimeLabel,
      lastTimestamp,
      lastTimeLabel,
      durationMs,
      longestUserWords,
      longestAssistantWords,
      longestUserCharacters,
      longestAssistantCharacters,
      longestGapMs,
    };
  }, [messages]);
  const messageStats = useMemo(() => {
    if (conversationInsights.total === 0) {
      return {
        total: 0,
        userCount: 0,
        assistantCount: 0,
        lastTimestamp: null,
        lastTimeLabel: '',
      };
    }

    return {
      total: conversationInsights.total,
      userCount: conversationInsights.userCount,
      assistantCount: conversationInsights.assistantCount,
      lastTimestamp: conversationInsights.lastTimestamp,
      lastTimeLabel: conversationInsights.lastTimeLabel,
    };
  }, [conversationInsights]);
  const hasMessages = conversationInsights.total > 0;
  const lastReplyDisplay = hasMessages
    ? formatTimestampForDisplay(messageStats.lastTimestamp, messageStats.lastTimeLabel)
    : '';
  const conversationDurationText = conversationInsights.durationMs
    ? formatDuration(conversationInsights.durationMs)
    : '';
  const firstActivityDisplay = hasMessages
    ? formatTimestampForDisplay(
        conversationInsights.firstTimestamp,
        conversationInsights.firstTimeLabel
      )
    : '';
  const averageWordsPerMessageDisplay = hasMessages
    ? formatAverageWords(conversationInsights.averageWordsPerMessage)
    : '0';
  const longestMessageInfo = useMemo(() => {
    if (!hasMessages) {
      return null;
    }
    const {
      longestUserWords,
      longestAssistantWords,
      longestUserCharacters,
      longestAssistantCharacters,
    } = conversationInsights;
    const userIsLongest = longestUserWords >= longestAssistantWords;
    const words = userIsLongest ? longestUserWords : longestAssistantWords;
    const characters = userIsLongest ? longestUserCharacters : longestAssistantCharacters;
    if (!words) {
      return null;
    }
    return {
      owner: userIsLongest ? 'You' : 'Assistant',
      words,
      characters,
    };
  }, [conversationInsights, hasMessages]);
  const longestMessageDisplay = longestMessageInfo
    ? `${longestMessageInfo.owner} — ${formatWordAndCharLabel(
        longestMessageInfo.words,
        longestMessageInfo.characters
      )}`
    : '';
  const longestMessageAria = longestMessageInfo
    ? `${longestMessageInfo.owner} ${formatWordAndCharLabel(
        longestMessageInfo.words,
        longestMessageInfo.characters
      )}`
    : '';
  const longestPauseDisplay = hasMessages
    ? formatGapDuration(conversationInsights.longestGapMs)
    : '';
  const wordShareDisplay = hasMessages && conversationInsights.totalWords > 0
    ? `${formatPercentage(conversationInsights.userWords / conversationInsights.totalWords)} you / ${formatPercentage(
        conversationInsights.assistantWords / conversationInsights.totalWords
      )} assistant`
    : '';
  const longestMessageDescription = hasMessages
    ? longestMessageDisplay || 'Waiting for the next update.'
    : 'Waiting for the first message.';
  const longestPauseDescription = hasMessages
    ? longestPauseDisplay || 'Waiting for additional replies.'
    : 'Waiting for the first message.';
  const insightsSummaryText = useMemo(() => {
    if (!hasMessages) {
      return 'No conversation yet — start chatting to generate insights.';
    }

    const lines = [
      'Conversation insights',
      `Messages: ${formatNumber(conversationInsights.total)} (${formatNumber(
        conversationInsights.userCount
      )} you / ${formatNumber(conversationInsights.assistantCount)} assistant)`,
      `Words: ${formatNumber(conversationInsights.totalWords)} total (avg ${averageWordsPerMessageDisplay} per message)`,
      `Characters: ${formatNumber(conversationInsights.totalCharacters)} total`,
    ];

    const durationText = formatDuration(conversationInsights.durationMs);
    if (durationText) {
      lines.push(`Duration: ${durationText}`);
    }

    const started = formatTimestampForDisplay(
      conversationInsights.firstTimestamp,
      conversationInsights.firstTimeLabel
    );
    if (started) {
      lines.push(`Started: ${started}`);
    }

    const last = formatTimestampForDisplay(
      conversationInsights.lastTimestamp,
      conversationInsights.lastTimeLabel
    );
    if (last) {
      lines.push(`Last activity: ${last}`);
    }

    lines.push(
      `You wrote ${formatNumber(conversationInsights.userWords)} words (${formatNumber(
        conversationInsights.userCharacters
      )} chars).`
    );
    lines.push(
      `Assistant replied with ${formatNumber(conversationInsights.assistantWords)} words (${formatNumber(
        conversationInsights.assistantCharacters
      )} chars).`
    );

    if (conversationInsights.totalWords > 0) {
      const userShare = conversationInsights.userWords / conversationInsights.totalWords;
      const assistantShare = conversationInsights.assistantWords / conversationInsights.totalWords;
      lines.push(
        `Word share: ${formatPercentage(userShare)} you / ${formatPercentage(assistantShare)} assistant.`
      );
    }

    if (conversationInsights.longestUserWords > 0) {
      lines.push(
        `Longest user update: ${formatWordAndCharLabel(
          conversationInsights.longestUserWords,
          conversationInsights.longestUserCharacters
        )}.`
      );
    }

    if (conversationInsights.longestAssistantWords > 0) {
      lines.push(
        `Longest assistant update: ${formatWordAndCharLabel(
          conversationInsights.longestAssistantWords,
          conversationInsights.longestAssistantCharacters
        )}.`
      );
    }

    if (conversationInsights.longestGapMs > 0) {
      lines.push(`Longest pause between messages: ${formatGapDuration(conversationInsights.longestGapMs)}.`);
    }

    if (modelName) {
      lines.push(`Model: ${modelName}`);
    }

    if (trimmedSystemPrompt) {
      const preview =
        trimmedSystemPrompt.length > MAX_SUMMARY_PREVIEW_LENGTH
          ? `${trimmedSystemPrompt.slice(0, MAX_SUMMARY_PREVIEW_LENGTH - 3)}...`
          : trimmedSystemPrompt;
      lines.push('System prompt: Custom');
      lines.push(`Prompt preview: ${preview}`);
    } else {
      lines.push('System prompt: Default');
    }

    return lines.join('\n');
  }, [
    averageWordsPerMessageDisplay,
    conversationInsights,
    hasMessages,
    modelName,
    trimmedSystemPrompt,
  ]);
  const conversationSnapshot = useMemo(() => {
    if (!hasMessages) {
      return [];
    }

    const items = [
      {
        key: 'messages',
        title: 'Messages',
        value: `${formatNumber(messageStats.total)} total`,
        description: `${formatNumber(messageStats.userCount)} you / ${formatNumber(
          messageStats.assistantCount
        )} assistant`,
      },
      {
        key: 'words',
        title: 'Words',
        value: `${formatNumber(conversationInsights.totalWords)} total`,
        description: wordShareDisplay
          ? `Share ${wordShareDisplay}`
          : `Avg ${averageWordsPerMessageDisplay} words per message`,
      },
      {
        key: 'span',
        title: 'Span',
        value: conversationDurationText || '—',
        description: firstActivityDisplay ? `Started ${firstActivityDisplay}` : '',
      },
      {
        key: 'last-reply',
        title: 'Last reply',
        value: lastReplyDisplay || '—',
        description: longestPauseDisplay ? `Longest pause ${longestPauseDisplay}` : '',
      },
      {
        key: 'longest-update',
        title: 'Longest update',
        value: longestMessageDisplay || '—',
        description: longestMessageDisplay
          ? 'Densest exchange so far—great for highlights.'
          : 'Waiting for the next longer update.',
      },
    ];

    if (trimmedSystemPrompt) {
      items.push({
        key: 'system-prompt',
        title: 'System prompt',
        value: 'Custom',
        description: systemPromptPreview
          ? `Preview: ${systemPromptPreview}`
          : 'Custom prompt applied to every message.',
      });
    }

    if (modelName) {
      items.push({
        key: 'model',
        title: 'Model',
        value: modelName,
        description: 'Active OpenAI model.',
      });
    }

    return items;
  }, [
    averageWordsPerMessageDisplay,
    conversationDurationText,
    conversationInsights.totalWords,
    firstActivityDisplay,
    hasMessages,
    lastReplyDisplay,
    longestMessageDisplay,
    longestPauseDisplay,
    messageStats.assistantCount,
    messageStats.total,
    messageStats.userCount,
    modelName,
    systemPromptPreview,
    trimmedSystemPrompt,
    wordShareDisplay,
  ]);
  const conversationSnapshotText = useMemo(() => {
    if (!hasMessages || conversationSnapshot.length === 0) {
      return '';
    }

    const lines = ['Conversation pulse'];

    conversationSnapshot.forEach(({ title, value, description }) => {
      const safeTitle = typeof title === 'string' ? title.trim() : '';
      const safeValue =
        typeof value === 'string'
          ? value.trim()
          : value != null
          ? String(value)
          : '';
      const safeDescription =
        typeof description === 'string' ? description.trim() : description != null ? String(description).trim() : '';

      if (safeTitle || safeValue) {
        lines.push(safeTitle && safeValue ? `${safeTitle}: ${safeValue}` : safeTitle || safeValue);
      }

      if (safeDescription) {
        lines.push(`  - ${safeDescription}`);
      }
    });

    return lines.filter(Boolean).join('\n');
  }, [conversationSnapshot, hasMessages]);

  const adjustInputHeight = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, []);
  const handleCopyInsights = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(insightsSummaryText);
      setInsightsCopyStatus('Copied!');
    } catch (err) {
      setInsightsCopyStatus('Copy failed');
    }
    setTimeout(() => setInsightsCopyStatus(''), 2000);
  }, [insightsSummaryText]);
  const handleQuickCopyInsights = useCallback(async () => {
    if (!hasMessages) {
      setQuickInsightsCopyStatus('Add a message first');
      setTimeout(() => setQuickInsightsCopyStatus(''), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(insightsSummaryText);
      setQuickInsightsCopyStatus('Copied!');
    } catch (err) {
      setQuickInsightsCopyStatus('Copy failed');
    }

    setTimeout(() => setQuickInsightsCopyStatus(''), 2000);
  }, [hasMessages, insightsSummaryText]);
  const handleCopySnapshot = useCallback(async () => {
    if (!hasMessages || !conversationSnapshotText.trim()) {
      setSnapshotCopyStatus(hasMessages ? 'Pulse summary not ready' : 'Add a message first');
      setTimeout(() => setSnapshotCopyStatus(''), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(conversationSnapshotText);
      setSnapshotCopyStatus('Copied!');
    } catch (err) {
      setSnapshotCopyStatus('Copy failed');
    }

    setTimeout(() => setSnapshotCopyStatus(''), 2000);
  }, [conversationSnapshotText, hasMessages]);
  const handleInsertInsights = useCallback(() => {
    setInput((prev) => {
      const trimmedPrev = prev.trimEnd();
      if (!trimmedPrev) {
        return insightsSummaryText;
      }
      return `${trimmedPrev}\n\n${insightsSummaryText}`;
    });
    setShowInsights(false);
    requestAnimationFrame(() => {
      adjustInputHeight();
      if (inputRef.current) {
        inputRef.current.focus();
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });
  }, [adjustInputHeight, insightsSummaryText]);
  const handleAppendInsightsToPrTemplate = useCallback(() => {
    const trimmedSummary = insightsSummaryText.trim();
    if (!hasMessages || !trimmedSummary) {
      setPrInsightsAppendStatus(hasMessages ? 'Insights not ready' : 'Add a message first');
      setTimeout(() => setPrInsightsAppendStatus(''), 2000);
      return;
    }

    setPrTemplateText((prev) => {
      const trimmedPrev = prev.trimEnd();
      if (!trimmedPrev) {
        return trimmedSummary;
      }
      if (trimmedPrev.includes(trimmedSummary)) {
        return prev;
      }
      return `${trimmedPrev}\n\n${trimmedSummary}`;
    });

    setPrInsightsAppendStatus('Insights added');
    setTimeout(() => setPrInsightsAppendStatus(''), 2000);
  }, [hasMessages, insightsSummaryText]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    requestAnimationFrame(adjustInputHeight);
  };

  const handleClear = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
    setShowInsights(false);
    setInsightsCopyStatus('');
    setQuickInsightsCopyStatus('');
    setSnapshotCopyStatus('');
    setPrInsightsAppendStatus('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    requestAnimationFrame(adjustInputHeight);
  }, [adjustInputHeight]);

  const applySuggestedPrompt = (prompt) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      adjustInputHeight();
      if (inputRef.current) {
        inputRef.current.focus();
        const length = prompt.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });
  };

  const togglePromptTagFilter = useCallback((tag) => {
    if (!tag) {
      return;
    }

    const normalized = tag.toLowerCase();
    setPromptTagFilter((prev) => {
      if (prev?.value === normalized) {
        return null;
      }

      return { label: tag, value: normalized };
    });
  }, []);

  const handlePromptTagKeyDown = useCallback(
    (event, tag) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        togglePromptTagFilter(tag);
      }
    },
    [togglePromptTagFilter]
  );

  const clearPromptTagFilter = useCallback(() => {
    setPromptTagFilter(null);
  }, []);

  const promptTagFilterValue = promptTagFilter?.value ?? '';
  const promptTagFilterLabel = promptTagFilter?.label ?? '';

  const promptBaseOrder = useMemo(() => {
    const map = new Map();
    promptSuggestions.forEach((suggestion, index) => {
      map.set(suggestion.id, index);
    });
    return map;
  }, []);

  const favoritePromptOrder = useMemo(() => {
    const map = new Map();
    favoritePromptIds.forEach((id, index) => {
      map.set(id, index);
    });
    return map;
  }, [favoritePromptIds]);

  const sortPromptSuggestions = useCallback(
    (list) => {
      if (!Array.isArray(list) || list.length === 0) {
        return list;
      }

      return [...list].sort((a, b) => {
        const aFavorite = favoritePromptOrder.has(a.id);
        const bFavorite = favoritePromptOrder.has(b.id);
        if (aFavorite && !bFavorite) {
          return -1;
        }
        if (!aFavorite && bFavorite) {
          return 1;
        }
        if (aFavorite && bFavorite) {
          return (favoritePromptOrder.get(a.id) ?? 0) - (favoritePromptOrder.get(b.id) ?? 0);
        }
        const aBase = promptBaseOrder.get(a.id) ?? 0;
        const bBase = promptBaseOrder.get(b.id) ?? 0;
        return aBase - bBase;
      });
    },
    [favoritePromptOrder, promptBaseOrder]
  );

  const isPromptFavorite = useCallback((id) => favoritePromptOrder.has(id), [favoritePromptOrder]);

  const displayedPromptSuggestions = useMemo(() => {
    const list = !promptTagFilterValue
      ? promptSuggestions
      : promptSuggestions.filter((suggestion) =>
          suggestion.tags?.some((tag) => tag.toLowerCase() === promptTagFilterValue)
        );
    return sortPromptSuggestions(list);
  }, [promptTagFilterValue, sortPromptSuggestions]);

  const filteredPromptSuggestions = useMemo(() => {
    const search = promptSearch.trim().toLowerCase();

    const filtered = promptSuggestions.filter((suggestion) => {
      const matchesTag = !promptTagFilterValue
        ? true
        : suggestion.tags?.some((tag) => tag.toLowerCase() === promptTagFilterValue);
      if (!matchesTag) {
        return false;
      }

      if (!search) {
        return true;
      }

      if (
        suggestion.title.toLowerCase().includes(search) ||
        suggestion.description.toLowerCase().includes(search) ||
        suggestion.prompt.toLowerCase().includes(search)
      ) {
        return true;
      }

      if (!suggestion.tags?.length) {
        return false;
      }

      return suggestion.tags.some((tag) => tag.toLowerCase().includes(search));
    });

    return sortPromptSuggestions(filtered);
  }, [promptSearch, promptTagFilterValue, sortPromptSuggestions]);

  const togglePromptFavorite = useCallback((id) => {
    if (!id) {
      return;
    }

    setFavoritePromptIds((prev) => {
      const normalizedPrev = Array.isArray(prev) ? prev.filter((item) => typeof item === 'string') : [];
      const exists = normalizedPrev.includes(id);
      if (exists) {
        return normalizedPrev.filter((item) => item !== id);
      }

      const withoutDuplicates = normalizedPrev.filter((item) => item !== id);
      return [id, ...withoutDuplicates];
    });
  }, []);

  const handlePromptCardKeyDown = useCallback(
    (event, prompt) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        applySuggestedPrompt(prompt);
      }
    },
    [applySuggestedPrompt]
  );

  const handleTogglePromptFavorite = useCallback(
    (event, id) => {
      event.preventDefault();
      event.stopPropagation();
      togglePromptFavorite(id);
    },
    [togglePromptFavorite]
  );

  const handleSystemPromptChange = (e) => {
    setSystemPrompt(e.target.value);
  };

  const handleResetSystemPrompt = () => {
    setSystemPrompt('');
  };

  const handleCopyPrTemplate = async () => {
    try {
      await navigator.clipboard.writeText(prTemplateText);
      setPrCopyStatus('Copied!');
    } catch (err) {
      setPrCopyStatus('Copy failed');
    }
    setTimeout(() => setPrCopyStatus(''), 2000);
  };

  const handleInsertPrTemplate = () => {
    setInput((prev) => {
      const trimmedPrev = prev.trimEnd();
      const next = trimmedPrev ? `${trimmedPrev}\n\n${prTemplateText}` : prTemplateText;
      return next;
    });
    setShowPrHelper(false);
    requestAnimationFrame(() => {
      adjustInputHeight();
      if (inputRef.current) {
        inputRef.current.focus();
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });
  };

  const handleResetPrTemplate = () => {
    setPrTemplateText(DEFAULT_PR_TEMPLATE);
    requestAnimationFrame(() => {
      if (prHelperTextareaRef.current) {
        prHelperTextareaRef.current.focus();
        prHelperTextareaRef.current.select();
      }
    });
  };
  const focusPrHelperTextarea = useCallback(() => {
    requestAnimationFrame(() => {
      if (prHelperTextareaRef.current) {
        const { current: textarea } = prHelperTextareaRef;
        textarea.focus();
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }
    });
  }, []);

  const appendTestingLine = useCallback(
    (status) => {
      const snippet = PR_TEST_SNIPPETS[status];
      if (!snippet) {
        return;
      }

      setPrTemplateText((prev) => {
        const trimmedPrev = prev.replace(/\s+$/, '');
        if (!trimmedPrev) {
          return `**Testing**\n${snippet}\n`;
        }

        const sections = trimmedPrev.split(/\n{2,}/);
        let updated = false;
        const updatedSections = sections.map((section) => {
          const [firstLine, ...rest] = section.split('\n');
          const heading = firstLine.trim().replace(/\*/g, '').toLowerCase();
          if (!updated && heading === 'testing') {
            updated = true;
            const sectionBody = rest.length ? `\n${rest.join('\n')}` : '';
            return `${firstLine}${sectionBody}\n${snippet}`;
          }
          return section;
        });

        if (!updated) {
          updatedSections.push(`**Testing**\n${snippet}`);
        }

        return `${updatedSections.join('\n\n')}\n`;
      });

      focusPrHelperTextarea();
    },
    [focusPrHelperTextarea]
  );

  const insertPrSection = useCallback(
    (section) => {
      if (!section?.snippet) return;
      setPrTemplateText((prev) => {
        const trimmedPrev = prev.replace(/\s+$/, '');
        if (section.heading) {
          const hasHeading = trimmedPrev
            .split('\n')
            .some((line) => line.trim() === section.heading.trim());
          if (hasHeading) {
            return trimmedPrev ? `${trimmedPrev}\n` : '';
          }
        }
        const normalizedSnippet = section.snippet.endsWith('\n') ? section.snippet : `${section.snippet}\n`;
        return trimmedPrev ? `${trimmedPrev}\n\n${normalizedSnippet}` : normalizedSnippet;
      });
      focusPrHelperTextarea();
    },
    [focusPrHelperTextarea]
  );

  const appendPrReferenceSnippet = useCallback(
    (snippet) => {
      if (!snippet) {
        return;
      }

      const normalizedSnippet = snippet.endsWith('\n') ? snippet : `${snippet}\n`;
      const trimmedSnippet = normalizedSnippet.trimEnd();
      setPrTemplateText((prev) => {
        const trimmedPrev = prev.replace(/\s+$/, '');
        if (!trimmedPrev) {
          return `**Artifacts & References**\n${normalizedSnippet}`;
        }

        const sections = trimmedPrev.split(/\n{2,}/);
        let updated = false;
        const updatedSections = sections.map((section) => {
          const [firstLine, ...rest] = section.split('\n');
          const heading = firstLine.trim().replace(/\*/g, '').toLowerCase();
          if (!updated && heading === 'artifacts & references') {
            updated = true;
            const sectionBody = rest.length ? `\n${rest.join('\n')}` : '';
            return `${firstLine}${sectionBody}\n${trimmedSnippet}`;
          }
          return section;
        });

        if (!updated) {
          updatedSections.push(`**Artifacts & References**\n${trimmedSnippet}`);
        }

        return `${updatedSections.join('\n\n')}\n`;
      });

      focusPrHelperTextarea();
    },
    [focusPrHelperTextarea]
  );

  useEffect(() => {
    const shortcutHandler = (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (window.confirm('Clear chat history?')) {
          handleClear();
        }
      }
    };
    window.addEventListener('keydown', shortcutHandler);
    return () => window.removeEventListener('keydown', shortcutHandler);
  }, [handleClear]);

  // Load messages from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const now = Date.now();
          const normalized = parsed
            .map((message, index) => {
              if (!message || typeof message !== 'object') {
                return null;
              }
              const candidateTimestamp = message.timestamp;
              let timestamp;
              if (candidateTimestamp) {
                const parsedTimestamp = new Date(candidateTimestamp);
                timestamp = Number.isNaN(parsedTimestamp.getTime())
                  ? new Date(now + index).toISOString()
                  : parsedTimestamp.toISOString();
              } else {
                timestamp = new Date(now + index).toISOString();
              }
              const timeLabel =
                typeof message.time === 'string' && message.time
                  ? message.time
                  : formatTimeLabel(new Date(timestamp));
              const role =
                message.role === 'user' || message.role === 'assistant'
                  ? message.role
                  : 'assistant';
              const text =
                typeof message.text === 'string'
                  ? message.text
                  : message.text != null
                  ? String(message.text)
                  : '';
              return { ...message, role, text, time: timeLabel, timestamp };
            })
            .filter(Boolean);
          setMessages(normalized);
        }
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save messages', err);
    }
  }, [messages]);

  // Load settings (currently only the system prompt) once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.systemPrompt === 'string') {
          setSystemPrompt(parsed.systemPrompt);
        }
      }
    } catch (err) {
      console.error('Failed to load chat settings', err);
    }
  }, []);

  // Persist the system prompt locally so it survives refreshes
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ systemPrompt })
      );
    } catch (err) {
      console.error('Failed to save chat settings', err);
    }
  }, [systemPrompt]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PR_TEMPLATE_STORAGE_KEY);
      if (typeof saved === 'string' && saved.trim()) {
        setPrTemplateText(saved);
      }
    } catch (err) {
      console.error('Failed to load PR helper template', err);
    } finally {
      prTemplateHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!prTemplateHydrated.current) {
      return;
    }

    try {
      const trimmed = prTemplateText.trim();
      if (!trimmed || trimmed === DEFAULT_PR_TEMPLATE_TRIMMED) {
        localStorage.removeItem(PR_TEMPLATE_STORAGE_KEY);
      } else {
        localStorage.setItem(PR_TEMPLATE_STORAGE_KEY, prTemplateText);
      }
    } catch (err) {
      console.error('Failed to save PR helper template', err);
    }
  }, [prTemplateText]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROMPT_FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validIds = parsed.filter((value) =>
            typeof value === 'string' && promptSuggestions.some((suggestion) => suggestion.id === value)
          );
          if (validIds.length) {
            setFavoritePromptIds(validIds);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load favorite prompts', err);
    } finally {
      promptFavoritesHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!promptFavoritesHydrated.current) {
      return;
    }

    try {
      if (!favoritePromptIds.length) {
        localStorage.removeItem(PROMPT_FAVORITES_STORAGE_KEY);
      } else {
        localStorage.setItem(PROMPT_FAVORITES_STORAGE_KEY, JSON.stringify(favoritePromptIds));
      }
    } catch (err) {
      console.error('Failed to save favorite prompts', err);
    }
  }, [favoritePromptIds]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    adjustInputHeight();
  }, [adjustInputHeight]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    adjustInputHeight();
  }, [input, adjustInputHeight]);

  useEffect(() => {
    if (!showPromptLibrary) {
      setPromptSearch('');
      if (promptLibraryHasOpened.current && promptLibraryButtonRef.current) {
        promptLibraryButtonRef.current.focus();
      }
      return;
    }

    promptLibraryHasOpened.current = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowPromptLibrary(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      if (promptLibrarySearchRef.current) {
        promptLibrarySearchRef.current.focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPromptLibrary]);

  useEffect(() => {
    if (!showPrHelper) {
      setPrCopyStatus('');
      setPrInsightsAppendStatus('');
      if (prHelperHasOpened.current && prHelperButtonRef.current) {
        prHelperButtonRef.current.focus();
      }
      return;
    }

    prHelperHasOpened.current = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowPrHelper(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      if (prHelperTextareaRef.current) {
        prHelperTextareaRef.current.focus();
        prHelperTextareaRef.current.select();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPrHelper]);

  useEffect(() => {
    if (!showInsights) {
      setInsightsCopyStatus('');
      if (insightsHasOpened.current && insightsButtonRef.current) {
        insightsButtonRef.current.focus();
      }
      return;
    }

    insightsHasOpened.current = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowInsights(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      if (insightsDialogRef.current) {
        insightsDialogRef.current.focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showInsights]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const now = new Date();
    const userMsg = {
      role: 'user',
      text: input,
      time: formatTimeLabel(now),
      timestamp: now.toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setLoading(true);
    try {
      const payload = {
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text })),
      };
      if (trimmedSystemPrompt) {
        payload.systemPrompt = trimmedSystemPrompt;
      }
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const replyTime = new Date();
      const botMsg = {
        role: 'assistant',
        text: data.text || 'No response',
        time: formatTimeLabel(replyTime),
        timestamp: replyTime.toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorTime = new Date();
      const errorMsg = {
        role: 'assistant',
        text: 'Error: ' + err.message,
        time: formatTimeLabel(errorTime),
        timestamp: errorTime.toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' && !input.trim()) {
      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUser) {
        setInput(lastUser.text);
        requestAnimationFrame(() => {
          adjustInputHeight();
        });
      }
    } else if (e.key === 'Escape') {
      setInput('');
      requestAnimationFrame(adjustInputHeight);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="p-2 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-wrap gap-2 items-center">
          <DarkModeToggle />
          <ClearChatButton onClear={handleClear} />
          <ExportChatButton messages={messages} systemPrompt={systemPrompt} />
          <DownloadChatButton messages={messages} systemPrompt={systemPrompt} />
          <button
            type="button"
            ref={promptLibraryButtonRef}
            onClick={() => setShowPromptLibrary(true)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-haspopup="dialog"
            aria-expanded={showPromptLibrary}
            aria-controls="prompt-library"
          >
            Prompt library
          </button>
          <button
            type="button"
            ref={prHelperButtonRef}
            onClick={() => setShowPrHelper(true)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-haspopup="dialog"
            aria-expanded={showPrHelper}
            aria-controls="pr-helper"
          >
            PR helper
          </button>
          <button
            type="button"
            ref={insightsButtonRef}
            onClick={() => setShowInsights(true)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-haspopup="dialog"
            aria-expanded={showInsights}
            aria-controls="conversation-insights"
          >
            Insights
          </button>
          <button
            type="button"
            onClick={handleQuickCopyInsights}
            aria-disabled={!hasMessages && !quickInsightsCopyStatus}
            className={`border px-2 py-1 rounded text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              hasMessages
                ? 'bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:border-blue-400'
                : 'bg-gray-100 text-gray-400 hover:text-gray-500 opacity-75 dark:bg-gray-800 dark:text-gray-500'
            }`}
          >
            <span aria-live="polite">{quickInsightsCopyStatus || 'Copy insights summary'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-expanded={showSettings}
            aria-controls="chat-settings"
          >
            {showSettings ? 'Hide settings' : 'Settings'}
          </button>
          <div className="ml-auto flex flex-wrap gap-x-4 gap-y-1 items-center text-sm text-gray-500 dark:text-gray-400">
            {hasMessages && (
              <>
                <span
                  className="self-center"
                  aria-label={`${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`}
                  aria-live="polite"
                >
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </span>
                {conversationDurationText && (
                  <span className="self-center" aria-label={`Conversation span ${conversationDurationText}`}>
                    Span: {conversationDurationText}
                  </span>
                )}
                <span className="self-center" aria-label={`Average words per message ${averageWordsPerMessageDisplay}`}>
                  Avg words/msg: {averageWordsPerMessageDisplay}
                </span>
                {longestMessageDisplay && (
                  <span className="self-center" aria-label={`Longest update ${longestMessageAria}`}>
                    Longest update: {longestMessageDisplay}
                  </span>
                )}
                {longestPauseDisplay && (
                  <span className="self-center" aria-label={`Longest pause ${longestPauseDisplay}`}>
                    Longest pause: {longestPauseDisplay}
                  </span>
                )}
                {lastReplyDisplay && (
                  <span className="self-center" aria-label={`Last reply ${lastReplyDisplay}`}>
                    Last reply: {lastReplyDisplay}
                  </span>
                )}
              </>
            )}
            {modelName && (
              <span className="self-center" aria-label={`Model ${modelName}`}>
                Model: {modelName}
              </span>
            )}
            {trimmedSystemPrompt && (
              <span
                className="text-xs text-blue-600 dark:text-blue-300"
                title={trimmedSystemPrompt}
                aria-live="polite"
              >
                Custom system prompt active
              </span>
            )}
          </div>
        </div>
        {showSettings && (
          <div
            id="chat-settings"
            className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 space-y-2"
          >
            <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Custom system prompt
            </label>
            <textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={handleSystemPromptChange}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Set the assistant's behavior. Leave blank to use the default prompt."
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={handleResetSystemPrompt}
                className="self-start border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
                disabled={!trimmedSystemPrompt}
              >
                Clear custom prompt
              </button>
              <span>Saved locally and applied to every message in this conversation.</span>
            </div>
          </div>
        )}
        <div
          className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4"
          role="log"
          aria-live="polite"
          aria-busy={loading}
        >
          {messages.length === 0 && !loading && (
            <div
              className="text-center text-gray-500 dark:text-gray-400 mt-4 space-y-6"
              aria-label="No messages yet"
            >
              <div>
                <p>No messages yet. Start the conversation below.</p>
                {trimmedSystemPrompt && (
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                    Using custom system prompt: <span className="font-medium">{systemPromptPreview}</span>
                  </p>
                )}
              </div>
              <div className="max-w-3xl mx-auto text-left">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Try one of these starters
                </h2>
                {promptTagFilterLabel && (
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-700 dark:text-blue-300">
                    <span>
                      Filtering by badge <span className="font-semibold">{promptTagFilterLabel}</span>
                    </span>
                    <button
                      type="button"
                      className="rounded border border-blue-200 px-2 py-1 text-[0.7rem] uppercase tracking-wide text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-200 dark:hover:border-blue-400 dark:hover:bg-blue-900/40"
                      onClick={clearPromptTagFilter}
                    >
                      Clear filter
                    </button>
                  </div>
                )}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {displayedPromptSuggestions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      No starters match this badge yet. Clear the filter or open the Prompt library for more ideas.
                    </div>
                  ) : (
                    displayedPromptSuggestions.map((suggestion) => {
                      const favorite = isPromptFavorite(suggestion.id);
                      return (
                        <div
                          key={suggestion.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => applySuggestedPrompt(suggestion.prompt)}
                          onKeyDown={(event) => handlePromptCardKeyDown(event, suggestion.prompt)}
                          className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="block font-medium text-gray-900 dark:text-gray-100">
                                {suggestion.title}
                              </span>
                              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                {suggestion.description}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => handleTogglePromptFavorite(event, suggestion.id)}
                              aria-pressed={favorite}
                              aria-label={
                                favorite
                                  ? 'Remove prompt from favorites'
                                  : 'Add prompt to favorites'
                              }
                              className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                favorite
                                  ? 'border-amber-400 text-amber-500 dark:border-amber-300 dark:text-amber-200'
                                  : 'border-transparent text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-300'
                              }`}
                            >
                              <span aria-hidden="true">{favorite ? '★' : '☆'}</span>
                              <span className="sr-only">
                                {favorite ? 'Favorited prompt' : 'Not favorited'}
                              </span>
                            </button>
                          </div>
                          {favorite && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                              <span aria-hidden="true">★</span> Favorite
                            </span>
                          )}
                          {suggestion.tags?.length > 0 && (
                            <span className="mt-2 flex flex-wrap gap-1">
                              {suggestion.tags.map((tag) => {
                                const normalizedTag = tag.toLowerCase();
                                const isActive = promptTagFilterValue === normalizedTag;
                                return (
                                  <span
                                    key={tag}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isActive}
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      togglePromptTagFilter(tag);
                                    }}
                                    onKeyDown={(event) => {
                                      event.stopPropagation();
                                      handlePromptTagKeyDown(event, tag);
                                    }}
                                    className={`inline-flex cursor-pointer items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                      isActive
                                        ? 'border-blue-500 bg-blue-600 text-white dark:border-blue-300 dark:bg-blue-400 dark:text-gray-900'
                                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:border-blue-600 dark:hover:bg-blue-900/60'
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                );
                              })}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Looking for more inspiration? Open the <span className="font-medium">Prompt library</span> from the header to browse every saved starter. Click a badge to filter the list by theme or use search in the library for keyword matches.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Want a quick pulse check on the conversation? Tap the <span className="font-medium">Insights</span> button in the header to review message counts, word totals, timestamps, and a copy-ready summary you can drop into docs or follow-up prompts.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Preparing a pull request? The <span className="font-medium">PR helper</span> button offers a ready-to-edit summary, artifact, and testing template with bold section headings, citation placeholders, and quick-add buttons for Impact, Security & Privacy, Accessibility, User Experience, Performance, Analytics & Monitoring, Dependencies, Feature flags, Rollout, Documentation, evidence bullets (logs, metrics, screenshots, docs, videos), or additional test results.
                </p>
              </div>
            </div>
          )}
          {hasMessages && (
            <section
              className="mb-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4 shadow-sm transition dark:border-blue-900/60 dark:bg-blue-950/20"
              aria-label="Conversation pulse"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">
                  Conversation pulse
                </h2>
                <button
                  type="button"
                  onClick={handleCopySnapshot}
                  aria-disabled={!hasMessages && !snapshotCopyStatus}
                  className={`rounded border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    hasMessages
                      ? 'border-blue-300 bg-white text-blue-700 hover:border-blue-400 hover:text-blue-600 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-200 dark:hover:border-blue-400'
                      : 'cursor-not-allowed border-blue-100 bg-white/60 text-blue-300 dark:border-blue-900 dark:bg-gray-800 dark:text-blue-700'
                  }`}
                >
                  <span aria-live="polite">{snapshotCopyStatus || 'Copy pulse summary'}</span>
                </button>
              </div>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {conversationSnapshot.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-lg border border-blue-100/80 bg-white/90 px-3 py-2 shadow-sm dark:border-blue-900/40 dark:bg-gray-900/60"
                  >
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                      {item.title}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {item.value}
                      {item.description && (
                        <span className="mt-1 block text-[0.7rem] text-gray-500 dark:text-gray-400">
                          {item.description}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {messages.map((msg, idx) => (
            <ChatBubbleMarkdown key={idx} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                style={{ height: 'auto' }}
                className="w-full min-h-[3rem] border border-gray-300 dark:border-gray-700 rounded p-2 resize-none overflow-hidden bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                aria-label="Message input"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Send a message (Shift+Enter for newline, Up Arrow to recall last message)"
              />
              <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <span aria-live="polite">
                  {hasMessages
                    ? `${messageStats.total} message${messageStats.total === 1 ? '' : 's'} · ${messageStats.userCount} you / ${messageStats.assistantCount} assistant${
                        lastReplyDisplay ? ` · Last reply ${lastReplyDisplay}` : ''
                      }${conversationDurationText ? ` · Span ${conversationDurationText}` : ''}`
                    : 'Draft your first request to start a new conversation.'}
                </span>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span aria-live="polite">{draftStatsText}</span>
                  <span>{trimmedSystemPrompt ? 'Custom system prompt active' : 'Default system prompt'}</span>
                  <span>Autosaves locally</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2 disabled:opacity-50 self-start sm:self-auto"
              disabled={disableSend}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      {showPromptLibrary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prompt-library-title"
          id="prompt-library"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close prompt library"
            tabIndex={-1}
            onClick={() => setShowPromptLibrary(false)}
          />
          <div className="relative max-h-full w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div>
                <h2 id="prompt-library-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Prompt library
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Browse curated starters or search to quickly reuse a favorite request. Results match titles, descriptions,
                  prompts, and badges—click any badge to filter related prompts instantly.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPromptLibrary(false)}
              >
                Close
              </button>
            </div>
            <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
              <label htmlFor="prompt-library-search" className="sr-only">
                Search prompts
              </label>
              <input
                id="prompt-library-search"
                ref={promptLibrarySearchRef}
                type="search"
                value={promptSearch}
                onChange={(event) => setPromptSearch(event.target.value)}
                placeholder="Search prompts by title, keyword, or tag"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
              {promptTagFilterLabel && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-700 dark:text-blue-300">
                  <span>
                    Filtering by badge <span className="font-semibold">{promptTagFilterLabel}</span>
                  </span>
                  <button
                    type="button"
                    className="rounded border border-blue-200 px-2 py-1 text-[0.7rem] uppercase tracking-wide text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-200 dark:hover:border-blue-400 dark:hover:bg-blue-900/40"
                    onClick={clearPromptTagFilter}
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
              {filteredPromptSuggestions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No prompts match your search or badge filter yet. Try a different keyword or clear the filter.
                </p>
              ) : (
                <ul className="space-y-3">
                  {filteredPromptSuggestions.map((suggestion) => {
                    const favorite = isPromptFavorite(suggestion.id);
                    return (
                      <li key={suggestion.id}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            applySuggestedPrompt(suggestion.prompt);
                            setShowPromptLibrary(false);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              applySuggestedPrompt(suggestion.prompt);
                              setShowPromptLibrary(false);
                            }
                          }}
                          className="group w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {suggestion.title}
                              </span>
                              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                {suggestion.description}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => handleTogglePromptFavorite(event, suggestion.id)}
                              aria-pressed={favorite}
                              aria-label={
                                favorite
                                  ? 'Remove prompt from favorites'
                                  : 'Add prompt to favorites'
                              }
                              className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                favorite
                                  ? 'border-amber-400 text-amber-500 dark:border-amber-300 dark:text-amber-200'
                                  : 'border-transparent text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-300'
                              }`}
                            >
                              <span aria-hidden="true">{favorite ? '★' : '☆'}</span>
                              <span className="sr-only">
                                {favorite ? 'Favorited prompt' : 'Not favorited'}
                              </span>
                            </button>
                          </div>
                          {favorite && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                              <span aria-hidden="true">★</span> Favorite
                            </span>
                          )}
                          {suggestion.tags?.length > 0 && (
                            <span className="mt-2 flex flex-wrap gap-1">
                              {suggestion.tags.map((tag) => {
                                const normalizedTag = tag.toLowerCase();
                                const isActive = promptTagFilterValue === normalizedTag;
                                return (
                                  <span
                                    key={tag}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isActive}
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      togglePromptTagFilter(tag);
                                    }}
                                    onKeyDown={(event) => {
                                      event.stopPropagation();
                                      handlePromptTagKeyDown(event, tag);
                                    }}
                                    className={`inline-flex cursor-pointer items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                      isActive
                                        ? 'border-blue-500 bg-blue-600 text-white dark:border-blue-300 dark:bg-blue-400 dark:text-gray-900'
                                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:border-blue-600 dark:hover:bg-blue-900/60'
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                );
                              })}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      {showPrHelper && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pr-helper-title"
          id="pr-helper"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close PR helper"
            tabIndex={-1}
            onClick={() => setShowPrHelper(false)}
          />
          <div className="relative max-h-full w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div>
                <h2 id="pr-helper-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Pull request helper
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Keep your summaries and testing notes consistent. Edit the template, copy it, or insert it directly into the message box.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPrHelper(false)}
              >
                Close
              </button>
            </div>
            <div className="px-6 py-4 space-y-5">
              <div>
                <p id="pr-helper-tip" className="text-xs text-gray-500 dark:text-gray-400">
                  Keep the bold Summary and Testing headers for final handoff notes. Swap the emoji to ⚠️ or ❌ if a check is flaky or failing, expand the Impact, Security, Accessibility, User Experience, Performance, Analytics & Monitoring, Dependencies, Feature flags, Rollout, or Documentation sections with project specifics, and refresh the citation placeholders with the right files, logs, metrics, screenshots, videos, or docs. Use the quick-add buttons below to append more sections, evidence snippets, or testing rows as you go.
                </p>
                <textarea
                  ref={prHelperTextareaRef}
                  value={prTemplateText}
                  onChange={(event) => setPrTemplateText(event.target.value)}
                  aria-describedby="pr-helper-tip"
                  rows={8}
                  className="mt-3 w-full rounded border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                <p className="mt-2 text-[0.7rem] text-gray-500 dark:text-gray-400">
                  Edits save locally so you can revisit the draft later. Use Reset template to restore the default outline.
                </p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    Pull in the live conversation insights to ground your Summary section with message counts, word balance, and timestamps.
                  </p>
                  <button
                    type="button"
                    onClick={handleAppendInsightsToPrTemplate}
                    aria-disabled={!hasMessages && !prInsightsAppendStatus}
                    className={`rounded border px-3 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      hasMessages
                        ? 'border-blue-500 bg-white text-blue-700 hover:border-blue-600 hover:text-blue-600 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-200 dark:hover:border-blue-300'
                        : 'cursor-not-allowed border-blue-100 bg-white/60 text-blue-300 dark:border-blue-900 dark:bg-gray-800 dark:text-blue-600/70'
                    }`}
                  >
                    <span aria-live="polite">{prInsightsAppendStatus || 'Append conversation insights'}</span>
                  </button>
                </div>
                {!hasMessages && (
                  <p className="mt-2 text-[0.7rem] text-blue-700/90 dark:text-blue-200/80">
                    Start a new exchange to generate an insights summary before adding it to your draft.
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Need to cover more context? Append a ready-made section and fill in the details before sharing.
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {PR_SECTION_SNIPPETS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => insertPrSection(section)}
                      className="rounded border border-gray-300 bg-white px-3 py-2 text-left text-xs text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:bg-gray-700"
                    >
                      <span className="block font-semibold text-gray-900 dark:text-gray-100">{section.label}</span>
                      <span className="mt-1 block text-[0.7rem] text-gray-500 dark:text-gray-400">{section.helperText}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Need to cite evidence? Drop in reusable bullets for logs, metrics, screenshots, videos, or supporting docs.
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {PR_REFERENCE_SNIPPETS.map((reference) => (
                    <button
                      key={reference.id}
                      type="button"
                      onClick={() => appendPrReferenceSnippet(reference.snippet)}
                      className="rounded border border-gray-300 bg-white px-3 py-2 text-left text-xs text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:bg-gray-700"
                    >
                      <span className="block font-semibold text-gray-900 dark:text-gray-100">{reference.label}</span>
                      <span className="mt-1 block text-[0.7rem] text-gray-500 dark:text-gray-400">{reference.helperText}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Need another testing entry? Quick add a status and update the command and citation details before sharing.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => appendTestingLine('pass')}
                    className="rounded border border-green-500 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-green-400 dark:text-green-300"
                  >
                    Add ✅ Passed check
                  </button>
                  <button
                    type="button"
                    onClick={() => appendTestingLine('warn')}
                    className="rounded border border-yellow-500 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:border-yellow-400 dark:text-yellow-300"
                  >
                    Add ⚠️ Needs follow-up
                  </button>
                  <button
                    type="button"
                    onClick={() => appendTestingLine('fail')}
                    className="rounded border border-red-500 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-red-400 dark:text-red-300"
                  >
                    Add ❌ Failing check
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleCopyPrTemplate}
                    className="border border-blue-500 bg-blue-500 px-3 py-2 font-medium text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span aria-live="polite">{prCopyStatus || 'Copy template'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertPrTemplate}
                    className="border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    Insert into chat
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResetPrTemplate}
                  className="self-start text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Reset template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showInsights && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="conversation-insights-title"
          id="conversation-insights"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close conversation insights"
            tabIndex={-1}
            onClick={() => setShowInsights(false)}
          />
          <div
            ref={insightsDialogRef}
            tabIndex={-1}
            className="relative max-h-full w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div>
                <h2 id="conversation-insights-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Conversation insights
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Understand message balance, cadence, longest updates, and word counts before exporting a transcript or drafting a PR note.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowInsights(false)}
              >
                Close
              </button>
            </div>
            <div className="px-6 py-4 space-y-5">
              <div>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Messages
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {formatNumber(conversationInsights.total)} total · {formatNumber(conversationInsights.userCount)} you / {formatNumber(conversationInsights.assistantCount)} assistant
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Word balance
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {formatNumber(conversationInsights.totalWords)} words · {formatNumber(conversationInsights.userWords)} you / {formatNumber(conversationInsights.assistantWords)} assistant (avg {averageWordsPerMessageDisplay} per message)
                      {wordShareDisplay && (
                        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                          Share: {wordShareDisplay}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Longest update
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{longestMessageDescription}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Longest pause
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{longestPauseDescription}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Characters
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {formatNumber(conversationInsights.totalCharacters)} total · {formatNumber(conversationInsights.userCharacters)} you / {formatNumber(conversationInsights.assistantCharacters)} assistant
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Timeline
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {firstActivityDisplay ? `Started ${firstActivityDisplay}` : 'Waiting for the first message.'}
                      {lastReplyDisplay ? ` · Last reply ${lastReplyDisplay}` : ''}
                      {conversationDurationText ? ` · Span ${conversationDurationText}` : ''}
                    </dd>
                  </div>
                </dl>
                {trimmedSystemPrompt ? (
                  <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
                    Custom system prompt active — included in the summary below.
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Using the default system prompt.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shareable summary</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Copy or insert the generated snapshot to reuse in stand-ups, design docs, or PR updates.
                </p>
                <textarea
                  value={insightsSummaryText}
                  readOnly
                  rows={hasMessages ? 8 : 4}
                  aria-label="Conversation insights summary"
                  className="mt-3 w-full rounded border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleCopyInsights}
                    className="border border-blue-500 bg-blue-500 px-3 py-2 font-medium text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span aria-live="polite">{insightsCopyStatus || 'Copy summary'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertInsights}
                    disabled={!hasMessages}
                    className={`border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasMessages
                        ? 'border-gray-300 bg-white text-gray-900 hover:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600'
                    }`}
                  >
                    Insert into chat
                  </button>
                </div>
                {modelName ? (
                  <span className="text-xs text-gray-500 dark:text-gray-400">Model: {modelName}</span>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">Model: default</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
