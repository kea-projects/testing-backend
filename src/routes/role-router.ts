import express from "express";
import { Role } from "../models/roles";
import { responseHandler } from "../utils/response-handler";
import { GenericRoleService } from "../utils/generic-service-initializer";
import { teacherGuard } from "../authentication/user-authentication";

const router = express.Router();

router.use(teacherGuard);

router.get("/", async (_req, res) => {
  const response = await GenericRoleService.findAll();
  responseHandler("Roles", response, res);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericRoleService.findByPk(id);
  responseHandler("Role", response, res);
});

router.post("/", async (req, res) => {
  const requestObject = filterBody(req.body);
  const newRole = Role.build(requestObject);

  const response = await GenericRoleService.save(newRole);
  responseHandler("Role", response, res);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const requestObject = filterBody(req.body);

  const response = await GenericRoleService.update(id, requestObject);
  responseHandler("Role", response, res);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await GenericRoleService.delete(id);
  responseHandler("Role", response, res);
});

/**
 *
 * @param body Request body
 * @returns Object containing all needed user attributes
 */
const filterBody = (body: { name: any }) => {
  const { name } = body;
  return { name };
};

export { router as RoleRouter };
