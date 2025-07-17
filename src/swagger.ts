import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Manhattan Distance Challenge API",
      version: "1.0.0",
      description:
        "A TypeScript API for finding optimal store locations based on Manhattan distance constraints",
      contact: {
        name: "API Support",
        url: "https://github.com/Atmarkhan/technical-exercise",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://your-app.run.app",
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
      customSiteTitle: "Manhattan Distance API Documentation",
    })
  );

  // JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerSpec;
