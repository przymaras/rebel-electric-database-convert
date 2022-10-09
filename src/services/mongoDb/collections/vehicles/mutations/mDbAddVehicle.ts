import type { Db } from 'mongodb';

import type { IAddEBike } from 'src/modules/hangar/types/hangar';

export const mDbAddVehicle = async (db: Db, vehicle: IAddEBike) => {
  const vehiclesCollection = db.collection('vehicles');
  const result = await vehiclesCollection.insertOne(vehicle);
  return result;
};
