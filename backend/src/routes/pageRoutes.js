import express from "express";
import {
  createPage,
  deletePage,
  getAllPages,
  getPageById,
  updatePage,
} from "../controllers/pageController.js";

const router = express.Router();

router.post("/", createPage); // POST /api/pages
router.put("/:id", updatePage); // PUT /api/pages/:id
router.delete("/:id", deletePage); // DELETE /api/pages/:id
router.get("/", getAllPages); // GET /api/pages
router.get("/:id", getPageById); // GET /api/pages/:id

export default router;
