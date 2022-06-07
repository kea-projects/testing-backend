import { Express } from "express-serve-static-core";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import express, { json } from "express";
import passport from "passport";
import { TEACHER_ROLE_ID } from "../../src/config/constants";
import request from "supertest";
import { UserRouter } from "../../src/routes/user-router";
import "dotenv/config";

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
    app.use(UserRouter);
  });
  describe("get /:id", () => {
    test("Id that exists in database", async () => {
      const response = await request(app)
        .get("/1");
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ userId: 1, name: "Teacher Bob", email: "alex320i@stud.kea.dk", roleId: 1 });
    });
    test("Id that does not exist in the database", async () => {
      const response = await request(app)
        .get("/200");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });
    test("ID that does not following the format", async () => {
      const response = await request(app)
        .get("/notId");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });
  });

  describe("get /", () => {
    test("Gets all subject from db", async () => {
      const response = await request(app)
        .get("/");
      expect(response.status).toBe(200);
      expect((response.body as Array<unknown>).sort()).toStrictEqual(expectedAllUsers);
    });
  });

  describe("post /", () => {
    test("checks create new user", async () => {
      const response = await request(app)
        .post("/").send({ email: "test@kea.dk", name: "Teacher Bob", roleId: 1 });
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ email: "test@kea.dk", name: "Teacher Bob", roleId: 1,"userId": 14  });
    });
    test("checks create new subject failed on role id that not exist", async () => {
      const response = await request(app)
        .post("/").send({ email: "test-failed@kea.dk", name: "Teacher Bob", roleId: 3 });
      expect(response.status).toBe(500);
    });
  });

  describe("patch /:userId", () => {
    test("update user", async () => {
      const response = await request(app)
        .patch("/12").send({ name: "test patch",email: "test-patch@stud.kea.dk"});
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        { "email": "test-patch@stud.kea.dk", "name": "test patch", "roleId": 2, "userId": 12 });
    });
    test("fail update user that not exist", async () => {
      const response = await request(app)
        .patch("/20").send({ name: "test patch" });
      expect(response.status).toBe(404);
    });
    test("fail update user with role id that does not exist", async () => {
      const response = await request(app)
        .patch("/12").send({ name: "test patch",roleId: 3 });
      expect(response.status).toBe(500);
    });
  });

  describe("delete /:userId", () => {
    test("delete user", async () => {
      const response = await request(app)
        .delete("/12").send({ name: "test patch" });
      expect(response.status).toBe(202);
    });
    // test("attempt to delete user that not exist", async () => {
    //   const response = await request(app)
    //     .delete("/20").send({ name: "test patch" });
    //   expect(response.status).toBe(404);
    // });
  });



  afterAll(() => {
    sequelize.close();
  });
});
const expectedAllUsers = [
  { "email": "alex320i@stud.kea.dk", "name": "Teacher Bob", "roleId": 1, "userId": 1 },
  { "email": "ann@kea.dk", "name": "Teacher Ann", "roleId": 1, "userId": 2 },
  { "email": "won@kea.dk", "name": "Teacher Won", "roleId": 1, "userId": 3 },
  { "email": "tom@kea.dk", "name": "Teacher Tom", "roleId": 1, "userId": 4 },
  { "email": "cris2041@stud.kea.dk", "name": "Student Ada", "roleId": 2, "userId": 6 },
  { "email": "pam@stud.kea.dk", "name": "Student Pam", "roleId": 2, "userId": 7 },
  { "email": "kit@stud.kea.dk", "name": "Student Kit", "roleId": 2, "userId": 8 },
  { "email": "zoe@stud.kea.dk", "name": "Student Zoe", "roleId": 2, "userId": 9 },
  { "email": "ray@stud.kea.dk", "name": "Student Ray", "roleId": 2, "userId": 10 },
  { "email": "alf@stud.kea.dk", "name": "Student Alf", "roleId": 2, "userId": 11 },
  { "email": "coy@stud.kea.dk", "name": "Student Coy", "roleId": 2, "userId": 12 },
  { "email": "gil@stud.kea.dk", "name": "Student Gil", "roleId": 2, "userId": 13 }];
