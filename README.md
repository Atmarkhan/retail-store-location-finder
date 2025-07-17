# Manhattan Distance Challenge

A TypeScript application for finding optimal store locations based on Manhattan distance constraints.

## Problem Description

A retail store chain wants to expand into a new neighborhood. To maximize the number of clients, the new branch should be at a distance of no more than `k` from all houses in the neighborhood.

The neighborhood is represented as a rectangular grid where:

- `0` = empty plot (potential store location)
- `1` = house

The distance between two cells is calculated as the Manhattan distance (minimum number of cell borders to cross).

## Features

- **Core Algorithm**: Efficient solution for finding valid store locations
- **REST API**: HTTP endpoints for easy integration
- **TypeScript**: Full type safety and excellent developer experience
- **Comprehensive Tests**: Unit tests and API tests with Jest
- **Input Validation**: Robust validation for all constraints
- **Performance Monitoring**: Processing time measurement
- **Error Handling**: Detailed error messages and proper HTTP status codes

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd manhattan-distance-challenge

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start the development server
npm run dev

# Start the production server
npm start
```

## API Usage

### Health Check

```bash
GET /health
```

### Get Examples

```bash
GET /api/examples
```

### Find Store Locations

```bash
POST /api/store-locations
Content-Type: application/json

{
  "k": 2,
  "matrix": [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 1]
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "count": 2,
    "validLocations": [
      { "row": 2, "col": 1 },
      { "row": 2, "col": 2 }
    ],
    "processingTime": 0.123
  }
}
```

## Examples -

### Example 1

- **Input**: K=2, Matrix=[[0,0,0,0], [0,0,1,0], [1,0,0,1]]
- **Output**: 2 valid locations at (2,1) and (2,2)
- **Explanation**: Houses at (1,2), (2,0), and (2,3). Both valid locations are within distance 2 from all houses.

### Example 2

- **Input**: K=1, Matrix=[[0,1], [0,0]]
- **Output**: 2 valid locations at (0,0) and (1,1)
- **Explanation**: House at (0,1). Both empty plots are within distance 1.

### Example 3

- **Input**: K=4, Matrix=[[0,0,0,1], [0,1,0,0], [0,0,1,0], [1,0,0,0], [0,0,0,0]]
- **Output**: 8 valid locations
- **Explanation**: With K=4, most empty plots are within the distance constraint.

## Programming Usage

```typescript
import { StoreLocationSolver } from "./solver";

const k = 2;
const matrix = [
  [0, 0, 0, 0],
  [0, 0, 1, 0],
  [1, 0, 0, 1],
];

const result = StoreLocationSolver.solve(k, matrix);
console.log(`Found ${result.count} valid locations`);
console.log(`Processing time: ${result.processingTime}ms`);
```

## Algorithm Details

The solution uses two approaches:

1. **Basic Algorithm**: Find all houses and empty plots, then check each empty plot against all houses
2. **Optimized Algorithm**: Early termination and direct matrix traversal for better performance

Time Complexity: O(N × M × H) where N×M is the matrix size and H is the number of houses
Space Complexity: O(N × M) for storing positions

## Constraints

- K: integer within range [1..800]
- Matrix dimensions: N, M within range [2..400]
- Matrix values: 0 or 1 only
- At least one house must be present

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Lint the code
npm run lint

# Fix linting issues
npm run lint:fix
```

## API Documentation

### Error Responses

#### 400 Bad Request

```json
{
  "error": "Validation Error",
  "message": "K must be an integer within the range [1..800]",
  "field": "k"
}
```

#### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "The requested endpoint does not exist"
}
```

#### 429 Too Many Requests

```json
{
  "error": "Too Many Requests",
  "message": "Too many requests from this IP, please try again later."
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Performance

The optimized algorithm includes:

- Early termination when a plot is found to be invalid
- Direct matrix traversal without creating intermediate arrays
- Efficient Manhattan distance calculation

For large matrices (up to 400×400), the algorithm typically runs in under 100ms.

## License

MIT License
