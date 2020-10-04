import { AwilixContainer } from "awilix";
import { Request, Response } from "express";
import { CustomizedRequest } from "../../definitions/express/express-scope";
import { HullClient } from "./hull-client";

export const handleStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const statusResult = {
    status: "ok",
    messages: [] as string[],
  };

  const scopedContainer = (req as CustomizedRequest).scope as AwilixContainer;
  const hullClient = scopedContainer.resolve<HullClient>("hullClient");

  await hullClient.updateStatus(statusResult);
  res.json(statusResult);
};
