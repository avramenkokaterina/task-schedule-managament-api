async ({ projectId }) => {
  const sprintIds = await application.db.select('sprints', ['id'], { projectId });
  const sprintDeleteQueries = sprintIds.map(sprint => application.db.delete('tasks', { sprintId: sprint.id }));
  await Promise.all(sprintDeleteQueries);
  await application.db.delete('users_projects', { projectId });
  await application.db.delete('sprints', { projectId });
  await application.db.delete('projects', { id: projectId });
  return { result: 'success' };
};
