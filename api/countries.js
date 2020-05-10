async () => {
  const fields = ['id', 'name'];
  const data = await application.db.select('Country', fields);
  return { result: 'success', data };
};
