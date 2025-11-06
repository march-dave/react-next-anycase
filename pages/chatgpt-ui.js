import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import ChatBubbleMarkdown from '@/components/ChatBubbleMarkdown';
import DarkModeToggle from '@/components/DarkModeToggle';
import ClearChatButton from '@/components/ClearChatButton';
import ExportChatButton from '@/components/ExportChatButton';
import DownloadChatButton from '@/components/DownloadChatButton';
import TypingIndicator from '@/components/TypingIndicator';
import PrTemplateActions from '@/components/PrTemplateActions';

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
    id: 'compose-final-update',
    title: 'Compose a final update',
    description:
      'Turn raw change notes into the Summary & Testing sections used in the final response, complete with citations.',
    prompt:
      'Use the following context to draft a final handoff update for reviewers. Produce a **Summary** section with bullets that call out motivation, major changes, and follow-ups, each ending with the right file citation placeholder. Then include a **Testing** section that lists the exact commands or suites that ran, prefixing each line with ✅/⚠️/❌ and leaving space for the chunk citation. Keep the formatting ready for copy/paste.\n\n',
    tags: ['Pull Request', 'Recaps'],
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
  {
    id: 'standup-update',
    title: 'Prep a stand-up update',
    description: 'Summarize yesterday, today, and blockers with quick wins.',
    prompt:
      'Draft a crisp stand-up update using the following context. Include what happened yesterday, the focus for today, highlight any quick wins, and call out blockers with owners for follow-up:\n\n',
    tags: ['Team Updates', 'Summaries'],
  },
];

const DEFAULT_PR_TEMPLATE = [
  '**Summary**',
  '* Motivation and background. 【F:path/to/file†L#-L#】',
  '* Key implementation changes. 【F:path/to/file†L#-L#】',
  '* Follow-up guardrails or next steps. 【F:path/to/file†L#-L#】',
  '',
  '**Changelog & Release notes**',
  '* Customer-facing highlights, rollouts, and messaging owners. 【F:path/to/file†L#-L#】',
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
  '* ![Screenshot description](artifacts/filename.png) — describe the state you captured and cite the UI diff. 【F:path/to/file†L#-L#】',
  '',
  '**Artifacts & References**',
  '* File: 【F:path/to/file†L#-L#】 — highlight the key changes to review.',
  '* Logs: 【chunk†L#-L#】 — call out the signal that confirms the change.',
  '* Metrics: 【chunk†L#-L#】 — summarize the movement you expect to see.',
  '* Docs: [Design doc](https://link) — note supporting context or tickets.',
  '* 📹 Video: [Recording](https://link) — show the before/after flow.',
  '',
  '**Tickets & Tracking**',
  '* Jira/Linear/GitHub issues that capture the work, owners, and due dates. [ABC-123](https://link) — status and next checkpoint.',
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

const RELEASE_NOTES_HEADING = '**Changelog & Release notes**';

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
    snippet: [
      '**Impact & Risks**',
      '* Who is affected and what trade-offs or mitigations should reviewers note? 【F:path/to/file†L#-L#】',
    ].join('\n'),
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
    id: 'screenshots',
    label: 'Screenshots & recordings',
    heading: '**Screenshots / Recordings**',
    helperText: 'Remind reviewers where to find updated UI proof with citations.',
    snippet: [
      '**Screenshots / Recordings**',
      '* ![Screenshot description](artifacts/filename.png) — cover the scenario and cite the UI diff. 【F:path/to/file†L#-L#】',
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
    id: 'release-notes',
    label: 'Changelog & release notes',
    heading: '**Changelog & Release notes**',
    helperText: 'Capture the customer-facing summary, comms owners, and publish plan.',
    snippet: [
      '**Changelog & Release notes**',
      '* Customer-facing highlights, rollout messaging, and distribution plan. 【F:path/to/file†L#-L#】',
    ].join('\n'),
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
    id: 'tickets',
    label: 'Tickets & tracking',
    heading: '**Tickets & Tracking**',
    helperText: 'Link Jira, Linear, or GitHub issues and note current status.',
    snippet: [
      '**Tickets & Tracking**',
      '* Ticket: [ABC-123](https://link) — status, owners, and next checkpoint.',
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
    id: 'file',
    label: 'Add file citation',
    helperText: 'Call out the diff or doc reviewers should inspect first.',
    snippet: '* File: 【F:path/to/file†L#-L#】 — highlight why this change matters.',
  },
  {
    id: 'logs',
    label: 'Add log citation',
    helperText: 'Point reviewers to saved logs, traces, or analytics excerpts.',
    snippet: '* Logs: 【chunk†L#-L#】 — highlight the signal that verifies the change.',
  },
  {
    id: 'screenshot',
    label: 'Add screenshot placeholder',
    helperText: 'Embed a before/after capture with descriptive alt text and cite the change.',
    snippet:
      '* ![Screenshot description](artifacts/filename.png) — show the affected flow and reference the diff. 【F:path/to/file†L#-L#】',
  },
  {
    id: 'metrics',
    label: 'Add metrics snapshot',
    helperText: 'Point reviewers to dashboards or quantitative proof.',
    snippet: '* Metrics: 【chunk†L#-L#】 — summarize the movement you expect to see.',
  },
  {
    id: 'conversation-insights',
    label: 'Link conversation insights',
    helperText: 'Reference the generated snapshot with message counts, pace, and highlights.',
    snippet:
      '* Conversation insights: Snapshot with messages, pace, and longest update for reviewers. 【chunk†L#-L#】',
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
    id: 'release-notes-link',
    label: 'Link release notes draft',
    helperText: 'Point reviewers to the customer messaging or enablement doc.',
    snippet: '* Release notes: [Doc](https://link) — audience, publish date, and owner.',
  },
  {
    id: 'feature-flag-tracker',
    label: 'Add feature flag tracker',
    helperText: 'Track default states, rollout checkpoints, or cleanup owners for toggles.',
    snippet: '* Feature flag: `flag_name` — default state, rollout milestones, and cleanup owner.',
  },
  {
    id: 'tickets',
    label: 'Add ticket link',
    helperText: 'Reference Jira, Linear, or GitHub issues tied to the change.',
    snippet: '* Ticket: [ABC-123](https://link) — status, owners, and next checkpoints.',
  },
];

const PR_PLACEHOLDER_RULES = [
  {
    id: 'file-citation',
    pattern: /F:path\/to\/file†L#/,
    summaryLabel: 'file citation placeholder',
    summaryLabelPlural: 'file citation placeholders',
    example: 'F:path/to/file†L#',
    guidance: 'Swap in the actual path and line range.',
  },
  {
    id: 'chunk-citation',
    pattern: /chunk†L#/,
    summaryLabel: 'chunk citation placeholder',
    summaryLabelPlural: 'chunk citation placeholders',
    example: 'chunk†L#',
    guidance: 'Replace with the terminal output reference that backs the change.',
  },
  {
    id: 'generic-link',
    pattern: /https:\/\/link/,
    summaryLabel: 'link placeholder',
    summaryLabelPlural: 'link placeholders',
    example: 'https://link',
    guidance: 'Point to the real document, dashboard, or ticket URL.',
  },
  {
    id: 'screenshot',
    pattern: /artifacts\/filename\.png/,
    summaryLabel: 'screenshot placeholder',
    summaryLabelPlural: 'screenshot placeholders',
    example: 'artifacts/filename.png',
    guidance: 'Update with the saved image path before sharing.',
  },
  {
    id: 'testing-command',
    pattern: /command or suite/,
    summaryLabel: 'testing placeholder',
    summaryLabelPlural: 'testing placeholders',
    example: '`command or suite`',
    guidance: 'List the exact command or suite that ran.',
  },
  {
    id: 'ticket',
    pattern: /ABC-123/,
    summaryLabel: 'ticket placeholder',
    summaryLabelPlural: 'ticket placeholders',
    example: 'ABC-123',
    guidance: 'Reference the actual tracking ID and link.',
  },
  {
    id: 'feature-flag',
    pattern: /flag_name/,
    summaryLabel: 'feature flag placeholder',
    summaryLabelPlural: 'feature flag placeholders',
    example: 'flag_name',
    guidance: 'Document the real flag identifier and default.',
  },
  {
    id: 'dependency',
    pattern: /package@version/,
    summaryLabel: 'dependency placeholder',
    summaryLabelPlural: 'dependency placeholders',
    example: 'package@version',
    guidance: 'Note the actual package and version bump.',
  },
];

const PR_PLACEHOLDER_PATTERNS = PR_PLACEHOLDER_RULES.map((rule) => rule.pattern);

const KEY_CAP_CLASS =
  'inline-flex items-center rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[0.65rem] font-semibold text-gray-600 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200';

const MAX_SUMMARY_PREVIEW_LENGTH = 200;
const PR_SUMMARY_PREVIEW_MAX_LENGTH = 180;

function normalizeHeadingValue(value) {
  if (!value) {
    return '';
  }
  return value.toString().trim().replace(/\*/g, '').toLowerCase();
}

function getSectionWithHeading(text, heading) {
  if (typeof text !== 'string' || typeof heading !== 'string') {
    return '';
  }
  const normalizedHeading = normalizeHeadingValue(heading);
  if (!normalizedHeading) {
    return '';
  }

  const sections = text.split(/\n{2,}/);
  for (const section of sections) {
    const [firstLine] = section.split('\n');
    if (normalizeHeadingValue(firstLine) === normalizedHeading) {
      return section.trim();
    }
  }
  return '';
}

function getSectionBodyByHeading(text, heading) {
  const section = getSectionWithHeading(text, heading);
  if (!section) {
    return '';
  }
  const [, ...rest] = section.split('\n');
  return rest.join('\n').trim();
}

function createSummaryPreview(text, maxLength = PR_SUMMARY_PREVIEW_MAX_LENGTH) {
  if (typeof text !== 'string') {
    return '';
  }
  const normalized = text.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    return '';
  }
  if (normalized.length <= maxLength) {
    return normalized;
  }
  const sliceLength = Math.max(0, maxLength - 1);
  return `${normalized.slice(0, sliceLength)}…`;
}

