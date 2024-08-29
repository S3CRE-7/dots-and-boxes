import { Routes, Route, useLocation } from 'react-router-dom';

import {
  Home,
  FourByFour,
  FourByFourAI,
  SixBySix,
  SixBySixAI,
} from './components';

const App = () => {
  const location = useLocation();
  return (
    <main className="flex justify-center items-center h-screen">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/4x4" element={<FourByFour />} />
        <Route path="/6x6" element={<SixBySix />} />
        <Route path="/4x4-ai" element={<FourByFourAI />} />
        <Route path="/6x6-ai" element={<SixBySixAI />} />
      </Routes>
    </main>
  );
};

export default App;
