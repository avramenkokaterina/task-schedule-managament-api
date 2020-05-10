async project => {
  const where = { id: project.id };
  delete project.id;
  await application.db.update('projects', project, where);
  return { result: 'success' };
};
