import "dotenv/config";
import { Express } from "express-serve-static-core";
import { Sequelize } from "sequelize";
import { loadDB } from "../../src/utils/model-loader";
import express, { json } from "express";
import passport from "passport";
import { TEACHER_ROLE_ID } from "../../src/config/constants";
import request from "supertest";
import { RoleRouter } from "../../src/routes/role-router";

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE } = process.env;

describe("test role router", () => {
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
    app.use(RoleRouter);
  });
  describe("role router", () => {
    test(" get /", async () => {
      const response = await request(app).get("/");
      expect(response.body).toStrictEqual([{"name": "student", "roleId": 2}, {"name": "teacher", "roleId": 1}]);
    });
    test("get /roleId", async ()=> {
      const response = await request(app).get("/1");
      expect(response.body).toStrictEqual({"name": "teacher", "roleId": 1});
    })
    test("get /roleId failed with id that not exist", async ()=> {
      const response = await request(app).get("/20");
      expect(response.status).toBe(404)
      expect(response.body.message).toStrictEqual("Role not found.");
    })
    test("get /roleId failed with id that not in the right form", async ()=> {
      const response = await request(app).get("/failedid");
      expect(response.status).toBe(404)
      expect(response.body.message).toStrictEqual("Role not found.");
    })
  });

  afterAll(() => {
    sequelize.close();
  });
});