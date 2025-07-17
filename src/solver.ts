import { Matrix, Position, StoreLocationResponse } from "./types";
import {
  validateInput,
  findHouses,
  findEmptyPlots,
  isValidStoreLocation,
} from "./utils";

/**
 * Main algorithm implementation for finding suitable store locations
 */
export class StoreLocationSolver {
  /**
   * Finds the number of suitable store locations and their positions
   * @param k Maximum allowed distance from any house
   * @param matrix Neighborhood grid (0 = empty plot, 1 = house)
   * @returns Object containing count, valid locations, and processing time
   */
  public static solve(k: number, matrix: Matrix): StoreLocationResponse {
    const startTime = Date.now();

    // Validate input
    validateInput(k, matrix);

    // Find all houses and empty plots
    const houses = findHouses(matrix);
    const emptyPlots = findEmptyPlots(matrix);

    // Find valid store locations
    const validLocations: Position[] = [];

    for (const plot of emptyPlots) {
      if (isValidStoreLocation(plot, houses, k)) {
        validLocations.push(plot);
      }
    }

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    return {
      count: validLocations.length,
      validLocations,
      processingTime,
    };
  }

  /**
   * Optimized version using early termination and spatial optimization
   * This version can handle larger matrices more efficiently
   */
  public static async solveOptimized(
    k: number,
    matrix: Matrix
  ): Promise<StoreLocationResponse> {
    const startTime = Date.now();

    // add a delay of 100 ms just for the similuation of processing time
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Validate input
    validateInput(k, matrix);

    const houses = findHouses(matrix);
    const validLocations: Position[] = [];

    // Process each empty plot
    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      if (row) {
        for (let j = 0; j < row.length; j++) {
          if (row[j] === 0) {
            const currentPlot = { row: i, col: j };

            // Check if this plot is valid (within distance k from all houses)
            let isValid = true;
            for (const house of houses) {
              // Calculate Manhattan distance
              const distance =
                Math.abs(currentPlot.row - house.row) +
                Math.abs(currentPlot.col - house.col);
              if (distance > k) {
                isValid = false;
                break; // Early termination
              }
            }

            if (isValid) {
              validLocations.push(currentPlot);
            }
          }
        }
      }
    }

    const endTime = Date.now();
    console.log(`Processing time: ${endTime - startTime} ms`);
    console.log(`processing time ${startTime} ms and end time ${endTime} ms`);
    const processingTime = endTime - startTime;

    return {
      count: validLocations.length,
      validLocations,
      processingTime,
    };
  }
}
