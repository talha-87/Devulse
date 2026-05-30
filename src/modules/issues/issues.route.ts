import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
} from "./issues.controller";

const router = Router();

router.post("/", authMiddleware, createIssue);
router.get("/", getAllIssues);
router.get("/:id", getSingleIssue);

export default router;

router.patch(
  "/:id",
  authMiddleware,
  updateIssue
);
router.delete(
  "/:id",
  authMiddleware,
  deleteIssue
);