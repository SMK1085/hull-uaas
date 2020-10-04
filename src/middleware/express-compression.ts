import { Router } from "express";
import compression from "compression";

export const enableCompression = (router: Router): Router => {
  return router.use(compression());
};
