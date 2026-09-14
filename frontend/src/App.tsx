import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import StudyTool from './pages/StudyTool';

function App() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <StudyTool onBack={() => setStarted(false)} />;
  }

  return <LandingPage onStart={() => setStarted(true)} />;
}

export default App;
