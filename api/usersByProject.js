async ({ projectId }) => {
  const sql = `
      SELECT u.id, u.full_name, u.position, u.email
      FROM system_users u
               JOIN users_projects up ON u.id = up.user_id
      WHERE up.project_id = $1`;
  const queryResult = await application.db.query(sql, [projectId]);
  const data = (queryResult.rows || []).map(api.fromSnakeCase);
  return { result: 'success', data };
};
