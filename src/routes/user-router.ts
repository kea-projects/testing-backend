import express from "express";
import { User } from "../models/users";
import { responseHandler } from "../utils/response-handler";
import { GenericUserService } from "../utils/generic-service-initializer";
import { teacherGuard } from "../authentication/user-authentication";

const router = express.Router();

// TODO - StudentSelfGuard here

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericUserService.findByPk(id);
  responseHandler("User", response, res);
});

router.use(teacherGuard);

router.get("/", async (_req, res) => {
  const response = await GenericUserService.findAll();
  responseHandler("Users", response, res);
});

router.post("/", async (req, res) => {
  const requestObject = filterBody(req.body);
  const newUser = User.build(requestObject);

  const response = await GenericUserService.save(newUser);
  responseHandler("User", response, res);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const requestObject = filterBody(req.body);

  const response = await GenericUserService.update(id, requestObject);
  responseHandler("User", response, res);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericUserService.delete(id);
  responseHandler("User", response, res);
});

/**
 *
 * @param body Request body
 * @returns Object containing all needed user attributes
 */
const filterBody = (body: {
  name: any;
  email: any;
  password: any;
  roleId: any;
}) => {
  const { name, email, password, roleId } = body;
  return { name, email, password, roleId };
};

export { router as UserRouter };
