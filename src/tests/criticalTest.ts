import request from "supertest";
import app from "../index";

describe("POST /api/todos", () => {
  it("should create a new todo", async () => {
    const res = await request(app)  
      .post("/api/todos")
      .send({ task: "New Task" });

    expect(res.statusCode).toBe(201);
    expect(res.body.task).toBe("New Task");
  });
});