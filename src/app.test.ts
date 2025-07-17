import request from "supertest";
import app from "./app";

describe("API Endpoints", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status", "healthy");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("version", "1.0.0");
    });
  });

  describe("GET /api/examples", () => {
    it("should return examples", async () => {
      const response = await request(app).get("/api/examples").expect(200);

      expect(response.body).toHaveProperty("examples");
      expect(Array.isArray(response.body.examples)).toBe(true);
      expect(response.body.examples.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/store-locations", () => {
    it("should solve example 1 correctly", async () => {
      const requestBody = {
        k: 2,
        matrix: [
          [0, 0, 0, 0],
          [0, 0, 1, 0],
          [1, 0, 0, 1],
        ],
      };

      const response = await request(app)
        .post("/api/store-locations")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(2);
      expect(response.body.data.validLocations).toHaveLength(2);
      expect(response.body.data.processingTime).toBeGreaterThanOrEqual(100);
    });

    it("should solve example 2 correctly", async () => {
      const requestBody = {
        k: 1,
        matrix: [
          [0, 1],
          [0, 0],
        ],
      };

      const response = await request(app)
        .post("/api/store-locations")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(2);
    });

    it("should handle missing parameters", async () => {
      const response = await request(app)
        .post("/api/store-locations")
        .send({})
        .expect(400);

      expect(response.body.error).toBe("Missing required parameters");
    });

    it("should handle invalid k parameter", async () => {
      const requestBody = {
        k: 0,
        matrix: [
          [0, 1],
          [1, 0],
        ],
      };

      const response = await request(app)
        .post("/api/store-locations")
        .send(requestBody)
        .expect(400);

      expect(response.body.error).toBe("Validation Error");
      expect(response.body.field).toBe("k");
    });

    it("should handle invalid matrix", async () => {
      const requestBody = {
        k: 2,
        matrix: [
          [0, 0],
          [0, 0],
        ],
      };

      const response = await request(app)
        .post("/api/store-locations")
        .send(requestBody)
        .expect(400);

      expect(response.body.error).toBe("Validation Error");
      expect(response.body.field).toBe("matrix");
    });

    it("should handle malformed matrix", async () => {
      const requestBody = {
        k: 2,
        matrix: [[0, 1], [1]],
      };

      const response = await request(app)
        .post("/api/store-locations")
        .send(requestBody)
        .expect(400);

      expect(response.body.error).toBe("Validation Error");
    });

    it("should handle large valid input", async () => {
      const matrix = Array(20)
        .fill(0)
        .map(() => Array(20).fill(0));
      matrix[5][5] = 1;
      matrix[15][15] = 1;

      const requestBody = {
        k: 10,
        matrix: matrix,
      };

      const response = await request(app)
        .post("/api/store-locations")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBeGreaterThan(0);
      expect(response.body.data.processingTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe("404 handler", () => {
    it("should return 404 for non-existent endpoints", async () => {
      const response = await request(app)
        .get("/non-existent-endpoint")
        .expect(404);

      expect(response.body.error).toBe("Not Found");
    });
  });
});
