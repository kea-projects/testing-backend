import { responseHandler } from "../../src/utils/response-handler";
import { StatusCode } from "../../src/utils/status-code";

// -------------------------------- Test Cases --------------------------------
const message = "Values";

const statusAndResponses = [
  { statusCode: StatusCode.Success, model: "Success Test!" },
  { statusCode: StatusCode.Created, model: "Created Test!" },
  { statusCode: StatusCode.NotFound, model: { error: 404, message: `${message} not found.` }},
  { statusCode: StatusCode.ServerError, model: { error: 500, message: "Internal server error" }},
];

const statusAndNoResponse = [
  { statusCode: StatusCode.Success },
  { statusCode: StatusCode.Created },
  { statusCode: StatusCode.NoContent }
];

const statusWithBodyNoResponse = [
  { statusCode: StatusCode.NoContent, model: "this is not used!" },
  { statusCode: StatusCode.NotFound, model: "this is not used!" },
  { statusCode: StatusCode.ServerError , model: "this is not used!"}
];


// ---------------------------------- Set-up ----------------------------------

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// ---------------------------------- Tests -----------------------------------

describe("checks responses with messages", () => {
  test.each(statusAndResponses)( "when the StatusCode is '%s'", async ({ statusCode, model }) => {
      // Arrange
      const res = mockResponse();
      const customResult = { statusCode, model };
      const text = message;

      // Act
      responseHandler(text, customResult, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith(model);
      expect(res.status).toHaveBeenCalledWith(statusCode);
    }
  );
});

describe("checks responses without messages", () => {
  test.each(statusAndNoResponse)("when the StatusCode is '%s'", async ({ statusCode }) => {
      // Arrange
      const res = mockResponse();
      const customResult = { statusCode};
      const text = message;

      // Act
      responseHandler(text, customResult, res);

      // Assert
      expect(res.send).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCode);
    }
  );
});

test("checks that model is correctly ignored", () => {
   // Arrange
  const res = mockResponse();
  const { statusCode, model} = statusWithBodyNoResponse[0];
  const customResult = { statusCode, model};
  const text = message;

  // Act
  responseHandler(text, customResult, res);

  // Assert
  expect(res.send).toHaveBeenCalledWith();
  expect(res.status).toHaveBeenCalledWith(statusCode);
})

test("checks that model is correctly ignored", () => {
   // Arrange
  const res = mockResponse();
  const { statusCode, model} = statusWithBodyNoResponse[1];
  const customResult = { statusCode, model};
  const correctResponse = { error: 404, message: `${message} not found.` };
  const text = message;

  // Act
  responseHandler(text, customResult, res);

  // Assert
  expect(res.send).toHaveBeenCalledWith(correctResponse);
  expect(res.status).toHaveBeenCalledWith(statusCode);
})

test("checks that model is correctly ignored", () => {
   // Arrange
  const res = mockResponse();
  const { statusCode, model} = statusWithBodyNoResponse[2];
  const customResult = { statusCode, model};
  const correctResponse = { error: 500, message: "Internal server error" };
  const text = message;

  // Act
  responseHandler(text, customResult, res);

  // Assert
  expect(res.send).toHaveBeenCalledWith(correctResponse);
  expect(res.status).toHaveBeenCalledWith(statusCode);
})
