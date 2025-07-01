function getAllHorizontalLines(width, height) {
  const horizontalLines = [];
  for (let y = 1; y <= height + 1; y++) {
    for (let z = 1; z <= width; z++) {
      horizontalLines.push(`0-${y}-${z}`);
    }
  }
  return horizontalLines;
}

function getAllVerticalLines(width, height) {
  const verticalLines = [];
  for (let y = 1; y <= height; y++) {
    for (let z = 1; z <= width + 1; z++) {
      verticalLines.push(`1-${y}-${z}`);
    }
  }
  return verticalLines;
}

function getAvailableMoves(width, height, clickedLines) {
  const allHorizontal = getAllHorizontalLines(width, height);
  const allVertical = getAllVerticalLines(width, height);
  const allPossibleMoves = [...allHorizontal, ...allVertical];
  return allPossibleMoves.filter((lineId) => !clickedLines[lineId]);
}

function getAdjacentBoxes(lineId, boxes) {
  const adjacent = [];
  const lineCoords = lineId.split('-').map(Number);

  // This efficient lookup can replace the double loop in your original handleClick
  for (let i = 0; i < boxes.length; i++) {
    for (const boxLine of boxes[i]) {
      if (
        boxLine[0] === lineCoords[0] &&
        boxLine[1] === lineCoords[1] &&
        boxLine[2] === lineCoords[2]
      ) {
        adjacent.push(i);
      }
    }
  }
  return adjacent;
}

/**
 * @param {number} width - The width of the board.
 * @param {number} height - The height of the board.
 * @param {object} clickedLines - The state object of all clicked lines.
 * @param {Array<number>} boxScores - The current scores of all boxes.
 * @param {Array} boxes - The main boxes data structure.
 * @returns {string|null} The lineId of the chosen move.
 */
export default function botPlayer(
  width,
  height,
  clickedLines,
  boxScores,
  boxes
) {
  const availableMoves = getAvailableMoves(width, height, clickedLines);

  if (availableMoves.length === 0) {
    return null;
  }

  const winningMoves = [];
  const safeMoves = [];
  const unsafeMoves = [];

  // Analyze every available move and categorize it.
  for (const move of availableMoves) {
    const adjacentBoxes = getAdjacentBoxes(move, boxes);

    let isWinningMove = false;
    let isUnsafeMove = false;

    for (const boxIndex of adjacentBoxes) {
      if (boxScores[boxIndex] === 3) {
        // This move completes a box. It's a winning move!
        isWinningMove = true;
        break; // No need to check other adjacent boxes for this move
      }
      if (boxScores[boxIndex] === 2) {
        // This move sets up the opponent. It's unsafe.
        isUnsafeMove = true;
      }
    }

    if (isWinningMove) {
      winningMoves.push(move);
    } else if (isUnsafeMove) {
      unsafeMoves.push(move);
    } else {
      safeMoves.push(move);
    }
  }

  // Make a decision based on the priority list.
  // Priority 1: Take a winning move if available.
  if (winningMoves.length > 0) {
    return winningMoves[0]; // Take the first winning move it finds.
  }

  // Priority 2: Make a safe move if available.
  if (safeMoves.length > 0) {
    // Pick a random safe move.
    const randomIndex = Math.floor(Math.random() * safeMoves.length);
    return safeMoves[randomIndex];
  }
  // Priority 3: No other choice, make a sacrificial (unsafe) move.
  if (unsafeMoves.length > 0) {
    // TODO: Intelligent move instead of random.
    const randomIndex = Math.floor(Math.random() * unsafeMoves.length);
    return unsafeMoves[randomIndex];
  }

  return null; // Should not be reached if availableMoves > 0
}
