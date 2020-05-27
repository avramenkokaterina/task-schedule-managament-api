async sprint => {
  const where = { id: sprint.id };
  const sprintId = sprint.id;
  delete sprint.id;
  const newTasks = sprint.tasks || [];
  delete sprint.tasks;
  await application.db.update('sprints', sprint, where);
  const oldTasks = (await application.db.select('tasks', ['id'], {
    sprintId,
    status: 'open'
  })).map(item => item.id);
  console.log(oldTasks);
  console.log(newTasks);
  const tasksToDelete = oldTasks.filter(taskId => !newTasks.includes(taskId));
  const taskToUpdate = newTasks.filter(taskId => !oldTasks.includes(taskId));
  console.log(tasksToDelete);
  console.log(taskToUpdate);
  if (tasksToDelete.length) {
    const inClause = tasksToDelete.reduce((result, next, index) => {
      if (index > 0) {
        result = `${result}, `;
      }
      result = `${result}${next}`;
      return result;
    }, '');
    const deleteSql = `UPDATE tasks SET sprint_id = NULL where id IN (${inClause})`;
    await application.db.query(deleteSql);
  }
  if (taskToUpdate.length) {
    await application.db.update('tasks', { sprintId }, { id: taskToUpdate });
  }
  return { result: 'success' };
};
