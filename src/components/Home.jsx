import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

function Home() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      {isMobile ? (
        <div className="mx-8 text-7xl">
          <h1 className="font-bold">Dots</h1>
          <h1 className="font-bold text-right">& Boxes</h1>
        </div>
      ) : (
        <h1 className="flex justify-center text-9xl font-bold">Dots & Boxes</h1>
      )}
      <div className="w-full md:flex md:justify-center">
        <div className="md:grid md:align-items-center md:justify-items-center md:w-5/12">
          <div className="md:flex md:justify-between md:items-center md:w-full mt-8 font-semibold">
            <p className="mx-8 md:mx-0 text-2xl">Player vs Player: </p>
            <div className="flex justify-center mt-3 md:mt-0 text-xl space-x-8 ">
              <button
                className="px-4 border-2 border-black rounded-lg"
                onClick={() => navigate('/pvp/4x4')}>
                4x4
              </button>
              <button
                className="px-4 border-2 border-black rounded-lg"
                onClick={() => navigate('/pvp/6x6')}>
                6x6
              </button>
            </div>
          </div>
          <div className="md:flex md:justify-between md:items-center md:w-full mt-8 font-semibold">
            <p className="mx-8 md:mx-0 text-2xl">Player vs Bot: </p>
            <div className="flex justify-center mt-3 md:mt-0 text-xl space-x-8 ">
              <button
                className="px-4 border-2 border-black rounded-lg"
                onClick={() => navigate('/bot/4x4')}>
                4x4
              </button>
              <button
                className="px-4 border-2 border-black rounded-lg"
                onClick={() => navigate('/bot/6x6')}>
                6x6
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
