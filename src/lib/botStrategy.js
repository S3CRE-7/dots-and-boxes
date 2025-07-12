// ducumentation is dog shit
//! Note: This shit is impossible to beat, good luck 👍

/**
 * Calculates the "chain length" if this line is played.
 * Used to determine how many boxes we might give away in a sequence.
 * A lower chain length is better when we're forced to make an "unsafe" move.
 * @param {string} lineId - The ID of the line being considered (e.g., '0-1-1').
 * @param {Array} boxes - The board's box definitions.
 * @param {object} clickedLines - Current state of all drawn lines.
 * @returns {number} The number of boxes in the potential chain.
 */
function getChainLength(lineId, boxes, clickedLines) {
  //# DEBUG: Uncomment the console.log below to see detailed chain calculations for each unsafe move.
  //# console.log(`--- Calculating Chain Length for potential move: ${lineId} ---`);

  const lineCoords = lineId.split("-").map(Number);
  const adjacentBoxes = getAdjacentBoxes(lineId, boxes);

  let potentialChainBoxes = new Set();
  let visitedBoxes = new Set();
  let boxesToProcess = []; // Acts like a queue for Breadth-First Search (BFS)

  // First, find any boxes that become 3-sided "winner"
  // if 'lineId' is played. These are our starting points for chain detection.
  for (const boxIndex of adjacentBoxes) {
    let currentScore = 0;
    for (const boxLine of boxes[boxIndex]) {
      const lineKey = `${boxLine[0]}-${boxLine[1]}-${boxLine[2]}`;
      // Simulate adding the current lineId to see if the box becomes 3-sided
      if (
        clickedLines[lineKey] ||
        (boxLine[0] === lineCoords[0] &&
          boxLine[1] === lineCoords[1] &&
          boxLine[2] === lineCoords[2])
      ) {
        currentScore++;
      }
    }
    if (currentScore === 3) {
      potentialChainBoxes.add(boxIndex);
      boxesToProcess.push(boxIndex);
      //# DEBUG: console.log(`  Box ${boxIndex} becomes 3-sided with ${lineId}. Adding to start processing.`); // DEBUG
    }
  }

  // If playing this line doesn't make any box 3-sided, it's not starting a "takeable"

  if (potentialChainBoxes.size === 0) {
    //# DEBUG: console.log(`  Move ${lineId} does not immediately make any box 3-sided. Chain Length: 0.`); // DEBUG
    return 0; // Not an immediately "giving" move.
  }

  let chainCount = 0;

  // Now, traverse from these 3-sided boxes to find other boxes that would
  // become 2-sided if the chain continues.
  while (boxesToProcess.length > 0) {
    const currentBoxIndex = boxesToProcess.shift(); // Get the next box in the queue

    if (visitedBoxes.has(currentBoxIndex)) {
      continue; // Already processed this box
    }
    visitedBoxes.add(currentBoxIndex);
    chainCount++; // This box is part of the chain we're counting

    // Check each line of the current box
    for (const lineOfCurrentBox of boxes[currentBoxIndex]) {
      const lineKeyOfCurrentBox = `${lineOfCurrentBox[0]}-${lineOfCurrentBox[1]}-${lineOfCurrentBox[2]}`;

      //Check for unclicked lines
      if (
        !clickedLines[lineKeyOfCurrentBox] &&
        !(
          lineOfCurrentBox[0] === lineCoords[0] &&
          lineOfCurrentBox[1] === lineCoords[1] &&
          lineOfCurrentBox[2] === lineCoords[2]
        )
      ) {
        // Find other boxes connected by this open line
        const neighborsOfLine = getAdjacentBoxes(lineKeyOfCurrentBox, boxes);

        for (const neighborBoxIndex of neighborsOfLine) {
          // Check that we're not checking the box we just came from, or one we've already visited
          if (
            neighborBoxIndex !== currentBoxIndex &&
            !visitedBoxes.has(neighborBoxIndex)
          ) {
            // Simulate the state of the neighbor box if this connecting line were also filled.
            let neighborBoxSimulatedScore = 0;
            for (const nLine of boxes[neighborBoxIndex]) {
              const nLineKey = `${nLine[0]}-${nLine[1]}-${nLine[2]}`;
              if (
                clickedLines[nLineKey] ||
                (nLine[0] === lineCoords[0] &&
                  nLine[1] === lineCoords[1] &&
                  nLine[2] === lineCoords[2]) || // The initial line we're testing
                (nLine[0] === lineOfCurrentBox[0] &&
                  nLine[1] === lineOfCurrentBox[1] &&
                  nLine[2] === lineOfCurrentBox[2]) // The connecting line
              ) {
                neighborBoxSimulatedScore++;
              }
            }

            // If the neighbor box would become 2-sided, it's part of the chain that can be taken.
            if (neighborBoxSimulatedScore === 2) {
              if (!boxesToProcess.includes(neighborBoxIndex)) {
                boxesToProcess.push(neighborBoxIndex); // Add to the queue for further exploration
                //# DEBUG: console.log(`    Adding neighbor Box ${neighborBoxIndex} (simulated 2-sided) to process.`); // DEBUG
              }
            }
          }
        }
      }
    }
  }
  //# DEBUG: console.log(`--- Final Chain Length for ${lineId}: ${chainCount} ---`); // DEBUG
  return chainCount;
}

