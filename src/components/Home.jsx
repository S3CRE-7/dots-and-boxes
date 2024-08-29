import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <main>
      <h1 className="text-8xl font-bold">Dots & Boxes</h1>
      <div className="flex justify-center space-x-24 text-2xl mt-16 font-semibold">
        <p>Two Players: </p>
        <div className="space-x-5">
          <button className="px-4" onClick={() => navigate('/4x4')}>
            4x4
          </button>
          <button className="px-4" onClick={() => navigate('/6x6')}>
            6x6
          </button>
        </div>
      </div>
      {/* <div className="flex justify-center space-x-24 text-2xl mt-8 font-semibold">
        <p>Player vs PC: </p>
        <div className="space-x-5">
          <button className="px-4" onClick={() => navigate('/4x4-ai')}>
            4x4
          </button>
          <button className="px-4" onClick={() => navigate('/6x6-ai')}>
            6x6
          </button>
        </div>
      </div> */}
    </main>
  );
}

export default Home;
