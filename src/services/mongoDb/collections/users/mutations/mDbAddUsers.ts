import { Db } from "mongodb";
import { IUser } from "../../../../../types/user";

export const mDbAddUsers = async (db: Db, users: IUser[]) => {
  const usersCollection = db.collection("users");
  const result = await usersCollection.insertMany(users);
  return result;
};
