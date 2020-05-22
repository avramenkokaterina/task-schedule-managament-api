async ({ projectId }) => {
  const where = { projectId };
  const data = await application.db.select('tasks', undefined, where);
  return data;
};
