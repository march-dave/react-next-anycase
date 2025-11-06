export default function PrTemplateActions({
  onCopyTemplate,
  onCopySummary,
  onCopyReleaseNotes,
  onCopyTesting,
  onInsertTemplate,
  onInsertSummary,
  onInsertReleaseNotes,
  onInsertTesting,
  copyStatus,
  summaryCopyStatus,
  releaseCopyStatus,
  testingCopyStatus,
  summaryInsertStatus,
  releaseInsertStatus,
  testingInsertStatus,
  onReset,
  summaryDisabled = false,
  releaseDisabled = false,
  testingDisabled = false,
  templatePlaceholderAction = '',
  summaryPlaceholderAction = '',
  releasePlaceholderAction = '',
  testingPlaceholderAction = '',
}) {
  const placeholderNotices = [
    templatePlaceholderAction
      ? { key: 'template', label: 'Template', message: templatePlaceholderAction }
      : null,
    summaryPlaceholderAction
      ? { key: 'summary', label: 'Summary', message: summaryPlaceholderAction }
      : null,
    releasePlaceholderAction
      ? { key: 'release', label: 'Release notes', message: releasePlaceholderAction }
      : null,
    testingPlaceholderAction
      ? { key: 'testing', label: 'Testing', message: testingPlaceholderAction }
      : null,
  ].filter(Boolean);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={onCopyTemplate}
            className="border border-blue-500 bg-blue-500 px-3 py-2 font-medium text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span aria-live="polite">{copyStatus || 'Copy template'}</span>
          </button>
          <button
            type="button"
            onClick={onCopySummary}
            disabled={summaryDisabled}
            className={`rounded border px-3 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              summaryDisabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600'
                : 'border-blue-400 text-blue-700 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-gray-900'
            }`}
          >
            <span aria-live="polite">{summaryCopyStatus || 'Copy summary section'}</span>
          </button>
          <button
            type="button"
            onClick={onCopyReleaseNotes}
            disabled={releaseDisabled}
            className={`rounded border px-3 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              releaseDisabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600'
                : 'border-blue-400 text-blue-700 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-gray-900'
            }`}
          >
            <span aria-live="polite">{releaseCopyStatus || 'Copy release notes section'}</span>
          </button>
          <button
            type="button"
            onClick={onCopyTesting}
            disabled={testingDisabled}
            className={`rounded border px-3 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              testingDisabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600'
                : 'border-blue-400 text-blue-700 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-gray-900'
            }`}
          >
            <span aria-live="polite">{testingCopyStatus || 'Copy testing section'}</span>
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={onInsertSummary}
            disabled={summaryDisabled}
            className={`rounded border px-3 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              summaryDisabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600'
                : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:bg-gray-900'
            }`}
          >
            <span aria-live="polite">{summaryInsertStatus || 'Insert summary into chat'}</span>
          </button>
          <button
            type="button"
            onClick={onInsertReleaseNotes}
            disabled={releaseDisabled}
            className={`rounded border px-3 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              releaseDisabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600'
                : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:bg-gray-900'
            }`}
          >
            <span aria-live="polite">{releaseInsertStatus || 'Insert release notes into chat'}</span>
          </button>
          <button
            type="button"
            onClick={onInsertTesting}
            disabled={testingDisabled}
            className={`rounded border px-3 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              testingDisabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600'
                : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:bg-gray-900'
            }`}
          >
            <span aria-live="polite">{testingInsertStatus || 'Insert testing into chat'}</span>
          </button>
          <button
            type="button"
            onClick={onInsertTemplate}
            className="border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            Insert full template
          </button>
        </div>
      </div>
      {placeholderNotices.length > 0 && (
        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[0.7rem] text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide">Placeholder reminders</p>
          <ul className="mt-1 space-y-1">
            {placeholderNotices.map((item) => (
              <li key={item.key} className="leading-snug">
                <span className="font-medium">{item.label}:</span> {item.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={onReset}
        className="self-start text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Reset template
      </button>
    </>
  );
}
