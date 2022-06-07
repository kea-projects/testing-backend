import request from "supertest";
import { SubjectRouter } from "../../src/routes/subject-router";
import { TEACHER_ROLE_ID } from "../../src/config/constants";
import express, { json } from "express";
import passport from "passport";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import { Express } from "express-serve-static-core";
import "dotenv/config";

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE } = process.env;

describe("test subject router", () => {
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
    app.use(SubjectRouter);
  });

  describe("get /:subjectId", () => {
    test("Id that exists in database", async () => {
      const response = await request(app)
        .get("/1");
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ name: "Testing SW20", subjectId: 1, classId: 1, teacherUserId: 1 });
    });
    test("ID that does not exist in the database", async () => {
      const response = await request(app)
        .get("/30");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Subject not found.");
    });
    test("ID that does not following the format", async () => {
      const response = await request(app)
        .get("/notId");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Subject not found.");
    });
  });

  describe("get /", () => {
    test("Gets all subject from db", async () => {
      const response = await request(app)
        .get("/");
      expect(response.status).toBe(200);
      expect((response.body as Array<unknown>).sort()).toStrictEqual(expectedAllSubjects.sort());
    });
  });

  describe("post /", () => {
    test("checks create new subject", async () => {
      const response = await request(app)
        .post("/").send({ name: "test post", classId: "1", teacherUserId: "2" });
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ subjectId: 13, name: "test post", teacherUserId: "2", classId: "1" });
    });
    test("checks create new subject failed on class id that not exist", async () => {
      const response = await request(app)
        .post("/").send({ name: "test post", classId: "300", teacherUserId: "1" });
      expect(response.status).toBe(500);
    });
    test("checks create new subject failed on teacher id that not exist", async () => {
      const response = await request(app)
        .post("/").send({ name: "test post", classId: "1", teacherUserId: "300" });
      expect(response.status).toBe(500);
    });
  });

  describe("patch /:subjectId", () => {
    test("update subject", async () => {
      const response = await request(app)
        .patch("/12").send({ name: "test patch" });
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ subjectId: 12, name: "test patch", teacherUserId: 4, classId: 5 });
    });
    test("fail update subject that not exist", async () => {
      const response = await request(app)
        .patch("/20").send({ name: "test patch" });
      expect(response.status).toBe(404);
    });
    test("fail update subject that not teacherUserId does not exist", async () => {
      const response = await request(app)
        .patch("/12").send({ name: "test patch",teacherUserId: 20 });
      expect(response.status).toBe(500);
    });
  });

  describe("delete /:subject", () => {
    test("delete subject", async () => {
      const response = await request(app)
        .delete("/12").send({ name: "test patch" });
      expect(response.status).toBe(202);
    });
    test("attempt to delete subject that not exist", async () => {
      const response = await request(app)
        .delete("/20").send({ name: "test patch" });
      expect(response.status).toBe(404);
    });
  });
  describe("get by-teacher/:teacherId", ()=> {
    test("receives subjects by teacher id",async ()=> {
      const response =await request(app)
        .get("/by-teacher/1")
      expect(response.body).toStrictEqual([
        { subjectId: 1, name: 'Testing SW20', teacherUserId: 1, classId: 1 },
        { subjectId: 2, name: 'Testing SW21', teacherUserId: 1, classId: 3 },
        { subjectId: 3, name: 'Testing SW22', teacherUserId: 1, classId: 5 }
      ])
    })
    test("test to get teacher classes for non exist teacher", async ()=> {
      const response = await request(app)
        .delete("/by-teacher/20").send({ name: "test patch" });
      expect(response.status).toBe(404);

    })
  })
  afterAll(() => {
    sequelize.close();
  });
});

const expectedAllSubjects = [
  { subjectId: 1, name: "Testing SW20", teacherUserId: 1, classId: 1 },
  { subjectId: 2, name: "Testing SW21", teacherUserId: 1, classId: 3 },
  { subjectId: 3, name: "Testing SW22", teacherUserId: 1, classId: 5 },
  { subjectId: 4, name: "Web Development WD20", teacherUserId: 2, classId: 2 },
  { subjectId: 5, name: "Web Development WD21", teacherUserId: 2, classId: 4 },
  { subjectId: 6, name: "Web Development WD22", teacherUserId: 2, classId: 6 },
  { subjectId: 7, name: "Databases SW20", teacherUserId: 3, classId: 1 },
  { subjectId: 8, name: "Databases SW21", teacherUserId: 3, classId: 3 },
  { subjectId: 9, name: "Databases SW22", teacherUserId: 3, classId: 5 },
  { subjectId: 10, name: "Large Systems SW20", teacherUserId: 4, classId: 1 },
  { subjectId: 11, name: "Large Systems SW21", teacherUserId: 4, classId: 3 },
  { subjectId: 12, name: "Large Systems SW22", teacherUserId: 4, classId: 5 },
];