async ({ userIds, projectId }) => {
  const records = userIds.map((id) => ({ userId: id, projectId }));
  const queries = [];
  await application.db.delete('users_projects', { projectId });
  records.forEach(record => {
    queries.push(application.db.insert('users_projects', record));
  });
  await Promise.all(queries);
  return { result: 'success' };
};
