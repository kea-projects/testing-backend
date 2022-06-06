// Import the express in typescript file
import express, { json } from "express";
import "dotenv/config";
import { sequelize } from "./config/mysql";
import { loadDB } from "./utils/model-loader";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { passportSetup } from "./config/passport-setup";
import { AuthenticationRouter } from "./routes/authentication-router";
import { sessionConfig } from "./config/constants";

import { UserRouter } from "./routes/user-router";
import { SubjectRouter } from "./routes/subject-router";
import { RoleRouter } from "./routes/role-router";
import { LectureRouter } from "./routes/lecture-router";
import { ClassCodeRouter } from "./routes/class-code-router";
import { AttendanceRouter } from "./routes/attendance-router";
import { ClassRouter } from "./routes/class-router";
import { isAuthenticated } from "./authentication/user-authentication";

const port = process.env.PORT || 4200;
const frontendHost = process.env.FRONTEND_APP || "localhost:3000";

// Initialize the express engine
const app: express.Application = express();
app.use(
  cors({
    origin: frontendHost,
    credentials: true,
  })
);
app.use(json());
loadDB(sequelize);

// Always use a helmet (Security reasons: https://expressjs.com/en/advanced/best-practice-security.html)
app.use(helmet());
app.use(session(sessionConfig));

// ________________________________ PASSPORT CONFIG ________________________________
// Don't change the order of the passport config calls
app.use(passport.initialize());
app.use(passport.session());
passportSetup.microsoftStrategySetup();
passportSetup.serialization();
// __________________________________________________________________________________

// Handling '/' Request
app.get("/", async (_req, res) => {
  res.send({ message: "Live and running typescript, baby" });
});

// Routes

app.use("/auth", AuthenticationRouter);
app.use(isAuthenticated);

// Mixed Guards
app.use("/subjects", SubjectRouter);
app.use("/users", UserRouter);
app.use("/lectures", LectureRouter);
app.use("/attendances", AttendanceRouter);
app.use("/class-codes", ClassCodeRouter);

// Teacher guard only
app.use("/classes", ClassRouter);
app.use("/roles", RoleRouter); // Meant to be used by admins, for now, teachers have access.

app.all("*", (_req, res) => {
  res.send({ error: 404, message: "not found" });
});

// Server setup
app.listen(port, () => {
  console.log(`TypeScript with Express \n\t running on port: ${port}`);
});
