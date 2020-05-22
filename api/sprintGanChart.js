async ({ sprintId }) => {
  const sql =
      `SELECT u.id        as user_id,
              u.full_name as user_full_name,
              (
                  SELECT COUNT(id)
                  FROM tasks
                  WHERE sprint_id = 1
                    AND user_id = u.id
                    AND status IN ('open', 'in_progress')
              )           as not_completed,
              (
                  SELECT COUNT(id)
                  FROM tasks
                  WHERE sprint_id = $1
                    AND user_id = u.id
                    AND status <> 'canceled'
              )           as total,
              t.*
       FROM system_users u
                JOIN tasks t ON t.user_id = u.id
       WHERE t.sprint_id = $1;`;
  const queryResult = await application.db.query(sql, [sprintId]);
  const rows = (queryResult && queryResult.rows || []).map(api.fromSnakeCase);
  const byUserId = new Map();
  rows.forEach(row => byUserId.set(row.userId, (byUserId.get(row.userId) || []).concat([row])));
  const data = Array.from(byUserId.entries())
    .map(([userId, rows]) => {
      return {
        user: {
          id: userId,
          name: rows[0] && rows[0].userFullName
        },
        notCompleted: rows[0] && rows[0].notCompleted || 0,
        total: rows[0] && rows[0].total || 0,
        tasks: rows
          .map(row => {
            return {
              ...row,
              userId: undefined,
              userFullName: undefined,
              total: undefined,
              notCompleted: undefined
            };
          })
          .sort((a, b) => a.order - b.order)
      };
    });
  return data;
};
