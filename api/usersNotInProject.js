async ({ projectId }) => {
  const subQuery =
    `SELECT user_id
    FROM users_projects
    WHERE project_id = ${projectId}`;
  const where = `WHERE id NOT IN (${subQuery})`;
  const data = await application.db.select(
    `system_users ${where}`,
    ['DISTINCT full_name', 'id']
  );
  return { result: 'success', data };
};
