async ({ sprintId }) => {
  const where = { sprintId };
  const data = await application.db.select('tasks', undefined, where);
  return { result: 'success', data };
};
