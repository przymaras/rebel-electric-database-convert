import { Db } from "mongodb";
import { IEBikeComplete } from "../../../../../types/hangar";

export const mDbAddVehicles = async (db: Db, vehicles: IEBikeComplete[]) => {
  const vehiclesCollection = db.collection("vehicles");
  const result = await vehiclesCollection.insertMany(vehicles);
  return result;
};
