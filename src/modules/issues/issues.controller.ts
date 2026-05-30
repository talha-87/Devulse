import { Request, Response } from "express";
import { getSingleIssueService } from "./issues.service";
import {
  createIssueService,
  getAllIssuesService,
} from "./issues.service";
import { updateIssueService } from "./issues.service";
import { deleteIssueService } from "./issues.service";

export const createIssue = async (req: any, res: Response) => {
  try {
    const result = await createIssueService(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await getAllIssuesService(req.query);

    res.status(200).json({
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await getSingleIssueService(id);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateIssue = async (
  req: any,
  res: Response
) => {
  try {
    const issueId = Number(req.params.id);
    const result = await updateIssueService(
      issueId,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });

  } catch (error: any) {
    if (error.message === "Issue not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (
      error.message === "Forbidden" ||
      error.message ===
        "You can update only open issues"
    ) {
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


export const deleteIssue = async (
  req: any,
  res: Response
) => {
  try {
    const issueId = Number(req.params.id);
    await deleteIssueService(
      issueId,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
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