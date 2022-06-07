import express from "express";
import { responseHandler } from "../utils/response-handler";
import { Lecture } from "../models/lectures";
import { ModelService } from "../services/model-service";
import { ClassCodeService } from "../services/class-code-service";

const LectureService = new ModelService(Lecture);

const router = express.Router();

/**
 * 
 * Performance router is a test route only meant for performance testing.
 * It does not replicate the systems behavior with 100% accuracy, but comes close.
 * 
 * Additional routes for getting in memory information and to delete it:
 * - performance/log-info
 * - performance/delete
 * 
 * */

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let lectureThreadCount = 0;
let attendanceThreadCount = 0;
let generatedCodes: any = [];

/**
 * Get information about the test run.
 * - variables are set to count how many times teacher-generate and student-attend are called, along with the codes generated array.
 * Valid codes in class code service are printed in console after the call.
 */
router.get("/log-info", async (req, res) => {
	console.log("Valid codes in classcode service: ", ClassCodeService.validCodes);
	res.send({msg: "Classcode valid codes in server console.", lectureThreads: lectureThreadCount, attenanceThreads: attendanceThreadCount, generatedCodesArrayLength: generatedCodes.length});
})

/**
 * Create a lecture with format lecture_subjectId_counter
 * Then generate a valid code, save in map with lectureId and send it back to the teacher.
 */
let counter = 0;
router.post("/teacher-generate", async (req, res) => {
	counter++;
  if (!req.body.name) {
    req.body.name = `lecture_${req.body.subjectId}_${counter}`;
  }
  const requestObject = filterBody(req.body);

  const newLecture = Lecture.build(requestObject);

  const response = await LectureService.save(newLecture);
	// Increment the number of times this is called for thread count checking
	lectureThreadCount++;
	// Lecture created successfully.
	if(response.statusCode === 201){
		const lecture: any = response.model!
		const code = await ClassCodeService.generateCode(lecture.lectureId);
		generatedCodes.push(code);
		res.status(201).send({ code }); // Successfully created lecture and sending the code.
	} else {
		responseHandler("Lecture", response, res);
	}
});

/**
 * Get a valid code from the generated codes array.
 * Mark attendance for test user.
 */
router.post("/student-attend", async (req, res) => {
	const validCode = generatedCodes[randomIntFromInterval(0, generatedCodes.length-1)];
	//____ NOTE: Single performance test useer.____
	const userId: string = '8'; 
	const status = ClassCodeService.validateCode(validCode);
	attendanceThreadCount++;
	ClassCodeService.markAttendance(status, userId, res);
})

// Deletes all in memory variables that were generated during the test.
// 		In order to reset the database, you have to stop and start the docker containers.
router.delete("/delete", async (req, res) => {
	let deletedCount = 0;
	let lectureIdsNotFoundCount = 0;
	await generatedCodes.forEach(async (element: any) => {
		let lectureId = 0;
		
		ClassCodeService.validCodes.forEach((value, key) => {
      if (value === element) {
        lectureId = key;
      }
    });

		if(lectureId > 0){
			const deletedCode = await ClassCodeService.deleteCode(lectureId.toString());
			deletedCount++;
		} else {
			lectureIdsNotFoundCount++;
		}
	});

	generatedCodes = [];
	lectureThreadCount = 0;
	attendanceThreadCount = 0;
	
	return res
		.status(200)
		.send("Deleted all codes");
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

export { router as PerformanceRouter };
