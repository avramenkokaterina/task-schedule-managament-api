async task => {
  delete task.id;
  const projectId = task.projectId;
  if (projectId) {
    const project = await application.db.select('projects', ['code'], { id: projectId });
    const taskCount = await application.db.select('tasks', ['COUNT(id) as count'], { projectId });
    task.code = `${project[0].code}-${++taskCount[0].count}`;
  }
  await application.db.insert('tasks', task);
  return { result: 'success' };
};
