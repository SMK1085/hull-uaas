import express, { Router, Request, Response } from "express";
import path from "path";
import { handleManifest } from "../services/hull/manifest-handler";

const handleReadme = (req: Request, res: Response) => {
  res.redirect(
    `https://dashboard.hullapp.io/readme?url=https://${req.headers.host}`,
  );
};

export const handleConnectorStaticFiles = (router: Router): void => {
  const staticsPath = path.join(__dirname, "../../assets");
  router.use(express.static(staticsPath));

  router.get("/", handleReadme);
  router.get("/readme", handleReadme);
  router.get("/manifest.json", handleManifest);
};