function createPrInsightsBlock(text) {
  if (typeof text !== 'string') {
    return '';
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !(line.startsWith('**') && line.endsWith('**')));

  if (lines.length === 0) {
    return '';
  }

  const formatted = lines.map((line) => {
    if (line.startsWith('* ')) {
      return `  - ${line.slice(2)}`;
    }
    return `  ${line}`;
  });

  return ['* Conversation insights snapshot:', ...formatted].join('\n');
}

function trimPrTemplatePlaceholders(text) {
  if (typeof text !== 'string') {
    return '';
  }

  const lines = text.split('\n');
  const filteredLines = lines.filter((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      return true;
    }

    return !PR_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmedLine));
  });

  const collapsed = filteredLines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd();
  if (!collapsed) {
    return '';
  }

  const sections = collapsed.split(/\n{2,}/);
  const cleanedSections = sections
    .map((section) => section.trimEnd())
    .filter((section) => {
      const sectionLines = section
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      if (sectionLines.length === 0) {
        return false;
      }

      const [firstLine, ...rest] = sectionLines;
      const hasHeading = firstLine.startsWith('**') && firstLine.endsWith('**');
      if (!hasHeading) {
        return true;
      }

      return rest.some((line) => line);
    });

  const result = cleanedSections.join('\n\n').trim();
  return result ? `${result}\n` : '';
}

function collectPlaceholderWarnings(text) {
  if (typeof text !== 'string' || !text.trim()) {
    return [];
  }

  return PR_PLACEHOLDER_RULES.reduce((accumulator, rule) => {
    const flags = rule.pattern.flags.includes('g') ? rule.pattern.flags : `${rule.pattern.flags}g`;
    const globalPattern = new RegExp(rule.pattern.source, flags);
    const matches = text.match(globalPattern);
    if (matches && matches.length > 0) {
      accumulator.push({ id: rule.id, count: matches.length, rule });
    }
    return accumulator;
  }, []);
}

function formatPlaceholderSummary(warnings) {
  if (!Array.isArray(warnings) || warnings.length === 0) {
    return '';
  }

  const items = warnings.map(({ count, rule }) => {
    const label = count === 1 ? rule.summaryLabel : rule.summaryLabelPlural;
    return `${formatNumber(count)} ${label}`;
  });

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function createPlaceholderActionText(warnings) {
  const summary = formatPlaceholderSummary(warnings);
  return summary ? `Resolve ${summary}` : '';
}

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

function formatMessagesPerMinute(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 msg/min';
  }
  const formatted = value >= 10 ? Math.round(value).toString() : value.toFixed(1);
  return `${formatted} msg/min`;
}

