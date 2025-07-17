/**
 * Types for the Manhattan Distance Challenge
 */

export type Matrix = number[][];

export interface Position {
  row: number;
  col: number;
}

export interface StoreLocationRequest {
  k: number;
  matrix: Matrix;
}

export interface StoreLocationResponse {
  count: number;
  validLocations: Position[];
  processingTime: number;
}

export interface ValidationError {
  message: string;
  field?: string;
}

export class StoreLocationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "StoreLocationError";
  }
}
