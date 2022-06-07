import express from "express";
import { teacherGuard } from "../authentication/user-authentication";
import { Lecture } from "../models/lectures";
import { ModelService } from "../services/model-service";
import { responseHandler } from "../utils/response-handler";

const router = express.Router();
const LectureService = new ModelService(Lecture);

// TODO - StudentSelfGuard here

// TODO - GET "/by-student/:studentId"

router.use(teacherGuard);

router.get("/", async (_req, res) => {
  const response = await LectureService.findAll();
  responseHandler("Lectures", response, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await LectureService.findByPk(id);
  responseHandler("Lecture", response, res);
});

// TODO - GET "/by-teacher/:teacherId"

router.post("/", async (req, res) => {
  if (!req.body.name) {
    req.body.name = `lecture_${req.body.subjectId}`;
  }
  const requestObject = filterBody(req.body);

  const newLecture = Lecture.build(requestObject);

  const response = await LectureService.save(newLecture);
  responseHandler("Lecture", response, res);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const requestObject = filterBody(req.body);

  const response = await LectureService.update(id, requestObject);
  responseHandler("Lecture", response, res);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await LectureService.delete(id);
  responseHandler("Lecture", response, res);
});

/**
 *
 * @param body Request body
 * @returns Object containing all needed user attributes
 */
const filterBody = (body: {
  name: any;
  startedAt: any;
  endedAt: any;
  subjectId: any;
}) => {
  const { name, endedAt, startedAt, subjectId } = body;
  return { name, endedAt, startedAt, subjectId };
};

export { router as LectureRouter };
