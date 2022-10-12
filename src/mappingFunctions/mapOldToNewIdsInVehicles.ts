import { IEBikeComplete } from "../types/hangar";
import { IUser } from "../types/user";

export const mapOldToNewIdsInVehicles = (newUsers: IUser[], newVehicles: IEBikeComplete[]) => {
  return newVehicles.map((vehicle) => {
    const vehicleToReturn = {
      ...vehicle,
      likedUsers: vehicle.v1LikedUsers
        ?.map((v1LikedUser) => newUsers.find((newUser) => newUser.v1Id === v1LikedUser)?._id)
        .filter((id) => Boolean(id)),
      ownerId: newUsers.find((newUser) => newUser?.v1Id?.toString() === vehicle.v1OwnerId)?._id,
    };

    delete vehicleToReturn.v1Id;
    delete vehicleToReturn.v1LikedUsers;
    delete vehicleToReturn.v1OwnerId;

    return vehicleToReturn;
  });
};
