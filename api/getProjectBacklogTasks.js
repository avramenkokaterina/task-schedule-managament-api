async ({ projectId, sprintId }) => {
  const where = {
    projectId,
    status: 'open',
    dueDate: '>' + new Date().toISOString(),
    sprintId: sprintId ? null : [null, sprintId]
  };
  const data = await application.db.select('tasks', undefined, where);
  return data;
};
