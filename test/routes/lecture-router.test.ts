import { Express } from "express-serve-static-core";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import express, { json } from "express";
import passport from "passport";
import { TEACHER_ROLE_ID } from "../../src/config/constants";
import { LectureRouter } from "../../src/routes/lecture-router";
import request from "supertest";
import "dotenv/config";

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE } = process.env;

describe("test lecture router", () => {
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
    app.use(LectureRouter);
  });
  describe("get /", () => {
    test("gets all lectures", async () => {
      const response = await request(app)
        .get("/");
      expect(response.body).toStrictEqual(expectAllLectures);
    });
  });

  describe("get /:lectureId", () => {
    test("get a single lecture by id", async () => {
      const response = await request(app)
        .get("/2");
      expect(response.body).toStrictEqual({
          lectureId: 2,
          name: "Not Learning Microservices 2",
          startedAt: "2022-06-06T13:18:00.000Z",
          endedAt: "2022-06-06T16:18:00.000Z",
          subjectId: 12,
        },
      );
    });
    test("invalid lecture by id", async () => {
      const response = await request(app)
        .get("/20");
      expect(response.status).toBe(404);
    });
    test("invalid lecture by id format", async () => {
      const response = await request(app)
        .get("/invalidId");
      expect(response.status).toBe(404);
    });
  });
  describe("post lecture", () => {
  //   test("create new lecture", async () => {
  //     const response = await request(app)
  //       .post("/").send({
  //         name: "post_lecture",
  //         startedAt: "2022-06-06 14:20",
  //         endedAt: "2022-06-06 15:50",
  //         subjectId: "1",
  //       });
  //     expect(response.body).toStrictEqual({
  //       lectureId: 10,
  //       name: "post_lecture",
  //       endedAt: "2022-06-06T13:50:00.000Z",
  //       startedAt: "2022-06-06T12:20:00.000Z",
  //       subjectId: "1",
  //     });
  //   });
    // test("create new lecture without name", async () => {
    //   const response = await request(app)
    //     .post("/").send({
    //       startedAt: "2022-06-06 14:20",
    //       endedAt: "2022-06-06 15:50",
    //       subjectId: "1",
    //     });
    //   expect(response.body).toStrictEqual({
    //     lectureId: 11,
    //     name: "lecture_1",
    //     endedAt: "2022-06-06T13:50:00.000Z",
    //     startedAt: "2022-06-06T12:20:00.000Z",
    //     subjectId: "1",
    //   });
    // });
    test("create new lecture with bad date", async () => {
      const response = await request(app)
        .post("/").send({
          name: "post_lecture",
          startedAt: "2022-32-06 14:20",
          endedAt: "2022-06-06 15:50",
          subjectId: "1",
        });
      expect(response.status).toBe(500);
    });
    test("create new lecture with bad subjectId", async () => {
      const response = await request(app)
        .post("/").send({
          name: "post_lecture",
          startedAt: "2022-32-06 14:20",
          endedAt: "2022-06-06 15:50",
          subjectId: "20",
        });
      expect(response.status).toBe(500);
    });
    test("create new lecture with bad subjectId", async () => {
      const response = await request(app)
        .post("/").send({
          name: "post_lecture",
          startedAt: "null",
          endedAt: "2022-06-06 15:50",
          subjectId: "20",
        });
      expect(response.status).toBe(500);
    });
    test("create new lecture without dates subjectId", async () => {
      const response = await request(app)
        .post("/").send({
          name: "post_lecture",
          subjectId: "20",
        });
      expect(response.status).toBe(500);
    });
  });

  describe("patch /lectureId", () => {
    test("checks update name ", async () => {
      const response = await request(app)
        .patch("/3").send({
          name: "lecture_patch",
        });
      expect(response.body).toStrictEqual({
          lectureId: 3,
          name: "lecture_patch",
          startedAt: "2022-06-06T13:22:00.000Z",
          endedAt: "2022-06-06T17:52:00.000Z",
          subjectId: 12,
        },
      );
    });
    test("checks update name and subject ID ", async () => {
      const response = await request(app)
        .patch("/3").send({
          name: "lecture_patch",
          subjectId: 4,
        });
      expect(response.body).toStrictEqual({
          lectureId: 3,
          name: "lecture_patch",
          startedAt: "2022-06-06T13:22:00.000Z",
          endedAt: "2022-06-06T17:52:00.000Z",
          subjectId: 4,
        },
      );
    });
    // test("attempt to update with invalid id", async () => {
    //   const response = await request(app)
    //     .patch("/20").send({
    //       name: "lecture_patch",
    //       subjectId: 4,
    //     });
    //   expect(response.status).toBe(404);
    // });
  });

  describe("delete lecture", ()=> {
    test("delete lecture by id",async ()=>{
      const response = await request(app)
        .delete("/3")
      expect(response.status).toBe(202);
    })
    test("attempt delete lecture by wrong id",async ()=>{
      const response = await request(app)
        .delete("/20")
      expect(response.status).toBe(404);
    })
  })

  afterAll(() => {
    sequelize.close();
  });
});

const expectAllLectures = [
  {
    lectureId: 1,
    name: "Not Learning Microservices 1",
    startedAt: "2022-06-06T13:14:00.000Z",
    endedAt: "2022-06-06T14:44:00.000Z",
    subjectId: 12,
  },
  {
    lectureId: 2,
    name: "Not Learning Microservices 2",
    startedAt: "2022-06-06T13:18:00.000Z",
    endedAt: "2022-06-06T16:18:00.000Z",
    subjectId: 12,
  },
  {
    lectureId: 3,
    name: "Not Learning Microservices 3",
    startedAt: "2022-06-06T13:22:00.000Z",
    endedAt: "2022-06-06T17:52:00.000Z",
    subjectId: 12,
  },
  {
    lectureId: 4,
    name: "NoSQL 1",
    startedAt: "2022-06-06T13:26:00.000Z",
    endedAt: "2022-06-06T14:56:00.000Z",
    subjectId: 9,
  },
  {
    lectureId: 5,
    name: "NoSQL 2",
    startedAt: "2022-06-06T13:30:00.000Z",
    endedAt: "2022-06-06T16:30:00.000Z",
    subjectId: 9,
  },
  {
    lectureId: 6,
    name: "NoSQL 3",
    startedAt: "2022-06-06T13:34:00.000Z",
    endedAt: "2022-06-06T18:04:00.000Z",
    subjectId: 9,
  },
  {
    lectureId: 7,
    name: "Unit Testing",
    startedAt: "2022-06-06T13:40:00.000Z",
    endedAt: "2022-06-06T15:10:00.000Z",
    subjectId: 3,
  },
  {
    lectureId: 8,
    name: "Unit Testing",
    startedAt: "2022-06-06T13:44:00.000Z",
    endedAt: "2022-06-06T16:44:00.000Z",
    subjectId: 3,
  },
  {
    lectureId: 9,
    name: "Unit Testing",
    startedAt: "2022-06-06T13:50:00.000Z",
    endedAt: "2022-06-06T18:20:00.000Z",
    subjectId: 3,
  },
];
