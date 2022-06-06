import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../authentication/user-authentication";
import { Role } from "../models/roles";
import { GenericRoleService } from "../utils/generic-service-initializer";
import { StatusCode } from "../utils/status-code";
import { CustomResponse } from "../utils/custom-response";

const router = Router();
// ------------------------------------------------
// Routing for: /auth/...
// ------------------------------------------------

// Authentication/Authorization route for microsoft (Our users don't navigate to this endpoint)
router.get(
  "/microsoft",
  passport.authenticate("microsoft", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/login/failed", (_req, res) => {
  res.statusCode = 403;
  res.send({ error: "Forbidden" });
});

router.get("/login/success", async (req, res) => {
  const roleId = req.user?.roleId;
  const roleResponse = (await GenericRoleService.findByPk(roleId!)) as CustomResponse<Role>;
  if (roleResponse.statusCode === StatusCode.Success) {
    const userResponse = {
      userId: req.user!.userId,
      name: req.user!.name,
      email: req.user!.email,
      roleName: roleResponse.model!.name,
    };
    const searchParams = new URLSearchParams(userResponse).toString();
    res.redirect(
      `${process.env.FRONTEND_APP}/login/success/?statuscode=${StatusCode.Success}&${searchParams}`
    );
    return
  }
  res.redirect(
    `${process.env.FRONTEND_APP}/login/failed/?statuscode=${StatusCode.NotFound}`
  );
});

// login/microsoft
router.get("/login/microsoft", passport.authenticate("microsoft"));

// logout - needs to be logged, otherwise redirected to login page
router.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.status(202).send({ status: 202, message: "No content" });
});

export { router as AuthenticationRouter };
