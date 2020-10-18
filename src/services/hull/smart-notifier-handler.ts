import { Request, Response } from "express";
import { AwilixContainer, asValue } from "awilix";
import { CustomizedRequest } from "../../definitions/express/express-scope";
import { SmartNotifierNotification } from "../../definitions/hull/hull-api";
import { HullConnectorFlowControlResponse } from "../../definitions/hull/hull-connector";
import { UaaSAgent } from "../uaas/uaas-agent";

export const handleSmartNotifier = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const scopedContainer = (req as CustomizedRequest).scope as AwilixContainer;
  scopedContainer.register(
    "hullAppSettings",
    asValue(req.body.connector.private_settings),
  );
  const snNotification: SmartNotifierNotification = req.body as SmartNotifierNotification;
  let snResponse: HullConnectorFlowControlResponse = {
    errors: [],
    metrics: [],
    flow_control: {
      type: "next",
      size: 50,
      in: 1,
    },
  };

  const agent = new UaaSAgent(scopedContainer);
  switch (snNotification.channel) {
    case "user:update":
      snResponse = await agent.handleUserUpdateMessages(req.body);
      break;
    case "account:update":
      snResponse = await agent.handleAccountUpdateMessages(req.body);
      break;
    default:
      // Basically these are unsupported channels, so default
      // to the unsupported flow control response
      snResponse = {
        errors: [],
        metrics: [],
        flow_control: {
          type: "next",
          size: 10,
          in: 1,
        },
      };
      break;
  }

  res.json(snResponse);
};