/**
 * Helper to generate all possible horizontal line IDs.
 * Format: '0-y-z' where 0=horizontal, y=row, z=column.
 */
function getAllHorizontalLines(width, height) {
  const horizontalLines = [];
  for (let y = 1; y <= height + 1; y++) {
    // Rows for horizontal lines
    for (let z = 1; z <= width; z++) {
      // Columns for horizontal lines
      horizontalLines.push(`0-${y}-${z}`);
    }
  }
  return horizontalLines;
}

/**
 * Helper to generate all possible vertical line IDs.
 * Format: '1-y-z' where 1=vertical, y=row, z=column.
 */
function getAllVerticalLines(width, height) {
  const verticalLines = [];
  for (let y = 1; y <= height; y++) {
    // Rows for vertical lines
    for (let z = 1; z <= width + 1; z++) {
      // Columns for vertical lines
      verticalLines.push(`1-${y}-${z}`);
    }
  }
  return verticalLines;
}

/**
 * Gathers all lines that haven't been drawn on the board yet.
 * @param {number} width - Board width.
 * @param {number} height - Board height.
 * @param {object} clickedLines - Map of lines that are already drawn.
 * @returns {Array<string>} List of available line IDs.
 */
function getAvailableMoves(width, height, clickedLines) {
  const allHorizontal = getAllHorizontalLines(width, height);
  const allVertical = getAllVerticalLines(width, height);
  const allPossibleMoves = [...allHorizontal, ...allVertical];
  return allPossibleMoves.filter((lineId) => !clickedLines[lineId]); // Filter out already clicked lines
}

// Finds which boxes on the board are connected to a specific line.
function getAdjacentBoxes(lineId, boxes) {
  const adjacent = [];
  const lineCoords = lineId.split("-").map(Number); // Convert '0-1-1' to [0, 1, 1]

  for (let i = 0; i < boxes.length; i++) {
    // Each 'box' in the 'boxes' array is itself an array of 4 lines.
    for (const boxLine of boxes[i]) {
      // Check if this line is one of the four lines that make up the current box.
      if (
        boxLine[0] === lineCoords[0] &&
        boxLine[1] === lineCoords[1] &&
        boxLine[2] === lineCoords[2]
      ) {
        adjacent.push(i); // If it matches, this box is adjacent
        break; // No need to check other lines for this box, move to the next box
      }
    }
  }
  return adjacent;
}

/**
 * Assigns a strategic score to a "safe" move.
 * Lower score means a more desirable move.
 * Factors considered:
 * 1. Proximity to the center
 * 2. Avoiding edges/corners
 * 3. Avoiding creating 2-sided boxes (potential "hot spots") for the opponent
 */
