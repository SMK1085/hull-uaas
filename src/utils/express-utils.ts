import { Router } from "express";
import { MiddlewareWrapper } from "../definitions/express/express-middlewarewrapper";
import { Route } from "../definitions/express/express-route";

export const applyMiddleware = (
  middlewareWrappers: MiddlewareWrapper[],
  router: Router,
): void => {
  middlewareWrappers.forEach((wrapper) => {
    wrapper(router);
  });
};

export const applyRoutes = (routes: Route[], router: Router): void => {
  routes.forEach((route) => {
    const { method, path, handler } = route;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router as any)[method](path, handler);
  });
};
