import { IEBikeComplete } from "../types/hangar";
import { IUser } from "../types/user";

export const mapOldToNewIdsInUsers = (newUsers: IUser[], newVehicles: IEBikeComplete[]) => {
  return newUsers.map((user) => {
    const userToReturn = {
      ...user,
      likedVehicles: user.v1LikedVehicles
        ?.map(
          (v1LikedVehicle) =>
            newVehicles.find((newVehicle) => newVehicle.v1Id === v1LikedVehicle)?._id
        )
        .filter((id) => Boolean(id)),
    };

    delete userToReturn.v1Id;
    delete userToReturn.v1LikedVehicles;

    return userToReturn;
  });
};
