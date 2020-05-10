async args => {
  const result = await application.db.insert('projects', args);
  console.log(result);
  return { result: 'success' };
};
