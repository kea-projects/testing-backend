import { Response } from "express";
import { CustomResponse } from "./custom-response";
import { StatusCode } from "./status-code";

export const responseHandler = async (
  name: string,
  response: CustomResponse<any>,
  res: Response
) => {
  switch (response.statusCode) {
    case StatusCode.Success:
      return res.status(200).send(response.model);
    case StatusCode.Created:
      return res.status(201).send(response.model);
    case StatusCode.NoContent:
      return res.status(202).send();
    case StatusCode.NotFound:
      return res
        .status(404)
        .send({ error: 404, message: `${name} not found.` });
    case StatusCode.ServerError:
      return res
        .status(500)
        .send({ error: 500, message: `Internal server error` });
  }
};
