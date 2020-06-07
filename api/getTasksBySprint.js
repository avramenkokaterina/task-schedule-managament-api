async ({ sprintId }) => {
  const where = { 't.sprint_id': sprintId };
  const data = await application.db.select(
    'tasks t left join system_users u ON t.user_id = u.id',
    [
      't.id',
      't.code',
      't.name',
      't.estimate',
      't.date_from',
      't.date_to',
      't.status',
      'u.full_name as user_name',
      'u.color',
      'u.id as user_id',
      't.sprint_id',
      't.project_id',
      't.due_date',
      't.story_points',
      't.description',
      't.name',
      't.code',
      't.order_number',
      't.actual_duration'
    ],
    where
  );
  return data;
};
