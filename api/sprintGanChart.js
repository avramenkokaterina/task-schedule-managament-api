async ({ sprintId }) => {
  const sql =
      `SELECT u.id        as user_id,
              u.full_name as user_full_name,
              u.color     as color,
              (
                  SELECT COUNT(id)
                  FROM tasks
                  WHERE sprint_id = $1
                    AND user_id = u.id
                    AND status IN ('closed', 'canceled')
              )           as completed,
              (
                  SELECT COUNT(id)
                  FROM tasks
                  WHERE sprint_id = $1
                    AND user_id = u.id
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
          name: rows[0] && rows[0].userFullName,
          color: rows[0] && rows[0].color
        },
        completed: rows[0] && rows[0].completed || 0,
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
