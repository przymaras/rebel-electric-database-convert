import { Db, ObjectId } from 'mongodb';

export const mDbAddLikedVehicleToUser = async (db: Db, vehicleId: string, userId: string) => {
  const usersCollection = db.collection('users');
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { likedVehicles: new ObjectId(vehicleId) } }
  );
  return result;
};
