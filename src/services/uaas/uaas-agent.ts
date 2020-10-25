import { AwilixContainer, asClass } from "awilix";
import { forEach, pick, set, get, first, isNil } from "lodash";
import { HullConnectorFlowControlResponse } from "../../definitions/hull/hull-connector";
import { uaasV1 } from "../../definitions/uaas/v1";
import { DiffHelpers } from "./diff-helpers";
import { HullClient } from "../hull/hull-client";
import {
  HullBatchPayload,
  HullBatchItem,
} from "../../definitions/hull/hull-api";
import { DateTime } from "luxon";
import { QuorumStrategyHandler } from "./strategy-handlers/quorum";
import { PriorityStrategyHandler } from "./strategy-handlers/priority";

const getDurationInMilliseconds = (start: [number, number]): number => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export class UaaSAgent {
  public readonly diContainer: AwilixContainer;

  constructor(diContainer: AwilixContainer) {
    this.diContainer = diContainer;
    this.diContainer.register("quorumHandler", asClass(QuorumStrategyHandler));
    this.diContainer.register(
      "priorityHandler",
      asClass(PriorityStrategyHandler),
    );
  }

  public async handleUserUpdateMessages(
    snRequest: any,
  ): Promise<HullConnectorFlowControlResponse> {
    try {
      const start = process.hrtime();
      const hullClient: HullClient = this.diContainer.resolve<HullClient>(
        "hullClient",
      );

      const batchPayload: HullBatchPayload = {
        timestamp: DateTime.utc().toISO() as string,
        sentAt: DateTime.utc().toISO() as string,
        batch: [],
      };

      const strategyHandlers: uaasV1.Resource$StrategyHandler[] = this.initializeStrategyHandlers();

      forEach(snRequest.messages, (msg: any) => {
        let attributesToChange = {};
        forEach(strategyHandlers, (strategyHandler) => {
          const changedAttribs = strategyHandler.handleUser({
            ...msg.user,
            account: msg.account,
          });

          const diffedAttribs = DiffHelpers.diffUserAttributes(
            msg.user,
            changedAttribs,
          );

          attributesToChange = {
            ...attributesToChange,
            ...diffedAttribs,
          };
        });

        // TODO: Replace with real logging
        // console.log(">>> Firehose Attributes", attributesToChange);
        if (Object.keys(attributesToChange).length > 0) {
          const userIdent = pick(msg.user, ["id", "external_id", "email"]);
          if (get(msg, "user.anonymous_ids", []).length > 0) {
            set(userIdent, "anonymous_id", first(msg.user.anonymous_ids));
          }
          const batchItem: HullBatchItem = {
            type: "traits",
            timestamp: DateTime.utc().toISO() as string,
            headers: {
              "Hull-Access-Token": HullClient.createJwtUser(
                hullClient.connectorAuth,
                userIdent,
              ),
            },
            body: attributesToChange,
          };

          batchPayload.batch.push(batchItem);
        }
      });

      await hullClient.sendToFirehose(batchPayload);
      const durationInMilliseconds = getDurationInMilliseconds(start);
      let flowControlSize = 50;
      if (durationInMilliseconds <= 1000) {
        flowControlSize = 200;
      } else if (durationInMilliseconds <= 2000) {
        flowControlSize = 150;
      } else if (durationInMilliseconds <= 3000) {
        flowControlSize = 100;
      }

      const flowResponse: HullConnectorFlowControlResponse = {
        errors: [],
        metrics: [],
        flow_control: {
          type: "next",
          size: flowControlSize,
          in: 1,
        },
      };

      return flowResponse;
    } catch (error) {
      return {
        errors: [error.message],
        metrics: [],
        flow_control: {
          type: "retry",
          size: 50,
          in: 1,
        },
      };
    }
  }

  public async handleAccountUpdateMessages(
    snRequest: any,
  ): Promise<HullConnectorFlowControlResponse> {
    try {
      const start = process.hrtime();

      const hullClient: HullClient = this.diContainer.resolve<HullClient>(
        "hullClient",
      );

      // const quorumHandler = new QuorumHandler();
      const batchPayload: HullBatchPayload = {
        timestamp: DateTime.utc().toISO() as string,
        sentAt: DateTime.utc().toISO() as string,
        batch: [],
      };

      const strategyHandlers: uaasV1.Resource$StrategyHandler[] = this.initializeStrategyHandlers();
      forEach(snRequest.messages, (msg: any) => {
        let attributesToChange = {};
        forEach(strategyHandlers, (strategyHandler) => {
          const changedAttribs = strategyHandler.handleAccount({
            ...msg.account,
          });

          const diffedAttribs = DiffHelpers.diffAccountAttributes(
            msg.account,
            changedAttribs,
          );

          attributesToChange = {
            ...attributesToChange,
            ...diffedAttribs,
          };
        });

        // TODO: Replace with real logging
        // console.log(">>> Firehose Attributes", attributesToChange);
        if (Object.keys(attributesToChange).length > 0) {
          const accountIdent = pick(msg.account, [
            "id",
            "external_id",
            "domain",
          ]);
          if (get(msg, "account.anonymous_ids", []).length > 0) {
            set(accountIdent, "anonymous_id", first(msg.account.anonymous_ids));
          }
          const batchItem: HullBatchItem = {
            type: "traits",
            timestamp: DateTime.utc().toISO() as string,
            headers: {
              "Hull-Access-Token": HullClient.createJwtAccount(
                hullClient.connectorAuth,
                accountIdent,
              ),
            },
            body: attributesToChange,
          };

          batchPayload.batch.push(batchItem);
        }
      });

      await hullClient.sendToFirehose(batchPayload);
      const durationInMilliseconds = getDurationInMilliseconds(start);
      let flowControlSize = 50;
      if (durationInMilliseconds <= 1000) {
        flowControlSize = 200;
      } else if (durationInMilliseconds <= 2000) {
        flowControlSize = 150;
      } else if (durationInMilliseconds <= 3000) {
        flowControlSize = 100;
      }

      const flowResponse: HullConnectorFlowControlResponse = {
        errors: [],
        metrics: [],
        flow_control: {
          type: "next",
          size: flowControlSize,
          in: 1,
        },
      };

      return flowResponse;
    } catch (error) {
      console.error(error);
      return {
        errors: [error.message],
        metrics: [],
        flow_control: {
          type: "retry",
          size: 50,
          in: 1,
        },
      };
    }
  }

  private initializeStrategyHandlers(): uaasV1.Resource$StrategyHandler[] {
    const strategyHandlers: uaasV1.Resource$StrategyHandler[] = [];
    const quorumHandler = this.diContainer.resolve<QuorumStrategyHandler>(
      "quorumHandler",
      {
        allowUnregistered: true,
      },
    );
    const priorityHandler = this.diContainer.resolve<PriorityStrategyHandler>(
      "priorityHandler",
      {
        allowUnregistered: true,
      },
    );
    if (!isNil(quorumHandler)) {
      strategyHandlers.push(quorumHandler);
    }
    if (!isNil(priorityHandler)) {
      strategyHandlers.push(priorityHandler);
    }
    return strategyHandlers;
  }
}
