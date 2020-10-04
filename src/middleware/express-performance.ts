import { Router, Request, Response, NextFunction } from "express";
import { CustomizedRequest } from "../definitions/express/express-scope";
import { AwilixContainer } from "awilix";
import { Logger } from "winston";

const getDurationInMilliseconds = (start: [number, number]): number => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export const handlePerformanceLogging = (router: Router): void => {
  router.use((req: Request, res: Response, next: NextFunction): void => {
    const start = process.hrtime();
    const correlationid = ((req as CustomizedRequest)
      .scope as AwilixContainer).resolve<string>("correlationKey");

    const logger = ((req as CustomizedRequest)
      .scope as AwilixContainer).resolve<Logger>("logger");

    logger.debug({
      message: `Start ${req.method} request: ${req.originalUrl} (Correlation ID: ${correlationid})`,
      meta: {
        component: "server.handler",
        method: "start",
      },
      correlationId: correlationid,
      start,
    });

    res.on("finish", () => {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      logger.debug({
        message: `Finished ${req.method} request: ${
          req.originalUrl
        } (Correlation ID: ${correlationid}; Duration ${durationInMilliseconds.toLocaleString()} ms)`,
        meta: {
          component: "server.handler",
          method: "finish",
        },
        correlationId: correlationid,
        start,
        duration: durationInMilliseconds,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      });
    });

    res.on("close", () => {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      logger.debug({
        message: `Closed ${req.method} request: ${
          req.originalUrl
        } (Correlation ID: ${correlationid}; Duration ${durationInMilliseconds.toLocaleString()} ms)`,
        meta: {
          component: "server.handler",
          method: "close",
        },
        correlationId: correlationid,
        start,
        duration: durationInMilliseconds,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      });
    });

    next();
  });
};
