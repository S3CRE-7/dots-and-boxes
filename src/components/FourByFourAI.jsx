import { useEffect, useState } from 'react';

function FourByFour() {
  const [boxScores, setBoxScores] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [turnA, setTurnA] = useState(true);
  const [end, setEnd] = useState(false);
  const boxes = [
    [
      [1, 1, 1],
      [0, 1, 1],
      [1, 1, 2],
      [0, 2, 1],
    ],
    [
      [1, 1, 2],
      [0, 1, 2],
      [1, 1, 3],
      [0, 2, 2],
    ],
    [
      [1, 1, 3],
      [0, 1, 3],
      [1, 1, 4],
      [0, 2, 3],
    ],
    [
      [1, 2, 1],
      [0, 2, 1],
      [1, 2, 2],
      [0, 3, 1],
    ],
    [
      [1, 2, 2],
      [0, 2, 2],
      [1, 2, 3],
      [0, 3, 2],
    ],
    [
      [1, 2, 3],
      [0, 2, 3],
      [1, 2, 4],
      [0, 3, 3],
    ],
    [
      [1, 3, 1],
      [0, 3, 1],
      [1, 3, 2],
      [0, 4, 1],
    ],
    [
      [1, 3, 2],
      [0, 3, 2],
      [1, 3, 3],
      [0, 4, 2],
    ],
    [
      [1, 3, 3],
      [0, 3, 3],
      [1, 3, 4],
      [0, 4, 3],
    ],
  ];
  const uniqueBoxes = Array.from(
    new Set(boxes.flat(1).map(JSON.stringify)),
    JSON.parse
  );
  const [pcOptions, setPcOptions] = useState(uniqueBoxes);

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  function getRandomItem(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  const updatePlayerScore = (index) => {
    setPlayerScores((prevScores) => {
      const newScores = [...prevScores];
      newScores[index] += 1;
      return newScores;
    });
  };

  const updateBoxScore = (index, add, number = 0) => {
    setBoxScores((prevScores) => {
      if (add) {
        const newScores = [...prevScores];
        newScores[index] += 1;
        return newScores;
      } else {
        const newScores = [...prevScores];
        newScores[index] = number;
        return newScores;
      }
    });
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const computerPlay = async () => {
    setTurnA((prev) => !prev);
    await timeout(1000);
    if (!turnA) return;
    const randomArray = getRandomItem(pcOptions);
    const id = randomArray.join('-');
    const el = document.getElementById(id);
    el.dispatchEvent(
      new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    );
  };

  useEffect(() => {
    for (let i = 0; i < boxScores.length; i++) {
      if (boxScores[i] === 4) {
        if (turnA) {
          updateBoxScore(i, false, -2);
          updatePlayerScore(1);
        } else {
          updateBoxScore(i, false, -1);
          updatePlayerScore(0);
        }
      }
    }
    boxScores.forEach((score, index) => {
      const boxElement = document.getElementById(`box${index + 1}`);

      if (boxElement) {
        if (score === -2) {
          boxElement.classList.add('bg-red-400');
        } else if (score === -1) {
          boxElement.classList.add('bg-blue-400');
        }
      }
    });
    if (playerScores[0] + playerScores[1] === 9) {
      setEnd((prev) => !prev);
    }
  }, [boxScores]);

  const handleClick = async (e) => {
    if (e.target.classList.contains('clicked')) {
      return;
    }
    let id = e.target.id;
    let coords = id.split('-').map((str) => +str);
    const updatedPcOptions = pcOptions.filter(
      (box) => !arraysEqual(box, coords)
    );
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].length; j++) {
        if (arraysEqual(boxes[i][j], coords)) {
          updateBoxScore(i, true);
        }
      }
    }
    setPcOptions(updatedPcOptions);
    console.log(pcOptions);

    if (turnA) {
      e.target.classList.add('bg-blue-600', 'clicked');
    } else {
      e.target.classList.add('bg-red-600', 'clicked');
    }
    computerPlay();
  };

  const handleMouseEnter = (e) => {
    if (e.target.classList.contains('clicked')) {
      return;
    }
    if (turnA) {
      e.target.classList.remove('hover:bg-red-400');
      e.target.classList.add('hover:bg-blue-400', 'transition-all');
    } else {
      e.target.classList.remove('hover:bg-blue-400');
      e.target.classList.add('hover:bg-red-400', 'transition-all');
    }
  };

  return (
    <>
      <div>
        {end ? (
          playerScores[0] > playerScores[1] ? (
            <p className="flex justify-center font-bold text-lg mb-5">
              Player<span className="text-blue-600">&nbsp;A&nbsp;</span>Won!
            </p>
          ) : (
            <p className="flex justify-center font-bold text-lg mb-5">
              Player<span className="text-red-600">&nbsp;B&nbsp;</span>Won!
            </p>
          )
        ) : (
          <p className="flex justify-center font-bold text-lg mb-5">
            Player
            {turnA ? (
              <span className="text-blue-600">&nbsp;A&nbsp;</span>
            ) : (
              <span className="text-red-600">&nbsp;B&nbsp;</span>
            )}
            turn
          </p>
        )}

        <div className="flex justify-center">
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-1-1"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-1-2"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-1-3"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
        </div>
        <div className="flex">
          <div
            id="1-1-1"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box1"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-1-2"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box2"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-1-3"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box3"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-1-4"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
        </div>
        <div className="flex justify-center">
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-2-1"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-2-2"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-2-3"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
        </div>
        <div className="flex">
          <div
            id="1-2-1"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box4"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-2-2"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box5"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-2-3"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box6"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-2-4"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
        </div>
        <div className="flex justify-center">
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-3-1"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-3-2"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-3-3"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
        </div>
        <div className="flex">
          <div
            id="1-3-1"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box7"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-3-2"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box8"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-3-3"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div
            id="box9"
            className="flex justify-center items-center w-14 h-14"></div>
          <div
            id="1-3-4"
            className="w-3 h-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
        </div>
        <div className="flex justify-center">
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-4-1"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-4-2"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
          <div
            id="0-4-3"
            className="h-3 w-14"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}></div>
          <div className="bg-black w-3 h-3"></div>
        </div>
        <div className="flex font-bold justify-center mt-7 space-x-4 text-base">
          <span className="text-blue-600">A: {playerScores[0]}</span>
          <span className="text-red-600">B: {playerScores[1]}</span>
        </div>
      </div>
    </>
  );
}

export default FourByFour;
