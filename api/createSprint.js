async args => {
  delete args.id;
  await application.db.insert('sprints', args);
  return { result: 'success' };
};
