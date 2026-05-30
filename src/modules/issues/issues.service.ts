import pool from "../../config/db";


const getUserById = async (id: number) => {
  const result = await pool.query(
    "SELECT id, name, role FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};


export const createIssueService = async (data: any, user: any) => {
  const { title, description, type } = data;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, 'open', $4)
     RETURNING *`,
    [title, description, type, user.id]
  );

  return result.rows[0];
};


export const getAllIssuesService = async (query: any) => {
  const { sort = "newest", type, status } = query;

  let sql = "SELECT * FROM issues WHERE 1=1";
  const values: any[] = [];
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
  } else {
    sql += " ORDER BY created_at DESC";
  }

  const result = await pool.query(sql, values);

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

export const getSingleIssueService = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [id]
  );

  const issue = result.rows[0];

  if (!issue) return null;

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

export const updateIssueService = async (
  issueId: number,
  payload: any,
  user: any
) => {
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [issueId]
  );

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
      throw new Error(
        "You can update only open issues"
      );
    }
  }

  const { title, description, type } = payload;

 const result = await pool.query(
  `
  UPDATE issues
  SET
    title = $1,
    description = $2,
    type = $3,
    status = 'in_progress',
    updated_at = NOW()
  WHERE id = $4
  RETURNING *
  `,
  [title, description, type, issueId]
);

  return result.rows[0];
};


export const deleteIssueService = async (
  issueId: number,
  user: any
) => {
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [issueId]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (user.role !== "maintainer") {
    throw new Error("Forbidden");
  }

  await pool.query(
    "DELETE FROM issues WHERE id = $1",
    [issueId]
  );

  return true;
};