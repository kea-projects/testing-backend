import { Response } from "express";
import { Attendance } from "../models/attendances";
import { Lecture } from "../models/lectures";
import { CustomResponse } from "../utils/custom-response";
import { GenericAttendanceService } from "../utils/generic-service-initializer";
import { responseHandler } from "../utils/response-handler";
import { StatusCode as sc, StatusCode } from "../utils/status-code";
import { ModelService } from "./model-service";

const LectureService = new ModelService(Lecture);
class ClassCodeService {
  static validCodes = new Map<number, string>();
  static CODE_LENGTH: number = 8;

  static async generateCode(lectureId: string) {
    const lectureNumber = Number.parseInt(lectureId) || 0;
		
		const response = await LectureService.findByPk(lectureId);
		if(response.statusCode === sc.Success){
			const randomCode = createCode();
			ClassCodeService.validCodes.set(lectureNumber, randomCode);
	
			console.log("Valid codes are: ", ClassCodeService.validCodes);
	
			return randomCode;
		} else {
			return "invalid lecture id";
		}
  }

  static deleteCode(lectureId: string) {
    const lectureNumber = Number.parseInt(lectureId) || 0;
		console.log("Delete code was called! For lectureId: ", lectureId);
    if (lectureNumber) {
      const status = ClassCodeService.validCodes.delete(lectureNumber);

      //console.log("Valid codes are: ", ClassCodeService.validCodes);

      return status;
    } else {
      return false;
    }
  }

  static validateCode(code: string): CustomResponse<StatusCode, number> {
    let lectureId = 0;

    ClassCodeService.validCodes.forEach((value, key) => {
      if (value === code) {
        lectureId = key;
      }
    });

    if (lectureId > 0) {
      return { statusCode: sc.Success, model: lectureId };
    } else {
      return { statusCode: sc.NotFound, model: lectureId };
    }
  }

  static async markAttendance(
    status: CustomResponse<StatusCode, number>,
    userId: string,
    res: Response
  ) {
    switch (status.statusCode) {
      case StatusCode.Success:
        const lectureId = status.model;
        const attendance = Attendance.build({ lectureId, userId });
        const result = await GenericAttendanceService.save(attendance);
        return responseHandler("Attendance", result, res);
      case StatusCode.NotFound:
        return res.status(410).send({ status: 410, message: "Code is no longer available." });
    }
  }
}

const createCode = (): string => {
  const min = 65; // char id: A
  const max = 90; // char id: Z
  let randomString = "";

  for (let i = 0; i < ClassCodeService.CODE_LENGTH; i++) {
    const randomLetter = String.fromCharCode(randomNumber(min, max));
    randomString += randomLetter;
  }
  return randomString;
};

const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export { ClassCodeService };

