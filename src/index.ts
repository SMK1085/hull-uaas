import express from "express";
import { initializeContainer } from "./middleware/express-container";
import { initializeScope } from "./middleware/express-scope";
import { handleBodyRequestParsing } from "./middleware/express-bodyparsing";
import { enableCompression } from "./middleware/express-compression";
import { applyMiddleware, applyRoutes } from "./utils/express-utils";
import http from "http";
import { handlePerformanceLogging } from "./middleware/express-performance";
import { handleConnectorStaticFiles } from "./middleware/express-connector-static";
import { routes } from "./services/routes";

require("dotenv").config();

const router = express();
const defaultMiddleware = [
  handleBodyRequestParsing,
  initializeContainer,
  initializeScope,
  handlePerformanceLogging,
  handleConnectorStaticFiles,
  enableCompression,
];

applyMiddleware(defaultMiddleware, router);
applyRoutes(routes, router);
const { PORT = 3000 } = process.env;
router.disable("x-powered-by");
const server = http.createServer(router);

server.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Server is running http://localhost:${PORT}...`),
);
