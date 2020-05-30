async ({ taskIds }) => {
  await application.db.delete('tasks', { id: taskIds });
  return { result: 'success' };
};
