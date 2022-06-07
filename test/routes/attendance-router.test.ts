
import request from "supertest";
import express, { json } from "express";
import passport from "passport";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import { TEACHER_ROLE_ID } from "../../src/config/constants";
import { AttendanceRouter } from "../../src/routes/attendance-router";
import { Express } from "express-serve-static-core";
import "dotenv/config"

/**
 * Attendance behaviour
 * 	Router is Guarded against all users except teachers.
 * 	The router currently has endpoints to do the following actions:
 * 	- get all attendances
 * 	- get attendance by attendanceId
 * 	- create an attendance (Students attend through the class-code-router)
 * 	- update an attendance
 * 	- delete an attendance
 */

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE } = process.env;
describe("test attendance router", () => {
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
    app.use(AttendanceRouter);
  });

	describe("get /:attendanceId", () => {
		test("Id that exists in the database", async () => {
			const response = await request(app)
				.get("/1");
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual({
				attendanceId: 1, 
				attendedAt: '2022-06-06T13:14:00.000Z',
				userId: 1, 
				lectureId: 5
			});
		});
		test("Id that does not exist in the database", async () => {
      const response = await request(app)
        .get("/30");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Attendance not found.");
    });
		test("Id that does not have the correct format", async () => {
      const response = await request(app)
        .get("/notId");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Attendance not found.");
    });
	});
	
  describe("get /", () => {
    test("Gets all Attendances from db", async () => {
      const response = await request(app)
        .get("/");
      expect(response.status).toBe(200);
      expect((response.body as Array<unknown>).sort()).toStrictEqual(expectedAllAttendances.sort());
    });
  });

  describe("post /", () => {
    test("checks create new Attendance", async () => {
      const response = await request(app)
        .post("/").send({ userId: "6", lectureId: "5", attendedAt: '2022-06-06 14:20' });
			const testDate = stringToIsoUtcDate('2022-06-06 14:20');
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ attendanceId: 14, attendedAt: testDate, userId: "6", lectureId: "5" });
    });
    test("checks create new attendance failed on lecture id that not exist", async () => {
      const response = await request(app)
        .post("/").send({ userId: "6", lectureId: "30", attendedAt: '2022-06-06 14:20' });
      expect(response.status).toBe(500);
    });
    test("checks create new attendance failed on user id that not exist", async () => {
      const response = await request(app)
        .post("/").send({ userId: "30", lectureId: "5", attendedAt: '2022-06-06 14:20' });
      expect(response.status).toBe(500);
    });
  });

  describe("patch /:attendanceId", () => {
    test("update subject", async () => {
      const response = await request(app)
        .patch("/5").send({ attendedAt: '2022-06-06 14:20' });
			const testDate = stringToIsoUtcDate('2022-06-06 14:20');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ attendanceId: 5, attendedAt: testDate, userId: 1, lectureId: 9 });
    });
    test("fail update attendance that not exist", async () => {
      const response = await request(app)
        .patch("/20").send({ attendedAt: '2022-06-06 14:20' });
      expect(response.status).toBe(404);
    });
    test("fail update attendance that not user id does not exist", async () => {
      const response = await request(app)
        .patch("/12").send({ attendedAt: '2022-06-06 14:20', userId: "30"});
      expect(response.status).toBe(500);
    });
  });

  describe("delete /:attendance", () => {
    test("delete valid attendance", async () => {
      const response = await request(app)
        .delete("/12").send();
      expect(response.status).toBe(202);
    });
    test("attempt to delete subject that not exist", async () => {
      const response = await request(app)
        .delete("/20").send();
      expect(response.status).toBe(404);
    });
  });

  afterAll(() => {
    sequelize.close();
  });
});

const stringToIsoUtcDate = (dateString: string) => {
	const date = new Date(dateString);
	return new Date(date.toUTCString()).toISOString();
}

const expectedAllAttendances = [
	{ attendanceId: 1, attendedAt: '2022-06-06T13:14:00.000Z', userId: 1, lectureId: 5 },
	{ attendanceId: 2, attendedAt: '2022-06-06T13:14:00.000Z', userId: 1, lectureId: 6 },
	{ attendanceId: 3, attendedAt: '2022-06-06T13:14:00.000Z', userId: 1, lectureId: 7 },
	{ attendanceId: 4, attendedAt: '2022-06-06T13:14:00.000Z', userId: 1, lectureId: 8 },
	{ attendanceId: 5, attendedAt: '2022-06-06T13:14:00.000Z', userId: 1, lectureId: 9 },
	{ attendanceId: 6, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 5 },
	{ attendanceId: 7, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 6 },
	{ attendanceId: 8, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 7 },
	{ attendanceId: 9, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 8 },
	{ attendanceId: 10, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 5 },
	{ attendanceId: 11, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 5 },
	{ attendanceId: 12, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 6 },
	{ attendanceId: 13, attendedAt: '2022-06-06T13:14:00.000Z', userId: 2, lectureId: 7 }
];