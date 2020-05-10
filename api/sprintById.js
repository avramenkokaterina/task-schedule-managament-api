async ({ sprintId }) => {
  const data = await application.db.select('sprints', undefined, { id: sprintId });
  return { result: 'success', data };
};
