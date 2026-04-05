import { Router, Request, Response } from "express";
import db from "../utils/db";
import { getSiteConfig } from "../models/SiteConfig";

const router = Router();

/**
 * GET /api/site-config
 * Public — returns the active siteConfig (themeId + overrides).
 * No authentication required; any visitor can fetch this to apply the theme.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    await db.connect();
    const config = await getSiteConfig();
    res.json({
      activeThemeId:        config.activeThemeId,
      borderRadiusOverrides: config.borderRadiusOverrides,
      productCardOverrides:  config.productCardOverrides,
      updatedAt:             config.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching site config:", err);
    res.status(500).json({ message: "Error fetching site config" });
  }
});

export default router;
