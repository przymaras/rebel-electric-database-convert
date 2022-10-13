import { ObjectId } from "mongodb";
import { IEBikeComplete } from "../types/hangar";

export const getVehiclesWithNoImages = (vehicles: IEBikeComplete[]) => {
  return (vehicles.filter((vehicle) => vehicle.vehicleImages?.length === 0) ?? []).map(
    (vehicle) => ({ _id: vehicle._id as ObjectId, projectName: vehicle.projectName })
  );
};
