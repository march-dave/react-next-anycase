import { useState } from 'react';
import LandingPage from './LandingPage';
import DemoApp from './DemoApp';

type View = 'landing' | 'studio';

export default function App() {
  const [view, setView] = useState<View>('landing');

  return (
    <div className="view-fade">
      {view === 'landing' ? <LandingPage onLaunch={() => setView('studio')} /> : <DemoApp onBack={() => setView('landing')} />}
    </div>
  );
}
