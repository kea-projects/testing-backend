import Express from "express";
import { teacherGuard } from "../authentication/user-authentication";
import { ClassCodeService } from "../services/class-code-service";

const router = Express.Router();

router.get("/attend/:code", async (req, res) => {
  const { code } = req.params;
  const userId = req.user!.userId;

  const status = ClassCodeService.validateCode(code);

  ClassCodeService.markAttendance(status, userId, res);
});

router.use(teacherGuard);

router.get("/:lectureId", async (req, res) => {
  const { lectureId } = req.params;

  const code = await ClassCodeService.generateCode(lectureId);

  res.send({ code });
});

router.delete("/:lectureId", (req, res) => {
  const { lectureId } = req.params;

  const success = ClassCodeService.deleteCode(lectureId);

  if (success) {
    res.status(200).send({ status: 200, message: "Deleted." });
  } else {
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

export { router as ClassCodeRouter };
