
import request from "supertest";
import express, { json, Router } from "express";
import passport from "passport";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import { STUDENT_ROLE_ID, TEACHER_ROLE_ID } from "../../src/config/constants";
import { AttendanceRouter } from "../../src/routes/attendance-router";
import { Express } from "express-serve-static-core";
import "dotenv/config"
import { isAuthenticated, teacherGuard } from "../../src/authentication/user-authentication";
//import { isAuthenticated } from "../../src/authentication/user-authentication";

/**
 * Testing user authentication:
 * - Test that when sending request without any authentication.
 * - Test that when sending requests as an authenticated student or teacher, can access isAuthenticated routes
 * - Test that when sending a request as a student, routes that are teacher guarded can not be accessed.
 * - Test that when sending a request as a teacher, routes that are teacher guarded can be accessed.
 */

// ---------------------------------- Set-up ----------------------------------
const mockAuthenticationRoutes = Router();
mockAuthenticationRoutes.get("/isAuthenticated", isAuthenticated, async (req, res) => {
	res.status(200).send({msg: "Authenticated"});
});

mockAuthenticationRoutes.get("/teacherGuarded", teacherGuard, async (req, res) => {
	res.status(200).send({msg: "Teacher Authenticated"});
});

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE } = process.env;

// ---------------------------------- Tests ----------------------------------
describe("test user authentication", () => {
	let app: Express;
	let sequelize: Sequelize;

	// -------------------- Mock Authentication Variables --------------------
	let mockTeacher = {
		email: "email@kea.dk",
		name: "teacher name",
		roleId: TEACHER_ROLE_ID,
		userId: "1",
	}
	let mockStudent = {
		email: "email@stud.kea.dk",
		name: "student name",
		roleId: STUDENT_ROLE_ID,
		userId: "6",
	}
	let mockUnauthorizedUser = {
		email: "unauthorized@unauthorized.dk",
		name: "unauthorized name",
		roleId: "0",
		userId: "0",
	}

	let mockIsAuthenticated = false;
	let mockUser = mockUnauthorizedUser;

	// -------------------- Mock App SetUp --------------------
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
			req.isAuthenticated = () => mockIsAuthenticated;
			req.user = mockUser;
			next();
		});
		app.use(mockAuthenticationRoutes);
	});

	// -------------------- Authentication Tests --------------------

	describe("test isAuthenticated", () => {
		test("test isAuthenticated as unauthenticated user", async () => {
			const response = await request(app)
				.get("/isAuthenticated").send();
			expect(response.statusCode).toBe(403);
			expect(response.body).toStrictEqual({ error: 403, message: "Not authorized" });
		});
		test("test isAuthenticated as student", async () => {
			mockUser = mockStudent;
			mockIsAuthenticated = true;
			const response = await request(app)
				.get("/isAuthenticated").send();
			expect(response.statusCode).toBe(200);
			expect(response.body).toStrictEqual({msg: "Authenticated"});
		});
		test("test isAuthenticated as Teacher", async () => {
			mockUser = mockTeacher;
			mockIsAuthenticated = true;
			const response = await request(app)
				.get("/isAuthenticated").send();
			expect(response.statusCode).toBe(200);
			expect(response.body).toStrictEqual({msg: "Authenticated"});
		});
	});

	describe("test teacherGuard", () => {
		test("test teacherGuard as unauthenticated user", async () => {
			mockIsAuthenticated = false;
			mockUser = mockUnauthorizedUser;
			const response = await request(app)
				.get("/teacherGuarded").send();
			expect(response.statusCode).toBe(403);
			expect(response.body).toStrictEqual({ status: 403, message: "Not authorized" });
		});
		test("test teacherGuard as student", async () => {
			mockIsAuthenticated = true;
			mockUser = mockStudent;
			const response = await request(app)
				.get("/teacherGuarded").send();
			expect(response.statusCode).toBe(403);
			expect(response.body).toStrictEqual({ status: 403, message: "Not authorized" });
		});
		test("test teacherGuard as Teacher", async () => {
			mockIsAuthenticated = true;
			mockUser = mockTeacher;
			const response = await request(app)
				.get("/teacherGuarded").send();
			expect(response.statusCode).toBe(200);
			expect(response.body).toStrictEqual({msg: "Teacher Authenticated"});
		});
	});

	afterAll(() => {
    sequelize.close();
  });
});
