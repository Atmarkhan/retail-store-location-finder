import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { StoreLocationSolver } from "./solver";
import { StoreLocationRequest, StoreLocationError } from "./types";
import { setupSwagger } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(limiter);

// Setup Swagger documentation
setupSwagger(app);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Main API endpoint
app.post("/api/store-locations", async (req: Request, res: Response) => {
  try {
    const { k, matrix }: StoreLocationRequest = req.body;

    if (k === undefined || matrix === undefined) {
      //return http bad request indicating that the parameters are missing
      return res.status(400).json({
        error: "Missing required parameters",
        message: "Both k and matrix are required",
      });
    }

    const result = await StoreLocationSolver.solveOptimized(k, matrix);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof StoreLocationError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
        field: error.field,
      });
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
});

// Get example usage
app.get("/api/examples", (req: Request, res: Response) => {
  res.json({
    examples: [
      {
        description: "Basic example with K=2",
        request: {
          k: 2,
          matrix: [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 0, 0, 1],
          ],
        },
        expectedResult: {
          count: 2,
          validLocations: [
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
      {
        description: "Small example with K=1",
        request: {
          k: 1,
          matrix: [
            [0, 1],
            [0, 0],
          ],
        },
        expectedResult: {
          count: 2,
          validLocations: [
            { row: 0, col: 0 },
            { row: 1, col: 1 },
          ],
        },
      },
      {
        description: "Complex example with K=4",
        request: {
          k: 4,
          matrix: [
            [0, 0, 0, 1],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0],
          ],
        },
        expectedResult: {
          count: 8,
          validLocations: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 3 },
            { row: 3, col: 2 },
            { row: 3, col: 3 },
          ],
        },
      },
    ],
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
  next();
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
  });
});

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api/store-locations`);
    console.log(`Examples: http://localhost:${PORT}/api/examples`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  });
}

export default app;
