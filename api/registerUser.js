async ({ login, password, fullName, color, email, position }) => {
  const hash = await api.security.hashPassword(password);
  await application.auth.registerUser(login, hash, fullName);
  await application.db.update('system_users', {
    color,
    email,
    position
  }, { login });
  return { result: 'success' };
};
