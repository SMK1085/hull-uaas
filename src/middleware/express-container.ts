import { Response, NextFunction, Router, Request } from "express";
import { CustomizedRequest } from "../definitions/express/express-scope";
import { createContainer, asValue, asClass } from "awilix";
import { ClientOpts } from "redis";
import { ConnectorRedisClient } from "../utils/redis-client";
import { LoggerOptions, format, transports, createLogger } from "winston";
import LogzioWinstonTransport from "winston-logzio";
import packageInfo from "../../package.json";
import { isNil } from "lodash";

export const initializeContainer = (router: Router): void => {
  router.use((req: Request, _res: Response, next: NextFunction) => {
    // create a container
    const container = createContainer();

    const redisClientOpts: ClientOpts = {
      url: process.env.REDIS_URL,
    };

    // Instantiate the global logger
    const loggerOptions: LoggerOptions = {
      level: process.env.LOG_LEVEL || "error",
      format: format.combine(format.simple()),
      defaultMeta: {
        service: process.env.LOG_SERVICENAME || "hull-uaas",
        environment: process.env.NODE_ENV || "development",
      },
    };
    // Add console as transport since we don't use a dedicated transport
    // but rely on the OS to ship logs
    loggerOptions.transports = [];

    if (process.env.NODE_ENV === "development") {
      loggerOptions.transports.push(
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true }),
            format.timestamp(),
            format.align(),
            format.printf((info) => {
              const { timestamp, level, message, ...args } = info;
              const { meta } = info;
              let metaStructured = "";

              if (meta) {
                metaStructured = `${meta.component}#${meta.method}`;
                delete args.meta;
              }

              let appInfo = "";

              if (args.service) {
                appInfo = args.service;
                delete args.service;
              }

              return `[${appInfo}]  ${timestamp} | ${level} | ${metaStructured} |${message} ${
                Object.keys(args).length > 0
                  ? JSON.stringify(args, null, 2)
                  : ""
              }`;
            }),
          ),
        }),
      );
    }

    if (!isNil(process.env.LOGZIO_TOKEN)) {
      loggerOptions.transports.push(
        new LogzioWinstonTransport({
          token: process.env.LOGZIO_TOKEN as string,
          host: "listener.logz.io",
          protocol: "https",
          name: loggerOptions.defaultMeta.service,
          level: process.env.LOG_LEVEL || "error",
        }),
      );
    }

    const globalLogger = createLogger(loggerOptions);

    // Add all the stuff we need
    container.register("logLevel", asValue(process.env.LOG_LEVEL || "error"));
    container.register("logMetaService", asValue(packageInfo.name));
    container.register("logMetaRuntimeVersion", asValue(packageInfo.version));
    container.register("logger", asValue(globalLogger));
    container.register("redisClientOpts", asValue(redisClientOpts));
    container.register(
      "redisClient",
      asClass(ConnectorRedisClient).singleton(),
    );

    // If it's an OAuth enabled application, obtain the client id and client secret
    if (process.env.HULLDX_OAUTH_CLIENTID) {
      container.register(
        "oauthClientId",
        asValue(process.env.HULLDX_OAUTH_CLIENTID),
      );
    }

    if (process.env.HULLDX_OAUTH_CLIENTSECRET) {
      container.register(
        "oauthClientSecret",
        asValue(process.env.HULLDX_OAUTH_CLIENTSECRET),
      );
    }

    // Append the container to the request object
    (req as CustomizedRequest).container = container;

    next();
  });
};
