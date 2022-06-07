import { StatusCode } from "./status-code";

export interface CustomResponse<StatusCode, T> {
  model?: T;
  statusCode: StatusCode;
}
