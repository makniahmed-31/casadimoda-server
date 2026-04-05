import { Router, Request, Response } from "express";
import db from "../../utils/db";
import SiteConfig, { getSiteConfig } from "../../models/SiteConfig";
import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireRole";

const router = Router();

/**
 * GET /api/admin/site-config
 * Admin — returns the full site config document.
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  async (_req: Request, res: Response) => {
    try {
      await db.connect();
      const config = await getSiteConfig();
      res.json(config);
    } catch (err) {
      console.error("Error fetching site config:", err);
      res.status(500).json({ message: "Error fetching site config" });
    }
  }
);

/**
 * PUT /api/admin/site-config
 * Admin — updates the active theme id and/or overrides.
 *
 * Body (all fields optional):
 *   {
 *     activeThemeId?: string,
 *     borderRadiusOverrides?: {
 *       radiusCard?: string,
 *       radiusButton?: string,
 *       radiusBadge?: string,
 *       radiusInput?: string,
 *     },
 *     productCardOverrides?: {
 *       bgFrom?: string, bgTo?: string, border?: string,
 *       hoverShadow?: string, headerText?: string, mutedText?: string,
 *       badgeBg?: string, badgeBorder?: string, badgeText?: string, imageBg?: string,
 *     }
 *   }
 */
router.put(
  "/",
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { activeThemeId, borderRadiusOverrides, productCardOverrides } =
        req.body;

      const update: Record<string, unknown> = {};

      if (activeThemeId !== undefined) {
        update.activeThemeId = activeThemeId;
      }

      if (borderRadiusOverrides !== undefined) {
        // Replace overrides entirely so the client can clear them by sending {}
        update.borderRadiusOverrides = borderRadiusOverrides;
      }

      if (productCardOverrides !== undefined) {
        update.productCardOverrides = productCardOverrides;
      }

      if (Object.keys(update).length === 0) {
        res.status(400).json({ message: "No fields to update" });
        return;
      }

      await db.connect();

      const config = await SiteConfig.findOneAndUpdate(
        { singleton: "site" },
        { $set: update },
        { upsert: true, new: true, runValidators: true }
      );

      res.json({
        activeThemeId:        config!.activeThemeId,
        borderRadiusOverrides: config!.borderRadiusOverrides,
        productCardOverrides:  config!.productCardOverrides,
        updatedAt:             config!.updatedAt,
      });
    } catch (err) {
      console.error("Error updating site config:", err);
      res.status(500).json({ message: "Error updating site config" });
    }
  }
);

export default router;
