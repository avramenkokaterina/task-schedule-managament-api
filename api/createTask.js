async task => {
  delete task.id;
  await application.db.insert('tasks', task);
  return { result: 'success' };
};
