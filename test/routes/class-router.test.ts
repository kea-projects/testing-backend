import { Express } from "express-serve-static-core";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import express, { json } from "express";
import passport from "passport";
import { TEACHER_ROLE_ID } from "../../src/config/constants";
import request from "supertest";
import "dotenv/config";
import { ClassRouter } from "../../src/routes/class-router";

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE } = process.env;
describe("test user router", () => {
  let app: Express;
  let sequelize: Sequelize;
  beforeAll(async () => {
    sequelize = new Sequelize(DATABASE!, DB_USERNAME!, DB_PASSWORD!, {
      host: DB_HOST!,
      dialect: "mysql",
      logging: false,
      define: {
        timestamps: false,
      },
    });
    await loadDB(sequelize);
    app = express();
    app.use(json());
    app.use(passport.initialize());
    app.use((req, res, next) => {
      req.isAuthenticated = () => true;
      req.user = {
        email: "abcd@test.com",
        name: "big fart",
        roleId: TEACHER_ROLE_ID,
        userId: "1",
      };
      next();
    });
    app.use(ClassRouter);
  });
  describe("get /classId", () => {
    test("get class by id", async () => {
      const response = await request(app)
        .get("/1");
      expect(response.body).toStrictEqual({ classId: 1, name: "SW20" });
    });
    test("attempt to get class by invalid id", async () => {
      const response = await request(app)
        .get("/20");
      expect(response.status).toBe(404);
    });
  });
  describe("get /", () => {
    test("gets all classes", async () => {
      const response = await request(app)
        .get("/");
      expect(response.body).toStrictEqual([
        { classId: 1, name: "SW20" },
        { classId: 2, name: "WD20" },
        { classId: 3, name: "SW21" },
        { classId: 4, name: "WD21" },
        { classId: 5, name: "SW22" },
        { classId: 6, name: "WD22" },
      ]);
    });
  });
  describe("post /", () => {
    test("checks create a new post", async () => {
      const response = await request(app)
        .post("/").send({ name: "WD23" });
      expect(response.body).toStrictEqual({ classId: 7, name: "WD23" });
    });
  });
  describe("patch /:classId", () => {
    test("update class name", async () => {
      const response = await request(app)
        .patch("/2").send({ name: "WB-PATCH" });
      expect(response.body).toStrictEqual({ classId: 2, name: "WB-PATCH" });
    });
    test("update class name", async () => {
      const response = await request(app)
        .patch("/20").send({ name: "WB-PATCH" });
      expect(response.status).toBe(404);
    });
  });
  describe("delete /:classId",  () => {
    test("delete a class id", async() => {
      const response = await request(app)
        .delete("/3");
      expect(response.status).toBe(202);
    });
    test("delete a class id", async() => {
      const response = await request(app)
        .delete("/20");
      expect(response.status).toBe(404);
    });
  });

  afterAll(() => {
    sequelize.close();
  });

});
