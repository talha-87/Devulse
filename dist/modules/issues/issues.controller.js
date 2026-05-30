"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIssue = exports.updateIssue = exports.getSingleIssue = exports.getAllIssues = exports.createIssue = void 0;
const issues_service_1 = require("./issues.service");
const issues_service_2 = require("./issues.service");
const issues_service_3 = require("./issues.service");
const issues_service_4 = require("./issues.service");
const createIssue = async (req, res) => {
    try {
        const result = await (0, issues_service_2.createIssueService)(req.body, req.user);
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createIssue = createIssue;
const getAllIssues = async (req, res) => {
    try {
        const result = await (0, issues_service_2.getAllIssuesService)(req.query);
        res.status(200).json({
            success: true,
            message: "Issues retrived successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllIssues = getAllIssues;
const getSingleIssue = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await (0, issues_service_1.getSingleIssueService)(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Issue retrived successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getSingleIssue = getSingleIssue;
const updateIssue = async (req, res) => {
    try {
        const issueId = Number(req.params.id);
        const result = await (0, issues_service_3.updateIssueService)(issueId, req.body, req.user);
        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    }
    catch (error) {
        if (error.message === "Issue not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        if (error.message === "Forbidden" ||
            error.message ===
                "You can update only open issues") {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateIssue = updateIssue;
const deleteIssue = async (req, res) => {
    try {
        const issueId = Number(req.params.id);
        await (0, issues_service_4.deleteIssueService)(issueId, req.user);
        res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });
    }
    catch (error) {
        if (error.message === "Issue not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        if (error.message === "Forbidden") {
            return res.status(403).json({
                success: false,
                message: "Only maintainer can delete issues",
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteIssue = deleteIssue;
//# sourceMappingURL=issues.controller.js.map