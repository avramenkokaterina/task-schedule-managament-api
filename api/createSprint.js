async sprint => {
  delete sprint.id;
  const tasks = sprint.tasks || [];
  delete sprint.tasks;
  const result = await application.db.insert('sprints', sprint);
  const createdSprint = result.rows[0];
  await application.db.update('tasks', { sprintId: createdSprint.id }, { id: tasks });
  return { result: 'success', sprint: createdSprint};
};
