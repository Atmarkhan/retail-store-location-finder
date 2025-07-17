import {
  validateInput,
  manhattanDistance,
  findHouses,
  findEmptyPlots,
  isValidStoreLocation,
  cloneMatrix,
} from "./utils";
import { StoreLocationError } from "./types";

describe("Utils", () => {
  describe("validateInput", () => {
    it("should validate correct input", () => {
      const matrix = [
        [0, 1],
        [1, 0],
      ];
      expect(() => validateInput(2, matrix)).not.toThrow();
    });

    it("should throw error for invalid k values", () => {
      const matrix = [
        [0, 1],
        [1, 0],
      ];

      expect(() => validateInput(0, matrix)).toThrow(StoreLocationError);
      expect(() => validateInput(801, matrix)).toThrow(StoreLocationError);
      expect(() => validateInput(1.5, matrix)).toThrow(StoreLocationError);
      expect(() => validateInput(-1, matrix)).toThrow(StoreLocationError);
    });

    it("should throw error for invalid matrix", () => {
      expect(() => validateInput(2, [])).toThrow(StoreLocationError);
      expect(() => validateInput(2, [[]])).toThrow(StoreLocationError);
      expect(() => validateInput(2, [[0, 1], [1]])).toThrow(StoreLocationError);
    });

    it("should throw error for matrix with invalid values", () => {
      expect(() =>
        validateInput(2, [
          [0, 2],
          [1, 0],
        ])
      ).toThrow(StoreLocationError);
      expect(() =>
        validateInput(2, [
          [0, 1],
          [1, 0.5],
        ])
      ).toThrow(StoreLocationError);
    });

    it("should throw error for matrix without houses", () => {
      expect(() =>
        validateInput(2, [
          [0, 0],
          [0, 0],
        ])
      ).toThrow(StoreLocationError);
    });

    it("should throw error for matrix with invalid dimensions", () => {
      const smallMatrix = [[1]];
      expect(() => validateInput(2, smallMatrix)).toThrow(StoreLocationError);

      const largeMatrix = Array(401)
        .fill(0)
        .map(() => Array(401).fill(0));
      largeMatrix[0][0] = 1;
      expect(() => validateInput(2, largeMatrix)).toThrow(StoreLocationError);
    });
  });

  describe("manhattanDistance", () => {
    it("should calculate Manhattan distance correctly", () => {
      expect(manhattanDistance({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(0);
      expect(manhattanDistance({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(2);
      expect(manhattanDistance({ row: 2, col: 3 }, { row: 3, col: 1 })).toBe(3);
      expect(manhattanDistance({ row: 1, col: 2 }, { row: 2, col: 3 })).toBe(2);
    });
  });

  describe("findHouses", () => {
    it("should find all house positions", () => {
      const matrix = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ];

      const houses = findHouses(matrix);
      expect(houses).toHaveLength(3);
      expect(houses).toContainEqual({ row: 0, col: 1 });
      expect(houses).toContainEqual({ row: 1, col: 0 });
      expect(houses).toContainEqual({ row: 1, col: 2 });
    });

    it("should return empty array for matrix with no houses", () => {
      const matrix = [
        [0, 0, 0],
        [0, 0, 0],
      ];

      expect(findHouses(matrix)).toHaveLength(0);
    });
  });

  describe("findEmptyPlots", () => {
    it("should find all empty plot positions", () => {
      const matrix = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ];

      const emptyPlots = findEmptyPlots(matrix);
      expect(emptyPlots).toHaveLength(6);
      expect(emptyPlots).toContainEqual({ row: 0, col: 0 });
      expect(emptyPlots).toContainEqual({ row: 0, col: 2 });
      expect(emptyPlots).toContainEqual({ row: 1, col: 1 });
      expect(emptyPlots).toContainEqual({ row: 2, col: 0 });
      expect(emptyPlots).toContainEqual({ row: 2, col: 1 });
      expect(emptyPlots).toContainEqual({ row: 2, col: 2 });
    });
  });

  describe("isValidStoreLocation", () => {
    it("should return true for valid store location", () => {
      const position = { row: 1, col: 1 };
      const houses = [
        { row: 0, col: 0 },
        { row: 2, col: 2 },
      ];
      const k = 3;

      expect(isValidStoreLocation(position, houses, k)).toBe(true);
    });

    it("should return false for invalid store location", () => {
      const position = { row: 0, col: 0 };
      const houses = [{ row: 3, col: 3 }];
      const k = 2;

      expect(isValidStoreLocation(position, houses, k)).toBe(false);
    });
  });

  describe("cloneMatrix", () => {
    it("should create a deep copy of matrix", () => {
      const original = [
        [0, 1],
        [1, 0],
      ];
      const cloned = cloneMatrix(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);

      // Modify cloned matrix
      cloned[0][0] = 1;
      expect(original[0][0]).toBe(0);
    });
  });
});
