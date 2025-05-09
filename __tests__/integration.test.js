import { describe, test, expect } from "vitest";
import request from "supertest";
const app = require("../server.js");


describe("Integration Testing - Localhost", () => {
    test("Server should return home page correctly", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
    
        // Look for a unique element in home.html
        expect(response.text).toContain("<h1>Home Page</h1>"); // find real html contetn
    });
    
});
