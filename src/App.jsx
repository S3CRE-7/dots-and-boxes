import { Routes, Route, useLocation } from 'react-router-dom';

import { Home, GamePvP, GamePvB } from './components';

const App = () => {
  const location = useLocation();
  return (
    <main className="flex justify-center items-center h-screen">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/pvp/:boardSize" element={<GamePvP />} />
        <Route path="/bot/:boardSize" element={<GamePvB />} />
      </Routes>
    </main>
  );
};

export default App;
