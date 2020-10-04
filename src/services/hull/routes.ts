import { Route } from "../../definitions/express/express-route";
import { handleSmartNotifier } from "./smart-notifier-handler";
import { handleStatus } from "./status-handler";

export const hullRoutes: Route[] = [
  {
    path: "/smart-notifier",
    method: "use",
    handler: [handleSmartNotifier],
  },
  {
    path: "/status",
    method: "use",
    handler: [handleStatus],
  },
];
