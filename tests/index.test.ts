import request from "supertest";
import { BulletinServer } from "../src/bulletinServer";

const server = new BulletinServer("tests/testBulletins.json");

describe("BulletinServer Routes", () => {
  beforeAll(() => {
    server.start(3001);
  });

  afterAll(() => {
    server.close();
  });

  it("should add a new bulletin", async () => {
    const response = await request(server.app).post("/addBulletin").send({
      id: 1234987123409,
      title: "Test",
      userName: "Test",
      body: "Test",
      geo: "Test",
      imageUrl: "Test",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Bulletin added successfully");
    expect(response.body.bulletin).toEqual({
      id: 1234987123409,
      title: "Test",
      userName: "Test",
      body: "Test",
      geo: "Test",
      imageUrl: "Test",
    });
  });

  it("should get bulletins", async () => {
    const response = await request(server.app).get("/getBulletin");
    expect(response.status).toBe(200);
  });

  it("should delete a bulletin", async () => {
    const response = await request(server.app).delete(
      "/deleteBulletin/1234987123409"
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Bulletin deleted successfully");
  });

  it("should handle deleting a non-existent bulletin", async () => {
    const response = await request(server.app).delete(
      "/deleteBulletin/4398573498573957"
    );
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Bulletin not found");
  });
});
