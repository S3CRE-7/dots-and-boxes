import { Routes, Route, useLocation } from 'react-router-dom';

import { Home, GamePvP, FourByFourAI, SixBySixAI } from './components';

const App = () => {
  const location = useLocation();
  return (
    <main className="flex justify-center items-center h-screen">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/pvp/:boardSize" element={<GamePvP />} />
        <Route path="/4x4-ai" element={<FourByFourAI />} />
        <Route path="/6x6-ai" element={<SixBySixAI />} />
      </Routes>
    </main>
  );
};

export default App;
