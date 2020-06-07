async ({ sprintId }) => {
  const sql = `UPDATE projects SET active_sprint_id = NULL WHERE active_sprint_id = ${sprintId}`;
  await application.db.query(sql);
  return { result: 'success' };
};
