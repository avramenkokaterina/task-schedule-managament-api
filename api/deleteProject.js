async ({ projectId }) => {
  await application.db.delete('users_projects', { projectId });
  await application.db.delete('projects', { id: projectId });
  return { result: 'success' };
};
