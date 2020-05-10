async ({ userId, projectId }) => {
  const record = { userId, projectId };
  await application.db.delete('users_projects', record);
  return { result: 'success' };
};
