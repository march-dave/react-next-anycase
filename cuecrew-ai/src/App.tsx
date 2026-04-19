import { useState } from 'react';
import DemoApp from './DemoApp';
import LandingPage from './LandingPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');

  return view === 'landing' ? <LandingPage onLaunch={() => setView('studio')} /> : <DemoApp onBack={() => setView('landing')} />;
}
