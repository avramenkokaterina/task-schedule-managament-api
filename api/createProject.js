async project => {
  delete project.id;
  const result = await application.db.insert('projects', project);
  const projectId = result.rows[0].id;
  await application.db.insert('users_projects', {
    userId: project.ownerId,
    projectId
  });
  console.log(result);
  return { result: 'success', id: projectId };
};
