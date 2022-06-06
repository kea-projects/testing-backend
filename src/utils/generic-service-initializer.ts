import { ModelService } from "../services/model-service";
import { Attendance } from "../models/attendances";
import { User } from "../models/users";
import { Role } from "../models/roles";
import { Class } from "../models/classes";
import { Lecture } from "../models/lectures";
import { Subject } from "../models/subjects";

export const GenericAttendanceService = new ModelService(Attendance);
export const GenericUserService = new ModelService(User);
export const GenericRoleService = new ModelService(Role);
export const GenericClassService = new ModelService(Class);
export const GenericLectureService = new ModelService(Lecture);
export const GenericSubjectService = new ModelService(Subject);
