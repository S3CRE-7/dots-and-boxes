import { useEffect, useState } from 'react';
import { BoxGridGenerator } from '../lib/boxGridGenerator';
import DynamicGameBoard from './DynamicGameBoard';
import botPlayer from '../lib/botStrategy';
import { useParams } from 'react-router-dom';

export default function GameAI() {
  const { boardSize } = useParams();
  const width = +boardSize.split('x')[0];
  const height = +boardSize.split('x')[1];
  const [clickedLines, setClickedLines] = useState({});
  const [boxScores, setBoxScores] = useState(Array(width * height).fill(0));
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [turnA, setTurnA] = useState(true);
  const [end, setEnd] = useState(false);

  const boxes = new BoxGridGenerator(width, height).boxes;

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

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

  const handleLineEnter = (lineId) => {
    setHoveredLine(lineId);
  };

  const handleLineLeave = () => {
    setHoveredLine(null);
  };

  useEffect(() => {
    for (let i = 0; i < boxScores.length; i++) {
      if (boxScores[i] === 4) {
        if (turnA) {
          // Player A (blue) scored
          updatePlayerScore(0);
          updateBoxScore(i, false, -1); // Mark box as owned by A
        } else {
          // Player B (red) scored
          updatePlayerScore(1);
          updateBoxScore(i, false, -2); // Mark box as owned by B
        }
      }
    }

    if (playerScores[0] + playerScores[1] === width * height) {
      setEnd(true);
    }
  }, [boxScores]);

  // Handling the AI's turn
  useEffect(() => {
    // Check if it's the Bot's turn (Player B) and the game is not over.
    if (!turnA && !end) {
      // Delay for a more natural, human-like feel.
      const botTurnTimeout = setTimeout(() => {
        // Get the bot's chosen move.
        const chosenMove = botPlayer(
          width,
          height,
          clickedLines,
          boxScores,
          boxes
        );

        // Make sure the bot found a valid move.
        if (chosenMove) {
          // Simulate a click event for the chosen move.
          const fakeEvent = { target: { id: chosenMove } };
          handleClick(fakeEvent);
        }
      }, 250);

      return () => clearTimeout(botTurnTimeout);
    }
  }, [turnA, end, clickedLines, width, height]);

  const handleClick = (e) => {
    const lineId = e.target.id;

    if (clickedLines[lineId]) {
      return;
    }

    let boxCompletedThisTurn = false;
    const affectedBoxIndices = [];

    const coords = lineId.split('-').map((str) => +str);
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].length; j++) {
        if (arraysEqual(boxes[i][j], coords)) {
          affectedBoxIndices.push(i);
          // Check if this move will complete the box
          if (boxScores[i] === 3) {
            boxCompletedThisTurn = true;
          }
        }
      }
    }

    // Update the line's visual state
    setClickedLines((prev) => ({
      ...prev,
      [lineId]: turnA ? 'A' : 'B',
    }));

    // Update the scores for all affected boxes
    affectedBoxIndices.forEach((index) => {
      updateBoxScore(index, true);
    });

    // Only switch turns if the player did NOT complete a box.
    if (!boxCompletedThisTurn) {
      setTurnA((prev) => !prev);
    }
  };

  return (
    <div>
      {end ? (
        playerScores[0] > playerScores[1] ? (
          <p className="flex justify-center font-bold text-lg mb-5">You Won!</p>
        ) : (
          <p className="flex justify-center font-bold text-lg mb-5">
            Bot<span className="text-red-600">&nbsp;B&nbsp;</span>Won!
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

      <div
        className={
          !turnA
            ? 'pointer-events-none opacity-75 transition-opacity'
            : 'transition-opacity'
        }>
        <DynamicGameBoard
          width={width}
          height={height}
          boxScores={boxScores}
          turnA={turnA}
          handleClick={handleClick}
          clickedLines={clickedLines}
          hoveredLine={hoveredLine}
          handleLineEnter={handleLineEnter}
          handleLineLeave={handleLineLeave}
        />
      </div>

      {/* The score display remains the same */}
      <div className="flex font-bold justify-center mt-7 space-x-4 text-base">
        <span className="text-blue-600">You: {playerScores[0]}</span>
        <span className="text-red-600">Bot: {playerScores[1]}</span>
      </div>
    </div>
  );
}
