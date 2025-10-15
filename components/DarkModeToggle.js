import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  // load saved setting or system preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved === 'true' || saved === 'false') {
        setEnabled(saved === 'true');
        if (saved === 'true') {
          document.documentElement.classList.add('dark');
        }
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setEnabled(true);
        document.documentElement.classList.add('dark');
      }
    } catch (err) {
      // ignore errors
    }
  }, []);

  // toggle class on document
  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('darkMode', enabled ? 'true' : 'false');
    } catch (err) {
      // ignore errors
    }
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      aria-label="Toggle dark mode"
    >
      {enabled ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
