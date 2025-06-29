/**
 * A generator for creating a grid of boxes defined by their boundary lines.
 * The data structure is an array of "boxes", where each box is an array
 * of 4 "line" definitions.
 */
export class BoxGridGenerator {
  /**
   * Creates an instance of BoxGridGenerator.
   * @param {number} width The number of boxes in each row (horizontal count).
   * @param {number} height The number of boxes in each column (vertical count).
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.boxes = [];

    // The coordinate system is 1-indexed
    // 'y' corresponds to the row index.
    // 'z' corresponds to the column index.
    for (let y = 1; y <= this.height; y++) {
      for (let z = 1; z <= this.width; z++) {
        // For each cell (y, z) in the grid, we define the 4 lines that form the box.
        const box = this.createBox(y, z);
        this.boxes.push(box);
      }
    }
  }

  /**
   * Creates the line definitions for a single box at a given coordinate.
   *
   * The line format is [orientation, y, z]:
   * - orientation: 0 for Horizontal, 1 for Vertical.
   * - y, z: The grid coordinates of the line's starting node.
   *
   * @param {number} y The row position of the box.
   * @param {number} z The column position of the box.
   * @returns {Array<Array<number>>} An array of 4 line definitions.
   */
  createBox(y, z) {
    // Defines the four lines forming a square:
    const left = [1, y, z];
    const top = [0, y, z];
    const right = [1, y, z + 1];
    const bottom = [0, y + 1, z];

    return [left, top, right, bottom];
  }
}
