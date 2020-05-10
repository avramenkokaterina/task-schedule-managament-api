async sprint => {
  const where = { id: sprint.id };
  delete sprint.id;
  await application.db.update('sprints', sprint, where);
  return { result: 'success' };
};
