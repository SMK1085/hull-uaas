import express, { Router } from "express";

export const handleBodyRequestParsing = (router: Router): void => {
  router.use(express.json({ limit: "200mb" }));
};
