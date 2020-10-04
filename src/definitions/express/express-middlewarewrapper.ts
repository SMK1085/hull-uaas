import { Router } from "express";

export type MiddlewareWrapper = (router: Router) => void;
