import { Matrix, Position, StoreLocationError } from "./types";

/**
 * Utility functions for matrix operations and validation
 */

/**
 * Validates the input parameters for the store location algorithm
 */
export function validateInput(k: number, matrix: Matrix): void {
  // Validate K
  if (!Number.isInteger(k) || k < 1 || k > 800) {
    throw new StoreLocationError(
      "K must be an integer within the range [1..800]",
      "k"
    );
  }

  // Validate matrix
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new StoreLocationError("Matrix must be a non-empty array", "matrix");
  }

  const n = matrix.length;
  const m = matrix[0]?.length || 0;

  // Validate dimensions
  if (n < 2 || n > 400 || m < 2 || m > 400) {
    throw new StoreLocationError(
      "Matrix dimensions must be within the range [2..400]",
      "matrix"
    );
  }

  // Validate matrix structure and values
  let hasHouse = false;
  for (let i = 0; i < n; i++) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== m) {
      throw new StoreLocationError(
        "Matrix must be rectangular with consistent row lengths",
        "matrix"
      );
    }

    for (let j = 0; j < m; j++) {
      const value = matrix[i][j];
      if (!Number.isInteger(value) || (value !== 0 && value !== 1)) {
        throw new StoreLocationError(
          "Matrix elements must be integers 0 or 1",
          "matrix"
        );
      }
      if (value === 1) {
        hasHouse = true;
      }
    }
  }

  if (!hasHouse) {
    throw new StoreLocationError(
      "Matrix must contain at least one house (value 1)",
      "matrix"
    );
  }
}

/**
 * Calculates the Manhattan distance between two positions
 */
export function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}

/**
 * Finds all house positions in the matrix
 */
export function findHouses(matrix: Matrix): Position[] {
  const houses: Position[] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 1) {
        houses.push({ row: i, col: j });
      }
    }
  }
  return houses;
}

/**
 * Finds all empty plot positions in the matrix
 */
export function findEmptyPlots(matrix: Matrix): Position[] {
  const emptyPlots: Position[] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        emptyPlots.push({ row: i, col: j });
      }
    }
  }
  return emptyPlots;
}

/**
 * Checks if a position is within the given distance k from all houses
 */
export function isValidStoreLocation(
  position: Position,
  houses: Position[],
  k: number
): boolean {
  return houses.every((house) => manhattanDistance(position, house) <= k);
}

/**
 * Creates a deep copy of a matrix
 */
export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}
