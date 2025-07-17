import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:
        "Technical Interview Task Completed By Atmar Momand - Possible Plots for Retail Store Location closes to All Houses in Neighborhood",
      version: "1.0.0",
      description:
        " ## 🏗️ What's the problem I want to solve: A retail store chain wants to expand into a new neighborhood. To make the number of clients as large as possible, the new branch should be at a distance of no more than k from all the houses in the neighborhood. A is a matrix of size N x M. It represents the neighborhood as a rectangular grid, in which each cell is an integer 0 (an empty plot) or 1 (a house). The distance between two cells is calculated as minimum number of cell borders that one has to cross to move from the source cell to the target cell. It does not matter whether the cells on the way are empty or occupied but it does not allow for moving through corners. A store can be only built on an empty plot. How many suitable locations are there? For example, given K=2 and matrix A= [[0,0,0,0], [0,0,1,0],[1,0,0,1]], houses are located in cells with coordinates(2,3), (3,1) and (3,4). We can build a new store on two empty plots that are close enough to all houses. The first possible empty plot is located at (3,2). the distance to first house at(2,3) is 2. The distance to second house at (3,1) is 1. The third house at (3,4) is at distance of 2. The second possible empty plot is located(3,3). the distance to the first second and third houses are 1,2 and 1 respectively.I've created a complete TypeScript application with Node.js API for solving the Manhattan distance store location problem. Here's what's included:",
      contact: {
        name: "API Support",
        url: "https://github.com/Atmarkhan/retail-store-location-finder",
        email: "atmar.momand97@gmail.com",
      },
      license: {
        name: "UNLICENSE",
        url: "https://github.com/Atmarkhan/retail-store-location-finder",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://retail-store-location-finder-485791977123.europe-west1.run.app/api-docs/",
        description: "Production server (Google Cloud Run)",
      },
    ],
    components: {
      schemas: {
        Position: {
          type: "object",
          properties: {
            row: {
              type: "integer",
              minimum: 0,
              description: "Row index (0-based)",
            },
            col: {
              type: "integer",
              minimum: 0,
              description: "Column index (0-based)",
            },
          },
          required: ["row", "col"],
          example: {
            row: 2,
            col: 1,
          },
        },
        StoreLocationRequest: {
          type: "object",
          properties: {
            k: {
              type: "integer",
              minimum: 1,
              maximum: 800,
              description: "Maximum allowed Manhattan distance from any house",
            },
            matrix: {
              type: "array",
              items: {
                type: "array",
                items: {
                  type: "integer",
                  enum: [0, 1],
                },
              },
              minItems: 2,
              maxItems: 400,
              description: "Neighborhood grid where 0 = empty plot, 1 = house",
            },
          },
          required: ["k", "matrix"],
          example: {
            k: 2,
            matrix: [
              [0, 0, 0, 0],
              [0, 0, 1, 0],
              [1, 0, 0, 1],
            ],
          },
        },
        StoreLocationResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
            },
            data: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                  minimum: 0,
                  description: "Number of valid store locations found",
                },
                validLocations: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Position",
                  },
                  description: "Array of valid store location coordinates",
                },
                processingTime: {
                  type: "number",
                  minimum: 0,
                  description: "Processing time in milliseconds",
                },
              },
              required: ["count", "validLocations", "processingTime"],
            },
          },
          required: ["success", "data"],
          example: {
            success: true,
            data: {
              count: 2,
              validLocations: [
                { row: 2, col: 1 },
                { row: 2, col: 2 },
              ],
              processingTime: 1.234,
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error type",
            },
            message: {
              type: "string",
              description: "Error message",
            },
            field: {
              type: "string",
              description:
                "Field that caused the validation error (if applicable)",
            },
          },
          required: ["error", "message"],
          example: {
            error: "Validation Error",
            message: "K must be between 1 and 800",
            field: "k",
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Health status",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Current timestamp",
            },
            version: {
              type: "string",
              description: "API version",
            },
          },
          required: ["status", "timestamp", "version"],
          example: {
            status: "healthy",
            timestamp: "2025-07-17T10:30:00.000Z",
            version: "1.0.0",
          },
        },
        ExampleItem: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "Example description",
            },
            request: {
              $ref: "#/components/schemas/StoreLocationRequest",
            },
            expectedResult: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                  description: "Expected count of valid locations",
                },
                validLocations: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Position",
                  },
                  description: "Expected valid locations",
                },
              },
            },
          },
          required: ["description", "request", "expectedResult"],
        },
        ExamplesResponse: {
          type: "object",
          properties: {
            examples: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ExampleItem",
              },
              description: "Array of example requests and responses",
            },
          },
          required: ["examples"],
        },
      },
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check endpoint",
          description: "Returns the health status of the API",
          responses: {
            "200": {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/HealthResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/api/examples": {
        get: {
          tags: ["Examples"],
          summary: "Get usage examples",
          description:
            "Returns example requests and expected responses for the store location API",
          responses: {
            "200": {
              description: "List of examples",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExamplesResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/api/store-locations": {
        post: {
          tags: ["Store Location"],
          summary: "Find valid store locations",
          description:
            "Finds all valid store locations within the specified Manhattan distance from all houses",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StoreLocationRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successfully found store locations",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/StoreLocationResponse",
                  },
                },
              },
            },
            "400": {
              description: "Bad request - validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "429": {
              description: "Too many requests - rate limit exceeded",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example:
                          "Too many requests from this IP, please try again later.",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/app.ts"], // Path to the API files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express): void {
  // Swagger page
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle:
        "Atmar Momand - Technical Interview Task for BYSIX Company",
    })
  );

  // JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerSpec;
