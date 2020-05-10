async ({ sprintId, taskIds }) => {
  await application.db.update('tasks', { sprintId }, { id: taskIds });
  return { result: 'success' };
};
