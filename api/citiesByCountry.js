async ({ countryId }) => {
  const fields = ['id', 'name'];
  const where = { countryId };
  const data = await application.db.select('City', fields, where);
  return { result: 'success', data };
};
