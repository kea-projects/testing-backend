
import request from "supertest";
import express, { json, response } from "express";
import passport from "passport";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import { STUDENT_ROLE_ID, TEACHER_ROLE_ID } from "../../src/config/constants";
import { ClassCodeRouter } from "../../src/routes/class-code-router";
import { Express } from "express-serve-static-core";
import "dotenv/config"

/**
 * Class code router behaviour
 * 	- Student access:
 * 		-> /attend/:code, creates attendance if code is valid.
 * 	- Teacher access:
 * 		-> GET /:lectureId, generates code for a lectureId and saves the two as key value pairs in a map.
 * 		-> DELETE /:lectureId, deletes the pair from the map
 */

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE } = process.env;
console.error(DB_USERNAME, DB_PASSWORD, DB_HOST);

describe("test class code router", () => {

	// __________________________ TEACHER TESTS __________________________
	describe("test class-code router teacher", () => {
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
					email: "email@kea.dk",
					name: "teacher name",
					roleId: TEACHER_ROLE_ID,
					userId: "1",
				};
				next();
			});
			app.use(ClassCodeRouter);
		});

		describe("get /:lectureId", () => {
			test("checks generate code for lectureId to be of the correct length", async () => {
				const response = await request(app)
					.get("/7").send();
				expect(response.body.code).toHaveLength(8);
			});
			test("checks response for invalid lectureId", async () => {
				const response = await request(app)
					.get("/50").send();
				expect(response.body.code).toBe("invalid lecture id");
			});
			test("checks response for invalid lectureId format", async () => {
				const response = await request(app)
					.get("/notId").send();
				expect(response.body.code).toBe("invalid lecture id");
			});
  	});

		describe("delete /:lectureId", () => {
			test("checks deleting code for valid lectureId", async () => {
				const response = await request(app)
					.delete("/7").send();
				expect(response.statusCode).toBe(200);
				expect(response.body).toStrictEqual({ status: 200, message: 'Deleted.' });
			});
			test("cehcks delete code with a lectureId that doesn't exist", async () => {
				const response = await request(app)
					.delete("/100").send();
				expect(response.statusCode).toBe(500);
				expect(response.body).toStrictEqual({ status: 500, message: "Internal Server Error" });
			});
			test("checks delete code with invalid lectureId format", async () => {
				const response = await request(app)
					.delete("/notId").send();
				expect(response.statusCode).toBe(500);
				expect(response.body).toStrictEqual({ status: 500, message: "Internal Server Error" });
			})
		})

		afterAll(() => {
			sequelize.close();
		});
	})

	// __________________________ STUDENT TESTS __________________________
	describe("test class-code router student", () => {
		let app: Express;
		let sequelize: Sequelize;
		let validCode = 0;
		let roleId = TEACHER_ROLE_ID;
		let userId = "1";
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
					email: "email@stud.kea.dk",
					name: "student name",
					roleId: roleId,
					userId: userId,
				};
				next();
			});
			app.use(ClassCodeRouter);
		});

		describe("get /attend/:code", () => {

			test("test to mark attendance with valid code", async () => {
				// First need to generate a new code as a teacher
				const codeResponse = await request(app)
					.get("/7").send();
				console.log("code response in before all ", codeResponse.body);
				validCode = codeResponse.body.code;
				// Change roleId to be a student with student userId
				roleId = STUDENT_ROLE_ID;
				userId = "6";
				
				const attendanceResponse = await request(app)
					.get(`/attend/${validCode}`);
				expect(response.statusCode).toBe(200);
				expect(attendanceResponse.body).toStrictEqual({
					attendanceId: 14, 
					attendedAt: {"args": [], "fn": "NOW",},
					userId: "6", 
					lectureId: 7
				});
			});
			test("test to mark attendance with invalid code", async () => {
				const response = await request(app)
					.get("/attend/notvalid").send();
				expect(response.statusCode).toBe(410);
				expect(response.body).toStrictEqual({ status: 410, message: "Code is no longer available." });
			});
		});

		afterAll(() => {
			sequelize.close();
		});
	})
});