function evaluateSafeMove(lineId, width, height, boxes, boxScores) {
  let score = 0;
  const [type, y, z] = lineId.split("-").map(Number); // Parse line ID (type: 0=horizontal, 1=vertical)

  // 1.Center Preference (Higher priority, so higher base score impact)
  // We want to play closer to the middle of the board for better flexibility later.
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate the approximate midpoint of the line to check its distance from the center.
  let effectiveX = type === 0 ? z + 0.5 : z;
  let effectiveY = type === 0 ? y : y + 0.5;

  const distX = Math.abs(effectiveX - centerX);
  const distY = Math.abs(effectiveY - centerY);

  // Sum of distances from center, multiplied to make it impactful. you can just use normal value
  score += (distX + distY) * 10;

  // 2.Edge Avoidance (Significant penalty)
  // Lines on the outer perimeter can be strategically disadvantageous early on.
  // Horizontal lines: on the very top (y=1) or very bottom (y=height+1)
  if (type === 0 && (y === 1 || y === height + 1)) {
    score += 50; // Heavy penalty
  }
  // Vertical lines: on the very left (z=1) or very right (z=width+1)
  if (type === 1 && (z === 1 || z === width + 1)) {
    score += 50; // Heavy penalty
  }

  // Even bigger penalty for lines that are part of a true corner box.
  // These are lines at the intersection of top/bottom and left/right edges.
  if (
    (type === 0 && (y === 1 || y === height + 1) && (z === 1 || z === width)) || // Horizontal corner line
    (type === 1 && (z === 1 || z === width + 1) && (y === 1 || y === height)) // Vertical corner line
  ) {
    score += 20; // Additional penalty on top of the edge penalty
  }

  // 3.Hot Spot Avoidance
  // Avoid making a box 2-sided. While not immediately losing a box,
  // it sets up a Hot Spot that the opponent might be able to easily claim later.
  const adjacentBoxes = getAdjacentBoxes(lineId, boxes);
  for (const boxIndex of adjacentBoxes) {
    if (boxScores[boxIndex] === 1) {
      // If adding this line would make a box go from 1 to 2 lines
      score += 25; // Moderate penalty
    }
  }

  return score;
}

//?  Main Bot Player Logic

// It prioritizes moves based on winning, safety, and strategic value.

/**
 * Determines the best move for the AI player.
 * The strategy follows a clear priority:
 * 1. Win if possible (complete a box).
 * 2. Make the most strategically sound "safe" move (no immediate box for opponent).
 * 3. If forced, make the "least bad" unsafe move (give away fewest boxes in a chain).
 *
 * @param {number} width - The width of the game board.
 * @param {number} height - The height of the game board.
 * @param {object} clickedLines - An object storing all lines that have been drawn.
 * @param {Array<number>} boxScores - An array representing the current line count for each box.
 * @param {Array} boxes - A 2D array defining all boxes and their associated lines.
 * @returns {string|null} The chosen line ID for the bot's move, or null if no moves are available.
 */
