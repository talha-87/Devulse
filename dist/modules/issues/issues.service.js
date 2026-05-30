"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIssueService = exports.updateIssueService = exports.getSingleIssueService = exports.getAllIssuesService = exports.createIssueService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const getUserById = async (id) => {
    const result = await db_1.default.query("SELECT id, name, role FROM users WHERE id=$1", [id]);
    return result.rows[0];
};
const createIssueService = async (data, user) => {
    const { title, description, type } = data;
    const result = await db_1.default.query(`INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, 'open', $4)
     RETURNING *`, [title, description, type, user.id]);
    return result.rows[0];
};
exports.createIssueService = createIssueService;
const getAllIssuesService = async (query) => {
    const { sort = "newest", type, status } = query;
    let sql = "SELECT * FROM issues WHERE 1=1";
    const values = [];
    let index = 1;
    if (type) {
        sql += ` AND type = $${index}`;
        values.push(type);
        index++;
    }
    if (status) {
        sql += ` AND status = $${index}`;
        values.push(status);
        index++;
    }
    if (sort === "oldest") {
        sql += " ORDER BY created_at ASC";
    }
    else {
        sql += " ORDER BY created_at DESC";
    }
    const result = await db_1.default.query(sql, values);
    const issues = result.rows;
    const finalData = [];
    for (const issue of issues) {
        const reporter = await getUserById(issue.reporter_id);
        finalData.push({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
        });
    }
    return finalData;
};
exports.getAllIssuesService = getAllIssuesService;
const getSingleIssueService = async (id) => {
    const result = await db_1.default.query("SELECT * FROM issues WHERE id = $1", [id]);
    const issue = result.rows[0];
    if (!issue)
        return null;
    const reporter = await getUserById(issue.reporter_id);
    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };
};
exports.getSingleIssueService = getSingleIssueService;
const updateIssueService = async (issueId, payload, user) => {
    const issueResult = await db_1.default.query("SELECT * FROM issues WHERE id = $1", [issueId]);
    const issue = issueResult.rows[0];
    if (!issue) {
        throw new Error("Issue not found");
    }
    if (user.role === "maintainer") {
    }
    else if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
            throw new Error("Forbidden");
        }
        if (issue.status !== "open") {
            throw new Error("You can update only open issues");
        }
    }
    const { title, description, type } = payload;
    const result = await db_1.default.query(`
  UPDATE issues
  SET
    title = $1,
    description = $2,
    type = $3,
    status = 'in_progress',
    updated_at = NOW()
  WHERE id = $4
  RETURNING *
  `, [title, description, type, issueId]);
    return result.rows[0];
};
exports.updateIssueService = updateIssueService;
const deleteIssueService = async (issueId, user) => {
    const issueResult = await db_1.default.query("SELECT * FROM issues WHERE id = $1", [issueId]);
    const issue = issueResult.rows[0];
    if (!issue) {
        throw new Error("Issue not found");
    }
    if (user.role !== "maintainer") {
        throw new Error("Forbidden");
    }
    await db_1.default.query("DELETE FROM issues WHERE id = $1", [issueId]);
    return true;
};
exports.deleteIssueService = deleteIssueService;
//# sourceMappingURL=issues.service.js.map