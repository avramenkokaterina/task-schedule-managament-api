async args => {
  await application.db.insert('sprints', args);
  return { result: 'success' };
};
