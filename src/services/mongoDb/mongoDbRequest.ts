import type { Db } from "mongodb";

import clientPromise from "./mongoDbClientPromise";

export const mongoDbRequest = async <ResponseType>(request: (db: Db) => Promise<ResponseType>) => {
  try {
    const client = await clientPromise;
    if (!client) return undefined;
    const db = client.db(undefined, { ignoreUndefined: true });
    const mongoDbResponse: ResponseType = await request(db);
    return mongoDbResponse;
  } catch (err) {
    console.error({ mongoDbRequest: err });
    return undefined;
  }
};
