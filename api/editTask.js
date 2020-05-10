async task => {
  const where = { id: task.id };
  delete task.id;
  await application.db.update('tasks', task, where);
  return { result: 'success' };
};
