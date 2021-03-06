async ({ userId }) => {
  const sql =
      `SELECT p.id as id, p.name as name, p.code as code, s.name as sprint, p.active_sprint_id,
            p.start_date as start_date, p.due_date as due_date, s.code as sprint_code,
        (
                SELECT COUNT(up.user_id)
                FROM users_projects up
                WHERE up.project_id = p.id)
        as user_count,
        (
                SELECT COUNT(t.id)
                FROM tasks t
                WHERE t.project_id = p.id
                        AND t.sprint_id is NULL
                        AND t.status = 'open')
        as backlog_count,
        (
                SELECT SUM(t.story_points)
                FROM tasks t
                WHERE t.project_id = p.id
                        AND t.sprint_id is NULL
                        AND t.status = 'open')
        as story_points,
        (
                SELECT COUNT(t.id)
                FROM tasks t
                WHERE t.project_id = p.id
                        AND t.status IN ('open', 'in_progress')
                        AND t.due_date::date > CURRENT_DATE)
        as overdues
       FROM projects p LEFT JOIN sprints s on (p.active_sprint_id = s.id) JOIN users_projects up ON up.project_id=p.id
       WHERE up.user_id = $1;`;
  const data = await application.db.query(sql, [userId]);
  return data && (data.rows || []).map(api.fromSnakeCase);
};
