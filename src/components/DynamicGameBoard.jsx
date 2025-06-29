const Dot = () => <div className="bg-black w-3 h-3"></div>;

const BoxArea = ({ boxIndex, score }) => {
  const boxId = `box${boxIndex + 1}`;
  let ownerClass = '';
  if (score === -1) ownerClass = 'bg-blue-400'; // Player A
  if (score === -2) ownerClass = 'bg-red-400'; // Player B

  return (
    <div
      id={boxId}
      className={`flex justify-center items-center w-14 h-14 ${ownerClass}`}></div>
  );
};

function Line({
  orientation,
  y,
  z,
  owner,
  turnA,
  hoveredLine,
  onClick,
  onEnter,
  onLeave,
}) {
  const lineId = `${orientation}-${y}-${z}`;
  const isVertical = orientation === 1;

  let ownerClass = '';
  if (owner === 'A') {
    ownerClass = 'bg-blue-600 pointer-events-none'; // Player A owns it
  } else if (owner === 'B') {
    ownerClass = 'bg-red-600 pointer-events-none'; // Player B owns it
  }

  let hoverClass = '';
  // Apply hover style only if the line is NOT owned AND is the one being hovered
  if (!owner && hoveredLine === lineId) {
    hoverClass = turnA ? 'bg-blue-400' : 'bg-red-400';
  }

  const sizeClasses = isVertical ? 'w-3 h-14' : 'h-3 w-14';

  return (
    <div
      id={lineId}
      className={`transition-all ${sizeClasses} ${hoverClass} ${ownerClass}`}
      onClick={onClick}
      onMouseEnter={() => onEnter(lineId)}
      onMouseLeave={onLeave}
    />
  );
}

export default function DynamicGameBoard({
  width,
  height,
  boxScores,
  turnA,
  clickedLines,
  hoveredLine,
  handleClick,
  handleLineEnter,
  handleLineLeave,
}) {
  const rows = [];

  for (let y = 0; y < height; y++) {
    const horizontalLines = [];
    const boxRowItems = [];

    // Top horizontal lines
    for (let z = 0; z < width; z++) {
      const lineId = `0-${y + 1}-${z + 1}`;
      horizontalLines.push(<Dot key={`dot-${y}-${z}`} />);
      horizontalLines.push(
        <Line
          key={lineId}
          orientation={0}
          y={y + 1}
          z={z + 1}
          owner={clickedLines[lineId]}
          turnA={turnA}
          hoveredLine={hoveredLine}
          onClick={handleClick}
          onEnter={handleLineEnter}
          onLeave={handleLineLeave}
        />
      );
    }
    horizontalLines.push(<Dot key={`dot-${y}-${width}`} />);

    // Vertical lines and boxes
    for (let z = 0; z < width; z++) {
      const vLineId = `1-${y + 1}-${z + 1}`;
      const boxIndex = y * width + z;
      boxRowItems.push(
        <Line
          key={vLineId}
          orientation={1}
          y={y + 1}
          z={z + 1}
          owner={clickedLines[vLineId]}
          turnA={turnA}
          hoveredLine={hoveredLine}
          onClick={handleClick}
          onEnter={handleLineEnter}
          onLeave={handleLineLeave}
        />
      );
      boxRowItems.push(
        <BoxArea
          key={`box-${boxIndex}`}
          boxIndex={boxIndex}
          score={boxScores[boxIndex]}
        />
      );
    }

    // Final right-side vertical line
    const finalVLineId = `1-${y + 1}-${width + 1}`;
    boxRowItems.push(
      <Line
        key={finalVLineId}
        orientation={1}
        y={y + 1}
        z={width + 1}
        owner={clickedLines[finalVLineId]}
        turnA={turnA}
        hoveredLine={hoveredLine}
        onClick={handleClick}
        onEnter={handleLineEnter}
        onLeave={handleLineLeave}
      />
    );

    rows.push(
      <div key={`h-row-${y}`} className="flex justify-center">
        {horizontalLines}
      </div>
    );
    rows.push(
      <div key={`box-row-${y}`} className="flex">
        {boxRowItems}
      </div>
    );
  }

  // Final bottom row of horizontal lines
  const finalHorizontalLines = [];
  for (let z = 0; z < width; z++) {
    const lineId = `0-${height + 1}-${z + 1}`;
    finalHorizontalLines.push(<Dot key={`final-dot-${z}`} />);
    finalHorizontalLines.push(
      <Line
        key={lineId}
        orientation={0}
        y={height + 1}
        z={z + 1}
        owner={clickedLines[lineId]}
        turnA={turnA}
        hoveredLine={hoveredLine}
        onClick={handleClick}
        onEnter={handleLineEnter}
        onLeave={handleLineLeave}
      />
    );
  }
  finalHorizontalLines.push(<Dot key={`final-dot-${width}`} />);
  rows.push(
    <div key="final-h-row" className="flex justify-center">
      {finalHorizontalLines}
    </div>
  );

  return <>{rows}</>;
}