function formatWordsPerMinute(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 words/min';
  }
  const formatted = value >= 10 ? Math.round(value).toString() : value.toFixed(1);
  return `${formatted} words/min`;
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritePromptIds, setFavoritePromptIds] = useState([]);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [prTemplateText, setPrTemplateText] = useState(DEFAULT_PR_TEMPLATE);
  const [prCopyStatus, setPrCopyStatus] = useState('');
  const [prSummaryCopyStatus, setPrSummaryCopyStatus] = useState('');
  const [prReleaseCopyStatus, setPrReleaseCopyStatus] = useState('');
  const [prTestingCopyStatus, setPrTestingCopyStatus] = useState('');
  const [prSummaryInsertStatus, setPrSummaryInsertStatus] = useState('');
  const [prReleaseInsertStatus, setPrReleaseInsertStatus] = useState('');
  const [prTestingInsertStatus, setPrTestingInsertStatus] = useState('');
  const [insightsCopyStatus, setInsightsCopyStatus] = useState('');
  const [quickInsightsCopyStatus, setQuickInsightsCopyStatus] = useState('');
  const [snapshotCopyStatus, setSnapshotCopyStatus] = useState('');
  const [snapshotInsertStatus, setSnapshotInsertStatus] = useState('');
  const [insightsPrAppendStatus, setInsightsPrAppendStatus] = useState('');
  const [pulsePrAppendStatus, setPulsePrAppendStatus] = useState('');
  const [prTemplateTrimStatus, setPrTemplateTrimStatus] = useState('');
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
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
  const messageSearchButtonRef = useRef(null);
  const messageSearchInputRef = useRef(null);
  const messageSearchHasOpened = useRef(false);
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
        messagesPerMinute: 0,
        wordsPerMinute: 0,
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
    const minutes = durationMs > 0 ? durationMs / 60000 : 0;
    const messagesPerMinute = minutes > 0 ? totalMessages / minutes : 0;
    const wordsPerMinute = minutes > 0 ? totalWords / minutes : 0;

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
      messagesPerMinute,
      wordsPerMinute,
    };
  }, [messages]);
  const normalizedMessageSearchTerm = useMemo(() => messageSearchTerm.trim().toLowerCase(), [messageSearchTerm]);
  const hasMessageSearchTerm = normalizedMessageSearchTerm.length > 0;
  const messageSearchTermDisplay = messageSearchTerm.trim();
  const messageSearchPreview = useMemo(() => {
    if (!messageSearchTermDisplay) {
      return '';
    }

    return messageSearchTermDisplay.length > 60
      ? `${messageSearchTermDisplay.slice(0, 57)}…`
      : messageSearchTermDisplay;
  }, [messageSearchTermDisplay]);
  const visibleMessages = useMemo(() => {
    if (!Array.isArray(messages) || messages.length === 0) {
      return [];
    }

    if (!hasMessageSearchTerm) {
      return messages
        .filter((message) => message && typeof message === 'object')
        .map((message) => ({ message, matchSummary: null }));
    }

    const normalizedTerm = normalizedMessageSearchTerm;
    const previewTerm = messageSearchPreview;
    const results = [];

    const countMatches = (value) => {
      if (!normalizedTerm) {
        return 0;
      }

      const base = value == null ? '' : String(value).toLowerCase();
      if (!base) {
        return 0;
      }

      let count = 0;
      let index = base.indexOf(normalizedTerm);
      while (index !== -1) {
        count += 1;
        index = base.indexOf(normalizedTerm, index + normalizedTerm.length);
      }
      return count;
    };

    for (const message of messages) {
      if (!message || typeof message !== 'object') {
        continue;
      }

      const roleValue = typeof message.role === 'string' ? message.role : '';
      const textValue = typeof message.text === 'string' ? message.text : '';
      const timeValue = typeof message.time === 'string' ? message.time : '';
      const roleText = roleValue.toLowerCase();
      const messageText = textValue.toLowerCase();
      const timeText = timeValue.toLowerCase();

      const matchesSearch =
        roleText.includes(normalizedTerm) ||
        messageText.includes(normalizedTerm) ||
        timeText.includes(normalizedTerm);

      if (!matchesSearch) {
        continue;
      }

      const fields = [];
      let totalMatches = 0;

      const messageMatchCount = countMatches(textValue);
      if (messageMatchCount > 0) {
        fields.push({ id: 'message', label: 'Message', count: messageMatchCount });
        totalMatches += messageMatchCount;
      }

      const roleMatchCount = countMatches(roleValue);
      if (roleMatchCount > 0) {
        fields.push({ id: 'role', label: 'Sender', count: roleMatchCount });
        totalMatches += roleMatchCount;
      }

      const timeMatchCount = countMatches(timeValue);
      if (timeMatchCount > 0) {
        fields.push({ id: 'timestamp', label: 'Timestamp', count: timeMatchCount });
        totalMatches += timeMatchCount;
      }

      const matchSummary =
        totalMatches > 0
          ? {
              term: messageSearchTermDisplay,
              preview: previewTerm,
              total: totalMatches,
              fields,
            }
          : null;

      results.push({ message, matchSummary });
    }

    return results;
  }, [
    hasMessageSearchTerm,
    messageSearchPreview,
    messageSearchTermDisplay,
    messages,
    normalizedMessageSearchTerm,
  ]);
  const hiddenMessageCount = Math.max(0, messages.length - visibleMessages.length);
  const totalMessages = messages.length;
  const hasVisibleMessages = visibleMessages.length > 0;
  const showNoMessagesPlaceholder = totalMessages === 0;
  const showNoSearchMatches = hasMessageSearchTerm && !hasVisibleMessages && totalMessages > 0;
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
  const longestUpdateInfo = useMemo(() => {
    if (!hasMessages) {
      return { details: [], summary: '', ariaSummary: '' };
    }

    const details = [];
    const userLabel = formatWordAndCharLabel(
      conversationInsights.longestUserWords,
      conversationInsights.longestUserCharacters
    );
    if (userLabel) {
      details.push({ id: 'user', label: 'You', value: userLabel });
    }

    const assistantLabel = formatWordAndCharLabel(
      conversationInsights.longestAssistantWords,
      conversationInsights.longestAssistantCharacters
    );
    if (assistantLabel) {
      details.push({ id: 'assistant', label: 'Assistant', value: assistantLabel });
    }

    return {
      details,
      summary: details.map(({ label, value }) => `${label} — ${value}`).join(' · '),
      ariaSummary: details.map(({ label, value }) => `${label} ${value}`).join('. '),
    };
  }, [
    conversationInsights.longestAssistantCharacters,
    conversationInsights.longestAssistantWords,
    conversationInsights.longestUserCharacters,
    conversationInsights.longestUserWords,
    hasMessages,
  ]);
  const {
    details: longestUpdateDetails,
    summary: longestUpdateSummary,
    ariaSummary: longestUpdateAriaSummary,
  } = longestUpdateInfo;
  const longestMessageDisplay = longestMessageInfo
    ? `${longestMessageInfo.owner} — ${formatWordAndCharLabel(
        longestMessageInfo.words,
        longestMessageInfo.characters
      )}`
    : '';
  const longestMessageAria = longestUpdateAriaSummary
    ? longestUpdateAriaSummary
    : longestMessageInfo
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
    ? longestUpdateSummary || 'Waiting for the next update.'
    : 'Waiting for the first message.';
  const longestPauseDescription = hasMessages
    ? longestPauseDisplay || 'Waiting for additional replies.'
    : 'Waiting for the first message.';
  const hasPace = hasMessages && conversationInsights.durationMs > 0;
  const messagesPerMinuteDisplay = hasPace
    ? formatMessagesPerMinute(conversationInsights.messagesPerMinute)
    : '';
  const wordsPerMinuteDisplay = hasPace
    ? formatWordsPerMinute(conversationInsights.wordsPerMinute)
    : '';
  const paceSummaryDisplay = hasPace
    ? [messagesPerMinuteDisplay, wordsPerMinuteDisplay].filter(Boolean).join(' · ')
    : '';
  const insightsSummaryText = useMemo(() => {
    if (!hasMessages) {
      return 'No conversation yet — start chatting to generate insights.';
    }

    const bulletLines = ['**Conversation insights**', ''];
    const addLine = (label, value) => {
      const trimmedValue = typeof value === 'string' ? value.trim() : value;
      if (!label || (typeof trimmedValue === 'string' && !trimmedValue)) {
        return;
      }
      bulletLines.push(`* ${label}: ${trimmedValue}`);
    };

    addLine(
      'Messages',
      `${formatNumber(conversationInsights.total)} (${formatNumber(
        conversationInsights.userCount
      )} you / ${formatNumber(conversationInsights.assistantCount)} assistant)`
    );
    addLine(
      'Words',
      `${formatNumber(conversationInsights.totalWords)} total (avg ${averageWordsPerMessageDisplay} per message)`
    );
    addLine(
      'Characters',
      `${formatNumber(conversationInsights.totalCharacters)} total`
    );
    addLine(
      'You',
      `${formatNumber(conversationInsights.userWords)} words (${formatNumber(
        conversationInsights.userCharacters
      )} chars)`
    );
    addLine(
      'Assistant',
      `${formatNumber(conversationInsights.assistantWords)} words (${formatNumber(
        conversationInsights.assistantCharacters
      )} chars)`
    );

    if (wordShareDisplay) {
      addLine('Word share', wordShareDisplay);
    }

    if (paceSummaryDisplay) {
      addLine('Pace', paceSummaryDisplay);
    }

    const timelineParts = [];
    if (firstActivityDisplay) {
      timelineParts.push(`Started ${firstActivityDisplay}`);
    }
    if (lastReplyDisplay) {
      timelineParts.push(`Last reply ${lastReplyDisplay}`);
    }
    if (conversationDurationText) {
      timelineParts.push(`Span ${conversationDurationText}`);
    }
    if (timelineParts.length > 0) {
      addLine('Timeline', timelineParts.join(' · '));
    }

    addLine(
      'Longest user update',
      conversationInsights.longestUserWords > 0
        ? formatWordAndCharLabel(
            conversationInsights.longestUserWords,
            conversationInsights.longestUserCharacters
          )
        : ''
    );
    addLine(
      'Longest assistant update',
      conversationInsights.longestAssistantWords > 0
        ? formatWordAndCharLabel(
            conversationInsights.longestAssistantWords,
            conversationInsights.longestAssistantCharacters
          )
        : ''
    );
    addLine('Longest update', longestMessageDescription);
    addLine('Longest pause', longestPauseDescription);

    if (modelName) {
      addLine('Model', modelName);
    }

    if (trimmedSystemPrompt) {
      addLine(
        'System prompt',
        systemPromptPreview ? `Custom — ${systemPromptPreview}` : 'Custom'
      );
    } else {
      addLine('System prompt', 'Default');
    }

    return bulletLines.join('\n');
  }, [
    averageWordsPerMessageDisplay,
    conversationDurationText,
    conversationInsights,
    firstActivityDisplay,
    hasMessages,
    lastReplyDisplay,
    longestMessageDescription,
    longestPauseDescription,
    modelName,
    paceSummaryDisplay,
    systemPromptPreview,
    trimmedSystemPrompt,
    wordShareDisplay,
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
        key: 'characters',
        title: 'Characters',
        value: `${formatNumber(conversationInsights.totalCharacters)} total`,
        description: `${formatNumber(conversationInsights.userCharacters)} you / ${formatNumber(
          conversationInsights.assistantCharacters
        )} assistant`,
      },
      hasPace
        ? {
            key: 'pace',
            title: 'Pace',
            value: messagesPerMinuteDisplay || '—',
            description: wordsPerMinuteDisplay ? `Words ${wordsPerMinuteDisplay}` : '',
          }
        : null,
      wordShareDisplay
        ? {
            key: 'word-share',
            title: 'Word share',
            value: wordShareDisplay,
            description: 'Distribution of contribution across the thread.',
          }
        : null,
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
        description: longestUpdateSummary
          ? `${longestUpdateSummary} · Densest exchange so far—great for highlights.`
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

    return items.filter(Boolean);
  }, [
    averageWordsPerMessageDisplay,
    conversationDurationText,
    conversationInsights.assistantCharacters,
    conversationInsights.totalCharacters,
    conversationInsights.totalWords,
    conversationInsights.userCharacters,
    firstActivityDisplay,
    hasMessages,
    hasPace,
    lastReplyDisplay,
    longestMessageDisplay,
    longestUpdateSummary,
    longestPauseDisplay,
    messageStats.assistantCount,
    messageStats.total,
    messageStats.userCount,
    modelName,
    messagesPerMinuteDisplay,
    systemPromptPreview,
    trimmedSystemPrompt,
    wordsPerMinuteDisplay,
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
  const prTemplateStats = useMemo(() => {
    const trimmedTemplate = typeof prTemplateText === 'string' ? prTemplateText.trim() : '';
    const summarySection = getSectionWithHeading(trimmedTemplate, '**Summary**');
    const summaryBody = getSectionBodyByHeading(trimmedTemplate, '**Summary**');
    const hasSummarySection = Boolean(summarySection);
    const hasSummaryContent = summaryBody.length > 0;
    const releaseNotesSection = getSectionWithHeading(trimmedTemplate, RELEASE_NOTES_HEADING);
    const releaseNotesBody = getSectionBodyByHeading(trimmedTemplate, RELEASE_NOTES_HEADING);
    const hasReleaseNotesSection = Boolean(releaseNotesSection);
    const hasReleaseNotesContent = releaseNotesBody.length > 0;
    const testingSection = getSectionWithHeading(trimmedTemplate, '**Testing**');
    const testingBody = getSectionBodyByHeading(trimmedTemplate, '**Testing**');
    const hasTestingSection = Boolean(testingSection);
    const hasTestingContent = testingBody.length > 0;
    const placeholderWarnings = collectPlaceholderWarnings(trimmedTemplate);
    const summaryPlaceholderWarnings = collectPlaceholderWarnings(summarySection);
    const releaseNotesPlaceholderWarnings = collectPlaceholderWarnings(releaseNotesSection);
    const testingPlaceholderWarnings = collectPlaceholderWarnings(testingSection);
    const totalPlaceholders = placeholderWarnings.reduce((total, warning) => total + warning.count, 0);

    return {
      totalWords: countWords(trimmedTemplate),
      totalCharacters: trimmedTemplate.length,
      summarySection,
      summaryBody,
      summaryWords: countWords(summaryBody),
      summaryCharacters: summaryBody.length,
      summaryPreview: createSummaryPreview(summaryBody),
      hasSummarySection,
      hasSummaryContent,
      summaryPlaceholderWarnings,
      hasSummaryPlaceholders: summaryPlaceholderWarnings.length > 0,
      releaseNotesSection,
      releaseNotesBody,
      releaseNotesWords: countWords(releaseNotesBody),
      releaseNotesCharacters: releaseNotesBody.length,
      releaseNotesPreview: createSummaryPreview(releaseNotesBody),
      hasReleaseNotesSection,
      hasReleaseNotesContent,
      releaseNotesPlaceholderWarnings,
      hasReleaseNotesPlaceholders: releaseNotesPlaceholderWarnings.length > 0,
      testingSection,
      testingBody,
      testingWords: countWords(testingBody),
      testingCharacters: testingBody.length,
      testingPreview: createSummaryPreview(testingBody),
      hasTestingSection,
      hasTestingContent,
      testingPlaceholderWarnings,
      hasTestingPlaceholders: testingPlaceholderWarnings.length > 0,
      placeholderWarnings,
      totalPlaceholders,
      hasPlaceholders: totalPlaceholders > 0,
    };
  }, [prTemplateText]);

  const summaryReady = prTemplateStats.hasSummarySection && prTemplateStats.hasSummaryContent;
  const releaseNotesReady =
    prTemplateStats.hasReleaseNotesSection && prTemplateStats.hasReleaseNotesContent;
  const testingReady = prTemplateStats.hasTestingSection && prTemplateStats.hasTestingContent;

  const summaryCopyDefault = prTemplateStats.hasSummarySection
    ? summaryReady
      ? 'Copy summary section'
      : 'Add summary details first'
    : 'Add a "Summary" heading first';
  const releaseCopyDefault = prTemplateStats.hasReleaseNotesSection
    ? releaseNotesReady
      ? 'Copy release notes section'
      : 'Add release notes first'
    : 'Add a "Changelog & Release notes" heading first';
  const testingCopyDefault = prTemplateStats.hasTestingSection
    ? testingReady
      ? 'Copy testing section'
      : 'Add testing notes first'
    : 'Add a "Testing" heading first';

  const summaryInsertDefault = prTemplateStats.hasSummarySection
    ? summaryReady
      ? 'Insert summary into chat'
      : 'Add summary details first'
    : 'Add a "Summary" heading first';
  const releaseInsertDefault = prTemplateStats.hasReleaseNotesSection
    ? releaseNotesReady
      ? 'Insert release notes into chat'
      : 'Add release notes first'
    : 'Add a "Changelog & Release notes" heading first';
  const testingInsertDefault = prTemplateStats.hasTestingSection
    ? testingReady
      ? 'Insert testing into chat'
      : 'Add testing notes first'
    : 'Add a "Testing" heading first';

  const summaryCopyDisplay = prSummaryCopyStatus || summaryCopyDefault;
  const releaseCopyDisplay = prReleaseCopyStatus || releaseCopyDefault;
  const testingCopyDisplay = prTestingCopyStatus || testingCopyDefault;
  const summaryInsertDisplay = prSummaryInsertStatus || summaryInsertDefault;
  const releaseInsertDisplay = prReleaseInsertStatus || releaseInsertDefault;
  const testingInsertDisplay = prTestingInsertStatus || testingInsertDefault;

  const templatePlaceholderAction = useMemo(
    () => createPlaceholderActionText(prTemplateStats.placeholderWarnings),
    [prTemplateStats.placeholderWarnings]
  );
  const summaryPlaceholderAction = useMemo(
    () => createPlaceholderActionText(prTemplateStats.summaryPlaceholderWarnings),
    [prTemplateStats.summaryPlaceholderWarnings]
  );
  const releasePlaceholderAction = useMemo(
    () => createPlaceholderActionText(prTemplateStats.releaseNotesPlaceholderWarnings),
    [prTemplateStats.releaseNotesPlaceholderWarnings]
  );
  const testingPlaceholderAction = useMemo(
    () => createPlaceholderActionText(prTemplateStats.testingPlaceholderWarnings),
    [prTemplateStats.testingPlaceholderWarnings]
  );

  const adjustInputHeight = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, []);
  const insertTextIntoComposer = useCallback(
    (text, options) => {
      const { focusInput = true } = options ?? {};
      const trimmedText = typeof text === 'string' ? text.trim() : '';
      if (!trimmedText) {
        return false;
      }

      setInput((prev) => {
        const trimmedPrev = prev.trimEnd();
        return trimmedPrev ? `${trimmedPrev}\n\n${trimmedText}` : trimmedText;
      });

      requestAnimationFrame(() => {
        adjustInputHeight();
        if (focusInput && inputRef.current) {
          inputRef.current.focus();
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      });

      return true;
    },
    [adjustInputHeight]
  );
  const preparePrContentForSharing = useCallback((content) => {
    const base = typeof content === 'string' ? content : '';
    const normalizedBase = base.trim();

    if (!normalizedBase) {
      return { text: '', trimmed: false, emptyAfterTrim: true };
    }

    const trimmed = trimPrTemplatePlaceholders(base);
    const normalizedTrimmed = trimmed.trim();

    if (!normalizedTrimmed) {
      return { text: normalizedBase, trimmed: false, emptyAfterTrim: true };
    }

    const comparableBase = base.replace(/\s+$/, '');
    const comparableTrimmed = trimmed.replace(/\s+$/, '');
    const trimmedApplied = comparableTrimmed !== comparableBase;

    return {
      text: trimmedApplied ? trimmed : base,
      trimmed: trimmedApplied,
      emptyAfterTrim: false,
    };
  }, []);
  const buildPrShareStatus = useCallback((verb, shareInfo, placeholderAction) => {
    if (!shareInfo) {
      return `${verb}!`;
    }

    const { trimmed, emptyAfterTrim } = shareInfo;

    if (trimmed) {
      return `${verb}! Placeholder text removed`;
    }

    if (emptyAfterTrim) {
      return `${verb}! Replace placeholder text before sharing`;
    }

    return placeholderAction ? `${verb}! ${placeholderAction}` : `${verb}!`;
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
  const handleInsertSnapshot = useCallback(() => {
    const trimmedSnapshot = conversationSnapshotText.trim();
    if (!hasMessages || !trimmedSnapshot) {
      setSnapshotInsertStatus(hasMessages ? 'Pulse summary not ready' : 'Add a message first');
      setTimeout(() => setSnapshotInsertStatus(''), 2000);
      return;
    }

    setInput((prev) => {
      const trimmedPrev = prev.trimEnd();
      return trimmedPrev ? `${trimmedPrev}\n\n${trimmedSnapshot}` : trimmedSnapshot;
    });

    setSnapshotInsertStatus('Inserted');
    requestAnimationFrame(() => {
      adjustInputHeight();
      if (inputRef.current) {
        inputRef.current.focus();
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });

    setTimeout(() => setSnapshotInsertStatus(''), 2000);
  }, [adjustInputHeight, conversationSnapshotText, hasMessages]);
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
  const prInsightsBlock = useMemo(() => createPrInsightsBlock(insightsSummaryText), [insightsSummaryText]);

  const appendInsightsToTemplate = useCallback(() => {
    const trimmedSummary = prInsightsBlock.trim();
    if (!hasMessages || !trimmedSummary) {
      return 'unavailable';
    }

    let result = 'duplicate';

    setPrTemplateText((prev) => {
      const trimmedPrev = prev.trimEnd();
      if (!trimmedPrev) {
        result = 'appended';
        return `**Summary**\n${trimmedSummary}\n`;
      }

      const sections = trimmedPrev.split(/\n{2,}/);
      let alreadyPresent = false;
      let updated = false;
      const updatedSections = sections.map((section) => {
        const [firstLine, ...rest] = section.split('\n');
        if (normalizeHeadingValue(firstLine) === 'summary') {
          const body = rest.join('\n');
          if (body.includes(trimmedSummary)) {
            alreadyPresent = true;
            return section;
          }
          updated = true;
          const newBody = body ? `${body}\n${trimmedSummary}` : trimmedSummary;
          return [firstLine, newBody].filter(Boolean).join('\n');
        }
        return section;
      });

      if (alreadyPresent) {
        result = 'duplicate';
        return prev;
      }

      if (updated) {
        result = 'appended';
        return `${updatedSections.join('\n\n')}\n`;
      }

      if (trimmedPrev.includes(trimmedSummary)) {
        result = 'duplicate';
        return prev;
      }

      result = 'appended';
      return [`**Summary**`, trimmedSummary, trimmedPrev].join('\n\n') + '\n';
    });

    return result;
  }, [hasMessages, prInsightsBlock, setPrTemplateText]);

  const handleAppendInsightsToPrTemplate = useCallback(() => {
    const outcome = appendInsightsToTemplate();

    if (outcome === 'unavailable') {
      setPrInsightsAppendStatus(hasMessages ? 'Insights not ready' : 'Add a message first');
    } else if (outcome === 'appended') {
      setPrInsightsAppendStatus('Insights added');
      focusPrHelperTextarea();
    } else {
      setPrInsightsAppendStatus('Already added');
    }

    setTimeout(() => setPrInsightsAppendStatus(''), 2000);
  }, [appendInsightsToTemplate, focusPrHelperTextarea, hasMessages]);

  const handleSendPulseToPrHelper = useCallback(() => {
    const outcome = appendInsightsToTemplate();

    if (outcome === 'unavailable') {
      setPulsePrAppendStatus(hasMessages ? 'Insights not ready' : 'Add a message first');
    } else if (outcome === 'appended') {
      setPulsePrAppendStatus('Insights added');
      focusPrHelperTextarea();
    } else {
      setPulsePrAppendStatus('Already added');
    }

    setTimeout(() => setPulsePrAppendStatus(''), 2000);
  }, [appendInsightsToTemplate, focusPrHelperTextarea, hasMessages]);

  const handleSendInsightsToPrHelper = useCallback(() => {
    const outcome = appendInsightsToTemplate();

    if (outcome === 'unavailable') {
      setInsightsPrAppendStatus(hasMessages ? 'Insights not ready' : 'Add a message first');
      setTimeout(() => setInsightsPrAppendStatus(''), 2000);
      return;
    }

    if (outcome === 'appended') {
      setInsightsPrAppendStatus('Sent to PR helper');
    } else {
      setInsightsPrAppendStatus('Already added to PR helper');
    }

    setShowPrHelper(true);
    setShowInsights(false);

    setTimeout(() => setInsightsPrAppendStatus(''), 2000);
  }, [appendInsightsToTemplate, hasMessages, setShowInsights, setShowPrHelper]);

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
    setSnapshotInsertStatus('');
    setInsightsPrAppendStatus('');
    setPrInsightsAppendStatus('');
    setPrSummaryCopyStatus('');
    setPrReleaseCopyStatus('');
    setPrTestingCopyStatus('');
    setPrSummaryInsertStatus('');
    setPrReleaseInsertStatus('');
    setPrTestingInsertStatus('');
    setMessageSearchTerm('');
    setShowMessageSearch(false);
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
  const toggleShowFavoritesOnly = useCallback(() => {
    setShowFavoritesOnly((prev) => !prev);
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
  const hasFavoritePrompts = favoritePromptIds.length > 0;
  const favoritePromptCount = favoritePromptIds.length;
  const favoriteToggleClass = useMemo(() => {
    const baseClasses = [
      'inline-flex items-center rounded-full border px-2 py-1 text-[0.7rem] uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
      showFavoritesOnly
        ? 'border-blue-500 bg-blue-600 text-white dark:border-blue-300 dark:bg-blue-400 dark:text-gray-900'
        : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:border-blue-600 dark:hover:bg-blue-900/60',
      hasFavoritePrompts
        ? ''
        : 'cursor-not-allowed opacity-60 hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-900 dark:hover:bg-blue-950/40',
    ];
    return baseClasses.filter(Boolean).join(' ');
  }, [hasFavoritePrompts, showFavoritesOnly]);
  const favoriteFilterStatus = useMemo(() => {
    if (!hasFavoritePrompts) {
      return 'Star prompts to enable favorites filter.';
    }
    if (showFavoritesOnly) {
      return `Showing ${favoritePromptCount} favorite${favoritePromptCount === 1 ? '' : 's'}`;
    }
    return '';
  }, [favoritePromptCount, hasFavoritePrompts, showFavoritesOnly]);

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

    const favoritesFiltered = showFavoritesOnly
      ? filtered.filter((suggestion) => favoritePromptOrder.has(suggestion.id))
      : filtered;

    return sortPromptSuggestions(favoritesFiltered);
  }, [
    favoritePromptOrder,
    promptSearch,
    promptTagFilterValue,
    showFavoritesOnly,
    sortPromptSuggestions,
  ]);

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

  const handleCopyPrTemplate = useCallback(async () => {
    const shareInfo = preparePrContentForSharing(prTemplateText);
    const shareText = typeof shareInfo.text === 'string' ? shareInfo.text : '';

    if (!shareText.trim()) {
      setPrCopyStatus('Add details before copying');
      setTimeout(() => setPrCopyStatus(''), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setPrCopyStatus(buildPrShareStatus('Copied', shareInfo, templatePlaceholderAction));
    } catch (err) {
      setPrCopyStatus('Copy failed');
    }
    setTimeout(() => setPrCopyStatus(''), 2000);
  }, [
    buildPrShareStatus,
    preparePrContentForSharing,
    prTemplateText,
    templatePlaceholderAction,
  ]);

  const handleCopySummarySection = useCallback(async () => {
    if (!prTemplateStats.hasSummarySection) {
      setPrSummaryCopyStatus('Add a Summary section first');
      setTimeout(() => setPrSummaryCopyStatus(''), 2000);
      return;
    }

    const shareInfo = preparePrContentForSharing(prTemplateStats.summarySection);
    const summarySection = shareInfo.text.trim();
    if (!prTemplateStats.hasSummaryContent || !summarySection) {
      setPrSummaryCopyStatus('Add summary details first');
      setTimeout(() => setPrSummaryCopyStatus(''), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(shareInfo.text);
      setPrSummaryCopyStatus(
        buildPrShareStatus('Copied', shareInfo, summaryPlaceholderAction)
      );
    } catch (err) {
      setPrSummaryCopyStatus('Copy failed');
    }

    setTimeout(() => setPrSummaryCopyStatus(''), 2000);
  }, [
    buildPrShareStatus,
    preparePrContentForSharing,
    summaryPlaceholderAction,
    prTemplateStats.hasSummaryContent,
    prTemplateStats.hasSummarySection,
    prTemplateStats.summarySection,
  ]);

  const handleCopyReleaseNotesSection = useCallback(async () => {
    if (!prTemplateStats.hasReleaseNotesSection) {
      setPrReleaseCopyStatus('Add release notes first');
      setTimeout(() => setPrReleaseCopyStatus(''), 2000);
      return;
    }

    const shareInfo = preparePrContentForSharing(prTemplateStats.releaseNotesSection);
    const releaseNotesSection = shareInfo.text.trim();
    if (!prTemplateStats.hasReleaseNotesContent || !releaseNotesSection) {
      setPrReleaseCopyStatus('Add release notes first');
      setTimeout(() => setPrReleaseCopyStatus(''), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(shareInfo.text);
      setPrReleaseCopyStatus(
        buildPrShareStatus('Copied', shareInfo, releasePlaceholderAction)
      );
    } catch (err) {
      setPrReleaseCopyStatus('Copy failed');
    }

    setTimeout(() => setPrReleaseCopyStatus(''), 2000);
  }, [
    buildPrShareStatus,
    preparePrContentForSharing,
    releasePlaceholderAction,
    prTemplateStats.hasReleaseNotesContent,
    prTemplateStats.hasReleaseNotesSection,
    prTemplateStats.releaseNotesSection,
  ]);

  const handleCopyTestingSection = useCallback(async () => {
    if (!prTemplateStats.hasTestingSection) {
      setPrTestingCopyStatus('Add a Testing section first');
      setTimeout(() => setPrTestingCopyStatus(''), 2000);
      return;
    }

    const shareInfo = preparePrContentForSharing(prTemplateStats.testingSection);
    const testingSection = shareInfo.text.trim();
    if (!prTemplateStats.hasTestingContent || !testingSection) {
      setPrTestingCopyStatus('Add testing notes first');
      setTimeout(() => setPrTestingCopyStatus(''), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(shareInfo.text);
      setPrTestingCopyStatus(
        buildPrShareStatus('Copied', shareInfo, testingPlaceholderAction)
      );
    } catch (err) {
      setPrTestingCopyStatus('Copy failed');
    }

    setTimeout(() => setPrTestingCopyStatus(''), 2000);
  }, [
    buildPrShareStatus,
    preparePrContentForSharing,
    testingPlaceholderAction,
    prTemplateStats.hasTestingContent,
    prTemplateStats.hasTestingSection,
    prTemplateStats.testingSection,
  ]);

  const handleInsertPrTemplate = () => {
    const shareInfo = preparePrContentForSharing(prTemplateText);
    const inserted = insertTextIntoComposer(shareInfo.text);
    if (inserted) {
      setShowPrHelper(false);
    }
  };

  const handleInsertSummarySection = useCallback(() => {
    if (!prTemplateStats.hasSummarySection || !prTemplateStats.hasSummaryContent) {
      setPrSummaryInsertStatus('Add summary details first');
      setTimeout(() => setPrSummaryInsertStatus(''), 2000);
      return;
    }

    const shareInfo = preparePrContentForSharing(prTemplateStats.summarySection);
    const inserted = insertTextIntoComposer(shareInfo.text, { focusInput: false });
    setPrSummaryInsertStatus(
      inserted
        ? buildPrShareStatus('Inserted', shareInfo, summaryPlaceholderAction)
        : 'Add summary details first'
    );
    setTimeout(() => setPrSummaryInsertStatus(''), 2000);
  }, [
    buildPrShareStatus,
    preparePrContentForSharing,
    insertTextIntoComposer,
    prTemplateStats.hasSummaryContent,
    prTemplateStats.hasSummarySection,
    prTemplateStats.summarySection,
    summaryPlaceholderAction,
  ]);

  const handleInsertReleaseNotesSection = useCallback(() => {
    if (!prTemplateStats.hasReleaseNotesSection || !prTemplateStats.hasReleaseNotesContent) {
      setPrReleaseInsertStatus('Add release notes first');
      setTimeout(() => setPrReleaseInsertStatus(''), 2000);
      return;
    }

    const shareInfo = preparePrContentForSharing(prTemplateStats.releaseNotesSection);
    const inserted = insertTextIntoComposer(shareInfo.text, { focusInput: false });
    setPrReleaseInsertStatus(
      inserted
        ? buildPrShareStatus('Inserted', shareInfo, releasePlaceholderAction)
        : 'Add release notes first'
    );
    setTimeout(() => setPrReleaseInsertStatus(''), 2000);
  }, [
    buildPrShareStatus,
    preparePrContentForSharing,
    insertTextIntoComposer,
    prTemplateStats.hasReleaseNotesContent,
    prTemplateStats.hasReleaseNotesSection,
    prTemplateStats.releaseNotesSection,
    releasePlaceholderAction,
  ]);

  const handleInsertTestingSection = useCallback(() => {
    if (!prTemplateStats.hasTestingSection || !prTemplateStats.hasTestingContent) {
      setPrTestingInsertStatus('Add testing notes first');
      setTimeout(() => setPrTestingInsertStatus(''), 2000);
      return;
    }

    const shareInfo = preparePrContentForSharing(prTemplateStats.testingSection);
    const inserted = insertTextIntoComposer(shareInfo.text, { focusInput: false });
    setPrTestingInsertStatus(
      inserted
        ? buildPrShareStatus('Inserted', shareInfo, testingPlaceholderAction)
        : 'Add testing notes first'
    );
    setTimeout(() => setPrTestingInsertStatus(''), 2000);
  }, [
    buildPrShareStatus,
    preparePrContentForSharing,
    insertTextIntoComposer,
    prTemplateStats.hasTestingContent,
    prTemplateStats.hasTestingSection,
    prTemplateStats.testingSection,
    testingPlaceholderAction,
  ]);


  const handleResetPrTemplate = () => {
    setPrTemplateText(DEFAULT_PR_TEMPLATE);
    setPrCopyStatus('');
    setPrSummaryCopyStatus('');
    setPrReleaseCopyStatus('');
    setPrTestingCopyStatus('');
    setPrSummaryInsertStatus('');
    setPrReleaseInsertStatus('');
    setPrTestingInsertStatus('');
    setPrInsightsAppendStatus('');
    setPrTemplateTrimStatus('');
    requestAnimationFrame(() => {
      if (prHelperTextareaRef.current) {
        prHelperTextareaRef.current.focus();
        prHelperTextareaRef.current.select();
      }
    });
  };

  const handleTrimPrTemplate = useCallback(() => {
    setPrTemplateText((prev) => {
      const normalize = (value) => (typeof value === 'string' ? value.trimEnd() : '');
      const trimmed = trimPrTemplatePlaceholders(prev);
      const changed = normalize(trimmed) !== normalize(prev);

      setPrTemplateTrimStatus(changed ? 'Placeholder text removed' : 'Nothing to trim');

      if (changed) {
        focusPrHelperTextarea();
      }

      return changed ? trimmed : prev;
    });

    setTimeout(() => setPrTemplateTrimStatus(''), 2000);
  }, [focusPrHelperTextarea]);

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
        const snippetWithNewline = section.snippet.endsWith('\n')
          ? section.snippet
          : `${section.snippet}\n`;

        if (!trimmedPrev) {
          return snippetWithNewline;
        }

        const normalizedHeading = section.heading ? normalizeHeadingValue(section.heading) : '';
        const snippetBodyLines = snippetWithNewline.trimEnd().split('\n');
        const bodyContent = normalizedHeading
          ? snippetBodyLines.slice(1).join('\n').trim()
          : snippetBodyLines.join('\n').trim();

        const sections = trimmedPrev.split(/\n{2,}/);
        let updated = false;

        const updatedSections = sections.map((block) => {
          if (!normalizedHeading) {
            return block;
          }

          const [firstLine, ...rest] = block.split('\n');
          if (normalizeHeadingValue(firstLine) !== normalizedHeading) {
            return block;
          }

          updated = true;
          if (!bodyContent) {
            return block;
          }

          const existingBody = rest.join('\n').trimEnd();
          if (existingBody.includes(bodyContent)) {
            return block;
          }

          const newBody = existingBody ? `${existingBody}\n${bodyContent}` : bodyContent;
          return [firstLine, newBody].filter(Boolean).join('\n');
        });

        if (updated) {
          return `${updatedSections.join('\n\n')}\n`;
        }

        return `${trimmedPrev}\n\n${snippetWithNewline}`;
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
      if (!e.altKey || !e.shiftKey) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'c') {
        e.preventDefault();
        if (window.confirm('Clear chat history?')) {
          handleClear();
        }
        return;
      }

      if (key === 'p') {
        e.preventDefault();
        setShowPromptLibrary(true);
        setShowPrHelper(false);
        setShowInsights(false);
        return;
      }

      if (key === 'h') {
        e.preventDefault();
        setShowPrHelper(true);
        setShowPromptLibrary(false);
        setShowInsights(false);
        return;
      }

      if (key === 'i') {
        e.preventDefault();
        setShowInsights(true);
        setShowPromptLibrary(false);
        setShowPrHelper(false);
      }
    };

    window.addEventListener('keydown', shortcutHandler);
    return () => window.removeEventListener('keydown', shortcutHandler);
  }, [handleClear, setShowInsights, setShowPrHelper, setShowPromptLibrary]);

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
    if (!hasFavoritePrompts && showFavoritesOnly) {
      setShowFavoritesOnly(false);
    }
  }, [hasFavoritePrompts, showFavoritesOnly]);

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
    if (!showMessageSearch) {
      if (messageSearchHasOpened.current && messageSearchButtonRef.current) {
        messageSearchButtonRef.current.focus();
      }
      return;
    }

    messageSearchHasOpened.current = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowMessageSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      if (messageSearchInputRef.current) {
        messageSearchInputRef.current.focus();
        messageSearchInputRef.current.select();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMessageSearch]);

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
      setPrSummaryCopyStatus('');
      setPrReleaseCopyStatus('');
      setPrTestingCopyStatus('');
      setPrSummaryInsertStatus('');
      setPrReleaseInsertStatus('');
      setPrTestingInsertStatus('');
      setPrTemplateTrimStatus('');
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
      setInsightsPrAppendStatus('');
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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleGlobalShortcut = (event) => {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const key = typeof event.key === 'string' ? event.key.toLowerCase() : '';
      if (!key) {
        return;
      }

      if (key === 'p') {
        event.preventDefault();
        setShowPromptLibrary(true);
      } else if (key === 'h') {
        event.preventDefault();
        setShowPrHelper(true);
      } else if (key === 'i') {
        event.preventDefault();
        setShowInsights(true);
      } else if (key === 'c') {
        event.preventDefault();
        if (window.confirm('Clear chat history?')) {
          handleClear();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalShortcut);
    return () => {
      window.removeEventListener('keydown', handleGlobalShortcut);
    };
  }, [handleClear]);

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
          <ClearChatButton
            onClear={handleClear}
            ariaLabel="Clear conversation (Alt+Shift+C)"
            title="Alt+Shift+C"
          />
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
            aria-label="Prompt library (Alt+Shift+P)"
            title="Alt+Shift+P"
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
            aria-label="PR helper (Alt+Shift+H)"
            title="Alt+Shift+H"
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
            aria-label="Insights (Alt+Shift+I)"
            title="Alt+Shift+I"
          >
            Insights
          </button>
          <button
            type="button"
            ref={messageSearchButtonRef}
            onClick={() => setShowMessageSearch((prev) => !prev)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-expanded={showMessageSearch}
            aria-controls="message-search-panel"
            aria-label="Search conversation messages"
          >
            {showMessageSearch ? 'Hide search' : 'Search messages'}
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
                {wordShareDisplay && (
                  <span className="self-center" aria-label={`Word share ${wordShareDisplay}`}>
                    Word share: {wordShareDisplay}
                  </span>
                )}
                {paceSummaryDisplay && (
                  <span className="self-center" aria-label={`Pace ${paceSummaryDisplay}`}>
                    Pace: {paceSummaryDisplay}
                  </span>
                )}
                {firstActivityDisplay && (
                  <span className="self-center" aria-label={`Started ${firstActivityDisplay}`}>
                    Started: {firstActivityDisplay}
                  </span>
                )}
                {longestMessageDisplay && (
                  <span
                    className="self-center"
                    aria-label={`Longest update ${longestMessageAria || longestMessageDisplay}`}
                    title={longestUpdateSummary || longestMessageDisplay}
                  >
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
            {hasMessageSearchTerm && (
              <span
                className="self-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                aria-label={`Search filter active: ${messageSearchPreview} (${visibleMessages.length} of ${messages.length} messages)`}
                title={messageSearchTermDisplay}
              >
                Search: “{messageSearchPreview}” ({visibleMessages.length}/{messages.length})
              </span>
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
        {showMessageSearch && (
          <div
            id="message-search-panel"
            className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 space-y-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
              <div className="flex-1">
                <label
                  htmlFor="message-search-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Search conversation
                </label>
                <input
                  id="message-search-input"
                  ref={messageSearchInputRef}
                  type="search"
                  value={messageSearchTerm}
                  onChange={(event) => setMessageSearchTerm(event.target.value)}
                  placeholder="Search messages, roles, or timestamps"
                  className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMessageSearchTerm('')}
                  disabled={!messageSearchTermDisplay}
                  className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:border-blue-400 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-400"
                >
                  Clear search
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageSearch(false)}
                  className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:border-blue-400 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-400"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
              {hasMessageSearchTerm ? (
                <span aria-live="polite">
                  Showing {visibleMessages.length} of {messages.length} messages matching “{messageSearchPreview}”.
                  {hiddenMessageCount > 0 ? ' Clear the filter to see the rest.' : ''}
                </span>
              ) : (
                <span>
                  Matches update automatically as you type, and each result highlights the hit breakdown above the
                  message.
                </span>
              )}
              {hasMessageSearchTerm && hiddenMessageCount > 0 && (
                <span className="text-xs text-blue-600 dark:text-blue-300" aria-live="polite">
                  Hidden messages: {hiddenMessageCount}
                </span>
              )}
            </div>
          </div>
        )}
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
          {showNoMessagesPlaceholder && !loading && (
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
                  Looking for more inspiration? Open the <span className="font-medium">Prompt library</span> from the header to browse every saved starter—including the new stand-up update helper. Click a badge to filter the list by theme or use search in the library for keyword matches, then favorite the prompts you revisit so they stay at the top of the grid.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Want a quick pulse check on the conversation? Tap the <span className="font-medium">Insights</span> button in the header to review message counts, word totals, timestamps, and a copy-ready summary you can drop into docs or follow-up prompts. Use the <span className="font-medium">Insert pulse into chat</span> shortcut beside the copy action to paste those stats directly into the composer when you're drafting an update, tap <span className="font-medium">Send pulse to PR helper</span> from the pulse card to update your template instantly, or open the modal's <span className="font-medium">Send to PR helper</span> action to sync the latest snapshot without leaving the overlay.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Preparing a pull request? The <span className="font-medium">PR helper</span> button now surfaces live word and character counts plus summary and testing previews before you copy, and offers a ready-to-edit template with bold section headings, citation placeholders, quick copy shortcuts for the Summary and Testing sections, quick-add buttons for Impact, Security & Privacy, Accessibility, User Experience, Performance, Analytics & Monitoring, Release notes, Dependencies, Feature flags, Tickets & Tracking, Rollout, Documentation, evidence bullets (files, logs, metrics, screenshots, docs, videos), or additional test results—and it now accepts the Insights summary directly so your draft stays in sync with the latest conversation, alongside a shortcut to link the external release notes draft. Use the new <span className="font-medium">Trim placeholder text</span> button inside the helper to strip template boilerplate before copying or inserting your notes.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Prefer shortcuts? Press{' '}
                  <kbd className={KEY_CAP_CLASS}>Alt</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>Shift</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>P</kbd>
                  {' '}for the Prompt library,{' '}
                  <kbd className={KEY_CAP_CLASS}>Alt</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>Shift</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>H</kbd>
                  {' '}for the PR helper,{' '}
                  <kbd className={KEY_CAP_CLASS}>Alt</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>Shift</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>I</kbd>
                  {' '}for Insights, or{' '}
                  <kbd className={KEY_CAP_CLASS}>Alt</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>Shift</kbd>
                  {' + '}
                  <kbd className={KEY_CAP_CLASS}>C</kbd>
                  {' '}to clear the conversation from anywhere.
                </p>
              </div>
            </div>
          )}
          {hasMessageSearchTerm && (
            <div className="mb-4 flex flex-col gap-2 rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100">
              <div aria-live="polite">
                Showing {visibleMessages.length} of {messages.length} messages matching “{messageSearchPreview}”.
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-200">
                Matches appear above each result with counts for the message body, sender, and timestamp fields.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {hiddenMessageCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                    Hidden: {hiddenMessageCount}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setMessageSearchTerm('')}
                  className="inline-flex items-center rounded border border-blue-300 px-2 py-1 font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-blue-800/40"
                >
                  Clear search filter
                </button>
              </div>
            </div>
          )}
          {showNoSearchMatches && !loading && (
            <div className="mb-4 rounded-lg border border-dashed border-blue-300 bg-blue-50/60 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100">
              <p>No messages match “{messageSearchPreview}” yet.</p>
              <button
                type="button"
                onClick={() => setMessageSearchTerm('')}
                className="mt-3 inline-flex items-center rounded border border-blue-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700 transition hover:border-blue-400 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-blue-800/40"
              >
                Clear search to show all messages
              </button>
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
                <div className="flex flex-wrap items-center gap-2">
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
                  <button
                    type="button"
                    onClick={handleInsertSnapshot}
                    aria-disabled={!hasMessages && !snapshotInsertStatus}
                    className={`rounded border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      hasMessages
                        ? 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:text-blue-600 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-200 dark:hover:border-blue-400'
                        : 'cursor-not-allowed border-blue-100 bg-white/60 text-blue-300 dark:border-blue-900 dark:bg-gray-800 dark:text-blue-700'
                    }`}
                  >
                    <span aria-live="polite">{snapshotInsertStatus || 'Insert pulse into chat'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSendPulseToPrHelper}
                    aria-disabled={!hasMessages && !pulsePrAppendStatus}
                    className={`rounded border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      hasMessages
                        ? 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:text-blue-600 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-200 dark:hover:border-blue-400'
                        : 'cursor-not-allowed border-blue-100 bg-white/60 text-blue-300 dark:border-blue-900 dark:bg-gray-800 dark:text-blue-700'
                    }`}
                  >
                    <span aria-live="polite">{pulsePrAppendStatus || 'Send pulse to PR helper'}</span>
                  </button>
                </div>
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
          {visibleMessages.map(({ message: msg, matchSummary }, idx) => (
            <ChatBubbleMarkdown key={msg?.timestamp ? `${msg.timestamp}-${idx}` : idx} message={msg} matchSummary={matchSummary} />
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
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-700 dark:text-blue-300">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasFavoritePrompts) {
                        return;
                      }
                      toggleShowFavoritesOnly();
                    }}
                    disabled={!hasFavoritePrompts}
                    aria-pressed={showFavoritesOnly}
                    className={favoriteToggleClass}
                  >
                    {showFavoritesOnly ? 'Showing favorites' : 'Show favorites only'}
                  </button>
                  {favoriteFilterStatus && (
                    <span
                      className={`text-[0.65rem] ${
                        showFavoritesOnly
                          ? 'text-blue-700 dark:text-blue-200'
                          : 'text-blue-600/80 dark:text-blue-200/70'
                      }`}
                    >
                      {favoriteFilterStatus}
                    </span>
                  )}
                </div>
                {promptTagFilterLabel && (
                  <div className="flex flex-wrap items-center gap-2">
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
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
              {filteredPromptSuggestions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {showFavoritesOnly
                    ? hasFavoritePrompts
                      ? 'No favorites match your search or badge filter yet. Clear the favorites filter or adjust your search.'
                      : 'Star prompts to build your favorites list.'
                    : 'No prompts match your search or badge filter yet. Try a different keyword or clear the filter.'}
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
                  Keep the bold Summary and Testing headers for final handoff notes. Swap the emoji to ⚠️ or ❌ if a check is flaky or failing, expand the Impact, Security, Accessibility, User Experience, Performance, Analytics & Monitoring, Dependencies, Feature flags, Tickets & Tracking, Rollout, or Documentation sections with project specifics, and refresh the citation placeholders with the right files, logs, metrics, screenshots, videos, or docs. Glance at the live word count, summary preview, and testing preview above the buttons, then use the quick copy shortcuts plus the quick-add controls below to append more sections, evidence snippets, or testing rows as you go.
                  When you're finishing up, tap <span className="font-medium">Trim placeholder text</span> to remove default bullets before sharing.
                </p>
                <textarea
                  ref={prHelperTextareaRef}
                  value={prTemplateText}
                  onChange={(event) => setPrTemplateText(event.target.value)}
                  aria-describedby="pr-helper-tip"
                  rows={8}
                  className="mt-3 w-full rounded border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                <div className="mt-2 space-y-1 text-[0.7rem] text-gray-500 dark:text-gray-400" aria-live="polite">
                  <p>
                    Edits save locally so you can revisit the draft later. Use Reset template to restore the default outline.
                  </p>
                  <p>
                    Template length: {formatNumber(prTemplateStats.totalWords)}{' '}
                    {prTemplateStats.totalWords === 1 ? 'word' : 'words'} ({formatNumber(prTemplateStats.totalCharacters)}{' '}
                    {prTemplateStats.totalCharacters === 1 ? 'char' : 'chars'})
                  </p>
                  <p>
                    {prTemplateStats.hasSummarySection ? (
                      prTemplateStats.hasSummaryContent ? (
                        <>
                          Summary size: {formatNumber(prTemplateStats.summaryWords)}{' '}
                          {prTemplateStats.summaryWords === 1 ? 'word' : 'words'} ({formatNumber(prTemplateStats.summaryCharacters)}{' '}
                          {prTemplateStats.summaryCharacters === 1 ? 'char' : 'chars'})
                          {prTemplateStats.summaryPreview && (
                            <span className="ml-1 italic text-gray-600 dark:text-gray-300">
                              Preview: {prTemplateStats.summaryPreview}
                            </span>
                          )}
                          {prTemplateStats.hasSummaryPlaceholders && (
                            <span className="ml-1 font-semibold text-amber-700 dark:text-amber-300">
                              {summaryPlaceholderAction || 'Resolve placeholder details'}
                            </span>
                          )}
                        </>
                      ) : (
                        'Add a quick overview beneath the Summary heading to enable the copy shortcut.'
                      )
                    ) : (
                      'Add a "Summary" heading so you can copy it in one click.'
                    )}
                  </p>
                  <p>
                    {prTemplateStats.hasReleaseNotesSection ? (
                      prTemplateStats.hasReleaseNotesContent ? (
                        <>
                          Release notes size: {formatNumber(prTemplateStats.releaseNotesWords)}{' '}
                          {prTemplateStats.releaseNotesWords === 1 ? 'word' : 'words'} ({
                            formatNumber(prTemplateStats.releaseNotesCharacters)
                          }{' '}
                          {prTemplateStats.releaseNotesCharacters === 1 ? 'char' : 'chars'})
                          {prTemplateStats.releaseNotesPreview && (
                            <span className="ml-1 italic text-gray-600 dark:text-gray-300">
                              Preview: {prTemplateStats.releaseNotesPreview}
                            </span>
                          )}
                          {prTemplateStats.hasReleaseNotesPlaceholders && (
                            <span className="ml-1 font-semibold text-amber-700 dark:text-amber-300">
                              {releasePlaceholderAction || 'Resolve placeholder details'}
                            </span>
                          )}
                        </>
                      ) : (
                        'Outline the customer-facing highlights beneath the Changelog & Release notes heading to unlock the quick copy shortcut.'
                      )
                    ) : (
                      'Add a "Changelog & Release notes" heading so you can copy rollout messaging instantly.'
                    )}
                  </p>
                  <p>
                    {prTemplateStats.hasTestingSection ? (
                      prTemplateStats.hasTestingContent ? (
                        <>
                          Testing size: {formatNumber(prTemplateStats.testingWords)}{' '}
                          {prTemplateStats.testingWords === 1 ? 'word' : 'words'} ({
                            formatNumber(prTemplateStats.testingCharacters)
                          }{' '}
                          {prTemplateStats.testingCharacters === 1 ? 'char' : 'chars'})
                          {prTemplateStats.testingPreview && (
                            <span className="ml-1 italic text-gray-600 dark:text-gray-300">
                              Preview: {prTemplateStats.testingPreview}
                            </span>
                          )}
                          {prTemplateStats.hasTestingPlaceholders && (
                            <span className="ml-1 font-semibold text-amber-700 dark:text-amber-300">
                              {testingPlaceholderAction || 'Resolve placeholder details'}
                            </span>
                          )}
                        </>
                      ) : (
                        'Document verification notes beneath the Testing heading to unlock the quick copy shortcut.'
                      )
                    ) : (
                      'Add a "Testing" heading so you can copy the verification checklist instantly.'
                    )}
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-[0.7rem] text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleTrimPrTemplate}
                    className="self-start rounded border border-blue-500 bg-white px-2 py-1 text-xs font-semibold text-blue-700 transition hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-200 dark:hover:border-blue-300"
                  >
                    Trim placeholder text
                  </button>
                  <span aria-live="polite">
                    {prTemplateTrimStatus ||
                      'Strip unused placeholder bullets, citations, and ticket stubs before copying your draft.'}
                  </span>
                </div>
              </div>
              {prTemplateStats.hasPlaceholders && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-400/60 dark:bg-amber-500/10 dark:text-amber-200">
                  <p className="font-semibold">
                    {templatePlaceholderAction || 'Resolve placeholder references before sharing.'}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {prTemplateStats.placeholderWarnings.map(({ id, count, rule }) => (
                      <li key={id}>
                        <span className="font-medium">{formatNumber(count)}</span>{' '}
                        {count === 1 ? rule.summaryLabel : rule.summaryLabelPlural}
                        {rule.example && (
                          <span className="italic text-amber-800/80 dark:text-amber-200/80"> ({rule.example})</span>
                        )}
                        {rule.guidance && (
                          <>
                            {' — '}
                            {rule.guidance}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                  Need to cite evidence? Drop in reusable bullets for files, logs, metrics, screenshots, videos, or supporting docs.
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
              <PrTemplateActions
                onCopyTemplate={handleCopyPrTemplate}
                onCopySummary={handleCopySummarySection}
                onCopyReleaseNotes={handleCopyReleaseNotesSection}
                onCopyTesting={handleCopyTestingSection}
                onInsertTemplate={handleInsertPrTemplate}
                onInsertSummary={handleInsertSummarySection}
                onInsertReleaseNotes={handleInsertReleaseNotesSection}
                onInsertTesting={handleInsertTestingSection}
                copyStatus={prCopyStatus}
                summaryCopyStatus={summaryCopyDisplay}
                releaseCopyStatus={releaseCopyDisplay}
                testingCopyStatus={testingCopyDisplay}
                summaryInsertStatus={summaryInsertDisplay}
                releaseInsertStatus={releaseInsertDisplay}
                testingInsertStatus={testingInsertDisplay}
                onReset={handleResetPrTemplate}
                summaryDisabled={!summaryReady}
                releaseDisabled={!releaseNotesReady}
                testingDisabled={!testingReady}
                templatePlaceholderAction={templatePlaceholderAction}
                summaryPlaceholderAction={summaryPlaceholderAction}
                releasePlaceholderAction={releasePlaceholderAction}
                testingPlaceholderAction={testingPlaceholderAction}
              />
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
                  {hasPace && (
                    <div>
                      <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Pace
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {messagesPerMinuteDisplay}
                        {wordsPerMinuteDisplay ? ` · ${wordsPerMinuteDisplay}` : ''}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Longest update
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {longestUpdateDetails.length > 0 ? (
                        <ul className="space-y-1">
                          {longestUpdateDetails.map(({ id, label, value }) => (
                            <li key={id}>
                              <span className="font-medium">{label}</span> — {value}
                            </li>
                          ))}
                          {longestMessageDisplay && (
                            <li className="text-xs text-gray-500 dark:text-gray-400">
                              Longest overall: {longestMessageDisplay}
                            </li>
                          )}
                        </ul>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          {hasMessages ? 'Waiting for the next update.' : 'Waiting for the first message.'}
                        </span>
                      )}
                    </dd>
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
                  <button
                    type="button"
                    onClick={handleSendInsightsToPrHelper}
                    disabled={!hasMessages}
                    className={`border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasMessages
                        ? 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:text-blue-600 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-200'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600'
                    }`}
                  >
                    <span aria-live="polite">{insightsPrAppendStatus || 'Send to PR helper'}</span>
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
