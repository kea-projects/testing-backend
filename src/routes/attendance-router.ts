import express from "express";
import { Attendance } from "../models/attendances";
import { responseHandler } from "../utils/response-handler";
import { GenericAttendanceService } from "../utils/generic-service-initializer";
import { teacherGuard } from "../authentication/user-authentication";

const router = express.Router();

// TODO - StudentSelfGuard here

// TODO - GET "/by-student/:studentId"

router.use(teacherGuard);

router.get("/", async (_req, res) => {
  const response = await GenericAttendanceService.findAll();
  responseHandler("Attendance", response, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericAttendanceService.findByPk(id);
  responseHandler("Attendance", response, res);
});

router.post("/", async (req, res) => {
  const requestObject = filterBody(req.body);
  const newAttendance = Attendance.build(requestObject);

  const response = await GenericAttendanceService.save(newAttendance);
  responseHandler("Attendance", response, res);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const requestObject = filterBody(req.body);

  const response = await GenericAttendanceService.update(id, requestObject);
  responseHandler("Attendance", response, res);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericAttendanceService.delete(id);
  responseHandler("Attendance", response, res);
});

/**
 *
 * @param body Request body
 * @returns Object containing all needed Attendance attributes
 */
const filterBody = (body: { userId: any; lectureId: any; attendedAt: any }) => {
  const { userId, lectureId, attendedAt } = body;
  return { userId, lectureId, attendedAt };
};

export { router as AttendanceRouter };
