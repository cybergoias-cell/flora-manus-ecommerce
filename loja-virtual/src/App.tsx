import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import { getVisualConfig } from './lib/api/visualConfigService';
import { VisualConfig, fallbackVisualConfig } from './types/visualConfig';

function App() {
  const [visualConfig, setVisualConfig] = useState<VisualConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await getVisualConfig();
      setVisualConfig(config);
      setIsLoading(false);
    };

    fetchConfig();
  }, []);

  // Use fallback config while loading or if fetch fails and returns null (though service handles fallback)
  const configToUse = visualConfig || fallbackVisualConfig;

  if (isLoading) {
    return <div className="text-center p-8">Carregando configurações visuais...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header logoConfig={configToUse.logo} />
      <main className="container mx-auto p-4">
        <Home visualConfig={configToUse} />
      </main>
    </div>
  );
}

export default App;
