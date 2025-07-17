import { StoreLocationSolver } from "./solver";
import { StoreLocationError } from "./types";

describe("StoreLocationSolver", () => {
  describe("solve", () => {
    it("should solve example 1 correctly", () => {
      const k = 2;
      const matrix = [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 0, 1],
      ];

      const result = StoreLocationSolver.solve(k, matrix);

      expect(result.count).toBe(2);
      expect(result.validLocations).toHaveLength(2);
      expect(result.processingTime).toBeGreaterThanOrEqual(0);

      // Check that the valid locations are correct
      const locationStrings = result.validLocations.map(
        (loc) => `${loc.row},${loc.col}`
      );
      expect(locationStrings).toContain("2,1");
      expect(locationStrings).toContain("2,2");
    });

    it("should solve example 2 correctly", () => {
      const k = 1;
      const matrix = [
        [0, 1],
        [0, 0],
      ];

      const result = StoreLocationSolver.solve(k, matrix);

      expect(result.count).toBe(2);
      expect(result.validLocations).toHaveLength(2);

      const locationStrings = result.validLocations.map(
        (loc) => `${loc.row},${loc.col}`
      );
      expect(locationStrings).toContain("0,0");
      expect(locationStrings).toContain("1,1");
    });

    it("should solve example 3 correctly (K=4)", () => {
      const k = 4;
      const matrix = [
        [0, 0, 0, 1],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const result = StoreLocationSolver.solve(k, matrix);

      expect(result.count).toBe(8);
      expect(result.validLocations).toHaveLength(8);

      // Check that the valid locations match the expected ones from the context
      // Expected locations: (1,1), (1,2), (2,1), (2,3), (3,2), (3,4), (4,3), (4,4)
      // Converting to 0-based indexing: (0,0), (0,1), (1,0), (1,2), (2,1), (2,3), (3,2), (3,3)
      const locationStrings = result.validLocations.map(
        (loc) => `${loc.row},${loc.col}`
      );

      const expectedLocations = [
        "0,0",
        "0,1", // (1,1), (1,2) in 1-based
        "1,0",
        "1,2", // (2,1), (2,3) in 1-based
        "2,1",
        "2,3", // (3,2), (3,4) in 1-based
        "3,2",
        "3,3", // (4,3), (4,4) in 1-based
      ];

      expectedLocations.forEach((expectedLoc) => {
        expect(locationStrings).toContain(expectedLoc);
      });
    });

    it("should return empty result when no valid locations exist", () => {
      const k = 1;
      const matrix = [
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
      ];

      const result = StoreLocationSolver.solve(k, matrix);

      expect(result.count).toBe(0);
      expect(result.validLocations).toHaveLength(0);
    });

    it("should handle single house case", () => {
      const k = 2;
      const matrix = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];

      const result = StoreLocationSolver.solve(k, matrix);

      expect(result.count).toBe(8); // All empty plots are within distance 2
      expect(result.validLocations).toHaveLength(8);
    });

    it("should throw error for invalid input", () => {
      expect(() => StoreLocationSolver.solve(0, [[0, 1]])).toThrow(
        StoreLocationError
      );
      expect(() => StoreLocationSolver.solve(2, [[0, 0]])).toThrow(
        StoreLocationError
      );
    });
  });

  describe("solveOptimized", () => {
    it("should produce same results as basic solve", async () => {
      const k = 2;
      const matrix = [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 0, 1],
      ];

      const basicResult = StoreLocationSolver.solve(k, matrix);
      const optimizedResult = await StoreLocationSolver.solveOptimized(
        k,
        matrix
      );

      expect(optimizedResult.count).toBe(basicResult.count);
      expect(optimizedResult.validLocations).toHaveLength(
        basicResult.validLocations.length
      );

      // Sort both arrays for comparison
      const sortFn = (a: any, b: any) => a.row - b.row || a.col - b.col;
      const basicSorted = basicResult.validLocations.sort(sortFn);
      const optimizedSorted = optimizedResult.validLocations.sort(sortFn);

      expect(optimizedSorted).toEqual(basicSorted);
    });

    describe("performance comparison", () => {
      it("should measure processing time", () => {
        const k = 3;
        const matrix = Array(10)
          .fill(0)
          .map(() => Array(10).fill(0));
        matrix[5][5] = 1;

        const result = StoreLocationSolver.solve(k, matrix);

        expect(typeof result.processingTime).toBe("number");
        expect(result.processingTime).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