export default function botPlayer(
  width,
  height,
  clickedLines,
  boxScores,
  boxes
) {
  //# DEBUG: Start of turn logging. Good for tracking bot's progress.
  //# console.log("\n----- BOT PLAYER TURN START (ADVANCED) -----");
  //# console.log("Board Dimensions: Width = %d, Height = %d", width, height);
  //# console.log("Current Box Scores:", JSON.stringify(boxScores));
  //# console.log("Current Clicked Lines:", Object.keys(clickedLines).filter(k => clickedLines[k]));

  const availableMoves = getAvailableMoves(width, height, clickedLines);
  //# DEBUG: console.log("Total Available Moves:", availableMoves.length);

  // If no moves are left, the game should be over.
  if (availableMoves.length === 0) {
    //# console.log("No available moves left. Game Over or Stalled.");
    return null;
  }

  // Categorize moves into winning, safe, or unsafe.
  const winningMoves = [];
  const safeMoves = []; // Stores { move: 'lineId', score: calculatedScore }
  const unsafeMoves = []; // Stores { move: 'lineId', chainLength: calculatedLength }

  for (const move of availableMoves) {
    const adjacentBoxes = getAdjacentBoxes(move, boxes);

    let isWinningMove = false;
    let isUnsafeMove = false;

    // Simulate placing 'move' and check its effect on adjacent boxes.
    for (const boxIndex of adjacentBoxes) {
      const simulatedScore = boxScores[boxIndex] + 1;

      if (simulatedScore === 4) {
        isWinningMove = true; // This move completes a box
        break; // Found a winning move, no need to check other boxes for this line.
      }
      if (simulatedScore === 3) {
        isUnsafeMove = true; // This move makes a box 3-sided (prone to being taken by opponent).
        // Don't break here; a box could be 3-sided AND another box could be 4-sided.
      }
    }

    // Place the move into the correct category.
    if (isWinningMove) {
      winningMoves.push(move);
    } else if (isUnsafeMove) {
      // For unsafe moves, we calculate its chain length to find the least damaging one.
      unsafeMoves.push({
        move: move,
        chainLength: getChainLength(move, boxes, clickedLines),
      });
    } else {
      // For truly safe moves, we evaluate their strategic quality.
      safeMoves.push({
        move: move,
        score: evaluateSafeMove(move, width, height, boxes, boxScores),
      });
    }
  }

  console.log("\n--- Move Categorization ---");
  console.log(`Winning Moves (${winningMoves.length}):`, winningMoves);
  console.log(`👍: (${safeMoves.length}):`);
  safeMoves.sort((a, b) => a.score - b.score); // Sort by score, lowest is best
  safeMoves.forEach((item) =>
    console.log(`  Move: ${item.move}, Score: ${item.score}`)
  );

  console.log(`👎: (${unsafeMoves.length}):`);
  unsafeMoves.sort((a, b) => a.chainLength - b.chainLength); // Sort by chain length, lowest is best sacrifice
  //# DEBUG: Loop through and log each unsafe move with its chain length.
  unsafeMoves.forEach((item) =>
    console.log(`  Move: ${item.move}, Chain Length: ${item.chainLength}`)
  );

  // Decision Logic

  // PRIORITY 1: Win the game (or take a box) if possible. Always the best move!
  if (winningMoves.length > 0) {
    const chosenMove = winningMoves[0]; // Just pick the first one found.
    console.log(
      `\nDECISION: Priority 1 - Found Winning Move. Choosing: ${chosenMove}`
    );
    return chosenMove;
  }

  // PRIORITY 2: If no winning moves, make the best strategic "safe" move.
  // This is where our advanced evaluation for safe moves comes in.
  if (safeMoves.length > 0) {
    const chosenMove = safeMoves[0].move; // After sorting, this is our top-scoring safe move.
    console.log(
      `\nDECISION: Priority 2 - Found Best Safe Move. Choosing: ${chosenMove} (Score: ${safeMoves[0].score})`
    );
    return chosenMove;
  }

  // PRIORITY 3: If no winning or safe moves are available, we are forced to sacrifice.
  // Choose the unsafe move that gives the opponent the fewest boxes in a chain.
  if (unsafeMoves.length > 0) {
    const chosenMove = unsafeMoves[0].move; // After sorting, this is the least harmful sacrifice.
    console.log(
      `\nDECISION: Priority 3 - No Safe or Winning Moves. Choosing best sacrificial move: ${chosenMove} (Chain Length: ${unsafeMoves[0].chainLength})`
    );
    console.log("This move aims to give up the fewest boxes to the opponent.");
    return chosenMove;
  }

  // Fallback: This case should ideally not be reached if availableMoves > 0.
  console.log("\nDECISION: No valid move found (unexpected scenario).");
  return null;
}
