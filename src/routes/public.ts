import { Router, Request, Response } from "express";
import db from "../utils/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import Brand from "@/models/Brand";

const router = Router();

// GET /api/categories (public)
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    await db.connect();
    res.json(await Category.find({}));
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// GET /api/subcategories (public)
router.get("/subcategories", async (_req: Request, res: Response) => {
  try {
    await db.connect();
    res.json(await SubCategory.find({}));
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcategories" });
  }
});

// GET /api/brands (public)
router.get("/brands", async (_req: Request, res: Response) => {
  try {
    await db.connect();
    res.json(await Brand.find({}));
  } catch (err) {
    res.status(500).json({ message: "Error fetching brands" });
  }
});

export default router;
