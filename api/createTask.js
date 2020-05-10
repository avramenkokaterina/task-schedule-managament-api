async task => {
  await application.db.insert('tasks', task);
  return { result: 'success' };
};
