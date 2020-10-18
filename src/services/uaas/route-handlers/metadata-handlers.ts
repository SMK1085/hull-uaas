import { Request, Response } from "express";
import { hull_connector_v1 } from "../../../definitions/hull/hull-connector-v1";
import { NORMALIZATION_AVAILABLEMETHODS } from "../../../config/meta-normalization";

export const handleAvilableNormalizationMethods = (
  req: Request,
  res: Response,
): void => {
  const response: hull_connector_v1.Schema$OptionsResponse = {
    ok: true,
    error: null,
    options: NORMALIZATION_AVAILABLEMETHODS,
  };
  res.json(response);
};
