import { Request, Response, NextFunction, RequestHandler } from "express";
import { CustomizedRequest } from "./express-scope";

export type Handler = (
  req: Request | CustomizedRequest,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

export type Route = {
  path: string;
  method: string;
  handler:
    | Handler
    | Handler[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | (RequestHandler<any> | RequestHandler<any>[])[];
};
