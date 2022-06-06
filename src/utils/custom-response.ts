import { StatusCode } from "./status-code";

export interface CustomResponse<T> {
  model?: T;
  statusCode: StatusCode;
}
