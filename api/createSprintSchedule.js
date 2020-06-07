async ({ sprintId }) => {
  const projectId = (await application.db.select('sprints', ['project_id'], { id: sprintId }))[0].projectId;
  const whereUserId = `WHERE id IN
                        (
                          SELECT user_id
                          FROM users_projects
                          WHERE project_id = ${projectId}
                        )`;
  const users = await application.db.select(`system_users ${whereUserId}`, ['id']);
  let tasks = await application.db.select('tasks', ['id', 'estimate', 'due_date'], { sprintId });
  const userTaskMap = new Map();
  users.forEach(user => userTaskMap.set(user.id, []));
  tasks.sort((a, b) => b.dueDate - a.dueDate);
  const summaryDuration = tasks.reduce((result, next) => result + next.estimate, 0);
  const perfectDuration = Math.ceil(summaryDuration / users.length);
  const userCapacity = new Map();
  users.forEach(user => userCapacity.set(user.id, perfectDuration));

  const taskLength = tasks.length;
  for (let i = 0; i < taskLength; i++) {
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
    tasks = tasks.filter(task => task.id !== maxEstimateTask.id);
    userCapacity.set(maxCapacityUser, maxCapacity - maxEstimateTask.estimate);
  }
  console.log(userTaskMap);

  const userPromises = Array.from(userTaskMap.entries())
    .map(([userId, taskIds]) => application.db.update('tasks', { userId }, { id: taskIds }));
  await Promise.all(userPromises);
  const taskPromises = [];
  Array.from(userTaskMap.values()).forEach(tasks => {
    tasks.reverse().forEach((task, index) => {
      taskPromises.push(application.db.update('tasks', { orderNumber: index + 1 }, { id: task }));
    });
  });
  await Promise.all(taskPromises);
  await application.db.update('sprints', { readonly: true }, { id: sprintId });

  return { result: 'success' };
};
