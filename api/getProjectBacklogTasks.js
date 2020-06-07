async ({ projectId, sprintId }) => {
  const sprintIdWhere = sprintId ? `sprint_id IS NULL OR sprint_id = ${sprintId}` : 'sprint_id IS NULL';
  const where = `WHERE project_id = ${projectId} AND status = 'open' AND (${sprintIdWhere}) ORDER BY code`;
  const data = await application.db.select(`tasks ${where}`, undefined);
  return data;
};
