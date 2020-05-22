async ({ sprintId }) => {
  const projectId = await application.db.select('sprints', ['project_id'], { id: sprintId });
  const whereUserId = `WHERE id IN
                        (
                          SELECT user_id
                          FROM users_projects
                          WHERE project_id = ${projectId}
                        )`;
  const users = await application.db.select(`system_users ${whereUserId}`, ['id']);
  const tasks = await application.db.select('tasks', ['id', 'estimate', 'due_date'], { sprintId });
  const userTaskMap = new Map();
  users.forEach(user => userTaskMap.set(user.id, []));
  tasks.sort((a, b) => b.dueDate - a.dueDate);
  const summaryDuration = tasks.reduce((result, next) => result + next.estimate, 0);
  const perfectDuration = Math.ceil(summaryDuration / users.length);
  const userCapacity = new Map();
  users.forEach(user => userCapacity.set(user.id, perfectDuration));
  for (let i = 0; i < tasks.length; i++) {
    let maxCapacity = 0;
    let maxCapacityUser = users[0].id;
    Array.from(userCapacity.entries()).forEach(([userId, capacity]) => {
      if (capacity > maxCapacity) {
        maxCapacity = capacity;
        maxCapacityUser = userId;
      }
    });
    const properTasks = tasks.filter(task => task.dueDate > maxCapacity);
    const maxEstimateTask = properTasks.reduce((prev, next) => (prev.estimate >= next.estimate ? prev : next));
    userTaskMap.get(maxCapacityUser).push(maxEstimateTask.id);
    tasks.filter(task => task.id !== maxEstimateTask.id);
    userCapacity.set(maxCapacityUser, maxCapacity - maxEstimateTask.estimate);
  }
  const userPromises = Array.from(userTaskMap.entries())
    .map(([userId, taskIds]) => application.db.update('users', { userId }, { id: taskIds }));
  await Promise.all(userPromises);
  const taskPromises = [];
  Array.from(userTaskMap.values()).forEach(tasks => {
    tasks.forEach((task, index) => {
      taskPromises.push(application.db.update('tasks', { order: index }, { id: task }));
    });
  });
  await Promise.all(taskPromises);
  return { result: 'success' };
};
