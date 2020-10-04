import { Request } from "express";
import { AwilixContainer } from "awilix";

export interface CustomizedRequest extends Request {
  container: AwilixContainer;
  scope?: AwilixContainer;
}
