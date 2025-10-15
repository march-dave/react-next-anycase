export default function PrTemplateActions({
  onCopyTemplate,
  onCopySummary,
  onCopyTesting,
  onInsertTemplate,
  onInsertSummary,
  onInsertTesting,
  copyStatus,
  summaryCopyStatus,
  testingCopyStatus,
  summaryInsertStatus,
  testingInsertStatus,
  onReset,
}) {
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
            className="rounded border border-blue-400 px-3 py-2 font-medium text-blue-700 transition hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-gray-900"
          >
            <span aria-live="polite">{summaryCopyStatus || 'Copy summary section'}</span>
          </button>
          <button
            type="button"
            onClick={onCopyTesting}
            className="rounded border border-blue-400 px-3 py-2 font-medium text-blue-700 transition hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-gray-900"
          >
            <span aria-live="polite">{testingCopyStatus || 'Copy testing section'}</span>
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={onInsertSummary}
            className="rounded border border-gray-300 px-3 py-2 font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:bg-gray-900"
          >
            <span aria-live="polite">{summaryInsertStatus || 'Insert summary into chat'}</span>
          </button>
          <button
            type="button"
            onClick={onInsertTesting}
            className="rounded border border-gray-300 px-3 py-2 font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:bg-gray-900"
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
