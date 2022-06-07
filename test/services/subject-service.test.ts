import { Attendance } from "../../src/models/attendances";
import { SubjectService } from "../../src/services/subject-service";
import { StatusCode } from "../../src/utils/status-code";


// Expect this status if an error is thrown
const responseListAndMessage = [
  [StatusCode.Success, [1,2,3]],
  [StatusCode.NotFound, []],
]

// Expect this status if an error is thrown
const responseListErr = [
  [StatusCode.ServerError],
]

const mockModel = (data?: any) => {
  const service: any = {};
  service.findAll = jest.fn().mockReturnValue(data);
  return service;
};

const mockModelErr = () => {
  const service: any = {};
  service.findAll = jest.fn(() => {throw Error("something wrong")});
  return service;
};



describe("checks findAll with mocked values", () => {
  test.each(responseListAndMessage)("responses with %s no errors", async (status, message) => {
    // Arrange
    const mockService = new SubjectService(mockModel(message));
    // Act
    const response = await mockService.findByTeacherId("1");

    // Assert
    expect(response.statusCode).toBe(status);
  });

  test.each(responseListErr)("sample, do not crash", async (status) => {
    // Arrange
    const mockService = new SubjectService(mockModelErr());
    // Act
    const response = await mockService.findByTeacherId("1");

    // Assert
    expect(response.statusCode).toBe(status);

  })
})
