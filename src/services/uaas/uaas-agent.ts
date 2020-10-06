import { AwilixContainer } from "awilix";
import { forEach, pick, set, get, first } from "lodash";
import { HullConnectorFlowControlResponse } from "../../definitions/hull/hull-connector";
import { uuasV1 } from "../../definitions/uaas/v1";
import { QuorumHandler } from "./quorum-handler";
import { DiffHelpers } from "./diff-helpers";
import { HullClient } from "../hull/hull-client";
import {
  HullBatchPayload,
  HullBatchItem,
} from "../../definitions/hull/hull-api";
import { DateTime } from "luxon";

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
  }

  public async handleUserUpdateMessages(): Promise<
    HullConnectorFlowControlResponse
  > {
    const flowResponse: HullConnectorFlowControlResponse = {
      errors: [],
      metrics: [],
      flow_control: {
        type: "next",
        size: 200,
        in: 1,
      },
    };

    return Promise.resolve(flowResponse);
  }

  public async handleAccountUpdateMessages(
    snRequest: any,
  ): Promise<HullConnectorFlowControlResponse> {
    try {
      const start = process.hrtime();
      const appSettings: uuasV1.Schema$AppSettings = this.diContainer.resolve<
        uuasV1.Schema$AppSettings
      >("hullAppSettings");

      const hullClient: HullClient = this.diContainer.resolve<HullClient>(
        "hullClient",
      );

      const quorumHandler = new QuorumHandler();
      const batchPayload: HullBatchPayload = {
        timestamp: DateTime.utc().toISO() as string,
        sentAt: DateTime.utc().toISO() as string,
        batch: [],
      };

      forEach(snRequest.messages, (msg: any) => {
        let attributesToChange = {};
        forEach(appSettings.account_mappings_quorum, (mappingQuorum) => {
          const changedAttribs = quorumHandler.handleAccount(
            msg.account,
            {
              ...mappingQuorum,
              strategy: "QUORUM",
            },
            appSettings.account_normalizations,
          );
          // TODO: Replace with real logging
          // console.log(">>> Changed Attributes", changedAttribs);
          const diffedAttribs = DiffHelpers.diffAccountAttributes(
            msg.account,
            changedAttribs,
          );
          // TODO: Replace with real logging
          // console.log(">>> Diffed Attributes", diffedAttribs);
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
}
