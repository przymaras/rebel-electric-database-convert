import { MongoClient } from "mongodb";

import { getMongoDbConnectString } from "./getMongoDbConnectString";

let client: MongoClient;
let clientPromise: Promise<MongoClient> | undefined;
try {
  const connectString = getMongoDbConnectString();
  if (!connectString) {
    throw new Error("No .env variables");
  }

  client = new MongoClient(connectString);

  clientPromise = client.connect();
} catch (err) {
  console.error("Can't connect to database", { Error: err });
  clientPromise = undefined;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions with
// no need to reconnect to db everytime.
export default clientPromise;
