import { Route } from "../../definitions/express/express-route";
import { handleAvilableNormalizationMethods } from "./route-handlers";
import cors from "cors";

export const uaasRoutes: Route[] = [
  {
    path: "/meta/methods/normalization",
    method: "get",
    handler: [cors(), handleAvilableNormalizationMethods],
  },
];
