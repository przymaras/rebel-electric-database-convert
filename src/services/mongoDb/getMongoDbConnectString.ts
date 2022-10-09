export const getMongoDbConnectString = () => {
  const dbName = process.env.MONGODB_DB;
  const dbhost = process.env.MONGODB_HOST;
  const dbUser = process.env.MONGODB_USER;
  const dbPass = process.env.MONGODB_PASS;

  if (!dbName || !dbhost || !dbUser || !dbPass) return undefined;

  const connectString = `mongodb+srv://${dbUser}:${dbPass}@${dbhost}/${dbName}?retryWrites=true&w=majority`;

  return connectString;
};
