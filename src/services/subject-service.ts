import { CustomResponse } from "../utils/custom-response";
import { StatusCode as sc, StatusCode } from "../utils/status-code";

class SubjectService<T> {

    constructor(protected subjectModel: any) {}

    async findByTeacherId(teacherId: string): Promise<CustomResponse<StatusCode, T>> {
        try {
            const foundSubjects = await this.subjectModel.findAll({
                where: {
                    teacherUserId: teacherId
                },
            });
            if (foundSubjects.length === 0) {
                return { statusCode: sc.NotFound };
            }
            return { statusCode: sc.Success, model: foundSubjects };
        } catch (error) {
            console.error(error);
            return { statusCode: sc.ServerError };
        }
    }
}

export { SubjectService };
