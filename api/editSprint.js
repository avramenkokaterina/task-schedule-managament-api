async sprint => {
  const where = { id: sprint.id };
  const sprintId = sprint.id;
  delete sprint.id;
  const newTasks = sprint.tasks || [];
  delete sprint.tasks;
  await application.db.update('sprints', sprint, where);
  const oldTasks = await application.db.select('tasks', ['id'], { sprintId });
  const tasksToDelete = oldTasks.filter(taskId => !newTasks.includes(taskId));
  const taskToUpdate = newTasks.filter(taskId => !oldTasks.includes(taskId));
  await application.db.update('tasks', { sprintId: null }, { id: tasksToDelete });
  await application.db.update('tasks', { sprintId }, { id: taskToUpdate });
  return { result: 'success' };
};
