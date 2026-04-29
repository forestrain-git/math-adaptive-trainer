import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { initializeDatabase } from './db';
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import ResultPage from './pages/ResultPage';
import ReportPage from './pages/ReportPage';

function App() {
  useEffect(() => {
    initializeDatabase().catch((err) => {
      console.error('Database initialization failed:', err);
      alert('存储功能初始化失败，请检查浏览器设置或使用现代浏览器。');
    });
  }, []);

  return (
    <HashRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/result/:sessionId" element={<ResultPage />} />
          <Route path="/report/:sessionId" element={<ReportPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
