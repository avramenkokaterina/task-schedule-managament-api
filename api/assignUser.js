async ({ userId, projectId }) => {
  const record = { userId, projectId };
  await application.db.insert('users_projects', record);
  return { result: 'success' };
};
