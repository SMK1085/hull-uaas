import { Route } from "../definitions/express/express-route";
import { hullRoutes } from "./hull/routes";
import { uaasRoutes } from "./uaas/routes";

const routes: Route[] = [];
routes.push(...hullRoutes);
routes.push(...uaasRoutes);

export { routes };
