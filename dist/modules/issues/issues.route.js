"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const issues_controller_1 = require("./issues.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authMiddleware, issues_controller_1.createIssue);
router.get("/", issues_controller_1.getAllIssues);
router.get("/:id", issues_controller_1.getSingleIssue);
exports.default = router;
router.patch("/:id", auth_middleware_1.authMiddleware, issues_controller_1.updateIssue);
router.delete("/:id", auth_middleware_1.authMiddleware, issues_controller_1.deleteIssue);
//# sourceMappingURL=issues.route.js.map