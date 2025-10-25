import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import VisualSettings from './pages/VisualSettings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="p-4">Selecione uma opção no menu.</div>} />
          <Route path="settings/visual" element={<VisualSettings />} />
          {/* Add other routes here */}
          <Route path="*" element={<div className="p-4">Página não encontrada.</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

