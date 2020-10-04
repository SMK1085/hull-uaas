import { Response, NextFunction, Router, Request } from "express";
import { v4 } from "uuid";
import { asValue, AwilixContainer, asClass } from "awilix";
import { get } from "lodash";
import { CustomizedRequest } from "../definitions/express/express-scope";
import { HullConnectorAuth } from "../definitions/hull/hull-connector";
import { HullClient } from "../services/hull/hull-client";

export const initializeScope = (router: Router): void => {
  router.use((req: Request, _res: Response, next: NextFunction): void => {
    // create a scoped container
    const scope = (req as CustomizedRequest).container.createScope();
    // Register all the stuff to the scope
    const correlationKey = req.headers["x-hulldx-correlationkey"]
      ? req.headers["x-hulldx-correlationkey"]
      : v4();
    scope.register("correlationKey", asValue(correlationKey));
    // Hull specific stuff
    if (req.query["ship"] && req.query["secret"] && req.query["organization"]) {
      scope.register("hullAppId", asValue(req.query["ship"]));
      scope.register("hullAppSecret", asValue(req.query["secret"]));
      scope.register("hullAppOrganization", asValue(req.query["organization"]));
      const connectorAuth: HullConnectorAuth = {
        id: req.query["ship"] as string,
        secret: req.query["secret"] as string,
        organization: req.query["organization"] as string,
      };

      scope.register("hullAppAuth", asValue(connectorAuth));
      scope.register("hullClient", asValue(new HullClient(connectorAuth)));
    } else if (req.query["source"] === "kraken") {
      if (get(req, "body.configuration", undefined) !== undefined) {
        scope.register("hullAppId", asValue(req.body.configuration.id));
        scope.register("hullAppSecret", asValue(req.body.configuration.secret));
        scope.register(
          "hullAppOrganization",
          asValue(req.body.configuration.organization),
        );
        const connectorAuth: HullConnectorAuth = req.body.configuration;

        scope.register("hullAppAuth", asValue(connectorAuth));
        scope.register("hullClient", asValue(new HullClient(connectorAuth)));
      }
    }

    if (get(req, "body.connector.private_settings", undefined) !== undefined) {
      scope.register(
        "hullAppSettings",
        asValue(req.body.connector.private_settings),
      );
    }

    if (get(req, "body.notification_id", undefined) !== undefined) {
      req.headers["x-hulldx-kraken-notification-id"] = req.body.notification_id;
      scope.register(
        "hullKrakenNotificationId",
        asValue(req.body.notification_id),
      );
    }

    if (get(req, "body.kraken", undefined) !== undefined) {
      scope.register(
        "hullKrakenCheckpoints",
        asValue(get(req, "body.kraken.checkpoints", undefined)),
      );
      scope.register(
        "hullKrakenUpdateIds",
        asValue(get(req, "body.kraken.update-ids", undefined)),
      );
    }

    // assign the scope
    (req as any).scope = scope;

    next();
  });
};
