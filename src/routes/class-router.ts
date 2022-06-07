import express from "express";
import { teacherGuard } from "../authentication/user-authentication";
import { Class } from "../models/classes";
import { GenericClassService } from "../utils/generic-service-initializer";
import { responseHandler } from "../utils/response-handler";

const router = express.Router();

router.use(teacherGuard);

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericClassService.findByPk(id);
  responseHandler("Class", response, res);
});

router.get("/", async (_req, res) => {
  const response = await GenericClassService.findAll();
  responseHandler("Classes", response, res);
});

// TODO - GET "/by-teacher/:teacherId"

router.post("/", async (req, res) => {
  const requestObject = filterBody(req.body);
  const newClass = Class.build(requestObject);

  const response = await GenericClassService.save(newClass);
  responseHandler("Class", response, res);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const requestObject = filterBody(req.body);

  const response = await GenericClassService.update(id, requestObject);
  responseHandler("Class", response, res);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericClassService.delete(id);
  responseHandler("Class", response, res);
});

/**
 *
 * @param body Request body
 * @returns Object containing all needed class attributes
 */
const filterBody = (body: { name: any }) => {
  const { name } = body;
  return { name };
};

export { router as ClassRouter };
